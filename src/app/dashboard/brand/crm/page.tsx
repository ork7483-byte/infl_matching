"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";

// ─── Types ───────────────────────────────────────────────────────────────────

type KanbanStatus = "발굴" | "연락중" | "협상중" | "계약완료" | "진행중" | "완료";

interface Influencer {
  id: string;
  username: string;
  fullName: string;
  avatar: string;
  followers: string;
  er: string;
  tags: string[];
  lastContacted: string;
  status: KanbanStatus;
  notes: string;
  rating: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_INFLUENCERS: Influencer[] = [
  { id: "1",  username: "soyeon_life",  fullName: "김소연",   avatar: "KS", followers: "12.4K", er: "4.2%", tags: ["라이프스타일", "뷰티"],  lastContacted: "2026-04-01", status: "발굴",   notes: "", rating: 0 },
  { id: "2",  username: "traveljun",    fullName: "박준혁",   avatar: "PJ", followers: "88.1K", er: "3.8%", tags: ["여행", "음식"],         lastContacted: "2026-03-28", status: "발굴",   notes: "", rating: 0 },
  { id: "3",  username: "fitmin_kr",    fullName: "이민지",   avatar: "LM", followers: "31.2K", er: "5.1%", tags: ["운동", "헬스"],          lastContacted: "2026-04-02", status: "연락중", notes: "DM 발송 완료", rating: 3 },
  { id: "4",  username: "dahye_beauty", fullName: "최다혜",   avatar: "CD", followers: "145K",  er: "6.3%", tags: ["뷰티", "스킨케어"],      lastContacted: "2026-04-03", status: "연락중", notes: "이메일 회신 대기", rating: 4 },
  { id: "5",  username: "chef_jinsoo",  fullName: "오진수",   avatar: "OJ", followers: "24.9K", er: "7.2%", tags: ["음식", "쿠킹"],          lastContacted: "2026-03-25", status: "연락중", notes: "", rating: 0 },
  { id: "6",  username: "yuri_fashion", fullName: "강유리",   avatar: "KY", followers: "203K",  er: "3.5%", tags: ["패션", "라이프스타일"],  lastContacted: "2026-04-05", status: "협상중", notes: "단가 조율 중", rating: 4 },
  { id: "7",  username: "techreview_k", fullName: "윤재민",   avatar: "YJ", followers: "56.7K", er: "2.9%", tags: ["IT", "테크"],            lastContacted: "2026-04-04", status: "협상중", notes: "계약서 검토 요청", rating: 3 },
  { id: "8",  username: "momlife_hana", fullName: "서하나",   avatar: "SH", followers: "19.3K", er: "8.5%", tags: ["육아", "라이프스타일"],  lastContacted: "2026-04-01", status: "계약완료", notes: "콘텐츠 가이드 전달", rating: 5 },
  { id: "9",  username: "gamer_woojin", fullName: "정우진",   avatar: "JW", followers: "72.0K", er: "4.0%", tags: ["게임", "엔터테인먼트"], lastContacted: "2026-03-30", status: "계약완료", notes: "", rating: 4 },
  { id: "10", username: "art_bomi",     fullName: "안보미",   avatar: "AB", followers: "9.8K",  er: "9.1%", tags: ["아트", "DIY"],          lastContacted: "2026-04-06", status: "진행중", notes: "1차 콘텐츠 제출 대기", rating: 5 },
  { id: "11", username: "ssul_nara",    fullName: "홍나라",   avatar: "HN", followers: "318K",  er: "2.7%", tags: ["엔터테인먼트", "일상"], lastContacted: "2026-04-05", status: "진행중", notes: "2차 콘텐츠 리뷰 중", rating: 4 },
  { id: "12", username: "run_seohyun",  fullName: "임서현",   avatar: "IS", followers: "44.5K", er: "5.8%", tags: ["운동", "건강"],          lastContacted: "2026-04-03", status: "진행중", notes: "", rating: 3 },
  { id: "13", username: "daily_hyeri",  fullName: "문혜리",   avatar: "MH", followers: "61.0K", er: "4.4%", tags: ["일상", "뷰티"],          lastContacted: "2026-03-20", status: "완료",   notes: "성과 보고서 수령", rating: 5 },
  { id: "14", username: "petlover_ko",  fullName: "조태원",   avatar: "JT", followers: "27.3K", er: "6.9%", tags: ["반려동물", "라이프"],    lastContacted: "2026-03-15", status: "완료",   notes: "재계약 검토 예정", rating: 4 },
  { id: "15", username: "eunbi_vlog",   fullName: "신은비",   avatar: "SE", followers: "91.2K", er: "3.3%", tags: ["여행", "패션"],          lastContacted: "2026-03-22", status: "완료",   notes: "", rating: 4 },
];

const KANBAN_COLUMNS: KanbanStatus[] = ["발굴", "연락중", "협상중", "계약완료", "진행중", "완료"];

const STATUS_COLORS: Record<KanbanStatus, string> = {
  발굴:    "bg-gray-100 text-gray-600",
  연락중:  "bg-blue-100 text-blue-700",
  협상중:  "bg-yellow-100 text-yellow-700",
  계약완료: "bg-purple-100 text-purple-700",
  진행중:  "bg-green-100 text-green-700",
  완료:    "bg-slate-100 text-slate-600",
};

const ALL_TAGS = ["라이프스타일", "뷰티", "여행", "음식", "운동", "헬스", "패션", "IT", "테크", "육아", "게임", "아트", "엔터테인먼트", "반려동물"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          className={`text-lg leading-none transition-colors ${star <= value ? "text-yellow-400" : "text-gray-300"} ${onChange ? "cursor-pointer hover:text-yellow-300" : "cursor-default"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CRMPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>(MOCK_INFLUENCERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState<string>("전체");
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
  const [panelNotes, setPanelNotes] = useState("");
  const [panelRating, setPanelRating] = useState(0);

  const selected = influencers.find((i) => i.id === selectedId) ?? null;

  // sync panel state when selection changes
  const openPanel = (inf: Influencer) => {
    setSelectedId(inf.id);
    setPanelNotes(inf.notes);
    setPanelRating(inf.rating);
  };

  const savePanel = () => {
    if (!selectedId) return;
    setInfluencers((prev) =>
      prev.map((i) => i.id === selectedId ? { ...i, notes: panelNotes, rating: panelRating } : i)
    );
  };

  const moveStatus = (id: string, direction: "forward" | "backward") => {
    setInfluencers((prev) =>
      prev.map((inf) => {
        if (inf.id !== id) return inf;
        const idx = KANBAN_COLUMNS.indexOf(inf.status);
        const nextIdx = direction === "forward" ? idx + 1 : idx - 1;
        if (nextIdx < 0 || nextIdx >= KANBAN_COLUMNS.length) return inf;
        return { ...inf, status: KANBAN_COLUMNS[nextIdx] };
      })
    );
  };

  const filtered = influencers.filter((inf) => {
    const matchSearch =
      inf.username.toLowerCase().includes(search.toLowerCase()) ||
      inf.fullName.includes(search);
    const matchTag = tagFilter === "전체" || inf.tags.includes(tagFilter);
    return matchSearch && matchTag;
  });

  const columnInfluencers = (col: KanbanStatus) => filtered.filter((i) => i.status === col);

  return (
    <DashboardLayout role="brand">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">인플루언서 CRM</h1>
            <p className="text-sm text-[#6B7280] mt-0.5">네트워크를 관리하고 협업 상태를 추적하세요.</p>
          </div>
          {/* Search + Filter */}
          <div className="flex gap-2 flex-wrap">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="이름 또는 @유저네임 검색"
                className="pl-9 pr-4 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/30 focus:border-[#7c3aed] w-56"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setTagDropdownOpen((v) => !v)}
                className="flex items-center gap-2 px-4 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-white text-[#374151] hover:bg-[#F9FAFB] transition-colors"
              >
                <svg className="w-4 h-4 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm0 5h16m-16 5h16m-16 5h16" />
                </svg>
                {tagFilter}
                <svg className="w-3 h-3 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {tagDropdownOpen && (
                <div className="absolute right-0 mt-1 w-44 bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-30 py-1">
                  {["전체", ...ALL_TAGS].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => { setTagFilter(tag); setTagDropdownOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${tagFilter === tag ? "bg-[#7c3aed]/10 text-[#7c3aed] font-medium" : "text-[#374151] hover:bg-[#F9FAFB]"}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-3 overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map((col) => {
            const cards = columnInfluencers(col);
            return (
              <div key={col} className="flex-shrink-0 w-60 flex flex-col">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className="text-sm font-semibold text-[#374151]">{col}</span>
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#E5E7EB] text-xs font-bold text-[#6B7280]">
                    {cards.length}
                  </span>
                </div>
                {/* Cards */}
                <div className="flex flex-col gap-2 min-h-[80px]">
                  {cards.map((inf) => (
                    <button
                      key={inf.id}
                      onClick={() => openPanel(inf)}
                      className={`w-full text-left bg-white border rounded-xl p-3 shadow-sm hover:shadow-md hover:border-[#7c3aed]/40 transition-all group ${selectedId === inf.id ? "border-[#7c3aed] ring-2 ring-[#7c3aed]/20" : "border-[#E5E7EB]"}`}
                    >
                      {/* Profile Row */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {inf.avatar}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-[#111827] truncate">@{inf.username}</p>
                          <p className="text-xs text-[#6B7280] truncate">{inf.fullName}</p>
                        </div>
                      </div>
                      {/* Stats */}
                      <div className="flex gap-3 mb-2">
                        <span className="text-xs text-[#6B7280]"><span className="font-medium text-[#374151]">{inf.followers}</span> 팔로워</span>
                        <span className="text-xs text-[#6B7280]">ER <span className="font-medium text-[#7c3aed]">{inf.er}</span></span>
                      </div>
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {inf.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#F3F4F6] text-[#6B7280]">
                            {tag}
                          </span>
                        ))}
                      </div>
                      {/* Last contacted */}
                      <p className="text-[10px] text-[#9CA3AF]">최근 연락: {inf.lastContacted}</p>
                    </button>
                  ))}
                  {cards.length === 0 && (
                    <div className="border-2 border-dashed border-[#E5E7EB] rounded-xl h-16 flex items-center justify-center">
                      <span className="text-xs text-[#D1D5DB]">비어 있음</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side Panel */}
      {selected && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setSelectedId(null)}
          />
          {/* Panel */}
          <aside className="fixed right-0 top-0 h-full w-80 bg-white border-l border-[#E5E7EB] shadow-2xl z-50 flex flex-col overflow-y-auto">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
              <h2 className="text-sm font-semibold text-[#111827]">인플루언서 상세</h2>
              <button
                onClick={() => setSelectedId(null)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F3F4F6] text-[#6B7280] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 p-5 space-y-5">
              {/* Profile */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] flex items-center justify-center text-white font-bold">
                  {selected.avatar}
                </div>
                <div>
                  <p className="font-semibold text-[#111827]">{selected.fullName}</p>
                  <p className="text-sm text-[#6B7280]">@{selected.username}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F9FAFB] rounded-lg p-3">
                  <p className="text-xs text-[#9CA3AF] mb-0.5">팔로워</p>
                  <p className="font-bold text-[#111827]">{selected.followers}</p>
                </div>
                <div className="bg-[#F9FAFB] rounded-lg p-3">
                  <p className="text-xs text-[#9CA3AF] mb-0.5">참여율 (ER)</p>
                  <p className="font-bold text-[#7c3aed]">{selected.er}</p>
                </div>
              </div>

              {/* Tags */}
              <div>
                <p className="text-xs font-medium text-[#374151] mb-2">카테고리</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#EDE9FE] text-[#7c3aed]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <p className="text-xs font-medium text-[#374151] mb-2">현재 상태</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[selected.status]}`}>
                  {selected.status}
                </span>
              </div>

              {/* Move Status */}
              <div>
                <p className="text-xs font-medium text-[#374151] mb-2">상태 변경</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => moveStatus(selected.id, "backward")}
                    disabled={KANBAN_COLUMNS.indexOf(selected.status) === 0}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs border border-[#E5E7EB] rounded-lg text-[#374151] hover:bg-[#F9FAFB] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    이전 단계
                  </button>
                  <button
                    onClick={() => moveStatus(selected.id, "forward")}
                    disabled={KANBAN_COLUMNS.indexOf(selected.status) === KANBAN_COLUMNS.length - 1}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    다음 단계
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div>
                <p className="text-xs font-medium text-[#374151] mb-2">평점</p>
                <StarRating value={panelRating} onChange={setPanelRating} />
              </div>

              {/* Notes */}
              <div>
                <p className="text-xs font-medium text-[#374151] mb-2">메모</p>
                <textarea
                  value={panelNotes}
                  onChange={(e) => setPanelNotes(e.target.value)}
                  rows={4}
                  placeholder="협업 관련 메모를 입력하세요..."
                  className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded-lg bg-[#F9FAFB] text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/30 focus:border-[#7c3aed] resize-none"
                />
              </div>

              {/* Last contacted */}
              <p className="text-xs text-[#9CA3AF]">최근 연락일: {selected.lastContacted}</p>
            </div>

            {/* Panel Footer */}
            <div className="px-5 py-4 border-t border-[#E5E7EB] space-y-2">
              <button
                onClick={savePanel}
                className="w-full py-2.5 text-sm font-medium bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition-colors"
              >
                저장
              </button>
              <Link
                href={`/influencer/${selected.username}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-medium border border-[#E5E7EB] text-[#374151] rounded-lg hover:bg-[#F9FAFB] transition-colors"
              >
                <svg className="w-4 h-4 text-[#7c3aed]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                프로필 분석 보기
              </Link>
            </div>
          </aside>
        </>
      )}
    </DashboardLayout>
  );
}
