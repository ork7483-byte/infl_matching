"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ─── Types & constants ────────────────────────────────────────────────────────

const CATEGORIES = ["전체", "뷰티", "패션", "푸드", "여행", "테크", "라이프스타일"];
const AVATAR_COLORS = ["#7c3aed", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#8b5cf6", "#06b6d4"];

interface TrendingInfluencer {
  rank: number;
  username: string;
  displayName: string;
  category: string;
  followers: number;
  weeklyGain: number;
  growthRate: number;
  er: number;
  avatarColor: string;
  sparkline: { v: number }[];
  hasViralPost: boolean;
}

// ─── Deterministic seed data ──────────────────────────────────────────────────

function seedHash(s: string, offset = 0): number {
  return s.split("").reduce((a, c, i) => a + c.charCodeAt(0) * (i + 1), offset);
}

const RAW_NAMES = [
  "bloom_ara", "neon_yujin", "chill_sora", "pixel_haru", "dew_mina",
  "cloud_nari", "prism_tae", "velvet_ji", "flare_soo", "grove_yeon",
  "rust_minho", "spark_remi", "gloss_unni", "drift_kyu", "nova_luna",
  "haze_boram", "glow_sera", "moss_jinu", "slate_da", "echo_hayoon",
];

const SEED_INFLUENCERS: TrendingInfluencer[] = RAW_NAMES.map((username, i) => {
  const seed = seedHash(username) + i * 11;
  const cats = CATEGORIES.slice(1);
  const followers = 20000 + ((seed * 17) % 480000);
  const weeklyGain = 800 + ((seed * 7) % 14200);
  const growthRate = parseFloat(((weeklyGain / followers) * 100).toFixed(1));

  // 7-day sparkline
  const sparkBase = 100 + (seed % 200);
  const sparkline = Array.from({ length: 7 }, (_, d) => ({
    v: sparkBase + Math.abs(Math.sin(seed + d) * 80) + d * (weeklyGain / 700),
  }));

  return {
    rank: i + 1,
    username,
    displayName: username.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    category: cats[seed % cats.length],
    followers,
    weeklyGain,
    growthRate,
    er: parseFloat((1.2 + (seed % 62) / 10).toFixed(2)),
    avatarColor: AVATAR_COLORS[seed % AVATAR_COLORS.length],
    sparkline,
    hasViralPost: seed % 3 !== 0,
  };
});

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

// ─── Sparkline component ──────────────────────────────────────────────────────

function Sparkline({ data, color = "#7c3aed" }: { data: { v: number }[]; color?: string }) {
  return (
    <ResponsiveContainer width={72} height={32}>
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
        />
        <Tooltip
          contentStyle={{ display: "none" }}
          cursor={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function TrendingPage() {
  const [activeCategory, setActiveCategory] = useState("전체");

  const ranked = useMemo(() => {
    const filtered =
      activeCategory === "전체"
        ? SEED_INFLUENCERS
        : SEED_INFLUENCERS.filter((inf) => inf.category === activeCategory);
    return [...filtered]
      .sort((a, b) => b.growthRate - a.growthRate)
      .map((inf, i) => ({ ...inf, rank: i + 1 }));
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <Navbar />

      {/* Hero */}
      <section className="py-16 px-4 text-center bg-[#F9FAFB] border-b border-[#E5E7EB]">
        <div className="max-w-3xl mx-auto">
          {/* Weekly update badge */}
          <div className="flex items-center justify-center gap-3 mb-5 flex-wrap">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium"
              style={{ backgroundColor: "#7c3aed15", color: "#7c3aed", border: "1px solid #7c3aed30" }}
            >
              🔥 실시간 트렌딩
            </div>
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium"
              style={{ backgroundColor: "#10b98115", color: "#10b981", border: "1px solid #10b98130" }}
            >
              📅 매주 월요일 업데이트
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            지금 뜨는 인플루언서
          </h1>
          <p className="text-lg text-[#6B7280] mb-2">
            이번 주 팔로워가 가장 빠르게 증가하는 트렌딩 인플루언서를 확인하세요.
          </p>
          <p className="text-sm text-[#9CA3AF]">완전 무료 — 매주 월요일 최신 데이터로 업데이트됩니다.</p>
        </div>
      </section>

      {/* Category tabs */}
      <section className="py-6 px-4 border-b border-[#E5E7EB] bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-[#7c3aed] text-white"
                  : "bg-[#F9FAFB] text-[#6B7280] border border-[#E5E7EB] hover:border-[#7c3aed]/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Trending list */}
      <section className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  <th className="px-4 py-3 text-left font-semibold text-[#374151] w-10">#</th>
                  <th className="px-4 py-3 text-left font-semibold text-[#374151]">인플루언서</th>
                  <th className="px-4 py-3 text-right font-semibold text-[#374151]">팔로워</th>
                  <th className="px-4 py-3 text-right font-semibold text-[#374151]">7일 증가</th>
                  <th className="px-4 py-3 text-right font-semibold text-[#374151]">증가율</th>
                  <th className="px-4 py-3 text-right font-semibold text-[#374151]">참여율</th>
                  <th className="px-4 py-3 text-center font-semibold text-[#374151]">트렌드</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map((inf, i) => (
                  <tr
                    key={inf.username}
                    className={`border-b border-[#E5E7EB] last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"}`}
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`font-bold text-base ${
                          inf.rank === 1
                            ? "text-[#f59e0b]"
                            : inf.rank === 2
                            ? "text-[#9CA3AF]"
                            : inf.rank === 3
                            ? "text-[#cd7c4a]"
                            : "text-[#9CA3AF]"
                        }`}
                      >
                        {inf.rank <= 3 ? ["🥇", "🥈", "🥉"][inf.rank - 1] : inf.rank}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 relative"
                          style={{ backgroundColor: inf.avatarColor }}
                        >
                          {inf.username.charAt(0).toUpperCase()}
                          {inf.hasViralPost && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ef4444] rounded-full flex items-center justify-center text-[9px] text-white font-bold">
                              V
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-[#111827]">{inf.displayName}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs text-[#9CA3AF]">@{inf.username}</span>
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-[#7c3aed]/10 text-[#7c3aed] font-medium">
                              {inf.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-[#111827]">
                      {formatFollowers(inf.followers)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-semibold text-[#10b981]">
                        +{formatFollowers(inf.weeklyGain)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-semibold text-[#7c3aed]">+{inf.growthRate}%</span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-[#111827]">
                      {inf.er}%
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <Sparkline data={inf.sparkline} color={inf.avatarColor} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-[#9CA3AF] mt-4 text-center">
            V 뱃지 = 이번 주 바이럴 게시물 보유 · 매주 월요일 전체 데이터 갱신
          </p>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 px-4 bg-[#F9FAFB] border-t border-[#E5E7EB]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#111827] mb-4">트렌딩 인플루언서란?</h2>
          <div className="text-[#6B7280] leading-relaxed space-y-4 mb-10">
            <p>
              트렌딩 인플루언서는 최근 7일 동안 팔로워 증가율이 가장 높은 인플루언서를 의미합니다.
              단순히 팔로워 수가 많은 것이 아니라, 현재 가장 빠르게 성장하고 있는 계정을 추적합니다.
              이는 브랜드 마케터가 급부상 중인 콘텐츠 크리에이터를 조기에 발견하고,
              경쟁 대비 유리한 조건으로 파트너십을 맺을 수 있는 기회를 제공합니다.
            </p>
            <p>
              바이럴 포스트(V 뱃지)를 보유한 인플루언서는 현재 알고리즘 노출이 집중되어 있어
              단기 캠페인 효율이 특히 높습니다. 트렌딩 목록은 매주 월요일에 전체 업데이트되며,
              뷰티·패션·푸드·여행·테크·라이프스타일 카테고리별로 필터링할 수 있습니다.
            </p>
            <p>
              이 도구는 완전 무료로 제공됩니다. 로그인 없이도 전체 트렌딩 목록을 확인할 수 있으며,
              매주 돌아오면 최신 트렌딩 인플루언서를 바로 파악할 수 있습니다.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-[#111827] mb-6">자주 묻는 질문</h2>
          <div className="space-y-4">
            {[
              {
                q: "트렌딩 순위는 어떤 기준으로 매겨지나요?",
                a: "최근 7일간의 팔로워 증가율(%)을 기준으로 정렬합니다. 절대적인 팔로워 수가 아닌 성장 속도에 집중하므로, 나노·마이크로 인플루언서도 상위에 오를 수 있습니다.",
              },
              {
                q: "바이럴 게시물(V 뱃지)은 어떻게 선정되나요?",
                a: "최근 7일 내 게시물 중 해당 계정 평균 참여율의 3배 이상을 기록한 게시물이 있는 경우 V 뱃지가 표시됩니다. 알고리즘 집중 노출 중인 계정을 빠르게 식별하는 지표입니다.",
              },
              {
                q: "이 데이터를 브랜드 마케팅에 어떻게 활용하나요?",
                a: "트렌딩 인플루언서에게는 알고리즘 추천이 집중되어 도달 범위가 평소보다 2~5배 높은 경우가 많습니다. 단기 제품 론칭, 이벤트 앰배서더, 바이럴 콘텐츠 협업에 적합한 파트너를 빠르게 발굴하세요.",
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
              { href: "/tools/lookalike", icon: "🔎", title: "유사 인플루언서 찾기", desc: "특정 인플루언서와 비슷한 계정 탐색" },
              { href: "/tools/top-influencers", icon: "🏆", title: "카테고리별 TOP 100", desc: "카테고리별 인기 순위 확인" },
              { href: "/tools/brand-mention-tracker", icon: "🔔", title: "브랜드 멘션 트래커", desc: "브랜드 언급량 실시간 모니터링" },
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
          <h2 className="text-2xl font-bold text-[#111827] mb-3">트렌딩 인플루언서와 캠페인 시작하기</h2>
          <p className="text-[#6B7280] mb-6">
            Inflix에서 트렌딩 인플루언서에게 바로 협업 제안을 보내고 캠페인을 기획하세요.
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
