import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { influencerId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { influencerId } = params;
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const [followerHistory, mediaSnapshots] = await Promise.all([
      prisma.followerHistory.findMany({
        where: {
          influencerId,
          recordedDate: { gte: ninetyDaysAgo },
        },
        orderBy: { recordedDate: "asc" },
      }),
      prisma.mediaSnapshot.findMany({
        where: {
          influencerId,
          postedAt: { gte: ninetyDaysAgo },
        },
        orderBy: { postedAt: "asc" },
      }),
    ]);

    // Daily follower data points
    const dailyFollowers = followerHistory.map((h) => ({
      date: h.recordedDate,
      followers: h.followersCount,
    }));

    // Weekly follower data (sample every 7th record, or group by week)
    const weeklyFollowers: { week: string; followers: number }[] = [];
    for (let i = 0; i < followerHistory.length; i += 7) {
      const entry = followerHistory[i];
      const weekLabel = entry.recordedDate.toISOString().slice(0, 10);
      weeklyFollowers.push({ week: weekLabel, followers: entry.followersCount });
    }

    // Monthly follower data
    const monthlyFollowerMap = new Map<string, number>();
    for (const h of followerHistory) {
      const monthKey = h.recordedDate.toISOString().slice(0, 7);
      monthlyFollowerMap.set(monthKey, h.followersCount);
    }
    const monthlyFollowers = Array.from(monthlyFollowerMap.entries()).map(
      ([month, followers]) => ({ month, followers })
    );

    // ER trend over time (per post)
    const erTrend = mediaSnapshots.map((m) => {
      const totalEngagements = m.likeCount + m.commentsCount;
      const er =
        m.reach && m.reach > 0
          ? (totalEngagements / m.reach) * 100
          : 0;
      return {
        date: m.postedAt,
        engagementRate: parseFloat(er.toFixed(2)),
      };
    });

    // Monthly post counts + avg engagement
    const monthlyPostMap = new Map<
      string,
      { count: number; totalEngagement: number }
    >();
    for (const m of mediaSnapshots) {
      const monthKey = m.postedAt.toISOString().slice(0, 7);
      const existing = monthlyPostMap.get(monthKey) ?? {
        count: 0,
        totalEngagement: 0,
      };
      existing.count += 1;
      existing.totalEngagement += m.likeCount + m.commentsCount;
      monthlyPostMap.set(monthKey, existing);
    }
    const monthlyPostStats = Array.from(monthlyPostMap.entries()).map(
      ([month, data]) => ({
        month,
        postCount: data.count,
        avgEngagement:
          data.count > 0
            ? parseFloat((data.totalEngagement / data.count).toFixed(2))
            : 0,
      })
    );

    // Top 5 performing posts by likes
    const topPosts = [...mediaSnapshots]
      .sort((a, b) => b.likeCount - a.likeCount)
      .slice(0, 5)
      .map((m) => ({
        igMediaId: m.igMediaId,
        thumbnailUrl: m.thumbnailUrl,
        permalink: m.permalink,
        likeCount: m.likeCount,
        commentsCount: m.commentsCount,
        postedAt: m.postedAt,
        mediaType: m.mediaType,
      }));

    // MoM growth rate (compare first and last monthly follower entry)
    let momGrowthRate: number | null = null;
    if (monthlyFollowers.length >= 2) {
      const oldest = monthlyFollowers[0].followers;
      const latest = monthlyFollowers[monthlyFollowers.length - 1].followers;
      if (oldest > 0) {
        momGrowthRate = parseFloat((((latest - oldest) / oldest) * 100).toFixed(2));
      }
    }

    return NextResponse.json({
      influencerId,
      dailyFollowers,
      weeklyFollowers,
      monthlyFollowers,
      erTrend,
      monthlyPostStats,
      topPosts,
      momGrowthRate,
    });
  } catch (error) {
    console.error("[GET /api/growth/[influencerId]]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
