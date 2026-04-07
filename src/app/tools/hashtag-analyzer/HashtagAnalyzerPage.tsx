"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LineChartComponent from "@/components/charts/LineChartComponent";

// ─── Mock data generators ─────────────────────────────────────────────────────

function getMockPostCount(tag: string): number {
  // Deterministic mock based on string length
  const seed = tag.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const bases = [450000, 1200000, 2800000, 320000, 85000, 12000, 5500000, 180000];
  return bases[seed % bases.length];
}

function getMockTrend(postCount: number): { date: string; value: number }[] {
  const today = new Date();
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const noise = 1 + (Math.sin(i * 1.3 + postCount) * 0.08);
    return {
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      value: Math.round((postCount / 100) * noise),
    };
  });
}

function getMockRelatedTags(tag: string): string[] {
  const clean = tag.replace(/^#/, "");
  const suffixes = ["스타그램", "데일리", "추천", "일상", "하울", "룩", "스타일", "뷰티", "팁", "OOTD",
    "인스타", "셀스타그램", "팔로우", "좋아요", "소통", "홈", "셀피", "데일리룩", "감성", "취향"];
  // Generate 20 related tags from the base tag
  return Array.from({ length: 20 }, (_, i) => `#${clean}${suffixes[i % suffixes.length]}`);
}

const MOCK_TOP_POSTS = Array.from({ length: 9 }, (_, i) => ({
  id: i,
  placeholder: `https://picsum.photos/seed/${i + 10}/200/200`,
  likes: Math.round((8000 - i * 600) + Math.random() * 500),
}));

function getDifficulty(postCount: number): { label: string; color: string; bg: string } {
  if (postCount > 1_000_000) return { label: "상", color: "#dc2626", bg: "#fee2e2" };
  if (postCount > 100_000) return { label: "중", color: "#d97706", bg: "#fef3c7" };
  return { label: "하", color: "#16a34a", bg: "#dcfce7" };
}

function fmtNum(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${Math.round(n / 10_000)}만`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function HashtagAnalyzerPage() {
  const { data: session } = useSession();
  const isAuthed = !!session;

  const [input, setInput] = useState("");
  const [analyzed, setAnalyzed] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleAnalyze() {
    const raw = input.trim();
    if (!raw) return;
    const tag = raw.startsWith("#") ? raw : `#${raw}`;
    setLoading(true);
    setTimeout(() => {
      setAnalyzed(tag);
      setLoading(false);
    }, 900);
  }

  const postCount = analyzed ? getMockPostCount(analyzed) : 0;
  const trend = analyzed ? getMockTrend(postCount) : [];
  const relatedTags = analyzed ? getMockRelatedTags(analyzed) : [];
  const difficulty = analyzed ? getDifficulty(postCount) : null;
  const visibleRelated = isAuthed ? relatedTags : relatedTags.slice(0, 5);

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
            #️⃣ 무료 해시태그 분석기
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            인스타그램<br className="hidden sm:block" /> 해시태그 분석기
          </h1>
          <p className="text-lg text-[#6B7280] mb-2">
            해시태그의 경쟁 난이도, 게시물 추이, 관련 태그를 즉시 분석하세요.
          </p>
          <p className="text-sm text-[#9CA3AF]">완전 무료 — 로그인 없이 사용하세요.</p>
        </div>
      </section>

      {/* Search */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Input */}
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
            <h2 className="text-base font-semibold text-[#111827] mb-4">해시태그 입력</h2>
            <div className="flex gap-3">
              <div className="flex-1 flex items-center border border-[#E5E7EB] rounded-xl px-4 py-3.5 focus-within:border-[#7c3aed] focus-within:ring-2 focus-within:ring-[#7c3aed]/20 transition-all">
                <span className="text-[#9CA3AF] mr-1 text-base font-bold">#</span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                  className="flex-1 outline-none text-sm bg-transparent"
                  placeholder="뷰티, 패션, 음식..."
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
          {analyzed && !loading && (
            <>
              {/* Summary row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="text-xs text-[#6B7280] mb-1">총 게시물 수</div>
                  <div className="text-2xl font-bold text-[#111827]">{postCount.toLocaleString()}개</div>
                  <div className="text-xs text-[#9CA3AF] mt-1">({fmtNum(postCount)} posts)</div>
                </div>
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="text-xs text-[#6B7280] mb-1">경쟁 난이도</div>
                  {difficulty && (
                    <div
                      className="inline-flex items-center px-3 py-1 rounded-full text-base font-bold mt-1"
                      style={{ backgroundColor: difficulty.bg, color: difficulty.color }}
                    >
                      {difficulty.label}
                    </div>
                  )}
                  <div className="text-xs text-[#9CA3AF] mt-2">
                    {postCount > 1_000_000 ? "경쟁 매우 높음" : postCount > 100_000 ? "적당한 경쟁" : "경쟁 낮음 — 노출 유리"}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
                  <div className="text-xs text-[#6B7280] mb-1">분석 해시태그</div>
                  <div className="text-xl font-bold text-[#7c3aed] mt-1">{analyzed}</div>
                  <div className="text-xs text-[#9CA3AF] mt-1">Instagram</div>
                </div>
              </div>

              {/* Trend chart — auth gated */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-[#374151] mb-1">7일 게시물 추이</h3>
                <p className="text-xs text-[#9CA3AF] mb-4">일별 신규 게시물 수 (추정)</p>
                {isAuthed ? (
                  <LineChartComponent data={trend} showArea color="#7c3aed" />
                ) : (
                  <div className="relative">
                    <div style={{ filter: "blur(5px)", pointerEvents: "none", userSelect: "none" }}>
                      <LineChartComponent data={trend} showArea color="#7c3aed" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/90 border border-[#E5E7EB] rounded-2xl px-6 py-5 text-center shadow-lg max-w-xs">
                        <p className="text-sm font-semibold text-[#111827] mb-1">7일 추이 차트</p>
                        <p className="text-xs text-[#6B7280] mb-3">로그인하면 무료로 확인할 수 있어요</p>
                        <Link href="/signup" className="inline-flex items-center justify-center px-5 py-2.5 bg-[#7c3aed] text-white text-sm font-semibold rounded-lg hover:bg-[#6d28d9] transition-colors">
                          무료 가입하기
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Related tags */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-[#374151]">관련 해시태그</h3>
                    <p className="text-xs text-[#9CA3AF]">함께 사용하면 도달 확장에 도움이 돼요</p>
                  </div>
                  {!isAuthed && (
                    <span className="text-xs text-[#6B7280] bg-[#F9FAFB] px-3 py-1 rounded-full border border-[#E5E7EB]">
                      5 / 20개 표시
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {visibleRelated.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => { setInput(tag); }}
                      className="px-3 py-1.5 rounded-full text-sm border border-[#E5E7EB] text-[#374151] hover:border-[#7c3aed] hover:text-[#7c3aed] hover:bg-[#7c3aed]/5 transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                  {!isAuthed && (
                    <Link
                      href="/signup"
                      className="px-3 py-1.5 rounded-full text-sm border border-dashed border-[#7c3aed] text-[#7c3aed] hover:bg-[#7c3aed]/5 transition-all"
                    >
                      +15개 더 보기 →
                    </Link>
                  )}
                </div>
              </div>

              {/* Top posts grid */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-[#374151] mb-1">인기 게시물 TOP 9</h3>
                <p className="text-xs text-[#9CA3AF] mb-4">좋아요 순 상위 게시물 (예시)</p>
                {isAuthed ? (
                  <div className="grid grid-cols-3 gap-2">
                    {MOCK_TOP_POSTS.map((post) => (
                      <div key={post.id} className="relative aspect-square rounded-xl overflow-hidden bg-[#F9FAFB] border border-[#E5E7EB]">
                        <img
                          src={post.placeholder}
                          alt={`Top post ${post.id + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                          <span className="text-white text-xs font-medium">
                            ♥ {post.likes.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="relative">
                    <div style={{ filter: "blur(8px)", pointerEvents: "none", userSelect: "none" }}>
                      <div className="grid grid-cols-3 gap-2">
                        {MOCK_TOP_POSTS.map((post) => (
                          <div key={post.id} className="relative aspect-square rounded-xl overflow-hidden bg-[#F9FAFB] border border-[#E5E7EB]">
                            <img src={post.placeholder} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/90 border border-[#E5E7EB] rounded-2xl px-6 py-5 text-center shadow-lg max-w-xs">
                        <p className="text-sm font-semibold text-[#111827] mb-1">인기 게시물 TOP 9</p>
                        <p className="text-xs text-[#6B7280] mb-3">무료 가입 후 전체 확인 가능</p>
                        <Link href="/signup" className="inline-flex items-center justify-center px-5 py-2.5 bg-[#7c3aed] text-white text-sm font-semibold rounded-lg hover:bg-[#6d28d9] transition-colors">
                          무료 가입하기
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* CTA */}
          <div
            className="rounded-2xl p-8 text-center"
            style={{ background: "linear-gradient(135deg, #7c3aed15, #e9456015)" }}
          >
            <h3 className="text-lg font-bold text-[#111827] mb-2">해시태그 전략으로 도달 3배 늘리기</h3>
            <p className="text-sm text-[#6B7280] mb-4">
              Inflix의 해시태그 추천 기능으로 최적 태그 조합을 자동으로 제안받으세요.
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
          <h2 className="text-2xl font-bold text-[#111827] mb-4">해시태그 전략이 중요한 이유</h2>
          <p className="text-[#6B7280] leading-relaxed mb-4">
            인스타그램 해시태그는 콘텐츠 발견(Discovery)의 핵심 수단입니다. 적절한 해시태그를 사용하면
            팔로워가 아닌 잠재 고객에게도 콘텐츠가 노출되어 유기적 도달을 크게 늘릴 수 있습니다.
          </p>
          <p className="text-[#6B7280] leading-relaxed mb-8">
            경쟁 난이도 분석을 통해 게시물 수가 너무 많은 포화 태그는 피하고, 적당한 경쟁의 틈새 태그를
            발굴하는 것이 효과적인 전략입니다. 일반적으로 게시물 수 10만~100만 사이의 태그가 노출 대비
            경쟁 밸런스가 좋습니다.
          </p>

          <h2 className="text-2xl font-bold text-[#111827] mb-6">자주 묻는 질문</h2>
          <div className="space-y-4">
            {[
              {
                q: "해시태그를 몇 개 사용하는 것이 좋나요?",
                a: "인스타그램은 최대 30개까지 허용하지만, 최근 알고리즘 변화로 5~10개의 관련성 높은 태그가 더 효과적이라는 분석이 많습니다. 단순히 많이 쓰는 것보다 타겟 오디언스와 관련된 태그를 선별하는 것이 중요합니다.",
              },
              {
                q: "게시물 수가 적은 해시태그가 유리한가요?",
                a: "반드시 그런 것은 아닙니다. 게시물 수가 너무 적은 태그(1만 미만)는 검색 자체가 적어 노출 기회가 줄어듭니다. 10만~100만 사이의 '중간 경쟁' 태그를 핵심으로 하고, 대형 태그와 소형 태그를 함께 사용하는 혼합 전략이 효과적입니다.",
              },
              {
                q: "해시태그 경쟁 난이도는 어떻게 판단하나요?",
                a: "본 도구는 총 게시물 수를 기준으로 판단합니다. 100만 이상=상(경쟁 높음), 10만~100만=중, 10만 미만=하(경쟁 낮음)로 분류합니다. 실제 난이도는 최근 게시물 품질, 참여율 등도 영향을 줍니다.",
              },
              {
                q: "인플루언서 마케팅에서 해시태그 전략은 어떻게 세우나요?",
                a: "브랜드 전용 해시태그(캠페인 태그), 카테고리 태그(#뷰티 #메이크업), 틈새 태그를 조합해 사용하는 것이 좋습니다. UGC(사용자 생성 콘텐츠) 캠페인의 경우 브랜드 전용 태그를 만들어 참여를 유도하면 효과적입니다.",
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
              { href: "/tools/engagement-rate", icon: "📊", title: "참여율 계산기", desc: "ER을 즉시 계산하고 등급을 확인하세요." },
              { href: "/tools/competitor-analysis", icon: "🔍", title: "경쟁사 분석", desc: "경쟁사 인플루언서 마케팅 전략을 확인하세요." },
              { href: "/tools/instagram-audit", icon: "📋", title: "계정 감사 리포트", desc: "종합 계정 분석 리포트를 받아보세요." },
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
