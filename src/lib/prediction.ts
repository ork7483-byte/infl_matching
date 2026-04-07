/**
 * 예상 광고단가 계산 — 업계 실데이터 기반
 *
 * 피드: (팔로워 / 1,000) × 10,000원
 * 릴스: (평균 조회수 / 1,000) × 20,000원 — 조회수 없으면 팔로워 기반 추정
 * 스토리: (팔로워 / 1,000) × 5,000원
 * 출처: 태그바이 + Neal Schaffer 한국 시장 조정 기준
 *
 * 범위: 최소 × 0.7, 최대 × 1.5
 * ER이 카테고리 평균 대비 높으면 상한 쪽 조정
 * AQS가 낮으면 하한 쪽 조정
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PredictionInput {
  followersCount: number;
  avgEngagementRate: number;
  categories: string[];
  contentType: "FEED" | "REEL" | "STORY";
  aqsScore?: number;
  avgReelViews?: number; // 릴스 평균 조회수 (있으면 사용)
}

export interface PredictionOutput {
  predictedFeeMin: number;
  predictedFeeMax: number;
  predictedFeeBase: number;
  predictedReach: number;
  predictedReachMin: number;
  predictedReachMax: number;
  predictedLikes: number;
  predictedComments: number;
  predictedEngagementRate: number;
  predictedCpr: number;
  predictedCpe: number;
  confidenceScore: number;
  tierName: string;
  tierRange: { feedMin: number; feedMax: number; reelMin: number; reelMax: number };
  source: "rule" | "database";
  disclaimer: string;
}

// ─── 인플루언서 등급 (팔로워 기준) ────────────────────────────────────────────

interface TierInfo {
  name: string;
  min: number;
  max: number;
  feedRange: [number, number]; // 만원 단위
  reelRange: [number, number]; // 만원 단위
}

const TIERS: TierInfo[] = [
  { name: "나노", min: 1_000, max: 10_000, feedRange: [5, 30], reelRange: [10, 50] },
  { name: "마이크로", min: 10_000, max: 100_000, feedRange: [30, 100], reelRange: [50, 200] },
  { name: "미드티어", min: 100_000, max: 500_000, feedRange: [100, 300], reelRange: [200, 500] },
  { name: "매크로", min: 500_000, max: 1_000_000, feedRange: [300, 800], reelRange: [500, 1000] },
  { name: "메가", min: 1_000_000, max: Infinity, feedRange: [800, 3000], reelRange: [1000, 5000] },
];

function getTier(followers: number): TierInfo {
  return TIERS.find((t) => followers >= t.min && followers < t.max) || TIERS[0];
}

// ─── 카테고리 평균 ER ─────────────────────────────────────────────────────────

const CATEGORY_AVG_ER: Record<string, number> = {
  뷰티: 3.8,
  패션: 3.2,
  푸드: 4.1,
  여행: 3.5,
  테크: 2.8,
  라이프스타일: 3.0,
  피트니스: 4.5,
  육아: 3.6,
};

// ─── 핵심 계산 ───────────────────────────────────────────────────────────────

function calculateBaseFee(
  followersCount: number,
  contentType: "FEED" | "REEL" | "STORY",
  avgReelViews?: number
): number {
  switch (contentType) {
    case "FEED":
      return (followersCount / 1_000) * 10_000;
    case "REEL": {
      // 릴스: 조회수 기반 (없으면 팔로워의 30% 추정)
      const views = avgReelViews || Math.floor(followersCount * 0.3);
      return (views / 1_000) * 20_000;
    }
    case "STORY":
      return (followersCount / 1_000) * 5_000;
    default:
      return (followersCount / 1_000) * 10_000;
  }
}

function getErAdjustment(
  er: number,
  categories: string[]
): number {
  const categoryAvg = CATEGORY_AVG_ER[categories[0]] || 3.2;
  const ratio = er / categoryAvg;

  // ER이 카테고리 평균보다 높으면 상한 쪽 조정
  if (ratio >= 2.0) return 1.4; // 2배 이상 → 40% 프리미엄
  if (ratio >= 1.5) return 1.25;
  if (ratio >= 1.0) return 1.1;
  if (ratio >= 0.5) return 0.9;
  return 0.75; // 평균의 절반 미만
}

function getAqsAdjustment(aqs: number | undefined): number {
  if (!aqs) return 1.0;
  if (aqs >= 80) return 1.1;
  if (aqs >= 70) return 1.0;
  if (aqs >= 50) return 0.85;
  return 0.7; // 낮은 AQS → 하한 쪽 조정
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export function calculatePrediction(input: PredictionInput): PredictionOutput {
  const {
    followersCount,
    avgEngagementRate,
    categories,
    contentType,
    aqsScore,
    avgReelViews,
  } = input;

  // 1. 기본 단가 계산 (업계 공식)
  const baseFee = calculateBaseFee(followersCount, contentType, avgReelViews);

  // 2. ER + AQS 조정
  const erAdj = getErAdjustment(avgEngagementRate, categories);
  const aqsAdj = getAqsAdjustment(aqsScore);
  const adjustedFee = baseFee * erAdj * aqsAdj;

  // 3. 범위 (×0.7 ~ ×1.5)
  const feeMin = Math.floor(adjustedFee * 0.7);
  const feeMax = Math.floor(adjustedFee * 1.5);

  // 4. 예상 도달·참여
  const reachRate = contentType === "REEL" ? 0.4 : contentType === "STORY" ? 0.15 : 0.25;
  const predictedReach = Math.floor(followersCount * reachRate * (1 + avgEngagementRate * 0.02));
  const predictedLikes = Math.floor(predictedReach * avgEngagementRate * 0.008);
  const predictedComments = Math.floor(predictedLikes * 0.05);
  const predictedER = followersCount > 0
    ? parseFloat((((predictedLikes + predictedComments) / followersCount) * 100).toFixed(2))
    : 0;

  // 5. ROI 메트릭
  const avgFee = (feeMin + feeMax) / 2;
  const cpr = predictedReach > 0 ? parseFloat((avgFee / predictedReach).toFixed(2)) : 0;
  const totalEng = predictedLikes + predictedComments;
  const cpe = totalEng > 0 ? parseFloat((avgFee / totalEng).toFixed(2)) : 0;

  // 6. 신뢰도
  const confidence = Math.min(
    0.95,
    0.5 + (aqsScore ? 0.15 : 0) + (avgEngagementRate > 0 ? 0.15 : 0) + (avgReelViews ? 0.1 : 0) + 0.05
  );

  // 7. 등급 정보
  const tier = getTier(followersCount);

  return {
    predictedFeeMin: feeMin,
    predictedFeeMax: feeMax,
    predictedFeeBase: Math.floor(adjustedFee),
    predictedReach,
    predictedReachMin: Math.floor(predictedReach * 0.7),
    predictedReachMax: Math.floor(predictedReach * 1.3),
    predictedLikes,
    predictedComments,
    predictedEngagementRate: predictedER,
    predictedCpr: cpr,
    predictedCpe: cpe,
    confidenceScore: parseFloat(confidence.toFixed(2)),
    tierName: tier.name,
    tierRange: {
      feedMin: tier.feedRange[0] * 10000,
      feedMax: tier.feedRange[1] * 10000,
      reelMin: tier.reelRange[0] * 10000,
      reelMax: tier.reelRange[1] * 10000,
    },
    source: "rule",
    disclaimer:
      "이 금액은 업계 평균 기준의 추정치입니다. 실제 광고비는 카테고리, 콘텐츠 유형, 독점권, 캠페인 조건에 따라 달라질 수 있습니다.",
  };
}

// ─── 향후 DB 기반 전환 함수 (캠페인 데이터 30건 이상 시 활성화) ──────────────

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
export async function calculatePredictionFromDB(
  _input: PredictionInput,
  _prisma: any
): Promise<PredictionOutput | null> {
  // TODO: campaign_results 테이블에서 카테고리별 actual_fee 평균 조회
  // const count = await prisma.campaignResult.count({ where: { category } });
  // if (count >= 30) { /* DB 기반 계산 */ }
  return null; // 데이터 부족 시 null → 규칙 기반 fallback
}
