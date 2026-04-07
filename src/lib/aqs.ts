// AQS (Audience Quality Score) Calculator - Rule-based MVP
// Based on FEATURES.md specification

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

interface AqsOutput {
  totalScore: number;
  engagementQuality: number;
  growthPattern: number;
  ratioAnalysis: number;
  contentConsistency: number;
  commentAuthenticity: number;
  signals: string[];
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function calculateEngagementQuality(
  avgER: number,
  media: AqsInput["mediaSnapshots"]
): { score: number; signals: string[] } {
  const signals: string[] = [];
  let score = 10; // base

  // ER in healthy range (1-8%)
  if (avgER >= 1 && avgER <= 8) score += 5;
  else if (avgER < 0.5) {
    score -= 5;
    signals.push("참여율이 매우 낮습니다");
  } else if (avgER > 15) {
    score -= 3;
    signals.push("비정상적으로 높은 참여율");
  }

  // Like:Comment ratio
  if (media.length > 0) {
    const avgLikes = media.reduce((sum, m) => sum + m.likeCount, 0) / media.length;
    const avgComments = media.reduce((sum, m) => sum + m.commentsCount, 0) / media.length;
    const ratio = avgComments > 0 ? avgLikes / avgComments : 100;
    if (ratio > 5 && ratio < 50) score += 3;
    else if (ratio >= 50) signals.push("좋아요 대비 댓글이 매우 적음");
  }

  // ER variance
  if (media.length >= 5) {
    const ers = media.map(
      (m) => ((m.likeCount + m.commentsCount) / Math.max(1, m.likeCount)) * 100
    );
    const mean = ers.reduce((a, b) => a + b, 0) / ers.length;
    const variance = ers.reduce((sum, er) => sum + Math.pow(er - mean, 2), 0) / ers.length;
    if (variance < mean * 2) score += 2;
  }

  return { score: clamp(score, 0, 20), signals };
}

function calculateGrowthPattern(
  history: AqsInput["followerHistory"]
): { score: number; signals: string[] } {
  const signals: string[] = [];
  let score = 10;

  if (history.length < 7) return { score, signals };

  // Check for sudden spikes
  for (let i = 1; i < history.length; i++) {
    const prev = history[i - 1].followersCount;
    const curr = history[i].followersCount;
    const changeRate = (curr - prev) / prev;

    if (changeRate > 0.1) {
      score -= 3;
      signals.push("하루 10% 이상 팔로워 급증 감지");
      break;
    }
    if (changeRate < -0.05) {
      score -= 2;
      signals.push("하루 5% 이상 팔로워 급감 감지");
      break;
    }
  }

  // Growth stability
  const changes = [];
  for (let i = 1; i < history.length; i++) {
    changes.push(history[i].followersCount - history[i - 1].followersCount);
  }
  const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;
  if (avgChange > 0) score += 5;

  // Consistent positive growth
  const positiveChanges = changes.filter((c) => c >= 0).length;
  if (positiveChanges / changes.length > 0.7) score += 5;

  return { score: clamp(score, 0, 20), signals };
}

function calculateRatioAnalysis(
  followersCount: number,
  followingCount: number
): { score: number; signals: string[] } {
  const signals: string[] = [];
  let score = 10;
  const ratio = followingCount / Math.max(1, followersCount);

  if (ratio < 0.1) score += 8;
  else if (ratio < 0.3) score += 5;
  else if (ratio < 0.5) score += 2;
  else if (ratio > 2) {
    score -= 5;
    signals.push("팔로잉이 팔로워의 2배 이상");
  } else if (ratio > 1) {
    score -= 2;
    signals.push("팔로잉이 팔로워보다 많음");
  }

  return { score: clamp(score, 0, 20), signals };
}

function calculateContentConsistency(
  media: AqsInput["mediaSnapshots"]
): { score: number; signals: string[] } {
  const signals: string[] = [];
  let score = 10;

  if (media.length < 5) return { score, signals };

  // Post frequency (having regular posts)
  if (media.length >= 20) score += 5;
  else if (media.length >= 10) score += 3;

  // Performance variance
  const likes = media.map((m) => m.likeCount);
  const mean = likes.reduce((a, b) => a + b, 0) / likes.length;
  const cv = Math.sqrt(
    likes.reduce((sum, l) => sum + Math.pow(l - mean, 2), 0) / likes.length
  ) / Math.max(1, mean);

  if (cv < 0.5) score += 5;
  else if (cv > 1.5) {
    score -= 3;
    signals.push("게시물 성과 편차가 큼");
  }

  return { score: clamp(score, 0, 20), signals };
}

function calculateCommentAuthenticity(
  media: AqsInput["mediaSnapshots"]
): { score: number; signals: string[] } {
  const signals: string[] = [];
  let score = 12;

  // Simple heuristic: if comments exist relative to likes, it's a good sign
  const withComments = media.filter((m) => m.commentsCount > 0);
  const commentRatio = withComments.length / Math.max(1, media.length);

  if (commentRatio > 0.8) score += 5;
  else if (commentRatio > 0.5) score += 3;
  else if (commentRatio < 0.2) {
    score -= 3;
    signals.push("댓글이 거의 없는 게시물이 많음");
  }

  // Average comment per post ratio
  if (media.length > 0) {
    const avgComments = media.reduce((s, m) => s + m.commentsCount, 0) / media.length;
    const avgLikes = media.reduce((s, m) => s + m.likeCount, 0) / media.length;
    const spamRatio = avgLikes > 0 ? avgComments / avgLikes : 0;

    if (spamRatio > 0.02 && spamRatio < 0.15) score += 3;
  }

  return { score: clamp(score, 0, 20), signals };
}

export function calculateAqs(input: AqsInput): AqsOutput {
  const { followersCount, followingCount, avgEngagementRate, followerHistory, mediaSnapshots } = input;

  const eq = calculateEngagementQuality(avgEngagementRate, mediaSnapshots);
  const gp = calculateGrowthPattern(followerHistory);
  const ra = calculateRatioAnalysis(followersCount, followingCount);
  const cc = calculateContentConsistency(mediaSnapshots);
  const ca = calculateCommentAuthenticity(mediaSnapshots);

  const totalScore = eq.score + gp.score + ra.score + cc.score + ca.score;
  const allSignals = [...eq.signals, ...gp.signals, ...ra.signals, ...cc.signals, ...ca.signals];

  return {
    totalScore: clamp(totalScore, 0, 100),
    engagementQuality: eq.score,
    growthPattern: gp.score,
    ratioAnalysis: ra.score,
    contentConsistency: cc.score,
    commentAuthenticity: ca.score,
    signals: allSignals,
  };
}
