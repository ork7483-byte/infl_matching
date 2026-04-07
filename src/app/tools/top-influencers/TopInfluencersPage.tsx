"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlurOverlay from "@/components/BlurOverlay";

interface Influencer {
  rank: number;
  username: string;
  displayName: string;
  category: string;
  followers: number;
  er: number;
  aqs: number;
  avatarColor: string;
}

const CATEGORIES = ["전체", "뷰티", "패션", "푸드", "여행", "테크", "라이프스타일", "피트니스", "육아"];
type SortKey = "followers" | "er" | "aqs";
const SORT_OPTIONS: { label: string; key: SortKey }[] = [
  { label: "팔로워순", key: "followers" },
  { label: "참여율순", key: "er" },
  { label: "AQS순", key: "aqs" },
];

const COLORS = ["#7c3aed", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#8b5cf6", "#06b6d4"];

// Deterministic seed data — 100 influencers
const SEED_DATA: Omit<Influencer, "rank">[] = (() => {
  const names = [
    "beauty_unnie", "sora_style", "foodie_jinu", "travel_hana", "tech_minho",
    "lifestyle_yeon", "fit_seojun", "mama_boram", "glam_nari", "chic_yujin",
    "eats_daily", "wander_ji", "gadget_soo", "home_remi", "yoga_sunhi",
    "bebe_luna", "blush_ara", "denim_taek", "ramenpro", "island_kyu",
    "dev_hayoon", "cozy_mori", "plank_hero", "bumble_mom", "glow_sera",
    "trendy_bit", "pasta_gio", "jeju_nana", "apple_fan", "daily_hana",
    "sculpt_won", "tofu_chef", "road_haru", "pixel_da", "zenfit_u",
    "twins_mom2", "rosy_look", "cargo_jin", "ramen_pro2", "beach_vida",
    "code_unni", "minimal_mi", "cycle_joo", "kid_mom3", "glow2_ara",
    "streetchic", "hotpot_yu", "alps_trip", "tab_master", "zen_home",
    "flex_dads", "pinkbrow", "oversized_k", "sushi_jo", "camping_kr",
    "ux_writer", "nordic_mi", "swim_star", "crayon_mom", "aura_shine",
    "palms_jen", "bib_world", "seoul_snap", "filter_pro", "mat_queen",
    "toddler_hug", "velvet_ro", "thrift_go", "croissant_k", "sky_drive",
    "data_nerd", "linen_love", "hiit_king", "potty_train", "dewy_skin",
    "alley_cat", "dumplings", "hidden_gem", "drone_view", "ai_talks",
    "pillows_ok", "marathon_k", "abc_baby", "shimmer_g", "cactus_kr",
    "kbbq_time", "forest_run", "react_gal", "rustic_jo", "squat_100",
    "newborn_q", "blondie_kr", "jogger_fit", "tempura_s", "mountain_d",
    "cloud_nine", "oak_table", "sprint_u", "bao_lover", "peak_view",
  ];
  const cats = CATEGORIES.slice(1);
  return names.map((username, i) => {
    const seed = username.split("").reduce((a, c) => a + c.charCodeAt(0), 0) + i * 7;
    return {
      username,
      displayName: username.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      category: cats[seed % cats.length],
      followers: 5000 + ((seed * 13) % 995000),
      er: parseFloat((0.8 + (seed % 82) / 10).toFixed(2)),
      aqs: 45 + (seed % 50),
      avatarColor: COLORS[seed % COLORS.length],
    };
  });
})();

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export default function TopInfluencersPage() {
  const { data: session } = useSession();
  const isAuth = !!session;

  const [activeCategory, setActiveCategory] = useState("전체");
  const [sortKey, setSortKey] = useState<SortKey>("followers");

  const visibleLimit = isAuth ? 100 : 20;

  const ranked = useMemo(() => {
    const filtered = activeCategory === "전체"
      ? SEED_DATA
      : SEED_DATA.filter((inf) => inf.category === activeCategory);

    const sorted = [...filtered].sort((a, b) => b[sortKey] - a[sortKey]);
    return sorted.map((inf, i) => ({ ...inf, rank: i + 1 }));
  }, [activeCategory, sortKey]);

  const handleCSV = useCallback(() => {
    const header = "순위,사용자명,카테고리,팔로워,참여율,AQS";
    const rows = ranked
      .slice(0, 100)
      .map((r) => `${r.rank},@${r.username},${r.category},${r.followers},${r.er}%,${r.aqs}`)
      .join("\n");
    const blob = new Blob([header + "\n" + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inflix-top-influencers-${activeCategory}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [ranked, activeCategory]);

  const visibleRanked = ranked.slice(0, visibleLimit);
  const blurredRanked = !isAuth ? ranked.slice(visibleLimit, 30) : [];

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
            🏆 무료 랭킹 도구
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            카테고리별 인기 인플루언서 TOP 100
          </h1>
          <p className="text-lg text-[#6B7280] mb-2">
            카테고리별 인기 인플루언서 순위를 팔로워, 참여율, AQS 기준으로 확인하세요.
          </p>
          <p className="text-sm text-[#9CA3AF]">
            {isAuth ? "TOP 100 전체 + CSV 내보내기 가능" : "TOP 20 무료 공개 — 전체 보기는 무료 회원가입 후 가능"}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-4 border-b border-[#E5E7EB] bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto space-y-4">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
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

          {/* Sort + CSV */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-[#6B7280]">정렬:</span>
            {SORT_OPTIONS.map(({ label, key }) => (
              <button
                key={key}
                onClick={() => setSortKey(key)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  sortKey === key
                    ? "bg-[#7c3aed]/10 text-[#7c3aed] font-semibold"
                    : "text-[#6B7280] hover:text-[#7c3aed]"
                }`}
              >
                {label}
              </button>
            ))}
            {isAuth && (
              <button
                onClick={handleCSV}
                className="ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-[#E5E7EB] text-sm text-[#374151] hover:border-[#7c3aed]/40 hover:text-[#7c3aed] transition-colors"
              >
                CSV 내보내기
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Ranking Table */}
      <section className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB]">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                  <th className="px-4 py-3 text-left font-semibold text-[#374151] w-12">#</th>
                  <th className="px-4 py-3 text-left font-semibold text-[#374151]">인플루언서</th>
                  <th className="px-4 py-3 text-right font-semibold text-[#374151]">팔로워</th>
                  <th className="px-4 py-3 text-right font-semibold text-[#374151]">참여율</th>
                  <th className="px-4 py-3 text-right font-semibold text-[#374151]">AQS</th>
                  <th className="px-4 py-3 text-center font-semibold text-[#374151]">카테고리</th>
                </tr>
              </thead>
              <tbody>
                {visibleRanked.map((inf, i) => (
                  <tr
                    key={inf.username}
                    className={`border-b border-[#E5E7EB] last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"}`}
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`font-bold text-base ${
                          inf.rank === 1 ? "text-[#f59e0b]" :
                          inf.rank === 2 ? "text-[#9CA3AF]" :
                          inf.rank === 3 ? "text-[#cd7c4a]" :
                          "text-[#9CA3AF]"
                        }`}
                      >
                        {inf.rank <= 3 ? ["🥇", "🥈", "🥉"][inf.rank - 1] : inf.rank}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                          style={{ backgroundColor: inf.avatarColor }}
                        >
                          {inf.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-[#111827]">{inf.displayName}</div>
                          <div className="text-xs text-[#9CA3AF]">@{inf.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-[#111827]">
                      {formatFollowers(inf.followers)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-semibold text-[#7c3aed]">{inf.er}%</span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-[#111827]">{inf.aqs}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#7c3aed]/10 text-[#7c3aed]">
                        {inf.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Blurred rows for non-auth */}
          {blurredRanked.length > 0 && (
            <div className="mt-2">
              <BlurOverlay
                ctaText="무료 가입으로 TOP 100 전체 보기"
                ctaLink="/signup"
                blurIntensity={6}
                className="rounded-2xl border border-[#E5E7EB] overflow-hidden"
              >
                <table className="w-full text-sm">
                  <tbody>
                    {blurredRanked.map((inf, i) => (
                      <tr
                        key={inf.username}
                        className={`border-b border-[#E5E7EB] last:border-0 ${i % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"}`}
                      >
                        <td className="px-4 py-3 w-12 font-bold text-[#9CA3AF]">{inf.rank}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                              style={{ backgroundColor: inf.avatarColor }}
                            >
                              {inf.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-[#111827]">{inf.displayName}</div>
                              <div className="text-xs text-[#9CA3AF]">@{inf.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right font-medium">{formatFollowers(inf.followers)}</td>
                        <td className="px-4 py-3 text-right font-semibold text-[#7c3aed]">{inf.er}%</td>
                        <td className="px-4 py-3 text-right">{inf.aqs}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#7c3aed]/10 text-[#7c3aed]">
                            {inf.category}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </BlurOverlay>
            </div>
          )}
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 px-4 bg-[#F9FAFB] border-t border-[#E5E7EB]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#111827] mb-4">카테고리별 인플루언서 랭킹이란?</h2>
          <div className="text-[#6B7280] leading-relaxed space-y-4 mb-10">
            <p>
              인플루언서 랭킹은 팔로워 수, 참여율, AQS 등 다양한 지표를 기반으로 카테고리별 상위 인플루언서를 순위화한 데이터입니다.
              브랜드 마케터와 캠페인 담당자가 빠르게 협력 후보를 파악할 수 있도록 도와줍니다.
            </p>
            <p>
              카테고리는 뷰티, 패션, 푸드, 여행, 테크, 라이프스타일, 피트니스, 육아 등 총 8개로 구분되며,
              각 카테고리 내에서 팔로워순·참여율순·AQS순으로 정렬할 수 있어 캠페인 목표에 맞는 인플루언서를 쉽게 찾을 수 있습니다.
            </p>
            <p>
              비로그인 상태에서는 TOP 20을 무료로 확인할 수 있으며, 무료 회원가입 후 TOP 100 전체 열람과 CSV 내보내기 기능을 이용할 수 있습니다.
              캠페인 기획 단계에서 이 랭킹을 활용하면 섭외 후보 리스트를 빠르게 작성할 수 있습니다.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-[#111827] mb-6">자주 묻는 질문</h2>
          <div className="space-y-4">
            {[
              {
                q: "랭킹은 얼마나 자주 업데이트되나요?",
                a: "랭킹 데이터는 매주 월요일에 업데이트됩니다. 최신 팔로워 수와 참여율을 반영하며, 급성장 중인 인플루언서는 빠르게 순위가 오를 수 있습니다.",
              },
              {
                q: "내 순위가 반영되려면 어떻게 해야 하나요?",
                a: "Inflix에 인플루언서로 등록하면 자동으로 분석 대상에 포함됩니다. 공개 계정을 연동하면 실시간 데이터 기반으로 순위에 포함될 수 있습니다.",
              },
              {
                q: "CSV 내보내기로 어떤 데이터를 받을 수 있나요?",
                a: "순위, 사용자명, 카테고리, 팔로워 수, 참여율, AQS 점수 컬럼이 포함된 CSV 파일을 다운로드할 수 있습니다. 엑셀이나 구글 시트에서 바로 활용하세요.",
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
              { href: "/tools/compare", icon: "🔍", title: "인플루언서 비교", desc: "2~5명을 나란히 비교하세요." },
              { href: "/tools/influencers-by-location", icon: "📍", title: "지역별 인플루언서", desc: "서울·부산 등 지역으로 찾기." },
              { href: "/tools/engagement-rate", icon: "📊", title: "참여율 계산기", desc: "ER을 즉시 계산하세요." },
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
          <h2 className="text-2xl font-bold text-[#111827] mb-3">TOP 100 전체 + CSV 내보내기</h2>
          <p className="text-[#6B7280] mb-6">
            무료 가입하면 모든 카테고리의 TOP 100 인플루언서와 CSV 데이터를 무료로 이용할 수 있어요.
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
