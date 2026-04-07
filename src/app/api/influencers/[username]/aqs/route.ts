import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateAqs } from "@/lib/aqs";
import { isInstagramConfigured } from "@/lib/instagram";

const AQS_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function getAqsGradeColor(score: number): string {
  if (score >= 75) return "green";
  if (score >= 50) return "yellow";
  if (score >= 25) return "orange";
  return "red";
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const isAuthenticated = !!session;

    const influencer = await prisma.influencer.findUnique({
      where: { username: params.username },
      select: { id: true },
    });

    if (!influencer) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }

    let latestAqs = await prisma.aqsScore.findFirst({
      where: { influencerId: influencer.id },
      orderBy: { calculatedAt: "desc" },
    });

    // Recalculate AQS when stale or absent, provided sufficient data exists
    const aqsIsStale =
      !latestAqs ||
      Date.now() - latestAqs.calculatedAt.getTime() > AQS_TTL_MS;

    if (aqsIsStale && isInstagramConfigured()) {
      try {
        const [influencerData, followerHistory, mediaSnapshots] = await Promise.all([
          prisma.influencer.findUnique({
            where: { id: influencer.id },
            select: {
              followersCount: true,
              followingCount: true,
              avgEngagementRate: true,
            },
          }),
          prisma.followerHistory.findMany({
            where: { influencerId: influencer.id },
            orderBy: { recordedDate: "asc" },
            select: { followersCount: true, recordedDate: true },
          }),
          prisma.mediaSnapshot.findMany({
            where: { influencerId: influencer.id },
            orderBy: { postedAt: "desc" },
            take: 24,
            select: { likeCount: true, commentsCount: true, caption: true },
          }),
        ]);

        if (influencerData && mediaSnapshots.length > 0) {
          const result = calculateAqs({
            followersCount: influencerData.followersCount,
            followingCount: influencerData.followingCount,
            avgEngagementRate: influencerData.avgEngagementRate ?? 0,
            followerHistory,
            mediaSnapshots,
          });

          latestAqs = await prisma.aqsScore.create({
            data: {
              influencerId: influencer.id,
              totalScore: result.totalScore,
              engagementQuality: result.engagementQuality,
              growthPattern: result.growthPattern,
              ratioAnalysis: result.ratioAnalysis,
              contentConsistency: result.contentConsistency,
              commentAuthenticity: result.commentAuthenticity,
              signals: result.signals,
              modelVersion: "rule-v1",
            },
          });
        }
      } catch (calcErr) {
        console.error("[aqs] Recalculation failed:", calcErr);
        // latestAqs remains as-is (possibly null); fall through gracefully
      }
    }

    if (!latestAqs) {
      return NextResponse.json({ data: null });
    }

    if (!isAuthenticated) {
      return NextResponse.json({
        data: {
          gradeColor: getAqsGradeColor(latestAqs.totalScore),
        },
        _blurred: true,
      });
    }

    return NextResponse.json({ data: latestAqs });
  } catch (error) {
    console.error("[GET /api/influencers/[username]/aqs]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
