import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateIGR, type Post } from "@/lib/igr";
import { isInstagramConfigured } from "@/lib/instagram";

const IGR_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

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

    let latestIgr = await prisma.igrScore.findFirst({
      where: { influencerId: influencer.id },
      orderBy: { calculatedAt: "desc" },
    });

    const igrIsStale =
      !latestIgr ||
      Date.now() - latestIgr.calculatedAt.getTime() > IGR_TTL_MS;

    if (igrIsStale && isInstagramConfigured()) {
      try {
        const [influencerData, mediaSnapshots] = await Promise.all([
          prisma.influencer.findUnique({
            where: { id: influencer.id },
            select: { followersCount: true },
          }),
          prisma.mediaSnapshot.findMany({
            where: { influencerId: influencer.id },
            orderBy: { postedAt: "desc" },
            take: 24,
            select: {
              likeCount: true,
              commentsCount: true,
              mediaType: true,
              caption: true,
              postedAt: true,
              reach: true,
            },
          }),
        ]);

        if (influencerData && mediaSnapshots.length > 0) {
          const posts: Post[] = mediaSnapshots.map((m) => ({
            like_count: m.likeCount,
            comments_count: m.commentsCount,
            media_type: m.mediaType,
            caption: m.caption ?? undefined,
            timestamp: m.postedAt.toISOString(),
            view_count: m.reach ?? undefined,
          }));

          const result = calculateIGR({
            posts,
            followers: influencerData.followersCount,
          });

          latestIgr = await prisma.igrScore.create({
            data: {
              influencerId: influencer.id,
              totalScore: result.score,
              reelsPerformance: result.details.reelsPerformance,
              engagementQuality: result.details.engagementQuality,
              contentStrategy: result.details.contentStrategy,
              growthMomentum: result.details.growthMomentum,
              grade: result.grade,
              label: result.label,
              modelVersion: "rule-v1",
            },
          });
        }
      } catch (calcErr) {
        console.error("[igr] Recalculation failed:", calcErr);
        // latestIgr remains as-is; fall through gracefully
      }
    }

    if (!latestIgr) {
      return NextResponse.json({ data: null });
    }

    if (!isAuthenticated) {
      // Non-authenticated users get grade only
      return NextResponse.json({
        data: {
          grade: latestIgr.grade,
          label: latestIgr.label,
        },
        _blurred: true,
      });
    }

    return NextResponse.json({ data: latestIgr });
  } catch (error) {
    console.error("[GET /api/influencers/[username]/igr]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
