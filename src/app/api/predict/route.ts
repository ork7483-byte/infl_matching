import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculatePrediction } from "@/lib/prediction";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { username, contentType } = body;

    if (!username) {
      return NextResponse.json({ error: "username is required" }, { status: 400 });
    }

    if (!contentType) {
      return NextResponse.json({ error: "contentType is required" }, { status: 400 });
    }

    const influencer = await prisma.influencer.findUnique({
      where: { username },
      include: {
        aqsScores: {
          orderBy: { calculatedAt: "desc" },
          take: 1,
        },
      },
    });

    if (!influencer) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }

    const latestAqs = influencer.aqsScores[0] ?? null;

    const prediction = calculatePrediction({
      followersCount: influencer.followersCount,
      avgEngagementRate: influencer.avgEngagementRate ?? 0,
      categories: influencer.categories,
      contentType: contentType as "FEED" | "REEL" | "STORY",
      aqsScore: latestAqs?.totalScore ?? undefined,
    });

    return NextResponse.json({
      influencer: {
        id: influencer.id,
        username: influencer.username,
        fullName: influencer.fullName,
        followersCount: influencer.followersCount,
        avgEngagementRate: influencer.avgEngagementRate,
        categories: influencer.categories,
      },
      aqsScore: latestAqs
        ? { totalScore: latestAqs.totalScore, calculatedAt: latestAqs.calculatedAt }
        : null,
      prediction,
    });
  } catch (error) {
    console.error("[POST /api/predict]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
