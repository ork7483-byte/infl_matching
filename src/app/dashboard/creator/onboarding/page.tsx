"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";

const INSTAGRAM_LOADING_STEPS = [
  { label: "프로필 정보 가져오기", delay: 600 },
  { label: "최근 게시물 분석", delay: 1200 },
  { label: "참여율 계산", delay: 1800 },
  { label: "연동 완료!", delay: 2600 },
];

const BENEFITS = [
  "내 인스타그램 통계를 자동 분석",
  "브랜드 캠페인 매칭 자동화",
  "수익·정산 현황 한눈에 확인",
  "AI Muse 자동 생성",
];

const CATEGORIES = ["뷰티", "패션", "푸드", "여행", "피트니스", "육아", "테크", "라이프스타일"];

const AI_CLONE_BENEFITS = [
  { icon: "💰", text: "촬영 없이 자동으로 광고 수익 발생" },
  { icon: "📸", text: "내 스타일 그대로 AI가 콘텐츠 생성" },
  { icon: "🔒", text: "모든 콘텐츠는 승인 후 공개 — 완전 통제 가능" },
];

const MOCK_PHOTOS = Array.from({ length: 12 }, (_, i) => `https://picsum.photos/seed/ig${i + 1}/120/120`);

function AiMuseTooltip() {
  return (
    <span className="relative group inline-flex ml-1 cursor-help">
      <svg className="w-3.5 h-3.5 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#111827] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap">
        나를 닮은 AI 모델이에요. 브랜드가 사용할 때마다 수익이 쌓여요.
      </span>
    </span>
  );
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [completedLoadingSteps, setCompletedLoadingSteps] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const [cloneCreating, setCloneCreating] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Step 1 → 2 transition: animate loading checklist then advance to category step
  useEffect(() => {
    if (step !== 2) return;
    setCompletedLoadingSteps([]);

    const timers: ReturnType<typeof setTimeout>[] = [];

    INSTAGRAM_LOADING_STEPS.forEach((s, idx) => {
      const t = setTimeout(() => {
        setCompletedLoadingSteps((prev) => [...prev, idx]);
      }, s.delay);
      timers.push(t);
    });

    // After loading finishes, move to category selection (step 3 in the old numbering = new step 2 UI)
    // We keep internal step numbers aligned: 1=Instagram, 2=loading, 3=category, 4=AI Muse, 5=share
    // But to keep it simple: loading is an intermediate within the Instagram connect flow.
    // On complete, advance to step 3 (category selection).
    const advance = setTimeout(() => {
      setStep(3);
    }, 3200);
    timers.push(advance);

    return () => timers.forEach(clearTimeout);
  }, [step]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(cat)) return prev.filter((c) => c !== cat);
      if (prev.length >= 3) return prev; // max 3
      return [...prev, cat];
    });
  };

  const handleCreateClone = async () => {
    setCloneCreating(true);
    await new Promise((r) => setTimeout(r, 1500));
    setCloneCreating(false);
    setStep(5);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://inflix.io/creator/kim_influencer").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Visual step indicator: maps internal step -> display step (1-4)
  // internal 1=Instagram connect, 2=loading (still display 1), 3=category, 4=AI Muse, 5=share
  const displayStep = step === 2 ? 1 : step === 3 ? 2 : step === 4 ? 3 : step === 5 ? 4 : 1;

  return (
    <DashboardLayout role="creator">
      <div className="max-w-lg mx-auto py-8">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  s < displayStep
                    ? "bg-[#7c3aed] text-white"
                    : s === displayStep
                    ? "bg-[#7c3aed] text-white ring-4 ring-[#7c3aed]/20"
                    : "bg-[#E5E7EB] text-[#9CA3AF]"
                }`}
              >
                {s < displayStep ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  s
                )}
              </div>
              {s < 4 && (
                <div
                  className={`w-10 h-0.5 rounded-full transition-all duration-500 ${
                    s < displayStep ? "bg-[#7c3aed]" : "bg-[#E5E7EB]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Instagram Connect */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 text-center shadow-sm">
            <div className="text-5xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold text-[#111827] mb-2">환영해요!</h1>
            <p className="text-[#6B7280] mb-6">Instagram을 연동하고 시작하세요</p>

            <div className="text-left bg-[#F9FAFB] rounded-xl p-4 mb-6 space-y-3">
              {BENEFITS.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#7c3aed]/15 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-[#7c3aed]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-[#374151]">{benefit}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-4 rounded-xl bg-[#7c3aed] text-white font-semibold text-base hover:bg-[#6d28d9] transition-colors flex items-center justify-center gap-3 mb-3"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Instagram 연동하기
            </button>

            <Link
              href="/dashboard/creator"
              className="block text-sm text-[#9CA3AF] hover:text-[#6B7280] transition-colors py-2"
            >
              나중에 할게요
            </Link>

            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-[#9CA3AF]">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              읽기 전용으로만 분석합니다
            </div>
          </div>
        )}

        {/* Step 1 → loading transition (internal step 2) */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 text-center shadow-sm">
            <div className="text-4xl mb-4">✅</div>
            <h1 className="text-xl font-bold text-[#111827] mb-2">Instagram 연동 완료!</h1>
            <p className="text-[#6B7280] mb-8">계정 정보를 분석하고 있어요...</p>

            <div className="text-left space-y-4">
              {INSTAGRAM_LOADING_STEPS.map((s, idx) => {
                const done = completedLoadingSteps.includes(idx);
                const isLast = idx === INSTAGRAM_LOADING_STEPS.length - 1;
                const active = !done && completedLoadingSteps.length === idx;

                return (
                  <div
                    key={s.label}
                    className={`flex items-center gap-3 transition-all duration-500 ${
                      done ? "opacity-100" : active ? "opacity-100" : "opacity-40"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      done
                        ? "bg-[#7c3aed] text-white"
                        : active
                        ? "bg-[#7c3aed]/20"
                        : "bg-[#E5E7EB]"
                    }`}>
                      {done ? (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : active ? (
                        <svg className="w-3.5 h-3.5 text-[#7c3aed] animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : null}
                    </div>
                    <span className={`text-sm font-medium ${
                      done ? "text-[#111827]" : active ? "text-[#7c3aed]" : "text-[#9CA3AF]"
                    }`}>
                      {s.label}
                      {done && !isLast && " ✅"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: 카테고리 선택 (internal step 3) */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#7c3aed]/10 flex items-center justify-center mx-auto mb-4 text-3xl">
                🏷️
              </div>
              <h1 className="text-2xl font-bold text-[#111827] mb-2">내 카테고리를 선택해주세요</h1>
              <p className="text-[#6B7280] text-sm leading-relaxed">
                브랜드가 카테고리로 검색해요. 최대 3개까지 선택할 수 있어요.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 border ${
                      isSelected
                        ? "bg-[#7c3aed] text-white border-[#7c3aed]"
                        : "bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#7c3aed]/40"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <p className="text-center text-sm text-[#9CA3AF] mb-6">
              {selectedCategories.length}/3개 선택됨
            </p>

            <button
              onClick={() => setStep(4)}
              disabled={selectedCategories.length === 0}
              className="w-full py-4 rounded-xl bg-[#7c3aed] text-white font-semibold text-base hover:bg-[#6d28d9] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        )}

        {/* Step 3: AI Muse 등록 (internal step 4) */}
        {step === 4 && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 shadow-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-[#7c3aed]/10 flex items-center justify-center mx-auto mb-4 text-3xl">
                🤖
              </div>
              <h1 className="text-2xl font-bold text-[#111827] mb-2 flex items-center justify-center">
                AI Muse 생성
                <AiMuseTooltip />
              </h1>
              <p className="text-[#6B7280] leading-relaxed text-sm">
                내 사진을 학습한 AI 모델이 자동으로 광고를 촬영해요.
                <br />
                수익의 60%가 나에게 돌아와요.
              </p>
            </div>

            <div className="space-y-2 mb-5">
              {AI_CLONE_BENEFITS.map((b) => (
                <div key={b.text} className="flex items-center gap-3 bg-[#F9FAFB] rounded-xl px-4 py-3">
                  <span className="text-xl flex-shrink-0">{b.icon}</span>
                  <span className="text-sm text-[#374151]">{b.text}</span>
                </div>
              ))}
            </div>

            {/* Auto-selected photos preview */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-2">AI가 선택한 최적 사진 12장</p>
              <div className="grid grid-cols-6 gap-1.5">
                {MOCK_PHOTOS.map((src, i) => (
                  <div key={i} className="aspect-square rounded-lg overflow-hidden bg-[#E5E7EB]">
                    <img
                      src={src}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://picsum.photos/seed/p${i}/120/120`;
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCreateClone}
                disabled={cloneCreating}
                className="w-full py-4 rounded-xl bg-[#7c3aed] text-white font-semibold text-base hover:bg-[#6d28d9] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {cloneCreating ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    AI Muse 만들기 중...
                  </>
                ) : (
                  "AI Muse 만들기"
                )}
              </button>
              <button
                onClick={() => setStep(5)}
                className="block w-full text-center text-sm text-[#9CA3AF] hover:text-[#6B7280] transition-colors py-2"
              >
                나중에 할게요
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Done — Share (internal step 5) */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 text-center shadow-sm">
              <div className="text-5xl mb-4">🎉</div>
              <h1 className="text-2xl font-bold text-[#111827] mb-2">설정 완료!</h1>
              <p className="text-[#6B7280] mb-6">이제 브랜드와 매칭을 시작할 수 있어요.</p>

              {/* Mock preview card */}
              <div className="bg-gradient-to-br from-[#7c3aed]/5 to-[#7c3aed]/10 rounded-xl border border-[#7c3aed]/20 p-5 mb-6 text-left">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center text-white font-bold text-lg">
                    K
                  </div>
                  <div>
                    <div className="font-semibold text-[#111827]">@kim_influencer</div>
                    <div className="text-xs text-[#6B7280]">
                      {selectedCategories.length > 0
                        ? selectedCategories.join(" · ")
                        : "라이프스타일 · 뷰티 · 여행"}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "팔로워", value: "124.5K" },
                    { label: "참여율", value: "4.8%" },
                    { label: "평균 도달", value: "42.3K" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center bg-white rounded-lg p-2">
                      <div className="text-sm font-bold text-[#7c3aed]">{stat.value}</div>
                      <div className="text-xs text-[#9CA3AF]">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleCopyLink}
                  className="w-full py-3 rounded-xl border border-[#E5E7EB] text-[#374151] font-medium hover:bg-[#F9FAFB] transition-colors flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-green-600">복사됨!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      공유 링크 복사
                    </>
                  )}
                </button>

                <button
                  onClick={() => alert("Instagram Story 공유 기능은 준비 중입니다.")}
                  className="w-full py-3 rounded-xl border border-[#7c3aed]/30 bg-[#7c3aed]/5 text-[#7c3aed] font-medium hover:bg-[#7c3aed]/10 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <span>✨</span>
                  Instagram 스토리에 공유하기
                  <span>✨</span>
                </button>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/dashboard/creator"
                className="text-sm text-[#6B7280] hover:text-[#7c3aed] transition-colors"
              >
                대시보드로 이동 →
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
