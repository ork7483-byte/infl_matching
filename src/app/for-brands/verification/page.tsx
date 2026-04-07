import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const features = [
  {
    icon: "🕸️",
    title: "AQS 점수 (5축 레이더)",
    description:
      "참여율, 팔로워 품질, 콘텐츠 일관성, 오디언스 다양성, 성장 건전성 — 5가지 축으로 인플루언서를 입체적으로 평가합니다.",
  },
  {
    icon: "🤖",
    title: "가짜 팔로워 탐지",
    description:
      "머신러닝 모델이 비정상 계정 패턴, 봇 팔로워, 팔로워 구매 이력을 분석하여 실제 팬 베이스의 비율을 정확히 측정합니다.",
  },
  {
    icon: "💬",
    title: "참여율 분석",
    description:
      "단순 좋아요 수가 아닌, 댓글 품질·저장·공유 비율을 종합한 진성 참여율(TER)로 실제 영향력을 측정합니다.",
  },
  {
    icon: "👥",
    title: "오디언스 분석",
    description:
      "팔로워의 연령대, 성별, 지역, 관심사 분포를 분석하여 브랜드 타겟과의 적합도를 수치로 보여줍니다.",
  },
];

const aqsGrades = [
  {
    emoji: "🟢",
    grade: "매우 건강",
    range: "90 – 100",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.1)",
    border: "rgba(34,197,94,0.3)",
    description: "최상위 인플루언서. 가짜 팔로워가 거의 없고 오디언스 참여가 매우 활발합니다.",
  },
  {
    emoji: "🟡",
    grade: "양호",
    range: "70 – 89",
    color: "#eab308",
    bg: "rgba(234,179,8,0.1)",
    border: "rgba(234,179,8,0.3)",
    description: "신뢰할 수 있는 인플루언서. 일부 개선 여지가 있으나 전반적으로 건전합니다.",
  },
  {
    emoji: "🟠",
    grade: "주의",
    range: "50 – 69",
    color: "#f97316",
    bg: "rgba(249,115,22,0.1)",
    border: "rgba(249,115,22,0.3)",
    description: "협업 전 추가 검증이 필요합니다. 일부 지표에서 비정상 패턴이 감지됩니다.",
  },
  {
    emoji: "🔴",
    grade: "위험",
    range: "0 – 49",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.3)",
    description: "가짜 팔로워 비율이 높거나 참여 조작 의심. 광고비 낭비 위험이 큽니다.",
  },
];

export default function VerificationPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero */}
        <section className="pt-32 pb-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block bg-[#7c3aed]/20 text-[#a78bfa] text-sm font-medium px-4 py-2 rounded-full mb-6 border border-[#7c3aed]/30">
              인플루언서 검증
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-[#e4e4e7]">진짜 인플루언서를</span>
              <br />
              <span className="bg-gradient-to-r from-[#7c3aed] to-[#e94560] bg-clip-text text-transparent">
                찾아드립니다
              </span>
            </h1>
            <p className="text-[#a1a1aa] text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              팔로워 숫자에 속지 마세요. InfluSync의 AQS(Audience Quality Score)는 AI가
              5가지 축으로 인플루언서의 진짜 영향력을 수치화합니다.
            </p>
            <Link
              href="/signup?role=brand"
              className="inline-block bg-gradient-to-r from-[#7c3aed] to-[#e94560] text-white font-semibold px-8 py-4 rounded-xl text-lg hover:opacity-90 transition-opacity"
            >
              무료로 시작하기
            </Link>
          </div>
        </section>

        {/* Sub-features */}
        <section className="py-20 px-4 bg-[#1a1a2e]/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#e4e4e7] mb-4">
                4가지 검증 레이어
              </h2>
              <p className="text-[#a1a1aa] text-lg">
                단순 지표 하나가 아닌, 다차원 분석으로 인플루언서를 완전히 파악합니다.
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

        {/* AQS Grade Explanation */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-[#e4e4e7] mb-4">
                AQS 등급 기준
              </h2>
              <p className="text-[#a1a1aa] text-lg">
                0~100점 사이의 AQS 점수로 인플루언서 건전성을 한눈에 확인하세요.
              </p>
            </div>

            <div className="space-y-4">
              {aqsGrades.map((grade) => (
                <div
                  key={grade.grade}
                  className="flex items-start gap-6 rounded-2xl p-6 border"
                  style={{ background: grade.bg, borderColor: grade.border }}
                >
                  <div className="text-3xl mt-0.5">{grade.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-bold text-lg" style={{ color: grade.color }}>
                        {grade.grade}
                      </span>
                      <span
                        className="text-sm font-mono px-3 py-0.5 rounded-full border"
                        style={{
                          color: grade.color,
                          borderColor: grade.border,
                          background: grade.bg,
                        }}
                      >
                        {grade.range}점
                      </span>
                    </div>
                    <p className="text-[#a1a1aa] leading-relaxed">{grade.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Mock AQS radar chart placeholder */}
            <div className="mt-12 bg-[#1a1a2e] border border-[#2a2a3e] rounded-2xl p-8 text-center relative">
              <div className="absolute top-4 right-4 bg-[#0a0a0f]/80 border border-[#2a2a3e] rounded-lg px-3 py-1.5 text-[#a1a1aa] text-xs">
                AQS 레이더 차트 미리보기
              </div>
              <div className="text-[#e4e4e7] font-semibold mb-2">AQS 5축 레이더 차트</div>
              <div className="text-[#a1a1aa] text-sm mb-8">참여율 · 팔로워 품질 · 콘텐츠 일관성 · 오디언스 다양성 · 성장 건전성</div>

              {/* SVG mock radar */}
              <div className="flex justify-center">
                <svg width="240" height="240" viewBox="0 0 240 240">
                  {/* Background polygons */}
                  {[1, 0.75, 0.5, 0.25].map((scale, i) => (
                    <polygon
                      key={i}
                      points={[0, 72, 144, 216, 288].map((angle) => {
                        const rad = ((angle - 90) * Math.PI) / 180;
                        const r = 90 * scale;
                        return `${120 + r * Math.cos(rad)},${120 + r * Math.sin(rad)}`;
                      }).join(" ")}
                      fill="none"
                      stroke="#2a2a3e"
                      strokeWidth="1"
                    />
                  ))}
                  {/* Axis lines */}
                  {[0, 72, 144, 216, 288].map((angle, i) => {
                    const rad = ((angle - 90) * Math.PI) / 180;
                    return (
                      <line
                        key={i}
                        x1="120"
                        y1="120"
                        x2={120 + 90 * Math.cos(rad)}
                        y2={120 + 90 * Math.sin(rad)}
                        stroke="#2a2a3e"
                        strokeWidth="1"
                      />
                    );
                  })}
                  {/* Data polygon */}
                  <polygon
                    points={[
                      [0, 0.85],
                      [72, 0.78],
                      [144, 0.92],
                      [216, 0.70],
                      [288, 0.88],
                    ].map(([angle, value]) => {
                      const rad = ((angle - 90) * Math.PI) / 180;
                      const r = 90 * value;
                      return `${120 + r * Math.cos(rad)},${120 + r * Math.sin(rad)}`;
                    }).join(" ")}
                    fill="rgba(124,58,237,0.25)"
                    stroke="#7c3aed"
                    strokeWidth="2"
                  />
                  {/* Axis labels */}
                  {[
                    [0, "참여율"],
                    [72, "팔로워 품질"],
                    [144, "콘텐츠 일관성"],
                    [216, "오디언스 다양성"],
                    [288, "성장 건전성"],
                  ].map(([angle, label]) => {
                    const rad = (((angle as number) - 90) * Math.PI) / 180;
                    const r = 108;
                    return (
                      <text
                        key={label as string}
                        x={120 + r * Math.cos(rad)}
                        y={120 + r * Math.sin(rad)}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#a1a1aa"
                        fontSize="9"
                      >
                        {label as string}
                      </text>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-24 px-4 text-center bg-[#1a1a2e]/50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#e4e4e7] mb-6">
              검증된 인플루언서로만 캠페인하세요
            </h2>
            <p className="text-[#a1a1aa] text-lg mb-10">
              가짜 팔로워에 광고비를 낭비하지 마세요. 지금 무료로 검증을 시작하세요.
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
