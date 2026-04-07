import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  getFullBusinessDiscovery,
  calculateEngagementRate,
  isInstagramConfigured,
} from "@/lib/instagram";

export async function GET(request: NextRequest) {
  try {
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
        mediaSnapshots: {
          orderBy: { postedAt: "desc" },
          take: 24,
          select: {
            likeCount: true,
            commentsCount: true,
          },
        },
      },
    });

    if (!influencer) {
      // Fallback: try fetching directly from Instagram API
      if (isInstagramConfigured()) {
        try {
          const igData = await getFullBusinessDiscovery(username);
          if (igData) {
            const er = calculateEngagementRate(igData.profile.followers_count, igData.media);
            const grade = er > 5 ? "높음" : er >= 2 ? "보통" : "낮음";
            return NextResponse.json({
              username,
              engagementRate: er,
              grade,
              followersCount: igData.profile.followers_count,
              postsAnalyzed: igData.media.length,
              source: "instagram_api",
            });
          }
        } catch (igErr) {
          console.error("[engagement-rate] Instagram fallback failed:", igErr);
        }
      }
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }

    const snapshots = influencer.mediaSnapshots;
    const followersCount = influencer.followersCount;

    let engagementRate = 0;

    if (snapshots.length > 0 && followersCount > 0) {
      const avgLikes = snapshots.reduce((sum, s) => sum + s.likeCount, 0) / snapshots.length;
      const avgComments = snapshots.reduce((sum, s) => sum + s.commentsCount, 0) / snapshots.length;
      engagementRate = ((avgLikes + avgComments) / followersCount) * 100;
    }

    let grade: string;
    if (engagementRate > 5) {
      grade = "높음";
    } else if (engagementRate >= 2) {
      grade = "보통";
    } else {
      grade = "낮음";
    }

    return NextResponse.json({
      username: influencer.username,
      engagementRate: parseFloat(engagementRate.toFixed(4)),
      grade,
      followersCount,
      postsAnalyzed: snapshots.length,
      source: "database",
    });
  } catch (error) {
    console.error("[GET /api/tools/engagement-rate]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
