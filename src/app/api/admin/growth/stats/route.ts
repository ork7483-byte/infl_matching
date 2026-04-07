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

    const userRole = (session.user as { role: string }).role;
    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const [
      totalCreators,
      igConnectedCreators,
      mediakitCount,
      shareCount,
      referralCount,
      // Trend: previous 30-day window
      prevShareCount,
      prevReferralCount,
      prevIgConnected,
    ] = await Promise.all([
      prisma.influencer.count(),
      prisma.influencer.count({ where: { isOauthConnected: true } }),
      // mediakit = influencers with portfolio items
      prisma.portfolioItem.count(),
      prisma.shareAction.count(),
      prisma.referral.count(),
      prisma.shareAction.count({
        where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
      }),
      prisma.referral.count({
        where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
      }),
      prisma.influencer.count({
        where: {
          isOauthConnected: true,
          updatedAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
        },
      }),
    ]);

    const igConnectionRate =
      totalCreators > 0
        ? parseFloat(((igConnectedCreators / totalCreators) * 100).toFixed(1))
        : 0;

    const currentShareCount30d = await prisma.shareAction.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    });
    const currentReferralCount30d = await prisma.referral.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    });
    const currentIgConnected30d = await prisma.influencer.count({
      where: { isOauthConnected: true, updatedAt: { gte: thirtyDaysAgo } },
    });

    const pctChange = (current: number, prev: number) =>
      prev === 0 ? null : parseFloat((((current - prev) / prev) * 100).toFixed(1));

    return NextResponse.json({
      igConnectionRate,
      igConnectedCreators,
      totalCreators,
      mediakitCount,
      shareCount,
      referralCount,
      trends: {
        igConnectionRate30d: pctChange(currentIgConnected30d, prevIgConnected),
        shareCount30d: pctChange(currentShareCount30d, prevShareCount),
        referralCount30d: pctChange(currentReferralCount30d, prevReferralCount),
      },
    });
  } catch (error) {
    console.error("[GET /api/admin/growth/stats]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
