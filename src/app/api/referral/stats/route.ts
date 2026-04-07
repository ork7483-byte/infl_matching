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

    const userId = (session.user as { id: string }).id;

    const referrals = await prisma.referral.findMany({
      where: { referrerId: userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        referralCode: true,
        status: true,
        rewardGiven: true,
        createdAt: true,
        completedAt: true,
      },
    });

    const totalReferrals = referrals.length;
    const completedReferrals = referrals.filter((r) => r.status === "completed").length;
    const pendingReferrals = referrals.filter((r) => r.status === "pending").length;
    const rewardsEarned = referrals.filter((r) => r.rewardGiven).length;

    return NextResponse.json({
      totalReferrals,
      completedReferrals,
      pendingReferrals,
      rewardsEarned,
      referrals: referrals.map((r) => ({
        id: r.id,
        code: r.referralCode,
        status: r.status,
        rewardGiven: r.rewardGiven,
        createdAt: r.createdAt,
        completedAt: r.completedAt,
      })),
    });
  } catch (error) {
    console.error("[GET /api/referral/stats]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
