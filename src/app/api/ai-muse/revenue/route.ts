import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string; role: string }).id;
    const role = (session.user as { id: string; role: string }).role;

    if (role !== "CREATOR") {
      return NextResponse.json({ error: "Only creators can view revenue" }, { status: 403 });
    }

    const influencer = await prisma.influencer.findUnique({
      where: { userId },
    });

    if (!influencer) {
      return NextResponse.json({ error: "Influencer profile not found" }, { status: 404 });
    }

    const revenues = await prisma.museRevenue.findMany({
      where: { influencerId: influencer.id },
      orderBy: { createdAt: "desc" },
    });

    const totalEarnings = revenues.reduce((sum, r) => sum + r.creatorShare, 0);
    const pendingAmount = revenues
      .filter((r) => r.status === "pending" || r.status === "processing")
      .reduce((sum, r) => sum + r.creatorShare, 0);
    const completedAmount = revenues
      .filter((r) => r.status === "completed")
      .reduce((sum, r) => sum + r.creatorShare, 0);

    return NextResponse.json({
      totalEarnings,
      pendingAmount,
      completedAmount,
      transactions: revenues,
    });
  } catch (error) {
    console.error("[GET /api/ai-muse/revenue]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
