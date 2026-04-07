"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlurOverlay from "@/components/BlurOverlay";

// ─── Types & constants ────────────────────────────────────────────────────────

const CATEGORIES = ["뷰티", "패션", "푸드", "여행", "테크", "라이프스타일", "피트니스", "육아"];
const AVATAR_COLORS = ["#7c3aed", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#8b5cf6", "#06b6d4"];

interface InfluencerProfile {
  username: string;
  followers: number;
  er: number;
  aqs: number;
  category: string;
  avatarColor: string;
  similarity?: number;
}

// ─── Seed helpers ─────────────────────────────────────────────────────────────

function seedHash(s: string, offset = 0): number {
  return s.split("").reduce((a, c, i) => a + c.charCodeAt(0) * (i + 1), offset);
}

function makeBase(username: string): InfluencerProfile {
  const seed = seedHash(username);
  return {
    username,
    followers: 10000 + ((seed * 13) % 490000),
    er: parseFloat((1.0 + (seed % 72) / 10).toFixed(2)),
    aqs: 50 + (seed % 45),
    category: CATEGORIES[seed % CATEGORIES.length],
    avatarColor: AVATAR_COLORS[seed % AVATAR_COLORS.length],
  };
}

const LOOKALIKE_NAMES = [
  "glow_unni", "denim_soo", "pasta_gio", "island_kyu", "apple_ara",
  "daily_hana", "velvet_ro", "thrift_go", "sky_ji", "data_minho",
];

function generateLookalikes(base: InfluencerProfile): InfluencerProfile[] {
  const baseSeed = seedHash(base.username);
  return LOOKALIKE_NAMES.map((name, i) => {
    const seed = seedHash(name) + baseSeed % 97 + i * 13;
    // Similarity: weighted random, biased high (60–95)
    const rawSim = 60 + ((seed * 7 + baseSeed * 3) % 36);
    // Same category as base for top candidates, drift for lower ones
    const category = i < 4 ? base.category : CATEGORIES[(seed + i) % CATEGORIES.length];
    // Follower range ±30% of base
    const followerVariance = base.followers * 0.3;
    const followers = Math.round(
      base.followers - followerVariance + ((seed * 11) % (followerVariance * 2))
    );
    return {
      username: name,
      followers: Math.max(5000, followers),
      er: parseFloat((base.er * (0.7 + (seed % 60) / 100)).toFixed(2)),
      aqs: Math.min(95, Math.max(40, base.aqs + ((seed % 20) - 10))),
      category,
      avatarColor: AVATAR_COLORS[seed % AVATAR_COLORS.length],
      similarity: rawSim,
    };
  }).sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0));
}

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function SimilarityBadge({ value }: { value: number }) {
  const color =
    value >= 80 ? "#10b981" : value >= 70 ? "#7c3aed" : "#f59e0b";
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
      style={{ backgroundColor: `${color}18`, color }}
    >
      {value}% 유사
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function LookalikePage() {
  const { data: session } = useSession();
  const isAuth = !!session;

  const [input, setInput] = useState("");
  const [searched, setSearched] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    const q = input.replace(/^@/, "").trim();
    if (!q) return;
    setLoading(true);
    setTimeout(() => {
      setSearched(q);
      setLoading(false);
    }, 800);
  };

  const base = searched ? makeBase(searched) : null;
  const lookalikes = base ? generateLookalikes(base) : [];
  const visibleLookalikes = isAuth ? lookalikes : lookalikes.slice(0, 3);
  const blurredLookalikes = !isAuth ? lookalikes.slice(3) : [];

  const COMPARISON_ROWS = [
    { label: "팔로워", render: (d: InfluencerProfile) => formatFollowers(d.followers) },
    { label: "참여율", render: (d: InfluencerProfile) => `${d.er}%` },
    { label: "AQS", render: (d: InfluencerProfile) => String(d.aqs) },
    { label: "카테고리", render: (d: InfluencerProfile) => d.category },
  ];

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
            🔎 무료 유사 인플루언서 탐색
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            유사 인플루언서 찾기
          </h1>
          <p className="text-lg text-[#6B7280] mb-2">
            특정 인플루언서와 비슷한 스타일·규모·참여율의 계정을 즉시 찾아드립니다.
          </p>
          <p className="text-sm text-[#9CA3AF]">
            {isAuth
              ? "10명 전체 결과 + 상세 비교표 이용 가능"
              : "비로그인: 상위 3명 무료 공개 — 전체 보기는 무료 회원가입 후 가능"}
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
            <label className="block text-sm font-semibold text-[#374151] mb-3">
              기준 인플루언서 사용자명
            </label>
            <div className="flex gap-3">
              <div className="flex-1 flex items-center border border-[#E5E7EB] rounded-xl px-4 focus-within:border-[#7c3aed] focus-within:ring-2 focus-within:ring-[#7c3aed]/20 transition-all">
                <span className="text-[#9CA3AF] mr-1 font-medium text-sm">@</span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="사용자명 입력"
                  className="flex-1 py-3 outline-none text-sm bg-transparent"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading || !input.trim()}
                className="px-6 py-3 rounded-xl bg-[#7c3aed] text-white text-sm font-semibold hover:bg-[#6d28d9] disabled:opacity-50 transition-colors whitespace-nowrap"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    분석 중
                  </span>
                ) : "유사 인플루언서 찾기"}
              </button>
            </div>

            {/* Similarity weights legend */}
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                ["카테고리 일치", "30%"],
                ["팔로워 규모", "25%"],
                ["참여율 유사도", "20%"],
                ["콘텐츠 유형", "15%"],
                ["AQS 점수", "10%"],
              ].map(([label, pct]) => (
                <span
                  key={label}
                  className="text-xs px-2.5 py-1 rounded-full bg-[#F9FAFB] border border-[#E5E7EB] text-[#6B7280]"
                >
                  {label} <strong className="text-[#7c3aed]">{pct}</strong>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      {searched && base && (
        <section className="px-4 pb-16">
          <div className="max-w-5xl mx-auto space-y-8">

            {/* Base influencer + mini comparison */}
            <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide mb-4">기준 인플루언서</h2>
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
                  style={{ backgroundColor: base.avatarColor }}
                >
                  {base.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-bold text-lg text-[#111827]">@{base.username}</div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-sm text-[#6B7280]">팔로워 {formatFollowers(base.followers)}</span>
                    <span className="text-sm text-[#6B7280]">ER {base.er}%</span>
                    <span className="text-sm text-[#6B7280]">AQS {base.aqs}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#7c3aed]/10 text-[#7c3aed] font-medium">
                      {base.category}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lookalike cards grid */}
            <div>
              <h2 className="text-base font-semibold text-[#111827] mb-4">
                유사 인플루언서{" "}
                <span className="text-sm font-normal text-[#9CA3AF]">
                  ({isAuth ? "10명 전체" : "3명 공개"})
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleLookalikes.map((inf) => (
                  <div
                    key={inf.username}
                    className="bg-white border border-[#E5E7EB] rounded-2xl p-5 hover:border-[#7c3aed]/40 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                          style={{ backgroundColor: inf.avatarColor }}
                        >
                          {inf.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-[#111827]">@{inf.username}</div>
                          <div className="text-xs text-[#9CA3AF]">{inf.category}</div>
                        </div>
                      </div>
                      {inf.similarity !== undefined && <SimilarityBadge value={inf.similarity} />}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-sm font-bold text-[#111827]">{formatFollowers(inf.followers)}</div>
                        <div className="text-xs text-[#9CA3AF]">팔로워</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#7c3aed]">{inf.er}%</div>
                        <div className="text-xs text-[#9CA3AF]">참여율</div>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#111827]">{inf.aqs}</div>
                        <div className="text-xs text-[#9CA3AF]">AQS</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Blurred remaining cards */}
              {blurredLookalikes.length > 0 && (
                <div className="mt-4">
                  <BlurOverlay
                    ctaText="무료 가입으로 10명 전체 보기"
                    ctaLink="/signup"
                    blurIntensity={6}
                    className="rounded-2xl"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {blurredLookalikes.map((inf) => (
                        <div
                          key={inf.username}
                          className="bg-white border border-[#E5E7EB] rounded-2xl p-5"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                style={{ backgroundColor: inf.avatarColor }}
                              >
                                {inf.username.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-semibold text-sm text-[#111827]">@{inf.username}</div>
                                <div className="text-xs text-[#9CA3AF]">{inf.category}</div>
                              </div>
                            </div>
                            {inf.similarity !== undefined && <SimilarityBadge value={inf.similarity} />}
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                              <div className="text-sm font-bold text-[#111827]">{formatFollowers(inf.followers)}</div>
                              <div className="text-xs text-[#9CA3AF]">팔로워</div>
                            </div>
                            <div>
                              <div className="text-sm font-bold text-[#7c3aed]">{inf.er}%</div>
                              <div className="text-xs text-[#9CA3AF]">참여율</div>
                            </div>
                            <div>
                              <div className="text-sm font-bold text-[#111827]">{inf.aqs}</div>
                              <div className="text-xs text-[#9CA3AF]">AQS</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </BlurOverlay>
                </div>
              )}
            </div>

            {/* Detailed comparison table — auth-gated */}
            <BlurOverlay
              ctaText="무료 가입으로 상세 비교표 보기"
              ctaLink="/signup"
              className="rounded-2xl border border-[#E5E7EB] overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <h2 className="text-base font-semibold text-[#111827]">기준 vs 유사 상세 비교표</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                      <th className="px-4 py-3 text-left font-semibold text-[#374151] w-28">항목</th>
                      <th className="px-4 py-3 text-center font-semibold text-[#7c3aed]">
                        <div
                          className="w-8 h-8 rounded-full inline-flex items-center justify-center text-white text-xs font-bold mx-auto mb-1"
                          style={{ backgroundColor: base.avatarColor }}
                        >
                          {base.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-xs">@{base.username} (기준)</div>
                      </th>
                      {lookalikes.slice(0, 3).map((inf) => (
                        <th key={inf.username} className="px-4 py-3 text-center font-semibold text-[#374151]">
                          <div
                            className="w-8 h-8 rounded-full inline-flex items-center justify-center text-white text-xs font-bold mx-auto mb-1"
                            style={{ backgroundColor: inf.avatarColor }}
                          >
                            {inf.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="text-xs">@{inf.username}</div>
                          {inf.similarity !== undefined && (
                            <div className="text-xs mt-0.5" style={{ color: "#10b981" }}>
                              {inf.similarity}% 유사
                            </div>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_ROWS.map((row, ri) => (
                      <tr key={row.label} className={ri % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"}>
                        <td className="px-4 py-3 font-medium text-[#6B7280] border-r border-[#E5E7EB]">
                          {row.label}
                        </td>
                        <td className="px-4 py-3 text-center font-semibold text-[#7c3aed]">
                          {row.render(base)}
                        </td>
                        {lookalikes.slice(0, 3).map((inf) => (
                          <td key={inf.username} className="px-4 py-3 text-center text-[#111827]">
                            {row.render(inf)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </BlurOverlay>

          </div>
        </section>
      )}

      {/* SEO Content */}
      <section className="py-16 px-4 bg-[#F9FAFB] border-t border-[#E5E7EB]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#111827] mb-4">유사 인플루언서 찾기란?</h2>
          <div className="text-[#6B7280] leading-relaxed space-y-4 mb-10">
            <p>
              유사 인플루언서 탐색(Lookalike Influencer Discovery)은 이미 성과가 검증된 특정 인플루언서와
              유사한 특성을 가진 다른 계정을 자동으로 찾아주는 기능입니다.
              카테고리 일치도(30%), 팔로워 규모(25%), 참여율 유사도(20%), 콘텐츠 유형(15%), AQS(10%)
              5가지 가중치를 조합하여 종합 유사도 점수를 계산합니다.
            </p>
            <p>
              이 도구는 특히 협력 인플루언서가 계약 불가 상태이거나 예산 초과일 때,
              동등한 퀄리티의 대안 후보를 빠르게 찾는 데 유용합니다.
              또한 경쟁사가 협업하는 인플루언서의 유사 계정을 탐색하여
              선제적으로 파트너십을 확보하는 전략에도 활용할 수 있습니다.
            </p>
            <p>
              비로그인 상태에서는 상위 3명을 무료로 확인할 수 있으며,
              무료 회원가입 후 10명 전체 결과와 기준 인플루언서 대비 상세 비교표를 이용할 수 있습니다.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-[#111827] mb-6">자주 묻는 질문</h2>
          <div className="space-y-4">
            {[
              {
                q: "유사도 점수는 어떻게 계산되나요?",
                a: "카테고리 일치(30%), 팔로워 규모 ±30% 범위(25%), 참여율 유사도(20%), 콘텐츠 유형(15%), AQS 점수(10%) 5가지 항목을 가중합산하여 0~100% 유사도 점수를 산출합니다.",
              },
              {
                q: "비공개 계정도 탐색할 수 있나요?",
                a: "공개 인스타그램 계정만 분석 가능합니다. 비공개 계정의 경우 팔로워 수 외의 세부 지표를 수집할 수 없어 유사도 계산에서 제외됩니다.",
              },
              {
                q: "결과가 실제 협업에 얼마나 신뢰할 수 있나요?",
                a: "유사 인플루언서 결과는 공개 데이터 기반의 참고 자료입니다. 실제 협업 결정 전에는 Inflix의 상세 분석 도구로 개별 계정을 심층 검토하시길 권장합니다.",
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { href: "/tools/compare", icon: "🔍", title: "인플루언서 비교", desc: "2~5명을 나란히 정밀 비교" },
              { href: "/tools/trending", icon: "🔥", title: "트렌딩 인플루언서", desc: "이번 주 급성장 인플루언서 확인" },
              { href: "/tools/top-influencers", icon: "🏆", title: "카테고리별 TOP 100", desc: "카테고리별 인기 순위 확인" },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="group flex items-start gap-3 p-5 rounded-2xl border border-[#E5E7EB] hover:border-[#7c3aed]/40 hover:bg-[#7c3aed]/5 transition-all"
              >
                <div className="text-2xl">{t.icon}</div>
                <div>
                  <div className="font-semibold text-[#111827] group-hover:text-[#7c3aed] transition-colors text-sm">
                    {t.title}
                  </div>
                  <div className="text-xs text-[#6B7280] mt-1">{t.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 bg-[#F9FAFB] border-t border-[#E5E7EB]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#111827] mb-3">10명 전체 + 상세 비교표 보기</h2>
          <p className="text-[#6B7280] mb-6">
            무료 가입 후 유사 인플루언서 10명 전체와 기준 계정 대비 상세 비교표를 무료로 이용하세요.
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
