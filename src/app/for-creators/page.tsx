"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import InfluencerValueReport from "@/components/InfluencerValueReport";

const revenueCards = [
  {
    icon: "🤝",
    title: "브랜드 캠페인 매칭",
    description: "Inflix가 연결하는 브랜드 캠페인에 참여하고 수익을 창출하세요.",
    tiers: [
      { label: "나노 (1K~10K)", price: "₩50,000~₩300,000 / 게시물" },
      { label: "마이크로 (10K~100K)", price: "₩300,000~₩1,500,000 / 게시물" },
      { label: "매크로 (100K+)", price: "₩1,500,000+ / 게시물" },
    ],
  },
  {
    icon: "🤖",
    title: "AI 분신 수동 소득",
    description: "내 스타일을 학습한 AI 분신이 24시간 팬과 대화하며 수익을 자동 생성합니다.",
    tiers: [
      { label: "메시지당 수익", price: "₩800 / 사용" },
      { label: "월 예상 수익", price: "₩100,000 ~ ₩400,000" },
      { label: "수면 중에도", price: "자동 수익 발생" },
    ],
  },
  {
    icon: "📋",
    title: "미디어킷으로 단가 올리기",
    description: "자동 생성된 프로 미디어킷으로 브랜드 협상에서 더 높은 단가를 받아내세요.",
    tiers: [
      { label: "단가 상승 효과", price: "평균 +23%" },
      { label: "미디어킷 생성", price: "30초 자동 생성" },
      { label: "PDF 다운로드", price: "무제한 무료" },
    ],
  },
];

const steps = [
  {
    number: "①",
    title: "무료 가입",
    description: "이메일 또는 소셜 계정으로 30초 안에 가입하세요. 신용카드가 필요 없습니다.",
  },
  {
    number: "②",
    title: "Instagram 연동",
    description: "Instagram 계정을 연동하면 팔로워·참여율·콘텐츠 데이터가 자동으로 수집됩니다.",
  },
  {
    number: "③",
    title: "미디어킷 + AI 분신 자동 생성",
    description: "연동 즉시 프로 미디어킷과 AI 분신이 자동 생성됩니다. 바로 브랜드에 제안하세요.",
  },
];

const testimonials = [
  {
    name: "김지수",
    handle: "@jisu.daily",
    followers: "팔로워 28K",
    rating: 5,
    review:
      "미디어킷을 직접 만들 때는 매번 2~3시간이 걸렸는데, Inflix 연동 후 30초 만에 완성됐어요. 브랜드 답장률도 눈에 띄게 올라갔습니다.",
  },
  {
    name: "이현우",
    handle: "@hyunwoo.fit",
    followers: "팔로워 52K",
    rating: 5,
    review:
      "AI 분신 기능을 켜놨더니 자는 동안에도 팬 DM에 응답이 가고 월 20만 원 이상 추가 수익이 생겼어요. 신기하면서도 너무 편해요.",
  },
  {
    name: "박소연",
    handle: "@soyeon.eats",
    followers: "팔로워 11K",
    rating: 5,
    review:
      "내 등급이 A라는 걸 처음 알았어요. 예상 단가 확인하고 브랜드랑 협상했더니 기존보다 30% 높은 금액에 계약할 수 있었습니다!",
  },
];

export default function ForCreatorsPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />

      {/* Hero */}
      <section className="bg-white pt-28 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div
            className="inline-block text-sm font-semibold px-4 py-2 rounded-full mb-5 border"
            style={{ backgroundColor: "rgba(233,69,96,0.08)", color: "#e94560", borderColor: "rgba(233,69,96,0.2)" }}
          >
            크리에이터 솔루션
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#111827] mb-4 leading-tight">
            내 인플루언서 등급
          </h1>
          <p className="text-[#6B7280] text-base md:text-lg mb-10 max-w-xl mx-auto">
            내 AQS·IGR 등급과 브랜드 협업 예상 단가를 무료로 확인하세요
          </p>
          <InfluencerValueReport mode="creator" />
        </div>
      </section>

      {/* Revenue section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-3">
              인플릭스에서 이렇게 벌어요
            </h2>
            <p className="text-[#6B7280]">3가지 방법으로 크리에이터 수익을 극대화하세요</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {revenueCards.map((card) => (
              <div
                key={card.title}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col gap-4 hover:border-[#e94560]/40 transition-colors"
              >
                <div className="text-4xl">{card.icon}</div>
                <h3 className="text-lg font-bold text-[#111827]">{card.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{card.description}</p>
                <div className="mt-auto space-y-2 pt-4 border-t border-[#F3F4F6]">
                  {card.tiers.map((tier) => (
                    <div key={tier.label} className="flex justify-between items-center">
                      <span className="text-xs text-[#9CA3AF]">{tier.label}</span>
                      <span className="text-xs font-semibold" style={{ color: "#e94560" }}>
                        {tier.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Steps */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-3">3단계로 시작하세요</h2>
            <p className="text-[#6B7280]">가입부터 수익 창출까지 5분이면 충분합니다</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <div key={step.number} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full border-t-2 border-dashed border-[#E5E7EB]" />
                )}
                <div
                  className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-4"
                  style={{ backgroundColor: "rgba(233,69,96,0.1)", color: "#e94560" }}
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

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-3">크리에이터 후기</h2>
            <p className="text-[#6B7280]">이미 수백 명의 크리에이터가 Inflix로 수익을 높이고 있어요</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.handle}
                className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col gap-4"
              >
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} style={{ color: "#e94560" }}>★</span>
                  ))}
                </div>
                <p className="text-sm text-[#374151] leading-relaxed flex-1">&ldquo;{t.review}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">{t.name}</p>
                  <p className="text-xs text-[#9CA3AF]">
                    {t.handle} · {t.followers}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-4 text-center bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-4">
            지금 시작하기
          </h2>
          <p className="text-[#6B7280] mb-8">
            무료로 가입하고 내 등급·미디어킷·AI 분신을 바로 확인하세요.
            <br />
            신용카드 없이 즉시 시작 가능합니다.
          </p>
          <Link
            href="/signup?role=creator"
            className="inline-block text-white font-semibold px-10 py-4 rounded-xl text-lg hover:opacity-90 transition-opacity w-full sm:w-auto text-center cursor-pointer min-h-[48px]"
            style={{ backgroundColor: "#e94560" }}
          >
            지금 시작하기
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
