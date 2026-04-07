import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const features = [
  "인플루언서 검색 & 필터링",
  "프로필 분석 리포트",
  "오디언스 분석",
  "AQS 오디언스 품질 점수",
  "가짜 팔로워 탐지",
  "AI 성과 예측 & 광고단가",
  "캠페인 관리 & 트래킹",
  "PDF/Excel 리포트 생성",
  "미디어킷 자동 생성",
  "캠페인 마켓플레이스",
  "성장 트래커",
  "수익/정산 대시보드",
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              심플한 <span className="text-gradient">무료</span> 플랜
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              현재 모든 기능을 무료로 이용하실 수 있습니다.
              <br />
              회원가입만 하면 제한 없이 사용하세요.
            </p>
          </div>

          {/* Pricing Card */}
          <div className="max-w-lg mx-auto">
            <div className="bg-card border-2 border-brand-purple rounded-2xl p-8 relative overflow-hidden">
              {/* Glow effect */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-purple/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-brand-pink/20 rounded-full blur-3xl" />

              <div className="relative z-10">
                {/* Badge */}
                <div className="inline-block px-3 py-1 bg-brand-purple/10 border border-brand-purple/20 rounded-full text-brand-purple text-sm font-medium mb-6">
                  현재 플랜
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold">무료</span>
                </div>
                <p className="text-muted-foreground mb-8">
                  모든 기능, 제한 없이
                </p>

                {/* CTA */}
                <Link
                  href="/signup"
                  className="block w-full text-center px-6 py-4 bg-gradient-to-r from-brand-purple to-brand-pink text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-lg shadow-glow mb-8"
                >
                  무료로 시작하기
                </Link>

                {/* Feature List */}
                <div className="space-y-3">
                  {features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5 text-brand-purple flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Future Plans Note */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground">
              향후 프리미엄 기능이 추가될 예정입니다.
              <br />
              지금 가입하시면 출시 시 얼리버드 혜택을 드립니다.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
