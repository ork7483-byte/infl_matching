import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateAqs } from "@/lib/aqs";
import {
  getFullBusinessDiscovery,
  calculateEngagementRate,
  isInstagramConfigured,
  mapMediaType,
} from "@/lib/instagram";

/**
 * POST /api/instagram/sync
 * Manual sync endpoint: fetches fresh Instagram data for a username,
 * upserts the influencer record, syncs media snapshots, and recalculates AQS.
 *
 * Body: { username: string }
 *
 * Requires authentication. Intended for admin/debugging use.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!isInstagramConfigured()) {
      return NextResponse.json(
        { error: "Instagram API is not configured" },
        { status: 503 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (
      typeof body !== "object" ||
      body === null ||
      typeof (body as Record<string, unknown>).username !== "string"
    ) {
      return NextResponse.json(
        { error: "username is required in request body" },
        { status: 400 }
      );
    }

    const username = ((body as Record<string, unknown>).username as string).trim().toLowerCase();
    if (!username) {
      return NextResponse.json({ error: "username must not be empty" }, { status: 400 });
    }

    const igData = await getFullBusinessDiscovery(username);
    if (!igData) {
      return NextResponse.json(
        { error: "Could not fetch Instagram data for this username" },
        { status: 404 }
      );
    }

    const engagementRate = calculateEngagementRate(igData.profile.followers_count, igData.media);
    const now = new Date();

    // Upsert influencer
    const influencer = await prisma.influencer.upsert({
      where: { username },
      update: {
        fullName: igData.profile.name,
        biography: igData.profile.biography,
        profilePicUrl: igData.profile.profile_picture_url,
        followersCount: igData.profile.followers_count,
        followingCount: igData.profile.follows_count,
        mediaCount: igData.profile.media_count,
        avgEngagementRate: engagementRate,
        lastSyncedAt: now,
      },
      create: {
        username,
        fullName: igData.profile.name,
        biography: igData.profile.biography,
        profilePicUrl: igData.profile.profile_picture_url,
        followersCount: igData.profile.followers_count,
        followingCount: igData.profile.follows_count,
        mediaCount: igData.profile.media_count,
        avgEngagementRate: engagementRate,
        categories: [],
        lastSyncedAt: now,
      },
      select: { id: true },
    });

    // Sync media snapshots
    let mediaSynced = 0;
    if (igData.media.length > 0) {
      const result = await prisma.mediaSnapshot.createMany({
        data: igData.media.map((m) => ({
          influencerId: influencer.id,
          igMediaId: m.id,
          mediaType: mapMediaType(m.media_type),
          caption: m.caption ?? null,
          likeCount: m.like_count ?? 0,
          commentsCount: m.comments_count ?? 0,
          permalink: m.permalink ?? null,
          thumbnailUrl: m.thumbnail_url ?? m.media_url ?? null,
          postedAt: new Date(m.timestamp),
          collectedAt: now,
        })),
        skipDuplicates: true,
      });
      mediaSynced = result.count;
    }

    // Recalculate AQS using latest DB data (includes newly synced snapshots)
    let aqsScore: number | null = null;
    try {
      const [followerHistory, mediaSnapshots, influencerFull] = await Promise.all([
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
        prisma.influencer.findUnique({
          where: { id: influencer.id },
          select: { followersCount: true, followingCount: true, avgEngagementRate: true },
        }),
      ]);

      if (influencerFull && mediaSnapshots.length > 0) {
        const result = calculateAqs({
          followersCount: influencerFull.followersCount,
          followingCount: influencerFull.followingCount,
          avgEngagementRate: influencerFull.avgEngagementRate ?? 0,
          followerHistory,
          mediaSnapshots,
        });

        const saved = await prisma.aqsScore.create({
          data: {
            influencerId: influencer.id,
            totalScore: result.totalScore,
            // 4-axis v2 fields
            engagementAuthenticity: result.engagementAuthenticity,
            audienceQuality: result.audienceQuality,
            contentConsistency: result.contentConsistency,
            commentQuality: result.commentQuality,
            // backward-compat fields
            engagementQuality: result.engagementQuality,
            growthPattern: result.growthPattern,
            ratioAnalysis: result.ratioAnalysis,
            commentAuthenticity: result.commentAuthenticity,
            signals: result.signals,
            grade: result.grade,
            label: result.label,
            modelVersion: "rule-v2",
          },
          select: { totalScore: true },
        });
        aqsScore = saved.totalScore;
      }
    } catch (aqsErr) {
      console.error("[sync] AQS recalculation failed:", aqsErr);
    }

    return NextResponse.json({
      ok: true,
      username,
      influencerId: influencer.id,
      mediaSynced,
      aqsScore,
      syncedAt: now.toISOString(),
    });
  } catch (error) {
    console.error("[POST /api/instagram/sync]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
