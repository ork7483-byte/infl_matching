import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-purple/5 to-transparent" />
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              인플루언서 마케팅의
              <br />
              <span className="text-gradient">새로운 기준</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              데이터 기반 인플루언서 분석, AI 성과 예측, 캠페인 자동 관리까지.
              InfluSync로 마케팅 효율을 극대화하세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup?role=brand"
                className="px-8 py-4 bg-gradient-to-r from-brand-purple to-brand-pink text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-lg shadow-glow"
              >
                브랜드로 시작하기
              </Link>
              <Link
                href="/signup?role=creator"
                className="px-8 py-4 bg-card border border-border text-foreground font-semibold rounded-lg hover:bg-card-hover transition-colors text-lg"
              >
                크리에이터로 시작하기
              </Link>
            </div>
          </div>
        </section>

        {/* Trust Metrics */}
        <section className="py-16 px-4 border-y border-border">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-gradient">5,000+</p>
              <p className="text-muted-foreground mt-2">등록 인플루언서</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-gradient">300+</p>
              <p className="text-muted-foreground mt-2">진행된 캠페인</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-gradient">150+</p>
              <p className="text-muted-foreground mt-2">파트너 브랜드</p>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              왜 <span className="text-gradient">InfluSync</span>인가요?
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              데이터로 검증하고, AI로 예측하고, 자동으로 관리하세요
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: "🔍",
                  title: "스마트 인플루언서 검색",
                  desc: "AQS 점수, 참여율, 오디언스 분석으로 진짜 인플루언서를 찾으세요.",
                },
                {
                  icon: "📊",
                  title: "실시간 캠페인 분석",
                  desc: "캠페인 성과를 실시간으로 트래킹하고 자동 리포트를 생성하세요.",
                },
                {
                  icon: "🤖",
                  title: "AI 성과 예측",
                  desc: "집행 전 예상 성과와 적정 광고비를 AI로 미리 확인하세요.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-2xl p-8 hover:border-brand-purple/30 transition-colors"
                >
                  <span className="text-4xl mb-4 block">{feature.icon}</span>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Two-Sided Value Prop */}
        <section className="py-20 px-4 bg-card/50">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* For Brands */}
            <div className="bg-card border border-border rounded-2xl p-8 hover:border-brand-purple/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-brand-purple/10 flex items-center justify-center mb-6">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">브랜드라면</h3>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-brand-purple mt-1">✓</span>
                  가짜 팔로워 걱정 없는 검증된 인플루언서 검색
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-purple mt-1">✓</span>
                  캠페인 성과 실시간 모니터링 & 자동 리포트
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-purple mt-1">✓</span>
                  AI로 예측하는 성과와 적정 광고비
                </li>
              </ul>
              <Link
                href="/for-brands"
                className="text-brand-purple font-semibold hover:underline"
              >
                자세히 알아보기 →
              </Link>
            </div>

            {/* For Creators */}
            <div className="bg-card border border-border rounded-2xl p-8 hover:border-brand-pink/30 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-brand-pink/10 flex items-center justify-center mb-6">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-2xl font-bold mb-4">크리에이터라면</h3>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-brand-pink mt-1">✓</span>
                  원클릭 미디어킷 자동 생성
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-pink mt-1">✓</span>
                  캠페인 마켓플레이스에서 직접 브랜드 찾기
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-brand-pink mt-1">✓</span>
                  성장 트래커로 내 계정 성장 분석
                </li>
              </ul>
              <Link
                href="/for-creators"
                className="text-brand-pink font-semibold hover:underline"
              >
                자세히 알아보기 →
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              자주 묻는 질문
            </h2>
            {[
              {
                q: "InfluSync는 무료인가요?",
                a: "네, 현재 모든 기능을 무료로 이용하실 수 있습니다. 회원가입만 하면 인플루언서 분석, 캠페인 관리, AI 예측 등 모든 기능을 사용할 수 있어요.",
              },
              {
                q: "어떤 플랫폼을 지원하나요?",
                a: "현재 Instagram을 지원하고 있으며, YouTube와 TikTok은 향후 추가 예정입니다.",
              },
              {
                q: "인플루언서 데이터는 어떻게 수집하나요?",
                a: "Instagram Graph API를 통해 공개 데이터를 수집하며, 인플루언서가 직접 OAuth를 연동하면 더 정확한 오디언스 데이터를 확인할 수 있습니다.",
              },
              {
                q: "AQS 점수는 무엇인가요?",
                a: "AQS(Audience Quality Score)는 참여 품질, 팔로워 성장 패턴, 댓글 진정성 등 5가지 축으로 오디언스 품질을 0~100점으로 평가하는 지표입니다.",
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group bg-card border border-border rounded-xl mb-3"
              >
                <summary className="flex justify-between items-center cursor-pointer p-5 font-semibold">
                  {faq.q}
                  <svg
                    className="w-5 h-5 text-muted transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <p className="px-5 pb-5 text-muted-foreground">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 px-4 bg-gradient-to-b from-brand-purple/5 to-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              지금 바로 시작하세요
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              무료 가입으로 모든 기능을 경험해보세요
            </p>
            <Link
              href="/signup"
              className="inline-block px-10 py-4 bg-gradient-to-r from-brand-purple to-brand-pink text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-lg shadow-glow"
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
