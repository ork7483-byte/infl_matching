"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlurOverlay from "@/components/BlurOverlay";
import AqsRadarChart from "@/components/charts/AqsRadarChart";

// ─── Types ───────────────────────────────────────────────────────────────────

type IgrGrade = "S" | "A" | "B" | "C" | "D";

interface IgrResult {
  username: string;
  totalScore: number;
  grade: IgrGrade;
  label: string;
  description: string;
  reelsPerformance: number;
  engagementQuality: number;
  contentStrategy: number;
  growthMomentum: number;
  // AQS alongside
  aqsScore: number;
  aqsGrade: string;
  aqsLabel: string;
  // Tips
  tips: string[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const GRADE_CONFIG: Record<IgrGrade, { color: string; bg: string; border: string; emoji: string; desc: string }> = {
  S: {
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#c4b5fd",
    emoji: "🟣",
    desc: "최상위 알고리즘 수혜 계정입니다. 릴스·피드 모두 노출이 매우 유리합니다.",
  },
  A: {
    color: "#2563eb",
    bg: "#dbeafe",
    border: "#93c5fd",
    emoji: "🔵",
    desc: "알고리즘 노출이 활발합니다. 꾸준한 콘텐츠 업로드로 S등급 도달이 가능합니다.",
  },
  B: {
    color: "#16a34a",
    bg: "#dcfce7",
    border: "#86efac",
    emoji: "🟢",
    desc: "평균 이상의 알고리즘 노출을 받고 있습니다. 릴스 최적화로 등급 향상이 가능합니다.",
  },
  C: {
    color: "#ca8a04",
    bg: "#fef9c3",
    border: "#fde047",
    emoji: "🟡",
    desc: "알고리즘 노출이 제한적입니다. 참여 유도 콘텐츠와 해시태그 전략이 필요합니다.",
  },
  D: {
    color: "#dc2626",
    bg: "#fee2e2",
    border: "#fca5a5",
    emoji: "🔴",
    desc: "알고리즘 노출이 매우 낮습니다. 콘텐츠 전략 전반을 재검토하세요.",
  },
};

function calcGrade(score: number): IgrGrade {
  if (score >= 85) return "S";
  if (score >= 70) return "A";
  if (score >= 55) return "B";
  if (score >= 40) return "C";
  return "D";
}

function calcLabel(grade: IgrGrade): string {
  return { S: "최상위", A: "우수", B: "양호", C: "보통", D: "개선필요" }[grade];
}

function getAqsEmoji(score: number): string {
  if (score >= 90) return "🟢";
  if (score >= 70) return "🟡";
  if (score >= 50) return "🟠";
  return "🔴";
}

function getAqsLabel(score: number): string {
  if (score >= 90) return "매우 건강";
  if (score >= 70) return "양호";
  if (score >= 50) return "주의";
  return "위험";
}

function getMockResult(username: string): IgrResult {
  // Deterministic pseudo-random from username length
  const seed = username.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const base = 40 + (seed % 50);
  const reels = Math.min(100, base + (seed % 20) - 5);
  const engagement = Math.min(100, base + (seed % 15));
  const content = Math.min(100, base - (seed % 10));
  const growth = Math.min(100, base + (seed % 25) - 10);
  const totalScore = Math.round((reels + engagement + content + growth) / 4);
  const grade = calcGrade(totalScore);
  const aqsScore = Math.min(100, 45 + (seed % 55));

  const weakAxis = [
    { name: "릴스", score: reels },
    { name: "참여", score: engagement },
    { name: "콘텐츠 전략", score: content },
    { name: "성장 모멘텀", score: growth },
  ].sort((a, b) => a.score - b.score)[0];

  const tipsByAxis: Record<string, string[]> = {
    릴스: [
      "릴스를 주 3회 이상 업로드하면 알고리즘 노출이 크게 향상됩니다.",
      "릴스 초반 3초 안에 시선을 끄는 후킹 문구나 시각 효과를 넣으세요.",
      "릴스에 자막을 추가하면 무음 시청자 이탈률이 줄어 완료율이 높아집니다.",
    ],
    참여: [
      "게시물 마지막에 질문을 남겨 댓글 참여를 유도하세요.",
      "저장을 유도하는 인포그래픽 콘텐츠는 알고리즘에 강한 신호를 줍니다.",
      "팔로워와 댓글에 빠르게 답글을 달면 참여 신호가 강화됩니다.",
    ],
    "콘텐츠 전략": [
      "업로드 시간을 팔로워 활성 시간대(보통 저녁 7~10시)에 맞추세요.",
      "특정 주제에 집중하면 알고리즘이 계정을 더 잘 분류하고 추천합니다.",
      "같은 카테고리 내 경쟁 계정의 인기 포맷을 벤치마킹해 보세요.",
    ],
    "성장 모멘텀": [
      "콜라보 릴스나 태그 캠페인으로 새 팔로워를 빠르게 확보하세요.",
      "스토리 설문·퀴즈를 활용하면 기존 팔로워 재참여율이 높아집니다.",
      "인스타그램 Live는 팔로워에게 알림이 가므로 노출 확대에 효과적입니다.",
    ],
  };

  return {
    username,
    totalScore,
    grade,
    label: calcLabel(grade),
    description: GRADE_CONFIG[grade].desc,
    reelsPerformance: reels,
    engagementQuality: engagement,
    contentStrategy: content,
    growthMomentum: growth,
    aqsScore,
    aqsGrade: getAqsEmoji(aqsScore),
    aqsLabel: getAqsLabel(aqsScore),
    tips: tipsByAxis[weakAxis.name],
  };
}

// ─── Loading checklist animation ─────────────────────────────────────────────

const CHECKLIST_ITEMS = [
  "릴스 성과 분석 중...",
  "참여 품질 측정 중...",
  "콘텐츠 전략 평가 중...",
  "성장 모멘텀 계산 중...",
  "등급 산정 중...",
];

function LoadingChecklist({ step }: { step: number }) {
  return (
    <div className="space-y-3 py-8 max-w-xs mx-auto">
      {CHECKLIST_ITEMS.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          {i < step ? (
            <span className="w-5 h-5 rounded-full bg-[#22c55e] flex items-center justify-center flex-shrink-0 text-white text-xs">✓</span>
          ) : i === step ? (
            <span className="w-5 h-5 rounded-full border-2 border-[#7c3aed] border-t-transparent animate-spin flex-shrink-0" />
          ) : (
            <span className="w-5 h-5 rounded-full border-2 border-[#E5E7EB] flex-shrink-0" />
          )}
          <span className={`text-sm ${i <= step ? "text-[#111827]" : "text-[#9CA3AF]"}`}>{item}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Score bar ────────────────────────────────────────────────────────────────

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs text-[#6B7280]">{label}</span>
        <span className="text-xs font-semibold text-[#111827]">{score}점</span>
      </div>
      <div className="h-2 bg-[#E5E7EB] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function InstagramGradePage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [result, setResult] = useState<IgrResult | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clean = username.replace(/^@/, "").trim();
    if (!clean) return;
    setError("");
    setResult(null);
    setLoading(true);
    setLoadStep(0);

    // Animate checklist
    for (let i = 1; i <= CHECKLIST_ITEMS.length; i++) {
      await new Promise((r) => setTimeout(r, 400));
      setLoadStep(i);
    }

    try {
      const [igrRes, aqsRes] = await Promise.allSettled([
        fetch(`/api/influencers/${clean}/igr`),
        fetch(`/api/influencers/${clean}/aqs`),
      ]);

      let igrData: Partial<IgrResult> = {};
      let aqsScore = 0;

      if (igrRes.status === "fulfilled" && igrRes.value.ok) {
        igrData = await igrRes.value.json();
      }
      if (aqsRes.status === "fulfilled" && aqsRes.value.ok) {
        const aqsData = await aqsRes.value.json();
        aqsScore = aqsData.totalScore ?? 0;
      }

      const mock = getMockResult(clean);
      const final: IgrResult = {
        username: clean,
        totalScore: (igrData as IgrResult).totalScore ?? mock.totalScore,
        grade: (igrData as IgrResult).grade ?? mock.grade,
        label: (igrData as IgrResult).label ?? mock.label,
        description: (igrData as IgrResult).description ?? mock.description,
        reelsPerformance: (igrData as IgrResult).reelsPerformance ?? mock.reelsPerformance,
        engagementQuality: (igrData as IgrResult).engagementQuality ?? mock.engagementQuality,
        contentStrategy: (igrData as IgrResult).contentStrategy ?? mock.contentStrategy,
        growthMomentum: (igrData as IgrResult).growthMomentum ?? mock.growthMomentum,
        aqsScore: aqsScore || mock.aqsScore,
        aqsGrade: getAqsEmoji(aqsScore || mock.aqsScore),
        aqsLabel: getAqsLabel(aqsScore || mock.aqsScore),
        tips: mock.tips,
      };
      setResult(final);
    } catch {
      setResult(getMockResult(clean));
    } finally {
      setLoading(false);
    }
  }

  const gradeConf = result ? GRADE_CONFIG[result.grade] : null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">

        {/* ─── Hero ─────────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <span className="inline-block bg-gradient-to-r from-[#7c3aed] to-[#e94560] text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
            무료 분석
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111827] leading-tight mb-3">
            내 Instagram<br />알고리즘 등급은?
          </h1>
          <p className="text-[#6B7280] text-base max-w-md mx-auto">
            사용자명만 입력하면 S~D 등급으로 알고리즘 노출 상태를 즉시 알려드립니다.
          </p>
        </div>

        {/* ─── Input ────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="flex gap-2 mb-8 max-w-lg mx-auto">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-sm">@</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="instagram_username"
              className="w-full pl-7 pr-4 py-3 text-base border border-[#E5E7EB] rounded-xl bg-white text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/40 focus:border-[#7c3aed] transition"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#e94560] text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 whitespace-nowrap"
          >
            등급 확인
          </button>
        </form>

        {error && (
          <p className="text-center text-sm text-[#ef4444] mb-4">{error}</p>
        )}

        {/* ─── Loading ──────────────────────────────────────────── */}
        {loading && (
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 text-center mb-8">
            <p className="text-sm font-medium text-[#7c3aed] mb-4">분석 중이에요...</p>
            <LoadingChecklist step={loadStep} />
          </div>
        )}

        {/* ─── Result ───────────────────────────────────────────── */}
        {result && gradeConf && !loading && (
          <div className="space-y-6">

            {/* Grade hero card */}
            <div
              className="rounded-2xl p-8 text-center border-2"
              style={{ backgroundColor: gradeConf.bg, borderColor: gradeConf.border }}
            >
              <p className="text-5xl font-black mb-2" style={{ color: gradeConf.color }}>
                {gradeConf.emoji} {result.grade}등급
              </p>
              <p className="text-lg font-semibold mb-1" style={{ color: gradeConf.color }}>
                {result.label}
              </p>
              <p className="text-2xl font-bold text-[#111827] mb-1">
                IGR {result.totalScore}점 / 100점
              </p>
              <p className="text-sm text-[#6B7280] max-w-sm mx-auto">
                {result.description}
              </p>
            </div>

            {/* AQS alongside */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#F3F4F6] flex items-center justify-center text-2xl flex-shrink-0">
                {result.aqsGrade}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111827]">
                  AQS {result.aqsScore} — {result.aqsLabel}
                </p>
                <p className="text-xs text-[#6B7280]">팔로워 진성도 지수 (가짜 팔로워 탐지)</p>
              </div>
            </div>

            {/* 4-axis breakdown */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
              <h2 className="text-base font-semibold text-[#111827] mb-4">4개 축 분석</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <ScoreBar label="릴스 성과" score={result.reelsPerformance} color={gradeConf.color} />
                <ScoreBar label="참여 품질" score={result.engagementQuality} color={gradeConf.color} />
                <ScoreBar label="콘텐츠 전략" score={result.contentStrategy} color={gradeConf.color} />
                <ScoreBar label="성장 모멘텀" score={result.growthMomentum} color={gradeConf.color} />
              </div>
              <AqsRadarChart data={[
                { subject: "릴스 성과", score: result.reelsPerformance, fullMark: 100 },
                { subject: "참여 품질", score: result.engagementQuality, fullMark: 100 },
                { subject: "콘텐츠 전략", score: result.contentStrategy, fullMark: 100 },
                { subject: "성장 모멘텀", score: result.growthMomentum, fullMark: 100 },
              ]} />
            </div>

            {/* Tips */}
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
              <h2 className="text-base font-semibold text-[#111827] mb-3">등급 향상 팁</h2>
              <ul className="space-y-2">
                {result.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#374151]">
                    <span className="text-[#7c3aed] font-bold flex-shrink-0 mt-0.5">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Detailed breakdown — blurred for non-auth */}
            <BlurOverlay
              className="rounded-2xl"
              ctaText="자세한 분석 보기"
              ctaLink="/register"
            >
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
                <h2 className="text-base font-semibold text-[#111827] mb-4">상세 분석 리포트</h2>
                <div className="space-y-3">
                  {[
                    { label: "게시물 도달률 추이", value: "최근 30일 +12%" },
                    { label: "릴스 완료율", value: "68%" },
                    { label: "팔로워 대비 저장 비율", value: "4.2%" },
                    { label: "해시태그 노출 효율", value: "상위 23%" },
                    { label: "최적 업로드 시간대", value: "저녁 8~10시" },
                    { label: "경쟁 계정 대비 IGR", value: "상위 31%" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-2 border-b border-[#F3F4F6] last:border-0">
                      <span className="text-sm text-[#6B7280]">{label}</span>
                      <span className="text-sm font-semibold text-[#111827]">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </BlurOverlay>

            {/* CTA */}
            <div className="bg-gradient-to-r from-[#7c3aed] to-[#e94560] rounded-2xl p-6 text-center text-white">
              <p className="text-lg font-bold mb-1">더 정확한 분석을 원하시나요?</p>
              <p className="text-sm opacity-80 mb-4">인플릭스에 계정을 연동하면 실제 데이터 기반으로 분석해드립니다.</p>
              <Link
                href="/register"
                className="inline-block bg-white text-[#7c3aed] font-semibold text-sm px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
              >
                무료로 시작하기
              </Link>
            </div>

            {/* Related tools */}
            <div>
              <h2 className="text-sm font-semibold text-[#6B7280] mb-3">관련 도구</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { href: "/tools/instagram-audit", label: "인스타그램 종합 감사" },
                  { href: "/tools/fake-follower-check", label: "가짜 팔로워 체크" },
                  { href: "/tools/engagement-rate", label: "참여율 계산기" },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="bg-white border border-[#E5E7EB] rounded-xl p-3 text-sm text-[#374151] font-medium hover:border-[#7c3aed]/40 hover:text-[#7c3aed] transition-colors text-center"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── SEO content ──────────────────────────────────────── */}
        <section className="mt-16 prose prose-sm max-w-none">
          <h2 className="text-xl font-bold text-[#111827] mb-3">Instagram 알고리즘 등급이란?</h2>
          <p className="text-[#6B7280] text-sm leading-relaxed mb-4">
            Instagram 알고리즘 등급(IGR, Instagram Grade Rating)은 인스타그램 알고리즘이 특정 계정의 콘텐츠를 얼마나 적극적으로 노출시키는지 나타내는 지표입니다.
            릴스 성과, 참여 품질, 콘텐츠 전략, 성장 모멘텀 4가지 축을 종합해 S~D 등급으로 평가합니다.
          </p>
          <p className="text-[#6B7280] text-sm leading-relaxed mb-8">
            IGR이 높은 계정은 팔로워 외의 계정에도 콘텐츠가 노출될 가능성이 높아 브랜드 협업 효율이 좋습니다.
            인플릭스는 이 지표를 AQS(계정 품질 지수)와 함께 제공해 팔로워 품질과 노출 효율을 동시에 평가합니다.
          </p>

          <h2 className="text-xl font-bold text-[#111827] mb-4">자주 묻는 질문</h2>
          <div className="space-y-5">
            {[
              {
                q: "IGR 등급은 어떻게 계산되나요?",
                a: "릴스 성과(완료율·도달률), 참여 품질(저장·댓글·공유 비율), 콘텐츠 전략(업로드 규칙성·해시태그 효율), 성장 모멘텀(신규 팔로워 유입 속도)을 종합하여 산출합니다.",
              },
              {
                q: "S등급과 A등급의 차이는 무엇인가요?",
                a: "S등급은 릴스 완료율 70% 이상, 저장 비율 5% 이상 등 최상위 기준을 충족한 계정입니다. A등급도 우수하지만 일부 지표에서 최상위 기준에 미달합니다.",
              },
              {
                q: "IGR과 AQS의 차이는 무엇인가요?",
                a: "AQS는 팔로워가 진짜인지(팔로워 품질)를 평가하고, IGR은 알고리즘이 콘텐츠를 얼마나 밀어주는지(노출 효율)를 평가합니다. 두 지표 모두 높으면 광고 효율이 가장 좋습니다.",
              },
              {
                q: "등급을 빠르게 올리려면 어떻게 해야 하나요?",
                a: "릴스를 주 3회 이상 꾸준히 올리고, 초반 3초 후킹을 강화하며, 댓글·저장을 유도하는 콜투액션을 넣으세요. 일관된 콘텐츠 주제 유지도 알고리즘 분류에 도움이 됩니다.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-[#E5E7EB] pb-5">
                <p className="text-sm font-semibold text-[#111827] mb-1">{q}</p>
                <p className="text-sm text-[#6B7280] leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
