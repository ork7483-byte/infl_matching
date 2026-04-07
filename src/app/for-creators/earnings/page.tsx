import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const subFeatures = [
  {
    icon: "💵",
    title: "캠페인별 수익 확인",
    description: "진행 중인 모든 캠페인의 수익을 한 화면에서 확인하고 기간별로 비교 분석하세요.",
  },
  {
    icon: "📋",
    title: "정산 상태 추적",
    description: "정산 요청 → 검토 중 → 지급 완료까지 각 단계를 실시간으로 추적합니다.",
  },
  {
    icon: "📊",
    title: "수익 분석 차트",
    description: "월별 수익 추이와 캠페인 유형별 수익 비중을 시각화해 더 나은 협업을 기획하세요.",
  },
  {
    icon: "⚡",
    title: "간편 정산 요청",
    description: "정산 요청 버튼 하나로 여러 캠페인 수익을 묶어 요청하고 입금 예정일을 확인하세요.",
  },
];

const mockEarnings = [
  {
    brand: "뷰티 브랜드 A",
    campaign: "신제품 리뷰 캠페인",
    status: "지급 완료",
    statusColor: "#22c55e",
    statusBg: "#22c55e20",
    date: "2025.03.15",
  },
  {
    brand: "패션 브랜드 B",
    campaign: "S/S 컬렉션 홍보",
    status: "정산 검토 중",
    statusColor: "#f59e0b",
    statusBg: "#f59e0b20",
    date: "2025.03.28",
  },
  {
    brand: "테크 브랜드 C",
    campaign: "앱 출시 홍보",
    status: "정산 요청 가능",
    statusColor: "#e94560",
    statusBg: "#e9456020",
    date: "2025.04.01",
  },
];

export default function EarningsPage() {
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
            💳 수익 &amp; 정산 관리
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            수익과 정산을
            <br />
            <span style={{ color: "#e94560" }}>한 곳에서 관리하세요</span>
          </h1>
          <p className="text-lg md:text-xl mb-10" style={{ color: "#6B7280" }}>
            여러 브랜드와의 수익을 자동으로 집계하고<br className="hidden md:block" />
            정산 상태를 실시간으로 추적하세요.
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

      {/* Mock Earnings Dashboard */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">수익 대시보드 미리보기</h2>
            <p style={{ color: "#6B7280" }}>
              가입 후 실제 수익 현황을 이 화면에서 관리하세요.
            </p>
          </div>

          <div
            className="rounded-3xl p-8"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}
          >
            {/* Summary row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                { label: "이번 달 수익", value: "₩1,240,000", sub: "3개 캠페인" },
                { label: "정산 대기", value: "₩580,000", sub: "2건 검토 중" },
                { label: "누적 수익", value: "₩4,820,000", sub: "총 18개 캠페인" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl p-5 text-center"
                  style={{ backgroundColor: "#FFFFFF" }}
                >
                  <div className="text-xs mb-2" style={{ color: "#6B7280" }}>{item.label}</div>
                  <div className="text-xl font-bold mb-1" style={{ color: "#e94560" }}>{item.value}</div>
                  <div className="text-xs" style={{ color: "#6B7280" }}>{item.sub}</div>
                </div>
              ))}
            </div>

            {/* Campaign earnings list */}
            <div>
              <h3 className="text-sm font-semibold mb-4" style={{ color: "#6B7280" }}>
                최근 캠페인 수익 현황
              </h3>
              <div className="flex flex-col gap-3">
                {mockEarnings.map((item) => (
                  <div
                    key={item.campaign}
                    className="flex items-center justify-between p-4 rounded-xl"
                    style={{ backgroundColor: "#FFFFFF" }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #e94560, #7c3aed)" }}
                      >
                        {item.brand.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{item.campaign}</div>
                        <div className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
                          {item.brand} · {item.date}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Blurred amount */}
                      <div
                        className="text-sm font-semibold select-none"
                        style={{ filter: "blur(6px)", color: "#111827" }}
                      >
                        ₩000,000
                      </div>
                      <span
                        className="text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap"
                        style={{ backgroundColor: item.statusBg, color: item.statusColor }}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA inside dashboard */}
            <div
              className="mt-6 pt-6 flex items-center justify-between"
              style={{ borderTop: "1px solid #E5E7EB" }}
            >
              <p className="text-sm" style={{ color: "#6B7280" }}>
                실제 수익 금액은 가입 후 확인 가능합니다.
              </p>
              <Link
                href="/signup?role=creator"
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ backgroundColor: "#e94560" }}
              >
                가입하고 확인하기 →
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
            수익 관리를 지금 시작하세요
          </h2>
          <p className="mb-8" style={{ color: "#6B7280" }}>
            무료로 가입하고 모든 수익과 정산을 한 곳에서 관리하세요.
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
