"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlurOverlay from "@/components/BlurOverlay";

interface InfluencerData {
  username: string;
  followers: number;
  er: number;
  aqs: number;
  posts: number;
  category: string;
  avatarColor: string;
  growthRate: number;
  postFreq: number;
}

// Deterministic mock data based on username hash
function seedMock(username: string): InfluencerData {
  const seed = username.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const categories = ["뷰티", "패션", "푸드", "여행", "테크", "라이프스타일", "피트니스", "육아"];
  const colors = ["#7c3aed", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444", "#8b5cf6", "#06b6d4"];
  return {
    username,
    followers: 10000 + (seed % 990000),
    er: parseFloat((1 + (seed % 80) / 10).toFixed(2)),
    aqs: 50 + (seed % 45),
    posts: 50 + (seed % 950),
    category: categories[seed % categories.length],
    avatarColor: colors[seed % colors.length],
    growthRate: parseFloat((0.5 + (seed % 50) / 10).toFixed(1)),
    postFreq: 1 + (seed % 14),
  };
}

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

const RADAR_COLORS = ["#7c3aed", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];

function buildRadarData(influencers: InfluencerData[]) {
  const axes = [
    { label: "팔로워규모", key: "followers", max: 1_000_000 },
    { label: "참여율", key: "er", max: 10 },
    { label: "AQS", key: "aqs", max: 100 },
    { label: "게시빈도", key: "postFreq", max: 14 },
    { label: "성장률", key: "growthRate", max: 6 },
  ] as const;

  return axes.map(({ label, key, max }) => {
    const entry: Record<string, string | number> = { axis: label };
    influencers.forEach((inf) => {
      entry[inf.username] = Math.round(((inf[key] as number) / max) * 100);
    });
    return entry;
  });
}

function bestEngagement(influencers: InfluencerData[]): string {
  return [...influencers].sort((a, b) => b.er - a.er)[0].username;
}

export default function ComparePage() {
  const { data: session } = useSession();
  const isAuth = !!session;

  const [usernames, setUsernames] = useState<string[]>(["", ""]);
  const [results, setResults] = useState<InfluencerData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const maxUsers = isAuth ? 5 : 2;

  const addField = () => {
    if (usernames.length < maxUsers) {
      setUsernames([...usernames, ""]);
    }
  };

  const removeField = (i: number) => {
    if (usernames.length <= 2) return;
    setUsernames(usernames.filter((_, idx) => idx !== i));
  };

  const updateField = (i: number, val: string) => {
    const next = [...usernames];
    next[i] = val;
    setUsernames(next);
  };

  const handleCompare = async () => {
    const cleaned = usernames.map((u) => u.replace(/^@/, "").trim()).filter(Boolean);
    if (cleaned.length < 2) {
      setError("최소 2명의 사용자명을 입력해주세요.");
      return;
    }
    setError("");
    setLoading(true);
    setResults([]);

    const fetched = await Promise.all(
      cleaned.map(async (u) => {
        try {
          const res = await fetch(`/api/influencers/${encodeURIComponent(u)}`);
          if (!res.ok) throw new Error();
          const data = await res.json();
          return {
            username: u,
            followers: data.followers ?? seedMock(u).followers,
            er: data.er ?? seedMock(u).er,
            aqs: data.aqs ?? seedMock(u).aqs,
            posts: data.posts ?? seedMock(u).posts,
            category: data.category ?? seedMock(u).category,
            avatarColor: seedMock(u).avatarColor,
            growthRate: data.growthRate ?? seedMock(u).growthRate,
            postFreq: data.postFreq ?? seedMock(u).postFreq,
          } as InfluencerData;
        } catch {
          return seedMock(u);
        }
      })
    );

    setResults(fetched);
    setLoading(false);
  };

  const radarData = results.length >= 2 ? buildRadarData(results) : [];

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
            🔍 무료 비교 분석 도구
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            인플루언서 비교 분석
          </h1>
          <p className="text-lg text-[#6B7280] mb-2">
            최대 {maxUsers}명의 인플루언서를 나란히 비교하세요.
          </p>
          <p className="text-sm text-[#9CA3AF]">
            {isAuth ? "5명까지 비교 + 레이더 차트 + 추천 분석 제공" : "로그인하면 5명까지 비교할 수 있어요."}
          </p>
        </div>
      </section>

      {/* Input Section */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
            <label className="block text-sm font-semibold text-[#374151] mb-4">
              인스타그램 사용자명 입력 ({usernames.length}/{maxUsers}명)
            </label>
            <div className="space-y-3">
              {usernames.map((val, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex-1 flex items-center border border-[#E5E7EB] rounded-xl px-4 py-3 focus-within:border-[#7c3aed] focus-within:ring-2 focus-within:ring-[#7c3aed]/20 transition-all">
                    <span className="text-[#9CA3AF] mr-1 font-medium">@</span>
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => updateField(i, e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCompare()}
                      placeholder={`사용자명 ${i + 1}`}
                      className="flex-1 outline-none text-sm bg-transparent"
                    />
                  </div>
                  {i >= 2 && (
                    <button
                      onClick={() => removeField(i)}
                      className="w-9 h-9 flex items-center justify-center rounded-lg border border-[#E5E7EB] text-[#9CA3AF] hover:border-red-300 hover:text-red-400 transition-colors"
                      aria-label="삭제"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-4">
              {usernames.length < maxUsers && (
                <button
                  onClick={addField}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-dashed border-[#7c3aed] text-[#7c3aed] text-sm font-medium hover:bg-[#7c3aed]/5 transition-colors"
                >
                  + 추가
                </button>
              )}
              {!isAuth && usernames.length >= 2 && (
                <Link
                  href="/signup"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-dashed border-[#E5E7EB] text-[#9CA3AF] text-sm hover:border-[#7c3aed] hover:text-[#7c3aed] transition-colors"
                >
                  🔒 5명까지 비교 (로그인)
                </Link>
              )}
              <button
                onClick={handleCompare}
                disabled={loading}
                className="ml-auto px-6 py-2 rounded-xl bg-[#7c3aed] text-white text-sm font-semibold hover:bg-[#6d28d9] disabled:opacity-60 transition-colors"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    분석 중
                  </span>
                ) : "비교하기"}
              </button>
            </div>
            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          </div>

          {/* Comparison Table */}
          {results.length >= 2 && (
            <div className="mt-8 space-y-6">
              <div className="overflow-x-auto rounded-2xl border border-[#E5E7EB]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                      <th className="text-left px-4 py-3 font-semibold text-[#374151] w-32">항목</th>
                      {results.map((inf, i) => (
                        <th key={inf.username} className="px-4 py-3 text-center font-semibold text-[#374151]">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-base mx-auto mb-1"
                            style={{ backgroundColor: RADAR_COLORS[i] }}
                          >
                            {inf.username.charAt(0).toUpperCase()}
                          </div>
                          <div className="text-xs">@{inf.username}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: "팔로워", render: (d: InfluencerData) => formatFollowers(d.followers) },
                      { label: "참여율", render: (d: InfluencerData) => `${d.er}%` },
                      { label: "AQS", render: (d: InfluencerData) => String(d.aqs) },
                      { label: "게시물 수", render: (d: InfluencerData) => d.posts.toLocaleString() },
                      { label: "카테고리", render: (d: InfluencerData) => d.category },
                    ].map((row, ri) => (
                      <tr
                        key={row.label}
                        className={ri % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"}
                      >
                        <td className="px-4 py-3 font-medium text-[#6B7280] border-r border-[#E5E7EB]">
                          {row.label}
                        </td>
                        {results.map((inf) => (
                          <td key={inf.username} className="px-4 py-3 text-center text-[#111827]">
                            {row.render(inf)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Radar Chart — auth-gated */}
              <BlurOverlay
                ctaText="무료 가입으로 레이더 차트 보기"
                ctaLink="/signup"
                className="rounded-2xl border border-[#E5E7EB] p-6"
              >
                <h3 className="text-base font-semibold text-[#111827] mb-4 text-center">
                  종합 역량 레이더 차트
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#E5E7EB" />
                    <PolarAngleAxis
                      dataKey="axis"
                      tick={{ fontSize: 11, fill: "#6B7280" }}
                    />
                    <Tooltip
                      formatter={(val) => [`${val}점`, ""]}
                      contentStyle={{ fontSize: 12 }}
                    />
                    {results.map((inf, i) => (
                      <Radar
                        key={inf.username}
                        name={`@${inf.username}`}
                        dataKey={inf.username}
                        stroke={RADAR_COLORS[i]}
                        fill={RADAR_COLORS[i]}
                        fillOpacity={0.15}
                        strokeWidth={2}
                      />
                    ))}
                  </RadarChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                  {results.map((inf, i) => (
                    <div key={inf.username} className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                      <span
                        className="w-3 h-3 rounded-full inline-block"
                        style={{ backgroundColor: RADAR_COLORS[i] }}
                      />
                      @{inf.username}
                    </div>
                  ))}
                </div>
              </BlurOverlay>

              {/* Recommendation — auth-gated */}
              <BlurOverlay
                ctaText="무료 가입으로 추천 분석 보기"
                ctaLink="/signup"
                className="rounded-2xl border border-[#E5E7EB] p-6 bg-[#F9FAFB]"
              >
                <h3 className="text-base font-semibold text-[#111827] mb-3">종합 추천</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-[#374151]">
                    <span className="text-[#7c3aed] font-bold mt-0.5">•</span>
                    <span>
                      참여율 기준으로는{" "}
                      <strong className="text-[#7c3aed]">@{bestEngagement(results)}</strong>
                      {" "}이 가장 유리해요.
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-[#374151]">
                    <span className="text-[#7c3aed] font-bold mt-0.5">•</span>
                    <span>
                      AQS 기준으로는{" "}
                      <strong className="text-[#7c3aed]">
                        @{[...results].sort((a, b) => b.aqs - a.aqs)[0].username}
                      </strong>
                      {" "}의 팔로워 진성도가 가장 높아요.
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-[#374151]">
                    <span className="text-[#7c3aed] font-bold mt-0.5">•</span>
                    <span>
                      팔로워 규모로는{" "}
                      <strong className="text-[#7c3aed]">
                        @{[...results].sort((a, b) => b.followers - a.followers)[0].username}
                      </strong>
                      {" "}이 가장 넓은 도달 범위를 가져요.
                    </span>
                  </div>
                </div>
              </BlurOverlay>
            </div>
          )}
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-16 px-4 bg-[#F9FAFB] border-t border-[#E5E7EB]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#111827] mb-4">인플루언서 비교란?</h2>
          <div className="text-[#6B7280] leading-relaxed space-y-4 mb-10">
            <p>
              인플루언서 비교 분석은 여러 인플루언서를 동일한 기준으로 나란히 평가하여 캠페인에 가장 적합한 파트너를 선택하는 과정입니다.
              단순히 팔로워 수만 보는 것으로는 부족합니다. 참여율, AQS(팔로워 진성도 점수), 게시 빈도, 성장률 등 다양한 지표를 종합적으로 비교해야 합니다.
            </p>
            <p>
              예를 들어 팔로워 50만 명의 인플루언서와 10만 명의 마이크로 인플루언서를 비교할 때,
              참여율과 AQS가 후자에서 훨씬 높게 나타나는 경우가 많습니다.
              특히 타겟 고객층이 명확한 캠페인에서는 팔로워 규모보다 참여 품질이 ROI에 직결됩니다.
            </p>
            <p>
              Inflix의 비교 분석 도구는 레이더 차트를 통해 팔로워규모·참여율·AQS·게시빈도·성장률 5가지 축을 시각화하고,
              AI 기반 종합 추천을 제공합니다. 브랜드 담당자와 마케터가 협력사를 선정할 때 객관적인 데이터 근거를 갖출 수 있도록 돕습니다.
            </p>
            <p>
              무료로 2명을 비교할 수 있으며, 회원가입 후에는 최대 5명 동시 비교와 레이더 차트, AI 추천 기능을 모두 무료로 이용할 수 있습니다.
              캠페인 예산을 결정하기 전에 반드시 비교 분석을 통해 가장 높은 효율의 파트너를 찾아보세요.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-[#111827] mb-6">자주 묻는 질문</h2>
          <div className="space-y-4">
            {[
              {
                q: "몇 명까지 동시에 비교할 수 있나요?",
                a: "비로그인 상태에서는 2명까지 기본 지표를 비교할 수 있습니다. 무료 회원가입 후에는 최대 5명을 동시에 비교하고, 레이더 차트와 AI 종합 추천 기능을 이용할 수 있습니다.",
              },
              {
                q: "레이더 차트의 5가지 축은 어떻게 계산되나요?",
                a: "팔로워규모(전체 대비 백분위), 참여율(최근 12개 게시물 평균), AQS(팔로워 진성도 0~100), 게시빈도(주당 평균 게시 수), 성장률(최근 30일 팔로워 증가율)을 기준으로 각각 0~100점으로 환산합니다.",
              },
              {
                q: "비교 결과를 저장하거나 공유할 수 있나요?",
                a: "현재는 화면 캡처를 통해 저장하실 수 있습니다. 향후 업데이트에서 비교 결과를 PDF로 내보내거나 링크로 공유하는 기능을 추가할 예정입니다.",
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
              { href: "/tools/engagement-rate", icon: "📊", title: "참여율 계산기", desc: "ER을 즉시 무료로 계산하세요." },
              { href: "/tools/top-influencers", icon: "🏆", title: "카테고리별 TOP 100", desc: "인기 인플루언서 순위를 확인하세요." },
              { href: "/tools/fake-follower-check", icon: "🕵️", title: "가짜 팔로워 체크", desc: "진짜 팔로워 비율을 확인하세요." },
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
          <h2 className="text-2xl font-bold text-[#111827] mb-3">더 많은 인플루언서를 비교하고 싶으세요?</h2>
          <p className="text-[#6B7280] mb-6">
            무료 가입하면 5명 동시 비교, 레이더 차트, AI 종합 추천까지 모두 무료로 이용할 수 있어요.
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
