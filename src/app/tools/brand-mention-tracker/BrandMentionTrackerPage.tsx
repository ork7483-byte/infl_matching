"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlurOverlay from "@/components/BlurOverlay";

// ─── Mock data generators ────────────────────────────────────────────────────

const AVATAR_COLORS = ["#7c3aed", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#8b5cf6", "#06b6d4"];

function seedNum(s: string, offset = 0): number {
  return s.split("").reduce((a, c, i) => a + c.charCodeAt(0) * (i + 1), offset);
}

function generateMockPosts(query: string) {
  const seed = seedNum(query);
  const captions = [
    `${query} 써보니까 진짜 대박이에요 👍 이거 강추합니다`,
    `오늘 ${query} 협찬 받았는데 생각보다 너무 좋아서 놀랐어요`,
    `#${query.replace(/^#/, "")} 쓴 지 2주째인데 피부가 확 달라졌어요`,
    `${query} 사용 후기 올려드려요. 솔직 리뷰!`,
    `이번 달 ${query} 이벤트 참여했는데 당첨됐어요 🎉`,
    `${query} vs 다른 브랜드 비교해봤어요 — 압도적 차이`,
    `#daily #${query.replace(/^#/, "")} 오늘 아침 루틴`,
    `친구 추천으로 ${query} 처음 써봤는데 완전 팬 됐어요`,
    `${query} 언박싱 영상 올릴게요 기대해주세요!`,
    `재구매 완료 🛒 ${query} 없으면 못 살 것 같아요`,
  ];
  return Array.from({ length: 10 }, (_, i) => {
    const s = seed + i * 31;
    return {
      id: i,
      username: `user_${String.fromCharCode(97 + (s % 26))}${String.fromCharCode(97 + ((s * 3) % 26))}${(s % 99).toString().padStart(2, "0")}`,
      caption: captions[i % captions.length],
      likes: 200 + ((s * 7) % 9800),
      comments: 10 + ((s * 3) % 490),
      followers: 1000 + ((s * 13) % 299000),
      color: AVATAR_COLORS[s % AVATAR_COLORS.length],
      timestamp: `${i + 1}일 전`,
    };
  });
}

function generateDailyTrend(query: string) {
  const seed = seedNum(query, 5);
  const days = ["월", "화", "수", "목", "금", "토", "일"];
  return days.map((day, i) => ({
    day,
    count: 40 + ((seed + i * 17) % 160),
  }));
}

const PIE_DATA = [
  { name: "나노 (<1만)", value: 38, color: "#7c3aed" },
  { name: "마이크로 (1~10만)", value: 34, color: "#ec4899" },
  { name: "미드티어 (10~50만)", value: 18, color: "#f59e0b" },
  { name: "매크로 (50만+)", value: 10, color: "#10b981" },
];

const SENTIMENT_DATA = [
  { name: "긍정", value: 60, fill: "#10b981" },
  { name: "중립", value: 30, fill: "#9CA3AF" },
  { name: "부정", value: 10, fill: "#ef4444" },
];

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function BrandMentionTrackerPage() {
  const { data: session } = useSession();
  const isAuth = !!session;

  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setTimeout(() => {
      setSearched(q);
      setLoading(false);
    }, 700);
  };

  const posts = searched ? generateMockPosts(searched) : [];
  const visiblePosts = isAuth ? posts : posts.slice(0, 5);
  const blurredPosts = !isAuth ? posts.slice(5) : [];
  const dailyTrend = searched ? generateDailyTrend(searched) : [];
  const top5 = searched
    ? [...posts].sort((a, b) => b.likes + b.comments * 5 - (a.likes + a.comments * 5)).slice(0, 5)
    : [];

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
            🔔 무료 멘션 트래킹 도구
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            브랜드 멘션 모니터링
          </h1>
          <p className="text-lg text-[#6B7280] mb-2">
            브랜드명 또는 해시태그가 인스타그램에서 얼마나 언급되는지 무료로 확인하세요.
          </p>
          <p className="text-sm text-[#9CA3AF]">
            {isAuth
              ? "전체 분석 + 감정 분석 + 알림 설정 이용 가능"
              : "비로그인: 최근 5개 멘션 + 일별 트렌드 무료 공개"}
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
            <label className="block text-sm font-semibold text-[#374151] mb-3">
              브랜드명 또는 해시태그 입력
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="예: 이니스프리, #skincare, #뷰티"
                className="flex-1 px-4 py-3 rounded-xl border border-[#E5E7EB] outline-none text-sm focus:border-[#7c3aed] focus:ring-2 focus:ring-[#7c3aed]/20 transition-all"
              />
              <button
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                className="px-6 py-3 rounded-xl bg-[#7c3aed] text-white text-sm font-semibold hover:bg-[#6d28d9] disabled:opacity-50 transition-colors whitespace-nowrap"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    추적 중
                  </span>
                ) : "추적하기"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      {searched && (
        <>
          {/* Stats bar */}
          <section className="px-4 pb-4">
            <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "최근 7일 멘션", value: "847", icon: "📢" },
                { label: "평균 좋아요", value: "2,341", icon: "❤️" },
                { label: "평균 댓글", value: "128", icon: "💬" },
                { label: "도달 추정", value: "4.2M", icon: "👁" },
              ].map((stat) => (
                <div key={stat.label} className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-xl font-bold text-[#111827]">{stat.value}</div>
                  <div className="text-xs text-[#6B7280] mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="px-4 pb-12">
            <div className="max-w-5xl mx-auto space-y-8">

              {/* Daily trend line chart */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
                <h2 className="text-base font-semibold text-[#111827] mb-4">일별 멘션 수 (최근 7일)</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={dailyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                    <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} width={32} />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }}
                      formatter={(val) => [`${val}건`, "멘션 수"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#7c3aed"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "#7c3aed" }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Posts list */}
              <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
                  <h2 className="text-base font-semibold text-[#111827]">
                    최근 멘션 게시물{" "}
                    <span className="text-sm font-normal text-[#9CA3AF]">
                      ({isAuth ? "전체 10개" : "5개 공개"})
                    </span>
                  </h2>
                </div>
                <div className="divide-y divide-[#E5E7EB]">
                  {visiblePosts.map((post) => (
                    <div key={post.id} className="px-6 py-4 flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: post.color }}
                      >
                        {post.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-[#111827]">@{post.username}</span>
                          <span className="text-xs text-[#9CA3AF]">{post.timestamp}</span>
                          <span className="ml-auto text-xs text-[#9CA3AF]">
                            팔로워 {formatFollowers(post.followers)}
                          </span>
                        </div>
                        <p className="text-sm text-[#374151] line-clamp-2 leading-relaxed">{post.caption}</p>
                        <div className="flex gap-4 mt-1.5 text-xs text-[#9CA3AF]">
                          <span>❤️ {post.likes.toLocaleString()}</span>
                          <span>💬 {post.comments.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Blurred remaining posts */}
                {blurredPosts.length > 0 && (
                  <BlurOverlay
                    ctaText="무료 가입으로 전체 멘션 보기"
                    ctaLink="/signup"
                    blurIntensity={6}
                    className="border-t border-[#E5E7EB]"
                  >
                    <div className="divide-y divide-[#E5E7EB]">
                      {blurredPosts.map((post) => (
                        <div key={post.id} className="px-6 py-4 flex items-start gap-4">
                          <div
                            className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm"
                            style={{ backgroundColor: post.color }}
                          >
                            {post.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm text-[#111827]">@{post.username}</span>
                              <span className="text-xs text-[#9CA3AF]">{post.timestamp}</span>
                            </div>
                            <p className="text-sm text-[#374151] line-clamp-2">{post.caption}</p>
                            <div className="flex gap-4 mt-1.5 text-xs text-[#9CA3AF]">
                              <span>❤️ {post.likes.toLocaleString()}</span>
                              <span>💬 {post.comments.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </BlurOverlay>
                )}
              </div>

              {/* Two charts row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pie chart — follower tier */}
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
                  <h2 className="text-base font-semibold text-[#111827] mb-4">멘션 계정 팔로워 규모 분류</h2>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={PIE_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={52}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {PIE_DATA.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(val) => [`${val}%`, ""]}
                        contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }}
                      />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Top 5 influential mentions */}
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
                  <h2 className="text-base font-semibold text-[#111827] mb-4">영향력 있는 멘션 TOP 5</h2>
                  <div className="space-y-3">
                    {top5.map((post, i) => (
                      <div key={post.id} className="flex items-center gap-3">
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ backgroundColor: i === 0 ? "#f59e0b" : i === 1 ? "#9CA3AF" : i === 2 ? "#cd7c4a" : "#E5E7EB", color: i >= 3 ? "#6B7280" : "white" }}
                        >
                          {i + 1}
                        </span>
                        <div
                          className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: post.color }}
                        >
                          {post.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-[#111827] truncate">@{post.username}</div>
                          <div className="text-xs text-[#9CA3AF]">
                            {formatFollowers(post.followers)} 팔로워 · ❤️ {post.likes.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sentiment analysis — gated */}
              <BlurOverlay
                ctaText="무료 가입으로 감정 분석 보기"
                ctaLink="/signup"
                className="bg-white border border-[#E5E7EB] rounded-2xl p-6"
              >
                <h2 className="text-base font-semibold text-[#111827] mb-4">감정 분석: 긍정 / 중립 / 부정</h2>
                <div className="flex items-center gap-6 mb-4">
                  {SENTIMENT_DATA.map((s) => (
                    <div key={s.name} className="text-center">
                      <div className="text-2xl font-bold" style={{ color: s.fill }}>{s.value}%</div>
                      <div className="text-xs text-[#6B7280] mt-0.5">{s.name}</div>
                    </div>
                  ))}
                </div>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={SENTIMENT_DATA} layout="vertical" barSize={20}>
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 12, fill: "#6B7280" }}
                      width={32}
                    />
                    <Tooltip
                      formatter={(val) => [`${val}%`, ""]}
                      contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB" }}
                    />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      {SENTIMENT_DATA.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </BlurOverlay>

            </div>
          </section>
        </>
      )}

      {/* SEO Content */}
      <section className="py-16 px-4 bg-[#F9FAFB] border-t border-[#E5E7EB]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#111827] mb-4">브랜드 멘션 모니터링이란?</h2>
          <div className="text-[#6B7280] leading-relaxed space-y-4 mb-10">
            <p>
              브랜드 멘션 모니터링은 인스타그램에서 특정 브랜드명이나 해시태그가 얼마나, 어떤 방식으로 언급되는지
              추적하는 마케팅 인텔리전스 활동입니다. 소비자가 자발적으로 올리는 UGC(사용자 생성 콘텐츠)와
              인플루언서 게시물을 실시간으로 파악할 수 있어 브랜드 인지도와 캠페인 효과 측정에 필수적입니다.
            </p>
            <p>
              일별 멘션 트렌드를 통해 캠페인이 집행된 날 전후로 언급량이 어떻게 변화했는지 확인하고,
              멘션 계정의 팔로워 규모 분류를 통해 나노·마이크로·미드티어·매크로 인플루언서 중 어느 층에서
              반응이 높은지 파악할 수 있습니다.
            </p>
            <p>
              감정 분석은 멘션 텍스트를 긍정·중립·부정으로 분류하여 브랜드 이미지를 정량적으로 측정합니다.
              무료 회원가입 후 감정 분석 결과와 실시간 알림 설정을 이용할 수 있습니다.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-[#111827] mb-6">자주 묻는 질문</h2>
          <div className="space-y-4">
            {[
              {
                q: "해시태그와 브랜드명 모두 추적할 수 있나요?",
                a: "#해시태그 형식과 브랜드명 텍스트 모두 입력 가능합니다. #뷰티, 이니스프리, @브랜드계정 등 다양한 형식을 지원합니다.",
              },
              {
                q: "비로그인 상태에서는 얼마나 확인할 수 있나요?",
                a: "비로그인 시 최근 5개 멘션 게시물과 일별 트렌드 차트를 무료로 확인할 수 있습니다. 무료 회원가입 후 전체 10개 멘션, 감정 분석, 팔로워 규모 분류, 영향력 상위 5개 계정을 모두 이용할 수 있습니다.",
              },
              {
                q: "감정 분석은 어떻게 작동하나요?",
                a: "게시물 캡션 텍스트를 자연어 처리(NLP) 모델로 분석하여 긍정·중립·부정 3가지로 분류합니다. 이모지, 슬랭, 한국어 맥락을 반영한 커스텀 모델을 사용합니다.",
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
              { href: "/tools/trending", icon: "🔥", title: "트렌딩 인플루언서", desc: "이번 주 급성장 인플루언서 확인" },
              { href: "/tools/fake-follower-check", icon: "🕵️", title: "가짜 팔로워 체크", desc: "멘션 계정의 진성 팔로워 비율" },
              { href: "/tools/engagement-rate", icon: "📊", title: "참여율 계산기", desc: "멘션 계정의 ER 즉시 계산" },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="group flex items-start gap-3 p-5 rounded-2xl border border-[#E5E7EB] hover:border-[#7c3aed]/40 hover:bg-[#7c3aed]/5 transition-all"
              >
                <div className="text-2xl">{t.icon}</div>
                <div>
                  <div className="font-semibold text-[#111827] group-hover:text-[#7c3aed] transition-colors text-sm">{t.title}</div>
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
          <h2 className="text-2xl font-bold text-[#111827] mb-3">전체 감정 분석 + 알림 설정</h2>
          <p className="text-[#6B7280] mb-6">
            무료 가입 후 브랜드 멘션 감정 분석, 실시간 알림, 전체 멘션 기록을 무료로 이용하세요.
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
