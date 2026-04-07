"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

// ── Types ──────────────────────────────────────────────────────────────────

interface AmbassadorPage {
  id: string;
  slug: string;
  title: string;
  description: string;
  requirements: string[];
  benefits: string[];
  active: boolean;
}

interface Applicant {
  id: string;
  username: string;
  name: string;
  email: string;
  status: "대기" | "승인" | "거절";
  followers: number;
  engagementRate: number;
  appliedAt: string;
}

// ── Mock Data ──────────────────────────────────────────────────────────────

const MOCK_PAGE: AmbassadorPage = {
  id: "1",
  slug: "luxskin-ambassador",
  title: "LuxSkin 앰배서더 모집",
  description: "뷰티 & 스킨케어를 사랑하는 인플루언서를 모집합니다. 함께 성장하며 브랜드의 얼굴이 되어주세요!",
  requirements: [
    "인스타그램 팔로워 5,000명 이상",
    "뷰티/스킨케어 관련 콘텐츠 비중 50% 이상",
    "월 2회 이상 콘텐츠 게시 가능",
    "진정성 있는 리뷰 작성 가능",
  ],
  benefits: [
    "월 제품 지원 (₩150,000 상당)",
    "독점 할인 코드 제공 (15% 커미션)",
    "브랜드 공식 채널 리포스팅",
    "분기별 앰배서더 미팅 초대",
  ],
  active: true,
};

const MOCK_APPLICANTS: Applicant[] = [
  { id: "1", username: "@beauty_hana", name: "이하나", email: "hana@email.com", status: "대기", followers: 12400, engagementRate: 4.2, appliedAt: "2025-04-05" },
  { id: "2", username: "@skinlover_j", name: "박지수", email: "jisu@email.com", status: "승인", followers: 28900, engagementRate: 5.8, appliedAt: "2025-04-04" },
  { id: "3", username: "@daily_glow", name: "최민지", email: "minji@email.com", status: "거절", followers: 3200, engagementRate: 2.1, appliedAt: "2025-04-03" },
  { id: "4", username: "@rose_routine", name: "강서연", email: "seoyeon@email.com", status: "대기", followers: 45600, engagementRate: 6.3, appliedAt: "2025-04-02" },
  { id: "5", username: "@glow_diary", name: "윤채원", email: "chaewon@email.com", status: "대기", followers: 9800, engagementRate: 3.9, appliedAt: "2025-04-01" },
];

// ── Helpers ────────────────────────────────────────────────────────────────

function formatFollowers(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}만`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

const STATUS_STYLE: Record<Applicant["status"], string> = {
  대기: "bg-yellow-100 text-yellow-700",
  승인: "bg-green-100 text-green-700",
  거절: "bg-gray-100 text-gray-500",
};

// ── Sub-components ─────────────────────────────────────────────────────────

function CreatePageForm({ onCreated }: { onCreated: (page: AmbassadorPage) => void }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    benefits: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newPage: AmbassadorPage = {
      id: "new",
      slug: form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "my-ambassador",
      title: form.title,
      description: form.description,
      requirements: form.requirements.split("\n").filter(Boolean),
      benefits: form.benefits.split("\n").filter(Boolean),
      active: true,
    };
    onCreated(newPage);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-1">페이지 제목 *</label>
        <input
          required
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          placeholder="예) 우리 브랜드 앰배서더 모집"
          className="w-full px-3 py-2.5 rounded-lg text-base text-[#111827] outline-none focus:ring-2 focus:ring-[#7c3aed]/30"
          style={{ border: "1px solid #E5E7EB", backgroundColor: "#F9FAFB" }}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-1">설명</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          placeholder="앰배서더 프로그램에 대해 소개해주세요."
          className="w-full px-3 py-2.5 rounded-lg text-base text-[#111827] outline-none focus:ring-2 focus:ring-[#7c3aed]/30 resize-none"
          style={{ border: "1px solid #E5E7EB", backgroundColor: "#F9FAFB" }}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-1">지원 자격 (줄바꿈으로 구분)</label>
        <textarea
          rows={3}
          value={form.requirements}
          onChange={(e) => setForm((p) => ({ ...p, requirements: e.target.value }))}
          placeholder={"팔로워 1,000명 이상\n뷰티 관련 콘텐츠 제작 가능"}
          className="w-full px-3 py-2.5 rounded-lg text-base text-[#111827] outline-none focus:ring-2 focus:ring-[#7c3aed]/30 resize-none"
          style={{ border: "1px solid #E5E7EB", backgroundColor: "#F9FAFB" }}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-1">혜택 (줄바꿈으로 구분)</label>
        <textarea
          rows={3}
          value={form.benefits}
          onChange={(e) => setForm((p) => ({ ...p, benefits: e.target.value }))}
          placeholder={"월 제품 지원\n독점 할인 코드 제공"}
          className="w-full px-3 py-2.5 rounded-lg text-base text-[#111827] outline-none focus:ring-2 focus:ring-[#7c3aed]/30 resize-none"
          style={{ border: "1px solid #E5E7EB", backgroundColor: "#F9FAFB" }}
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
        style={{ backgroundImage: "linear-gradient(to right, #7c3aed, #a855f7)" }}
      >
        앰배서더 페이지 만들기
      </button>
    </form>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function BrandAmbassadorPage() {
  const [page, setPage] = useState<AmbassadorPage | null>(MOCK_PAGE);
  const [applicants, setApplicants] = useState<Applicant[]>(MOCK_APPLICANTS);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const pageUrl = page ? `inflix.io/ambassador/${page.slug}` : "";

  function handleCopy() {
    if (!page) return;
    navigator.clipboard.writeText(`https://${pageUrl}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleToggleActive() {
    if (!page) return;
    setPage((p) => p ? { ...p, active: !p.active } : null);
  }

  function handleDelete() {
    if (!confirm("앰배서더 페이지를 삭제하시겠습니까?")) return;
    setPage(null);
  }

  function handleApprove(id: string) {
    setApplicants((prev) => prev.map((a) => a.id === id ? { ...a, status: "승인" as const } : a));
  }

  function handleReject(id: string) {
    setApplicants((prev) => prev.map((a) => a.id === id ? { ...a, status: "거절" as const } : a));
  }

  const pendingCount = applicants.filter((a) => a.status === "대기").length;

  return (
    <DashboardLayout role="brand">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">앰배서더 페이지 관리</h1>
          <p className="text-[#6B7280] mt-1 text-sm">브랜드 앰배서더 지원 페이지를 만들고 지원자를 관리하세요.</p>
        </div>

        {/* ── My Ambassador Page Card ── */}
        <div className="rounded-xl p-6" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}>
          <h2 className="text-base font-semibold text-[#111827] mb-4">내 앰배서더 페이지</h2>

          {!page && !isEditing ? (
            <div className="text-center py-8">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#F5F3FF" }}
              >
                <svg className="w-8 h-8 text-[#7c3aed]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-[#6B7280] text-sm mb-4">아직 앰배서더 페이지가 없습니다.</p>
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
                style={{ backgroundImage: "linear-gradient(to right, #7c3aed, #a855f7)" }}
              >
                앰배서더 페이지 만들기
              </button>
            </div>
          ) : isEditing ? (
            <CreatePageForm onCreated={(newPage) => { setPage(newPage); setIsEditing(false); }} />
          ) : page ? (
            <div className="space-y-4">
              {/* URL row */}
              <div className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB" }}>
                <svg className="w-4 h-4 text-[#7c3aed] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="text-sm text-[#7c3aed] font-mono flex-1 truncate">{pageUrl}</span>
                <button
                  onClick={handleCopy}
                  className="text-xs px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer"
                  style={{ backgroundColor: copied ? "#D1FAE5" : "#F5F3FF", color: copied ? "#059669" : "#7c3aed" }}
                >
                  {copied ? "복사됨!" : "복사"}
                </button>
              </div>

              {/* Page info */}
              <div>
                <p className="text-[#111827] font-medium">{page.title}</p>
                <p className="text-[#6B7280] text-sm mt-1">{page.description}</p>
              </div>

              {/* Status toggle + actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t" style={{ borderColor: "#E5E7EB" }}>
                {/* Active toggle */}
                <button
                  onClick={handleToggleActive}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-colors"
                  style={{
                    backgroundColor: page.active ? "#D1FAE5" : "#F3F4F6",
                    color: page.active ? "#059669" : "#6B7280",
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: page.active ? "#10B981" : "#9CA3AF" }}
                  />
                  {page.active ? "활성" : "비활성"}
                </button>

                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#7c3aed] cursor-pointer hover:bg-[#F5F3FF] transition-colors"
                  style={{ border: "1px solid #E5E7EB" }}
                >
                  편집
                </button>

                <a
                  href={`/ambassador/${page.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#6B7280] cursor-pointer hover:bg-[#F9FAFB] transition-colors"
                  style={{ border: "1px solid #E5E7EB" }}
                >
                  미리보기
                </a>

                <button
                  onClick={handleDelete}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-red-500 cursor-pointer hover:bg-red-50 transition-colors ml-auto"
                  style={{ border: "1px solid #FEE2E2" }}
                >
                  삭제
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* ── Applicants Table ── */}
        <div className="rounded-xl overflow-hidden" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}>
          <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#E5E7EB" }}>
            <div>
              <h2 className="text-base font-semibold text-[#111827]">지원자 관리</h2>
              {pendingCount > 0 && (
                <p className="text-xs text-[#7c3aed] mt-0.5">대기 중인 지원자 {pendingCount}명</p>
              )}
            </div>
          </div>

          {applicants.length === 0 ? (
            <div className="text-center py-16 text-[#6B7280] text-sm">
              아직 지원자가 없습니다
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: "#F9FAFB" }}>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">인스타그램</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">이름</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden md:table-cell">이메일</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">상태</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden sm:table-cell">팔로워</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden lg:table-cell">참여율</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider hidden lg:table-cell">지원일</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {applicants.map((a) => (
                    <tr
                      key={a.id}
                      className="border-t"
                      style={{ borderColor: "#E5E7EB" }}
                    >
                      <td className="px-5 py-3.5 font-medium text-[#7c3aed]">{a.username}</td>
                      <td className="px-5 py-3.5 text-[#111827]">{a.name}</td>
                      <td className="px-5 py-3.5 text-[#6B7280] hidden md:table-cell">{a.email}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[a.status]}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right text-[#111827] hidden sm:table-cell">{formatFollowers(a.followers)}</td>
                      <td className="px-5 py-3.5 text-right text-[#111827] hidden lg:table-cell">{a.engagementRate}%</td>
                      <td className="px-5 py-3.5 text-right text-[#6B7280] hidden lg:table-cell">{a.appliedAt}</td>
                      <td className="px-5 py-3.5">
                        {a.status === "대기" && (
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => handleApprove(a.id)}
                              className="px-3 py-1 rounded-md text-xs font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] transition-colors cursor-pointer"
                            >
                              승인
                            </button>
                            <button
                              onClick={() => handleReject(a.id)}
                              className="px-3 py-1 rounded-md text-xs font-semibold text-[#6B7280] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
                              style={{ border: "1px solid #E5E7EB" }}
                            >
                              거절
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
