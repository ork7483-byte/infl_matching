import { prisma } from "@/lib/prisma";

// MediaSnapshot type reference (matches Prisma schema)
type MediaSnapshotInput = {
  mediaType: string;
  likeCount: number;
  commentsCount: number;
  thumbnailUrl?: string | null;
  igMediaId: string;
};

/**
 * Select 10-15 best photos from IG media snapshots.
 * MVP: images only, sorted by likes descending, top 12.
 */
export function selectFacePhotos(mediaSnapshots: MediaSnapshotInput[]): MediaSnapshotInput[] {
  return mediaSnapshots
    .filter((m) => m.mediaType === "IMAGE")
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, 12);
}

/**
 * Extract style tags from influencer categories and biography.
 */
export function getCloneStyles(categories: string[], biography?: string | null): string[] {
  const styles = new Set<string>(categories);

  if (biography) {
    const bioLower = biography.toLowerCase();
    const styleKeywords: Record<string, string> = {
      패션: "fashion",
      뷰티: "beauty",
      라이프스타일: "lifestyle",
      피트니스: "fitness",
      여행: "travel",
      음식: "food",
      foodie: "food",
      travel: "travel",
      fashion: "fashion",
      beauty: "beauty",
      lifestyle: "lifestyle",
      fitness: "fitness",
      food: "food",
      "make-up": "beauty",
      makeup: "beauty",
      skincare: "beauty",
      workout: "fitness",
      gym: "fitness",
      yoga: "fitness",
      ootd: "fashion",
      style: "fashion",
    };

    for (const [keyword, tag] of Object.entries(styleKeywords)) {
      if (bioLower.includes(keyword)) {
        styles.add(tag);
      }
    }
  }

  return Array.from(styles);
}

/**
 * Generate AI clone portfolio images.
 * MVP: use picsum placeholder thumbnails derived from influencer ID.
 */
function generatePortfolioImages(influencerId: string): string[] {
  return Array.from(
    { length: 6 },
    (_, i) => `https://picsum.photos/seed/${influencerId}-clone-${i}/400/500`
  );
}

/**
 * Create an AIMuse record for the given influencer.
 * Steps:
 * 1. Get influencer + media snapshots
 * 2. Select best photos (images only, sort by likes, top 12)
 * 3. Extract styles from categories + biography
 * 4. Create AIMuse record with status "ready"
 * 5. Generate portfolio images (MVP: picsum placeholders)
 * Returns the created clone record.
 */
export async function createCloneForInfluencer(influencerId: string) {
  const influencer = await prisma.influencer.findUnique({
    where: { id: influencerId },
    include: {
      mediaSnapshots: {
        orderBy: { postedAt: "desc" },
        take: 100,
      },
    },
  });

  if (!influencer) {
    throw new Error("Influencer not found");
  }

  const selectedPhotos = selectFacePhotos(influencer.mediaSnapshots);
  const sourcePhotos = selectedPhotos
    .map((p) => p.thumbnailUrl)
    .filter((url): url is string => url !== null && url !== undefined);

  const styles = getCloneStyles(influencer.categories, influencer.biography);
  const portfolioImages = generatePortfolioImages(influencerId);

  const clone = await prisma.aIMuse.create({
    data: {
      influencerId,
      status: "ready",
      sourcePhotos,
      portfolioImages,
      styles,
    },
  });

  return clone;
}
