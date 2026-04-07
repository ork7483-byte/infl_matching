"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

// ─── Types ────────────────────────────────────────────────────────────────────

interface RevenueRecord {
  id: string;
  date: string;
  brand: string;
  contentType: string;
  total: number;
  myShare: number;
  status: "completed" | "pending" | "processing";
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_RECORDS: RevenueRecord[] = [
  { id: "1", date: "2026-04-05", brand: "CosmoBeauty", contentType: "피드 광고", total: 75000, myShare: 45000, status: "completed" },
  { id: "2", date: "2026-04-03", brand: "FitLife 코리아", contentType: "릴스 광고", total: 120000, myShare: 72000, status: "completed" },
  { id: "3", date: "2026-03-28", brand: "TravelMore", contentType: "스토리 광고", total: 46667, myShare: 28000, status: "completed" },
  { id: "4", date: "2026-03-20", brand: "FoodieHub", contentType: "피드 광고", total: 91667, myShare: 55000, status: "processing" },
  { id: "5", date: "2026-03-15", brand: "StyleKorea", contentType: "릴스 광고", total: 133333, myShare: 80000, status: "pending" },
  { id: "6", date: "2026-03-10", brand: "GlowSkin", contentType: "피드 광고", total: 66667, myShare: 40000, status: "completed" },
];

const MONTHLY_DATA = [
  { month: "11월", revenue: 120000 },
  { month: "12월", revenue: 180000 },
  { month: "1월", revenue: 95000 },
  { month: "2월", revenue: 210000 },
  { month: "3월", revenue: 163000 },
  { month: "4월", revenue: 117000 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatKRW(n: number): string {
  if (n >= 1_000_000) return `₩${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `₩${(n / 10_000).toFixed(0)}만`;
  return `₩${n.toLocaleString()}`;
}

function StatusChip({ status }: { status: RevenueRecord["status"] }) {
  const map = {
    completed: { label: "완료", cls: "bg-green-100 text-green-700" },
    pending: { label: "대기 중", cls: "bg-yellow-100 text-yellow-700" },
    processing: { label: "처리 중", cls: "bg-blue-100 text-blue-700" },
  } as const;
  const s = map[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.cls}`}>
      {s.label}
    </span>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────

function MonthlyBarChart({ data }: { data: typeof MONTHLY_DATA }) {
  const max = Math.max(...data.map((d) => d.revenue));
  return (
    <div className="flex items-end gap-2 h-36 pt-2">
      {data.map((d) => {
        const pct = (d.revenue / max) * 100;
        return (
          <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-[10px] text-[#6B7280] font-medium">{formatKRW(d.revenue)}</span>
            <div
              className="w-full rounded-t-md bg-[#7c3aed]/80 hover:bg-[#7c3aed] transition-colors"
              style={{ height: `${pct}%` }}
            />
            <span className="text-[10px] text-[#9CA3AF]">{d.month}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AiMuseRevenuePage() {
  const [requestLoading, setRequestLoading] = useState(false);

  const totalAccumulated = MOCK_RECORDS.reduce((s, r) => s + r.myShare, 0);
  const thisMonth = MOCK_RECORDS
    .filter((r) => r.date.startsWith("2026-04"))
    .reduce((s, r) => s + r.myShare, 0);
  const pendingSettlement = MOCK_RECORDS
    .filter((r) => r.status === "pending" || r.status === "processing")
    .reduce((s, r) => s + r.myShare, 0);
  const completedSettlement = MOCK_RECORDS
    .filter((r) => r.status === "completed")
    .reduce((s, r) => s + r.myShare, 0);

  const handleRequestSettlement = async () => {
    setRequestLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setRequestLoading(false);
    alert("정산 요청이 완료됐어요. 영업일 3~5일 내 처리됩니다.");
  };

  return (
    <DashboardLayout role="creator">
      <div className="max-w-3xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">AI Muse 수익</h1>
            <p className="text-sm text-[#6B7280] mt-1">AI 클론이 창출한 수익 내역을 확인하세요</p>
          </div>
          <button
            onClick={handleRequestSettlement}
            disabled={requestLoading}
            className="px-5 py-2.5 rounded-xl bg-[#7c3aed] text-white text-sm font-semibold hover:bg-[#6d28d9] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {requestLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                처리 중...
              </>
            ) : (
              "정산 요청"
            )}
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "총 누적 수익", value: formatKRW(totalAccumulated), color: "text-[#7c3aed]" },
            { label: "이번 달 수익", value: formatKRW(thisMonth), color: "text-[#111827]" },
            { label: "대기 중 정산", value: formatKRW(pendingSettlement), color: "text-yellow-600" },
            { label: "완료 정산", value: formatKRW(completedSettlement), color: "text-green-600" },
          ].map((card) => (
            <div key={card.label} className="bg-white rounded-2xl border border-[#E5E7EB] p-4 shadow-sm text-center">
              <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
              <p className="text-xs text-[#6B7280] mt-1">{card.label}</p>
            </div>
          ))}
        </div>

        {/* Monthly Chart */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm mb-6">
          <h3 className="text-base font-semibold text-[#111827] mb-4">월별 수익</h3>
          <MonthlyBarChart data={MONTHLY_DATA} />
        </div>

        {/* Revenue History Table */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E5E7EB]">
            <h3 className="text-base font-semibold text-[#111827]">수익 내역</h3>
            <p className="text-xs text-[#6B7280] mt-0.5">내 몫은 총액의 60%입니다</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F9FAFB]">
                <tr>
                  {["날짜", "브랜드", "콘텐츠 유형", "총액", "내 몫(60%)", "상태"].map((col) => (
                    <th
                      key={col}
                      className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {MOCK_RECORDS.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="px-4 py-3 text-[#374151] whitespace-nowrap">{rec.date}</td>
                    <td className="px-4 py-3 font-medium text-[#111827] whitespace-nowrap">{rec.brand}</td>
                    <td className="px-4 py-3 text-[#374151] whitespace-nowrap">{rec.contentType}</td>
                    <td className="px-4 py-3 text-[#374151] whitespace-nowrap">₩{rec.total.toLocaleString()}</td>
                    <td className="px-4 py-3 font-semibold text-[#7c3aed] whitespace-nowrap">₩{rec.myShare.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <StatusChip status={rec.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
