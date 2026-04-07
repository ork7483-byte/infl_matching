import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const features = [
  {
    icon: "👁️",
    title: "예상 도달 수",
    description:
      "인플루언서의 최근 180일 게시물 데이터와 팔로워 활성도를 기반으로 캠페인 예상 도달 수를 사전에 예측합니다.",
  },
  {
    icon: "❤️",
    title: "예상 참여율",
    description:
      "유사 캠페인 사례와 콘텐츠 유형, 시즌, 브랜드 카테고리를 고려하여 예상 참여율(좋아요+댓글+저장)을 계산합니다.",
  },
  {
    icon: "💵",
    title: "적정 광고비 산출",
    description:
      "플랫폼, 팔로워 규모, AQS 점수, 예상 성과를 종합하여 과도한 광고비 지불 없이 최적의 광고 단가를 제안합니다.",
  },
  {
    icon: "📐",
    title: "CPR/CPE 분석",
    description:
      "Cost Per Reach와 Cost Per Engagement를 사전에 시뮬레이션하여 예산 배분과 인플루언서 선택을 최적화합니다.",
  },
];

const steps = [
  {
    step: "01",
    icon: "🗄️",
    title: "데이터 수집",
    description:
      "인플루언서 게시물 히스토리, 팔로워 행동 패턴, 유사 캠페인 성과, 시즌 트렌드 등 수백만 개의 데이터 포인트를 수집합니다.",
  },
  {
    step: "02",
    icon: "🧠",
    title: "AI 분석",
    description:
      "딥러닝 모델이 브랜드 카테고리, 타겟 오디언스, 콘텐츠 유형, 인플루언서 특성을 종합적으로 분석하여 패턴을 학습합니다.",
  },
  {
    step: "03",
    icon: "🎯",
    title: "예측 결과",
    description:
      "도달 수, 참여율, CPR, CPE, 예상 전환율까지 — 캠페인 집행 전에 성과를 미리 확인하고 예산을 최적화하세요.",
  },
];

const predictionCards = [
  { label: "예상 도달 수", value: "842,000", unit: "명", icon: "👁️", trend: "+12%" },
  { label: "예상 참여율", value: "6.8", unit: "%", icon: "❤️", trend: "업계 평균 +2.1%p" },
  { label: "예상 CPR", value: "₩18", unit: "/reach", icon: "💵", trend: "예산 최적화" },
  { label: "예상 CPE", value: "₩210", unit: "/eng", icon: "📐", trend: "업계 최저 수준" },
];

export default function AIPredictionPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="pt-32 pb-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block bg-[#7c3aed]/20 text-[#a78bfa] text-sm font-medium px-4 py-2 rounded-full mb-6 border border-[#7c3aed]/30">
              AI 성과 예측
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-[#111827]">AI가 예측하는</span>
              <br />
              <span className="bg-gradient-to-r from-[#7c3aed] to-[#e94560] bg-clip-text text-transparent">
                캠페인 성과
              </span>
            </h1>
            <p className="text-[#6B7280] text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              광고비를 집행하기 전에 결과를 먼저 확인하세요. Inflix AI는 수백만 개의
              캠페인 데이터를 학습하여 예상 성과를 정확하게 예측합니다.
            </p>
            <Link
              href="/signup?role=brand"
              className="block w-full sm:inline-block sm:w-auto text-center bg-gradient-to-r from-[#7c3aed] to-[#e94560] text-white font-semibold px-8 py-4 rounded-xl text-lg hover:opacity-90 transition-opacity min-h-[48px] cursor-pointer"
            >
              무료로 시작하기
            </Link>
          </div>
        </section>

        {/* Sub-features */}
        <section className="py-20 px-4 bg-[#F9FAFB]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827] mb-4">
                4가지 핵심 예측 지표
              </h2>
              <p className="text-[#6B7280] text-lg">
                캠페인 집행 전에 모든 핵심 지표를 미리 파악하세요.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-8 hover:border-[#7c3aed]/50 transition-colors"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-[#111827] text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-[#6B7280] leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mock prediction result */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827] mb-4">
                예측 결과 미리보기
              </h2>
              <p className="text-[#6B7280] text-lg">
                이런 형태로 캠페인 집행 전 예측 데이터를 받아보실 수 있습니다.
              </p>
            </div>

            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-8 relative">
              <div className="absolute top-4 right-4 bg-[#FFFFFF]/80 border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-[#6B7280] text-xs">
                AI 예측 결과 미리보기
              </div>

              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#e94560] flex items-center justify-center text-white text-sm font-bold">
                  AI
                </div>
                <div>
                  <div className="text-[#111827] font-semibold">캠페인 성과 예측</div>
                  <div className="text-[#6B7280] text-sm">@influencer_example · 팔로워 120만</div>
                </div>
                <div className="ml-auto bg-green-500/20 border border-green-500/30 text-green-400 text-xs px-3 py-1 rounded-full">
                  신뢰도 94%
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {predictionCards.map((card) => (
                  <div
                    key={card.label}
                    className="bg-[#FFFFFF] rounded-xl p-5 border border-[#E5E7EB] text-center"
                  >
                    <div className="text-2xl mb-2">{card.icon}</div>
                    <div className="text-[#6B7280] text-xs mb-2">{card.label}</div>
                    <div className="text-[#111827] font-bold text-xl">
                      {card.value}
                      <span className="text-sm font-normal text-[#6B7280]">{card.unit}</span>
                    </div>
                    <div className="text-[#7c3aed] text-xs mt-1">{card.trend}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-[#7c3aed]/10 border border-[#7c3aed]/30 rounded-xl">
                <div className="text-[#a78bfa] text-sm font-medium mb-1">AI 추천</div>
                <div className="text-[#6B7280] text-sm">
                  이 인플루언서와의 협업 시 <span className="text-[#111827] font-semibold">예산 대비 최상위 10%</span>의 성과가
                  예상됩니다. 릴스 형식의 콘텐츠가 정적 이미지보다 2.4배 높은 참여율을 기록할 것으로 예측됩니다.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-4 bg-[#F9FAFB]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827] mb-4">
                어떻게 예측하나요?
              </h2>
              <p className="text-[#6B7280] text-lg">
                3단계 AI 파이프라인으로 정확한 예측을 제공합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* Connecting lines (desktop) */}
              <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-[#7c3aed] to-[#e94560]" style={{ top: "3rem" }} />

              {steps.map((step, i) => (
                <div key={step.step} className="relative">
                  <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-8 hover:border-[#7c3aed]/50 transition-colors text-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#e94560] flex items-center justify-center text-white font-bold mx-auto mb-4">
                      {step.step}
                    </div>
                    <div className="text-3xl mb-4">{step.icon}</div>
                    <h3 className="text-[#111827] text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-[#6B7280] leading-relaxed text-sm">{step.description}</p>
                  </div>
                  {/* Arrow between steps */}
                  {i < steps.length - 1 && (
                    <div className="flex md:hidden justify-center my-2 text-[#7c3aed] text-2xl">↓</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-24 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827] mb-6">
              집행 전 성과를 먼저 확인하세요
            </h2>
            <p className="text-[#6B7280] text-lg mb-10">
              AI 예측으로 광고비 낭비 없이 최적의 캠페인을 기획하세요.
            </p>
            <Link
              href="/signup?role=brand"
              className="block w-full sm:inline-block sm:w-auto text-center bg-gradient-to-r from-[#7c3aed] to-[#e94560] text-white font-semibold px-10 py-4 rounded-xl text-lg hover:opacity-90 transition-opacity min-h-[48px] cursor-pointer"
            >
              무료로 시작하기
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
