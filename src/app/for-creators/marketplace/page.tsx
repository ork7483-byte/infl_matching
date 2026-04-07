import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const subFeatures = [
  {
    icon: "🔍",
    title: "캠페인 검색",
    description: "카테고리, 채널, 팔로워 규모별로 필터링해 내게 맞는 캠페인을 빠르게 찾으세요.",
  },
  {
    icon: "📝",
    title: "간편 지원",
    description: "클릭 한 번으로 지원서를 제출하고, 자동으로 연동된 미디어킷이 브랜드에 전달됩니다.",
  },
  {
    icon: "🔔",
    title: "매칭 알림",
    description: "내 채널 특성에 맞는 새 캠페인이 등록되면 즉시 알림을 받아 경쟁자보다 먼저 지원하세요.",
  },
  {
    icon: "💰",
    title: "수익 관리",
    description: "지원한 캠페인의 진행 상태와 예상 수익을 한 대시보드에서 한눈에 확인하세요.",
  },
];

const mockCampaigns = [
  {
    id: 1,
    brand: "뷰티 브랜드 A",
    category: "뷰티 · 스킨케어",
    platform: "Instagram",
    followers: "5만 이상",
  },
  {
    id: 2,
    brand: "패션 브랜드 B",
    category: "패션 · 라이프스타일",
    platform: "Instagram / TikTok",
    followers: "1만 이상",
  },
  {
    id: 3,
    brand: "테크 브랜드 C",
    category: "테크 · 리뷰",
    platform: "YouTube",
    followers: "3만 이상",
  },
];

export default function MarketplacePage() {
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
            🛒 캠페인 마켓플레이스
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            브랜드가 먼저
            <br />
            <span style={{ color: "#e94560" }}>찾아오는 마켓플레이스</span>
          </h1>
          <p className="text-lg md:text-xl mb-10" style={{ color: "#6B7280" }}>
            수백 개의 브랜드 캠페인이 매일 업데이트됩니다.<br className="hidden md:block" />
            내 채널에 맞는 협업을 골라 지원하고 수익을 창출하세요.
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

      {/* Mock Campaign Cards */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">지금 모집 중인 캠페인</h2>
            <p style={{ color: "#6B7280" }}>
              가입 후 수익 정보 및 상세 요건을 확인할 수 있습니다.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="rounded-2xl overflow-hidden"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}
              >
                {/* Card header */}
                <div
                  className="h-24 flex items-center justify-center text-2xl font-bold"
                  style={{ background: "linear-gradient(135deg, #FFFFFF 0%, #2a1a3e 100%)" }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, #e94560, #7c3aed)" }}
                  >
                    {campaign.brand.charAt(0)}
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-base mb-1">{campaign.brand}</h3>
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ backgroundColor: "#e9456015", color: "#e94560" }}
                    >
                      {campaign.category}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 mb-4 text-sm" style={{ color: "#6B7280" }}>
                    <div className="flex items-center gap-2">
                      <span>📱</span> {campaign.platform}
                    </div>
                    <div className="flex items-center gap-2">
                      <span>👥</span> {campaign.followers}
                    </div>
                  </div>

                  {/* Blurred reward section */}
                  <div
                    className="rounded-xl p-3 mb-4"
                    style={{ backgroundColor: "#FFFFFF" }}
                  >
                    <div className="text-xs mb-2" style={{ color: "#6B7280" }}>캠페인 보상</div>
                    <div
                      className="text-lg font-bold select-none rounded"
                      style={{ filter: "blur(8px)", color: "#e94560" }}
                    >
                      ₩000,000 ~ ₩000,000
                    </div>
                  </div>

                  <Link
                    href="/signup?role=creator"
                    className="block w-full text-center py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: "#e94560" }}
                  >
                    가입하고 지원하기
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center mt-6 text-sm" style={{ color: "#6B7280" }}>
            + 300개 이상의 캠페인이 더 있습니다
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24 px-4 text-center">
        <div
          className="max-w-3xl mx-auto rounded-3xl p-12"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            지금 바로 캠페인을 찾아보세요
          </h2>
          <p className="mb-8" style={{ color: "#6B7280" }}>
            무료로 가입하고 브랜드 캠페인에 지원해보세요.
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
