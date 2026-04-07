// AQS (Audience Quality Score) Calculator - 4-axis v2
// 참여진정성(35%) + 오디언스품질(30%) + 성과일관성(20%) + 댓글품질(15%)

import { getTier } from "./benchmarks";

// ── Input interfaces ─────────────────────────────────────────────────────────

interface AqsInput {
  followersCount: number;
  followingCount: number;
  avgEngagementRate: number;
  followerHistory: { followersCount: number; recordedDate: Date }[];
  mediaSnapshots: {
    likeCount: number;
    commentsCount: number;
    caption?: string | null;
  }[];
}

// ── Output interfaces ────────────────────────────────────────────────────────

export interface AqsOutput {
  totalScore: number;
  engagementAuthenticity: number;
  audienceQuality: number;
  contentConsistency: number;
  commentQuality: number;
  // backward compat fields
  engagementQuality: number;
  growthPattern: number;
  ratioAnalysis: number;
  commentAuthenticity: number;
  signals: string[];
  grade: string;
  label: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function stddev(arr: number[], avg?: number): number {
  if (arr.length < 2) return 0;
  const m = avg ?? mean(arr);
  return Math.sqrt(arr.reduce((sum, v) => sum + Math.pow(v - m, 2), 0) / arr.length);
}

// ── Axis 1: 참여진정성 (35%) ─────────────────────────────────────────────────
// Compares actual ER to tier benchmark ER. A healthy ratio (~1.0) scores highest.
// Extremely low or suspiciously inflated ER is penalised.

export function calcEngagementAuthenticity(
  avgLikes: number,
  avgComments: number,
  followers: number
): { score: number; signals: string[] } {
  const signals: string[] = [];
  const tier = getTier(followers);

  const actualER =
    followers > 0 ? ((avgLikes + avgComments) / followers) * 100 : 0;
  const benchmarkER = tier.avgER;

  // ratio of actual ER vs benchmark (1.0 = perfect)
  const erRatio = benchmarkER > 0 ? actualER / benchmarkER : 0;

  let score: number;
  if (erRatio >= 0.7 && erRatio <= 1.8) {
    // healthy band
    score = 35;
  } else if (erRatio >= 0.4 && erRatio < 0.7) {
    score = 25;
    signals.push("참여율이 동급 인플루언서 대비 낮습니다");
  } else if (erRatio > 1.8 && erRatio <= 3.0) {
    score = 28;
    signals.push("참여율이 벤치마크보다 높습니다 (확인 필요)");
  } else if (erRatio > 3.0) {
    score = 15;
    signals.push("비정상적으로 높은 참여율 감지 (구매 의심)");
  } else {
    score = 10;
    signals.push("참여율이 매우 낮습니다");
  }

  return { score: clamp(score, 0, 35), signals };
}

// ── Axis 2: 오디언스품질 (30%) ───────────────────────────────────────────────
// Follow ratio (following/followers) + comment-to-like ratio quality.

export function calcAudienceQuality(
  followers: number,
  following: number,
  avgComments: number,
  avgLikes: number
): { score: number; signals: string[] } {
  const signals: string[] = [];
  let score = 30;

  // Follow ratio component (max 18 pts)
  const followRatio = following / Math.max(1, followers);
  let followScore: number;
  if (followRatio < 0.1) {
    followScore = 18;
  } else if (followRatio < 0.3) {
    followScore = 14;
  } else if (followRatio < 0.6) {
    followScore = 10;
  } else if (followRatio < 1.0) {
    followScore = 6;
    signals.push("팔로잉/팔로워 비율이 높습니다");
  } else {
    followScore = 2;
    signals.push("팔로잉이 팔로워를 초과합니다");
  }

  // Comment/like ratio component (max 12 pts)
  const commentLikeRatio = avgLikes > 0 ? avgComments / avgLikes : 0;
  const tier = getTier(followers);
  const benchmarkRatio = tier.avgCommentLikeRatio / 100; // convert % to ratio

  let commentScore: number;
  if (commentLikeRatio >= benchmarkRatio * 0.6 && commentLikeRatio <= benchmarkRatio * 2.5) {
    commentScore = 12;
  } else if (commentLikeRatio < benchmarkRatio * 0.3) {
    commentScore = 4;
    signals.push("댓글/좋아요 비율이 낮습니다");
  } else if (commentLikeRatio > benchmarkRatio * 4) {
    commentScore = 6;
    signals.push("댓글/좋아요 비율이 비정상적으로 높습니다");
  } else {
    commentScore = 8;
  }

  score = followScore + commentScore;
  return { score: clamp(score, 0, 30), signals };
}

// ── Axis 3: 성과일관성 (20%) ─────────────────────────────────────────────────
// Coefficient of variation (CV) of likes across posts.
// Lower CV = more consistent performance = higher score.

export function calcContentConsistency(
  posts: AqsInput["mediaSnapshots"]
): { score: number; signals: string[] } {
  const signals: string[] = [];

  if (posts.length < 3) {
    return { score: 10, signals: ["게시물 데이터가 충분하지 않습니다"] };
  }

  const likes = posts.map((p) => p.likeCount);
  const avg = mean(likes);

  if (avg === 0) {
    return { score: 5, signals: ["좋아요 데이터가 없습니다"] };
  }

  const cv = stddev(likes, avg) / avg; // coefficient of variation

  let score: number;
  if (cv < 0.4) {
    score = 20;
  } else if (cv < 0.7) {
    score = 16;
  } else if (cv < 1.0) {
    score = 12;
  } else if (cv < 1.5) {
    score = 8;
    signals.push("게시물 성과 편차가 큽니다");
  } else {
    score = 4;
    signals.push("게시물 성과가 매우 불안정합니다");
  }

  return { score: clamp(score, 0, 20), signals };
}

// ── Axis 4: 댓글품질 (15%) ───────────────────────────────────────────────────
// Comment-to-like ratio quality: authentic accounts have a healthy ratio.
// Very high or near-zero ratios are suspicious.

export function calcCommentQuality(
  posts: AqsInput["mediaSnapshots"]
): { score: number; signals: string[] } {
  const signals: string[] = [];

  if (posts.length === 0) {
    return { score: 7, signals: [] };
  }

  const totalLikes = posts.reduce((s, p) => s + p.likeCount, 0);
  const totalComments = posts.reduce((s, p) => s + p.commentsCount, 0);
  const avgLikes = totalLikes / posts.length;
  const avgComments = totalComments / posts.length;

  // What fraction of posts have at least 1 comment
  const commentedRatio =
    posts.filter((p) => p.commentsCount > 0).length / posts.length;

  if (commentedRatio < 0.2) {
    signals.push("댓글이 거의 없는 게시물이 많습니다");
    return { score: 4, signals };
  }

  const ratio = avgLikes > 0 ? avgComments / avgLikes : 0;

  let score: number;
  // Healthy range: 1–10% comment/like ratio
  if (ratio >= 0.01 && ratio <= 0.1) {
    score = 15;
  } else if (ratio > 0.1 && ratio <= 0.2) {
    score = 12;
  } else if (ratio < 0.01 && ratio > 0.003) {
    score = 9;
    signals.push("댓글 비율이 낮습니다");
  } else if (ratio > 0.2) {
    score = 8;
    signals.push("댓글 비율이 비정상적으로 높습니다");
  } else {
    score = 5;
    signals.push("댓글 수가 매우 적습니다");
  }

  return { score: clamp(score, 0, 15), signals };
}

// ── Grade helper ─────────────────────────────────────────────────────────────

function getGrade(score: number): { grade: string; label: string } {
  if (score >= 90) return { grade: "🟢", label: "매우건강" };
  if (score >= 70) return { grade: "🟡", label: "양호" };
  if (score >= 50) return { grade: "🟠", label: "보통" };
  if (score >= 30) return { grade: "🔴", label: "미흡" };
  return { grade: "⛔", label: "위험" };
}

// ── Main export ───────────────────────────────────────────────────────────────

export function calculateAQS(input: AqsInput): AqsOutput {
  const { followersCount, followingCount, mediaSnapshots } = input;

  const avgLikes =
    mediaSnapshots.length > 0
      ? mediaSnapshots.reduce((s, m) => s + m.likeCount, 0) / mediaSnapshots.length
      : 0;
  const avgComments =
    mediaSnapshots.length > 0
      ? mediaSnapshots.reduce((s, m) => s + m.commentsCount, 0) / mediaSnapshots.length
      : 0;

  const ea = calcEngagementAuthenticity(avgLikes, avgComments, followersCount);
  const aq = calcAudienceQuality(followersCount, followingCount, avgComments, avgLikes);
  const cc = calcContentConsistency(mediaSnapshots);
  const cq = calcCommentQuality(mediaSnapshots);

  const totalScore = clamp(
    ea.score + aq.score + cc.score + cq.score,
    0,
    100
  );

  const { grade, label } = getGrade(totalScore);
  const signals = [...ea.signals, ...aq.signals, ...cc.signals, ...cq.signals];

  return {
    totalScore,
    engagementAuthenticity: ea.score,
    audienceQuality: aq.score,
    contentConsistency: cc.score,
    commentQuality: cq.score,
    // backward compat
    engagementQuality: ea.score,
    growthPattern: aq.score,
    ratioAnalysis: cc.score,
    commentAuthenticity: cq.score,
    signals,
    grade,
    label,
  };
}

// Backward-compat alias
export const calculateAqs = calculateAQS;
