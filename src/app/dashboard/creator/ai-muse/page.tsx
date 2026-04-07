"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";

// ─── Mock Data ────────────────────────────────────────────────────────────────

interface AiClone {
  status: "active" | "pending" | "inactive";
  totalRevenue: number;
  totalUsage: number;
  monthlyRevenue: number;
  portfolioImages: string[];
}

interface UsageLog {
  id: string;
  date: string;
  brand: string;
  contentType: string;
  revenue: number;
}

const MOCK_CLONE: AiClone | null = null; // Set to null to show "no clone" state; replace with object to show clone state

const MOCK_USAGE_LOGS: UsageLog[] = [
  { id: "1", date: "2026-04-05", brand: "CosmoBeauty", contentType: "피드 광고", revenue: 45000 },
  { id: "2", date: "2026-04-03", brand: "FitLife 코리아", contentType: "릴스 광고", revenue: 72000 },
  { id: "3", date: "2026-03-28", brand: "TravelMore", contentType: "스토리 광고", revenue: 28000 },
  { id: "4", date: "2026-03-20", brand: "FoodieHub", contentType: "피드 광고", revenue: 55000 },
];

const MOCK_PORTFOLIO = Array.from({ length: 12 }, (_, i) => `https://picsum.photos/seed/clone${i}/200/200`);

const BENEFITS = [
  { icon: "💰", title: "수익 자동 발생", desc: "내가 자는 동안에도 AI Muse이 광고를 찍어 수익을 만들어요." },
  { icon: "📸", title: "촬영 불필요", desc: "한 번 등록하면 추가 촬영 없이 무제한 콘텐츠 생성 가능해요." },
  { icon: "🔒", title: "승인 전 비공개", desc: "모든 콘텐츠는 내가 승인한 것만 브랜드에 전달돼요." },
];

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: AiClone["status"] }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        활성
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
        <span className="w-2 h-2 rounded-full bg-yellow-500" />
        승인 대기
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5E7EB] text-[#6B7280] text-sm font-medium">
      <span className="w-2 h-2 rounded-full bg-[#9CA3AF]" />
      비활성
    </span>
  );
}

// ─── No Clone State ───────────────────────────────────────────────────────────

function NoCloneHero({ onCreateClick, loading }: { onCreateClick: () => void; loading: boolean }) {
  return (
    <div className="max-w-lg mx-auto">
      {/* Hero card */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-8 text-center shadow-sm mb-6">
        <div className="w-20 h-20 rounded-full bg-[#7c3aed]/10 flex items-center justify-center mx-auto mb-5 text-4xl">
          🤖
        </div>
        <h1 className="text-2xl font-bold text-[#111827] mb-2">AI Muse 만들기</h1>
        <p className="text-[#6B7280] mb-8 leading-relaxed">
          내 얼굴과 스타일을 학습한 AI 모델이 대신 광고 콘텐츠를 생성해요.
          <br />
          촬영 없이 자동으로 수익을 창출하세요.
        </p>

        {/* Benefits */}
        <div className="space-y-3 mb-8 text-left">
          {BENEFITS.map((b) => (
            <div key={b.title} className="flex items-start gap-3 bg-[#F9FAFB] rounded-xl p-4">
              <span className="text-2xl flex-shrink-0">{b.icon}</span>
              <div>
                <p className="font-semibold text-[#111827] text-sm">{b.title}</p>
                <p className="text-xs text-[#6B7280] mt-0.5">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onCreateClick}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-[#7c3aed] text-white font-semibold text-base hover:bg-[#6d28d9] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              AI Muse 생성 중...
            </>
          ) : (
            "AI Muse 생성하기"
          )}
        </button>
      </div>

      {/* Progress animation during loading */}
      {loading && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
          <p className="text-sm font-medium text-[#374151] mb-4">AI Muse을 학습하고 있어요...</p>
          <div className="space-y-3">
            {[
              "사진 데이터 분석 중",
              "얼굴 특징 추출 중",
              "스타일 모델 학습 중",
              "포트폴리오 생성 중",
            ].map((label, i) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#7c3aed]/15 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-[#7c3aed] animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
                <span className="text-sm text-[#6B7280]" style={{ animationDelay: `${i * 0.5}s` }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
            <div className="h-full bg-[#7c3aed] rounded-full animate-pulse" style={{ width: "60%" }} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Clone Dashboard ──────────────────────────────────────────────────────────

function CloneDashboard({ clone, usageLogs }: { clone: AiClone; usageLogs: UsageLog[] }) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleAction = async (action: string) => {
    setActionLoading(action);
    await new Promise((r) => setTimeout(r, 1200));
    setActionLoading(null);
    alert(`${action} 처리가 완료됐습니다.`);
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#111827]">🤖 AI Muse</h2>
            <p className="text-sm text-[#6B7280] mt-0.5">내 AI Muse의 현재 상태예요</p>
          </div>
          <StatusBadge status={clone.status} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "총 수익", value: `₩${clone.totalRevenue.toLocaleString()}` },
            { label: "총 사용 횟수", value: `${clone.totalUsage}회` },
            { label: "이번 달 수익", value: `₩${clone.monthlyRevenue.toLocaleString()}` },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#F9FAFB] rounded-xl p-4 text-center">
              <p className="text-lg font-bold text-[#7c3aed]">{stat.value}</p>
              <p className="text-xs text-[#6B7280] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap">
          {clone.status === "pending" && (
            <button
              onClick={() => handleAction("승인")}
              disabled={actionLoading === "승인"}
              className="px-4 py-2 rounded-lg bg-[#7c3aed] text-white text-sm font-semibold hover:bg-[#6d28d9] transition-colors disabled:opacity-60"
            >
              {actionLoading === "승인" ? "처리 중..." : "승인하기"}
            </button>
          )}
          {clone.status === "active" && (
            <button
              onClick={() => handleAction("비활성화")}
              disabled={actionLoading === "비활성화"}
              className="px-4 py-2 rounded-lg border border-[#E5E7EB] text-[#374151] text-sm font-medium hover:bg-[#F9FAFB] transition-colors disabled:opacity-60"
            >
              {actionLoading === "비활성화" ? "처리 중..." : "비활성화"}
            </button>
          )}
          {clone.status === "inactive" && (
            <button
              onClick={() => handleAction("재활성화")}
              disabled={actionLoading === "재활성화"}
              className="px-4 py-2 rounded-lg bg-[#7c3aed] text-white text-sm font-semibold hover:bg-[#6d28d9] transition-colors disabled:opacity-60"
            >
              {actionLoading === "재활성화" ? "처리 중..." : "다시 활성화"}
            </button>
          )}
          <Link
            href="/dashboard/creator/ai-muse/revenue"
            className="px-4 py-2 rounded-lg border border-[#7c3aed]/30 bg-[#7c3aed]/5 text-[#7c3aed] text-sm font-medium hover:bg-[#7c3aed]/10 transition-colors"
          >
            수익 내역 보기 →
          </Link>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm">
        <h3 className="text-base font-semibold text-[#111827] mb-4">포트폴리오 미리보기</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {(clone.portfolioImages.length > 0 ? clone.portfolioImages : MOCK_PORTFOLIO).map((src, i) => (
            <div key={i} className="aspect-square rounded-lg overflow-hidden bg-[#F9FAFB]">
              <img
                src={src}
                alt={`포트폴리오 ${i + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://picsum.photos/seed/port${i}/200/200`;
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Usage Log Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E5E7EB]">
          <h3 className="text-base font-semibold text-[#111827]">최근 사용 내역</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F9FAFB]">
              <tr>
                {["날짜", "브랜드", "콘텐츠 유형", "수익"].map((col) => (
                  <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wide">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {usageLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="px-4 py-3 text-[#374151]">{log.date}</td>
                  <td className="px-4 py-3 font-medium text-[#111827]">{log.brand}</td>
                  <td className="px-4 py-3 text-[#374151]">{log.contentType}</td>
                  <td className="px-4 py-3 font-semibold text-[#7c3aed]">₩{log.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AiClonePage() {
  const [clone, setClone] = useState<AiClone | null>(MOCK_CLONE);
  const [creating, setCreating] = useState(false);

  const handleCreateClone = async () => {
    setCreating(true);
    try {
      // POST /api/ai-muse/create
      await new Promise((r) => setTimeout(r, 3000)); // mock delay
      setClone({
        status: "pending",
        totalRevenue: 0,
        totalUsage: 0,
        monthlyRevenue: 0,
        portfolioImages: MOCK_PORTFOLIO,
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <DashboardLayout role="creator">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#111827] flex items-center">
            AI Muse 관리
            <span className="relative group inline-flex ml-1.5 cursor-help">
              <svg className="w-3.5 h-3.5 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#111827] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap">
                나를 닮은 AI 모델이에요. 브랜드가 사용할 때마다 수익이 쌓여요.
              </span>
            </span>
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">내 AI 클론을 생성하고 수익을 관리하세요</p>
        </div>

        {clone ? (
          <CloneDashboard clone={clone} usageLogs={MOCK_USAGE_LOGS} />
        ) : (
          <NoCloneHero onCreateClick={handleCreateClone} loading={creating} />
        )}
      </div>
    </DashboardLayout>
  );
}
