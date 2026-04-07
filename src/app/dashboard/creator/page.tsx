"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";

const MOCK_PROFILE = {
  name: "김인플루",
  handle: "@kim_influencer",
  followers: "124.5K",
  er: "4.8%",
  avatar: null,
};

const MOCK_GROWTH = [
  { label: "이번 주 팔로워 증가", value: "+1,240", positive: true },
  { label: "이번 달 팔로워 증가", value: "+4,870", positive: true },
  { label: "이번 주 평균 ER", value: "4.8%", positive: true },
  { label: "지난달 대비 변화", value: "+0.3%p", positive: true },
];

const MOCK_CAMPAIGNS = [
  { id: "1", name: "여름 뷰티 콜라보", brand: "GlowBrand", status: "ACTIVE", endDate: "2025-06-30" },
  { id: "2", name: "라이프스타일 콘텐츠 기획", brand: "LifeStyleCo", status: "PENDING", endDate: "2025-07-15" },
  { id: "3", name: "피트니스 챌린지 캠페인", brand: "FitLife", status: "COMPLETED", endDate: "2025-05-31" },
];

const MOCK_EARNINGS = [
  { month: "4월", amount: "₩320,000" },
  { month: "5월", amount: "₩510,000" },
  { month: "6월", amount: "₩280,000" },
];

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: "진행중", className: "bg-green-500/20 text-green-400" },
  PENDING: { label: "검토중", className: "bg-yellow-500/20 text-yellow-400" },
  COMPLETED: { label: "완료", className: "bg-blue-500/20 text-blue-400" },
};

export default function CreatorDashboardPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name ?? MOCK_PROFILE.name;

  return (
    <DashboardLayout role="creator">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              안녕하세요,{" "}
              <span className="text-brand-pink">{userName}</span>님!
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              오늘도 멋진 콘텐츠를 만들어 보세요.
            </p>
          </div>
          <Link
            href="/dashboard/creator/marketplace"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-pink text-white text-sm font-medium hover:opacity-90 transition-opacity min-h-[44px] cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            캠페인 찾기
          </Link>
        </div>

        {/* Profile Summary + Growth Snapshot */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Profile Card */}
          <div className="bg-card border border-border rounded-xl p-5 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-pink to-brand-purple flex items-center justify-center text-white text-2xl font-bold mb-3">
              {userName[0]?.toUpperCase() ?? "K"}
            </div>
            <p className="text-base font-semibold text-foreground">{userName}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{MOCK_PROFILE.handle}</p>
            <div className="mt-4 w-full grid grid-cols-2 gap-3">
              <div className="bg-background rounded-lg p-3">
                <p className="text-lg font-bold text-foreground">{MOCK_PROFILE.followers}</p>
                <p className="text-xs text-muted-foreground mt-0.5">팔로워</p>
              </div>
              <div className="bg-background rounded-lg p-3">
                <p className="text-lg font-bold text-brand-pink">{MOCK_PROFILE.er}</p>
                <p className="text-xs text-muted-foreground mt-0.5">참여율(ER)</p>
              </div>
            </div>
            <Link
              href="/dashboard/creator/analytics"
              className="mt-4 w-full text-center text-xs text-brand-pink hover:underline"
            >
              프로필 분석 보기 →
            </Link>
          </div>

          {/* Growth Snapshot */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
            <h2 className="text-base font-semibold text-foreground mb-4">성장 스냅샷</h2>
            <div className="grid grid-cols-2 gap-3">
              {MOCK_GROWTH.map((item) => (
                <div key={item.label} className="bg-background rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className={`text-xl font-bold mt-1 ${item.positive ? "text-green-400" : "text-red-400"}`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
            <Link
              href="/dashboard/creator/growth"
              className="mt-4 inline-block text-xs text-brand-pink hover:underline"
            >
              성장 트래커 상세 보기 →
            </Link>
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-foreground">참여 중인 캠페인</h2>
            <Link href="/dashboard/creator/marketplace" className="text-sm text-brand-pink hover:underline">
              캠페인 탐색
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">캠페인명</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">브랜드</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">상태</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">마감일</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {MOCK_CAMPAIGNS.map((c) => {
                  const badge = STATUS_BADGE[c.status] ?? STATUS_BADGE.PENDING;
                  return (
                    <tr key={c.id} className="border-b border-border/50 hover:bg-card-hover transition-colors">
                      <td className="px-5 py-3.5 font-medium text-foreground">{c.name}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{c.brand}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">{c.endDate}</td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href={`/dashboard/creator/marketplace/${c.id}`}
                          className="text-brand-pink hover:underline text-xs"
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
        </div>

        {/* Recent Earnings */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">최근 수익</h2>
            <Link href="/dashboard/creator/earnings" className="text-sm text-brand-pink hover:underline">
              수익 상세 보기
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {MOCK_EARNINGS.map((e) => (
              <div key={e.month} className="bg-background rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">{e.month}</p>
                <p className="text-base font-bold text-foreground mt-1">{e.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
