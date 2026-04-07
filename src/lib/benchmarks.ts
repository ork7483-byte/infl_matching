/**
 * 팔로워 티어별 벤치마크 데이터
 * 출처: CreatorIQ, Lessie AI, Neal Schaffer 종합
 */

export interface TierBenchmark {
  label: string;
  min: number;
  max: number;
  avgER: number;
  healthyERMin: number;
  healthyERMax: number;
  avgCommentLikeRatio: number;
  avgReelsReach: number;
}

export const FOLLOWER_TIER_BENCHMARKS: Record<string, TierBenchmark> = {
  nano: {
    label: "나노",
    min: 1000,
    max: 10000,
    avgER: 5.0,
    healthyERMin: 3.0,
    healthyERMax: 8.0,
    avgCommentLikeRatio: 3.5,
    avgReelsReach: 30,
  },
  micro: {
    label: "마이크로",
    min: 10000,
    max: 50000,
    avgER: 3.0,
    healthyERMin: 1.5,
    healthyERMax: 5.0,
    avgCommentLikeRatio: 2.5,
    avgReelsReach: 20,
  },
  mid: {
    label: "미드",
    min: 50000,
    max: 200000,
    avgER: 2.0,
    healthyERMin: 1.0,
    healthyERMax: 3.5,
    avgCommentLikeRatio: 2.0,
    avgReelsReach: 15,
  },
  macro: {
    label: "매크로",
    min: 200000,
    max: 1000000,
    avgER: 1.5,
    healthyERMin: 0.8,
    healthyERMax: 2.5,
    avgCommentLikeRatio: 1.5,
    avgReelsReach: 10,
  },
  mega: {
    label: "메가",
    min: 1000000,
    max: Infinity,
    avgER: 1.0,
    healthyERMin: 0.5,
    healthyERMax: 2.0,
    avgCommentLikeRatio: 1.0,
    avgReelsReach: 8,
  },
};

export function getTier(followers: number): TierBenchmark {
  if (followers < 10000) return FOLLOWER_TIER_BENCHMARKS.nano;
  if (followers < 50000) return FOLLOWER_TIER_BENCHMARKS.micro;
  if (followers < 200000) return FOLLOWER_TIER_BENCHMARKS.mid;
  if (followers < 1000000) return FOLLOWER_TIER_BENCHMARKS.macro;
  return FOLLOWER_TIER_BENCHMARKS.mega;
}

export function getTierName(followers: number): string {
  return getTier(followers).label;
}
