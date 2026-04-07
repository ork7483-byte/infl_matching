import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { influencerId: string } }
) {
  try {
    const { influencerId } = params;
    const { searchParams } = request.nextUrl;
    const isPublicShare = searchParams.get("public") === "true";

    if (!isPublicShare) {
      const session = await getServerSession(authOptions);
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const influencer = await prisma.influencer.findUnique({
      where: { id: influencerId },
      select: {
        id: true,
        username: true,
        fullName: true,
        biography: true,
        profilePicUrl: true,
        followersCount: true,
        followingCount: true,
        mediaCount: true,
        categories: true,
        avgEngagementRate: true,
        isOauthConnected: true,
        lastSyncedAt: true,
      },
    });

    if (!influencer) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }

    const [audienceDemographics, mediaSnapshots, latestAqs] = await Promise.all([
      prisma.audienceDemographic.findMany({
        where: { influencerId },
        orderBy: { collectedAt: "desc" },
      }),
      prisma.mediaSnapshot.findMany({
        where: { influencerId },
        orderBy: { likeCount: "desc" },
        take: 6,
        select: {
          id: true,
          igMediaId: true,
          mediaType: true,
          caption: true,
          likeCount: true,
          commentsCount: true,
          reach: true,
          impressions: true,
          permalink: true,
          thumbnailUrl: true,
          postedAt: true,
        },
      }),
      prisma.aqsScore.findFirst({
        where: { influencerId },
        orderBy: { calculatedAt: "desc" },
        select: {
          totalScore: true,
          engagementQuality: true,
          growthPattern: true,
          ratioAnalysis: true,
          contentConsistency: true,
          commentAuthenticity: true,
          calculatedAt: true,
        },
      }),
    ]);

    // Deduplicate demographics: keep the latest entry per breakdownType+breakdownKey
    const latestDemographicsMap = new Map<
      string,
      { breakdownType: string; breakdownKey: string; value: number }
    >();
    for (const d of audienceDemographics) {
      const key = `${d.breakdownType}__${d.breakdownKey}`;
      if (!latestDemographicsMap.has(key)) {
        latestDemographicsMap.set(key, {
          breakdownType: d.breakdownType,
          breakdownKey: d.breakdownKey,
          value: d.value,
        });
      }
    }

    // Group demographics by breakdownType
    const demographicsByType: Record<
      string,
      { key: string; value: number }[]
    > = {};
    for (const d of Array.from(latestDemographicsMap.values())) {
      if (!demographicsByType[d.breakdownType]) {
        demographicsByType[d.breakdownType] = [];
      }
      demographicsByType[d.breakdownType].push({
        key: d.breakdownKey,
        value: d.value,
      });
    }

    const topPosts = mediaSnapshots.map((m) => {
      const totalEngagements = m.likeCount + m.commentsCount;
      const er =
        m.reach && m.reach > 0
          ? parseFloat(((totalEngagements / m.reach) * 100).toFixed(2))
          : null;
      return { ...m, engagementRate: er };
    });

    return NextResponse.json({
      influencer,
      audienceDemographics: demographicsByType,
      topPosts,
      aqsScore: latestAqs,
    });
  } catch (error) {
    console.error("[GET /api/mediakit/[influencerId]]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
