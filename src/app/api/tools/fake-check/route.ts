import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { detectFakeFollowers } from "@/lib/fake-detection";
import {
  getFullBusinessDiscovery,
  calculateEngagementRate,
  isInstagramConfigured,
} from "@/lib/instagram";

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
      // Fallback: attempt basic check using live Instagram data.
      // No follower history is available, so growth-pattern signals will be
      // absent — the caller sees source:"instagram_api" to indicate this.
      if (isInstagramConfigured()) {
        try {
          const igData = await getFullBusinessDiscovery(username);
          if (igData) {
            const er = calculateEngagementRate(igData.profile.followers_count, igData.media);
            const basicResult = detectFakeFollowers({
              followersCount: igData.profile.followers_count,
              followingCount: igData.profile.follows_count,
              avgEngagementRate: er,
              followerHistory: [], // no history available from public API
              mediaSnapshots: igData.media.map((m) => ({
                likeCount: m.like_count ?? 0,
                commentsCount: m.comments_count ?? 0,
                caption: m.caption ?? null,
              })),
            });
            const grade = riskScoreToGrade(basicResult.riskScore);
            const detectedSignals = basicResult.signals.filter((s) => s.detected);
            const summary =
              detectedSignals.length === 0
                ? "팔로워 품질이 양호합니다."
                : `${detectedSignals.length}개의 이상 신호가 감지되었습니다: ${detectedSignals.map((s) => s.name).join(", ")}`;

            const base = {
              username,
              grade,
              summary,
              signalCount: detectedSignals.length,
              riskScore: basicResult.riskScore,
              source: "instagram_api",
              note: "팔로워 히스토리 없음 — 성장 패턴 신호 제외됨",
            };
            if (!isAuthenticated) {
              return NextResponse.json({ ...base, _blurred: true });
            }
            return NextResponse.json({ ...base, signals: basicResult.signals });
          }
        } catch (igErr) {
          console.error("[fake-check] Instagram fallback failed:", igErr);
        }
      }
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
        source: "database",
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
      source: "database",
    });
  } catch (error) {
    console.error("[GET /api/tools/fake-check]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
