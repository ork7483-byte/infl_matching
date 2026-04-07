"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface InfluencerInfo {
  id: string;
  username: string;
  fullName: string | null;
  profilePicUrl: string | null;
  followersCount: number;
}

interface MatchRequestItem {
  id: string;
  influencerId: string;
  campaignTitle: string;
  campaignType: string;
  budget: string | null;
  status: string;
  createdAt: string;
  influencer: InfluencerInfo | null;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  pending:    { label: "대기",   bg: "bg-yellow-100", text: "text-yellow-700" },
  contacting: { label: "연락중", bg: "bg-blue-100",   text: "text-blue-700"  },
  accepted:   { label: "수락",   bg: "bg-green-100",  text: "text-green-700" },
  rejected:   { label: "거절",   bg: "bg-red-100",    text: "text-red-700"   },
  expired:    { label: "만료",   bg: "bg-red-100",    text: "text-red-700"   },
};

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function BrandMatchesPage() {
  const [requests, setRequests] = useState<MatchRequestItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/match/my-requests?limit=50")
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        setRequests(data.requests ?? []);
        setTotal(data.total ?? 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const successCount = requests.filter((r) => r.status === "accepted").length;

  return (
    <DashboardLayout role="brand">
      <div className="max-w-5xl mx-auto">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#111827]">매칭 현황</h1>
          <p className="text-sm text-[#6B7280] mt-1">인플루언서 매칭 요청 내역을 확인하세요</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
            <p className="text-xs text-[#6B7280] mb-1">총 요청</p>
            <p className="text-2xl font-bold text-[#111827]">{total}<span className="text-sm font-normal text-[#6B7280] ml-1">건</span></p>
          </div>
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
            <p className="text-xs text-[#6B7280] mb-1">매칭 성공</p>
            <p className="text-2xl font-bold text-[#22c55e]">{successCount}<span className="text-sm font-normal text-[#6B7280] ml-1">건</span></p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-[#6B7280] text-sm">불러오는 중...</div>
          ) : requests.length === 0 ? (
            <div className="p-12 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#F3F4F6] flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#9CA3AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-[#374151] font-medium mb-1">아직 매칭 요청이 없습니다</p>
              <p className="text-sm text-[#6B7280]">인플루언서 프로필에서 매칭 요청을 보내보세요</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <table className="w-full hidden md:table">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                    <th className="text-left text-xs font-medium text-[#6B7280] px-4 py-3">인플루언서</th>
                    <th className="text-left text-xs font-medium text-[#6B7280] px-4 py-3">캠페인명</th>
                    <th className="text-left text-xs font-medium text-[#6B7280] px-4 py-3">상태</th>
                    <th className="text-left text-xs font-medium text-[#6B7280] px-4 py-3">요청일</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3F4F6]">
                  {requests.map((req) => {
                    const status = STATUS_CONFIG[req.status] ?? { label: req.status, bg: "bg-gray-100", text: "text-gray-700" };
                    return (
                      <tr key={req.id} className="hover:bg-[#F9FAFB] transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {req.influencer?.profilePicUrl ? (
                              <img
                                src={req.influencer.profilePicUrl}
                                alt={req.influencer.username}
                                className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#e94560] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                {req.influencer?.username[0]?.toUpperCase() ?? "?"}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-[#111827] truncate">
                                @{req.influencer?.username ?? req.influencerId}
                              </p>
                              {req.influencer?.followersCount != null && (
                                <p className="text-xs text-[#6B7280]">
                                  {formatFollowers(req.influencer.followersCount)} 팔로워
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-[#111827] truncate max-w-[200px]">{req.campaignTitle}</p>
                          <p className="text-xs text-[#6B7280]">{req.campaignType}</p>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-[#6B7280]">
                          {formatDate(req.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-[#F3F4F6]">
                {requests.map((req) => {
                  const status = STATUS_CONFIG[req.status] ?? { label: req.status, bg: "bg-gray-100", text: "text-gray-700" };
                  return (
                    <div key={req.id} className="p-4 flex items-start gap-3">
                      {req.influencer?.profilePicUrl ? (
                        <img
                          src={req.influencer.profilePicUrl}
                          alt={req.influencer.username}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#e94560] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {req.influencer?.username[0]?.toUpperCase() ?? "?"}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <p className="text-sm font-medium text-[#111827] truncate">
                            @{req.influencer?.username ?? req.influencerId}
                          </p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${status.bg} ${status.text}`}>
                            {status.label}
                          </span>
                        </div>
                        <p className="text-sm text-[#374151] truncate">{req.campaignTitle}</p>
                        <p className="text-xs text-[#9CA3AF] mt-0.5">{formatDate(req.createdAt)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
