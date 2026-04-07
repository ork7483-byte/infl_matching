"use client";

import { useState } from "react";
import Link from "next/link";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import DashboardLayout from "@/components/layout/DashboardLayout";

// ─── Types ────────────────────────────────────────────────────────────────────

type Goal = "인지도" | "참여" | "전환";

interface MediaPlanResult {
  nano: number;
  micro: number;
  mid: number;
  totalCost: number;
  reach: number;
  engagement: number;
  cpm: number;
  cpe: number;
  influencers: InfluencerCard[];
  pieData: { name: string; value: number; color: string }[];
}

interface InfluencerCard {
  tier: string;
  username: string;
  fullName: string;
  avatar: string;
  followers: string;
  er: string;
  price: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = ["뷰티", "패션", "라이프스타일", "음식/요리", "여행", "피트니스", "테크", "게임", "육아", "반려동물", "금융", "교육"];
const REGIONS = ["전국", "서울/수도권", "부산/경남", "대구/경북", "광주/전라", "대전/충청", "강원/제주", "해외"];

// Pricing per tier (avg KRW)
const TIER_PRICES = { nano: 200_000, micro: 800_000, mid: 3_000_000 };
const TIER_REACH  = { nano: 8_000,   micro: 40_000,  mid: 180_000   };
const TIER_ER     = { nano: 7.5,     micro: 4.5,     mid: 2.8       };

// Mock influencer pools per tier
const NANO_POOL: Omit<InfluencerCard, "tier" | "price">[] = [
  { username: "soyeon_life",  fullName: "김소연", avatar: "KS", followers: "12.4K", er: "8.2%" },
  { username: "art_bomi",     fullName: "안보미", avatar: "AB", followers: "9.8K",  er: "9.1%" },
  { username: "momlife_hana", fullName: "서하나", avatar: "SH", followers: "19.3K", er: "8.5%" },
];
const MICRO_POOL: Omit<InfluencerCard, "tier" | "price">[] = [
  { username: "fitmin_kr",    fullName: "이민지", avatar: "LM", followers: "31.2K", er: "5.1%" },
  { username: "chef_jinsoo",  fullName: "오진수", avatar: "OJ", followers: "24.9K", er: "7.2%" },
  { username: "run_seohyun",  fullName: "임서현", avatar: "IS", followers: "44.5K", er: "5.8%" },
];
const MID_POOL: Omit<InfluencerCard, "tier" | "price">[] = [
  { username: "ssul_nara",    fullName: "홍나라", avatar: "HN", followers: "318K",  er: "2.7%" },
  { username: "yuri_fashion", fullName: "강유리", avatar: "KY", followers: "203K",  er: "3.5%" },
];

// ─── Calculation Logic ────────────────────────────────────────────────────────

function calculatePlan(budget: number): MediaPlanResult {
  const nanoBudget  = budget * 0.4;
  const microBudget = budget * 0.4;
  const midBudget   = budget * 0.2;

  const nano  = Math.max(1, Math.floor(nanoBudget  / TIER_PRICES.nano));
  const micro = Math.max(1, Math.floor(microBudget / TIER_PRICES.micro));
  const mid   = Math.max(0, Math.floor(midBudget   / TIER_PRICES.mid));

  const totalCost  = nano * TIER_PRICES.nano + micro * TIER_PRICES.micro + mid * TIER_PRICES.mid;
  const reach      = nano * TIER_REACH.nano  + micro * TIER_REACH.micro  + mid * TIER_REACH.mid;
  const engagement = Math.round(
    (nano  * TIER_REACH.nano  * (TIER_ER.nano  / 100) +
     micro * TIER_REACH.micro * (TIER_ER.micro / 100) +
     mid   * TIER_REACH.mid   * (TIER_ER.mid   / 100))
  );
  const cpm = reach > 0 ? Math.round((totalCost / reach) * 1000) : 0;
  const cpe = engagement > 0 ? Math.round(totalCost / engagement) : 0;

  const influencers: InfluencerCard[] = [
    ...NANO_POOL.slice(0, nano).map((i) => ({ ...i, tier: "나노", price: TIER_PRICES.nano })),
    ...MICRO_POOL.slice(0, micro).map((i) => ({ ...i, tier: "마이크로", price: TIER_PRICES.micro })),
    ...MID_POOL.slice(0, mid).map((i) => ({ ...i, tier: "미드티어", price: TIER_PRICES.mid })),
  ];

  const pieData = [
    { name: "나노",    value: nano  * TIER_PRICES.nano,  color: "#a78bfa" },
    { name: "마이크로", value: micro * TIER_PRICES.micro, color: "#7c3aed" },
    { name: "미드티어", value: mid   * TIER_PRICES.mid,   color: "#4c1d95" },
  ].filter((d) => d.value > 0);

  return { nano, micro, mid, totalCost, reach, engagement, cpm, cpe, influencers, pieData };
}

function formatKRW(n: number) {
  if (n >= 100_000_000) return `₩${(n / 100_000_000).toFixed(1)}억`;
  if (n >= 10_000)      return `₩${(n / 10_000).toFixed(0)}만`;
  return `₩${n.toLocaleString()}`;
}

function formatNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return `${n.toLocaleString()}`;
}

const TIER_BADGE: Record<string, string> = {
  나노:    "bg-violet-100 text-violet-700",
  마이크로: "bg-purple-100 text-purple-700",
  미드티어: "bg-indigo-100 text-indigo-700",
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MediaPlanPage() {
  const [goal, setGoal]               = useState<Goal>("인지도");
  const [budget, setBudget]           = useState<string>("");
  const [categories, setCategories]   = useState<string[]>([]);
  const [region, setRegion]           = useState("전국");
  const [startDate, setStartDate]     = useState("");
  const [endDate, setEndDate]         = useState("");
  const [result, setResult]           = useState<MediaPlanResult | null>(null);
  const [generating, setGenerating]   = useState(false);

  const toggleCategory = (cat: string) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleGenerate = () => {
    const b = parseInt(budget.replace(/,/g, ""), 10);
    if (!b || b <= 0) return;
    setGenerating(true);
    setResult(null);
    // Simulate AI delay
    setTimeout(() => {
      setResult(calculatePlan(b));
      setGenerating(false);
    }, 1200);
  };

  const isFormValid = budget && parseInt(budget.replace(/,/g, ""), 10) > 0;

  return (
    <DashboardLayout role="brand">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">미디어 플랜 생성</h1>
          <p className="text-sm text-[#6B7280] mt-0.5">캠페인 조건을 입력하면 AI가 최적의 인플루언서 조합을 추천해 드립니다.</p>
        </div>

        {/* Input Form */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 space-y-6">

          {/* Goal */}
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-3">캠페인 목표</label>
            <div className="flex gap-3 flex-wrap">
              {(["인지도", "참여", "전환"] as Goal[]).map((g) => (
                <label
                  key={g}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${goal === g ? "border-[#7c3aed] bg-[#EDE9FE]" : "border-[#E5E7EB] bg-white hover:border-[#7c3aed]/40"}`}
                >
                  <input
                    type="radio"
                    name="goal"
                    value={g}
                    checked={goal === g}
                    onChange={() => setGoal(g)}
                    className="hidden"
                  />
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${goal === g ? "border-[#7c3aed]" : "border-[#D1D5DB]"}`}>
                    {goal === g && <span className="w-2 h-2 rounded-full bg-[#7c3aed]" />}
                  </span>
                  <span className={`text-sm font-medium ${goal === g ? "text-[#7c3aed]" : "text-[#374151]"}`}>{g}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-2">총 예산</label>
            <div className="relative w-64">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-[#6B7280]">₩</span>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="예: 5000000"
                className="w-full pl-8 pr-4 py-2.5 text-sm border border-[#E5E7EB] rounded-xl bg-[#F9FAFB] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/30 focus:border-[#7c3aed]"
              />
            </div>
            {budget && parseInt(budget, 10) > 0 && (
              <p className="text-xs text-[#7c3aed] mt-1 font-medium">{formatKRW(parseInt(budget, 10))}</p>
            )}
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-2">타겟 카테고리 <span className="text-xs font-normal text-[#9CA3AF]">(복수 선택)</span></label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <label
                  key={cat}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border cursor-pointer transition-all text-sm ${categories.includes(cat) ? "border-[#7c3aed] bg-[#EDE9FE] text-[#7c3aed] font-medium" : "border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#7c3aed]/40"}`}
                >
                  <input
                    type="checkbox"
                    checked={categories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="hidden"
                  />
                  {categories.includes(cat) && (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {cat}
                </label>
              ))}
            </div>
          </div>

          {/* Region */}
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-2">타겟 지역</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="px-4 py-2.5 text-sm border border-[#E5E7EB] rounded-xl bg-[#F9FAFB] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/30 focus:border-[#7c3aed] w-48"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-semibold text-[#374151] mb-2">캠페인 기간</label>
            <div className="flex items-center gap-3 flex-wrap">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2.5 text-sm border border-[#E5E7EB] rounded-xl bg-[#F9FAFB] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/30 focus:border-[#7c3aed]"
              />
              <span className="text-sm text-[#6B7280]">~</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2.5 text-sm border border-[#E5E7EB] rounded-xl bg-[#F9FAFB] text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/30 focus:border-[#7c3aed]"
              />
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!isFormValid || generating}
            className="flex items-center gap-2 px-8 py-3 text-sm font-semibold bg-gradient-to-r from-[#7c3aed] to-[#a21caf] text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#7c3aed]/30"
          >
            {generating ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                AI 분석 중...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI 플랜 생성
              </>
            )}
          </button>
        </div>

        {/* ── Result Section ── */}
        {result && (
          <div className="space-y-5 animate-in fade-in duration-500">
            {/* Recommendation Summary */}
            <div className="bg-gradient-to-br from-[#7c3aed]/10 to-[#a21caf]/5 border border-[#7c3aed]/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-[#7c3aed]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h2 className="font-semibold text-[#111827]">AI 추천 인플루언서 조합</h2>
              </div>
              <p className="text-lg font-bold text-[#7c3aed]">
                나노 {result.nano}명
                {result.micro > 0 && ` + 마이크로 ${result.micro}명`}
                {result.mid > 0 && ` + 미드티어 ${result.mid}명`}
              </p>
              <p className="text-sm text-[#6B7280] mt-1">목표: <span className="font-medium text-[#374151]">{goal}</span> · 지역: <span className="font-medium text-[#374151]">{region}</span></p>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "예상 총 비용",  value: formatKRW(result.totalCost), sub: "집행 예산",      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-[#7c3aed]" },
                { label: "예상 도달",     value: formatNum(result.reach),     sub: "총 도달 수",     icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z", color: "text-blue-600" },
                { label: "예상 참여",     value: formatNum(result.engagement), sub: "예상 인터랙션",  icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", color: "text-pink-600" },
                { label: "CPM",          value: formatKRW(result.cpm),        sub: "노출 1,000회당", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z", color: "text-green-600" },
              ].map((kpi) => (
                <div key={kpi.label} className="bg-white border border-[#E5E7EB] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#9CA3AF]">{kpi.label}</span>
                    <svg className={`w-4 h-4 ${kpi.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={kpi.icon} />
                    </svg>
                  </div>
                  <p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
                  <p className="text-[10px] text-[#9CA3AF] mt-0.5">{kpi.sub}</p>
                </div>
              ))}
            </div>

            {/* Influencer Cards + Pie Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              {/* Influencer List */}
              <div className="lg:col-span-3 bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-[#E5E7EB]">
                  <h3 className="font-semibold text-sm text-[#111827]">추천 인플루언서</h3>
                </div>
                <div className="divide-y divide-[#E5E7EB]">
                  {result.influencers.map((inf, i) => (
                    <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {inf.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium text-[#111827] truncate">@{inf.username}</span>
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold ${TIER_BADGE[inf.tier]}`}>
                            {inf.tier}
                          </span>
                        </div>
                        <p className="text-xs text-[#6B7280]">{inf.fullName} · {inf.followers} · ER {inf.er}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-[#111827]">{formatKRW(inf.price)}</p>
                        <p className="text-[10px] text-[#9CA3AF]">예상 단가</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pie Chart */}
              <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-2xl p-5">
                <h3 className="font-semibold text-sm text-[#111827] mb-4">예산 배분</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={result.pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {result.pieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [typeof value === "number" ? formatKRW(value) : String(value), "예산"]}
                      contentStyle={{ border: "1px solid #E5E7EB", borderRadius: "8px", fontSize: "12px" }}
                    />
                    <Legend
                      formatter={(value) => <span className="text-xs text-[#374151]">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Breakdown */}
                <div className="mt-2 space-y-2">
                  {result.pieData.map((d) => (
                    <div key={d.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                        <span className="text-[#374151]">{d.name}</span>
                      </div>
                      <span className="font-medium text-[#111827]">{formatKRW(d.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap">
              <Link
                href="/dashboard/brand/campaigns/new"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-gradient-to-r from-[#7c3aed] to-[#a21caf] text-white rounded-xl hover:opacity-90 transition-all shadow-md shadow-[#7c3aed]/20"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                이 플랜으로 캠페인 만들기
              </Link>
              <button
                onClick={() => alert("PDF 내보내기 기능은 준비 중입니다.")}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium border border-[#E5E7EB] text-[#374151] rounded-xl hover:bg-[#F9FAFB] transition-colors"
              >
                <svg className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                PDF 내보내기
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
