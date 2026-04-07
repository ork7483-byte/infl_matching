"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlurOverlay from "@/components/BlurOverlay";
import DonutChart from "@/components/charts/DonutChart";

// ─── Mock data ────────────────────────────────────────────────────────────────

interface MockInfluencer {
  id: number;
  username: string;
  name: string;
  followers: number;
  er: number;
  posts: number;
  avatar: string;
}

function getMockInfluencers(brand: string): MockInfluencer[] {
  const seed = brand.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const names = [
    { username: "beauty_yuna", name: "유나뷰티" },
    { username: "style_minjun", name: "민준스타일" },
    { username: "daily_soeun", name: "소은데일리" },
    { username: "life_jiyeon", name: "지연라이프" },
    { username: "fashion_haerin", name: "해린패션" },
    { username: "food_taehyun", name: "태현푸드" },
    { username: "wellness_sora", name: "소라웰니스" },
    { username: "travel_donghyun", name: "동현여행" },
  ];
  const followerBases = [280000, 95000, 52000, 180000, 430000, 78000, 125000, 67000];
  const erBases = [4.2, 5.8, 6.1, 3.9, 3.2, 7.1, 5.5, 4.8];
  const postCounts = [3, 5, 2, 4, 6, 3, 2, 4];

  return names.map((n, i) => ({
    id: i,
    username: n.username,
    name: n.name,
    followers: followerBases[(i + seed) % followerBases.length],
    er: erBases[(i + seed) % erBases.length],
    posts: postCounts[(i + seed) % postCounts.length],
    avatar: `https://i.pravatar.cc/64?img=${((seed + i * 7) % 70) + 1}`,
  }));
}

const DONUT_COLORS = ["#7c3aed", "#e94560", "#f59e0b", "#10b981", "#3b82f6"];

function getMockCategoryData(brand: string) {
  const seed = brand.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const categories = [
    { name: "뷰티", base: 35 },
    { name: "패션", base: 25 },
    { name: "라이프", base: 20 },
    { name: "피트니스", base: 12 },
    { name: "기타", base: 8 },
  ];
  // Rotate to vary by brand
  const offset = seed % categories.length;
  const rotated = [...categories.slice(offset), ...categories.slice(0, offset)];
  return rotated.map((c, i) => ({ name: c.name, value: c.base, color: DONUT_COLORS[i] }));
}

function fmtFollowers(n: number) {
  if (n >= 10_000) return `${(n / 10_000).toFixed(1)}만`;
  return n.toLocaleString();
}

function estimateCost(followers: number, posts: number): number {
  // Rough CPM-based estimate: ₩500,000 per 10만 followers, per post
  return Math.round((followers / 100_000) * 500_000 * posts);
}

function fmtKRW(n: number) {
  if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(1)}억원`;
  if (n >= 10_000) return `${Math.round(n / 10_000)}만원`;
  return `${n.toLocaleString()}원`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function CompetitorAnalysisPage() {
  const { data: session } = useSession();
  const isAuthed = !!session;

  const [input, setInput] = useState("");
  const [brand, setBrand] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleAnalyze() {
    const raw = input.trim().replace(/^@/, "");
    if (!raw) return;
    setLoading(true);
    setTimeout(() => {
      setBrand(raw);
      setLoading(false);
    }, 1100);
  }

  const influencers = brand ? getMockInfluencers(brand) : [];
  const categoryData = brand ? getMockCategoryData(brand) : [];
  const totalCost = influencers.reduce((sum, inf) => sum + estimateCost(inf.followers, inf.posts), 0);
  const avgMonthlyFreq = brand ? (influencers.reduce((sum, inf) => sum + inf.posts, 0) / 6).toFixed(1) : "0";

  // Non-auth: show 3 visible, rest blurred
  const visibleCount = isAuthed ? influencers.length : 3;

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
            🔍 무료 경쟁사 분석
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            경쟁사 인플루언서<br className="hidden sm:block" /> 마케팅 분석
          </h1>
          <p className="text-lg text-[#6B7280] mb-2">
            경쟁사 브랜드의 협업 인플루언서, 예상 광고비, 주력 카테고리를 분석하세요.
          </p>
          <p className="text-sm text-[#9CA3AF]">완전 무료 — 로그인 없이 사용하세요.</p>
        </div>
      </section>

      {/* Search */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Input */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
            <h2 className="text-base font-semibold text-[#111827] mb-4">브랜드 인스타그램 계정 입력</h2>
            <div className="flex gap-3">
              <div className="flex-1 flex items-center border border-[#E5E7EB] rounded-xl px-4 py-3.5 focus-within:border-[#7c3aed] focus-within:ring-2 focus-within:ring-[#7c3aed]/20 transition-all">
                <span className="text-[#9CA3AF] mr-1.5 text-sm font-bold">@</span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                  className="flex-1 outline-none text-base bg-transparent"
                  placeholder="경쟁사 인스타그램 계정명"
                />
              </div>
              <button
                onClick={handleAnalyze}
                disabled={loading || !input.trim()}
                className="px-6 py-3.5 rounded-xl bg-[#7c3aed] text-white text-sm font-semibold hover:bg-[#6d28d9] disabled:opacity-50 transition-colors whitespace-nowrap"
              >
                {loading ? "분석중..." : "분석하기"}
              </button>
            </div>
          </div>

          {/* Results */}
          {brand && !loading && (
            <>
              {/* Summary KPIs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "분석 브랜드", value: `@${brand}`, sub: "인스타그램" },
                  { label: "예상 총 광고비 (180일)", value: fmtKRW(totalCost), sub: "추정치" },
                  { label: "월 평균 캠페인 빈도", value: `${avgMonthlyFreq}회`, sub: "6개월 기준" },
                ].map((kpi) => (
                  <div key={kpi.label} className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                    <div className="text-xs text-[#6B7280] mb-1">{kpi.label}</div>
                    <div className="text-xl font-bold text-[#7c3aed]">{kpi.value}</div>
                    <div className="text-xs text-[#9CA3AF] mt-1">{kpi.sub}</div>
                  </div>
                ))}
              </div>

              {/* Influencer list */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-[#374151]">최근 180일간 협업 인플루언서</h3>
                    <p className="text-xs text-[#9CA3AF]">스폰서드 게시물 기반 추정 (목업 데이터)</p>
                  </div>
                  {!isAuthed && (
                    <span className="text-xs text-[#6B7280] bg-[#F9FAFB] px-3 py-1 rounded-full border border-[#E5E7EB]">
                      3 / 8명 표시
                    </span>
                  )}
                </div>

                {/* Visible rows */}
                <div>
                  {influencers.slice(0, visibleCount).map((inf) => (
                    <div key={inf.id} className="flex items-center gap-4 px-6 py-4 border-b border-[#E5E7EB] last:border-0 hover:bg-[#F9FAFB] transition-colors">
                      <img
                        src={inf.avatar}
                        alt={inf.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#E5E7EB] flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-[#111827]">{inf.name}</div>
                        <div className="text-xs text-[#9CA3AF]">@{inf.username}</div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <div className="text-sm font-semibold text-[#111827]">{fmtFollowers(inf.followers)}</div>
                        <div className="text-xs text-[#9CA3AF]">팔로워</div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <div className="text-sm font-semibold text-[#7c3aed]">{inf.er}%</div>
                        <div className="text-xs text-[#9CA3AF]">ER</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-[#111827]">{inf.posts}건</div>
                        <div className="text-xs text-[#9CA3AF]">협업</div>
                      </div>
                      <div className="text-right hidden md:block">
                        <div className="text-sm font-semibold text-[#374151]">{fmtKRW(estimateCost(inf.followers, inf.posts))}</div>
                        <div className="text-xs text-[#9CA3AF]">예상 비용</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Blurred remaining rows (non-auth) */}
                {!isAuthed && (
                  <BlurOverlay
                    ctaText="전체 인플루언서 보기"
                    ctaLink="/signup"
                    blurIntensity={6}
                    className="border-t border-[#E5E7EB]"
                  >
                    <div>
                      {influencers.slice(visibleCount).map((inf) => (
                        <div key={inf.id} className="flex items-center gap-4 px-6 py-4 border-b border-[#E5E7EB] last:border-0">
                          <div className="w-10 h-10 rounded-full bg-[#E5E7EB] flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="h-3 bg-[#E5E7EB] rounded w-24 mb-1.5" />
                            <div className="h-2.5 bg-[#E5E7EB] rounded w-16" />
                          </div>
                          <div className="text-right hidden sm:block w-16">
                            <div className="h-3 bg-[#E5E7EB] rounded w-12 mb-1" />
                            <div className="h-2.5 bg-[#E5E7EB] rounded w-8" />
                          </div>
                          <div className="text-right hidden sm:block w-10">
                            <div className="h-3 bg-[#E5E7EB] rounded w-8 mb-1" />
                            <div className="h-2.5 bg-[#E5E7EB] rounded w-5" />
                          </div>
                          <div className="text-right w-10">
                            <div className="h-3 bg-[#E5E7EB] rounded w-8 mb-1" />
                            <div className="h-2.5 bg-[#E5E7EB] rounded w-6" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </BlurOverlay>
                )}
              </div>

              {/* Category donut + export */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Donut chart — auth gated */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-[#374151] mb-1">주력 카테고리</h3>
                  <p className="text-xs text-[#9CA3AF] mb-4">협업 인플루언서 카테고리 분포</p>
                  {isAuthed ? (
                    <DonutChart data={categoryData} />
                  ) : (
                    <div className="relative">
                      <div style={{ filter: "blur(5px)", pointerEvents: "none", userSelect: "none" }}>
                        <DonutChart data={categoryData} />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/90 border border-[#E5E7EB] rounded-2xl px-5 py-4 text-center shadow-lg">
                          <p className="text-sm font-semibold text-[#111827] mb-1">카테고리 분석</p>
                          <p className="text-xs text-[#6B7280] mb-3">무료 가입 후 확인</p>
                          <Link href="/signup" className="inline-flex items-center justify-center px-4 py-2 bg-[#7c3aed] text-white text-sm font-semibold rounded-lg hover:bg-[#6d28d9] transition-colors">
                            가입하기
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Export / summary */}
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-[#374151] mb-4">분석 요약</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center py-2 border-b border-[#E5E7EB]">
                        <span className="text-[#6B7280]">총 협업 인플루언서</span>
                        <span className="font-semibold">8명</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-[#E5E7EB]">
                        <span className="text-[#6B7280]">총 협업 게시물</span>
                        <span className="font-semibold">{influencers.reduce((s, i) => s + i.posts, 0)}건</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-[#E5E7EB]">
                        <span className="text-[#6B7280]">평균 팔로워</span>
                        <span className="font-semibold">
                          {fmtFollowers(Math.round(influencers.reduce((s, i) => s + i.followers, 0) / influencers.length))}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-[#6B7280]">평균 ER</span>
                        <span className="font-semibold text-[#7c3aed]">
                          {(influencers.reduce((s, i) => s + i.er, 0) / influencers.length).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  {isAuthed ? (
                    <button className="mt-6 w-full py-3 rounded-xl border border-[#7c3aed] text-[#7c3aed] text-sm font-semibold hover:bg-[#7c3aed]/5 transition-colors">
                      CSV로 내보내기 →
                    </button>
                  ) : (
                    <Link
                      href="/signup"
                      className="mt-6 block text-center w-full py-3 rounded-xl bg-[#7c3aed] text-white text-sm font-semibold hover:bg-[#6d28d9] transition-colors"
                    >
                      가입하고 전체 리포트 받기 →
                    </Link>
                  )}
                </div>
              </div>
            </>
          )}

          {/* CTA */}
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: "linear-gradient(135deg, #7c3aed15, #e9456015)" }}
          >
            <h3 className="text-lg font-bold text-[#111827] mb-2">경쟁사보다 스마트한 인플루언서 전략</h3>
            <p className="text-sm text-[#6B7280] mb-4">
              Inflix로 경쟁사의 인플루언서 파트너십을 추적하고 더 효율적인 전략을 수립하세요.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#7c3aed] text-white font-semibold hover:bg-[#6d28d9] transition-colors text-sm"
            >
              무료 가입하기 →
            </Link>
          </div>
        </div>
      </section>

      {/* SEO */}
      <section className="py-16 px-4 bg-[#F9FAFB] border-t border-[#E5E7EB]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#111827] mb-4">경쟁사 인플루언서 마케팅 분석이란?</h2>
          <p className="text-[#6B7280] leading-relaxed mb-4">
            경쟁사 인플루언서 분석은 경쟁 브랜드가 어떤 인플루언서와 협업하고 있는지, 어느 카테고리에
            집중하는지, 얼마나 자주 캠페인을 집행하는지 파악하는 전략적 활동입니다.
          </p>
          <p className="text-[#6B7280] leading-relaxed mb-8">
            이 분석을 통해 경쟁사가 아직 협업하지 않은 인플루언서를 발굴하거나, 경쟁사보다 ER이 높은
            채널을 선점하는 등의 차별화 전략을 수립할 수 있습니다.
          </p>

          <h2 className="text-2xl font-bold text-[#111827] mb-6">자주 묻는 질문</h2>
          <div className="space-y-4">
            {[
              {
                q: "데이터는 어디서 수집하나요?",
                a: "본 도구는 공개된 인스타그램 게시물 데이터와 스폰서드 콘텐츠 태그를 기반으로 분석합니다. 현재는 데모 목적의 목업 데이터로 작동하며, 실제 서비스에서는 실시간 데이터를 제공합니다.",
              },
              {
                q: "예상 광고비는 어떻게 계산하나요?",
                a: "팔로워 규모와 게시물 수를 기반으로 업계 평균 단가를 적용한 추정값입니다. 실제 계약 금액은 인플루언서 영향력, 독점 여부, 콘텐츠 형식(릴스/피드/스토리)에 따라 다를 수 있습니다.",
              },
              {
                q: "180일이 분석 기간인 이유는 무엇인가요?",
                a: "인플루언서 마케팅 캠페인의 시즌 패턴을 파악하기 위해서는 최소 6개월(약 180일) 데이터가 필요합니다. 이 기간은 계절성 캠페인, 신제품 출시 패턴을 모두 포함합니다.",
              },
              {
                q: "경쟁사 분석 결과를 어떻게 활용해야 하나요?",
                a: "경쟁사가 자주 협업하는 인플루언서를 파악해 유사한 타겟 오디언스를 보유한 다른 인플루언서를 선점하거나, 경쟁사가 집중하는 카테고리와 차별화된 틈새 카테고리를 공략하는 전략을 수립할 수 있습니다.",
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
              { href: "/tools/emv-calculator", icon: "💎", title: "EMV 계산기", desc: "게시물 1건의 미디어 가치를 계산하세요." },
              { href: "/tools/roi-calculator", icon: "💹", title: "ROI 계산기", desc: "인플루언서 마케팅 예상 ROI를 계산하세요." },
              { href: "/tools/hashtag-analyzer", icon: "#️⃣", title: "해시태그 분석기", desc: "경쟁 난이도와 관련 태그를 분석하세요." },
              { href: "/tools/fake-follower-check", icon: "🛡️", title: "가짜 팔로워 검사", desc: "허위 팔로워 비율을 무료로 확인하세요." },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex items-start gap-4 p-5 rounded-2xl border border-[#E5E7EB] hover:border-[#7c3aed]/40 hover:bg-[#7c3aed]/5 transition-all"
              >
                <div className="text-3xl">{tool.icon}</div>
                <div>
                  <div className="font-semibold text-[#111827] group-hover:text-[#7c3aed] transition-colors">{tool.title}</div>
                  <div className="text-sm text-[#6B7280] mt-1">{tool.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
