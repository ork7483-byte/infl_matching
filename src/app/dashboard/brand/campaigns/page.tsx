"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";

type CampaignStatus = "ALL" | "ACTIVE" | "DRAFT" | "COMPLETED" | "PAUSED" | "CANCELLED";

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  DRAFT: { label: "초안", className: "bg-gray-500/20 text-gray-400" },
  ACTIVE: { label: "진행중", className: "bg-green-500/20 text-green-400" },
  PAUSED: { label: "일시정지", className: "bg-yellow-500/20 text-yellow-400" },
  COMPLETED: { label: "완료", className: "bg-blue-500/20 text-blue-400" },
  CANCELLED: { label: "취소", className: "bg-red-500/20 text-red-400" },
};

const FILTER_TABS: { key: CampaignStatus; label: string }[] = [
  { key: "ALL", label: "전체" },
  { key: "ACTIVE", label: "진행중" },
  { key: "DRAFT", label: "초안" },
  { key: "COMPLETED", label: "완료" },
];

interface Campaign {
  id: string;
  name: string;
  status: string;
  budget: number;
  startDate: string;
  endDate: string;
  influencerCount: number;
}

const MOCK_CAMPAIGNS: Campaign[] = [
  { id: "1", name: "여름 신제품 론칭 캠페인", status: "ACTIVE", budget: 3000000, startDate: "2025-06-01", endDate: "2025-06-30", influencerCount: 5 },
  { id: "2", name: "뷰티 콜라보 #봄웨이크", status: "DRAFT", budget: 1500000, startDate: "2025-07-01", endDate: "2025-07-15", influencerCount: 0 },
  { id: "3", name: "라이프스타일 브랜딩", status: "COMPLETED", budget: 2000000, startDate: "2025-05-01", endDate: "2025-05-31", influencerCount: 8 },
  { id: "4", name: "SNS 인지도 확대", status: "PAUSED", budget: 1200000, startDate: "2025-06-10", endDate: "2025-06-25", influencerCount: 3 },
  { id: "5", name: "가을 시즌 프로모션", status: "DRAFT", budget: 2500000, startDate: "2025-09-01", endDate: "2025-09-30", influencerCount: 0 },
];

function formatBudget(amount: number) {
  if (amount >= 1000000) return `₩${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `₩${(amount / 1000).toFixed(0)}K`;
  return `₩${amount}`;
}

export default function CampaignsPage() {
  const [activeFilter, setActiveFilter] = useState<CampaignStatus>("ALL");

  const filtered = activeFilter === "ALL"
    ? MOCK_CAMPAIGNS
    : MOCK_CAMPAIGNS.filter((c) => c.status === activeFilter);

  return (
    <DashboardLayout role="brand">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">캠페인 관리</h1>
            <p className="text-muted-foreground mt-1 text-sm">진행 중인 캠페인을 확인하고 관리하세요.</p>
          </div>
          <Link
            href="/dashboard/brand/campaigns/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-brand text-white text-sm font-medium hover:opacity-90 transition-opacity self-start sm:self-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            새 캠페인 만들기
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 bg-card border border-border rounded-lg p-1 w-fit">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
                activeFilter === tab.key
                  ? "bg-brand-purple text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 text-xs ${activeFilter === tab.key ? "text-white/70" : "text-muted"}`}>
                {tab.key === "ALL" ? MOCK_CAMPAIGNS.length : MOCK_CAMPAIGNS.filter((c) => c.status === tab.key).length}
              </span>
            </button>
          ))}
        </div>

        {/* Campaigns Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <svg className="w-12 h-12 mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm">해당 상태의 캠페인이 없습니다.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-5 py-3 text-muted-foreground font-medium">캠페인명</th>
                    <th className="text-left px-5 py-3 text-muted-foreground font-medium">상태</th>
                    <th className="text-left px-5 py-3 text-muted-foreground font-medium">예산</th>
                    <th className="text-left px-5 py-3 text-muted-foreground font-medium">기간</th>
                    <th className="text-left px-5 py-3 text-muted-foreground font-medium">인플루언서</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => {
                    const badge = STATUS_BADGE[c.status] ?? STATUS_BADGE.DRAFT;
                    return (
                      <tr key={c.id} className="border-b border-border/50 hover:bg-card-hover transition-colors">
                        <td className="px-5 py-3.5 font-medium text-foreground">{c.name}</td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-foreground font-medium">{formatBudget(c.budget)}</td>
                        <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">{c.startDate} ~ {c.endDate}</td>
                        <td className="px-5 py-3.5 text-muted-foreground">{c.influencerCount}명</td>
                        <td className="px-5 py-3.5 text-right">
                          <Link
                            href={`/dashboard/brand/campaigns/${c.id}`}
                            className="text-brand-purple hover:underline text-xs"
                          >
                            상세보기
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
