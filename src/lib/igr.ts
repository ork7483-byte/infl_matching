// IGR (Instagram Grade Rating) Calculator
// 릴스성과(30%) + 참여품질(25%) + 콘텐츠전략(25%) + 성장모멘텀(20%)

import { getTier } from "./benchmarks";

// ── Post interface ────────────────────────────────────────────────────────────

export interface Post {
  like_count: number;
  comments_count: number;
  media_type: string; // IMAGE, VIDEO, CAROUSEL_ALBUM
  caption?: string;
  timestamp?: string;
  view_count?: number; // for reels/video
  followers_count?: number; // optional context
}

// ── IGR Output ────────────────────────────────────────────────────────────────

export interface IgrOutput {
  score: number;
  grade: string;
  label: string;
  details: {
    reelsPerformance: number;
    engagementQuality: number;
    contentStrategy: number;
    growthMomentum: number;
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// ── Category detection ────────────────────────────────────────────────────────

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  뷰티: ["beauty", "makeup", "스킨케어", "화장", "립", "파운데이션", "뷰티", "cosmetic"],
  패션: ["fashion", "ootd", "outfit", "패션", "코디", "스타일링", "옷"],
  음식: ["food", "먹방", "맛집", "레시피", "요리", "카페", "restaurant", "cook"],
  여행: ["travel", "여행", "trip", "vacation", "휴가", "나들이", "tour"],
  피트니스: ["fitness", "workout", "gym", "운동", "헬스", "다이어트", "exercise"],
  라이프스타일: ["lifestyle", "일상", "daily", "vlog", "브이로그"],
  테크: ["tech", "gadget", "review", "리뷰", "언박싱", "unboxing", "technology"],
  게임: ["game", "gaming", "게임", "플레이", "stream", "스트리밍"],
};

export function detectCategory(caption: string): string {
  if (!caption) return "기타";
  const lower = caption.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return category;
  }
  return "기타";
}

// ── Axis 1: 릴스성과 (30%) ────────────────────────────────────────────────────
// Reels/video view count vs followers. Higher reach multiplier = better score.

export function calcReelsPerformance(
  posts: Post[],
  followers: number
): { score: number; signals: string[] } {
  const signals: string[] = [];
  const reels = posts.filter(
    (p) => p.media_type === "VIDEO" || p.media_type === "REEL"
  );

  if (reels.length === 0) {
    signals.push("릴스/동영상 게시물이 없습니다");
    return { score: 10, signals };
  }

  const tier = getTier(followers);
  const benchmarkReach = tier.avgReelsReach / 100; // convert % to ratio

  // average view rate vs followers
  const viewRates = reels
    .filter((r) => r.view_count !== undefined && r.view_count > 0)
    .map((r) => (r.view_count as number) / Math.max(1, followers));

  if (viewRates.length === 0) {
    // No view data: use like rate as proxy
    const avgLikeRate = mean(reels.map((r) => r.like_count / Math.max(1, followers)));
    const score = avgLikeRate > 0.02 ? 20 : avgLikeRate > 0.01 ? 15 : 10;
    signals.push("릴스 조회수 데이터가 없어 좋아요 기반으로 추정합니다");
    return { score, signals };
  }

  const avgViewRate = mean(viewRates);
  const ratio = benchmarkReach > 0 ? avgViewRate / benchmarkReach : 0;

  let score: number;
  if (ratio >= 1.2) {
    score = 30;
  } else if (ratio >= 0.8) {
    score = 25;
  } else if (ratio >= 0.5) {
    score = 18;
    signals.push("릴스 도달률이 평균 이하입니다");
  } else if (ratio >= 0.3) {
    score = 12;
    signals.push("릴스 도달률이 낮습니다");
  } else {
    score = 6;
    signals.push("릴스 도달률이 매우 낮습니다");
  }

  return { score: clamp(score, 0, 30), signals };
}

// ── Axis 2: 참여품질 (25%) ────────────────────────────────────────────────────
// Deep engagement = comment / like ratio. Higher = more genuine interaction.

export function calcIGREngagementQuality(posts: Post[]): { score: number; signals: string[] } {
  const signals: string[] = [];

  if (posts.length === 0) {
    return { score: 12, signals: [] };
  }

  const totalLikes = posts.reduce((s, p) => s + p.like_count, 0);
  const totalComments = posts.reduce((s, p) => s + p.comments_count, 0);

  if (totalLikes === 0) {
    return { score: 5, signals: ["좋아요 데이터가 없습니다"] };
  }

  const commentLikeRatio = totalComments / totalLikes;

  let score: number;
  // 2–15% comment/like is the healthy deep-engagement range
  if (commentLikeRatio >= 0.02 && commentLikeRatio <= 0.15) {
    score = 25;
  } else if (commentLikeRatio > 0.15 && commentLikeRatio <= 0.3) {
    score = 20;
    signals.push("댓글 비율이 다소 높습니다");
  } else if (commentLikeRatio >= 0.005 && commentLikeRatio < 0.02) {
    score = 16;
    signals.push("댓글 참여가 낮습니다");
  } else if (commentLikeRatio > 0.3) {
    score = 12;
    signals.push("댓글 비율이 비정상적으로 높습니다");
  } else {
    score = 8;
    signals.push("댓글 참여가 매우 낮습니다");
  }

  return { score: clamp(score, 0, 25), signals };
}

// ── Axis 3: 콘텐츠전략 (25%) ──────────────────────────────────────────────────
// Niche consistency (dominant category %) + reels usage ratio.

export function calcContentStrategy(posts: Post[]): { score: number; signals: string[] } {
  const signals: string[] = [];

  if (posts.length === 0) {
    return { score: 12, signals: [] };
  }

  // Category consistency (max 15 pts)
  const categoryCounts: Record<string, number> = {};
  for (const post of posts) {
    const cat = detectCategory(post.caption ?? "");
    categoryCounts[cat] = (categoryCounts[cat] ?? 0) + 1;
  }
  const maxCatCount = Math.max(...Object.values(categoryCounts));
  const consistencyRate = maxCatCount / posts.length;

  let consistencyScore: number;
  if (consistencyRate >= 0.7) {
    consistencyScore = 15;
  } else if (consistencyRate >= 0.5) {
    consistencyScore = 11;
  } else if (consistencyRate >= 0.35) {
    consistencyScore = 7;
    signals.push("콘텐츠 주제가 분산되어 있습니다");
  } else {
    consistencyScore = 3;
    signals.push("콘텐츠 주제 일관성이 낮습니다");
  }

  // Reels ratio (max 10 pts)
  const reelsCount = posts.filter(
    (p) => p.media_type === "VIDEO" || p.media_type === "REEL"
  ).length;
  const reelsRatio = reelsCount / posts.length;

  let reelsScore: number;
  if (reelsRatio >= 0.4) {
    reelsScore = 10;
  } else if (reelsRatio >= 0.2) {
    reelsScore = 7;
  } else if (reelsRatio >= 0.1) {
    reelsScore = 4;
    signals.push("릴스 활용이 낮습니다");
  } else {
    reelsScore = 1;
    signals.push("릴스를 거의 활용하지 않습니다");
  }

  const score = consistencyScore + reelsScore;
  return { score: clamp(score, 0, 25), signals };
}

// ── Axis 4: 성장모멘텀 (20%) ──────────────────────────────────────────────────
// Compare recent 6 posts vs older 6 posts (average likes).
// Requires posts sorted newest-first.

export function calcGrowthMomentum(posts: Post[]): { score: number; signals: string[] } {
  const signals: string[] = [];

  if (posts.length < 6) {
    signals.push("성장 모멘텀 계산에 충분한 게시물이 없습니다");
    return { score: 10, signals };
  }

  // Sort by timestamp if available (newest first), else assume passed order
  const sorted = [...posts].sort((a, b) => {
    if (a.timestamp && b.timestamp) {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    return 0;
  });

  const recent = sorted.slice(0, 6);
  const older = sorted.slice(-6);

  const recentAvgLikes = mean(recent.map((p) => p.like_count));
  const olderAvgLikes = mean(older.map((p) => p.like_count));

  if (olderAvgLikes === 0) {
    return { score: 15, signals: [] };
  }

  const growthRate = (recentAvgLikes - olderAvgLikes) / olderAvgLikes;

  let score: number;
  if (growthRate >= 0.2) {
    score = 20;
  } else if (growthRate >= 0.05) {
    score = 17;
  } else if (growthRate >= -0.05) {
    score = 13;
  } else if (growthRate >= -0.2) {
    score = 8;
    signals.push("최근 게시물 성과가 감소 추세입니다");
  } else {
    score = 4;
    signals.push("최근 게시물 성과가 크게 감소했습니다");
  }

  return { score: clamp(score, 0, 20), signals };
}

// ── Grade helper ──────────────────────────────────────────────────────────────

function getGrade(score: number): { grade: string; label: string } {
  if (score >= 90) return { grade: "🟣", label: "S" };
  if (score >= 70) return { grade: "🔵", label: "A" };
  if (score >= 50) return { grade: "🟢", label: "B" };
  if (score >= 30) return { grade: "🟡", label: "C" };
  return { grade: "🔴", label: "D" };
}

// ── Main export ───────────────────────────────────────────────────────────────

export interface IgrInput {
  posts: Post[];
  followers: number;
}

export function calculateIGR(data: IgrInput): IgrOutput {
  const { posts, followers } = data;

  const rp = calcReelsPerformance(posts, followers);
  const eq = calcIGREngagementQuality(posts);
  const cs = calcContentStrategy(posts);
  const gm = calcGrowthMomentum(posts);

  const score = clamp(rp.score + eq.score + cs.score + gm.score, 0, 100);
  const { grade, label } = getGrade(score);

  return {
    score,
    grade,
    label,
    details: {
      reelsPerformance: rp.score,
      engagementQuality: eq.score,
      contentStrategy: cs.score,
      growthMomentum: gm.score,
    },
  };
}
