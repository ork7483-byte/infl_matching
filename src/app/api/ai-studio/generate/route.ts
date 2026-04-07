import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const body = await request.json();
    const { modelId, contentType, settings, additionalPrompt, productImage } = body;

    if (!modelId || !contentType || !settings) {
      return NextResponse.json(
        { error: "modelId, contentType, and settings are required" },
        { status: 400 }
      );
    }

    // Find or create credit balance
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

    // Generate 4 mock result image URLs using picsum with deterministic seed
    const seed = `${userId}-${modelId}-${Date.now()}`;
    const resultImages = Array.from(
      { length: 4 },
      (_, i) => `https://picsum.photos/seed/${seed}-${i}/400/500`
    );

    // Create AIGeneration record
    const generation = await prisma.aIGeneration.create({
      data: {
        userId,
        modelId,
        contentType,
        settings,
        additionalPrompt: additionalPrompt ?? null,
        productImage: productImage ?? null,
        resultImages,
        creditsUsed: 1,
        status: "completed",
        isSample: false,
      },
    });

    // Deduct 1 credit: prefer bonus credits first, then monthly
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

    return NextResponse.json({ generation }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/ai-studio/generate]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
