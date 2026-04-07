"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import GaugeChart from "@/components/charts/GaugeChart";

type ContentType = "FEED" | "REEL" | "STORY";

interface InfluencerInfo {
  username: string;
  displayName: string;
  followers: number;
  er: number;
  categories: string[];
  platform: string;
}

interface PredictionResult {
  estimatedReach: { min: number; max: number };
  estimatedEngagement: { min: number; max: number };
  estimatedEngagementRate: { min: number; max: number };
  estimatedFeeRange: { min: number; max: number };
  cpr: number;
  cpe: number;
  confidenceScore: number;
}

const MOCK_INFLUENCER: InfluencerInfo = {
  username: "beauty_j",
  displayName: "뷰티 제이",
  followers: 125400,
  er: 5.8,
  categories: ["뷰티", "패션", "라이프스타일"],
  platform: "Instagram",
};

function getMockPrediction(contentType: ContentType, inf: InfluencerInfo): PredictionResult {
  const multipliers = { FEED: 1.0, REEL: 1.4, STORY: 0.7 };
  const m = multipliers[contentType];
  const baseReach = inf.followers * 0.28 * m;
  const baseEng = baseReach * (inf.er / 100);
  const fee = inf.followers * 0.008 * m;
  return {
    estimatedReach: { min: Math.round(baseReach * 0.8), max: Math.round(baseReach * 1.2) },
    estimatedEngagement: { min: Math.round(baseEng * 0.75), max: Math.round(baseEng * 1.25) },
    estimatedEngagementRate: { min: parseFloat((inf.er * 0.85).toFixed(1)), max: parseFloat((inf.er * 1.15).toFixed(1)) },
    estimatedFeeRange: { min: Math.round(fee * 0.8 / 10000) * 10000, max: Math.round(fee * 1.2 / 10000) * 10000 },
    cpr: parseFloat((fee / baseReach).toFixed(2)),
    cpe: parseFloat((fee / baseEng).toFixed(1)),
    confidenceScore: Math.round(72 + Math.random() * 15),
  };
}

function formatNumber(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export default function PredictPage() {
  const params = useParams();
  const username = (params?.username as string) ?? "";

  const [influencer, setInfluencer] = useState<InfluencerInfo | null>(null);
  const [contentType, setContentType] = useState<ContentType>("FEED");
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    async function loadInfluencer() {
      try {
        const res = await fetch(`/api/influencers/${username}`);
        if (res.ok) {
          const data = await res.json();
          setInfluencer(data);
        } else {
          setInfluencer({ ...MOCK_INFLUENCER, username });
        }
      } catch {
        setInfluencer({ ...MOCK_INFLUENCER, username });
      } finally {
        setLoading(false);
      }
    }
    loadInfluencer();
  }, [username]);

  async function runPrediction(type: ContentType) {
    if (!influencer) return;
    setPredicting(true);
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: influencer.username, contentType: type }),
      });
      if (res.ok) {
        const data = await res.json();
        setPrediction(data);
      } else {
        setPrediction(getMockPrediction(type, influencer));
      }
    } catch {
      setPrediction(getMockPrediction(type, influencer));
    } finally {
      setPredicting(false);
    }
  }

  function handleContentTypeChange(type: ContentType) {
    setContentType(type);
    runPrediction(type);
  }

  useEffect(() => {
    if (influencer) {
      runPrediction(contentType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [influencer]);

  if (loading) {
    return (
      <DashboardLayout role="brand">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!influencer) {
    return (
      <DashboardLayout role="brand">
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <p>인플루언서를 찾을 수 없습니다.</p>
          <Link href="/search" className="mt-4 text-brand-purple hover:underline text-sm">검색으로 돌아가기</Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="brand">
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Back */}
        <Link href="/search" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          검색으로 돌아가기
        </Link>

        {/* Influencer Info */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {influencer.displayName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold text-foreground">{influencer.displayName}</h1>
                <span className="text-sm text-muted-foreground">@{influencer.username}</span>
                <span className="px-2 py-0.5 rounded bg-brand-purple/15 text-brand-purple text-xs">{influencer.platform}</span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <span className="text-muted-foreground">팔로워 <span className="text-foreground font-semibold">{formatNumber(influencer.followers)}</span></span>
                <span className="text-muted-foreground">참여율 <span className="text-green-400 font-semibold">{influencer.er}%</span></span>
              </div>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {influencer.categories.map((cat) => (
                  <span key={cat} className="px-2 py-0.5 rounded-full bg-background border border-border text-xs text-muted-foreground">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Content Type Selector */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-3">콘텐츠 유형 선택</h2>
          <div className="flex gap-2">
            {(["FEED", "REEL", "STORY"] as ContentType[]).map((type) => (
              <button
                key={type}
                onClick={() => handleContentTypeChange(type)}
                disabled={predicting}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all disabled:opacity-50 ${
                  contentType === type
                    ? "bg-brand-purple border-brand-purple text-white"
                    : "bg-background border-border text-muted-foreground hover:border-brand-purple/50"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Prediction Results */}
        {predicting ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">AI가 성과를 예측하고 있습니다...</p>
            </div>
          </div>
        ) : prediction ? (
          <div className="space-y-6">
            {/* Gauge Charts */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground text-center mb-2">예상 도달</p>
                <GaugeChart
                  value={Math.round((prediction.estimatedReach.min + prediction.estimatedReach.max) / 2)}
                  min={0}
                  max={influencer.followers}
                  label="명"
                />
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {formatNumber(prediction.estimatedReach.min)} ~ {formatNumber(prediction.estimatedReach.max)}
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground text-center mb-2">예상 참여율</p>
                <GaugeChart
                  value={(prediction.estimatedEngagementRate.min + prediction.estimatedEngagementRate.max) / 2}
                  min={0}
                  max={15}
                  label="%"
                  unit="%"
                />
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {prediction.estimatedEngagementRate.min}% ~ {prediction.estimatedEngagementRate.max}%
                </p>
              </div>
            </div>

            {/* Prediction Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">예상 참여</p>
                <p className="text-lg font-bold text-foreground">
                  {formatNumber(prediction.estimatedEngagement.min)} ~ {formatNumber(prediction.estimatedEngagement.max)}
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground mb-1">예상 원고료 범위</p>
                <p className="text-lg font-bold text-foreground">
                  ₩{(prediction.estimatedFeeRange.min / 10000).toFixed(0)}만 ~ ₩{(prediction.estimatedFeeRange.max / 10000).toFixed(0)}만
                </p>
              </div>
            </div>

            {/* CPR / CPE */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">효율 지표</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">CPR (도달당 비용)</p>
                  <p className="text-xl font-bold text-foreground">₩{prediction.cpr}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">CPE (참여당 비용)</p>
                  <p className="text-xl font-bold text-foreground">₩{prediction.cpe}</p>
                </div>
              </div>
            </div>

            {/* Confidence Score */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-foreground">AI 예측 신뢰도</h3>
                <span className={`text-sm font-bold ${
                  prediction.confidenceScore >= 80 ? "text-green-400"
                  : prediction.confidenceScore >= 60 ? "text-yellow-400"
                  : "text-red-400"
                }`}>
                  {prediction.confidenceScore}%
                </span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div
                  className="bg-gradient-brand h-2 rounded-full transition-all duration-700"
                  style={{ width: `${prediction.confidenceScore}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {prediction.confidenceScore >= 80
                  ? "높은 신뢰도: 과거 데이터가 충분하여 예측 정확도가 높습니다."
                  : prediction.confidenceScore >= 60
                  ? "보통 신뢰도: 예측 결과를 참고용으로 활용하세요."
                  : "낮은 신뢰도: 데이터 부족으로 예측 정확도가 낮을 수 있습니다."}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
