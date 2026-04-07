import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const CREDIT_VALUE_KRW = 1000;
const CREATOR_SHARE_RATIO = 0.6;
const PLATFORM_SHARE_RATIO = 0.4;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string; role: string }).id;
    const role = (session.user as { id: string; role: string }).role;

    if (role !== "BRAND") {
      return NextResponse.json({ error: "Only brands can use AI clones" }, { status: 403 });
    }

    const body = await request.json();
    const { museId, contentType } = body;

    if (!museId || !contentType) {
      return NextResponse.json(
        { error: "museId and contentType are required" },
        { status: 400 }
      );
    }

    const clone = await prisma.aIMuse.findUnique({
      where: { id: museId },
    });

    if (!clone) {
      return NextResponse.json({ error: "AI clone not found" }, { status: 404 });
    }

    if (!clone.isPublic || clone.status !== "active") {
      return NextResponse.json({ error: "This AI clone is not available for use" }, { status: 400 });
    }

    // Check credit balance
    const now = new Date();
    const nextMonthReset = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    let creditBalance = await prisma.creditBalance.findUnique({
      where: { userId },
    });

    if (!creditBalance) {
      creditBalance = await prisma.creditBalance.create({
        data: {
          userId,
          monthlyCredits: 3,
          bonusCredits: 0,
          usedThisMonth: 0,
          resetDate: nextMonthReset,
        },
      });
    }

    // Reset monthly credits if past reset date
    if (creditBalance.resetDate <= now) {
      creditBalance = await prisma.creditBalance.update({
        where: { userId },
        data: {
          usedThisMonth: 0,
          resetDate: nextMonthReset,
        },
      });
    }

    const availableCredits =
      creditBalance.monthlyCredits - creditBalance.usedThisMonth + creditBalance.bonusCredits;

    if (availableCredits <= 0) {
      return NextResponse.json(
        { error: "Insufficient credits", availableCredits: 0 },
        { status: 402 }
      );
    }

    // Deduct 1 credit (bonus first, then monthly)
    const newBonusCredits = Math.max(0, creditBalance.bonusCredits - 1);
    const bonusDeducted = creditBalance.bonusCredits - newBonusCredits;
    const monthlyDeducted = 1 - bonusDeducted;

    await prisma.creditBalance.update({
      where: { userId },
      data: {
        bonusCredits: newBonusCredits,
        usedThisMonth: creditBalance.usedThisMonth + monthlyDeducted,
      },
    });

    // Create MuseUsageLog
    await prisma.museUsageLog.create({
      data: {
        museId,
        brandUserId: userId,
        contentType,
        creditsUsed: 1,
      },
    });

    // Calculate revenue split
    const totalAmount = CREDIT_VALUE_KRW;
    const creatorShare = totalAmount * CREATOR_SHARE_RATIO;
    const platformShare = totalAmount * PLATFORM_SHARE_RATIO;

    // Create MuseRevenue
    await prisma.museRevenue.create({
      data: {
        museId,
        influencerId: clone.influencerId,
        brandUserId: userId,
        totalAmount,
        creatorShare,
        platformShare,
        status: "pending",
      },
    });

    // Update clone stats
    await prisma.aIMuse.update({
      where: { id: museId },
      data: {
        totalUsageCount: { increment: 1 },
        totalEarnings: { increment: creatorShare },
      },
    });

    // Generate 4 mock result images
    const seed = `${museId}-${userId}-${Date.now()}`;
    const generatedImages = Array.from(
      { length: 4 },
      (_, i) => `https://picsum.photos/seed/${seed}-${i}/400/500`
    );

    return NextResponse.json({
      success: true,
      generatedImages,
      creditsUsed: 1,
      remainingCredits: availableCredits - 1,
    });
  } catch (error) {
    console.error("[POST /api/ai-muse/use]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
