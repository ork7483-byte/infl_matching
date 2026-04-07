"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface SavedInfluencer {
  id: string;
  username: string;
  displayName: string;
  platform: string;
  followers: number;
  er: number;
  categories: string[];
  savedAt: string;
}

const MOCK_SAVED: SavedInfluencer[] = [
  { id: "1", username: "beauty_j", displayName: "뷰티 제이", platform: "Instagram", followers: 125400, er: 5.8, categories: ["뷰티", "패션"], savedAt: "2025-06-01" },
  { id: "2", username: "life_mia", displayName: "미아의 일상", platform: "Instagram", followers: 88200, er: 7.1, categories: ["라이프스타일", "여행"], savedAt: "2025-06-03" },
  { id: "3", username: "travel_k", displayName: "트래블 케이", platform: "TikTok", followers: 204000, er: 3.8, categories: ["여행", "음식"], savedAt: "2025-06-05" },
  { id: "4", username: "food_s", displayName: "푸드 S", platform: "YouTube", followers: 56800, er: 9.2, categories: ["음식"], savedAt: "2025-06-07" },
];

function formatNumber(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

const PLATFORM_COLOR: Record<string, string> = {
  Instagram: "bg-pink-500/15 text-pink-400",
  TikTok: "bg-sky-500/15 text-sky-400",
  YouTube: "bg-red-500/15 text-red-400",
};

export default function SavedInfluencersPage() {
  const [saved, setSaved] = useState<SavedInfluencer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/saved-influencers");
        if (res.ok) {
          const data = await res.json();
          setSaved(data);
        } else {
          setSaved(MOCK_SAVED);
        }
      } catch {
        setSaved(MOCK_SAVED);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleRemove(id: string) {
    setSaved((prev) => prev.filter((inf) => inf.id !== id));
    try {
      await fetch(`/api/saved-influencers/${id}`, { method: "DELETE" });
    } catch {
      // optimistic remove stays
    }
  }

  return (
    <DashboardLayout role="brand">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">저장한 인플루언서</h1>
          <p className="text-muted-foreground mt-1 text-sm">관심 인플루언서 목록을 관리하세요.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
          </div>
        ) : saved.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <p className="text-base font-medium">저장한 인플루언서가 없습니다</p>
            <p className="text-sm mt-1">인플루언서 검색에서 관심 있는 인플루언서를 저장해보세요.</p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-purple text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              인플루언서 검색
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">{saved.length}명 저장됨</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {saved.map((inf) => (
                <div key={inf.id} className="bg-card border border-border rounded-xl p-5 hover:border-brand-purple/40 transition-all group">
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold flex-shrink-0">
                        {inf.displayName[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{inf.displayName}</p>
                        <p className="text-xs text-muted-foreground">@{inf.username}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(inf.id)}
                      className="p-1.5 rounded-lg text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                      title="저장 취소"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Platform */}
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mb-3 ${PLATFORM_COLOR[inf.platform] ?? "bg-card-hover text-muted-foreground"}`}>
                    {inf.platform}
                  </span>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-background rounded-lg px-3 py-2">
                      <p className="text-xs text-muted-foreground">팔로워</p>
                      <p className="text-sm font-semibold text-foreground">{formatNumber(inf.followers)}</p>
                    </div>
                    <div className="bg-background rounded-lg px-3 py-2">
                      <p className="text-xs text-muted-foreground">참여율</p>
                      <p className="text-sm font-semibold text-green-400">{inf.er}%</p>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {inf.categories.map((cat) => (
                      <span key={cat} className="px-2 py-0.5 rounded-full bg-background border border-border text-xs text-muted-foreground">
                        {cat}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/brand/predict/${inf.username}`}
                      className="flex-1 text-center py-1.5 rounded-lg bg-brand-purple/15 text-brand-purple text-xs font-medium hover:bg-brand-purple/25 transition-colors"
                    >
                      성과 예측
                    </Link>
                    <Link
                      href={`/influencer/${inf.username}`}
                      className="flex-1 text-center py-1.5 rounded-lg bg-background border border-border text-muted-foreground text-xs font-medium hover:border-brand-purple/40 transition-colors"
                    >
                      프로필 보기
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
