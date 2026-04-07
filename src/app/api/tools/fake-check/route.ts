import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { detectFakeFollowers } from "@/lib/fake-detection";

function riskScoreToGrade(riskScore: number): string {
  if (riskScore <= 25) return "🟢";
  if (riskScore <= 50) return "🟡";
  if (riskScore <= 75) return "🟠";
  return "🔴";
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const isAuthenticated = !!session;

    const { searchParams } = request.nextUrl;
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ error: "username query parameter is required" }, { status: 400 });
    }

    const influencer = await prisma.influencer.findUnique({
      where: { username },
      select: {
        username: true,
        followersCount: true,
        followingCount: true,
        avgEngagementRate: true,
        followerHistory: {
          orderBy: { recordedDate: "asc" },
          select: {
            followersCount: true,
            recordedDate: true,
          },
        },
        mediaSnapshots: {
          orderBy: { postedAt: "desc" },
          take: 24,
          select: {
            likeCount: true,
            commentsCount: true,
            caption: true,
          },
        },
      },
    });

    if (!influencer) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }

    const result = detectFakeFollowers({
      followersCount: influencer.followersCount,
      followingCount: influencer.followingCount,
      avgEngagementRate: influencer.avgEngagementRate ?? 0,
      followerHistory: influencer.followerHistory.map((h) => ({
        followersCount: h.followersCount,
        recordedDate: h.recordedDate,
      })),
      mediaSnapshots: influencer.mediaSnapshots,
    });

    const grade = riskScoreToGrade(result.riskScore);
    const detectedSignals = result.signals.filter((s) => s.detected);
    const summary =
      detectedSignals.length === 0
        ? "팔로워 품질이 양호합니다."
        : `${detectedSignals.length}개의 이상 신호가 감지되었습니다: ${detectedSignals.map((s) => s.name).join(", ")}`;

    if (!isAuthenticated) {
      return NextResponse.json({
        username: influencer.username,
        grade,
        summary,
        signalCount: detectedSignals.length,
        riskScore: result.riskScore,
        _blurred: true,
      });
    }

    return NextResponse.json({
      username: influencer.username,
      grade,
      summary,
      signalCount: detectedSignals.length,
      riskScore: result.riskScore,
      signals: result.signals,
    });
  } catch (error) {
    console.error("[GET /api/tools/fake-check]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
