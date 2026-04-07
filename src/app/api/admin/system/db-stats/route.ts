import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const [
      userCount,
      brandCount,
      influencerCount,
      campaignCount,
      paymentCount,
      mediaSnapshotCount,
      followerHistoryCount,
      portfolioItemCount,
      pageVisitCount,
      aqsScoreCount,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.brand.count(),
      prisma.influencer.count(),
      prisma.campaign.count(),
      prisma.payment.count(),
      prisma.mediaSnapshot.count(),
      prisma.followerHistory.count(),
      prisma.portfolioItem.count(),
      prisma.pageVisit.count(),
      prisma.aqsScore.count(),
    ]);

    return NextResponse.json({
      tables: [
        { name: "User", count: userCount },
        { name: "Brand", count: brandCount },
        { name: "Influencer", count: influencerCount },
        { name: "Campaign", count: campaignCount },
        { name: "Payment", count: paymentCount },
        { name: "MediaSnapshot", count: mediaSnapshotCount },
        { name: "FollowerHistory", count: followerHistoryCount },
        { name: "PortfolioItem", count: portfolioItemCount },
        { name: "PageVisit", count: pageVisitCount },
        { name: "AqsScore", count: aqsScoreCount },
      ],
    });
  } catch (error) {
    console.error("[admin/system/db-stats]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
