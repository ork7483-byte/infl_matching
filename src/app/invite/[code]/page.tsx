import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface Props {
  params: Promise<{ code: string }>;
}

const BENEFITS = [
  { icon: "🤖", title: "AI Muse 자동 생성", desc: "나를 닮은 AI 모델이 자동으로 수익을 만들어줘요." },
  { icon: "📊", title: "심층 참여율 분석", desc: "내 계정 ER·AQS·팔로워 추이를 한눈에 확인." },
  { icon: "💼", title: "브랜드 캠페인 매칭", desc: "딱 맞는 캠페인을 AI가 자동으로 추천해드려요." },
  { icon: "💰", title: "수익 정산 관리", desc: "캠페인 수익을 투명하게 정산 받으세요." },
];

export default async function InviteLandingPage({ params }: Props) {
  const { code } = await params;

  // In production this would fetch the inviter's username from DB.
  // For now we extract a friendly display from the code format INFLIX-XXXXXX.
  const isValidCode = /^INFLIX-[A-Z0-9]{6}$/i.test(code);
  const displayCode = isValidCode ? code.toUpperCase() : code;

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <Navbar />

      {/* Hero */}
      <section className="py-20 px-4 text-center bg-[#F9FAFB] border-b border-[#E5E7EB]">
        <div className="max-w-2xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6"
            style={{ backgroundColor: "#7c3aed15", color: "#7c3aed", border: "1px solid #7c3aed30" }}
          >
            🎁 특별 초대
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
            친구가 Inflix에 초대했어요!
          </h1>
          <p className="text-lg text-[#6B7280] mb-2">
            지금 가입하면 둘 다 AI Muse를 바로 생성할 수 있어요 🎁
          </p>
          <p className="text-sm text-[#9CA3AF] mb-8">
            초대 코드: <span className="font-mono font-semibold text-[#7c3aed]">{displayCode}</span>
          </p>

          <Link
            href={`/signup?ref=${encodeURIComponent(code)}`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#7c3aed] text-white font-semibold text-lg hover:bg-[#6d28d9] transition-colors shadow-lg shadow-[#7c3aed]/25"
          >
            무료로 시작하기 →
          </Link>
          <p className="text-xs text-[#9CA3AF] mt-3">신용카드 불필요 · 언제든 취소 가능</p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-[#111827] text-center mb-8">
            Inflix로 할 수 있는 것들
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BENEFITS.map((benefit) => (
              <div
                key={benefit.title}
                className="flex items-start gap-4 p-5 rounded-2xl border border-[#E5E7EB] bg-white hover:border-[#7c3aed]/30 hover:bg-[#7c3aed]/5 transition-all"
              >
                <div className="text-3xl flex-shrink-0">{benefit.icon}</div>
                <div>
                  <div className="font-semibold text-[#111827] mb-1">{benefit.title}</div>
                  <div className="text-sm text-[#6B7280]">{benefit.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 px-4 bg-[#F9FAFB] border-t border-[#E5E7EB]">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { value: "12,400+", label: "활성 크리에이터" },
              { value: "3,200+", label: "브랜드 파트너" },
              { value: "₩4.8억+", label: "지급된 캠페인 수익" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-[#7c3aed] mb-1">{stat.value}</div>
                <div className="text-sm text-[#6B7280]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border border-[#E5E7EB] p-6 bg-white text-center">
            <div className="flex justify-center gap-0.5 mb-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-[#374151] italic mb-4">
              &ldquo;Inflix AI Muse 덕분에 자는 동안에도 수익이 들어와요.
              브랜드 미팅에서 바로 공유 링크를 보내니 반응이 완전 달라졌어요!&rdquo;
            </p>
            <div className="text-sm font-medium text-[#374151]">@beauty_jinie</div>
            <div className="text-xs text-[#9CA3AF]">팔로워 23.4K · 뷰티 크리에이터</div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 bg-[#F9FAFB] border-t border-[#E5E7EB]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#111827] mb-3">
            지금 바로 시작하세요
          </h2>
          <p className="text-[#6B7280] mb-6">
            초대를 통해 가입하면 AI Muse를 바로 생성하고 수동 소득을 시작할 수 있어요.
          </p>
          <Link
            href={`/signup?ref=${encodeURIComponent(code)}`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#7c3aed] text-white font-semibold text-lg hover:bg-[#6d28d9] transition-colors"
          >
            무료로 시작하기 →
          </Link>
          <p className="text-xs text-[#9CA3AF] mt-3">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="text-[#7c3aed] hover:underline">
              로그인
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
