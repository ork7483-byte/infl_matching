"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// ── Icons ──────────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg
      className="w-5 h-5 text-green-400 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      className="w-5 h-5 text-[#6B7280] flex-shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

// ── Data ───────────────────────────────────────────────────────────────────

const brandFaqItems = [
  {
    q: "정말 지금 전부 무료인가요?",
    a: "네, 얼리 액세스 기간 동안 Pro 플랜의 모든 기능을 완전 무료로 이용하실 수 있습니다. 별도 신용카드 정보 없이 가입만 하시면 됩니다.",
  },
  {
    q: "얼리 액세스 기간은 언제까지인가요?",
    a: "구체적인 종료 일정은 미정이며, 유료 전환 최소 30일 전에 이메일로 공지해 드립니다. 얼리 액세스 기간 중 가입하신 분들께는 특별 혜택이 제공됩니다.",
  },
  {
    q: "유료 전환 시 기존 데이터는 어떻게 되나요?",
    a: "유료 전환 후에도 지금까지 생성하신 모든 캠페인, 분석 리포트, 데이터는 그대로 유지됩니다. 데이터 이전이나 손실 걱정 없이 계속 사용하실 수 있습니다.",
  },
  {
    q: "얼리 유저 혜택은 어떻게 되나요?",
    a: "얼리 액세스 기간 중 가입하신 분들께는 유료 전환 시 최대 50% 할인, 요금 동결 옵션, Pro 기능 영구 무료 업그레이드 등의 혜택을 제공할 예정입니다.",
  },
  {
    q: "Enterprise 플랜은 어떻게 문의하나요?",
    a: "contact@inflmarketing.com 으로 이메일을 보내시거나, 문의하기 버튼을 클릭해 문의 양식을 작성해 주시면 영업일 기준 1일 이내에 담당자가 연락드립니다.",
  },
  {
    q: "환불 정책은 어떻게 되나요?",
    a: "현재 얼리 액세스 기간에는 모든 기능이 무료이므로 환불 정책이 적용되지 않습니다. 향후 유료 전환 시에는 가입 후 7일 이내 전액 환불 정책이 적용됩니다.",
  },
];

const creatorFaqItems = [
  {
    q: "크리에이터도 나중에 유료가 되나요?",
    a: "크리에이터 플랜은 영구 무료를 원칙으로 합니다. 플랫폼의 수익 구조는 브랜드 측에서 만들어지기 때문에, 크리에이터 여러분은 항상 무료로 이용하실 수 있습니다.",
  },
  {
    q: "크리에이터인데 브랜드 기능도 쓸 수 있나요?",
    a: "크리에이터 계정과 브랜드 계정은 별도로 운영됩니다. 브랜드 기능이 필요하시다면 브랜드 계정을 별도로 생성하시거나, 현재 무료인 Pro 플랜을 이용하실 수 있습니다.",
  },
];

const comparisonTable = [
  {
    category: "인플루언서 검색/필터링",
    rows: [
      { feature: "인플루언서 검색", free: true, pro: true, enterprise: true },
      { feature: "고급 필터링 (팔로워, 카테고리, 지역 등)", free: "월 20회", pro: "무제한", enterprise: "무제한" },
      { feature: "가짜 팔로워 탐지", free: false, pro: true, enterprise: true },
      { feature: "경쟁사 인플루언서 분석", free: false, pro: true, enterprise: true },
    ],
  },
  {
    category: "인플루언서 분석",
    rows: [
      { feature: "프로필 분석 리포트", free: "월 5건", pro: "무제한", enterprise: "무제한" },
      { feature: "오디언스 분석", free: false, pro: true, enterprise: true },
      { feature: "AQS 오디언스 품질 점수", free: "월 5건", pro: "무제한", enterprise: "무제한" },
      { feature: "AI 성과 예측", free: false, pro: true, enterprise: true },
      { feature: "예상 광고단가", free: false, pro: true, enterprise: true },
    ],
  },
  {
    category: "캠페인 관리",
    rows: [
      { feature: "캠페인 생성", free: "1개", pro: "무제한", enterprise: "무제한" },
      { feature: "캠페인 트래킹", free: false, pro: true, enterprise: true },
      { feature: "팀 멤버 초대", free: false, pro: false, enterprise: true },
      { feature: "API 접근", free: false, pro: false, enterprise: true },
    ],
  },
  {
    category: "AI 스튜디오",
    rows: [
      { feature: "AI 콘텐츠 생성", free: "월 3건", pro: "월 50건", enterprise: "무제한" },
      { feature: "AI 모델 선택", free: true, pro: true, enterprise: true },
      { feature: "커스텀 AI 모델 제작", free: false, pro: false, enterprise: true },
    ],
  },
  {
    category: "리포트",
    rows: [
      { feature: "PDF/Excel 리포트 다운로드", free: false, pro: true, enterprise: true },
      { feature: "커스텀 브랜딩 리포트", free: false, pro: false, enterprise: true },
      { feature: "자동 정기 리포트", free: false, pro: true, enterprise: true },
    ],
  },
  {
    category: "지원",
    rows: [
      { feature: "이메일 지원", free: true, pro: true, enterprise: true },
      { feature: "우선 고객지원", free: false, pro: true, enterprise: true },
      { feature: "전담 매니저", free: false, pro: false, enterprise: true },
      { feature: "온보딩 지원", free: false, pro: false, enterprise: true },
      { feature: "SLA 보장", free: false, pro: false, enterprise: true },
    ],
  },
];

// ── Cell render helpers ────────────────────────────────────────────────────

function CompetitorCell({ value }: { value: boolean | string }) {
  if (value === true)
    return (
      <span className="inline-flex justify-center">
        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </span>
    );
  if (value === false)
    return (
      <span className="inline-flex justify-center">
        <svg className="w-5 h-5 text-[#D1D5DB] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </span>
    );
  return <span className="text-xs font-medium" style={{ color: "#F97316" }}>{value}</span>;
}

function TableCell({ value }: { value: boolean | string }) {
  if (value === true) return <CheckIcon />;
  if (value === false) return <XIcon />;
  return <span className="text-sm text-[#111827]">{value}</span>;
}

// ── Inner page (needs useSearchParams) ────────────────────────────────────

function PricingInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialTab = searchParams.get("tab") === "creator" ? "creator" : "brand";
  const [activeTab, setActiveTab] = useState<"brand" | "creator">(initialTab);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Sync tab state with URL
  function switchTab(tab: "brand" | "creator") {
    setActiveTab(tab);
    setOpenFaq(null);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`?${params.toString()}`, { scroll: false });
  }

  // Keep state in sync if URL changes externally
  useEffect(() => {
    const t = searchParams.get("tab");
    if (t === "creator" || t === "brand") setActiveTab(t);
  }, [searchParams]);

  const faqItems = activeTab === "brand" ? brandFaqItems : creatorFaqItems;

  return (
    <main className="min-h-screen pt-24 pb-20 px-4" style={{ backgroundColor: "#FFFFFF" }}>
      {/* ── Section 1: Hero ───────────────────────────────────────────── */}
      <section className="text-center mb-12 max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-[#111827]">
          심플한 요금제,{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(to right, #7c3aed, #e94560)" }}
          >
            확실한 가치
          </span>
        </h1>

        {/* Early access banner */}
        <div
          className="rounded-xl p-4 mb-8"
          style={{ backgroundImage: "linear-gradient(to right, #7c3aed, #e94560)" }}
        >
          <p className="text-white font-semibold text-base md:text-lg">
            🎉 얼리 액세스 기간 — 지금 가입하면 Pro 기능 무료!
          </p>
          <p className="text-white/80 text-sm mt-1">
            정가 ₩190,000/월 상당의 기능을 무료로 이용하세요
          </p>
        </div>

        {/* Billing toggle */}
        <div className="inline-flex rounded-lg p-1 gap-1" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}>
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all min-h-[44px] cursor-pointer ${
              billingCycle === "monthly"
                ? "bg-[#7c3aed] text-white shadow"
                : "text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            월간
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all min-h-[44px] cursor-pointer ${
              billingCycle === "annual"
                ? "bg-[#7c3aed] text-white shadow"
                : "text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            연간 — 20% 할인
          </button>
        </div>
      </section>

      {/* ── Section 2: Tab Switch ─────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto mb-10">
        <div className="flex border-b" style={{ borderColor: "#E5E7EB" }}>
          {(["brand", "creator"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => switchTab(tab)}
              className={`flex-1 sm:flex-none px-6 py-3 text-sm font-medium transition-all min-h-[44px] cursor-pointer ${
                activeTab === tab
                  ? "text-[#7c3aed] border-b-2 border-[#7c3aed]"
                  : "text-[#6B7280] hover:text-[#111827] border-b-2 border-transparent"
              }`}
            >
              {tab === "brand" ? "For Brands" : "For Creators"}
            </button>
          ))}
        </div>
      </section>

      {/* ── Section 3: Plan Cards ─────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto mb-20">
        {activeTab === "brand" ? (
          /* Brand: 3 cards */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Free Card */}
            <div
              className="rounded-2xl p-8 flex flex-col"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}
            >
              <div className="mb-6">
                <p className="text-[#6B7280] text-sm mb-2">Free</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-[#111827]">₩0</span>
                </div>
                <p className="text-[#6B7280] text-sm mt-1">영구 무료</p>
                <p className="text-[#111827] text-sm mt-3">시작하기에 충분한 기능</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {[
                  { ok: true, label: "검색 월 20회" },
                  { ok: true, label: "분석 월 5건" },
                  { ok: true, label: "AQS 월 5건" },
                  { ok: true, label: "캠페인 1개" },
                  { ok: false, label: "리포트 다운" },
                  { ok: false, label: "AI 성과 예측" },
                  { ok: false, label: "예상 광고단가" },
                  { ok: false, label: "오디언스 분석" },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    {item.ok ? <CheckIcon /> : <XIcon />}
                    <span className={`text-sm ${item.ok ? "text-[#111827]" : "text-[#6B7280]"}`}>
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/signup?role=brand&plan=free"
                className="block w-full text-center px-6 py-3 rounded-lg text-sm font-semibold text-[#111827] transition-opacity hover:opacity-80"
                style={{ border: "1px solid #E5E7EB" }}
              >
                무료로 시작
              </Link>
            </div>

            {/* Pro Card (highlighted) */}
            <div
              className="rounded-2xl p-8 flex flex-col relative overflow-hidden md:scale-105 md:z-10 max-w-full"
              style={{ backgroundColor: "#FFFFFF", border: "2px solid #7c3aed" }}
            >
              {/* Purple glow */}
              <div
                className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl pointer-events-none"
                style={{ backgroundColor: "rgba(124,58,237,0.25)" }}
              />
              <div
                className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full blur-3xl pointer-events-none"
                style={{ backgroundColor: "rgba(233,69,96,0.15)" }}
              />

              {/* Badge */}
              <span
                className="absolute top-4 right-4 text-xs font-semibold px-3 py-1 rounded-full"
                style={{ backgroundColor: "rgba(124,58,237,0.2)", color: "#c4b5fd" }}
              >
                ⭐ 추천
              </span>

              <div className="mb-6 relative z-10">
                <p className="text-[#6B7280] text-sm mb-2">Pro</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-[#111827]">현재 무료 🎉</span>
                </div>
                {billingCycle === "monthly" ? (
                  <p className="text-[#6B7280] text-sm mt-1">
                    <span className="line-through">₩190,000/월</span>
                  </p>
                ) : (
                  <p className="text-[#6B7280] text-sm mt-1">
                    ₩150,000/월{" "}
                    <span className="line-through text-xs">₩190,000</span>
                  </p>
                )}
                <p className="text-[#111827] text-sm mt-3">
                  본격적인 인플루언서 마케팅을 위한 올인원
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1 relative z-10">
                {[
                  "검색 무제한",
                  "분석 무제한",
                  "AQS 무제한",
                  "오디언스 분석",
                  "캠페인 무제한",
                  "리포트 PDF/Excel",
                  "AI 성과 예측",
                  "예상 광고단가",
                  "우선 고객지원",
                ].map((label, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckIcon />
                    <span className="text-sm text-[#111827]">{label}</span>
                  </li>
                ))}
              </ul>

              <div className="relative z-10">
                <Link
                  href="/signup?role=brand&plan=pro"
                  className="block w-full text-center px-6 py-3 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundImage: "linear-gradient(to right, #7c3aed, #e94560)" }}
                >
                  무료로 시작하기 🎉
                </Link>
                <p className="text-center text-xs text-[#6B7280] mt-2">얼리 액세스 진행중</p>
              </div>
            </div>

            {/* Enterprise Card */}
            <div
              className="rounded-2xl p-8 flex flex-col"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}
            >
              <div className="mb-6">
                <p className="text-[#6B7280] text-sm mb-2">Enterprise</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-[#111827]">맞춤 견적</span>
                </div>
                <p className="text-[#111827] text-sm mt-3">대규모 팀을 위한 맞춤형 솔루션</p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Pro 전체 기능",
                  "API 접근",
                  "팀 멤버 관리",
                  "전담 매니저",
                  "커스텀 브랜딩",
                  "커스텀 리포트",
                  "SLA 보장",
                  "온보딩 지원",
                ].map((label, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckIcon />
                    <span className="text-sm text-[#111827]">{label}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/contact?plan=enterprise"
                className="block w-full text-center px-6 py-3 rounded-lg text-sm font-semibold text-[#111827] transition-opacity hover:opacity-80"
                style={{ border: "1px solid #E5E7EB" }}
              >
                문의하기
              </Link>
            </div>
          </div>
        ) : (
          /* Creator: single wide card */
          <div className="max-w-2xl mx-auto">
            <div
              className="rounded-2xl p-10 relative overflow-hidden"
              style={{ backgroundColor: "#FFFFFF", border: "2px solid #7c3aed" }}
            >
              <div
                className="absolute -top-20 -right-20 w-56 h-56 rounded-full blur-3xl pointer-events-none"
                style={{ backgroundColor: "rgba(124,58,237,0.2)" }}
              />

              <div className="relative z-10 text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-[#111827] mb-3">
                  크리에이터는 영구 무료입니다 🎉
                </h2>
                <p className="text-3xl font-bold text-[#111827]">₩0 / 영구 무료</p>
              </div>

              <ul className="space-y-3 mb-8 relative z-10">
                {[
                  "프로필 분석 리포트 무제한",
                  "오디언스 분석",
                  "AQS 점수 확인 무제한",
                  "AI Muse 자동 생성",
                  "캠페인 마켓플레이스 탐색 무제한",
                  "캠페인 지원하기 무제한",
                  "내 성장 트래커",
                  "수익/정산 대시보드",
                  "포트폴리오 갤러리 등록 무제한",
                ].map((label, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckIcon />
                    <span className="text-sm text-[#111827]">{label}</span>
                  </li>
                ))}
              </ul>

              <div className="relative z-10">
                <Link
                  href="/signup?role=creator"
                  className="block w-full text-center px-6 py-4 rounded-lg text-base font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundImage: "linear-gradient(to right, #7c3aed, #e94560)" }}
                >
                  크리에이터로 시작하기
                </Link>
              </div>
            </div>

            {/* Why free explanation */}
            <div
              className="mt-8 rounded-xl p-6"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}
            >
              <h3 className="font-semibold text-[#111827] mb-2">왜 크리에이터는 무료인가요?</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                저희 플랫폼의 수익은 브랜드 파트너로부터 발생합니다. 크리에이터 여러분이 많이 참여하고 성장할수록, 브랜드 파트너에게 더 많은 가치를 제공할 수 있습니다. 크리에이터 생태계를 키우는 것이 곧 저희의 성장이기에, 크리에이터 플랜은 영구 무료로 유지됩니다.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* ── Section 4: Feature Comparison Table (Brands only) ────────── */}
      {activeTab === "brand" && (
        <section className="max-w-5xl mx-auto mb-20">
          <h2 className="text-2xl font-bold text-center text-[#111827] mb-8">기능 상세 비교</h2>

          <div className="overflow-x-auto rounded-2xl" style={{ border: "1px solid #E5E7EB" }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#FFFFFF" }}>
                  <th
                    className="sticky left-0 text-left px-6 py-4 font-semibold text-[#111827]"
                    style={{ backgroundColor: "#FFFFFF", minWidth: "200px" }}
                  >
                    기능
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-[#111827] min-w-[120px]">
                    Free
                  </th>
                  <th
                    className="px-6 py-4 text-center font-semibold text-[#111827] min-w-[120px]"
                    style={{ backgroundColor: "rgba(124,58,237,0.1)" }}
                  >
                    Pro ⭐
                  </th>
                  <th className="px-6 py-4 text-center font-semibold text-[#111827] min-w-[120px]">
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonTable.map((section) => (
                  <>
                    {/* Category row */}
                    <tr
                      key={`cat-${section.category}`}
                      style={{ backgroundColor: "#F9FAFB" }}
                    >
                      <td
                        colSpan={4}
                        className="sticky left-0 px-6 py-3 font-bold text-[#111827] text-xs uppercase tracking-wider"
                        style={{ backgroundColor: "#F9FAFB" }}
                      >
                        {section.category}
                      </td>
                    </tr>
                    {/* Feature rows */}
                    {section.rows.map((row, ri) => (
                      <tr
                        key={`${section.category}-${ri}`}
                        className="border-t"
                        style={{ borderColor: "#E5E7EB" }}
                      >
                        <td
                          className="sticky left-0 px-6 py-3 text-[#6B7280]"
                          style={{ backgroundColor: "#FFFFFF" }}
                        >
                          {row.feature}
                        </td>
                        <td className="px-6 py-3 text-center">
                          <div className="flex justify-center">
                            <TableCell value={row.free} />
                          </div>
                        </td>
                        <td
                          className="px-6 py-3 text-center"
                          style={{ backgroundColor: "rgba(124,58,237,0.07)" }}
                        >
                          <div className="flex justify-center">
                            <TableCell value={row.pro} />
                          </div>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <div className="flex justify-center">
                            <TableCell value={row.enterprise} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── Section 5: FAQ ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto mb-20">
        <h2 className="text-2xl font-bold text-center text-[#111827] mb-8">자주 묻는 질문</h2>

        <div className="space-y-3">
          {faqItems.map((item, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}
            >
              <button
                className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 text-[#111827] font-medium hover:text-[#7c3aed] transition-colors min-h-[56px] cursor-pointer"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span>{item.q}</span>
                <svg
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-4 text-sm text-[#6B7280] leading-relaxed border-t" style={{ borderColor: "#E5E7EB" }}>
                  <p className="pt-3">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 6: Competitor Comparison ────────────────────────── */}
      <section className="max-w-5xl mx-auto mb-20">
        <h2 className="text-2xl font-bold text-center text-[#111827] mb-3">왜 인플릭스인가요?</h2>
        <p className="text-center text-[#6B7280] mb-10 text-sm md:text-base">
          경쟁사가 월 55만원에 파는 기능을 무료로 제공합니다.
        </p>

        {/* Scrollable table wrapper with sticky first column */}
        <div className="overflow-x-auto rounded-2xl" style={{ border: "1px solid #E5E7EB" }}>
          <table className="w-full text-sm" style={{ minWidth: "560px" }}>
            <thead>
              <tr style={{ backgroundColor: "#F9FAFB" }}>
                <th
                  className="sticky left-0 text-left px-5 py-4 font-semibold text-[#111827]"
                  style={{ backgroundColor: "#F9FAFB", minWidth: "180px", zIndex: 10 }}
                >
                  기능
                </th>
                <th className="px-5 py-4 text-center font-medium text-[#6B7280] min-w-[130px]">
                  <div>HypeAuditor</div>
                  <div className="text-xs font-normal mt-0.5">$399/월</div>
                </th>
                <th className="px-5 py-4 text-center font-medium text-[#6B7280] min-w-[130px]">
                  <div>Modash</div>
                  <div className="text-xs font-normal mt-0.5">$199/월</div>
                </th>
                <th
                  className="px-5 py-4 text-center font-semibold min-w-[140px]"
                  style={{
                    backgroundColor: "#F5F3FF",
                    borderLeft: "3px solid #7c3aed",
                    color: "#7c3aed",
                  }}
                >
                  <div>Inflix</div>
                  <div className="text-xs font-bold mt-0.5" style={{ color: "#7c3aed" }}>₩0 무료</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: "인플루언서 검색", hype: true, modash: true, inflix: true },
                { feature: "고급 필터링", hype: true, modash: true, inflix: true },
                { feature: "가짜 팔로워 탐지", hype: true, modash: "Pro only", inflix: true },
                { feature: "오디언스 분석", hype: true, modash: true, inflix: true },
                { feature: "AQS 오디언스 품질 점수", hype: true, modash: false, inflix: true },
                { feature: "AI 성과 예측", hype: false, modash: false, inflix: true },
                { feature: "예상 광고단가", hype: true, modash: "Pro only", inflix: true },
                { feature: "경쟁사 인플루언서 분석", hype: true, modash: false, inflix: true },
                { feature: "캠페인 관리", hype: false, modash: true, inflix: true },
                { feature: "캠페인 트래킹", hype: true, modash: true, inflix: true },
                { feature: "PDF/Excel 리포트", hype: true, modash: "Pro only", inflix: true },
                { feature: "AI Muse 자동 생성", hype: false, modash: false, inflix: true },
                { feature: "앰배서더 페이지", hype: false, modash: false, inflix: true },
                { feature: "시장 분석 리포트", hype: "Pro only", modash: false, inflix: true },
                { feature: "크리에이터 마켓플레이스", hype: false, modash: false, inflix: true },
                { feature: "우선 고객지원", hype: true, modash: "Pro only", inflix: true },
                { feature: "한국어 지원", hype: false, modash: false, inflix: true },
              ].map((row, i) => (
                <tr
                  key={i}
                  className="border-t"
                  style={{ borderColor: "#E5E7EB" }}
                >
                  <td
                    className="sticky left-0 px-5 py-3 text-[#374151]"
                    style={{ backgroundColor: "#FFFFFF", zIndex: 10 }}
                  >
                    {row.feature}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <CompetitorCell value={row.hype} />
                  </td>
                  <td className="px-5 py-3 text-center">
                    <CompetitorCell value={row.modash} />
                  </td>
                  <td
                    className="px-5 py-3 text-center"
                    style={{ backgroundColor: "#F5F3FF", borderLeft: "3px solid #7c3aed" }}
                  >
                    <CompetitorCell value={row.inflix} />
                  </td>
                </tr>
              ))}

              {/* Summary row */}
              <tr className="border-t" style={{ borderColor: "#E5E7EB", backgroundColor: "#F9FAFB" }}>
                <td
                  className="sticky left-0 px-5 py-4 font-semibold text-[#111827]"
                  style={{ backgroundColor: "#F9FAFB", zIndex: 10 }}
                >
                  무료 도구 수
                </td>
                <td className="px-5 py-4 text-center font-medium text-[#6B7280]">8</td>
                <td className="px-5 py-4 text-center font-medium text-[#6B7280]">1</td>
                <td
                  className="px-5 py-4 text-center font-bold text-[#7c3aed]"
                  style={{ backgroundColor: "#F5F3FF", borderLeft: "3px solid #7c3aed" }}
                >
                  15
                </td>
              </tr>
              <tr className="border-t" style={{ borderColor: "#E5E7EB" }}>
                <td
                  className="sticky left-0 px-5 py-4 font-semibold text-[#111827]"
                  style={{ backgroundColor: "#FFFFFF", zIndex: 10 }}
                >
                  월 가격
                </td>
                <td className="px-5 py-4 text-center font-medium text-[#6B7280]">₩550,000</td>
                <td className="px-5 py-4 text-center font-medium text-[#6B7280]">₩280,000</td>
                <td
                  className="px-5 py-4 text-center"
                  style={{ backgroundColor: "#F5F3FF", borderLeft: "3px solid #7c3aed" }}
                >
                  <span className="font-bold text-lg" style={{ color: "#7c3aed" }}>₩0</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* CTA below table */}
        <div className="text-center mt-8">
          <a
            href="/signup"
            className="inline-block px-10 py-4 rounded-xl text-base font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
            style={{ backgroundImage: "linear-gradient(to right, #7c3aed, #e94560)" }}
          >
            지금 무료로 시작하기
          </a>
          <p className="text-xs text-[#9CA3AF] mt-3">신용카드 없이 가입 · 언제든 해지 가능</p>
        </div>
      </section>

      {/* ── Section 7: Bottom CTA ─────────────────────────────────────── */}
      <section className="text-center max-w-2xl mx-auto">
        <div
          className="rounded-2xl px-8 py-12"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] mb-3">
            아직 고민 중이신가요?
          </h2>
          <p className="text-[#6B7280] mb-8">지금은 무료입니다. 부담 없이 시작하세요.</p>
          <Link
            href="/signup"
            className="block w-full sm:inline-block sm:w-auto px-10 py-4 rounded-xl text-base font-semibold text-white transition-opacity hover:opacity-90 text-center min-h-[48px] cursor-pointer"
            style={{ backgroundImage: "linear-gradient(to right, #7c3aed, #e94560)" }}
          >
            무료로 시작하기
          </Link>
          <p className="text-xs text-[#6B7280] mt-4">결제 정보 없이 가입 · 언제든 해지 가능</p>
        </div>
      </section>
    </main>
  );
}

// ── Page (Suspense wrapper for useSearchParams) ────────────────────────────

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen" style={{ backgroundColor: "#FFFFFF" }} />}>
        <PricingInner />
      </Suspense>
      <Footer />
    </>
  );
}
