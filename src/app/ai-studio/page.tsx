import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const comparisonRows = [
  { label: "비용", influencer: "500만~수천만원", ai: "월 2만원~" },
  { label: "제작 시간", influencer: "2~4주", ai: "3분 이내" },
  { label: "수정 횟수", influencer: "1~2회 제한", ai: "무제한" },
  { label: "A/B 테스트", influencer: "비용 2배+", ai: "즉시 생성" },
  { label: "초상권 문제", influencer: "별도 계약 필요", ai: "완전 자유" },
];

const contentTypes = [
  { icon: "📦", title: "제품 촬영", desc: "흰 배경부터 감각적인 라이프 씬까지" },
  { icon: "🌿", title: "라이프스타일", desc: "일상 속 자연스러운 제품 노출" },
  { icon: "👗", title: "패션 화보", desc: "AI 모델이 직접 착용한 룩북" },
  { icon: "💄", title: "뷰티", desc: "메이크업·스킨케어 클로즈업 비주얼" },
];

const aiModels = [
  { id: "sua", name: "수아", age: "20대", style: "캐주얼", img: 64 },
  { id: "hoeun", name: "하은", age: "20대", style: "스포티", img: 65 },
  { id: "jiu", name: "지유", age: "30대", style: "럭셔리", img: 66 },
  { id: "seoyeon", name: "서연", age: "20대", style: "내추럴", img: 67 },
];

const useCases = [
  { icon: "📱", title: "SNS 피드", desc: "인스타그램·틱톡 피드 최적화 비주얼" },
  { icon: "🛒", title: "쇼핑몰 이미지", desc: "상세 페이지·썸네일 콘텐츠 대량 생성" },
  { icon: "🔀", title: "A/B 테스트", desc: "다양한 스타일 즉시 비교·최적화" },
  { icon: "🎨", title: "광고 시안", desc: "캠페인 전 빠른 콘셉트 검증" },
];

const plans = [
  {
    name: "Free",
    price: "무료",
    count: "월 3건",
    features: ["기본 AI 모델 2종", "720p 해상도", "워터마크 포함"],
    cta: "무료로 시작",
    href: "/signup?role=brand",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₩29,000",
    count: "월 50건",
    features: ["AI 모델 12종 전체", "4K 해상도", "워터마크 없음", "상업적 이용 가능", "우선 처리"],
    cta: "Pro 시작하기",
    href: "/signup?role=brand&plan=pro",
    highlight: true,
  },
  {
    name: "추가 구매",
    price: "₩500",
    count: "건당",
    features: ["Pro 초과 시 사용", "동일 품질 보장", "즉시 충전"],
    cta: "크레딧 충전",
    href: "/ai-studio/my-content",
    highlight: false,
  },
];

export default function AIStudioPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="pt-32 pb-20 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block bg-[#7c3aed]/10 text-[#7c3aed] text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-[#7c3aed]/20">
              AI Studio ✨
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-[#111827]">
              브랜드에 딱 맞는{" "}
              <span className="bg-gradient-to-r from-[#7c3aed] to-[#a855f7] bg-clip-text text-transparent">
                AI 모델
              </span>
              로<br />콘텐츠를 즉시 제작하세요
            </h1>
            <p className="text-[#6B7280] text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              실제 인플루언서 없이도 전문 화보 수준의 마케팅 콘텐츠를 3분 안에.
              비용은 1/100, 속도는 100배.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/ai-studio/generate"
                className="block w-full sm:inline-block sm:w-auto text-center bg-[#7c3aed] text-white font-semibold px-8 py-4 rounded-xl text-lg hover:bg-[#6d28d9] transition-colors cursor-pointer"
              >
                ✨ 지금 바로 제작하기
              </Link>
              <Link
                href="/ai-studio/models"
                className="block w-full sm:inline-block sm:w-auto text-center bg-white text-[#7c3aed] border-2 border-[#7c3aed] font-semibold px-8 py-4 rounded-xl text-lg hover:bg-[#7c3aed]/5 transition-colors cursor-pointer"
              >
                AI 모델 둘러보기
              </Link>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-20 px-4 bg-[#F9FAFB]">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827] mb-4">
                실제 인플루언서 vs AI 모델
              </h2>
              <p className="text-[#6B7280] text-lg">왜 AI 모델인가? 숫자로 확인하세요.</p>
            </div>
            <div className="overflow-x-auto -mx-4 px-4">
              <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-sm min-w-[400px]">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E5E7EB]">
                      <th className="text-left px-4 sm:px-6 py-4 text-[#6B7280] font-medium text-sm">항목</th>
                      <th className="text-center px-4 sm:px-6 py-4 text-[#6B7280] font-medium text-sm">실제 인플루언서</th>
                      <th className="text-center px-4 sm:px-6 py-4 text-[#7c3aed] font-semibold bg-[#7c3aed]/5 text-sm">
                        AI 모델 ✨
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row, i) => (
                      <tr key={row.label} className={i < comparisonRows.length - 1 ? "border-b border-[#E5E7EB]" : ""}>
                        <td className="px-4 sm:px-6 py-4 text-[#374151] font-medium text-sm">{row.label}</td>
                        <td className="px-4 sm:px-6 py-4 text-center text-[#6B7280] text-sm">{row.influencer}</td>
                        <td className="px-4 sm:px-6 py-4 text-center text-[#7c3aed] font-semibold bg-[#7c3aed]/5 text-sm">
                          {row.ai}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Content Types */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827] mb-4">
                제작 가능한 콘텐츠 유형
              </h2>
              <p className="text-[#6B7280] text-lg">어떤 스타일이든 즉시 생성합니다.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {contentTypes.map((ct) => (
                <div
                  key={ct.title}
                  className="bg-white border border-[#E5E7EB] rounded-2xl p-6 text-center hover:border-[#7c3aed]/50 hover:shadow-md transition-all"
                >
                  <div className="text-4xl mb-4">{ct.icon}</div>
                  <h3 className="text-[#111827] font-semibold text-lg mb-2">{ct.title}</h3>
                  <p className="text-[#6B7280] text-sm">{ct.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular AI Models */}
        <section className="py-20 px-4 bg-[#F9FAFB]">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827] mb-4">
                인기 AI 모델
              </h2>
              <p className="text-[#6B7280] text-lg">브랜드 분위기에 맞는 모델을 선택하세요.</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {aiModels.map((model) => (
                <Link
                  key={model.id}
                  href={`/ai-studio/models/${model.id}`}
                  className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:border-[#7c3aed]/50 hover:shadow-md transition-all group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={`https://picsum.photos/seed/${model.img}/300/400`}
                      alt={model.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-[#7c3aed] text-white text-xs font-semibold px-2 py-1 rounded-full">
                      🤖 AI
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-[#111827] font-semibold text-base">{model.name}</h3>
                    <p className="text-[#6B7280] text-sm">
                      {model.age} · {model.style}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/ai-studio/models"
                className="text-[#7c3aed] font-semibold hover:underline"
              >
                전체 모델 보기 →
              </Link>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827] mb-4">
                어디에 활용하나요?
              </h2>
              <p className="text-[#6B7280] text-lg">다양한 마케팅 채널에 즉시 활용하세요.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {useCases.map((uc) => (
                <div
                  key={uc.title}
                  className="bg-[#F5F3FF] border border-[#7c3aed]/15 rounded-2xl p-6"
                >
                  <div className="text-3xl mb-3">{uc.icon}</div>
                  <h3 className="text-[#111827] font-semibold mb-2">{uc.title}</h3>
                  <p className="text-[#6B7280] text-sm">{uc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 px-4 bg-[#F9FAFB]">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827] mb-4">
                합리적인 요금제
              </h2>
              <p className="text-[#6B7280] text-lg">광고 한 번 촬영 비용으로 1년 내내 사용하세요.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-2xl p-8 flex flex-col ${
                    plan.highlight
                      ? "bg-[#7c3aed] text-white shadow-xl shadow-[#7c3aed]/30 scale-105"
                      : "bg-white border border-[#E5E7EB]"
                  }`}
                >
                  {plan.highlight && (
                    <div className="text-xs font-semibold bg-white/20 text-white px-3 py-1 rounded-full self-start mb-4">
                      인기
                    </div>
                  )}
                  <h3
                    className={`text-xl font-bold mb-1 ${plan.highlight ? "text-white" : "text-[#111827]"}`}
                  >
                    {plan.name}
                  </h3>
                  <div className={`text-3xl font-bold mb-1 ${plan.highlight ? "text-white" : "text-[#111827]"}`}>
                    {plan.price}
                  </div>
                  <div className={`text-sm mb-6 ${plan.highlight ? "text-white/80" : "text-[#6B7280]"}`}>
                    {plan.count}
                  </div>
                  <ul className="space-y-2 flex-1 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className={`text-sm flex items-center gap-2 ${plan.highlight ? "text-white/90" : "text-[#374151]"}`}>
                        <span className={plan.highlight ? "text-white" : "text-[#7c3aed]"}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.href}
                    className={`block text-center font-semibold py-3 rounded-xl transition-colors ${
                      plan.highlight
                        ? "bg-white text-[#7c3aed] hover:bg-white/90"
                        : "bg-[#7c3aed] text-white hover:bg-[#6d28d9]"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
