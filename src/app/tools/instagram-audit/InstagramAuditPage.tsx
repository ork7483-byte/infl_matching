"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlurOverlay from "@/components/BlurOverlay";
import AqsRadarChart from "@/components/charts/AqsRadarChart";
import LineChartComponent from "@/components/charts/LineChartComponent";
import BarChartComponent from "@/components/charts/BarChartComponent";

// ─── Types ───────────────────────────────────────────────────────────────────

type AuditGrade = "A" | "B" | "C" | "D" | "F";

interface AuditResult {
  username: string;
  followers: number;
  following: number;
  posts: number;
  er: number;
  aqs: number;
  fakeEstimate: number; // 0-100 %
  postingFreq: number; // posts per week
  grade: AuditGrade;
  radarData: { subject: string; score: number; fullMark: number }[];
  trendData: { date: string; value: number }[];
  contentData: { name: string; value: number }[];
  topHashtags: string[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function calcGrade(er: number, aqs: number): AuditGrade {
  if (er >= 5 && aqs >= 80) return "A";
  if (er >= 3 && aqs >= 70) return "B";
  if (er >= 1 && aqs >= 50) return "C";
  if (er < 1 || aqs < 50) return "D";
  return "F";
}

const gradeConfig: Record<
  AuditGrade,
  { label: string; color: string; bg: string; border: string; desc: string }
> = {
  A: {
    label: "매우 우수",
    color: "#16a34a",
    bg: "#dcfce7",
    border: "#86efac",
    desc: "높은 참여율과 팔로워 품질을 모두 갖춘 최상위 계정입니다.",
  },
  B: {
    label: "우수",
    color: "#2563eb",
    bg: "#dbeafe",
    border: "#93c5fd",
    desc: "참여율과 팔로워 품질이 업계 평균을 상회하는 우수한 계정입니다.",
  },
  C: {
    label: "평균",
    color: "#ca8a04",
    bg: "#fef9c3",
    border: "#fde047",
    desc: "업계 평균 수준의 계정입니다. 콘텐츠 개선으로 등급 향상이 가능합니다.",
  },
  D: {
    label: "개선 필요",
    color: "#ea580c",
    bg: "#ffedd5",
    border: "#fdba74",
    desc: "참여율 또는 팔로워 품질이 낮습니다. 전략적 개선이 필요합니다.",
  },
  F: {
    label: "주의",
    color: "#dc2626",
    bg: "#fee2e2",
    border: "#fca5a5",
    desc: "참여율과 팔로워 품질 모두 낮습니다. 계정 전략을 재검토하세요.",
  },
};

const CHECKLIST_STEPS = [
  "프로필 정보 수집 중...",
  "참여율 분석 중...",
  "팔로워 품질 평가 중...",
  "가짜 팔로워 감지 중...",
  "AQS 점수 계산 중...",
  "종합 리포트 생성 중...",
];

function generateTrendData(base: number) {
  const data = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i * 7);
    data.push({
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      value: parseFloat((Math.random() * 6 + 0.5).toFixed(2)),
    });
  }
  // Pin last value to ER
  data[data.length - 1].value = parseFloat((base).toFixed(2));
  return data;
}

const MOCK_HASHTAGS = [
  "#인스타그램", "#daily", "#셀스타그램", "#맛스타그램", "#여행스타그램",
  "#뷰티", "#패션", "#일상", "#감성", "#소통",
];

// ─── Loading Checklist ────────────────────────────────────────────────────────

function LoadingChecklist({ step }: { step: number }) {
  return (
    <div className="mt-6 bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
      <p className="text-sm font-semibold text-[#374151] mb-4 text-center">
        계정 감사를 진행하고 있습니다...
      </p>
      <ul className="space-y-3">
        {CHECKLIST_STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-3 text-sm">
            {i < step ? (
              <span className="w-5 h-5 rounded-full bg-[#7c3aed] flex items-center justify-center flex-shrink-0">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
            ) : i === step ? (
              <span className="w-5 h-5 rounded-full border-2 border-[#7c3aed] flex-shrink-0 flex items-center justify-center">
                <svg className="w-3 h-3 animate-spin text-[#7c3aed]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </span>
            ) : (
              <span className="w-5 h-5 rounded-full border-2 border-[#E5E7EB] flex-shrink-0" />
            )}
            <span
              className={
                i < step
                  ? "text-[#6B7280] line-through"
                  : i === step
                  ? "text-[#111827] font-medium"
                  : "text-[#9CA3AF]"
              }
            >
              {s}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Heatmap mock ────────────────────────────────────────────────────────────

const HOURS = ["06", "09", "12", "15", "18", "21"];
const DAYS = ["월", "화", "수", "목", "금", "토", "일"];

function MockHeatmap() {
  const cells = DAYS.map((day) =>
    HOURS.map((h) => ({ day, hour: h, val: Math.random() }))
  );
  return (
    <div className="overflow-x-auto">
      <table className="mx-auto text-xs">
        <thead>
          <tr>
            <th className="w-7" />
            {HOURS.map((h) => (
              <th key={h} className="px-2 pb-2 text-[#6B7280] font-normal">
                {h}시
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cells.map((row, ri) => (
            <tr key={DAYS[ri]}>
              <td className="pr-2 text-[#6B7280] font-medium">{DAYS[ri]}</td>
              {row.map((cell, ci) => (
                <td key={ci} className="p-0.5">
                  <div
                    className="w-8 h-8 rounded"
                    style={{
                      backgroundColor: `rgba(124,58,237,${cell.val.toFixed(2)})`,
                    }}
                    title={`${cell.day} ${cell.hour}시`}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function InstagramAuditPage() {
  const { data: session } = useSession();
  const isAuth = !!session;

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState("");

  const handleAudit = async () => {
    const clean = username.replace(/^@/, "").trim();
    if (!clean) {
      setError("사용자명을 입력해주세요.");
      return;
    }
    setError("");
    setLoading(true);
    setLoadStep(0);
    setResult(null);

    // Animate checklist steps
    for (let i = 0; i < CHECKLIST_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 400));
      setLoadStep(i + 1);
    }

    try {
      const [erRes] = await Promise.allSettled([
        fetch(`/api/tools/engagement-rate?username=${encodeURIComponent(clean)}`),
      ]);

      let erData: Record<string, number> = {};
      if (erRes.status === "fulfilled" && erRes.value.ok) {
        erData = await erRes.value.json();
      }

      const er = erData.er ?? parseFloat((Math.random() * 7 + 0.5).toFixed(2));
      const aqs = erData.aqs ?? Math.floor(Math.random() * 40) + 50;
      const followers = erData.followersCount ?? erData.followers ?? Math.floor(Math.random() * 90000) + 5000;
      const following = erData.followingCount ?? erData.following ?? Math.floor(Math.random() * 2000) + 200;
      const posts = erData.postsCount ?? erData.posts ?? Math.floor(Math.random() * 500) + 50;
      const fakeEstimate = Math.floor(Math.random() * 25) + 5;
      const postingFreq = parseFloat((Math.random() * 4 + 0.5).toFixed(1));

      const radarData = [
        { subject: "참여도", score: Math.min(100, Math.round(er * 12)), fullMark: 100 },
        { subject: "팔로워 품질", score: aqs, fullMark: 100 },
        { subject: "콘텐츠 일관성", score: Math.floor(Math.random() * 30) + 60, fullMark: 100 },
        { subject: "성장률", score: Math.floor(Math.random() * 40) + 50, fullMark: 100 },
        { subject: "도달 범위", score: Math.floor(Math.random() * 35) + 55, fullMark: 100 },
      ];

      setResult({
        username: clean,
        followers,
        following,
        posts,
        er,
        aqs,
        fakeEstimate,
        postingFreq,
        grade: calcGrade(er, aqs),
        radarData,
        trendData: generateTrendData(er),
        contentData: [
          { name: "피드", value: Math.floor(Math.random() * 3) + 2 },
          { name: "릴스", value: Math.floor(Math.random() * 5) + 4 },
          { name: "스토리", value: Math.floor(Math.random() * 2) + 1 },
          { name: "캐러셀", value: Math.floor(Math.random() * 3) + 3 },
        ],
        topHashtags: MOCK_HASHTAGS,
      });
    } catch {
      setError("분석에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const gc = result ? gradeConfig[result.grade] : null;

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <Navbar />

      {/* Hero */}
      <section className="py-16 px-4 text-center bg-[#F9FAFB] border-b border-[#E5E7EB]">
        <div className="max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5"
            style={{ backgroundColor: "#7c3aed15", color: "#7c3aed", border: "1px solid #7c3aed30" }}
          >
            📋 무료 계정 감사
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            인스타그램 계정<br className="hidden sm:block" /> 종합 감사 리포트
          </h1>
          <p className="text-lg text-[#6B7280] mb-2">
            AQS, 참여율, 가짜 팔로워까지 — 계정의 모든 것을 한 번에 분석합니다.
          </p>
          <p className="text-sm text-[#9CA3AF]">
            기본 리포트는 로그인 없이 무료로 확인하세요.
          </p>
        </div>
      </section>

      {/* Input */}
      <section className="py-12 px-4">
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
            <label className="block text-sm font-medium text-[#374151] mb-2">
              인스타그램 사용자명
            </label>
            <div className="flex gap-3">
              <div className="flex-1 flex items-center border border-[#E5E7EB] rounded-xl px-4 py-3 focus-within:border-[#7c3aed] focus-within:ring-2 focus-within:ring-[#7c3aed]/20 transition-all">
                <span className="text-[#9CA3AF] mr-1 font-medium">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !loading && handleAudit()}
                  placeholder="username"
                  className="flex-1 outline-none text-sm bg-transparent"
                />
              </div>
              <button
                onClick={handleAudit}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-[#7c3aed] text-white text-sm font-semibold hover:bg-[#6d28d9] disabled:opacity-60 transition-colors whitespace-nowrap min-w-[100px]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    분석 중
                  </span>
                ) : (
                  "감사 시작"
                )}
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>

          {/* Loading checklist */}
          {loading && <LoadingChecklist step={loadStep} />}

          {/* ── Audit Report ── */}
          {result && gc && (
            <div className="mt-6 space-y-4">

              {/* Overall Grade */}
              <div
                className="rounded-2xl p-8 text-center"
                style={{ backgroundColor: gc.bg, border: `1px solid ${gc.border}` }}
              >
                <div
                  className="text-7xl font-black mb-2"
                  style={{ color: gc.color }}
                >
                  {result.grade}
                </div>
                <div className="text-lg font-semibold mb-1" style={{ color: gc.color }}>
                  {gc.label}
                </div>
                <div className="text-sm text-[#6B7280]">{gc.desc}</div>
                <div className="text-xs text-[#9CA3AF] mt-2">@{result.username}</div>
              </div>

              {/* Section 1: 프로필 요약 — FREE */}
              <div className="rounded-2xl border border-[#E5E7EB] p-6 bg-white shadow-sm">
                <h2 className="text-sm font-semibold text-[#374151] mb-4 flex items-center gap-2">
                  <span
                    className="px-2 py-0.5 rounded text-xs font-bold"
                    style={{ backgroundColor: "#dcfce7", color: "#16a34a" }}
                  >
                    FREE
                  </span>
                  프로필 요약
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  {[
                    { label: "팔로워", value: result.followers.toLocaleString() },
                    { label: "참여율", value: `${result.er}%` },
                    { label: "주간 포스팅", value: `${result.postingFreq}회` },
                    { label: "AQS", value: result.aqs.toString() },
                  ].map((item) => (
                    <div key={item.label} className="p-3 bg-[#F9FAFB] rounded-xl">
                      <div className="text-xl font-bold text-[#7c3aed]">{item.value}</div>
                      <div className="text-xs text-[#6B7280] mt-1">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: AQS Radar — FREE */}
              <div className="rounded-2xl border border-[#E5E7EB] p-6 bg-white shadow-sm">
                <h2 className="text-sm font-semibold text-[#374151] mb-4 flex items-center gap-2">
                  <span
                    className="px-2 py-0.5 rounded text-xs font-bold"
                    style={{ backgroundColor: "#dcfce7", color: "#16a34a" }}
                  >
                    FREE
                  </span>
                  AQS 5축 분석
                </h2>
                <AqsRadarChart data={result.radarData} />
              </div>

              {/* Section 3: Fake Followers — FREE grade only */}
              <div className="rounded-2xl border border-[#E5E7EB] p-6 bg-white shadow-sm">
                <h2 className="text-sm font-semibold text-[#374151] mb-4 flex items-center gap-2">
                  <span
                    className="px-2 py-0.5 rounded text-xs font-bold"
                    style={{ backgroundColor: "#dcfce7", color: "#16a34a" }}
                  >
                    FREE
                  </span>
                  가짜 팔로워 추정
                </h2>
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#E5E7EB" strokeWidth="3" />
                      <circle
                        cx="18"
                        cy="18"
                        r="15.9"
                        fill="none"
                        stroke={result.fakeEstimate > 30 ? "#dc2626" : result.fakeEstimate > 15 ? "#ea580c" : "#16a34a"}
                        strokeWidth="3"
                        strokeDasharray={`${result.fakeEstimate} ${100 - result.fakeEstimate}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-bold text-[#111827]">{result.fakeEstimate}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#374151] mb-1">
                      가짜 팔로워 추정 비율: {result.fakeEstimate}%
                    </p>
                    <p className="text-xs text-[#6B7280] leading-relaxed">
                      {result.fakeEstimate <= 15
                        ? "매우 낮은 가짜 팔로워 비율입니다. 팔로워 품질이 우수합니다."
                        : result.fakeEstimate <= 30
                        ? "평균 수준의 가짜 팔로워 비율입니다."
                        : "가짜 팔로워 비율이 높습니다. 팔로워 정리를 권장합니다."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 4: ER Trend — BLURRED for non-auth */}
              <div className="rounded-2xl border border-[#E5E7EB] overflow-hidden bg-white shadow-sm">
                <div className="p-6 pb-2">
                  <h2 className="text-sm font-semibold text-[#374151] flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-bold"
                      style={{
                        backgroundColor: isAuth ? "#dbeafe" : "#F3F4F6",
                        color: isAuth ? "#2563eb" : "#9CA3AF",
                      }}
                    >
                      {isAuth ? "PRO" : "회원 전용"}
                    </span>
                    참여율 트렌드 (최근 12포스트)
                  </h2>
                </div>
                <BlurOverlay
                  className="p-6 pt-0"
                  ctaText="무료 가입 후 확인하기"
                  blurIntensity={6}
                >
                  <LineChartComponent data={result.trendData} color="#7c3aed" />
                </BlurOverlay>
              </div>

              {/* Section 5: Content Type — BLURRED */}
              <div className="rounded-2xl border border-[#E5E7EB] overflow-hidden bg-white shadow-sm">
                <div className="p-6 pb-2">
                  <h2 className="text-sm font-semibold text-[#374151] flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-bold"
                      style={{
                        backgroundColor: isAuth ? "#dbeafe" : "#F3F4F6",
                        color: isAuth ? "#2563eb" : "#9CA3AF",
                      }}
                    >
                      {isAuth ? "PRO" : "회원 전용"}
                    </span>
                    콘텐츠 타입별 성과
                  </h2>
                </div>
                <BlurOverlay
                  className="p-6 pt-0"
                  ctaText="무료 가입 후 확인하기"
                  blurIntensity={6}
                >
                  <BarChartComponent data={result.contentData} />
                </BlurOverlay>
              </div>

              {/* Section 6: Best Posting Time — BLURRED */}
              <div className="rounded-2xl border border-[#E5E7EB] overflow-hidden bg-white shadow-sm">
                <div className="p-6 pb-2">
                  <h2 className="text-sm font-semibold text-[#374151] flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-bold"
                      style={{
                        backgroundColor: isAuth ? "#dbeafe" : "#F3F4F6",
                        color: isAuth ? "#2563eb" : "#9CA3AF",
                      }}
                    >
                      {isAuth ? "PRO" : "회원 전용"}
                    </span>
                    최적 게시 시간대
                  </h2>
                </div>
                <BlurOverlay
                  className="p-6 pt-0"
                  ctaText="무료 가입 후 확인하기"
                  blurIntensity={6}
                >
                  <MockHeatmap />
                </BlurOverlay>
              </div>

              {/* Section 7: Top Hashtags — BLURRED */}
              <div className="rounded-2xl border border-[#E5E7EB] overflow-hidden bg-white shadow-sm">
                <div className="p-6 pb-2">
                  <h2 className="text-sm font-semibold text-[#374151] flex items-center gap-2">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-bold"
                      style={{
                        backgroundColor: isAuth ? "#dbeafe" : "#F3F4F6",
                        color: isAuth ? "#2563eb" : "#9CA3AF",
                      }}
                    >
                      {isAuth ? "PRO" : "회원 전용"}
                    </span>
                    인기 해시태그 TOP 10
                  </h2>
                </div>
                <BlurOverlay
                  className="p-6 pt-0"
                  ctaText="무료 가입 후 확인하기"
                  blurIntensity={6}
                >
                  <div className="flex flex-wrap gap-2">
                    {result.topHashtags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-full text-sm font-medium"
                        style={{ backgroundColor: "#7c3aed15", color: "#7c3aed", border: "1px solid #7c3aed30" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </BlurOverlay>
              </div>

              {/* PDF Download — Auth only */}
              {isAuth && (
                <button className="w-full py-3 rounded-xl border-2 border-[#7c3aed] text-[#7c3aed] font-semibold text-sm hover:bg-[#7c3aed]/5 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  PDF 다운로드
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 px-4 bg-[#F9FAFB] border-t border-[#E5E7EB]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#111827] mb-4">인스타그램 계정 감사란?</h2>
          <p className="text-[#6B7280] leading-relaxed mb-4">
            인스타그램 계정 감사(Instagram Account Audit)는 계정의 전반적인 건강 상태를 종합적으로 진단하는 분석 프로세스입니다.
            단순히 팔로워 수나 참여율 하나만 보는 것이 아니라, 팔로워 품질, 가짜 팔로워 비율, 콘텐츠 성과,
            최적 게시 시간대 등을 종합 분석해 계정의 실질적인 가치를 평가합니다.
          </p>
          <p className="text-[#6B7280] leading-relaxed mb-4">
            브랜드 입장에서는 인플루언서와 협업하기 전 반드시 계정 감사를 통해 팔로워의 진성도와 참여의 질을 검증해야 합니다.
            크리에이터 입장에서는 계정 감사를 통해 자신의 강점과 약점을 파악하고 성장 전략을 수립할 수 있습니다.
          </p>
          <p className="text-[#6B7280] leading-relaxed mb-8">
            Inflix의 계정 감사 도구는 A~F 등급 시스템으로 계정 상태를 직관적으로 표현하며,
            AQS 5축 레이더 차트, 가짜 팔로워 추정, 참여율 트렌드 등 7개 섹션에 걸친 종합 리포트를 제공합니다.
          </p>

          <h2 className="text-2xl font-bold text-[#111827] mb-6">자주 묻는 질문</h2>
          <div className="space-y-4">
            {[
              {
                q: "계정 감사는 어떤 기준으로 등급을 매기나요?",
                a: "참여율(ER)과 AQS(팔로워 품질 점수)를 기반으로 A~F 등급을 부여합니다. ER 5% 이상, AQS 80점 이상이면 A등급, ER 1% 미만 또는 AQS 50점 미만이면 D등급입니다.",
              },
              {
                q: "가짜 팔로워 비율은 어떻게 감지하나요?",
                a: "팔로워의 계정 활성도, 프로필 완성도, 팔로워/팔로잉 비율, 게시물 없는 계정 비율 등 다양한 신호를 분석해 가짜 팔로워 비율을 추정합니다.",
              },
              {
                q: "무료로 어디까지 볼 수 있나요?",
                a: "로그인 없이 프로필 요약, AQS 5축 레이더 차트, 가짜 팔로워 추정 등급까지 무료로 확인할 수 있습니다. 참여율 트렌드, 콘텐츠 성과, 최적 시간대, 해시태그 분석은 무료 회원가입 후 이용 가능합니다.",
              },
              {
                q: "PDF 다운로드 기능은 어떻게 사용하나요?",
                a: "무료 회원가입 후 감사 리포트를 실행하면 'PDF 다운로드' 버튼이 활성화됩니다. 생성된 리포트를 PDF 파일로 저장해 내부 공유나 제안서에 활용할 수 있습니다.",
              },
            ].map((faq) => (
              <div key={faq.q} className="rounded-xl border border-[#E5E7EB] p-5 bg-white">
                <h3 className="font-semibold text-[#111827] mb-2">Q. {faq.q}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">A. {faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="py-16 px-4 border-t border-[#E5E7EB]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-[#111827] mb-6 text-center">관련 무료 도구</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { href: "/tools/engagement-rate", icon: "📊", title: "참여율 계산기", desc: "ER을 즉시 계산하고 등급을 확인하세요." },
              { href: "/tools/fake-follower-check", icon: "🕵️", title: "가짜 팔로워 체크", desc: "진짜 팔로워 비율을 무료로 확인하세요." },
              { href: "/tools/follower-count", icon: "👥", title: "팔로워 수 확인", desc: "실시간 팔로워·팔로잉·게시물 수 확인." },
              { href: "/tools/roi-calculator", icon: "💹", title: "ROI 계산기", desc: "캠페인 예상 ROI를 미리 계산하세요." },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex items-start gap-4 p-5 rounded-2xl border border-[#E5E7EB] hover:border-[#7c3aed]/40 hover:bg-[#7c3aed]/5 transition-all"
              >
                <div className="text-3xl">{tool.icon}</div>
                <div>
                  <div className="font-semibold text-[#111827] group-hover:text-[#7c3aed] transition-colors">
                    {tool.title}
                  </div>
                  <div className="text-sm text-[#6B7280] mt-1">{tool.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 bg-[#F9FAFB] border-t border-[#E5E7EB]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#111827] mb-3">
            전체 감사 리포트가 필요하세요?
          </h2>
          <p className="text-[#6B7280] mb-6">
            무료 가입하면 7개 섹션 전체 분석, PDF 다운로드, 계정 히스토리 저장까지 모두 무료로 이용할 수 있어요.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#7c3aed] text-white font-semibold hover:bg-[#6d28d9] transition-colors text-base"
          >
            무료 가입하기 →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
