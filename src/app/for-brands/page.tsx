import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const painPoints = [
  {
    icon: "👻",
    title: "가짜 팔로워 걱정",
    description:
      "팔로워 수가 많아도 실제 구매력 있는 오디언스인지 확인할 방법이 없어 광고비를 낭비하고 있지 않나요?",
  },
  {
    icon: "📊",
    title: "ROI 측정 어려움",
    description:
      "캠페인을 집행했지만 실제 매출 기여도와 광고 효율을 정확히 측정하기가 너무 어렵지 않으신가요?",
  },
  {
    icon: "📝",
    title: "리포트 수작업",
    description:
      "각 플랫폼에서 데이터를 일일이 긁어 모아 엑셀로 정리하는 작업에 매주 몇 시간을 쏟고 있지는 않으신가요?",
  },
];

const solutions = [
  {
    icon: "🚀",
    title: "캠페인 관리",
    description: "캠페인 생성부터 인플루언서 매칭, 실시간 트래킹까지 한 화면에서 관리하세요.",
    href: "/for-brands/campaign",
  },
  {
    icon: "📈",
    title: "성과 분석 & 리포트",
    description: "실시간 대시보드와 원클릭 PDF/Excel 리포트로 성과를 즉시 공유하세요.",
    href: "/for-brands/analytics",
  },
  {
    icon: "🔍",
    title: "인플루언서 검증",
    description: "AQS 점수와 가짜 팔로워 탐지로 진짜 영향력 있는 크리에이터를 골라내세요.",
    href: "/for-brands/verification",
  },
  {
    icon: "🤖",
    title: "AI 성과 예측",
    description: "캠페인 집행 전 AI가 예상 도달 수, 참여율, 적정 광고비를 미리 계산해 드립니다.",
    href: "/for-brands/ai-prediction",
  },
];

const comparisonRows = [
  {
    category: "인플루언서 검증",
    before: "팔로워 수·감으로 판단",
    after: "AQS 5축 점수 + 가짜 팔로워 탐지",
  },
  {
    category: "성과 측정",
    before: "플랫폼별 수동 확인",
    after: "통합 실시간 대시보드",
  },
  {
    category: "리포트",
    before: "엑셀 수작업 (수 시간)",
    after: "원클릭 PDF/Excel 자동 생성",
  },
  {
    category: "비용 예측",
    before: "경험치 기반 어림 계산",
    after: "AI 기반 CPR/CPE 사전 예측",
  },
];

export default function ForBrandsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="pt-32 pb-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block bg-[#7c3aed]/20 text-[#a78bfa] text-sm font-medium px-4 py-2 rounded-full mb-6 border border-[#7c3aed]/30">
              브랜드 솔루션
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-[#111827]">데이터로 검증된</span>
              <br />
              <span className="bg-gradient-to-r from-[#7c3aed] to-[#e94560] bg-clip-text text-transparent">
                인플루언서 마케팅
              </span>
            </h1>
            <p className="text-[#6B7280] text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              감이 아닌 데이터로. Inflix는 AI 검증, 실시간 성과 분석, 자동 리포트로
              브랜드의 인플루언서 마케팅을 완전히 바꿉니다.
            </p>
            <Link
              href="/signup?role=brand"
              className="inline-block bg-gradient-to-r from-[#7c3aed] to-[#e94560] text-white font-semibold px-8 py-4 rounded-xl text-lg hover:opacity-90 transition-opacity"
            >
              무료로 시작하기 — 브랜드 가입
            </Link>
          </div>
        </section>

        {/* Pain Points */}
        <section className="py-20 px-4 bg-[#F9FAFB]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">
                이런 고민 있으신가요?
              </h2>
              <p className="text-[#6B7280] text-lg">
                많은 브랜드 마케터들이 매일 겪고 있는 문제들입니다.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {painPoints.map((point) => (
                <div
                  key={point.title}
                  className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-8 hover:border-[#7c3aed]/50 transition-colors"
                >
                  <div className="text-4xl mb-4">{point.icon}</div>
                  <h3 className="text-[#111827] text-xl font-semibold mb-3">{point.title}</h3>
                  <p className="text-[#6B7280] leading-relaxed">{point.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">
                Inflix가 해결해 드립니다
              </h2>
              <p className="text-[#6B7280] text-lg">
                검증된 기능으로 모든 고민을 한 번에 해소하세요.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {solutions.map((sol) => (
                <Link
                  key={sol.title}
                  href={sol.href}
                  className="group bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-8 hover:border-[#7c3aed]/60 hover:bg-[#FFFFFF]/80 transition-all"
                >
                  <div className="text-4xl mb-4">{sol.icon}</div>
                  <h3 className="text-[#111827] text-xl font-semibold mb-3 group-hover:text-[#a78bfa] transition-colors">
                    {sol.title}
                  </h3>
                  <p className="text-[#6B7280] leading-relaxed mb-4">{sol.description}</p>
                  <span className="text-[#7c3aed] text-sm font-medium">자세히 보기 →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-20 px-4 bg-[#F9FAFB]">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">
                기존 방식 vs Inflix
              </h2>
              <p className="text-[#6B7280] text-lg">무엇이 다른지 직접 비교해보세요.</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-[#E5E7EB]">
              {/* Table Header */}
              <div className="grid grid-cols-3 bg-[#FFFFFF] border-b border-[#E5E7EB]">
                <div className="px-6 py-4 text-[#6B7280] font-medium text-sm">항목</div>
                <div className="px-6 py-4 text-center font-semibold text-[#111827] border-l border-[#E5E7EB]">
                  기존 방식
                </div>
                <div className="px-6 py-4 text-center font-semibold bg-gradient-to-r from-[#7c3aed]/20 to-[#e94560]/20 text-[#a78bfa] border-l border-[#E5E7EB]">
                  Inflix
                </div>
              </div>
              {comparisonRows.map((row, i) => (
                <div
                  key={row.category}
                  className={`grid grid-cols-3 border-b border-[#E5E7EB] last:border-b-0 ${
                    i % 2 === 0 ? "bg-[#FFFFFF]" : "bg-[#F9FAFB]"
                  }`}
                >
                  <div className="px-6 py-5 text-[#111827] font-medium">{row.category}</div>
                  <div className="px-6 py-5 text-center text-[#6B7280] border-l border-[#E5E7EB]">
                    {row.before}
                  </div>
                  <div className="px-6 py-5 text-center text-[#a78bfa] font-medium border-l border-[#E5E7EB]">
                    ✓ {row.after}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-24 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-6">
              지금 바로 데이터 기반 마케팅을 시작하세요
            </h2>
            <p className="text-[#6B7280] text-lg mb-10">
              무료 플랜으로 시작하여 인플루언서 마케팅의 ROI를 직접 경험해보세요.
              신용카드가 필요 없습니다.
            </p>
            <Link
              href="/signup?role=brand"
              className="inline-block bg-gradient-to-r from-[#7c3aed] to-[#e94560] text-white font-semibold px-10 py-4 rounded-xl text-lg hover:opacity-90 transition-opacity"
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
