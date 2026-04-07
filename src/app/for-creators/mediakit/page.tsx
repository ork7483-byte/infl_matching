import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const subFeatures = [
  {
    icon: "🔗",
    title: "자동 데이터 수집",
    description: "Instagram, YouTube, TikTok 등 주요 SNS 채널을 연동하면 팔로워 수, 평균 조회수, 참여율이 자동으로 수집됩니다.",
  },
  {
    icon: "🎨",
    title: "디자인 템플릿",
    description: "전문 디자이너가 제작한 다양한 템플릿 중 원하는 스타일을 선택해 브랜드 정체성에 맞는 미디어킷을 완성하세요.",
  },
  {
    icon: "📥",
    title: "PDF 다운로드",
    description: "완성된 미디어킷을 고화질 PDF로 즉시 다운로드해 브랜드 담당자에게 전달할 수 있습니다.",
  },
  {
    icon: "🔗",
    title: "공유 링크 생성",
    description: "링크 하나로 항상 최신 데이터가 반영된 온라인 미디어킷을 공유하세요. 조회 통계도 확인 가능합니다.",
  },
];

export default function MediaKitPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFFFFF", color: "#111827" }}>
      <Navbar />

      {/* Hero */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ backgroundColor: "#e9456015", color: "#e94560", border: "1px solid #e9456030" }}
          >
            📋 미디어킷 자동 생성
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            원클릭으로 만드는
            <br />
            <span style={{ color: "#e94560" }}>프로페셔널 미디어킷</span>
          </h1>
          <p className="text-lg md:text-xl mb-10" style={{ color: "#6B7280" }}>
            SNS 채널을 연동하면 팔로워 수, 참여율, 콘텐츠 성과가 담긴<br className="hidden md:block" />
            세련된 미디어킷이 자동으로 완성됩니다.
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
                style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}
              >
                <div className="text-3xl">{feature.icon}</div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p style={{ color: "#6B7280" }} className="text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mock Media Kit Preview */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">이런 미디어킷이 완성됩니다</h2>
            <p style={{ color: "#6B7280" }}>가입 후 내 계정으로 생성된 실제 미디어킷을 확인하세요.</p>
          </div>

          {/* Preview card with blur effect on bottom */}
          <div
            className="rounded-3xl overflow-hidden relative"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}
          >
            {/* Top 60% — visible content */}
            <div className="p-8 pb-4">
              {/* Profile row */}
              <div className="flex items-center gap-4 mb-8">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
                  style={{ background: "linear-gradient(135deg, #e94560, #7c3aed)" }}
                >
                  J
                </div>
                <div>
                  <div className="font-bold text-lg">@jina_creates</div>
                  <div className="text-sm" style={{ color: "#6B7280" }}>라이프스타일 · 뷰티 크리에이터</div>
                </div>
                <div className="ml-auto">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: "#e9456020", color: "#e94560" }}
                  >
                    MEDIA KIT
                  </span>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: "팔로워", value: "128K" },
                  { label: "평균 참여율", value: "4.8%" },
                  { label: "월 평균 조회수", value: "520K" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl p-4 text-center"
                    style={{ backgroundColor: "#FFFFFF" }}
                  >
                    <div className="text-2xl font-bold mb-1" style={{ color: "#e94560" }}>
                      {stat.value}
                    </div>
                    <div className="text-xs" style={{ color: "#6B7280" }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Channel breakdown */}
              <div>
                <h4 className="text-sm font-semibold mb-3" style={{ color: "#6B7280" }}>채널별 현황</h4>
                <div className="flex flex-col gap-2">
                  {[
                    { channel: "Instagram", followers: "85K", bar: 70 },
                    { channel: "YouTube", followers: "32K", bar: 26 },
                    { channel: "TikTok", followers: "11K", bar: 9 },
                  ].map((ch) => (
                    <div key={ch.channel} className="flex items-center gap-3">
                      <div className="w-20 text-sm">{ch.channel}</div>
                      <div className="flex-1 rounded-full h-2" style={{ backgroundColor: "#E5E7EB" }}>
                        <div
                          className="h-2 rounded-full"
                          style={{ width: `${ch.bar}%`, backgroundColor: "#e94560" }}
                        />
                      </div>
                      <div className="text-sm w-12 text-right" style={{ color: "#6B7280" }}>{ch.followers}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom blurred section */}
            <div
              className="relative px-8 pt-4 pb-8"
              style={{
                WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 100%)",
                maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0) 100%)",
                filter: "blur(4px)",
              }}
            >
              <h4 className="text-sm font-semibold mb-4" style={{ color: "#6B7280" }}>최근 협업 캠페인</h4>
              <div className="grid grid-cols-2 gap-3">
                {["뷰티 브랜드 A", "패션 브랜드 B", "식품 브랜드 C", "테크 브랜드 D"].map((brand) => (
                  <div
                    key={brand}
                    className="rounded-xl p-3 text-sm"
                    style={{ backgroundColor: "#FFFFFF" }}
                  >
                    {brand}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA overlay on bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 flex items-end justify-center pb-8"
              style={{
                background: "linear-gradient(to top, #FFFFFF 40%, transparent 100%)",
                height: "120px",
              }}
            >
              <Link
                href="/signup?role=creator"
                className="px-6 py-3 rounded-xl font-semibold text-sm text-white"
                style={{ backgroundColor: "#e94560" }}
              >
                전체 미디어킷 보기 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-4 text-center">
        <div
          className="max-w-3xl mx-auto rounded-3xl p-12"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            지금 바로 나만의 미디어킷을 만들어보세요
          </h2>
          <p className="mb-8" style={{ color: "#6B7280" }}>
            5분 안에 프로페셔널 미디어킷을 완성할 수 있습니다.
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
