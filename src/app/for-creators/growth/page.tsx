import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const subFeatures = [
  {
    icon: "📊",
    title: "팔로워 추이 분석",
    description: "주간·월간·연간 팔로워 변화를 그래프로 한눈에 확인하고 성장 패턴을 파악하세요.",
  },
  {
    icon: "❤️",
    title: "참여율 변화",
    description: "좋아요, 댓글, 공유율 등 참여 지표의 트렌드를 분석해 콘텐츠 전략을 최적화하세요.",
  },
  {
    icon: "📅",
    title: "월별 성과",
    description: "매월 게시물 성과를 자동으로 정리해 어떤 콘텐츠가 가장 효과적인지 파악하세요.",
  },
  {
    icon: "🚀",
    title: "성장률 분석",
    description: "유사한 카테고리의 크리에이터 평균과 내 성장률을 비교해 현재 위치를 확인하세요.",
  },
];

const mockChartData = [
  { month: "10월", value: 82 },
  { month: "11월", value: 91 },
  { month: "12월", value: 88 },
  { month: "1월", value: 95 },
  { month: "2월", value: 105 },
  { month: "3월", value: 128 },
];

const maxValue = Math.max(...mockChartData.map((d) => d.value));

export default function GrowthPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0f", color: "#e4e4e7" }}>
      <Navbar />

      {/* Hero */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ backgroundColor: "#e9456015", color: "#e94560", border: "1px solid #e9456030" }}
          >
            📈 내 성장 트래커
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            내 계정 성장을
            <br />
            <span style={{ color: "#e94560" }}>한눈에</span>
          </h1>
          <p className="text-lg md:text-xl mb-10" style={{ color: "#a1a1aa" }}>
            팔로워 추이, 참여율 변화, 월별 성과를 실시간으로 추적하고<br className="hidden md:block" />
            데이터 기반의 콘텐츠 전략을 세우세요.
          </p>
          <Link
            href="/signup?role=creator"
            className="inline-block px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all hover:opacity-90 hover:scale-105"
            style={{ backgroundColor: "#e94560" }}
          >
            무료로 시작하기
          </Link>
        </div>
      </section>

      {/* Sub-features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subFeatures.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl p-8 flex flex-col gap-4"
                style={{ backgroundColor: "#1a1a2e", border: "1px solid #2a2a3e" }}
              >
                <div className="text-3xl">{feature.icon}</div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p style={{ color: "#a1a1aa" }} className="text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mock Chart */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">팔로워 성장 트래커 미리보기</h2>
            <p style={{ color: "#a1a1aa" }}>
              가입 후 실제 내 채널 데이터로 성장 추이를 확인하세요.
            </p>
          </div>

          <div
            className="rounded-3xl p-8"
            style={{ backgroundColor: "#1a1a2e", border: "1px solid #2a2a3e" }}
          >
            {/* Chart header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-sm font-medium mb-1" style={{ color: "#a1a1aa" }}>총 팔로워</div>
                <div className="text-3xl font-bold" style={{ color: "#e94560" }}>128K</div>
                <div className="text-sm font-medium mt-1" style={{ color: "#22c55e" }}>
                  ▲ 23K (+22%) 최근 6개월
                </div>
              </div>
              <div className="flex gap-2">
                {["1주", "1개월", "6개월", "1년"].map((label, i) => (
                  <button
                    key={label}
                    className="px-3 py-1 rounded-lg text-xs font-medium"
                    style={{
                      backgroundColor: i === 2 ? "#e9456020" : "transparent",
                      color: i === 2 ? "#e94560" : "#a1a1aa",
                      border: `1px solid ${i === 2 ? "#e9456040" : "#2a2a3e"}`,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bar chart */}
            <div className="flex items-end justify-between gap-3 h-48 mb-4">
              {mockChartData.map((bar) => {
                const heightPercent = (bar.value / maxValue) * 100;
                const isLast = bar.month === "3월";
                return (
                  <div key={bar.month} className="flex-1 flex flex-col items-center gap-2">
                    <div className="text-xs font-semibold" style={{ color: isLast ? "#e94560" : "#a1a1aa" }}>
                      {bar.value}K
                    </div>
                    <div className="w-full flex items-end" style={{ height: "120px" }}>
                      <div
                        className="w-full rounded-t-lg transition-all"
                        style={{
                          height: `${heightPercent}%`,
                          background: isLast
                            ? "linear-gradient(to top, #e94560, #e9456080)"
                            : "linear-gradient(to top, #2a2a3e, #3a2a4e)",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between">
              {mockChartData.map((bar) => (
                <div
                  key={bar.month}
                  className="flex-1 text-center text-xs"
                  style={{ color: "#a1a1aa" }}
                >
                  {bar.month}
                </div>
              ))}
            </div>

            {/* Engagement stats row */}
            <div
              className="grid grid-cols-3 gap-4 mt-8 pt-6"
              style={{ borderTop: "1px solid #2a2a3e" }}
            >
              {[
                { label: "평균 참여율", value: "4.8%", change: "+0.3%", up: true },
                { label: "이번 달 게시물", value: "12", change: "+2", up: true },
                { label: "총 좋아요", value: "89K", change: "+12K", up: true },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-xl font-bold mb-1">{stat.value}</div>
                  <div className="text-xs mb-1" style={{ color: "#a1a1aa" }}>{stat.label}</div>
                  <div className="text-xs font-medium" style={{ color: "#22c55e" }}>
                    ▲ {stat.change}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-4 text-center">
        <div
          className="max-w-3xl mx-auto rounded-3xl p-12"
          style={{ backgroundColor: "#1a1a2e", border: "1px solid #2a2a3e" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            내 채널 성장을 지금 바로 추적하세요
          </h2>
          <p className="mb-8" style={{ color: "#a1a1aa" }}>
            무료로 가입하고 성장 트래커를 활성화하세요.
          </p>
          <Link
            href="/signup?role=creator"
            className="inline-block px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all hover:opacity-90"
            style={{ backgroundColor: "#e94560" }}
          >
            무료로 시작하기
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
