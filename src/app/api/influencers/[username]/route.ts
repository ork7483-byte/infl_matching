import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const isAuthenticated = !!session;

    const influencer = await prisma.influencer.findUnique({
      where: { username: params.username },
      include: {
        aqsScores: {
          orderBy: { calculatedAt: "desc" },
          take: 1,
        },
        pricePredictions: {
          orderBy: { calculatedAt: "desc" },
          take: 1,
        },
        mediaSnapshots: {
          orderBy: { postedAt: "desc" },
          take: isAuthenticated ? 6 : 3,
        },
      },
    });

    if (!influencer) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }

    const latestAqs = influencer.aqsScores[0] ?? null;
    const latestPrice = influencer.pricePredictions[0] ?? null;

    if (!isAuthenticated) {
      return NextResponse.json({
        id: influencer.id,
        username: influencer.username,
        fullName: influencer.fullName,
        biography: influencer.biography,
        profilePicUrl: influencer.profilePicUrl,
        followersCount: influencer.followersCount,
        followingCount: influencer.followingCount,
        mediaCount: influencer.mediaCount,
        categories: influencer.categories,
        isOauthConnected: influencer.isOauthConnected,
        createdAt: influencer.createdAt,
        updatedAt: influencer.updatedAt,
        avgEngagementRate: null,
        aqsScore: null,
        audienceData: null,
        pricePrediction: null,
        mediaSnapshots: influencer.mediaSnapshots.map((m) => ({
          id: m.id,
          igMediaId: m.igMediaId,
          mediaType: m.mediaType,
          caption: m.caption,
          thumbnailUrl: m.thumbnailUrl,
          permalink: m.permalink,
          postedAt: m.postedAt,
          likeCount: null,
          commentsCount: null,
        })),
      });
    }

    return NextResponse.json({
      id: influencer.id,
      username: influencer.username,
      fullName: influencer.fullName,
      biography: influencer.biography,
      profilePicUrl: influencer.profilePicUrl,
      followersCount: influencer.followersCount,
      followingCount: influencer.followingCount,
      mediaCount: influencer.mediaCount,
      categories: influencer.categories,
      avgEngagementRate: influencer.avgEngagementRate,
      isOauthConnected: influencer.isOauthConnected,
      lastSyncedAt: influencer.lastSyncedAt,
      createdAt: influencer.createdAt,
      updatedAt: influencer.updatedAt,
      aqsScore: latestAqs,
      pricePrediction: latestPrice,
      mediaSnapshots: influencer.mediaSnapshots,
    });
  } catch (error) {
    console.error("[GET /api/influencers/[username]]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
