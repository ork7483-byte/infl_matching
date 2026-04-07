import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const isAuthenticated = !!session;

    const { searchParams } = request.nextUrl;
    const category = searchParams.get("category");
    const contentType = searchParams.get("content_type");
    const sortBy = searchParams.get("sort_by") ?? "latest";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));

    const where: Prisma.PortfolioItemWhereInput = {};

    if (category) {
      where.category = category;
    }

    if (contentType) {
      const validTypes = ["IMAGE", "VIDEO", "REEL", "CAROUSEL_ALBUM"] as const;
      type ValidMediaType = typeof validTypes[number];
      if (validTypes.includes(contentType as ValidMediaType)) {
        where.mediaType = contentType as ValidMediaType;
      }
    }

    type OrderByInput = Prisma.PortfolioItemOrderByWithRelationInput;
    const orderByMap: Record<string, OrderByInput> = {
      latest: { createdAt: "desc" },
      reach: { reach: { sort: "desc", nulls: "last" } },
      engagement_rate: { engagementRate: { sort: "desc", nulls: "last" } },
      likes: { likeCount: "desc" },
    };
    const orderBy: OrderByInput = orderByMap[sortBy] ?? orderByMap.latest;

    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      prisma.portfolioItem.count({ where }),
      prisma.portfolioItem.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          influencer: {
            select: {
              username: true,
              fullName: true,
              profilePicUrl: true,
              followersCount: true,
              aqsScores: {
                orderBy: { calculatedAt: "desc" },
                take: 1,
                select: { totalScore: true, calculatedAt: true },
              },
            },
          },
        },
      }),
    ]);

    const results = items.map((item) => {
      const latestAqs = item.influencer.aqsScores[0] ?? null;

      if (!isAuthenticated) {
        return {
          id: item.id,
          mediaType: item.mediaType,
          mediaUrl: item.mediaUrl,
          thumbnailUrl: item.thumbnailUrl,
          caption: item.caption,
          likeCount: item.likeCount,
          commentsCount: item.commentsCount,
          reach: null,
          impressions: null,
          engagementRate: null,
          campaignName: item.campaignName,
          brandName: item.brandName,
          category: item.category,
          isFeatured: item.isFeatured,
          postedAt: item.postedAt,
          createdAt: item.createdAt,
          influencer: {
            username: item.influencer.username,
            fullName: item.influencer.fullName,
            profilePicUrl: item.influencer.profilePicUrl,
            followersCount: item.influencer.followersCount,
          },
          aqsScore: null,
          _blurred: true,
        };
      }

      return {
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
          username: item.influencer.username,
          fullName: item.influencer.fullName,
          profilePicUrl: item.influencer.profilePicUrl,
          followersCount: item.influencer.followersCount,
        },
        aqsScore: latestAqs,
      };
    });

    return NextResponse.json({ total, page, results, _blurred: !isAuthenticated });
  } catch (error) {
    console.error("[GET /api/gallery]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
