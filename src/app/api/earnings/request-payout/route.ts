import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const userRole = (session.user as { role: string }).role;

    if (userRole !== "CREATOR") {
      return NextResponse.json(
        { error: "Only creators can request payouts" },
        { status: 403 }
      );
    }

    const influencer = await prisma.influencer.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!influencer) {
      return NextResponse.json({ error: "Influencer profile not found" }, { status: 404 });
    }

    const pendingPayments = await prisma.payment.findMany({
      where: {
        influencerId: influencer.id,
        status: "PENDING",
      },
      select: { id: true },
    });

    if (pendingPayments.length === 0) {
      return NextResponse.json(
        { error: "No pending payments found" },
        { status: 400 }
      );
    }

    const pendingIds = pendingPayments.map((p) => p.id);

    await prisma.payment.updateMany({
      where: { id: { in: pendingIds } },
      data: { status: "PROCESSING" },
    });

    return NextResponse.json({
      success: true,
      updatedCount: pendingIds.length,
      message: `${pendingIds.length} payment(s) moved to processing`,
    });
  } catch (error) {
    console.error("[POST /api/earnings/request-payout]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
