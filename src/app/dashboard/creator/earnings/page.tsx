"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import BarChartComponent from "@/components/charts/BarChartComponent";

interface EarningRecord {
  id: string;
  campaignName: string;
  brand: string;
  amount: number;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  date: string;
}

const MOCK_EARNINGS: EarningRecord[] = [
  { id: "1", campaignName: "여름 뷰티 신제품 리뷰", brand: "GlowBrand", amount: 300000, status: "COMPLETED", date: "2025-06-15" },
  { id: "2", campaignName: "피트니스 앱 홍보 캠페인", brand: "FitLife App", amount: 150000, status: "PROCESSING", date: "2025-06-20" },
  { id: "3", campaignName: "라이프스타일 체험단", brand: "LifeStyleCo", amount: 80000, status: "PENDING", date: "2025-06-25" },
  { id: "4", campaignName: "패션 하우스 콜라보", brand: "FashionHouse", amount: 200000, status: "COMPLETED", date: "2025-05-30" },
  { id: "5", campaignName: "여행 패키지 콘텐츠", brand: "TravelPro", amount: 500000, status: "FAILED", date: "2025-05-20" },
  { id: "6", campaignName: "식품 브랜드 레시피", brand: "TastyFood", amount: 120000, status: "COMPLETED", date: "2025-05-10" },
];

const MONTHLY_REVENUE = [
  { name: "1월", value: 180000 },
  { name: "2월", value: 240000 },
  { name: "3월", value: 310000 },
  { name: "4월", value: 280000 },
  { name: "5월", value: 420000 },
  { name: "6월", value: 530000 },
];

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  PENDING: { label: "대기중", className: "bg-yellow-500/20 text-yellow-400" },
  PROCESSING: { label: "처리중", className: "bg-blue-500/20 text-blue-400" },
  COMPLETED: { label: "완료", className: "bg-green-500/20 text-green-400" },
  FAILED: { label: "실패", className: "bg-red-500/20 text-red-400" },
};

function formatKRW(amount: number): string {
  return `₩${amount.toLocaleString()}`;
}

export default function EarningsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState<EarningRecord[]>([]);
  const [settlementRequested, setSettlementRequested] = useState(false);

  useEffect(() => {
    // Simulate fetch from /api/earnings/[influencerId]
    const timer = setTimeout(() => {
      setEarnings(MOCK_EARNINGS);
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [session]);

  const totalAccumulated = earnings
    .filter((e) => e.status === "COMPLETED")
    .reduce((sum, e) => sum + e.amount, 0);

  const thisMonth = earnings
    .filter((e) => e.date.startsWith("2025-06"))
    .reduce((sum, e) => sum + e.amount, 0);

  const pending = earnings
    .filter((e) => e.status === "PENDING")
    .reduce((sum, e) => sum + e.amount, 0);

  const completed = earnings
    .filter((e) => e.status === "COMPLETED")
    .reduce((sum, e) => sum + e.amount, 0);

  const SUMMARY_CARDS = [
    { label: "총 누적 수익", value: formatKRW(totalAccumulated), color: "text-brand-pink" },
    { label: "이번 달 수익", value: formatKRW(thisMonth), color: "text-green-400" },
    { label: "대기중 정산", value: formatKRW(pending), color: "text-yellow-400" },
    { label: "완료 정산", value: formatKRW(completed), color: "text-blue-400" },
  ];

  if (loading) {
    return (
      <DashboardLayout role="creator">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-brand-pink border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="creator">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">수익 / 정산</h1>
            <p className="text-muted-foreground mt-1 text-sm">캠페인 수익 내역을 확인하세요.</p>
          </div>
          <button
            onClick={() => setSettlementRequested(true)}
            disabled={settlementRequested || pending === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-pink text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {settlementRequested ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                정산 요청 완료
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                정산 요청
              </>
            )}
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {SUMMARY_CARDS.map((card) => (
            <div key={card.label} className="bg-card border border-border rounded-xl p-5">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className={`text-xl font-bold mt-1.5 ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-base font-semibold text-foreground mb-4">월별 수익 추이</h2>
          <BarChartComponent
            data={MONTHLY_REVENUE.map((d) => ({ ...d, value: Math.round(d.value / 10000) }))}
            gradientFrom="#e94560"
            gradientTo="#7c3aed"
          />
          <p className="text-xs text-muted-foreground mt-2">단위: 만원</p>
        </div>

        {/* Earnings Table */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-foreground">수익 내역</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">캠페인명</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">브랜드</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">금액</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">상태</th>
                  <th className="text-left px-5 py-3 text-muted-foreground font-medium">날짜</th>
                </tr>
              </thead>
              <tbody>
                {earnings.map((record) => {
                  const badge = STATUS_BADGE[record.status];
                  return (
                    <tr key={record.id} className="border-b border-border/50 hover:bg-card-hover transition-colors">
                      <td className="px-5 py-3.5 font-medium text-foreground">{record.campaignName}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{record.brand}</td>
                      <td className="px-5 py-3.5 font-semibold text-foreground">{formatKRW(record.amount)}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground">{record.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {earnings.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              수익 내역이 없습니다.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
