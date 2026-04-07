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
    const minFollowers = searchParams.get("minFollowers");
    const maxFollowers = searchParams.get("maxFollowers");
    const categories = searchParams.get("categories");
    const minEngagementRate = searchParams.get("minEngagementRate");
    const sortBy = searchParams.get("sortBy") ?? "followers";
    const sortOrder = (searchParams.get("sortOrder") ?? "desc") as "asc" | "desc";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));

    const where: Prisma.InfluencerWhereInput = {};

    if (minFollowers || maxFollowers) {
      where.followersCount = {};
      if (minFollowers) where.followersCount.gte = parseInt(minFollowers, 10);
      if (maxFollowers) where.followersCount.lte = parseInt(maxFollowers, 10);
    }

    if (categories) {
      const categoryList = categories.split(",").map((c) => c.trim()).filter(Boolean);
      if (categoryList.length > 0) {
        where.categories = { hasSome: categoryList };
      }
    }

    if (minEngagementRate) {
      where.avgEngagementRate = { gte: parseFloat(minEngagementRate) };
    }

    const orderByField: Prisma.InfluencerOrderByWithRelationInput =
      sortBy === "engagement"
        ? { avgEngagementRate: sortOrder }
        : { followersCount: sortOrder };

    const effectiveLimit = isAuthenticated ? limit : Math.min(limit, 5);
    const skip = (page - 1) * limit;

    const [influencers, total] = await Promise.all([
      prisma.influencer.findMany({
        where,
        orderBy: orderByField,
        skip,
        take: effectiveLimit,
        select: {
          id: true,
          username: true,
          fullName: true,
          profilePicUrl: true,
          followersCount: true,
          followingCount: true,
          mediaCount: true,
          categories: true,
          avgEngagementRate: true,
          isOauthConnected: true,
          createdAt: true,
          aqsScores: {
            orderBy: { calculatedAt: "desc" },
            take: 1,
            select: {
              id: true,
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
      }),
      prisma.influencer.count({ where }),
    ]);

    const results = influencers.map((inf) => {
      const latestAqs = inf.aqsScores[0] ?? null;

      if (!isAuthenticated) {
        return {
          id: inf.id,
          username: inf.username,
          fullName: inf.fullName,
          profilePicUrl: inf.profilePicUrl,
          followersCount: inf.followersCount,
          followingCount: inf.followingCount,
          mediaCount: inf.mediaCount,
          categories: inf.categories,
          isOauthConnected: inf.isOauthConnected,
          createdAt: inf.createdAt,
          avgEngagementRate: null,
          aqsScore: null,
          _blurred: true,
        };
      }

      return {
        id: inf.id,
        username: inf.username,
        fullName: inf.fullName,
        profilePicUrl: inf.profilePicUrl,
        followersCount: inf.followersCount,
        followingCount: inf.followingCount,
        mediaCount: inf.mediaCount,
        categories: inf.categories,
        avgEngagementRate: inf.avgEngagementRate,
        isOauthConnected: inf.isOauthConnected,
        createdAt: inf.createdAt,
        aqsScore: latestAqs,
      };
    });

    return NextResponse.json({ results, total, page, limit: effectiveLimit });
  } catch (error) {
    console.error("[GET /api/influencers/search]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
