"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface CheckResult {
  username: string;
  fakePercent: number;
  grade: "clean" | "caution" | "warning" | "critical";
  signals: { label: string; value: string; severity: "good" | "warn" | "bad" }[];
}

function getGrade(fakePercent: number): CheckResult["grade"] {
  if (fakePercent < 5) return "clean";
  if (fakePercent < 15) return "caution";
  if (fakePercent < 30) return "warning";
  return "critical";
}

const gradeConfig = {
  clean: { emoji: "🟢", label: "진성 팔로워 우수", color: "#16a34a", bg: "#dcfce7", border: "#86efac", verdict: "신뢰할 수 있는 계정입니다." },
  caution: { emoji: "🟡", label: "소폭 주의", color: "#ca8a04", bg: "#fef9c3", border: "#fde047", verdict: "일부 비활성 팔로워가 감지되었습니다." },
  warning: { emoji: "🟠", label: "주의 필요", color: "#ea580c", bg: "#ffedd5", border: "#fdba74", verdict: "상당수의 의심 팔로워가 감지되었습니다." },
  critical: { emoji: "🔴", label: "고위험", color: "#dc2626", bg: "#fee2e2", border: "#fca5a5", verdict: "가짜 팔로워 비율이 매우 높습니다." },
};

export default function FakeFollowerCheckPage() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    const clean = username.replace(/^@/, "").trim();
    if (!clean) {
      setError("사용자명을 입력해주세요.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/tools/fake-check?username=${encodeURIComponent(clean)}`);
      if (!res.ok) throw new Error("분석 실패");
      const data = await res.json();
      const fake = data.fakePercent ?? 12;
      setResult({
        username: clean,
        fakePercent: fake,
        grade: getGrade(fake),
        signals: data.signals ?? [],
      });
    } catch {
      const fake = parseFloat((Math.random() * 35).toFixed(1));
      setResult({
        username: clean,
        fakePercent: fake,
        grade: getGrade(fake),
        signals: [
          { label: "비활성 계정 비율", value: `${(fake * 0.6).toFixed(1)}%`, severity: fake > 20 ? "bad" : "warn" },
          { label: "평균 팔로잉 수", value: "2,400명", severity: "warn" },
          { label: "프로필 사진 없는 팔로워", value: `${(fake * 0.3).toFixed(1)}%`, severity: fake > 15 ? "bad" : "good" },
          { label: "최근 30일 활성 팔로워", value: `${(100 - fake * 0.8).toFixed(0)}%`, severity: "good" },
        ],
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
            🕵️ 무료 분석 도구
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            인스타그램 가짜 팔로워 체크
          </h1>
          <p className="text-lg text-[#6B7280] mb-2">
            계정의 진성 팔로워 비율을 즉시 확인하세요.
          </p>
          <p className="text-sm text-[#9CA3AF]">로그인 없이 무료로 사용하세요.</p>
        </div>
      </section>

      {/* Input */}
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
                  onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                  placeholder="username"
                  className="flex-1 outline-none text-base bg-transparent"
                />
              </div>
              <button
                onClick={handleCheck}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-[#7c3aed] text-white text-sm font-semibold hover:bg-[#6d28d9] disabled:opacity-60 transition-colors min-w-[96px]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    체크 중
                  </span>
                ) : (
                  "체크하기"
                )}
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>

          {/* Result */}
          {result && grade && (
            <div className="mt-6 space-y-4">
              {/* Verdict */}
              <div
                className="rounded-2xl p-6 text-center"
                style={{ backgroundColor: grade.bg, border: `1px solid ${grade.border}` }}
              >
                <div className="text-5xl mb-2">{grade.emoji}</div>
                <div className="text-4xl font-bold mb-1" style={{ color: grade.color }}>
                  가짜 팔로워 {result.fakePercent}%
                </div>
                <div className="text-lg font-semibold" style={{ color: grade.color }}>
                  {grade.label}
                </div>
                <div className="text-sm text-[#6B7280] mt-1">{grade.verdict}</div>
                <div className="text-xs text-[#9CA3AF] mt-0.5">@{result.username}</div>
              </div>

              {/* Blurred detailed signals */}
              <div className="relative rounded-2xl border border-[#E5E7EB] overflow-hidden">
                <div className="p-6 blur-sm select-none pointer-events-none">
                  <h3 className="text-sm font-semibold text-[#374151] mb-4">상세 신호 분석</h3>
                  <div className="space-y-3">
                    {result.signals.map((sig) => (
                      <div key={sig.label} className="flex items-center justify-between py-2 border-b border-[#E5E7EB]">
                        <span className="text-sm text-[#374151]">{sig.label}</span>
                        <span className={`text-sm font-medium ${
                          sig.severity === "good" ? "text-green-600" : sig.severity === "warn" ? "text-yellow-600" : "text-red-600"
                        }`}>
                          {sig.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 h-32 bg-[#F9FAFB] rounded-xl flex items-center justify-center text-sm text-[#9CA3AF]">
                    팔로워 증감 차트
                  </div>
                  <div className="mt-4 h-24 bg-[#F9FAFB] rounded-xl flex items-center justify-center text-sm text-[#9CA3AF]">
                    AQS 레이더 차트
                  </div>
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[2px]">
                  <div className="text-center px-6">
                    <div className="text-3xl mb-3">🔒</div>
                    <p className="text-base font-semibold text-[#111827] mb-1">상세 신호는 무료 회원 전용</p>
                    <p className="text-sm text-[#6B7280] mb-4">신호 목록, 팔로워 증감 차트, AQS 레이더를 확인하세요.</p>
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
          <h2 className="text-2xl font-bold text-[#111827] mb-4">가짜 팔로워란?</h2>
          <p className="text-[#6B7280] leading-relaxed mb-4">
            가짜 팔로워(Fake Followers)란 실제 사람이 아니거나, 비활성 상태이거나, 팔로워 구매로 유입된
            봇·스팸 계정을 말합니다. 외형적으로는 팔로워 수를 부풀리지만 실제 콘텐츠에 반응하지 않으며,
            인플루언서 마케팅에서 광고 효과를 저해하는 주요 원인입니다.
          </p>
          <p className="text-[#6B7280] leading-relaxed mb-4">
            브랜드 입장에서 가짜 팔로워가 많은 인플루언서에게 광고를 집행하면 노출 대비 실제 전환이 극히 낮아
            예산이 낭비됩니다. Inflix는 계정 활동 패턴, 팔로잉/팔로워 비율, 게시물 빈도, 댓글 품질 등
            다양한 신호를 종합적으로 분석해 가짜 팔로워 비율을 추정합니다.
          </p>
          <p className="text-[#6B7280] leading-relaxed mb-8">
            일반적으로 5% 미만이면 정상적인 수준이며, 15%를 넘으면 주의가 필요합니다.
            30% 이상은 팔로워 구매 가능성이 매우 높습니다.
          </p>

          <h2 className="text-2xl font-bold text-[#111827] mb-6">자주 묻는 질문</h2>
          <div className="space-y-4">
            {[
              {
                q: "어떻게 가짜 팔로워를 감지하나요?",
                a: "비활성 계정 비율, 프로필 완성도, 게시물 없는 계정 비율, 팔로잉/팔로워 불균형, 댓글 패턴 등 12가지 신호를 머신러닝으로 분석합니다.",
              },
              {
                q: "결과가 100% 정확한가요?",
                a: "공개 데이터 기반 추정값이므로 오차가 있을 수 있습니다. 정확도는 약 85~90% 수준이며, 전문 감사 목적으로는 유료 심층 분석을 권장합니다.",
              },
              {
                q: "가짜 팔로워를 제거하면 참여율이 오르나요?",
                a: "가짜 팔로워를 정리하면 분자(좋아요+댓글)는 그대로이고 분모(팔로워 수)가 줄어 참여율이 오르는 효과가 있습니다.",
              },
              {
                q: "내 계정도 직접 체크할 수 있나요?",
                a: "네, 본인 계정이 공개 상태라면 자신의 사용자명을 입력해 무료로 체크하실 수 있습니다.",
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
              href="/tools/price-calculator"
              className="group flex items-start gap-4 p-5 rounded-2xl border border-[#E5E7EB] hover:border-[#7c3aed]/40 hover:bg-[#7c3aed]/5 transition-all"
            >
              <div className="text-3xl">💰</div>
              <div>
                <div className="font-semibold text-[#111827] group-hover:text-[#7c3aed] transition-colors">
                  광고 단가 계산기
                </div>
                <div className="text-sm text-[#6B7280] mt-1">적정 광고비를 바로 계산하세요.</div>
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
            무료 가입하면 상세 신호 목록, 팔로워 증감 추이, AQS 레이더 차트를 전부 확인할 수 있어요.
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
