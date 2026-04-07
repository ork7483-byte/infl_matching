import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-20 px-4">
        <article className="max-w-3xl mx-auto prose-sm">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-2">개인정보처리방침</h1>
          <p className="text-[#6B7280] text-sm mb-10">시행일: 2026년 4월 7일 | 최종 수정일: 2026년 4월 7일</p>

          <p className="text-[#374151] leading-relaxed mb-8">
            인플릭스(Inflix, 이하 &quot;회사&quot;)는 이용자의 개인정보를 중요시하며, 「개인정보 보호법」 및 관련 법령을 준수하고 있습니다. 본 개인정보처리방침은 회사가 제공하는 인플루언서 마케팅 분석 및 매칭 서비스(이하 &quot;서비스&quot;)에 적용됩니다.
          </p>

          {/* 1 */}
          <Section title="제1조 (수집하는 개인정보 항목)">
            <p>회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집합니다.</p>
            <h4 className="font-semibold text-[#111827] mt-4 mb-2">1. 필수 수집 항목</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>이메일 주소</li>
              <li>비밀번호 (암호화 저장)</li>
              <li>이름 (선택 입력 시)</li>
              <li>회원 유형 (브랜드 / 크리에이터)</li>
            </ul>
            <h4 className="font-semibold text-[#111827] mt-4 mb-2">2. 브랜드 회원 추가 수집 항목</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>회사명</li>
              <li>업종</li>
              <li>웹사이트 URL</li>
            </ul>
            <h4 className="font-semibold text-[#111827] mt-4 mb-2">3. 크리에이터 회원 추가 수집 항목</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Instagram 사용자명</li>
            </ul>
            <h4 className="font-semibold text-[#111827] mt-4 mb-2">4. Instagram OAuth 연동 시 수집 항목</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Instagram 프로필 정보 (사용자명, 프로필 사진, 자기소개)</li>
              <li>팔로워/팔로잉 수</li>
              <li>게시물 성과 데이터 (좋아요, 댓글, 도달, 노출 수)</li>
              <li>오디언스 인구통계 데이터 (성별, 연령, 지역)</li>
              <li>Instagram API 액세스 토큰 (암호화 저장)</li>
            </ul>
            <h4 className="font-semibold text-[#111827] mt-4 mb-2">5. 자동 수집 항목</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>서비스 이용 기록, 접속 로그, 접속 IP 정보</li>
              <li>쿠키 및 세션 정보</li>
            </ul>
          </Section>

          {/* 2 */}
          <Section title="제2조 (개인정보의 수집 및 이용 목적)">
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>회원 관리:</strong> 회원 가입, 본인 확인, 서비스 이용 자격 관리</li>
              <li><strong>서비스 제공:</strong> 인플루언서 분석 리포트 생성, 브랜드-크리에이터 매칭, 캠페인 성과 추적</li>
              <li><strong>AI 분석:</strong> AQS(오디언스 품질 점수) 산출, AI 성과 예측, 적정 광고단가 산출</li>
              <li><strong>서비스 개선:</strong> 서비스 이용 통계 분석, 신규 기능 개발</li>
              <li><strong>고객 지원:</strong> 문의 처리 및 불만 해결</li>
            </ul>
          </Section>

          {/* 3 */}
          <Section title="제3조 (개인정보의 보유 및 이용 기간)">
            <ul className="list-disc pl-5 space-y-2">
              <li>회원 개인정보: <strong>회원 탈퇴 시까지</strong> 보유 후 즉시 파기</li>
              <li>Instagram 연동 데이터: 연동 해제 시 즉시 삭제</li>
              <li>서비스 이용 기록: 3년 (전자상거래법)</li>
              <li>접속 로그: 3개월 (통신비밀보호법)</li>
            </ul>
          </Section>

          {/* 4 */}
          <Section title="제4조 (개인정보의 제3자 제공)">
            <p>
              회사는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만, 다음의 경우에는 예외로 합니다.
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령에 의하여 요구되는 경우</li>
            </ul>
          </Section>

          {/* 5 */}
          <Section title="제5조 (개인정보의 처리 위탁)">
            <table className="w-full text-sm border border-[#E5E7EB] mt-2">
              <thead>
                <tr className="bg-[#F9FAFB]">
                  <th className="border border-[#E5E7EB] px-3 py-2 text-left">수탁업체</th>
                  <th className="border border-[#E5E7EB] px-3 py-2 text-left">위탁 업무</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-[#E5E7EB] px-3 py-2">Vercel Inc.</td>
                  <td className="border border-[#E5E7EB] px-3 py-2">서비스 호스팅 및 배포</td>
                </tr>
                <tr>
                  <td className="border border-[#E5E7EB] px-3 py-2">Neon Inc.</td>
                  <td className="border border-[#E5E7EB] px-3 py-2">데이터베이스 관리</td>
                </tr>
                <tr>
                  <td className="border border-[#E5E7EB] px-3 py-2">Meta Platforms, Inc.</td>
                  <td className="border border-[#E5E7EB] px-3 py-2">Instagram Graph API를 통한 데이터 조회</td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* 6 */}
          <Section title="제6조 (개인정보의 파기 절차 및 방법)">
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>파기 절차:</strong> 보유 기간 경과 또는 처리 목적 달성 후 지체 없이 파기</li>
              <li><strong>파기 방법:</strong> 전자적 파일은 복구 불가능한 방법으로 삭제, 종이 문서는 분쇄 또는 소각</li>
            </ul>
          </Section>

          {/* 7 */}
          <Section title="제7조 (이용자의 권리 및 행사 방법)">
            <p>이용자는 다음의 권리를 행사할 수 있습니다.</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>개인정보 열람 요구</li>
              <li>오류 정정 요구</li>
              <li>삭제 요구</li>
              <li>처리 정지 요구</li>
              <li>회원 탈퇴</li>
            </ul>
            <p className="mt-2">권리 행사는 서비스 내 설정 또는 이메일(hun@inflix.com)로 요청하실 수 있습니다.</p>
          </Section>

          {/* 8 */}
          <Section title="제8조 (개인정보의 안전성 확보 조치)">
            <ul className="list-disc pl-5 space-y-1">
              <li>비밀번호 bcrypt 암호화 저장 (12라운드)</li>
              <li>SSL/TLS 암호화 통신</li>
              <li>액세스 토큰 암호화 저장</li>
              <li>접근 권한 관리 및 제한</li>
              <li>개인정보 접근 로그 기록</li>
            </ul>
          </Section>

          {/* 9 */}
          <Section title="제9조 (쿠키의 사용)">
            <p>
              회사는 로그인 세션 유지를 위해 쿠키를 사용합니다. 이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나, 이 경우 서비스 이용에 제한이 있을 수 있습니다.
            </p>
          </Section>

          {/* 10 */}
          <Section title="제10조 (개인정보 보호책임자)">
            <table className="w-full text-sm border border-[#E5E7EB] mt-2">
              <tbody>
                <tr>
                  <td className="border border-[#E5E7EB] px-3 py-2 bg-[#F9FAFB] font-medium w-32">성명</td>
                  <td className="border border-[#E5E7EB] px-3 py-2">이은결</td>
                </tr>
                <tr>
                  <td className="border border-[#E5E7EB] px-3 py-2 bg-[#F9FAFB] font-medium">직책</td>
                  <td className="border border-[#E5E7EB] px-3 py-2">개인정보 보호책임자</td>
                </tr>
                <tr>
                  <td className="border border-[#E5E7EB] px-3 py-2 bg-[#F9FAFB] font-medium">이메일</td>
                  <td className="border border-[#E5E7EB] px-3 py-2">hun@inflix.com</td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* 11 */}
          <Section title="제11조 (권익침해 구제방법)">
            <p>개인정보 침해로 인한 피해를 구제받기 위해 다음 기관에 상담 및 신고를 할 수 있습니다.</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>개인정보침해신고센터: privacy.kisa.or.kr / 118</li>
              <li>개인정보분쟁조정위원회: kopico.go.kr / 1833-6972</li>
              <li>대검찰청 사이버수사과: spo.go.kr / 1301</li>
              <li>경찰청 사이버수사국: ecrm.police.go.kr / 182</li>
            </ul>
          </Section>

          {/* 12 */}
          <Section title="제12조 (방침 변경)">
            <p>본 개인정보처리방침은 시행일로부터 적용되며, 변경 시 서비스 내 공지사항을 통해 고지합니다.</p>
          </Section>

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
