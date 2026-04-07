"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const mockContents = [
  { id: 1, model: "수아", type: "제품 촬영", date: "2026-04-05", seed: 201 },
  { id: 2, model: "하은", type: "라이프스타일", date: "2026-04-04", seed: 202 },
  { id: 3, model: "지유", type: "패션 화보", date: "2026-04-03", seed: 203 },
  { id: 4, model: "수아", type: "뷰티", date: "2026-04-02", seed: 204 },
  { id: 5, model: "서연", type: "SNS 피드", date: "2026-04-01", seed: 205 },
  { id: 6, model: "지호", type: "비즈니스", date: "2026-03-30", seed: 206 },
  { id: 7, model: "민준", type: "스트릿", date: "2026-03-29", seed: 207 },
  { id: 8, model: "하은", type: "스포티", date: "2026-03-28", seed: 208 },
];

const creditHistory = [
  { date: "2026-04-05", action: "이미지 생성 (4장)", amount: -4, balance: 7 },
  { date: "2026-04-04", action: "이미지 생성 (4장)", amount: -4, balance: 11 },
  { date: "2026-04-01", action: "Pro 플랜 충전", amount: +50, balance: 15 },
  { date: "2026-03-30", action: "이미지 생성 (4장)", amount: -4, balance: 50 - 4 },
  { date: "2026-03-28", action: "이미지 생성 (4장)", amount: -4, balance: 50 - 8 },
];

const modelOptions = ["전체", "수아", "하은", "지유", "서연", "지호", "민준"];
const typeOptions = ["전체", "제품 촬영", "라이프스타일", "패션 화보", "뷰티", "SNS 피드", "비즈니스", "스트릿", "스포티"];
const sortOptions = ["최신순", "오래된순"];

export default function MyContentPage() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [modelFilter, setModelFilter] = useState("전체");
  const [typeFilter, setTypeFilter] = useState("전체");
  const [sort, setSort] = useState("최신순");

  const filtered = mockContents
    .filter(
      (c) =>
        (modelFilter === "전체" || c.model === modelFilter) &&
        (typeFilter === "전체" || c.type === typeFilter)
    )
    .sort((a, b) =>
      sort === "최신순"
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime()
    );

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((c) => c.id));
    }
  };

  const credits = 7;
  const totalContent = mockContents.length;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F9FAFB]">
        <div className="max-w-6xl mx-auto px-4 pt-28 pb-20">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[#111827]">내 콘텐츠</h1>
              <p className="text-[#6B7280] text-sm mt-1">AI Studio에서 생성한 콘텐츠를 관리하세요.</p>
            </div>
            <div className="flex gap-3">
              <div className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 flex items-center gap-2 shadow-sm">
                <span className="text-[#7c3aed]">⚡</span>
                <div>
                  <p className="text-xs text-[#9CA3AF]">크레딧 잔여</p>
                  <p className="text-[#111827] font-bold">{credits}건</p>
                </div>
              </div>
              <div className="bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 flex items-center gap-2 shadow-sm">
                <span className="text-[#7c3aed]">🖼</span>
                <div>
                  <p className="text-xs text-[#9CA3AF]">총 콘텐츠</p>
                  <p className="text-[#111827] font-bold">{totalContent}개</p>
                </div>
              </div>
              <Link
                href="/ai-studio/generate"
                className="bg-[#7c3aed] text-white font-semibold px-4 py-3 rounded-xl hover:bg-[#6d28d9] transition-colors text-sm flex items-center gap-1"
              >
                ✨ 새 콘텐츠 생성
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 mb-6 flex flex-wrap gap-4 items-center shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#374151] whitespace-nowrap">모델</span>
              <select
                value={modelFilter}
                onChange={(e) => setModelFilter(e.target.value)}
                className="text-sm border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-[#374151] focus:outline-none focus:border-[#7c3aed]"
              >
                {modelOptions.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#374151] whitespace-nowrap">유형</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="text-sm border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-[#374151] focus:outline-none focus:border-[#7c3aed]"
              >
                {typeOptions.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[#374151] whitespace-nowrap">정렬</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-sm border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-[#374151] focus:outline-none focus:border-[#7c3aed]"
              >
                {sortOptions.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 cursor-pointer ml-auto">
              <input
                type="checkbox"
                checked={selectedIds.length === filtered.length && filtered.length > 0}
                onChange={toggleAll}
                className="w-4 h-4 accent-[#7c3aed]"
              />
              <span className="text-sm text-[#374151]">전체 선택</span>
            </label>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {filtered.map((content) => (
              <div
                key={content.id}
                className={`bg-white border-2 rounded-2xl overflow-hidden transition-all ${
                  selectedIds.includes(content.id) ? "border-[#7c3aed] shadow-md" : "border-[#E5E7EB] hover:border-[#7c3aed]/40"
                }`}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={`https://picsum.photos/seed/${content.seed}/300/300`}
                    alt={`${content.model} - ${content.type}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-[#7c3aed] text-white text-xs font-semibold px-2 py-1 rounded-full">
                    🤖 AI Generated
                  </div>
                  <label className="absolute top-2 right-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(content.id)}
                      onChange={() => toggleSelect(content.id)}
                      className="w-4 h-4 accent-[#7c3aed]"
                    />
                  </label>
                </div>
                <div className="p-3">
                  <p className="text-[#111827] font-semibold text-sm">{content.model}</p>
                  <p className="text-[#6B7280] text-xs">{content.type}</p>
                  <p className="text-[#9CA3AF] text-xs mt-1">{content.date}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bulk Actions */}
          <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 flex flex-wrap gap-3 items-center mb-12 shadow-sm">
            <span className="text-sm text-[#6B7280]">
              {selectedIds.length > 0 ? `${selectedIds.length}개 선택됨` : "콘텐츠를 선택하세요"}
            </span>
            <div className="flex gap-3 ml-auto">
              <button
                disabled={selectedIds.length === 0}
                className="text-sm border border-[#7c3aed] text-[#7c3aed] font-semibold px-4 py-2 rounded-lg hover:bg-[#7c3aed]/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ⬇ 선택 다운로드
              </button>
              <button className="text-sm bg-[#7c3aed] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#6d28d9] transition-colors">
                ⬇ 전체 다운로드
              </button>
              <button
                disabled={selectedIds.length === 0}
                className="text-sm border border-red-200 text-red-500 font-semibold px-4 py-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                🗑 선택 삭제
              </button>
            </div>
          </div>

          {/* Credit History */}
          <div>
            <h2 className="text-xl font-bold text-[#111827] mb-4">크레딧 사용 내역</h2>
            <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                    <th className="text-left px-5 py-3 text-sm font-semibold text-[#374151]">날짜</th>
                    <th className="text-left px-5 py-3 text-sm font-semibold text-[#374151]">내용</th>
                    <th className="text-right px-5 py-3 text-sm font-semibold text-[#374151]">변동</th>
                    <th className="text-right px-5 py-3 text-sm font-semibold text-[#374151]">잔여</th>
                  </tr>
                </thead>
                <tbody>
                  {creditHistory.map((row, i) => (
                    <tr
                      key={i}
                      className={i < creditHistory.length - 1 ? "border-b border-[#E5E7EB]" : ""}
                    >
                      <td className="px-5 py-3 text-sm text-[#6B7280]">{row.date}</td>
                      <td className="px-5 py-3 text-sm text-[#374151]">{row.action}</td>
                      <td className={`px-5 py-3 text-sm font-semibold text-right ${row.amount > 0 ? "text-green-600" : "text-red-500"}`}>
                        {row.amount > 0 ? `+${row.amount}` : row.amount}
                      </td>
                      <td className="px-5 py-3 text-sm text-[#374151] font-medium text-right">
                        {row.balance}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
