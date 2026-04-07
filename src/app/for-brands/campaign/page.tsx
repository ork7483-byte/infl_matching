import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const features = [
  {
    icon: "✏️",
    title: "캠페인 생성",
    description:
      "목표, 예산, 타겟 오디언스를 설정하면 Inflix가 최적의 캠페인 구조를 자동으로 제안합니다.",
  },
  {
    icon: "🎯",
    title: "인플루언서 매칭",
    description:
      "AI가 캠페인 목표에 맞는 인플루언서를 자동으로 추천하고, AQS 점수로 품질을 사전에 검증합니다.",
  },
  {
    icon: "📡",
    title: "실시간 트래킹",
    description:
      "콘텐츠 업로드 순간부터 조회수, 좋아요, 댓글, 공유, 클릭 전환까지 실시간으로 모니터링합니다.",
  },
  {
    icon: "📋",
    title: "자동 리포트",
    description:
      "캠페인 종료 시 PDF 및 Excel 리포트가 자동으로 생성됩니다. 팀 공유도 링크 하나로 끝납니다.",
  },
];

export default function CampaignPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="pt-32 pb-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block bg-[#7c3aed]/20 text-[#a78bfa] text-sm font-medium px-4 py-2 rounded-full mb-6 border border-[#7c3aed]/30">
              캠페인 관리
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-[#111827]">캠페인 관리를</span>
              <br />
              <span className="bg-gradient-to-r from-[#7c3aed] to-[#e94560] bg-clip-text text-transparent">
                한 곳에서
              </span>
            </h1>
            <p className="text-[#6B7280] text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              기획, 매칭, 트래킹, 리포트까지 인플루언서 캠페인의 전 과정을 하나의 플랫폼에서
              완결하세요. 더 이상 여러 툴을 오갈 필요가 없습니다.
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
                캠페인의 모든 단계를 지원합니다
              </h2>
              <p className="text-[#6B7280] text-lg">
                처음 기획부터 최종 결과 보고까지, 모든 단계가 연결되어 있습니다.
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

        {/* Dashboard Preview */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827] mb-4">
                직관적인 캠페인 대시보드
              </h2>
              <p className="text-[#6B7280] text-lg">
                한눈에 캠페인 현황을 파악하고 즉시 의사결정하세요.
              </p>
            </div>

            {/* Mock screenshot with blur effect */}
            <div className="relative rounded-2xl overflow-hidden border border-[#E5E7EB] bg-[#FFFFFF]">
              {/* Visible top 30% */}
              <div className="px-8 pt-8 pb-4">
                {/* Mock dashboard header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="h-4 w-32 bg-[#E5E7EB] rounded mb-2" />
                    <div className="h-3 w-48 bg-[#E5E7EB]/60 rounded" />
                  </div>
                  <div className="flex gap-3">
                    <div className="h-9 w-24 bg-[#7c3aed]/30 rounded-lg" />
                    <div className="h-9 w-24 bg-[#E5E7EB] rounded-lg" />
                  </div>
                </div>
                {/* Mock stat cards */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {["총 도달 수", "총 참여수", "클릭 수", "전환율"].map((label) => (
                    <div key={label} className="bg-[#FFFFFF] rounded-xl p-4 border border-[#E5E7EB]">
                      <div className="text-[#6B7280] text-xs mb-2">{label}</div>
                      <div className="h-5 w-20 bg-[#E5E7EB] rounded" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Blurred bottom section */}
              <div className="relative">
                <div className="px-8 pb-8 opacity-40">
                  {/* Mock chart area */}
                  <div className="bg-[#FFFFFF] rounded-xl p-6 border border-[#E5E7EB] mb-4">
                    <div className="h-4 w-40 bg-[#E5E7EB] rounded mb-4" />
                    <div className="flex items-end gap-2 h-24">
                      {[60, 80, 45, 90, 70, 85, 55, 95, 65, 75].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-[#7c3aed]/60 to-[#e94560]/30 rounded-t"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-[#FFFFFF] rounded-xl p-4 border border-[#E5E7EB]">
                        <div className="h-3 w-24 bg-[#E5E7EB] rounded mb-3" />
                        <div className="h-3 w-32 bg-[#E5E7EB]/60 rounded mb-2" />
                        <div className="h-3 w-20 bg-[#E5E7EB]/40 rounded" />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Blur overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFFFFF]/60 to-[#FFFFFF]" />
                {/* CTA overlay */}
                <div className="absolute bottom-4 inset-x-0 flex justify-center">
                  <Link
                    href="/signup?role=brand"
                    className="bg-gradient-to-r from-[#7c3aed] to-[#e94560] text-white font-semibold px-6 py-3 rounded-xl text-sm hover:opacity-90 transition-opacity shadow-lg"
                  >
                    전체 대시보드 보기
                  </Link>
                </div>
              </div>

              {/* Watermark label */}
              <div className="absolute top-4 right-4 bg-[#FFFFFF]/80 border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-[#6B7280] text-xs">
                캠페인 대시보드 미리보기
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-24 px-4 text-center bg-[#F9FAFB]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827] mb-6">
              캠페인 관리, 이제 쉽게 시작하세요
            </h2>
            <p className="text-[#6B7280] text-lg mb-10">
              무료 플랜으로 지금 바로 첫 번째 캠페인을 만들어보세요.
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
