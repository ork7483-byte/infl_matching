// AI Performance Prediction - Rule-based MVP
// Based on FEATURES.md specification

interface PredictionInput {
  followersCount: number;
  avgEngagementRate: number;
  categories: string[];
  contentType: "FEED" | "REEL" | "STORY";
  aqsScore?: number;
}

interface PredictionOutput {
  predictedFeeMin: number;
  predictedFeeMax: number;
  predictedReach: number;
  predictedReachMin: number;
  predictedReachMax: number;
  predictedLikes: number;
  predictedComments: number;
  predictedEngagementRate: number;
  predictedCpr: number;
  predictedCpe: number;
  confidenceScore: number;
}

const CATEGORY_PRICE_PER_FOLLOWER: Record<string, [number, number]> = {
  뷰티: [15, 25],
  패션: [12, 20],
  푸드: [10, 18],
  여행: [12, 20],
  테크: [10, 18],
  라이프스타일: [8, 15],
  피트니스: [10, 16],
  육아: [8, 14],
};

function getErMultiplier(er: number): number {
  if (er > 5) return 1.3;
  if (er > 3) return 1.2;
  if (er > 1) return 1.0;
  return 0.7;
}

function getAqsMultiplier(aqs: number | undefined): number {
  if (!aqs) return 1.0;
  if (aqs > 80) return 1.1;
  if (aqs > 60) return 1.0;
  if (aqs > 50) return 0.8;
  return 0.6;
}

function getContentTypeMultiplier(type: string): number {
  switch (type) {
    case "REEL":
      return 1.3;
    case "STORY":
      return 0.5;
    default:
      return 1.0;
  }
}

export function calculatePrediction(input: PredictionInput): PredictionOutput {
  const { followersCount, avgEngagementRate, categories, contentType, aqsScore } = input;

  // Get category price range
  const category = categories[0] || "라이프스타일";
  const [priceMin, priceMax] = CATEGORY_PRICE_PER_FOLLOWER[category] || [10, 16];
  const avgPrice = (priceMin + priceMax) / 2;

  // Calculate base fee
  const baseFee = followersCount * avgPrice;

  // Apply multipliers
  const erMult = getErMultiplier(avgEngagementRate);
  const aqsMult = getAqsMultiplier(aqsScore);
  const contentMult = getContentTypeMultiplier(contentType);

  const adjustedFee = baseFee * erMult * aqsMult * contentMult;

  // Predicted reach (30-80% of followers)
  const reachRate = 0.3 + avgEngagementRate * 0.05;
  const predictedReach = Math.floor(followersCount * Math.min(reachRate, 0.8));

  // Predicted engagement
  const predictedLikes = Math.floor(predictedReach * avgEngagementRate * 0.008);
  const predictedComments = Math.floor(predictedLikes * 0.05);
  const predictedER = ((predictedLikes + predictedComments) / followersCount) * 100;

  // Fee range (+/- 20%)
  const feeMin = Math.floor(adjustedFee * 0.8);
  const feeMax = Math.floor(adjustedFee * 1.2);

  // ROI metrics
  const avgFee = (feeMin + feeMax) / 2;
  const cpr = predictedReach > 0 ? avgFee / predictedReach : 0;
  const totalEngagement = predictedLikes + predictedComments;
  const cpe = totalEngagement > 0 ? avgFee / totalEngagement : 0;

  // Confidence (based on data quality)
  const confidence = Math.min(
    0.95,
    0.5 + (aqsScore ? 0.15 : 0) + (avgEngagementRate > 0 ? 0.15 : 0) + 0.1
  );

  return {
    predictedFeeMin: feeMin,
    predictedFeeMax: feeMax,
    predictedReach,
    predictedReachMin: Math.floor(predictedReach * 0.7),
    predictedReachMax: Math.floor(predictedReach * 1.3),
    predictedLikes,
    predictedComments,
    predictedEngagementRate: parseFloat(predictedER.toFixed(2)),
    predictedCpr: parseFloat(cpr.toFixed(2)),
    predictedCpe: parseFloat(cpe.toFixed(2)),
    confidenceScore: parseFloat(confidence.toFixed(2)),
  };
}
