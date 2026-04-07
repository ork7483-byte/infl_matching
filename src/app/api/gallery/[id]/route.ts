import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const isAuthenticated = !!session;

    const item = await prisma.portfolioItem.findUnique({
      where: { id: params.id },
      include: {
        influencer: {
          select: {
            id: true,
            username: true,
            fullName: true,
            profilePicUrl: true,
            followersCount: true,
            biography: true,
            categories: true,
            avgEngagementRate: true,
            aqsScores: {
              orderBy: { calculatedAt: "desc" },
              take: 1,
              select: {
                totalScore: true,
                engagementQuality: true,
                growthPattern: true,
                ratioAnalysis: true,
                contentConsistency: true,
                commentAuthenticity: true,
                calculatedAt: true,
              },
            },
          },
        },
      },
    });

    if (!item) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 });
    }

    const relatedItems = await prisma.portfolioItem.findMany({
      where: {
        influencerId: item.influencerId,
        id: { not: item.id },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        mediaType: true,
        thumbnailUrl: true,
        mediaUrl: true,
        caption: true,
        likeCount: true,
        commentsCount: true,
        postedAt: true,
        createdAt: true,
      },
    });

    const latestAqs = item.influencer.aqsScores[0] ?? null;

    if (!isAuthenticated) {
      return NextResponse.json({
        id: item.id,
        mediaType: item.mediaType,
        mediaUrl: item.mediaUrl,
        thumbnailUrl: item.thumbnailUrl,
        caption: item.caption,
        likeCount: item.likeCount,
        commentsCount: item.commentsCount,
        reach: null,
        impressions: null,
        saved: null,
        engagementRate: null,
        campaignName: item.campaignName,
        brandName: item.brandName,
        category: item.category,
        isFeatured: item.isFeatured,
        postedAt: item.postedAt,
        createdAt: item.createdAt,
        influencer: {
          id: item.influencer.id,
          username: item.influencer.username,
          fullName: item.influencer.fullName,
          profilePicUrl: item.influencer.profilePicUrl,
          followersCount: item.influencer.followersCount,
          biography: item.influencer.biography,
          categories: item.influencer.categories,
          avgEngagementRate: null,
          aqsScore: null,
        },
        relatedItems,
        _blurred: true,
      });
    }

    return NextResponse.json({
      id: item.id,
      mediaType: item.mediaType,
      mediaUrl: item.mediaUrl,
      thumbnailUrl: item.thumbnailUrl,
      caption: item.caption,
      likeCount: item.likeCount,
      commentsCount: item.commentsCount,
      reach: item.reach,
      impressions: item.impressions,
      engagementRate: item.engagementRate,
      campaignName: item.campaignName,
      brandName: item.brandName,
      category: item.category,
      isFeatured: item.isFeatured,
      postedAt: item.postedAt,
      createdAt: item.createdAt,
      influencer: {
        id: item.influencer.id,
        username: item.influencer.username,
        fullName: item.influencer.fullName,
        profilePicUrl: item.influencer.profilePicUrl,
        followersCount: item.influencer.followersCount,
        biography: item.influencer.biography,
        categories: item.influencer.categories,
        avgEngagementRate: item.influencer.avgEngagementRate,
        aqsScore: latestAqs,
      },
      relatedItems,
    });
  } catch (error) {
    console.error("[GET /api/gallery/[id]]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
