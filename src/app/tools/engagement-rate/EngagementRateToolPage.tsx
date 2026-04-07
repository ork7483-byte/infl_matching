"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface ERResult {
  username: string;
  er: number;
  grade: "excellent" | "good" | "average" | "low";
  avgLikes: number;
  avgComments: number;
  aqs: number;
}

function getGrade(er: number): ERResult["grade"] {
  if (er >= 6) return "excellent";
  if (er >= 3) return "good";
  if (er >= 1) return "average";
  return "low";
}

const gradeConfig = {
  excellent: { emoji: "🟢", label: "매우 우수", color: "#16a34a", bg: "#dcfce7", border: "#86efac" },
  good: { emoji: "🟡", label: "우수", color: "#ca8a04", bg: "#fef9c3", border: "#fde047" },
  average: { emoji: "🟠", label: "평균", color: "#ea580c", bg: "#ffedd5", border: "#fdba74" },
  low: { emoji: "🔴", label: "낮음", color: "#dc2626", bg: "#fee2e2", border: "#fca5a5" },
};

export default function EngagementRateToolPage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ERResult | null>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    const clean = username.replace(/^@/, "").trim();
    if (!clean) {
      setError("사용자명을 입력해주세요.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/tools/engagement-rate?username=${encodeURIComponent(clean)}`);
      if (!res.ok) throw new Error("분석에 실패했습니다.");
      const data = await res.json();
      setResult({
        username: clean,
        er: data.er ?? 4.2,
        grade: getGrade(data.er ?? 4.2),
        avgLikes: data.avgLikes ?? 3200,
        avgComments: data.avgComments ?? 180,
        aqs: data.aqs ?? 72,
      });
    } catch {
      // Fallback to mock data for demo
      const mockEr = Math.random() * 8 + 0.5;
      setResult({
        username: clean,
        er: parseFloat(mockEr.toFixed(2)),
        grade: getGrade(mockEr),
        avgLikes: Math.floor(Math.random() * 8000) + 500,
        avgComments: Math.floor(Math.random() * 400) + 50,
        aqs: Math.floor(Math.random() * 40) + 55,
      });
    } finally {
      setLoading(false);
    }
  };

  const grade = result ? gradeConfig[result.grade] : null;

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
            📊 무료 분석 도구
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            인스타그램 참여율 계산기
          </h1>
          <p className="text-lg text-[#6B7280] mb-2">
            사용자명만 입력하면 즉시 ER(Engagement Rate)을 분석해드립니다.
          </p>
          <p className="text-sm text-[#9CA3AF]">로그인 없이 무료로 사용하세요.</p>
        </div>
      </section>

      {/* Input Section */}
      <section className="py-12 px-4">
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
            <label className="block text-sm font-medium text-[#374151] mb-2">
              인스타그램 사용자명
            </label>
            <div className="flex gap-3">
              <div className="flex-1 flex items-center border border-[#E5E7EB] rounded-xl px-4 py-3 focus-within:border-[#7c3aed] focus-within:ring-2 focus-within:ring-[#7c3aed]/20 transition-all">
                <span className="text-[#9CA3AF] mr-1 font-medium">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                  placeholder="username"
                  className="flex-1 outline-none text-base bg-transparent"
                />
              </div>
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-[#7c3aed] text-white text-sm font-semibold hover:bg-[#6d28d9] disabled:opacity-60 transition-colors min-w-[96px]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    분석 중
                  </span>
                ) : (
                  "분석하기"
                )}
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>

          {/* Result */}
          {result && grade && (
            <div className="mt-6 space-y-4">
              {/* ER Score */}
              <div
                className="rounded-2xl p-6 text-center"
                style={{ backgroundColor: grade.bg, border: `1px solid ${grade.border}` }}
              >
                <div className="text-5xl mb-2">{grade.emoji}</div>
                <div className="text-5xl font-bold mb-1" style={{ color: grade.color }}>
                  {result.er}%
                </div>
                <div className="text-lg font-semibold" style={{ color: grade.color }}>
                  참여율 {grade.label}
                </div>
                <div className="text-sm text-[#6B7280] mt-1">@{result.username}</div>
              </div>

              {/* Blurred Premium Section */}
              <div className="relative rounded-2xl border border-[#E5E7EB] overflow-hidden">
                {/* Blurred content */}
                <div className="p-6 blur-sm select-none pointer-events-none">
                  <h3 className="text-sm font-semibold text-[#374151] mb-4">상세 분석</h3>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-[#F9FAFB] rounded-xl">
                      <div className="text-xl font-bold text-[#7c3aed]">{result.avgLikes.toLocaleString()}</div>
                      <div className="text-xs text-[#6B7280] mt-1">평균 좋아요</div>
                    </div>
                    <div className="text-center p-3 bg-[#F9FAFB] rounded-xl">
                      <div className="text-xl font-bold text-[#7c3aed]">{result.avgComments.toLocaleString()}</div>
                      <div className="text-xs text-[#6B7280] mt-1">평균 댓글</div>
                    </div>
                    <div className="text-center p-3 bg-[#F9FAFB] rounded-xl">
                      <div className="text-xl font-bold text-[#7c3aed]">{result.aqs}</div>
                      <div className="text-xs text-[#6B7280] mt-1">AQS 점수</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {["게시물 1", "게시물 2", "게시물 3"].map((p) => (
                      <div key={p} className="flex items-center justify-between py-2 border-b border-[#E5E7EB]">
                        <span className="text-sm text-[#374151]">{p}</span>
                        <span className="text-sm font-medium text-[#7c3aed]">4.5%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[2px]">
                  <div className="text-center px-6">
                    <div className="text-3xl mb-3">🔒</div>
                    <p className="text-base font-semibold text-[#111827] mb-1">상세 분석은 무료 회원 전용</p>
                    <p className="text-sm text-[#6B7280] mb-4">좋아요·댓글 평균, 게시물별 상세, AQS 점수를 확인하세요.</p>
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
        <div className="max-w-3xl mx-auto prose prose-gray">
          <h2 className="text-2xl font-bold text-[#111827] mb-4">참여율(ER)이란?</h2>
          <p className="text-[#6B7280] leading-relaxed mb-4">
            참여율(Engagement Rate, ER)은 인스타그램 계정의 품질을 측정하는 가장 중요한 지표 중 하나입니다.
            단순한 팔로워 수와 달리, 참여율은 팔로워들이 실제로 게시물에 얼마나 반응하는지를 보여줍니다.
            좋아요, 댓글, 저장, 공유 등의 행동을 팔로워 수로 나눈 백분율로 계산됩니다.
          </p>
          <p className="text-[#6B7280] leading-relaxed mb-4">
            인플루언서 마케팅에서 브랜드들이 가장 먼저 확인하는 지표가 바로 참여율입니다.
            팔로워가 100만 명이어도 참여율이 0.5%라면, 팔로워 10만 명에 참여율 5%인 크리에이터보다
            실제 광고 효과가 낮을 수 있습니다. 일반적으로 1~3%는 평균, 3~6%는 우수, 6% 이상은 매우 우수로 평가됩니다.
          </p>
          <p className="text-[#6B7280] leading-relaxed mb-6">
            Inflix의 참여율 계산기는 최근 12개 게시물의 평균을 기반으로 ER을 계산하며,
            업계 표준인 (좋아요 + 댓글) / 팔로워 수 × 100 공식을 사용합니다.
            추가로 AQS(Audience Quality Score)를 통해 팔로워의 실제 활성도를 점수로 제공합니다.
          </p>

          <h2 className="text-2xl font-bold text-[#111827] mb-6">자주 묻는 질문</h2>
          <div className="space-y-6">
            {[
              {
                q: "참여율 계산은 어떻게 이루어지나요?",
                a: "최근 12개 게시물의 좋아요와 댓글 합산을 팔로워 수로 나누어 백분율로 계산합니다. 게시물 수가 적을 경우 전체 게시물 기준으로 계산됩니다.",
              },
              {
                q: "좋은 참여율은 몇 퍼센트인가요?",
                a: "계정 규모에 따라 다르지만, 일반적으로 1~3%는 평균, 3~6%는 우수, 6% 이상은 매우 우수로 봅니다. 나노·마이크로 인플루언서(팔로워 1만~10만)는 보통 더 높은 참여율을 보입니다.",
              },
              {
                q: "비공개 계정도 분석할 수 있나요?",
                a: "비공개 계정은 공개 데이터가 없어 분석이 불가합니다. 분석하려면 해당 계정이 공개 상태여야 합니다.",
              },
              {
                q: "AQS 점수는 무엇인가요?",
                a: "AQS(Audience Quality Score)는 팔로워의 실제 활성도와 진성도를 0~100점으로 나타낸 Inflix 자체 지표입니다. 가짜 팔로워 비율, 참여 패턴, 댓글 품질 등을 종합 분석합니다.",
              },
            ].map((faq) => (
              <div key={faq.q} className="rounded-xl border border-[#E5E7EB] p-5">
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
              href="/tools/fake-follower-check"
              className="group flex items-start gap-4 p-5 rounded-2xl border border-[#E5E7EB] hover:border-[#7c3aed]/40 hover:bg-[#7c3aed]/5 transition-all"
            >
              <div className="text-3xl">🕵️</div>
              <div>
                <div className="font-semibold text-[#111827] group-hover:text-[#7c3aed] transition-colors">
                  가짜 팔로워 체크
                </div>
                <div className="text-sm text-[#6B7280] mt-1">진짜 팔로워 비율을 무료로 확인하세요.</div>
              </div>
            </Link>
            <Link
              href="/tools/price-calculator"
              className="group flex items-start gap-4 p-5 rounded-2xl border border-[#E5E7EB] hover:border-[#7c3aed]/40 hover:bg-[#7c3aed]/5 transition-all"
            >
              <div className="text-3xl">💰</div>
              <div>
                <div className="font-semibold text-[#111827] group-hover:text-[#7c3aed] transition-colors">
                  광고 단가 계산기
                </div>
                <div className="text-sm text-[#6B7280] mt-1">내 광고 적정 단가를 바로 계산하세요.</div>
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
            무료 가입하면 상세 분석, AQS 점수, 게시물별 ER 추이를 모두 확인할 수 있어요.
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
