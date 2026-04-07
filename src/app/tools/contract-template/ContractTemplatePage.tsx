"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface ContractForm {
  // 갑 (브랜드)
  brandCompanyName: string;
  brandCeo: string;
  brandBusinessNumber: string;
  brandAddress: string;
  // 을 (인플루언서)
  creatorName: string;
  creatorContact: string;
  creatorInstagramId: string;
  // 계약 내용
  contentType: string;
  platform: string;
  postCount: string;
  // 광고 표시
  includeAdDisclosure: boolean;
  // 콘텐츠 사용권
  usageRightsPeriod: string;
  usageRightsScope: string;
  // 보상
  paymentAmount: string;
  paymentTiming: string;
  paymentMethod: string;
  // 계약 기간
  contractStartDate: string;
  contractEndDate: string;
  // 특약
  specialTerms: string;
}

const CONTENT_TYPE_OPTIONS = ["피드 게시물", "릴스", "스토리", "라이브", "유튜브 영상", "틱톡"];
const PLATFORM_OPTIONS = ["Instagram", "YouTube", "TikTok", "블로그", "복수 플랫폼"];
const USAGE_SCOPE_OPTIONS = ["SNS 채널만", "2차 매체 포함 (광고, 웹사이트 등)", "오프라인 포함 전 매체"];
const PAYMENT_METHOD_OPTIONS = ["계좌이체", "현금", "수표"];
const PAYMENT_TIMING_OPTIONS = [
  "콘텐츠 게시 후 7일 이내",
  "콘텐츠 게시 후 14일 이내",
  "콘텐츠 게시 후 30일 이내",
  "계약 체결 후 선지급",
  "분할 지급 (계약 시 50%, 게시 후 50%)",
];

const FAQ_ITEMS = [
  {
    q: "인플루언서 계약서에 반드시 포함해야 하는 내용은?",
    a: "광고 표시 의무(공정거래위원회 지침), 콘텐츠 사용권 범위와 기간, 보상 조건 및 지급 시기, 수정 요청 횟수, 독점 조항 여부, 계약 해지 조건 등이 핵심 항목입니다.",
  },
  {
    q: "광고 표시 의무란 무엇인가요?",
    a: "공정거래위원회 추천·보증 등에 관한 표시·광고 심사지침에 따라, 경제적 대가를 받고 제작한 콘텐츠에는 '#광고', '#유료광고', '#협찬' 등의 표시를 명확히 해야 합니다.",
  },
  {
    q: "콘텐츠 사용권이란?",
    a: "브랜드가 인플루언서의 콘텐츠를 어느 범위까지, 얼마 기간 동안 활용할 수 있는지를 정하는 권리입니다. SNS 재공유만 허용할지, 광고 소재로 활용할지 등을 미리 명확히 합니다.",
  },
  {
    q: "이 계약서 양식은 법적 효력이 있나요?",
    a: "본 양식은 참고용이며, 법적 효력을 보장하지 않습니다. 실제 계약 체결 시에는 양측이 서명한 원본 문서가 필요하며, 중요한 계약은 반드시 법률 전문가의 검토를 받으시기 바랍니다.",
  },
];

export default function ContractTemplatePage() {
  const [form, setForm] = useState<ContractForm>({
    brandCompanyName: "",
    brandCeo: "",
    brandBusinessNumber: "",
    brandAddress: "",
    creatorName: "",
    creatorContact: "",
    creatorInstagramId: "",
    contentType: "",
    platform: "",
    postCount: "",
    includeAdDisclosure: true,
    usageRightsPeriod: "",
    usageRightsScope: "",
    paymentAmount: "",
    paymentTiming: "",
    paymentMethod: "",
    contractStartDate: "",
    contractEndDate: "",
    specialTerms: "",
  });

  const handlePrint = () => {
    window.print();
  };

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-white border-b border-gray-200 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-sm font-medium mb-4">
              무료 도구
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              인플루언서 계약서 템플릿
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              인플루언서 협업 계약서 한국어 양식을 무료로 작성하세요. 광고 표시
              의무, 콘텐츠 사용권, 보상 조건 등을 포함합니다.
            </p>
          </div>
        </section>

        {/* Disclaimer Banner */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 print:hidden">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex gap-3">
            <svg
              className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-sm text-amber-700">
              <strong>면책 문구:</strong> 본 양식은 참고용이며 법적 효력을
              보장하지 않습니다. 중요한 계약은 법률 전문가의 검토를 받으세요.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:px-0 print:py-0 print:max-w-none">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:grid-cols-1">
            {/* Form */}
            <div className="print:hidden space-y-5">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
                <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">
                  갑 (브랜드/회사) 정보
                </h2>
                <Field
                  label="상호명"
                  value={form.brandCompanyName}
                  placeholder="예: 글로우업 코스메틱 주식회사"
                  onChange={(v) => setForm((p) => ({ ...p, brandCompanyName: v }))}
                />
                <Field
                  label="대표자"
                  value={form.brandCeo}
                  placeholder="예: 홍길동"
                  onChange={(v) => setForm((p) => ({ ...p, brandCeo: v }))}
                />
                <Field
                  label="사업자등록번호"
                  value={form.brandBusinessNumber}
                  placeholder="예: 123-45-67890"
                  onChange={(v) => setForm((p) => ({ ...p, brandBusinessNumber: v }))}
                />
                <Field
                  label="주소"
                  value={form.brandAddress}
                  placeholder="예: 서울특별시 강남구 테헤란로 123"
                  onChange={(v) => setForm((p) => ({ ...p, brandAddress: v }))}
                />
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
                <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">
                  을 (인플루언서) 정보
                </h2>
                <Field
                  label="성명"
                  value={form.creatorName}
                  placeholder="예: 김지수"
                  onChange={(v) => setForm((p) => ({ ...p, creatorName: v }))}
                />
                <Field
                  label="연락처"
                  value={form.creatorContact}
                  placeholder="예: 010-1234-5678"
                  onChange={(v) => setForm((p) => ({ ...p, creatorContact: v }))}
                />
                <Field
                  label="Instagram ID"
                  value={form.creatorInstagramId}
                  placeholder="예: @beauty_jisoo"
                  onChange={(v) => setForm((p) => ({ ...p, creatorInstagramId: v }))}
                />
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
                <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">
                  계약 내용
                </h2>
                <SelectField
                  label="콘텐츠 유형"
                  value={form.contentType}
                  options={CONTENT_TYPE_OPTIONS}
                  onChange={(v) => setForm((p) => ({ ...p, contentType: v }))}
                />
                <SelectField
                  label="게시 플랫폼"
                  value={form.platform}
                  options={PLATFORM_OPTIONS}
                  onChange={(v) => setForm((p) => ({ ...p, platform: v }))}
                />
                <Field
                  label="게시물 수량"
                  value={form.postCount}
                  placeholder="예: 피드 1건, 스토리 3건"
                  onChange={(v) => setForm((p) => ({ ...p, postCount: v }))}
                />

                {/* 광고 표시 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    광고 표시
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.includeAdDisclosure}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          includeAdDisclosure: e.target.checked,
                        }))
                      }
                      className="mt-0.5 w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">
                      &ldquo;본 게시물은 유료 광고를 포함합니다&rdquo; 문구 포함
                      (공정위 지침 준수)
                    </span>
                  </label>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
                <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">
                  콘텐츠 사용권
                </h2>
                <Field
                  label="사용 기간"
                  value={form.usageRightsPeriod}
                  placeholder="예: 게시일로부터 1년"
                  onChange={(v) => setForm((p) => ({ ...p, usageRightsPeriod: v }))}
                />
                <SelectField
                  label="사용 범위"
                  value={form.usageRightsScope}
                  options={USAGE_SCOPE_OPTIONS}
                  onChange={(v) => setForm((p) => ({ ...p, usageRightsScope: v }))}
                />
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
                <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">
                  보상
                </h2>
                <Field
                  label="보상 금액"
                  value={form.paymentAmount}
                  placeholder="예: 500,000원 (VAT 별도)"
                  onChange={(v) => setForm((p) => ({ ...p, paymentAmount: v }))}
                />
                <SelectField
                  label="지급 시기"
                  value={form.paymentTiming}
                  options={PAYMENT_TIMING_OPTIONS}
                  onChange={(v) => setForm((p) => ({ ...p, paymentTiming: v }))}
                />
                <SelectField
                  label="지급 방법"
                  value={form.paymentMethod}
                  options={PAYMENT_METHOD_OPTIONS}
                  onChange={(v) => setForm((p) => ({ ...p, paymentMethod: v }))}
                />
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
                <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">
                  계약 기간 및 특약
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    계약 기간
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        시작일
                      </label>
                      <input
                        type="date"
                        value={form.contractStartDate}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            contractStartDate: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        종료일
                      </label>
                      <input
                        type="date"
                        value={form.contractEndDate}
                        onChange={(e) =>
                          setForm((p) => ({
                            ...p,
                            contractEndDate: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    특약 사항
                  </label>
                  <textarea
                    value={form.specialTerms}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, specialTerms: e.target.value }))
                    }
                    placeholder="예: 경쟁사 제품 광고 6개월 금지, 콘텐츠 수정 요청 최대 2회"
                    rows={4}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div>
              <div
                id="contract-preview"
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 print:shadow-none print:border-0 print:rounded-none"
              >
                <div className="text-center mb-6 pb-4 border-b border-gray-300">
                  <h2 className="text-xl font-bold text-gray-900">
                    인플루언서 협업 계약서
                  </h2>
                  <p className="text-xs text-gray-400 mt-1">
                    작성일: {today}
                  </p>
                </div>

                <div className="space-y-5 text-sm">
                  <ContractSection title="제1조 (당사자)">
                    <ContractParagraph>
                      <strong>갑 (브랜드/회사):</strong>{" "}
                      {form.brandCompanyName || "_______________"} (대표:{" "}
                      {form.brandCeo || "_______________"})
                    </ContractParagraph>
                    <ContractParagraph>
                      사업자등록번호: {form.brandBusinessNumber || "___-__-_____"}
                    </ContractParagraph>
                    <ContractParagraph>
                      주소: {form.brandAddress || "___________________________"}
                    </ContractParagraph>
                    <ContractParagraph className="mt-3">
                      <strong>을 (인플루언서):</strong>{" "}
                      {form.creatorName || "_______________"} (연락처:{" "}
                      {form.creatorContact || "010-____-____"})
                    </ContractParagraph>
                    <ContractParagraph>
                      Instagram ID:{" "}
                      {form.creatorInstagramId || "@_______________"}
                    </ContractParagraph>
                  </ContractSection>

                  <ContractSection title="제2조 (계약 내용)">
                    <ContractParagraph>
                      콘텐츠 유형: {form.contentType || "_______________"}
                    </ContractParagraph>
                    <ContractParagraph>
                      게시 플랫폼: {form.platform || "_______________"}
                    </ContractParagraph>
                    <ContractParagraph>
                      게시물 수량: {form.postCount || "_______________"}
                    </ContractParagraph>
                  </ContractSection>

                  <ContractSection title="제3조 (광고 표시 의무)">
                    <ContractParagraph>
                      을은 공정거래위원회 추천·보증 등에 관한 표시·광고
                      심사지침에 따라 모든 게시물에{" "}
                      {form.includeAdDisclosure
                        ? '"본 게시물은 유료 광고를 포함합니다" 또는 이에 준하는 문구를'
                        : "적절한 광고 표시 문구를"}{" "}
                      명시하여야 합니다.
                    </ContractParagraph>
                  </ContractSection>

                  <ContractSection title="제4조 (콘텐츠 사용권)">
                    <ContractParagraph>
                      갑은 을이 제작한 콘텐츠를 계약 기간 내{" "}
                      {form.usageRightsPeriod || "_______________"} 동안,{" "}
                      {form.usageRightsScope || "_______________"} 범위 내에서
                      활용할 수 있습니다.
                    </ContractParagraph>
                  </ContractSection>

                  <ContractSection title="제5조 (보상)">
                    <ContractParagraph>
                      갑은 을에게 {form.paymentAmount || "_______________"}을
                      지급합니다.
                    </ContractParagraph>
                    <ContractParagraph>
                      지급 시기: {form.paymentTiming || "_______________"}
                    </ContractParagraph>
                    <ContractParagraph>
                      지급 방법: {form.paymentMethod || "_______________"}
                    </ContractParagraph>
                  </ContractSection>

                  <ContractSection title="제6조 (계약 기간)">
                    <ContractParagraph>
                      {form.contractStartDate || "____년 __월 __일"} 부터{" "}
                      {form.contractEndDate || "____년 __월 __일"} 까지
                    </ContractParagraph>
                  </ContractSection>

                  {form.specialTerms && (
                    <ContractSection title="제7조 (특약 사항)">
                      <ContractParagraph className="whitespace-pre-wrap">
                        {form.specialTerms}
                      </ContractParagraph>
                    </ContractSection>
                  )}

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-center text-gray-700 mb-6 text-sm">
                      위 계약의 내용을 확인하고 이에 동의하여 서명합니다.
                    </p>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="text-center">
                        <p className="font-medium text-gray-700 mb-1">갑 (브랜드)</p>
                        <p className="text-gray-500 text-xs mb-8">
                          {form.brandCompanyName || "_______________"}
                        </p>
                        <div className="border-b border-gray-400 pt-8">
                          <p className="text-xs text-gray-400">서명</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-700 mb-1">을 (인플루언서)</p>
                        <p className="text-gray-500 text-xs mb-8">
                          {form.creatorName || "_______________"}
                        </p>
                        <div className="border-b border-gray-400 pt-8">
                          <p className="text-xs text-gray-400">서명</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-400 text-center">
                      본 양식은 참고용이며 법적 효력을 보장하지 않습니다.
                      중요한 계약은 법률 전문가의 검토를 받으세요.
                    </p>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={handlePrint}
                className="print:hidden mt-4 w-full py-3 px-4 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                PDF 다운로드 (인쇄/저장)
              </button>
            </div>
          </div>

          {/* SEO Content */}
          <section className="print:hidden mt-16 bg-white rounded-2xl border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              인플루언서 계약서 작성 가이드
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              인플루언서 마케팅이 성장하면서 계약서의 중요성도 높아지고
              있습니다. 구두 약속이나 DM 대화만으로 진행하면 나중에 분쟁이
              발생할 수 있습니다. 특히 광고 표시 의무, 콘텐츠 사용권, 보상
              지급 시기 등을 문서로 명확히 해두는 것이 중요합니다.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              공정거래위원회는 경제적 대가를 받고 제작한 콘텐츠에 광고 표시를
              의무화하고 있습니다. 계약서에 이를 명시하면 브랜드와
              인플루언서 모두를 법적 리스크로부터 보호할 수 있습니다.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              자주 묻는 질문
            </h3>
            <div className="space-y-4">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className="border-b border-gray-100 pb-4 last:border-0">
                  <h4 className="font-medium text-gray-900 mb-2">{item.q}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="print:hidden mt-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-2">
              신뢰할 수 있는 크리에이터를 찾고 계신가요?
            </h2>
            <p className="text-purple-100 mb-6">
              Inflix에서 검증된 인플루언서를 찾고 안전한 협업을 시작하세요.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-700 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
            >
              크리에이터 검색하기
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

// Helper components

function Field({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
      >
        <option value="">선택하세요</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function ContractSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      <div className="pl-3 border-l-2 border-gray-100 space-y-1">
        {children}
      </div>
    </div>
  );
}

function ContractParagraph({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-gray-700 leading-relaxed ${className}`}>{children}</p>
  );
}
