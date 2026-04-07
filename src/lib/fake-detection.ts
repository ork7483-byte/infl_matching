// Fake Follower Detection - Rule-based MVP
// Based on FEATURES.md specification

interface DetectionInput {
  followersCount: number;
  followingCount: number;
  avgEngagementRate: number;
  followerHistory: { followersCount: number; recordedDate: Date }[];
  mediaSnapshots: { likeCount: number; commentsCount: number; caption?: string | null }[];
}

interface DetectionSignal {
  id: string;
  name: string;
  description: string;
  detected: boolean;
  severity: "safe" | "warning" | "danger";
  detail?: string;
}

interface DetectionOutput {
  riskScore: number; // 0~100
  signals: DetectionSignal[];
}

export function detectFakeFollowers(input: DetectionInput): DetectionOutput {
  const { followersCount, followingCount, avgEngagementRate, followerHistory, mediaSnapshots } = input;
  const signals: DetectionSignal[] = [];

  // Signal 1: Abnormal engagement rate
  const erAbnormal =
    (followersCount >= 10000 && avgEngagementRate < 0.5) ||
    avgEngagementRate > 20;

  signals.push({
    id: "engagement_rate",
    name: "참여율 이상",
    description: "팔로워 수 대비 참여율이 비정상적",
    detected: erAbnormal,
    severity: erAbnormal ? "danger" : "safe",
    detail: erAbnormal
      ? followersCount >= 10000 && avgEngagementRate < 0.5
        ? `팔로워 ${followersCount.toLocaleString()}명인데 참여율 ${avgEngagementRate}%로 매우 낮음`
        : `참여율 ${avgEngagementRate}%로 비정상적으로 높음`
      : `참여율 ${avgEngagementRate}%로 정상 범위`,
  });

  // Signal 2: Follower/Following ratio
  const ratioAbnormal = followingCount > followersCount * 2;
  signals.push({
    id: "follower_ratio",
    name: "팔로워/팔로잉 비율",
    description: "팔로잉이 팔로워의 2배 이상",
    detected: ratioAbnormal,
    severity: ratioAbnormal ? "warning" : "safe",
    detail: ratioAbnormal
      ? `팔로잉(${followingCount.toLocaleString()})이 팔로워(${followersCount.toLocaleString()})의 ${(followingCount / followersCount).toFixed(1)}배`
      : `팔로잉/팔로워 비율 정상 (${(followingCount / followersCount).toFixed(2)})`,
  });

  // Signal 3: Follower spike/drop
  let spikeDetected = false;
  let spikeDetail = "최근 90일간 급격한 변화 없음";

  if (followerHistory.length >= 2) {
    for (let i = 1; i < followerHistory.length; i++) {
      const prev = followerHistory[i - 1].followersCount;
      const curr = followerHistory[i].followersCount;
      const changeRate = (curr - prev) / prev;

      if (changeRate > 0.1) {
        spikeDetected = true;
        spikeDetail = `하루에 ${(changeRate * 100).toFixed(1)}% 팔로워 급증 감지`;
        break;
      }
      if (changeRate < -0.05) {
        spikeDetected = true;
        spikeDetail = `하루에 ${Math.abs(changeRate * 100).toFixed(1)}% 팔로워 급감 감지`;
        break;
      }
    }
  }

  signals.push({
    id: "follower_spike",
    name: "팔로워 급증/급감",
    description: "하루 10% 이상 증가 또는 5% 이상 감소",
    detected: spikeDetected,
    severity: spikeDetected ? "danger" : "safe",
    detail: spikeDetail,
  });

  // Signal 4: Spam comments (simplified)
  let spamDetected = false;
  let spamDetail = "댓글 패턴 정상";

  if (mediaSnapshots.length > 0) {
    const avgLikes = mediaSnapshots.reduce((s, m) => s + m.likeCount, 0) / mediaSnapshots.length;
    const avgComments = mediaSnapshots.reduce((s, m) => s + m.commentsCount, 0) / mediaSnapshots.length;

    // If comments are disproportionately low or high relative to likes
    if (avgLikes > 0) {
      const commentLikeRatio = avgComments / avgLikes;
      if (commentLikeRatio < 0.005 && followersCount > 5000) {
        spamDetected = true;
        spamDetail = "좋아요 대비 댓글 비율이 매우 낮음 (봇 팔로워 의심)";
      } else if (commentLikeRatio > 0.3) {
        spamDetected = true;
        spamDetail = "댓글 비율이 비정상적으로 높음 (스팸 댓글 의심)";
      }
    }
  }

  signals.push({
    id: "spam_comments",
    name: "스팸 댓글 비율",
    description: "스팸 패턴 댓글이 40% 이상",
    detected: spamDetected,
    severity: spamDetected ? "warning" : "safe",
    detail: spamDetail,
  });

  // Risk score: detected signals x 25
  const detectedCount = signals.filter((s) => s.detected).length;
  const riskScore = Math.min(100, detectedCount * 25);

  return { riskScore, signals };
}
