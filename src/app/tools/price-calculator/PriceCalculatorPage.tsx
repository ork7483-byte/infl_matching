"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const CATEGORIES = [
  { value: "lifestyle", label: "라이프스타일", multiplier: 1.0 },
  { value: "beauty", label: "뷰티 / 패션", multiplier: 1.3 },
  { value: "food", label: "푸드 / 맛집", multiplier: 1.1 },
  { value: "travel", label: "여행", multiplier: 1.2 },
  { value: "fitness", label: "피트니스 / 헬스", multiplier: 1.15 },
  { value: "tech", label: "IT / 테크", multiplier: 1.4 },
  { value: "parenting", label: "육아 / 패밀리", multiplier: 1.1 },
  { value: "finance", label: "재테크 / 금융", multiplier: 1.5 },
  { value: "gaming", label: "게임", multiplier: 0.9 },
  { value: "education", label: "교육 / 자기계발", multiplier: 1.25 },
];

const TIER_TABLE = [
  { tier: "나노", range: "1천~1만", baseMin: 30000, baseMax: 100000 },
  { tier: "마이크로", range: "1만~10만", baseMin: 100000, baseMax: 500000 },
  { tier: "미들", range: "10만~50만", baseMin: 500000, baseMax: 2000000 },
  { tier: "매크로", range: "50만~100만", baseMin: 2000000, baseMax: 5000000 },
  { tier: "메가", range: "100만+", baseMin: 5000000, baseMax: 15000000 },
];

function getBasePriceRange(followers: number): { min: number; max: number } {
  if (followers < 10000) return { min: 30000, max: 100000 };
  if (followers < 100000) return { min: 100000, max: 500000 };
  if (followers < 500000) return { min: 500000, max: 2000000 };
  if (followers < 1000000) return { min: 2000000, max: 5000000 };
  return { min: 5000000, max: 15000000 };
}

function formatKRW(amount: number): string {
  if (amount >= 100000000) return `${(amount / 100000000).toFixed(1)}억원`;
  if (amount >= 10000) return `${Math.round(amount / 10000)}만원`;
  return `${amount.toLocaleString()}원`;
}

export default function PriceCalculatorPage() {
  const [followers, setFollowers] = useState("");
  const [category, setCategory] = useState("lifestyle");
  const [calculated, setCalculated] = useState(false);

  const catMultiplier = CATEGORIES.find((c) => c.value === category)?.multiplier ?? 1;
  const followerNum = parseInt(followers.replace(/[^0-9]/g, ""), 10) || 0;

  const result = useMemo(() => {
    if (!calculated || followerNum < 1000) return null;
    const base = getBasePriceRange(followerNum);
    return {
      min: Math.round((base.min * catMultiplier) / 10000) * 10000,
      max: Math.round((base.max * catMultiplier) / 10000) * 10000,
    };
  }, [calculated, followerNum, catMultiplier]);

  const handleCalculate = () => {
    if (followerNum < 1000) return;
    setCalculated(true);
  };

  const currentTier = useMemo(() => {
    if (followerNum < 10000) return 0;
    if (followerNum < 100000) return 1;
    if (followerNum < 500000) return 2;
    if (followerNum < 1000000) return 3;
    return 4;
  }, [followerNum]);

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
            💰 무료 단가 계산기
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            인플루언서 광고 단가 계산기
          </h1>
          <p className="text-lg text-[#6B7280] mb-2">
            팔로워 수와 카테고리만 입력하면 예상 광고 단가를 즉시 계산해드립니다.
          </p>
          <p className="text-sm text-[#9CA3AF]">사용자명 입력 불필요 · 로그인 없이 무료 사용</p>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-12 px-4">
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                팔로워 수
              </label>
              <input
                type="text"
                value={followers}
                onChange={(e) => {
                  setFollowers(e.target.value);
                  setCalculated(false);
                }}
                placeholder="예: 50000"
                className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-base outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/20 transition-all"
              />
              {followers && followerNum < 1000 && (
                <p className="mt-1 text-xs text-red-500">최소 1,000명 이상을 입력해주세요.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                카테고리
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setCalculated(false);
                }}
                className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-base outline-none focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/20 transition-all bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleCalculate}
              disabled={followerNum < 1000}
              className="w-full py-3.5 rounded-xl bg-[#7c3aed] text-white font-semibold hover:bg-[#6d28d9] disabled:opacity-50 transition-colors"
            >
              예상 단가 계산하기
            </button>
          </div>

          {/* Result */}
          {result && (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-gradient-to-br from-[#7c3aed]/5 to-[#7c3aed]/10 border border-[#7c3aed]/20 p-6 text-center">
                <div className="text-sm text-[#6B7280] mb-1">예상 광고 단가 범위 (게시물 1개 기준)</div>
                <div className="text-4xl font-bold text-[#7c3aed] mb-1">
                  {formatKRW(result.min)} ~ {formatKRW(result.max)}
                </div>
                <div className="text-xs text-[#9CA3AF]">
                  {CATEGORIES.find((c) => c.value === category)?.label} 카테고리 · 팔로워 {followerNum.toLocaleString()}명 기준
                </div>
              </div>

              {/* Tier Market Price Table (public) */}
              <div className="rounded-2xl border border-[#E5E7EB] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
                  <h3 className="text-sm font-semibold text-[#374151]">등급별 시장 가격표</h3>
                </div>
                <div className="divide-y divide-[#E5E7EB]">
                  {TIER_TABLE.map((row, idx) => (
                    <div
                      key={row.tier}
                      className={`flex items-center justify-between px-5 py-3.5 ${
                        idx === currentTier ? "bg-[#7c3aed]/5" : "bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {idx === currentTier && (
                          <span className="w-2 h-2 rounded-full bg-[#7c3aed] flex-shrink-0" />
                        )}
                        {idx !== currentTier && <span className="w-2 h-2 flex-shrink-0" />}
                        <div>
                          <span className={`text-sm font-semibold ${idx === currentTier ? "text-[#7c3aed]" : "text-[#374151]"}`}>
                            {row.tier}
                          </span>
                          <span className="text-xs text-[#9CA3AF] ml-2">{row.range}명</span>
                        </div>
                      </div>
                      <div className="text-sm text-[#374151]">
                        {formatKRW(Math.round(row.baseMin * catMultiplier / 10000) * 10000)} ~{" "}
                        {formatKRW(Math.round(row.baseMax * catMultiplier / 10000) * 10000)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Blurred: Content type breakdown & CPR/CPE */}
              <div className="relative rounded-2xl border border-[#E5E7EB] overflow-hidden">
                <div className="p-6 blur-sm select-none pointer-events-none">
                  <h3 className="text-sm font-semibold text-[#374151] mb-4">콘텐츠 타입별 상세 단가</h3>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {["피드 게시물", "릴스", "스토리", "라이브"].map((type) => (
                      <div key={type} className="bg-[#F9FAFB] rounded-xl p-3">
                        <div className="text-xs text-[#6B7280] mb-1">{type}</div>
                        <div className="text-base font-bold text-[#7c3aed]">{formatKRW(result.min)}</div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#F9FAFB] rounded-xl p-3">
                      <div className="text-xs text-[#6B7280] mb-1">예상 CPR</div>
                      <div className="text-base font-bold">₩150</div>
                    </div>
                    <div className="bg-[#F9FAFB] rounded-xl p-3">
                      <div className="text-xs text-[#6B7280] mb-1">예상 CPE</div>
                      <div className="text-base font-bold">₩1,200</div>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[2px]">
                  <div className="text-center px-6">
                    <div className="text-3xl mb-3">🔒</div>
                    <p className="text-base font-semibold text-[#111827] mb-1">상세 분석은 무료 회원 전용</p>
                    <p className="text-sm text-[#6B7280] mb-4">콘텐츠 타입별 단가, CPR/CPE 분석을 확인하세요.</p>
                    <Link
                      href="/signup"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7c3aed] text-white text-sm font-semibold hover:bg-[#6d28d9] transition-colors"
                    >
                      무료로 전체 결과 보기
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 px-4 bg-[#F9FAFB] border-t border-[#E5E7EB]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#111827] mb-4">인플루언서 광고비는 어떻게 정해지나요?</h2>
          <p className="text-[#6B7280] leading-relaxed mb-4">
            인플루언서 광고비는 팔로워 수, 참여율, 카테고리, 콘텐츠 타입, 독점 여부 등 여러 요인에 따라 결정됩니다.
            단순히 팔로워 수가 많다고 단가가 높은 것이 아니라, 팔로워의 실제 반응률(참여율)이
            광고 효과에 더 직접적인 영향을 미칩니다.
          </p>
          <p className="text-[#6B7280] leading-relaxed mb-4">
            업계에서 일반적으로 사용하는 계산식은 팔로워 1,000명당 5,000~15,000원(CPM 기준)이지만,
            카테고리에 따라 크게 달라집니다. 금융·IT 카테고리는 고단가 광고가 많아 프리미엄이 붙고,
            뷰티·패션도 높은 편입니다. 게임 카테고리는 상대적으로 단가가 낮습니다.
          </p>
          <p className="text-[#6B7280] leading-relaxed mb-8">
            피드 게시물 vs 릴스 vs 스토리에 따라서도 단가가 다릅니다.
            릴스는 도달 범위가 넓어 최근 단가가 오르는 추세이며,
            스토리는 짧은 노출 시간으로 피드 대비 30~50% 수준에 거래됩니다.
          </p>

          <h2 className="text-2xl font-bold text-[#111827] mb-6">자주 묻는 질문</h2>
          <div className="space-y-4">
            {[
              {
                q: "이 계산기의 단가는 정확한가요?",
                a: "실제 시장 데이터를 기반으로 한 추정 범위입니다. 개인 협상 능력, 독점 조항, 브랜드 규모 등에 따라 실제 단가는 더 높거나 낮을 수 있습니다.",
              },
              {
                q: "릴스와 피드 게시물 중 어떤 게 더 비싼가요?",
                a: "최근에는 릴스가 도달 범위가 넓어 피드 게시물과 비슷하거나 더 높은 단가를 받는 추세입니다. 스토리는 일반적으로 가장 낮습니다.",
              },
              {
                q: "팔로워 수가 같아도 카테고리에 따라 단가가 다른 이유는?",
                a: "카테고리별로 광고 구매 브랜드의 예산 규모, 경쟁 강도, 타겟 고객의 구매력이 다르기 때문입니다. 금융·IT 광고주는 예산이 크고 경쟁이 심해 단가가 높습니다.",
              },
              {
                q: "처음 광고를 받는 경우 협상은 어떻게 하나요?",
                a: "초보 크리에이터는 시장 평균의 70~80% 수준에서 시작해 협업 실적을 쌓는 것이 일반적입니다. 미디어킷을 준비해두면 협상에 큰 도움이 됩니다.",
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
            <Link
              href="/tools/engagement-rate"
              className="group flex items-start gap-4 p-5 rounded-2xl border border-[#E5E7EB] hover:border-[#7c3aed]/40 hover:bg-[#7c3aed]/5 transition-all"
            >
              <div className="text-3xl">📊</div>
              <div>
                <div className="font-semibold text-[#111827] group-hover:text-[#7c3aed] transition-colors">
                  참여율 계산기
                </div>
                <div className="text-sm text-[#6B7280] mt-1">ER을 즉시 계산하세요.</div>
              </div>
            </Link>
            <Link
              href="/tools/fake-follower-check"
              className="group flex items-start gap-4 p-5 rounded-2xl border border-[#E5E7EB] hover:border-[#7c3aed]/40 hover:bg-[#7c3aed]/5 transition-all"
            >
              <div className="text-3xl">🕵️</div>
              <div>
                <div className="font-semibold text-[#111827] group-hover:text-[#7c3aed] transition-colors">
                  가짜 팔로워 체크
                </div>
                <div className="text-sm text-[#6B7280] mt-1">진성 팔로워 비율을 확인하세요.</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 bg-[#F9FAFB] border-t border-[#E5E7EB]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#111827] mb-3">더 정확한 분석이 필요하세요?</h2>
          <p className="text-[#6B7280] mb-6">
            무료 가입하면 콘텐츠 타입별 상세 단가, CPR·CPE 분석, 나만의 미디어킷까지 모두 무료로 사용할 수 있어요.
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
