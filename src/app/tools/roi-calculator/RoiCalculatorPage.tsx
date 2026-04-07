"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BarChartComponent from "@/components/charts/BarChartComponent";

// ─── Category config ─────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: "뷰티", value: "beauty", er: 4.2 },
  { label: "패션", value: "fashion", er: 3.5 },
  { label: "푸드", value: "food", er: 5.1 },
  { label: "여행", value: "travel", er: 3.8 },
  { label: "피트니스", value: "fitness", er: 4.9 },
  { label: "라이프스타일", value: "lifestyle", er: 3.6 },
  { label: "테크", value: "tech", er: 2.8 },
  { label: "게임", value: "gaming", er: 4.0 },
  { label: "교육", value: "education", er: 3.2 },
  { label: "기타", value: "other", er: 3.0 },
];

const INDUSTRY_ROI = 6.5;
const REACH_RATE = 0.3;

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmtKRW(n: number) {
  if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(1)}억 원`;
  if (n >= 10_000) return `${(n / 10_000).toFixed(0)}만 원`;
  return `${n.toLocaleString()}원`;
}

function fmtNum(n: number) {
  if (n >= 10_000) return `${(n / 10_000).toFixed(1)}만`;
  return n.toLocaleString();
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function RoiCalculatorPage() {
  const [budget, setBudget] = useState<string>("5000000");
  const [influencerCount, setInfluencerCount] = useState<string>("3");
  const [avgFollowers, setAvgFollowers] = useState<string>("50000");
  const [category, setCategory] = useState("beauty");

  const calc = useMemo(() => {
    const b = Math.max(0, Number(budget) || 0);
    const n = Math.max(0, Number(influencerCount) || 0);
    const f = Math.max(0, Number(avgFollowers) || 0);
    const cat = CATEGORIES.find((c) => c.value === category) ?? CATEGORIES[0];

    const totalFollowers = n * f;
    const reach = Math.round(totalFollowers * REACH_RATE);
    const erDecimal = cat.er / 100;
    const engagements = Math.round(reach * erDecimal);
    const cpm = reach > 0 ? (b / reach) * 1000 : 0;
    const cpe = engagements > 0 ? b / engagements : 0;
    // estimated value = engagements * avg value per engagement (₩2000) + reach * cpm_value (₩500/1000)
    const estimatedValue = engagements * 2000 + (reach / 1000) * 500;
    const roiMultiple = b > 0 ? estimatedValue / b : 0;

    return { b, n, f, reach, engagements, cpm, cpe, roiMultiple, estimatedValue, categoryEr: cat.er };
  }, [budget, influencerCount, avgFollowers, category]);

  const barData = [
    { name: "예상 ROI", value: parseFloat(calc.roiMultiple.toFixed(1)) },
    { name: "업계 평균", value: INDUSTRY_ROI },
  ];

  const isAboveAvg = calc.roiMultiple >= INDUSTRY_ROI;

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
            💹 무료 ROI 계산기
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            인플루언서 마케팅<br className="hidden sm:block" /> ROI 계산기
          </h1>
          <p className="text-lg text-[#6B7280] mb-2">
            예산을 입력하면 예상 도달·참여·CPM·ROI를 즉시 계산합니다.
          </p>
          <p className="text-sm text-[#9CA3AF]">완전 무료 — 로그인 없이 사용하세요.</p>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Panel */}
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm space-y-5">
              <h2 className="text-base font-semibold text-[#111827]">캠페인 설정</h2>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">
                  광고 예산
                </label>
                <div className="flex items-center border border-[#E5E7EB] rounded-xl px-4 py-3 focus-within:border-[#7c3aed] focus-within:ring-2 focus-within:ring-[#7c3aed]/20 transition-all">
                  <span className="text-[#9CA3AF] mr-2 text-sm font-medium">₩</span>
                  <input
                    type="number"
                    min={0}
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="flex-1 outline-none text-base bg-transparent"
                    placeholder="5000000"
                  />
                </div>
                {Number(budget) > 0 && (
                  <p className="mt-1 text-xs text-[#6B7280]">{fmtKRW(Number(budget))}</p>
                )}
              </div>

              {/* Influencer count */}
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">
                  인플루언서 수
                </label>
                <div className="flex items-center border border-[#E5E7EB] rounded-xl px-4 py-3 focus-within:border-[#7c3aed] focus-within:ring-2 focus-within:ring-[#7c3aed]/20 transition-all">
                  <input
                    type="number"
                    min={1}
                    value={influencerCount}
                    onChange={(e) => setInfluencerCount(e.target.value)}
                    className="flex-1 outline-none text-base bg-transparent"
                    placeholder="3"
                  />
                  <span className="text-[#9CA3AF] ml-2 text-sm">명</span>
                </div>
              </div>

              {/* Avg followers */}
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">
                  평균 팔로워 수
                </label>
                <div className="flex items-center border border-[#E5E7EB] rounded-xl px-4 py-3 focus-within:border-[#7c3aed] focus-within:ring-2 focus-within:ring-[#7c3aed]/20 transition-all">
                  <input
                    type="number"
                    min={0}
                    value={avgFollowers}
                    onChange={(e) => setAvgFollowers(e.target.value)}
                    className="flex-1 outline-none text-base bg-transparent"
                    placeholder="50000"
                  />
                  <span className="text-[#9CA3AF] ml-2 text-sm">명</span>
                </div>
                {Number(avgFollowers) > 0 && (
                  <p className="mt-1 text-xs text-[#6B7280]">
                    총 팔로워 {fmtNum(calc.n * calc.f)}명
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1.5">
                  카테고리
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-base outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/20 transition-all bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label} (평균 ER {c.er}%)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Panel */}
            <div className="space-y-4">
              {/* Key metrics */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                <h2 className="text-base font-semibold text-[#111827] mb-4">예상 결과</h2>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "예상 총 도달", value: fmtNum(calc.reach), sub: "Reach" },
                    { label: "예상 참여 수", value: fmtNum(calc.engagements), sub: "Engagements" },
                    {
                      label: "CPM",
                      value: calc.cpm > 0 ? `₩${Math.round(calc.cpm).toLocaleString()}` : "-",
                      sub: "1000회 노출당 비용",
                    },
                    {
                      label: "CPE",
                      value: calc.cpe > 0 ? `₩${Math.round(calc.cpe).toLocaleString()}` : "-",
                      sub: "참여당 비용",
                    },
                  ].map((m) => (
                    <div key={m.label} className="p-3 bg-[#F9FAFB] rounded-xl">
                      <div className="text-lg font-bold text-[#7c3aed]">{m.value}</div>
                      <div className="text-xs font-medium text-[#374151] mt-0.5">{m.label}</div>
                      <div className="text-xs text-[#9CA3AF]">{m.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ROI Highlight */}
              <div
                className="rounded-2xl p-6 text-center"
                style={{
                  backgroundColor: isAboveAvg ? "#dcfce7" : "#fff7ed",
                  border: `1px solid ${isAboveAvg ? "#86efac" : "#fed7aa"}`,
                }}
              >
                <div className="text-xs font-medium mb-1" style={{ color: isAboveAvg ? "#16a34a" : "#ea580c" }}>
                  예상 ROI 배수
                </div>
                <div
                  className="text-5xl font-black mb-1"
                  style={{ color: isAboveAvg ? "#16a34a" : "#ea580c" }}
                >
                  {calc.b > 0 ? `${calc.roiMultiple.toFixed(1)}x` : "-"}
                </div>
                <div className="text-xs text-[#6B7280]">
                  업계 평균 {INDUSTRY_ROI}배 대비{" "}
                  {calc.b > 0
                    ? isAboveAvg
                      ? `+${(calc.roiMultiple - INDUSTRY_ROI).toFixed(1)}배 높음`
                      : `${(calc.roiMultiple - INDUSTRY_ROI).toFixed(1)}배 낮음`
                    : "예산을 입력해주세요"}
                </div>
              </div>

              {/* ROI Comparison Chart */}
              {calc.b > 0 && (
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-[#374151] mb-3">ROI 비교</h3>
                  <BarChartComponent data={barData} />
                </div>
              )}
            </div>
          </div>

          {/* Calculation breakdown */}
          {calc.b > 0 && (
            <div className="mt-6 bg-[#F9FAFB] rounded-2xl border border-[#E5E7EB] p-6">
              <h3 className="text-sm font-semibold text-[#374151] mb-4">계산 방식</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#6B7280]">
                {[
                  { label: "예상 도달", formula: `팔로워 합계(${fmtNum(calc.n * calc.f)}) × 30% 도달률 = ${fmtNum(calc.reach)}` },
                  { label: "참여 수", formula: `도달(${fmtNum(calc.reach)}) × ER ${calc.categoryEr}% = ${fmtNum(calc.engagements)}` },
                  { label: "CPM", formula: `예산 ÷ 도달 × 1,000 = ₩${Math.round(calc.cpm).toLocaleString()}` },
                  { label: "CPE", formula: `예산 ÷ 참여 수 = ₩${Math.round(calc.cpe).toLocaleString()}` },
                  { label: "추정 가치", formula: `참여 × ₩2,000 + 노출 × ₩500/1,000 = ${fmtKRW(Math.round(calc.estimatedValue))}` },
                  { label: "ROI 배수", formula: `추정 가치 ÷ 예산 = ${calc.roiMultiple.toFixed(1)}배` },
                ].map((row) => (
                  <div key={row.label} className="flex gap-2">
                    <span className="font-medium text-[#374151] min-w-[60px]">{row.label}:</span>
                    <span>{row.formula}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-[#9CA3AF]">
                * 실제 결과는 콘텐츠 품질, 타겟 일치도, 캠페인 시기 등에 따라 다를 수 있습니다. 본 계산기는 참고용입니다.
              </p>
            </div>
          )}

          {/* CTA Banner */}
          <div
            className="mt-8 rounded-2xl p-8 text-center"
            style={{ background: "linear-gradient(135deg, #7c3aed15, #e9456015)" }}
          >
            <h3 className="text-lg font-bold text-[#111827] mb-2">
              이 예산으로 최적의 인플루언서 조합 찾기
            </h3>
            <p className="text-sm text-[#6B7280] mb-4">
              Inflix에서 카테고리·팔로워·ER 기준으로 가장 적합한 인플루언서를 자동 매칭해드립니다.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#7c3aed] text-white font-semibold hover:bg-[#6d28d9] transition-colors text-sm"
            >
              무료 가입하고 인플루언서 찾기 →
            </Link>
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 px-4 bg-[#F9FAFB] border-t border-[#E5E7EB]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#111827] mb-4">인플루언서 ROI란?</h2>
          <p className="text-[#6B7280] leading-relaxed mb-4">
            인플루언서 마케팅 ROI(Return on Investment)는 인플루언서에게 지불한 비용 대비 창출된 가치의 비율입니다.
            업계 평균적으로 인플루언서 마케팅은 투자 대비 약 6.5배의 가치를 창출하는 것으로 알려져 있으며,
            이는 전통적인 디지털 광고 대비 높은 효율을 보여줍니다.
          </p>
          <p className="text-[#6B7280] leading-relaxed mb-4">
            ROI를 정확히 계산하려면 단순 노출 수(Reach)뿐 아니라 실제 참여(Engagement), 전환(Conversion),
            브랜드 인지도 변화까지 종합적으로 측정해야 합니다. 본 계산기는 도달·참여 기반의 추정 가치를 계산하며,
            실제 전환 데이터가 있을 경우 더 정확한 ROI 측정이 가능합니다.
          </p>
          <p className="text-[#6B7280] leading-relaxed mb-8">
            카테고리별 평균 참여율(ER)은 실제 인플루언서 마케팅 벤치마크 데이터를 기반으로 설정되어 있습니다.
            뷰티·푸드·피트니스 카테고리는 참여율이 높고, 테크·교육 카테고리는 상대적으로 낮은 경향이 있습니다.
          </p>

          <h2 className="text-2xl font-bold text-[#111827] mb-6">자주 묻는 질문</h2>
          <div className="space-y-4">
            {[
              {
                q: "ROI 계산 결과가 실제와 다를 수 있나요?",
                a: "네, 본 계산기는 산업 평균 데이터를 기반으로 한 추정치입니다. 실제 ROI는 콘텐츠 품질, 타겟 일치도, 캠페인 시기, 제품 단가 등에 따라 크게 달라질 수 있습니다.",
              },
              {
                q: "CPM과 CPE 중 어떤 지표가 더 중요한가요?",
                a: "목적에 따라 다릅니다. 브랜드 인지도 캠페인은 CPM(노출당 비용), 참여 유도 캠페인은 CPE(참여당 비용)가 더 중요한 지표입니다. 두 지표를 함께 분석하는 것이 좋습니다.",
              },
              {
                q: "도달률 30%는 어디서 나온 수치인가요?",
                a: "인스타그램 알고리즘 특성상 평균적으로 팔로워의 20~40%에게 콘텐츠가 노출됩니다. 본 계산기는 보수적으로 30%를 기본값으로 사용합니다.",
              },
              {
                q: "인플루언서 수와 팔로워 규모 중 어느 것이 ROI에 더 영향을 주나요?",
                a: "일반적으로 팔로워 규모가 작은 인플루언서(마이크로 인플루언서)를 여러 명 활용하는 전략이 대형 인플루언서 한 명보다 ROI가 높은 경향이 있습니다. 마이크로 인플루언서는 참여율이 높고 타겟 팬덤이 명확하기 때문입니다.",
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
              { href: "/tools/price-calculator", icon: "💰", title: "광고 단가 계산기", desc: "내 광고 적정 단가를 바로 계산하세요." },
              { href: "/tools/instagram-audit", icon: "📋", title: "계정 감사 리포트", desc: "종합 계정 분석 리포트를 받아보세요." },
              { href: "/tools/follower-count", icon: "👥", title: "팔로워 수 확인", desc: "실시간 팔로워·팔로잉·게시물 수 확인." },
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
            최적의 인플루언서 조합을 찾고 싶으신가요?
          </h2>
          <p className="text-[#6B7280] mb-6">
            Inflix는 예산·카테고리·목표 ROI를 기준으로 최적의 인플루언서를 자동으로 추천합니다.
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
