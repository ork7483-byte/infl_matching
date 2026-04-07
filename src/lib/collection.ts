/**
 * Influencer Auto-Collection Library
 *
 * Reads seeds from CollectionSeed table or /data/collection-seeds.json,
 * fetches public profiles via Instagram Business Discovery API,
 * extracts @mentions for auto-discovery, calculates ER, detects categories,
 * and upserts influencer records in DB.
 *
 * Rate limiting: 20s between API calls to stay within hourly quota.
 */

import { prisma } from "@/lib/prisma";
import { getFullBusinessDiscovery, calculateEngagementRate } from "@/lib/instagram";
import type { IGMedia } from "@/lib/instagram";
import { Prisma } from "@prisma/client";

// ============================================
// Category Detection
// ============================================

const CATEGORY_KEYWORDS: { keywords: string[]; category: string }[] = [
  { keywords: ["뷰티", "메이크업", "스킨케어", "beauty", "makeup", "skincare", "cosmetic", "화장"], category: "뷰티" },
  { keywords: ["패션", "ootd", "스타일", "fashion", "style", "outfit", "옷", "코디"], category: "패션" },
  { keywords: ["맛집", "먹방", "레시피", "food", "푸드", "요리", "맛", "먹", "restaurant", "cafe", "카페"], category: "푸드" },
  { keywords: ["여행", "travel", "trip", "tour", "vacation", "여행스타그램", "해외", "국내여행"], category: "여행" },
  { keywords: ["운동", "헬스", "피트니스", "fitness", "workout", "gym", "exercise", "다이어트", "홈트"], category: "피트니스" },
  { keywords: ["육아", "아기", "baby", "mom", "dad", "parenting", "엄마", "아빠", "육아일기", "신생아"], category: "육아" },
  { keywords: ["it", "테크", "개발", "tech", "developer", "programming", "코딩", "software", "ai", "인공지능"], category: "테크" },
  { keywords: ["일상", "daily", "lifestyle", "라이프", "vlog", "브이로그", "일상스타그램"], category: "라이프스타일" },
];

/**
 * Detect categories from biography and captions using keyword matching.
 * Returns array of matched category names (deduped).
 */
export function detectCategory(biography: string, captions: string[]): string[] {
  const allText = [biography, ...captions].join(" ").toLowerCase();
  const matched: string[] = [];

  for (const { keywords, category } of CATEGORY_KEYWORDS) {
    if (keywords.some((kw) => allText.includes(kw.toLowerCase()))) {
      matched.push(category);
    }
  }

  return Array.from(new Set(matched));
}

// ============================================
// Mention Extraction
// ============================================

const MENTION_REGEX = /@([a-zA-Z0-9._]{1,30})/g;

/**
 * Extract all @mentions from media captions.
 * Returns unique lowercased usernames.
 */
export function extractMentions(media: IGMedia[]): string[] {
  const mentions = new Set<string>();

  for (const item of media) {
    if (!item.caption) continue;
    const regex = new RegExp(MENTION_REGEX.source, MENTION_REGEX.flags);
    let match: RegExpExecArray | null;
    while ((match = regex.exec(item.caption)) !== null) {
      const username = match[1].toLowerCase();
      // Skip overly short names
      if (username.length >= 3) {
        mentions.add(username);
      }
    }
  }

  return Array.from(mentions);
}

// ============================================
// Seed Management
// ============================================

/**
 * Add new usernames as CollectionSeed records.
 * Skips duplicates silently.
 */
export async function addNewSeeds(
  usernames: string[],
  source: string,
  discoveredFrom?: string
): Promise<number> {
  if (usernames.length === 0) return 0;

  let added = 0;

  for (const username of usernames) {
    const normalized = username.toLowerCase().trim();
    if (!normalized) continue;

    try {
      await prisma.collectionSeed.upsert({
        where: { username: normalized },
        create: {
          username: normalized,
          source,
          discoveredFrom: discoveredFrom ?? null,
          status: "pending",
        },
        update: {}, // Don't overwrite existing seeds
      });
      added++;
    } catch {
      // Unique constraint or other error — skip
    }
  }

  return added;
}

// ============================================
// Core Collection Logic
// ============================================

const RATE_LIMIT_DELAY_MS = 20_000; // 20 seconds between API calls

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Process a single seed username:
 * 1. Fetch public profile + recent media via Business Discovery API
 * 2. Calculate ER, detect categories
 * 3. Upsert Influencer record
 * 4. Extract @mentions and queue as new seeds
 * 5. Update CollectionSeed status
 *
 * Returns the number of new seeds discovered.
 */
export async function processOneSeed(
  username: string,
  category?: string
): Promise<{ success: boolean; newDiscovered: number }> {
  const normalized = username.toLowerCase().trim();

  try {
    const result = await getFullBusinessDiscovery(normalized, 25);

    if (!result) {
      await prisma.collectionSeed.updateMany({
        where: { username: normalized },
        data: {
          status: "failed",
          failCount: { increment: 1 },
        },
      });
      return { success: false, newDiscovered: 0 };
    }

    const { profile, media } = result;
    const er = calculateEngagementRate(profile.followers_count, media);
    const captions = media.map((m) => m.caption ?? "");
    const detectedCategories = detectCategory(profile.biography ?? "", captions);

    // Merge: prefer seed category hint, then detected, then fallback to ["라이프스타일"]
    const finalCategories =
      category
        ? Array.from(new Set([category, ...detectedCategories]))
        : detectedCategories.length > 0
        ? detectedCategories
        : ["라이프스타일"];

    const bestThumbnail =
      media.find((m) => m.media_url)?.media_url ??
      media.find((m) => m.thumbnail_url)?.thumbnail_url ??
      null;

    // Upsert influencer record
    await prisma.influencer.upsert({
      where: { username: normalized },
      create: {
        username: normalized,
        igUserId: profile.id,
        fullName: profile.name ?? null,
        biography: profile.biography ?? null,
        profilePicUrl: profile.profile_picture_url ?? null,
        followersCount: profile.followers_count ?? 0,
        followingCount: profile.follows_count ?? 0,
        mediaCount: profile.media_count ?? 0,
        categories: finalCategories,
        avgEngagementRate: er,
        bestPostThumbnail: bestThumbnail,
        source: "collected",
        collectedAt: new Date(),
        lastUpdatedAt: new Date(),
        isActive: true,
        rawData: { profile, mediaCount: media.length } as unknown as Prisma.InputJsonValue,
      },
      update: {
        igUserId: profile.id,
        fullName: profile.name ?? null,
        biography: profile.biography ?? null,
        profilePicUrl: profile.profile_picture_url ?? null,
        followersCount: profile.followers_count ?? 0,
        followingCount: profile.follows_count ?? 0,
        mediaCount: profile.media_count ?? 0,
        categories: finalCategories,
        avgEngagementRate: er,
        bestPostThumbnail: bestThumbnail ?? undefined,
        lastUpdatedAt: new Date(),
        rawData: { profile, mediaCount: media.length } as unknown as Prisma.InputJsonValue,
      },
    });

    // Extract @mentions and queue as new seeds
    const mentions = extractMentions(media);
    const newDiscovered = await addNewSeeds(mentions, "auto-discovered", normalized);

    // Mark seed as done
    await prisma.collectionSeed.updateMany({
      where: { username: normalized },
      data: {
        status: "done",
        processedAt: new Date(),
      },
    });

    return { success: true, newDiscovered };
  } catch (error) {
    console.error(`[collection] processOneSeed(${normalized}):`, error);

    await prisma.collectionSeed.updateMany({
      where: { username: normalized },
      data: {
        status: "failed",
        failCount: { increment: 1 },
      },
    });

    return { success: false, newDiscovered: 0 };
  }
}

// ============================================
// Batch Collection Runner
// ============================================

export interface CollectionRunResult {
  processed: number;
  success: number;
  failed: number;
  newDiscovered: number;
  durationMs: number;
}

/**
 * Process up to `limit` pending seeds sequentially with rate limiting.
 * Writes a CollectionLog entry on completion.
 */
export async function runCollection(limit = 10): Promise<CollectionRunResult> {
  const startTime = Date.now();

  const seeds = await prisma.collectionSeed.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "asc" },
    take: limit,
  });

  let success = 0;
  let failed = 0;
  let totalNewDiscovered = 0;

  for (let i = 0; i < seeds.length; i++) {
    const seed = seeds[i];

    const { success: ok, newDiscovered } = await processOneSeed(
      seed.username,
      seed.category ?? undefined
    );

    if (ok) success++;
    else failed++;
    totalNewDiscovered += newDiscovered;

    // Rate limit between calls (skip delay after last item)
    if (i < seeds.length - 1) {
      await sleep(RATE_LIMIT_DELAY_MS);
    }
  }

  const durationMs = Date.now() - startTime;

  // Log the run
  await prisma.collectionLog.create({
    data: {
      jobDate: new Date(),
      totalSeeds: seeds.length,
      successCount: success,
      failCount: failed,
      newDiscovered: totalNewDiscovered,
      apiCallsUsed: seeds.length, // 1 API call per seed (getFullBusinessDiscovery)
      duration: Math.round(durationMs / 1000),
    },
  });

  return {
    processed: seeds.length,
    success,
    failed,
    newDiscovered: totalNewDiscovered,
    durationMs,
  };
}
