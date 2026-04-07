"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AqsRadarChart from "@/components/charts/AqsRadarChart";
import BlurOverlay from "@/components/BlurOverlay";

interface Props {
  mode: "brand" | "creator";
}

type Grade = "S" | "A" | "B" | "C" | "D";

const GRADE_COLOR: Record<Grade, string> = {
  S: "#7c3aed",
  A: "#2563eb",
  B: "#16a34a",
  C: "#ca8a04",
  D: "#dc2626",
};

const GRADE_BG: Record<Grade, string> = {
  S: "rgba(124,58,237,0.12)",
  A: "rgba(37,99,235,0.12)",
  B: "rgba(22,163,74,0.12)",
  C: "rgba(202,138,4,0.12)",
  D: "rgba(220,38,38,0.12)",
};

const GRADE_MULTIPLIER: Record<Grade, number> = {
  S: 1.5,
  A: 1.3,
  B: 1.0,
  C: 0.8,
  D: 0.6,
};

const GRADE_DESCRIPTION: Record<Grade, string> = {
  S: "최상위 인플루언서 — 높은 진성 팔로워와 압도적인 영향력",
  A: "상위권 인플루언서 — 강한 참여율과 신뢰할 수 있는 영향력",
  B: "중상위 인플루언서 — 안정적인 성과와 꾸준한 성장세",
  C: "중위 인플루언서 — 성장 가능성 있으나 개선 여지 있음",
  D: "초기 단계 — 팔로워 기반 또는 참여율 향상이 필요함",
};

// Base prices (KRW) for B grade
const BASE_PRICES = {
  feed: { min: 300_000, max: 500_000 },
  reels: { min: 500_000, max: 800_000 },
  story: { min: 100_000, max: 200_000 },
};

interface MockResult {
  grade: Grade;
  aqsScore: number;
  igrScore: number;
  aqsAxes: { subject: string; score: number; fullMark: number; explanation: string }[];
  igrAxes: { subject: string; score: number; fullMark: number; explanation: string }[];
}

function getMockResult(username: string): MockResult {
  // deterministic pseudo-random from username length
  const seed = username.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rand = (min: number, max: number) => min + (seed % (max - min + 1));

  const aqs1 = rand(50, 95);
  const aqs2 = rand(45, 90);
  const aqs3 = rand(55, 92);
  const aqs4 = rand(40, 88);
  const aqsScore = Math.round((aqs1 + aqs2 + aqs3 + aqs4) / 4);

  const igr1 = rand(48, 93);
  const igr2 = rand(52, 95);
  const igr3 = rand(44, 88);
  const igr4 = rand(50, 90);
  const igrScore = Math.round((igr1 + igr2 + igr3 + igr4) / 4);

  const overall = Math.round(aqsScore * 0.5 + igrScore * 0.5);
  const grade: Grade =
    overall >= 88 ? "S" : overall >= 75 ? "A" : overall >= 60 ? "B" : overall >= 45 ? "C" : "D";

  return {
    grade,
    aqsScore,
    igrScore,
    aqsAxes: [
      { subject: "콘텐츠 품질", score: aqs1, fullMark: 100, explanation: "콘텐츠 완성도와 일관성이 우수합니다" },
      { subject: "팔로워 진성", score: aqs2, fullMark: 100, explanation: "실제 팔로워 비율이 평균 이상입니다" },
      { subject: "도달 효율", score: aqs3, fullMark: 100, explanation: "노출 대비 실제 도달이 효율적입니다" },
      { subject: "브랜드 안전", score: aqs4, fullMark: 100, explanation: "브랜드 협업에 적합한 콘텐츠 기조입니다" },
    ],
    igrAxes: [
      { subject: "좋아요율", score: igr1, fullMark: 100, explanation: "팔로워 대비 좋아요 비율이 양호합니다" },
      { subject: "댓글 품질", score: igr2, fullMark: 100, explanation: "댓글의 진성도와 관여도가 높습니다" },
      { subject: "저장/공유", score: igr3, fullMark: 100, explanation: "콘텐츠 저장 및 공유율이 준수합니다" },
      { subject: "스토리 반응", score: igr4, fullMark: 100, explanation: "스토리 링크 클릭율이 평균 수준입니다" },
    ],
  };
}

const FREE_USAGE_KEY = "inflixFreeUsage";
const MAX_FREE = 3;

export default function InfluencerValueReport({ mode }: Props) {
  const { data: session } = useSession();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MockResult | null>(null);
  const [freeUsage, setFreeUsage] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = parseInt(localStorage.getItem(FREE_USAGE_KEY) || "0", 10);
      setFreeUsage(stored);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    if (!session && freeUsage >= MAX_FREE) {
      setError("무료 사용 횟수(3회)를 모두 사용했습니다. 로그인하면 무제한으로 사용할 수 있어요.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    // Simulate API latency
    await new Promise((r) => setTimeout(r, 1800));

    const mockData = getMockResult(username.trim());
    setResult(mockData);
    setLoading(false);

    if (!session) {
      const next = freeUsage + 1;
      localStorage.setItem(FREE_USAGE_KEY, String(next));
      setFreeUsage(next);
    }
  };

  const priceRange = (base: { min: number; max: number }, multiplier: number) => ({
    min: Math.round((base.min * multiplier) / 10000) * 10000,
    max: Math.round((base.max * multiplier) / 10000) * 10000,
  });

  const fmt = (n: number) => `₩${n.toLocaleString("ko-KR")}`;

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Input form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <p className="text-[#6B7280] text-sm mb-3 text-center">
          {mode === "brand"
            ? "이 인플루언서의 등급과 적정 단가를 확인하세요"
            : "내 등급과 예상 수익을 확인하세요"}
        </p>
        <div className="flex gap-2 flex-col sm:flex-row">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Instagram 아이디 입력 (예: inflix_kr)"
            className="flex-1 border border-[#E5E7EB] rounded-xl px-4 py-3 text-base text-[#111827] bg-white focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] min-h-[48px]"
          />
          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="bg-gradient-to-r from-[#7c3aed] to-[#e94560] text-white font-semibold px-6 py-3 rounded-xl text-base hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] whitespace-nowrap cursor-pointer"
          >
            {mode === "brand" ? "등급 확인하기" : "내 등급 확인하기"}
          </button>
        </div>

        {/* Free usage counter */}
        {!session && (
          <div className="flex justify-end mt-2">
            <span className="text-xs text-[#6B7280]">
              무료 사용:{" "}
              <span className={freeUsage >= MAX_FREE ? "text-red-500 font-semibold" : "text-[#7c3aed] font-semibold"}>
                {freeUsage}/{MAX_FREE}
              </span>
              {freeUsage < MAX_FREE && " — 로그인하면 무제한"}
            </span>
          </div>
        )}

        {error && (
          <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
        )}
      </form>

      {/* Loading animation */}
      {loading && (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8">
          <p className="text-center text-[#111827] font-semibold mb-6">분석 중...</p>
          <div className="space-y-3">
            {[
              "팔로워 데이터 수집 중",
              "AQS 점수 산출 중",
              "IGR 참여율 분석 중",
              "등급 및 단가 계산 중",
            ].map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full border-2 border-[#7c3aed] border-t-transparent animate-spin"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
                <span className="text-sm text-[#6B7280]">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-6">
          {/* Step 1: 등급 */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#7c3aed] bg-[#7c3aed]/10 px-3 py-1 rounded-full">
                Step 1 — 등급 (무료)
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Grade badge */}
              <div
                className="flex-shrink-0 w-28 h-28 rounded-3xl flex items-center justify-center text-6xl font-black"
                style={{ backgroundColor: GRADE_BG[result.grade], color: GRADE_COLOR[result.grade] }}
              >
                {result.grade}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-2xl font-bold text-[#111827] mb-1">@{username}</h3>
                <p className="text-[#6B7280] mb-4">{GRADE_DESCRIPTION[result.grade]}</p>
                <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                  <div className="text-center">
                    <p className="text-xs text-[#6B7280] mb-1">AQS 점수</p>
                    <p className="text-xl font-bold" style={{ color: GRADE_COLOR[result.grade] }}>
                      {result.aqsScore}
                    </p>
                  </div>
                  <div className="w-px bg-[#E5E7EB] hidden sm:block" />
                  <div className="text-center">
                    <p className="text-xs text-[#6B7280] mb-1">IGR 점수</p>
                    <p className="text-xl font-bold" style={{ color: GRADE_COLOR[result.grade] }}>
                      {result.igrScore}
                    </p>
                  </div>
                  <div className="w-px bg-[#E5E7EB] hidden sm:block" />
                  <div className="text-center">
                    <p className="text-xs text-[#6B7280] mb-1">종합 점수</p>
                    <p className="text-xl font-bold text-[#111827]">
                      {Math.round(result.aqsScore * 0.5 + result.igrScore * 0.5)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: 산출 근거 */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#7c3aed] bg-[#7c3aed]/10 px-3 py-1 rounded-full">
                Step 2 — 산출 근거 (무료)
              </span>
            </div>

            {/* AQS */}
            <h4 className="font-semibold text-[#111827] mb-3">AQS — 오디언스 품질 점수</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <AqsRadarChart
                data={result.aqsAxes.map(({ subject, score, fullMark }) => ({
                  subject,
                  score,
                  fullMark,
                }))}
              />
              <div className="space-y-3">
                {result.aqsAxes.map((ax) => (
                  <div key={ax.subject} className="flex items-start gap-3">
                    <span className="mt-0.5 text-base">
                      {ax.score >= 70 ? "✅" : "⚠️"}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#111827]">{ax.subject}</span>
                        <span
                          className="text-sm font-bold"
                          style={{ color: ax.score >= 70 ? "#16a34a" : "#ca8a04" }}
                        >
                          {ax.score}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7280]">{ax.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* IGR */}
            <h4 className="font-semibold text-[#111827] mb-3">IGR — 참여율 지수</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AqsRadarChart
                data={result.igrAxes.map(({ subject, score, fullMark }) => ({
                  subject,
                  score,
                  fullMark,
                }))}
              />
              <div className="space-y-3">
                {result.igrAxes.map((ax) => (
                  <div key={ax.subject} className="flex items-start gap-3">
                    <span className="mt-0.5 text-base">
                      {ax.score >= 70 ? "✅" : "⚠️"}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#111827]">{ax.subject}</span>
                        <span
                          className="text-sm font-bold"
                          style={{ color: ax.score >= 70 ? "#16a34a" : "#ca8a04" }}
                        >
                          {ax.score}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7280]">{ax.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3: 예상 단가 */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
            <div className="p-6 sm:p-8 pb-4">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#7c3aed] bg-[#7c3aed]/10 px-3 py-1 rounded-full">
                  Step 3 — 예상 단가
                </span>
                {!session && (
                  <span className="text-xs font-semibold text-white bg-[#e94560] px-2 py-0.5 rounded-full">
                    로그인 필요
                  </span>
                )}
              </div>
            </div>

            <BlurOverlay
              ctaText="무료 가입하고 단가 확인하기"
              ctaLink="/signup"
              blurIntensity={6}
              className="px-6 sm:px-8 pb-8"
            >
              <div>
                {(() => {
                  const m = GRADE_MULTIPLIER[result.grade];
                  const feed = priceRange(BASE_PRICES.feed, m);
                  const reels = priceRange(BASE_PRICES.reels, m);
                  const story = priceRange(BASE_PRICES.story, m);
                  return (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-3 border-b border-[#F3F4F6]">
                        <span className="text-sm font-medium text-[#111827]">피드 게시물</span>
                        <span className="text-sm font-semibold text-[#7c3aed]">
                          {fmt(feed.min)} ~ {fmt(feed.max)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-[#F3F4F6]">
                        <span className="text-sm font-medium text-[#111827]">릴스</span>
                        <span className="text-sm font-semibold text-[#7c3aed]">
                          {fmt(reels.min)} ~ {fmt(reels.max)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3">
                        <span className="text-sm font-medium text-[#111827]">스토리</span>
                        <span className="text-sm font-semibold text-[#7c3aed]">
                          {fmt(story.min)} ~ {fmt(story.max)}
                        </span>
                      </div>
                      <p className="text-xs text-[#9CA3AF] pt-2">
                        * 등급 {result.grade} 기준 (배율 ×{m}) 적용. 실제 단가는 팔로워 수, 카테고리, 캠페인 목표에 따라 달라질 수 있습니다.
                      </p>
                    </div>
                  );
                })()}
              </div>
            </BlurOverlay>
          </div>
        </div>
      )}
    </div>
  );
}
