"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import InfluencerValueReport from "@/components/InfluencerValueReport";

const featureCards = [
  {
    icon: "🔍",
    title: "인플루언서 검색 & 분석",
    description: "AQS·IGR 등급, 가짜 팔로워 탐지, 참여율 분석으로 최적의 인플루언서를 찾으세요.",
    tools: ["프로필 감사", "인플루언서 비교", "참여율 계산기", "가짜 팔로워 탐지", "팔로워 체크"],
  },
  {
    icon: "📊",
    title: "캠페인 관리 & 비용 분석",
    description: "ROI·EMV 계산, 단가 산정, 캠페인 브리프 작성까지 한 곳에서 관리하세요.",
    tools: ["ROI 계산기", "EMV 계산기", "단가 계산기", "캠페인 브리프", "계약서 템플릿"],
  },
  {
    icon: "🎯",
    title: "시장 분석 & 트렌드",
    description: "해시태그 분석, 경쟁사 모니터링, 트렌딩 콘텐츠로 시장을 선점하세요.",
    tools: ["해시태그 분석", "경쟁사 분석", "멘션 추적기", "트렌딩 콘텐츠", "유사 인플루언서"],
  },
];

const steps = [
  {
    number: "①",
    title: "무료 가입 (30초)",
    description: "이메일 또는 소셜 계정으로 30초 안에 가입하세요. 신용카드가 필요 없습니다.",
  },
  {
    number: "②",
    title: "인플루언서 검색 & 분석",
    description: "등급·참여율·단가를 확인하고 캠페인에 적합한 인플루언서를 찾으세요.",
  },
  {
    number: "③",
    title: "캠페인 실행 & 성과 추적",
    description: "매칭 요청부터 성과 리포트까지 Inflix에서 캠페인 전체를 관리하세요.",
  },
];

export default function ForBrandsPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />

      {/* Hero */}
      <section className="bg-white pt-28 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block bg-[#7c3aed]/10 text-[#7c3aed] text-sm font-semibold px-4 py-2 rounded-full mb-5 border border-[#7c3aed]/20">
            브랜드 솔루션
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#111827] mb-4 leading-tight">
            인플루언서 등급
          </h1>
          <p className="text-[#6B7280] text-base md:text-lg mb-10 max-w-xl mx-auto">
            협업 전에 AQS·IGR 기반 등급과 적정 단가를 무료로 확인하세요
          </p>
          <InfluencerValueReport mode="brand" />
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-3">
              브랜드 전용 도구
            </h2>
            <p className="text-[#6B7280]">18개 분석 도구로 데이터 기반 인플루언서 마케팅을 시작하세요</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featureCards.map((card) => (
              <div
                key={card.title}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col gap-4 hover:border-[#7c3aed]/40 transition-colors"
              >
                <div className="text-4xl">{card.icon}</div>
                <h3 className="text-lg font-bold text-[#111827]">{card.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{card.description}</p>
                <div className="mt-auto pt-4 border-t border-[#F3F4F6]">
                  <div className="flex flex-wrap gap-2">
                    {card.tools.map((tool) => (
                      <span
                        key={tool}
                        className="text-xs bg-[#7c3aed]/8 text-[#7c3aed] px-2.5 py-1 rounded-full"
                        style={{ backgroundColor: "rgba(124,58,237,0.08)" }}
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Steps */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-3">3단계로 시작하세요</h2>
            <p className="text-[#6B7280]">가입부터 캠페인 실행까지 5분이면 충분합니다</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.number} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full border-t-2 border-dashed border-[#E5E7EB]" />
                )}
                <div
                  className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-4"
                  style={{ backgroundColor: "rgba(124,58,237,0.1)", color: "#7c3aed" }}
                >
                  {step.number}
                </div>
                <h3 className="text-base font-bold text-[#111827] mb-2">{step.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-4">
              브랜드 전용 공간
            </h2>
            <p className="text-[#6B7280] mb-8 leading-relaxed">
              로그인하면 18개 분석 도구, 캠페인 관리, AI 성과 예측, CRM까지
              <br className="hidden sm:block" />
              인플루언서 마케팅에 필요한 모든 도구를 사용할 수 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard/brand"
                className="inline-flex items-center justify-center bg-[#7c3aed] text-white font-semibold px-8 py-4 rounded-xl text-base hover:opacity-90 transition-opacity min-h-[48px] cursor-pointer"
              >
                브랜드 전용 공간 바로가기 →
              </Link>
              <Link
                href="/signup?role=brand"
                className="inline-flex items-center justify-center border-2 border-[#7c3aed] text-[#7c3aed] font-semibold px-8 py-4 rounded-xl text-base hover:bg-[#7c3aed]/5 transition-colors min-h-[48px] cursor-pointer"
              >
                무료로 가입하기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-4 text-center bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-4">
            지금 바로 데이터 기반 마케팅을 시작하세요
          </h2>
          <p className="text-[#6B7280] mb-8">
            무료 플랜으로 시작해 모든 분석 도구를 활용하세요.
            <br />
            신용카드가 필요 없습니다.
          </p>
          <Link
            href="/signup?role=brand"
            className="inline-block bg-gradient-to-r from-[#7c3aed] to-[#e94560] text-white font-semibold px-10 py-4 rounded-xl text-lg hover:opacity-90 transition-opacity w-full sm:w-auto text-center cursor-pointer min-h-[48px]"
          >
            무료로 시작하기
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
