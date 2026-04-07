import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const painPoints = [
  {
    icon: "📄",
    title: "미디어킷 수동 제작",
    description:
      "브랜드에 제안할 때마다 통계를 직접 캡처하고, 디자인 툴로 미디어킷을 일일이 만들어야 했죠.",
  },
  {
    icon: "🔍",
    title: "브랜드 찾기 어려움",
    description:
      "협업하고 싶은 브랜드를 직접 찾아 DM을 보내고, 거절당하기를 반복하며 지쳐갔죠.",
  },
  {
    icon: "💰",
    title: "정산 관리 복잡",
    description:
      "여러 브랜드와 진행한 캠페인 수익을 일일이 엑셀에 정리하고 정산 현황을 추적하기 힘들었죠.",
  },
];

const solutions = [
  {
    icon: "📋",
    title: "미디어킷 자동 생성",
    description:
      "SNS 계정 연동만으로 팔로워 수, 참여율, 콘텐츠 현황이 담긴 프로 미디어킷을 자동 생성합니다.",
    href: "/for-creators/mediakit",
  },
  {
    icon: "🛒",
    title: "캠페인 마켓플레이스",
    description:
      "수백 개의 브랜드 캠페인이 등록된 마켓플레이스에서 내게 맞는 협업을 골라 지원하세요.",
    href: "/for-creators/marketplace",
  },
  {
    icon: "📈",
    title: "내 성장 트래커",
    description:
      "팔로워 추이, 참여율 변화, 월별 성과를 한눈에 확인하고 성장 전략을 세우세요.",
    href: "/for-creators/growth",
  },
  {
    icon: "💳",
    title: "수익 & 정산 관리",
    description:
      "캠페인별 수익을 자동으로 집계하고, 정산 상태를 실시간으로 확인합니다.",
    href: "/for-creators/earnings",
  },
];

export default function ForCreatorsPage() {
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
            ✨ For Creators
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            당신의 영향력을
            <br />
            <span style={{ color: "#e94560" }}>정확한 숫자로</span> 보여주세요
          </h1>
          <p className="text-lg md:text-xl mb-10" style={{ color: "#6B7280" }}>
            미디어킷 자동 생성부터 브랜드 캠페인 매칭, 수익 정산까지 —<br className="hidden md:block" />
            크리에이터의 모든 비즈니스를 Inflix 하나로 관리하세요.
          </p>
          <Link
            href="/signup?role=creator"
            className="inline-block px-8 py-4 rounded-xl font-semibold text-lg text-white transition-all hover:opacity-90 hover:scale-105"
            style={{ backgroundColor: "#e94560" }}
          >
            무료로 시작하기 — 크리에이터 가입
          </Link>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">이런 불편함 있으셨죠?</h2>
            <p style={{ color: "#6B7280" }}>
              크리에이터라면 누구나 겪어봤을 비효율을 Inflix가 해결합니다.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {painPoints.map((point) => (
              <div
                key={point.title}
                className="rounded-2xl p-8 flex flex-col gap-4"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}
              >
                <div className="text-4xl">{point.icon}</div>
                <h3 className="text-lg font-semibold">{point.title}</h3>
                <p style={{ color: "#6B7280" }} className="text-sm leading-relaxed">
                  {point.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Inflix가 제공하는 <span style={{ color: "#e94560" }}>4가지 솔루션</span>
            </h2>
            <p style={{ color: "#6B7280" }}>
              크리에이터 활동의 모든 단계를 스마트하게 지원합니다.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {solutions.map((solution) => (
              <Link
                key={solution.title}
                href={solution.href}
                className="rounded-2xl p-8 flex flex-col gap-4 transition-all hover:border-pink-500 hover:-translate-y-1 group"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}
              >
                <div className="text-4xl">{solution.icon}</div>
                <h3 className="text-xl font-semibold group-hover:text-pink-400 transition-colors">
                  {solution.title}
                </h3>
                <p style={{ color: "#6B7280" }} className="text-sm leading-relaxed">
                  {solution.description}
                </p>
                <span className="text-sm font-medium mt-2" style={{ color: "#e94560" }}>
                  자세히 보기 →
                </span>
              </Link>
            ))}
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
            지금 바로 시작하세요
          </h2>
          <p className="mb-8" style={{ color: "#6B7280" }}>
            무료로 가입하고 크리에이터 대시보드를 체험해보세요.
            <br />
            신용카드 없이 즉시 시작 가능합니다.
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
