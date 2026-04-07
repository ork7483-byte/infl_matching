"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface BriefForm {
  brandName: string;
  campaignName: string;
  goal: string;
  targetAudience: string;
  contentTypes: string[];
  contentRequirements: string;
  startDate: string;
  endDate: string;
  rewardType: string;
  rewardDetail: string;
  hashtag: string;
  specialRequests: string;
}

const CONTENT_TYPE_OPTIONS = ["피드", "릴스", "스토리", "라이브"];

const GOAL_OPTIONS = [
  "브랜드 인지도",
  "제품 홍보",
  "이벤트 참여",
  "앱 설치",
  "매출 증대",
];

const REWARD_TYPE_OPTIONS = ["현금", "제품", "혼합"];

const FAQ_ITEMS = [
  {
    q: "캠페인 브리프란 무엇인가요?",
    a: "캠페인 브리프는 브랜드가 인플루언서에게 협업 내용을 명확히 전달하기 위한 문서입니다. 캠페인 목표, 타겟 오디언스, 콘텐츠 요구사항, 보상 조건 등을 포함합니다.",
  },
  {
    q: "캠페인 브리프가 왜 중요한가요?",
    a: "명확한 브리프는 브랜드와 인플루언서 간의 기대치를 맞추고, 불필요한 수정 작업을 줄이며, 캠페인 성과를 높입니다. 전문적인 협업의 시작점입니다.",
  },
  {
    q: "PDF 다운로드는 어떻게 작동하나요?",
    a: "브라우저의 인쇄 기능을 활용하여 PDF로 저장할 수 있습니다. '브리프 인쇄/저장' 버튼을 클릭하면 인쇄 미리보기가 열리고, 'PDF로 저장'을 선택하세요.",
  },
  {
    q: "작성한 내용은 저장되나요?",
    a: "현재 버전은 브라우저 세션 내에서만 유지됩니다. 작성 후 즉시 PDF로 저장하거나 내용을 복사해 두시기 바랍니다.",
  },
];

export default function CampaignBriefTemplatePage() {
  const [form, setForm] = useState<BriefForm>({
    brandName: "",
    campaignName: "",
    goal: "",
    targetAudience: "",
    contentTypes: [],
    contentRequirements: "",
    startDate: "",
    endDate: "",
    rewardType: "",
    rewardDetail: "",
    hashtag: "",
    specialRequests: "",
  });

  const handleContentTypeToggle = (type: string) => {
    setForm((prev) => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(type)
        ? prev.contentTypes.filter((t) => t !== type)
        : [...prev.contentTypes, type],
    }));
  };

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
              캠페인 브리프 템플릿
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              인플루언서 마케팅 캠페인 브리프를 쉽게 작성하세요. 양식에 맞춰
              입력하면 PDF로 다운로드할 수 있습니다.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 print:px-0 print:py-0 print:max-w-none">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:grid-cols-1">
            {/* Form */}
            <div className="print:hidden">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
                <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-3">
                  브리프 작성
                </h2>

                {/* 브랜드명 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    브랜드명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.brandName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, brandName: e.target.value }))
                    }
                    placeholder="예: 글로우업 코스메틱"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* 캠페인명 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    캠페인명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.campaignName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, campaignName: e.target.value }))
                    }
                    placeholder="예: 2024 봄 신상 립스틱 홍보 캠페인"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* 캠페인 목표 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    캠페인 목표
                  </label>
                  <select
                    value={form.goal}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, goal: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                  >
                    <option value="">선택하세요</option>
                    {GOAL_OPTIONS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 타겟 오디언스 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    타겟 오디언스
                  </label>
                  <textarea
                    value={form.targetAudience}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, targetAudience: e.target.value }))
                    }
                    placeholder="예: 20-30대 여성, 뷰티에 관심 있는 직장인"
                    rows={3}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* 콘텐츠 유형 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    콘텐츠 유형
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CONTENT_TYPE_OPTIONS.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleContentTypeToggle(type)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                          form.contentTypes.includes(type)
                            ? "bg-purple-600 text-white border-purple-600"
                            : "bg-white text-gray-600 border-gray-200 hover:border-purple-300"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 콘텐츠 요구사항 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    콘텐츠 요구사항
                  </label>
                  <textarea
                    value={form.contentRequirements}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        contentRequirements: e.target.value,
                      }))
                    }
                    placeholder="예: 제품을 자연스럽게 사용하는 모습, 색상 표현 강조, 광고 표시 필수"
                    rows={3}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* 캠페인 기간 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    캠페인 기간
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        시작일
                      </label>
                      <input
                        type="date"
                        value={form.startDate}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, startDate: e.target.value }))
                        }
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        종료일
                      </label>
                      <input
                        type="date"
                        value={form.endDate}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, endDate: e.target.value }))
                        }
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* 보상 유형 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    보상 유형
                  </label>
                  <select
                    value={form.rewardType}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, rewardType: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                  >
                    <option value="">선택하세요</option>
                    {REWARD_TYPE_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 보상 금액/내용 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    보상 금액/내용
                  </label>
                  <input
                    type="text"
                    value={form.rewardDetail}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, rewardDetail: e.target.value }))
                    }
                    placeholder="예: 건당 50만원 / 제품 2종 + 10만원"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* 해시태그 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    필수 해시태그
                  </label>
                  <input
                    type="text"
                    value={form.hashtag}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, hashtag: e.target.value }))
                    }
                    placeholder="예: #글로우업 #봄메이크업"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* 특별 요청사항 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    특별 요청사항
                  </label>
                  <textarea
                    value={form.specialRequests}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        specialRequests: e.target.value,
                      }))
                    }
                    placeholder="예: 경쟁사 제품 노출 금지, 촬영 전 컨셉 공유 필요"
                    rows={3}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div>
              <div
                id="brief-preview"
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 print:shadow-none print:border-0 print:rounded-none"
              >
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      캠페인 브리프
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      작성일: {today}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Powered by</p>
                    <span className="font-bold text-sm">
                      <span className="text-gray-900">Infl</span>
                      <span className="text-purple-600">ix</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <BriefRow
                    label="브랜드명"
                    value={form.brandName}
                    placeholder="(미입력)"
                  />
                  <BriefRow
                    label="캠페인명"
                    value={form.campaignName}
                    placeholder="(미입력)"
                  />
                  <BriefRow
                    label="캠페인 목표"
                    value={form.goal}
                    placeholder="(미선택)"
                  />
                  <BriefRow
                    label="타겟 오디언스"
                    value={form.targetAudience}
                    placeholder="(미입력)"
                    multiline
                  />
                  <BriefRow
                    label="콘텐츠 유형"
                    value={
                      form.contentTypes.length > 0
                        ? form.contentTypes.join(", ")
                        : ""
                    }
                    placeholder="(미선택)"
                  />
                  <BriefRow
                    label="콘텐츠 요구사항"
                    value={form.contentRequirements}
                    placeholder="(미입력)"
                    multiline
                  />
                  <BriefRow
                    label="캠페인 기간"
                    value={
                      form.startDate && form.endDate
                        ? `${form.startDate} ~ ${form.endDate}`
                        : form.startDate
                        ? `${form.startDate} ~`
                        : ""
                    }
                    placeholder="(미입력)"
                  />
                  <BriefRow
                    label="보상 유형"
                    value={form.rewardType}
                    placeholder="(미선택)"
                  />
                  <BriefRow
                    label="보상 금액/내용"
                    value={form.rewardDetail}
                    placeholder="(미입력)"
                  />
                  <BriefRow
                    label="필수 해시태그"
                    value={form.hashtag}
                    placeholder="(미입력)"
                  />
                  <BriefRow
                    label="특별 요청사항"
                    value={form.specialRequests}
                    placeholder="(없음)"
                    multiline
                  />
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400 text-center">
                    본 문서는 Inflix 캠페인 브리프 템플릿으로 생성되었습니다.
                  </p>
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
              캠페인 브리프란?
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              캠페인 브리프(Campaign Brief)는 인플루언서 마케팅을 진행할 때
              브랜드가 크리에이터에게 전달하는 핵심 지침 문서입니다. 캠페인
              목표, 타겟 오디언스, 메시지 방향, 콘텐츠 형식, 일정, 보상 조건
              등을 명확하게 담아 양측의 기대치를 일치시키는 역할을 합니다.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              잘 작성된 브리프는 크리에이터가 브랜드의 의도를 정확히 파악하고
              고품질의 콘텐츠를 제작하는 데 도움을 줍니다. 수정 횟수를 줄이고
              캠페인 성과를 높이는 가장 효과적인 방법 중 하나입니다.
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
              캠페인을 함께할 크리에이터를 찾고 계신가요?
            </h2>
            <p className="text-purple-100 mb-6">
              Inflix에서 검증된 인플루언서를 찾고 캠페인을 시작해 보세요.
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

function BriefRow({
  label,
  value,
  placeholder,
  multiline = false,
}: {
  label: string;
  value: string;
  placeholder: string;
  multiline?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <span className="text-xs font-medium text-gray-500 w-28 flex-shrink-0 pt-0.5">
        {label}
      </span>
      <span
        className={`text-sm flex-1 ${
          value ? "text-gray-900" : "text-gray-300 italic"
        } ${multiline ? "whitespace-pre-wrap" : ""}`}
      >
        {value || placeholder}
      </span>
    </div>
  );
}
