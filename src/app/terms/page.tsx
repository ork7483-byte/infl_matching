import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 px-4">
        <article className="max-w-3xl mx-auto prose-sm">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-2">서비스 이용약관</h1>
          <p className="text-[#6B7280] text-sm mb-10">시행일: 2026년 4월 7일 | 최종 수정일: 2026년 4월 7일</p>

          <Section title="제1조 (목적)">
            <p>
              본 약관은 인플릭스(Inflix, 이하 &quot;회사&quot;)가 제공하는 AI 기반 인플루언서 마케팅 분석 및 매칭 플랫폼 서비스(이하 &quot;서비스&quot;)의 이용 조건 및 절차, 회사와 회원 간의 권리, 의무 및 기타 필요한 사항을 규정함을 목적으로 합니다.
            </p>
          </Section>

          <Section title="제2조 (정의)">
            <ol className="list-decimal pl-5 space-y-2">
              <li><strong>&quot;서비스&quot;</strong>란 회사가 제공하는 인플루언서 검색, 프로필 분석, 오디언스 분석, AQS 점수, AI 성과 예측, 캠페인 관리, 미디어킷 생성, 갤러리 등 일체의 서비스를 말합니다.</li>
              <li><strong>&quot;회원&quot;</strong>이란 본 약관에 동의하고 회원가입을 완료한 자로서, 브랜드 회원과 크리에이터 회원으로 구분됩니다.</li>
              <li><strong>&quot;브랜드 회원&quot;</strong>이란 인플루언서 검색, 캠페인 관리 등의 목적으로 서비스를 이용하는 회원을 말합니다.</li>
              <li><strong>&quot;크리에이터 회원&quot;</strong>이란 자신의 인플루언서 프로필을 관리하고 브랜드와 매칭되는 목적으로 서비스를 이용하는 회원을 말합니다.</li>
              <li><strong>&quot;콘텐츠&quot;</strong>란 서비스에서 생성, 수집, 분석, 표시되는 일체의 데이터 및 자료를 말합니다.</li>
            </ol>
          </Section>

          <Section title="제3조 (약관의 효력 및 변경)">
            <ol className="list-decimal pl-5 space-y-2">
              <li>본 약관은 서비스 화면에 게시하거나 기타의 방법으로 회원에게 공지함으로써 효력이 발생합니다.</li>
              <li>회사는 관련 법령에 위배되지 않는 범위에서 약관을 변경할 수 있으며, 변경 시 적용일자 7일 전부터 서비스 내 공지합니다.</li>
              <li>회원이 변경된 약관에 동의하지 않는 경우, 서비스 이용을 중단하고 회원 탈퇴를 할 수 있습니다.</li>
            </ol>
          </Section>

          <Section title="제4조 (회원가입)">
            <ol className="list-decimal pl-5 space-y-2">
              <li>회원가입은 이용자가 약관에 동의하고, 회사가 정한 가입 양식에 따라 정보를 기입한 후 &quot;가입&quot; 버튼을 클릭하여 신청합니다.</li>
              <li>회사는 다음 각 호에 해당하는 경우 회원가입을 거절하거나 사후에 이용계약을 해지할 수 있습니다.
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>타인의 정보를 도용한 경우</li>
                  <li>허위 정보를 기재한 경우</li>
                  <li>이전에 약관 위반으로 이용이 제한된 경우</li>
                </ul>
              </li>
              <li>회원은 가입 시 선택한 회원 유형(브랜드/크리에이터)에 따라 이용 가능한 서비스가 달라질 수 있습니다.</li>
            </ol>
          </Section>

          <Section title="제5조 (서비스의 내용)">
            <p>회사가 제공하는 서비스는 다음과 같습니다.</p>
            <h4 className="font-semibold text-[#111827] mt-3 mb-2">브랜드 회원 대상</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>인플루언서 검색 및 필터링</li>
              <li>프로필 분석 리포트 (참여율, AQS 점수, 가짜 팔로워 탐지)</li>
              <li>오디언스 분석 (성별, 연령, 지역 분포)</li>
              <li>AI 성과 예측 및 적정 광고단가 산출</li>
              <li>캠페인 생성, 관리, 성과 추적</li>
              <li>PDF/Excel 리포트 자동 생성</li>
            </ul>
            <h4 className="font-semibold text-[#111827] mt-3 mb-2">크리에이터 회원 대상</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>미디어킷 자동 생성</li>
              <li>캠페인 마켓플레이스 탐색 및 지원</li>
              <li>성장 트래커 (팔로워/참여율 추이 분석)</li>
              <li>수익 및 정산 관리</li>
              <li>포트폴리오 갤러리</li>
            </ul>
          </Section>

          <Section title="제6조 (서비스의 변경 및 중단)">
            <ol className="list-decimal pl-5 space-y-2">
              <li>회사는 서비스의 내용, 운영상 또는 기술상의 필요에 따라 서비스를 변경할 수 있습니다.</li>
              <li>회사는 다음 각 호에 해당하는 경우 서비스를 일시적으로 중단할 수 있습니다.
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>시스템 유지보수, 점검, 교체</li>
                  <li>천재지변, 국가비상사태 등 불가항력적인 사유</li>
                  <li>Instagram Graph API 등 외부 서비스의 장애</li>
                </ul>
              </li>
            </ol>
          </Section>

          <Section title="제7조 (요금 정책)">
            <ol className="list-decimal pl-5 space-y-2">
              <li>크리에이터 회원의 서비스 이용은 영구 무료입니다.</li>
              <li>브랜드 회원의 서비스는 Free, Pro, Enterprise 플랜으로 구분되며, 현재 얼리 액세스 기간 중에는 Pro 기능을 포함한 전체 서비스를 무료로 제공합니다.</li>
              <li>유료 전환 시 최소 30일 전에 이메일 및 서비스 내 공지를 통해 안내합니다.</li>
              <li>요금 정책의 상세 내용은 <Link href="/pricing" className="text-[#7c3aed] hover:underline">요금제 페이지</Link>에서 확인할 수 있습니다.</li>
            </ol>
          </Section>

          <Section title="제8조 (회원의 의무)">
            <p>회원은 다음 행위를 하여서는 안 됩니다.</p>
            <ol className="list-decimal pl-5 space-y-1 mt-2">
              <li>타인의 정보를 도용하거나 허위 정보를 등록하는 행위</li>
              <li>서비스를 이용하여 얻은 정보를 회사의 사전 동의 없이 상업적으로 이용하는 행위</li>
              <li>회사 또는 제3자의 지적재산권을 침해하는 행위</li>
              <li>서비스의 운영을 방해하거나, 서비스에 대한 비정상적인 접근(크롤링, 스크래핑 등)을 시도하는 행위</li>
              <li>다른 회원의 개인정보를 수집, 저장, 공개하는 행위</li>
              <li>인플루언서 분석 데이터를 악의적으로 왜곡하거나 허위 리포트를 생성하는 행위</li>
              <li>서비스를 통해 음란, 폭력, 혐오, 차별적 콘텐츠를 유통하는 행위</li>
              <li>기타 관련 법령에 위반되는 행위</li>
            </ol>
          </Section>

          <Section title="제9조 (회사의 의무)">
            <ol className="list-decimal pl-5 space-y-2">
              <li>회사는 관련 법령과 본 약관이 정하는 바에 따라 지속적이고 안정적인 서비스를 제공하기 위해 최선을 다합니다.</li>
              <li>회사는 회원의 개인정보를 보호하기 위해 개인정보처리방침에 따라 적절한 보호 조치를 취합니다.</li>
              <li>회사는 서비스 이용과 관련한 회원의 불만 또는 피해구제 요청을 적절하게 처리합니다.</li>
            </ol>
          </Section>

          <Section title="제10조 (지적재산권)">
            <ol className="list-decimal pl-5 space-y-2">
              <li>서비스에서 생성되는 분석 리포트, AQS 점수, AI 예측 결과 등의 저작권은 회사에 귀속됩니다.</li>
              <li>회원이 서비스에 등록한 콘텐츠에 대한 저작권은 해당 회원에게 귀속됩니다.</li>
              <li>회원은 서비스를 통해 얻은 데이터를 개인적, 비상업적 용도로만 사용할 수 있으며, 별도의 라이선스 없이 재배포할 수 없습니다.</li>
            </ol>
          </Section>

          <Section title="제11조 (책임 제한)">
            <ol className="list-decimal pl-5 space-y-2">
              <li>회사는 Instagram Graph API 등 제3자 서비스의 장애로 인한 데이터 부정확성에 대해 보증하지 않습니다.</li>
              <li>회사가 제공하는 AI 성과 예측, AQS 점수, 적정 광고단가 등은 참고용 데이터이며, 이를 기반으로 한 비즈니스 결정에 대한 책임은 회원에게 있습니다.</li>
              <li>회사는 무료로 제공하는 서비스에 대하여 관련 법령에 특별한 규정이 없는 한 책임을 지지 않습니다.</li>
              <li>회사는 회원 상호 간 또는 회원과 제3자 간에 서비스를 매개로 발생한 분쟁에 대해 개입할 의무가 없으며, 이에 대한 손해를 배상할 책임이 없습니다.</li>
            </ol>
          </Section>

          <Section title="제12조 (회원 탈퇴 및 이용 제한)">
            <ol className="list-decimal pl-5 space-y-2">
              <li>회원은 언제든지 서비스 내 설정 또는 이메일(hun@inflix.com)을 통해 탈퇴를 요청할 수 있습니다.</li>
              <li>회사는 회원이 본 약관을 위반한 경우, 사전 통지 없이 서비스 이용을 제한하거나 이용계약을 해지할 수 있습니다.</li>
              <li>탈퇴 시 회원의 개인정보는 개인정보처리방침에 따라 처리됩니다.</li>
            </ol>
          </Section>

          <Section title="제13조 (손해배상)">
            <ol className="list-decimal pl-5 space-y-2">
              <li>회사 또는 회원이 본 약관을 위반하여 상대방에게 손해를 입힌 경우, 손해를 입힌 당사자는 상대방의 손해를 배상할 책임이 있습니다.</li>
              <li>다만, 회사의 고의 또는 중대한 과실이 없는 경우 책임이 제한될 수 있습니다.</li>
            </ol>
          </Section>

          <Section title="제14조 (분쟁 해결)">
            <ol className="list-decimal pl-5 space-y-2">
              <li>본 약관과 관련한 분쟁은 대한민국 법률을 준거법으로 합니다.</li>
              <li>서비스 이용과 관련하여 발생한 분쟁에 대해 소송이 제기되는 경우, 회사의 소재지를 관할하는 법원을 전속 관할법원으로 합니다.</li>
            </ol>
          </Section>

          <Section title="제15조 (기타)">
            <ol className="list-decimal pl-5 space-y-2">
              <li>본 약관에서 정하지 않은 사항은 관련 법령 및 상관례에 따릅니다.</li>
              <li>본 약관의 일부 조항이 무효가 되더라도 나머지 조항의 효력에는 영향을 미치지 않습니다.</li>
            </ol>
          </Section>

          <div className="mt-8 p-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-sm text-[#6B7280]">
            <p><strong>부칙</strong></p>
            <p className="mt-1">본 약관은 2026년 4월 7일부터 시행합니다.</p>
          </div>

          <div className="mt-12 pt-8 border-t border-[#E5E7EB] text-center">
            <Link href="/" className="text-[#7c3aed] hover:underline cursor-pointer">홈으로 돌아가기</Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-bold text-[#111827] mb-3 pb-2 border-b border-[#E5E7EB]">{title}</h2>
      <div className="text-[#374151] leading-relaxed space-y-2">{children}</div>
    </section>
  );
}
