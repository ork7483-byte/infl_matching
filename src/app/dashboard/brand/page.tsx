"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  DRAFT: { label: "초안", className: "bg-gray-500/20 text-gray-400" },
  ACTIVE: { label: "진행중", className: "bg-green-500/20 text-green-400" },
  PAUSED: { label: "일시정지", className: "bg-yellow-500/20 text-yellow-400" },
  COMPLETED: { label: "완료", className: "bg-blue-500/20 text-blue-400" },
  CANCELLED: { label: "취소", className: "bg-red-500/20 text-red-400" },
};

const MOCK_STATS = [
  { label: "활성 캠페인", value: "3", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", color: "text-brand-purple" },
  { label: "총 도달", value: "1.2M", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", color: "text-brand-pink" },
  { label: "총 집행 예산", value: "₩8.4M", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-green-400" },
];

const MOCK_CAMPAIGNS = [
  { id: "1", name: "여름 신제품 론칭 캠페인", status: "ACTIVE", startDate: "2025-06-01", endDate: "2025-06-30" },
  { id: "2", name: "뷰티 콜라보 #봄웨이크", status: "DRAFT", startDate: "2025-07-01", endDate: "2025-07-15" },
  { id: "3", name: "라이프스타일 브랜딩", status: "COMPLETED", startDate: "2025-05-01", endDate: "2025-05-31" },
  { id: "4", name: "SNS 인지도 확대", status: "PAUSED", startDate: "2025-06-10", endDate: "2025-06-25" },
];

export default function BrandDashboardPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name ?? "사용자";

  return (
    <DashboardLayout role="brand">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              안녕하세요, <span className="bg-gradient-brand bg-clip-text text-transparent">{userName}</span>님 👋
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">오늘의 캠페인 현황을 확인하세요.</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/dashboard/brand/campaigns/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-brand text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              새 캠페인 만들기
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-foreground text-sm font-medium hover:bg-card-hover transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              인플루언서 검색
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {MOCK_STATS.map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <div className={`w-8 h-8 rounded-lg bg-card-hover flex items-center justify-center ${stat.color}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Campaigns */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-foreground">최근 캠페인</h2>
            <Link href="/dashboard/brand/campaigns" className="text-sm text-brand-purple hover:underline">
              전체 보기
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">캠페인명</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">상태</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">시작일</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">종료일</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {MOCK_CAMPAIGNS.map((c) => {
                  const badge = STATUS_BADGE[c.status] ?? STATUS_BADGE.DRAFT;
                  return (
                    <tr key={c.id} className="border-b border-border/50 hover:bg-card-hover transition-colors">
                      <td className="px-5 py-3.5 font-medium text-foreground">{c.name}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">{c.startDate}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{c.endDate}</td>
                      <td className="px-5 py-3.5 text-right">
                        <Link href={`/dashboard/brand/campaigns/${c.id}`} className="text-brand-purple hover:underline text-xs">
                          상세보기
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
