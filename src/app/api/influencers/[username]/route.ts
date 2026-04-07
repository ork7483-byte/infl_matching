import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getFullBusinessDiscovery,
  calculateEngagementRate,
  isInstagramConfigured,
  mapMediaType,
} from "@/lib/instagram";

const SYNC_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

async function syncFromInstagram(username: string): Promise<void> {
  try {
    const igData = await getFullBusinessDiscovery(username);
    if (!igData) return;

    const upserted = await prisma.influencer.upsert({
      where: { username },
      update: {
        fullName: igData.profile.name,
        biography: igData.profile.biography,
        profilePicUrl: igData.profile.profile_picture_url,
        followersCount: igData.profile.followers_count,
        followingCount: igData.profile.follows_count,
        mediaCount: igData.profile.media_count,
        avgEngagementRate: calculateEngagementRate(igData.profile.followers_count, igData.media),
        lastSyncedAt: new Date(),
      },
      create: {
        username,
        fullName: igData.profile.name,
        biography: igData.profile.biography,
        profilePicUrl: igData.profile.profile_picture_url,
        followersCount: igData.profile.followers_count,
        followingCount: igData.profile.follows_count,
        mediaCount: igData.profile.media_count,
        avgEngagementRate: calculateEngagementRate(igData.profile.followers_count, igData.media),
        categories: [],
        lastSyncedAt: new Date(),
      },
      select: { id: true },
    });

    // Sync media snapshots — use createMany with skipDuplicates to avoid
    // issues since MediaSnapshot has no compound unique index.
    if (igData.media.length > 0) {
      const now = new Date();
      await prisma.mediaSnapshot.createMany({
        data: igData.media.map((m) => ({
          influencerId: upserted.id,
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
    }
  } catch (err) {
    // Sync failure must not block the response — log and continue.
    console.error(`[syncFromInstagram] ${username}:`, err);
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const isAuthenticated = !!session;

    // --- Instagram sync layer (API → DB) ---
    if (isInstagramConfigured()) {
      const existing = await prisma.influencer.findUnique({
        where: { username: params.username },
        select: { lastSyncedAt: true },
      });
      const needsSync =
        !existing?.lastSyncedAt ||
        Date.now() - existing.lastSyncedAt.getTime() > SYNC_TTL_MS;

      if (needsSync) {
        await syncFromInstagram(params.username);
      }
    }
    // --- End sync layer ---

    const influencer = await prisma.influencer.findUnique({
      where: { username: params.username },
      include: {
        aqsScores: {
          orderBy: { calculatedAt: "desc" },
          take: 1,
        },
        pricePredictions: {
          orderBy: { calculatedAt: "desc" },
          take: 1,
        },
        mediaSnapshots: {
          orderBy: { postedAt: "desc" },
          take: isAuthenticated ? 6 : 3,
        },
      },
    });

    if (!influencer) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }

    const latestAqs = influencer.aqsScores[0] ?? null;
    const latestPrice = influencer.pricePredictions[0] ?? null;
    const source = influencer.lastSyncedAt &&
      Date.now() - influencer.lastSyncedAt.getTime() <= SYNC_TTL_MS
      ? "instagram_api"
      : "database";

    if (!isAuthenticated) {
      return NextResponse.json({
        id: influencer.id,
        username: influencer.username,
        fullName: influencer.fullName,
        biography: influencer.biography,
        profilePicUrl: influencer.profilePicUrl,
        followersCount: influencer.followersCount,
        followingCount: influencer.followingCount,
        mediaCount: influencer.mediaCount,
        categories: influencer.categories,
        isOauthConnected: influencer.isOauthConnected,
        createdAt: influencer.createdAt,
        updatedAt: influencer.updatedAt,
        avgEngagementRate: null,
        aqsScore: null,
        audienceData: null,
        pricePrediction: null,
        mediaSnapshots: influencer.mediaSnapshots.map((m) => ({
          id: m.id,
          igMediaId: m.igMediaId,
          mediaType: m.mediaType,
          caption: m.caption,
          thumbnailUrl: m.thumbnailUrl,
          permalink: m.permalink,
          postedAt: m.postedAt,
          likeCount: null,
          commentsCount: null,
        })),
        source,
      });
    }

    return NextResponse.json({
      id: influencer.id,
      username: influencer.username,
      fullName: influencer.fullName,
      biography: influencer.biography,
      profilePicUrl: influencer.profilePicUrl,
      followersCount: influencer.followersCount,
      followingCount: influencer.followingCount,
      mediaCount: influencer.mediaCount,
      categories: influencer.categories,
      avgEngagementRate: influencer.avgEngagementRate,
      isOauthConnected: influencer.isOauthConnected,
      lastSyncedAt: influencer.lastSyncedAt,
      createdAt: influencer.createdAt,
      updatedAt: influencer.updatedAt,
      aqsScore: latestAqs,
      pricePrediction: latestPrice,
      mediaSnapshots: influencer.mediaSnapshots,
      source,
    });
  } catch (error) {
    console.error("[GET /api/influencers/[username]]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
