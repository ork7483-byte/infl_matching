import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const features = [
  {
    icon: "⚡",
    title: "실시간 대시보드",
    description:
      "콘텐츠 게시 즉시 조회수, 좋아요, 댓글, 저장, 공유까지 모든 지표가 실시간으로 업데이트됩니다.",
  },
  {
    icon: "📉",
    title: "시계열 분석",
    description:
      "캠페인 전·중·후 성과 추이를 시계열 차트로 시각화하여 최적의 콘텐츠 타이밍을 파악하세요.",
  },
  {
    icon: "📄",
    title: "PDF/Excel 리포트",
    description:
      "원클릭으로 완성형 리포트를 생성하세요. 브랜드 로고와 색상이 적용된 전문적인 보고서를 즉시 공유할 수 있습니다.",
  },
  {
    icon: "💰",
    title: "ROI 분석",
    description:
      "CPR(Cost Per Reach), CPE(Cost Per Engagement)부터 실제 구매 전환율까지 광고비 대비 성과를 정확히 측정합니다.",
  },
];

const metrics = [
  { label: "평균 리포트 생성 시간", value: "< 30초", sub: "기존 대비 99% 단축" },
  { label: "추적 가능한 지표", value: "50+", sub: "플랫폼 통합 기준" },
  { label: "데이터 업데이트 주기", value: "실시간", sub: "최대 5분 지연" },
];

export default function AnalyticsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="pt-32 pb-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block bg-[#7c3aed]/20 text-[#a78bfa] text-sm font-medium px-4 py-2 rounded-full mb-6 border border-[#7c3aed]/30">
              성과 분석 & 리포트
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-[#e4e4e7]">실시간 성과 분석 &</span>
              <br />
              <span className="bg-gradient-to-r from-[#7c3aed] to-[#e94560] bg-clip-text text-transparent">
                원클릭 리포트
              </span>
            </h1>
            <p className="text-[#a1a1aa] text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              수십 개의 인플루언서 캠페인 성과를 하나의 화면에서 확인하고, 클릭 한 번으로
              완성형 보고서를 만들어 팀과 공유하세요.
            </p>
            <Link
              href="/signup?role=brand"
              className="inline-block bg-gradient-to-r from-[#7c3aed] to-[#e94560] text-white font-semibold px-8 py-4 rounded-xl text-lg hover:opacity-90 transition-opacity"
            >
              무료로 시작하기
            </Link>
          </div>
        </section>

        {/* Metrics */}
        <section className="py-16 px-4 bg-[#1a1a2e]/50">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl p-8 text-center"
                >
                  <div className="text-4xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#e94560] bg-clip-text text-transparent mb-2">
                    {m.value}
                  </div>
                  <div className="text-[#e4e4e7] font-semibold mb-1">{m.label}</div>
                  <div className="text-[#a1a1aa] text-sm">{m.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sub-features */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#e4e4e7] mb-4">
                분석의 모든 것을 담았습니다
              </h2>
              <p className="text-[#a1a1aa] text-lg">
                데이터 수집부터 보고서 공유까지, 분석 워크플로우를 완전 자동화합니다.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl p-8 hover:border-[#7c3aed]/50 transition-colors"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-[#e4e4e7] text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-[#a1a1aa] leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mock Chart Area */}
        <section className="py-20 px-4 bg-[#1a1a2e]/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#e4e4e7] mb-4">
                한눈에 보이는 성과 차트
              </h2>
              <p className="text-[#a1a1aa] text-lg">
                복잡한 데이터를 직관적인 시각화로 즉시 파악하세요.
              </p>
            </div>

            <div className="bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl p-8 relative">
              <div className="absolute top-4 right-4 bg-[#0a0a0f]/80 border border-[#2a2a3e] rounded-lg px-3 py-1.5 text-[#a1a1aa] text-xs">
                성과 분석 차트 미리보기
              </div>

              {/* Mock chart header */}
              <div className="flex items-center gap-6 mb-8">
                <div>
                  <div className="text-[#e4e4e7] font-semibold mb-1">캠페인 성과 추이</div>
                  <div className="text-[#a1a1aa] text-sm">최근 30일</div>
                </div>
                <div className="flex gap-4 ml-auto">
                  {["도달 수", "참여수", "클릭 수"].map((label, i) => (
                    <div key={label} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          background: i === 0 ? "#7c3aed" : i === 1 ? "#e94560" : "#22c55e",
                        }}
                      />
                      <span className="text-[#a1a1aa] text-sm">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mock line chart */}
              <div className="relative h-48 mb-6">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[#a1a1aa] text-xs">
                  {["100K", "75K", "50K", "25K", "0"].map((v) => (
                    <span key={v}>{v}</span>
                  ))}
                </div>
                {/* Chart bars */}
                <div className="ml-10 h-full flex items-end gap-1.5">
                  {[45, 60, 55, 80, 70, 90, 65, 95, 75, 85, 70, 88, 60, 92, 78].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col gap-0.5 items-center">
                      <div
                        className="w-full rounded-sm"
                        style={{
                          height: `${h}%`,
                          background: `linear-gradient(to top, #7c3aed80, #e9456040)`,
                        }}
                      />
                    </div>
                  ))}
                </div>
                {/* Horizontal grid lines */}
                <div className="absolute inset-0 ml-10 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="border-t border-[#2a2a3e] w-full" />
                  ))}
                </div>
              </div>

              {/* Summary row */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                {[
                  { label: "총 도달 수", value: "1,240,000", change: "+18.4%" },
                  { label: "총 참여수", value: "87,300", change: "+24.1%" },
                  { label: "평균 참여율", value: "7.04%", change: "+2.1%p" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-[#0a0a0f] rounded-xl p-4 border border-[#2a2a3e]"
                  >
                    <div className="text-[#a1a1aa] text-xs mb-1">{stat.label}</div>
                    <div className="text-[#e4e4e7] font-bold text-lg">{stat.value}</div>
                    <div className="text-green-400 text-xs">{stat.change}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-24 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#e4e4e7] mb-6">
              데이터로 증명하는 마케팅을 시작하세요
            </h2>
            <p className="text-[#a1a1aa] text-lg mb-10">
              지금 가입하면 모든 분석 기능을 무료로 사용할 수 있습니다.
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
