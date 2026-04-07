import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ── Mock data (in production this would be fetched by slug) ───────────────

const MOCK_BRAND = {
  name: "LuxSkin",
  logo: null as string | null,
  title: "LuxSkin 앰배서더 모집",
  description:
    "뷰티 & 스킨케어를 사랑하는 인플루언서를 모집합니다. 함께 성장하며 브랜드의 얼굴이 되어주세요! LuxSkin은 자연 성분 기반의 프리미엄 스킨케어 브랜드로, 진정성 있는 리뷰와 일상적인 스킨케어 루틴을 공유해주실 앰배서더를 찾고 있습니다.",
  requirements: [
    "인스타그램 팔로워 5,000명 이상",
    "뷰티/스킨케어 관련 콘텐츠 비중 50% 이상",
    "월 2회 이상 콘텐츠 게시 가능",
    "진정성 있는 리뷰 작성 가능",
    "브랜드 가이드라인 준수",
  ],
  benefits: [
    "월 제품 지원 (₩150,000 상당)",
    "독점 할인 코드 제공 (15% 커미션)",
    "브랜드 공식 채널 리포스팅",
    "분기별 앰배서더 미팅 초대",
    "우선 신제품 체험 기회",
  ],
};

// ── Check icon ────────────────────────────────────────────────────────────

function CheckCircle() {
  return (
    <svg className="w-5 h-5 text-[#7c3aed] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

// ── Application Form (client island via inline script trick is not needed;
//    we'll mark the parent as a server component and inline a simple form
//    that uses native browser submission or shows success via a URL param) ──
//
// Since the spec says "server component, Submit → success message", we show
// a success banner when ?submitted=1 is present in the URL.

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ submitted?: string }>;
}

export default async function AmbassadorPublicPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { submitted } = await searchParams;
  const brand = MOCK_BRAND; // In production: fetch by slug
  const isSubmitted = submitted === "1";

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-20" style={{ backgroundColor: "#F9FAFB" }}>
        {/* ── Brand Hero ── */}
        <section
          className="py-14 px-4 text-center"
          style={{ backgroundImage: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #e94560 100%)" }}
        >
          {/* Logo placeholder */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-white shadow-lg"
            style={{ backgroundColor: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}
          >
            {brand.name[0]}
          </div>
          <p className="text-white/80 text-sm font-medium uppercase tracking-widest mb-2">{brand.name}</p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 max-w-2xl mx-auto">
            {brand.title}
          </h1>
          <p className="text-white/80 text-base max-w-xl mx-auto leading-relaxed">
            {brand.description}
          </p>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* ── Left: Requirements + Benefits ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Requirements */}
            <div className="rounded-xl p-6" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}>
              <h2 className="text-base font-semibold text-[#111827] mb-4 flex items-center gap-2">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: "#7c3aed" }}
                >
                  ✓
                </span>
                지원 자격
              </h2>
              <ul className="space-y-3">
                {brand.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle />
                    <span className="text-sm text-[#374151]">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div
              className="rounded-xl p-6"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}
            >
              <h2 className="text-base font-semibold text-[#111827] mb-4 flex items-center gap-2">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundImage: "linear-gradient(to right, #7c3aed, #e94560)" }}
                >
                  ★
                </span>
                앰배서더 혜택
              </h2>
              <ul className="space-y-3">
                {brand.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <svg className="w-5 h-5 text-[#e94560] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-[#374151]">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Right: Application Form ── */}
          <div className="lg:col-span-3">
            <div className="rounded-xl p-6 sticky top-24" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}>
              {isSubmitted ? (
                /* Success state */
                <div className="text-center py-10">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: "#D1FAE5" }}
                  >
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#111827] mb-2">지원 완료!</h3>
                  <p className="text-[#6B7280] text-sm mb-6 leading-relaxed">
                    지원해 주셔서 감사합니다.<br />
                    브랜드 담당자가 검토 후 이메일로 연락드립니다.
                  </p>
                  <Link
                    href={`/ambassador/${slug}`}
                    className="text-[#7c3aed] text-sm font-medium hover:underline"
                  >
                    페이지로 돌아가기
                  </Link>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-semibold text-[#111827] mb-5">앰배서더 지원하기</h2>

                  <form
                    method="GET"
                    action={`/ambassador/${slug}`}
                    className="space-y-4"
                  >
                    <input type="hidden" name="submitted" value="1" />

                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-1">
                        인스타그램 아이디 *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] text-sm">@</span>
                        <input
                          required
                          name="username"
                          type="text"
                          placeholder="your_instagram"
                          className="w-full pl-7 pr-3 py-2.5 rounded-lg text-sm text-[#111827] outline-none focus:ring-2 focus:ring-[#7c3aed]/30"
                          style={{ border: "1px solid #E5E7EB", backgroundColor: "#F9FAFB" }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-1">이름 *</label>
                      <input
                        required
                        name="name"
                        type="text"
                        placeholder="홍길동"
                        className="w-full px-3 py-2.5 rounded-lg text-sm text-[#111827] outline-none focus:ring-2 focus:ring-[#7c3aed]/30"
                        style={{ border: "1px solid #E5E7EB", backgroundColor: "#F9FAFB" }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-1">이메일 *</label>
                      <input
                        required
                        name="email"
                        type="email"
                        placeholder="you@email.com"
                        className="w-full px-3 py-2.5 rounded-lg text-sm text-[#111827] outline-none focus:ring-2 focus:ring-[#7c3aed]/30"
                        style={{ border: "1px solid #E5E7EB", backgroundColor: "#F9FAFB" }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#374151] mb-1">자기소개 *</label>
                      <textarea
                        required
                        name="message"
                        rows={4}
                        placeholder="지원 동기와 본인을 소개해주세요."
                        className="w-full px-3 py-2.5 rounded-lg text-sm text-[#111827] outline-none focus:ring-2 focus:ring-[#7c3aed]/30 resize-none"
                        style={{ border: "1px solid #E5E7EB", backgroundColor: "#F9FAFB" }}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
                      style={{ backgroundImage: "linear-gradient(to right, #7c3aed, #e94560)" }}
                    >
                      지원서 제출하기
                    </button>

                    <p className="text-xs text-center text-[#9CA3AF]">
                      제출 시{" "}
                      <Link href="/privacy" className="underline hover:text-[#6B7280]">
                        개인정보 처리방침
                      </Link>
                      에 동의하게 됩니다.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
