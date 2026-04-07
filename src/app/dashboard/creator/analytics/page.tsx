"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DonutChart from "@/components/charts/DonutChart";
import BarChartComponent from "@/components/charts/BarChartComponent";

interface ProfileStats {
  followers: number;
  following: number;
  mediaCount: number;
  engagementRate: number;
  username: string;
  fullName: string;
}

interface Post {
  id: string;
  thumbnail: string;
  likes: number;
  comments: number;
  er: number;
  timestamp: string;
}

const MOCK_STATS: ProfileStats = {
  followers: 124500,
  following: 892,
  mediaCount: 347,
  engagementRate: 4.8,
  username: "kim_influencer",
  fullName: "김인플루",
};

const MOCK_POSTS: Post[] = [
  { id: "1", thumbnail: "", likes: 8420, comments: 312, er: 7.1, timestamp: "2025-06-20" },
  { id: "2", thumbnail: "", likes: 6210, comments: 198, er: 5.2, timestamp: "2025-06-18" },
  { id: "3", thumbnail: "", likes: 5980, comments: 241, er: 4.9, timestamp: "2025-06-15" },
  { id: "4", thumbnail: "", likes: 9340, comments: 420, er: 7.8, timestamp: "2025-06-12" },
  { id: "5", thumbnail: "", likes: 4820, comments: 156, er: 4.0, timestamp: "2025-06-09" },
  { id: "6", thumbnail: "", likes: 7650, comments: 287, er: 6.4, timestamp: "2025-06-06" },
];

const AUDIENCE_AGE_DATA = [
  { name: "13-17", value: 8 },
  { name: "18-24", value: 32 },
  { name: "25-34", value: 38 },
  { name: "35-44", value: 15 },
  { name: "45+", value: 7 },
];

const AUDIENCE_GENDER_DATA = [
  { name: "여성", value: 62, color: "#e94560" },
  { name: "남성", value: 35, color: "#7c3aed" },
  { name: "기타", value: 3, color: "#a1a1aa" },
];

const POSTING_FREQ_DATA = [
  { name: "월", value: 12 },
  { name: "화", value: 8 },
  { name: "수", value: 15 },
  { name: "목", value: 10 },
  { name: "금", value: 18 },
  { name: "토", value: 20 },
  { name: "일", value: 14 },
];

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export default function CreatorAnalyticsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats] = useState<ProfileStats>(MOCK_STATS);
  const [posts] = useState<Post[]>(MOCK_POSTS);

  useEffect(() => {
    // Simulate API fetch from /api/influencers/[username]
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [session]);

  const statCards = [
    { label: "팔로워", value: formatNumber(stats.followers), color: "text-brand-pink" },
    { label: "팔로잉", value: formatNumber(stats.following), color: "text-foreground" },
    { label: "게시물", value: formatNumber(stats.mediaCount), color: "text-foreground" },
    { label: "참여율(ER)", value: `${stats.engagementRate}%`, color: "text-green-400" },
  ];

  const topPosts = [...posts].sort((a, b) => b.er - a.er).slice(0, 3);

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
        <div>
          <h1 className="text-2xl font-bold text-foreground">내 프로필 분석</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            @{stats.username} · 최근 30일 기준
          </p>
        </div>

        {/* Profile Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div key={card.label} className="bg-card border border-border rounded-xl p-5">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className={`text-2xl font-bold mt-1 ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Posts Grid */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-base font-semibold text-foreground mb-4">최근 게시물</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {posts.map((post) => (
              <div key={post.id} className="group relative aspect-square rounded-lg overflow-hidden bg-background border border-border cursor-pointer">
                {/* Thumbnail placeholder */}
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-card to-background">
                  <svg className="w-8 h-8 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white">
                  <div className="flex items-center gap-1 text-xs">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    {formatNumber(post.likes)}
                  </div>
                  <div className="text-xs font-semibold text-brand-pink">ER {post.er}%</div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1.5 py-1 text-[10px] text-gray-300">
                  {post.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Gender Donut */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-base font-semibold text-foreground mb-2">오디언스 성별</h2>
            <DonutChart data={AUDIENCE_GENDER_DATA} />
          </div>

          {/* Age Bar */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-base font-semibold text-foreground mb-2">오디언스 연령대</h2>
            <BarChartComponent
              data={AUDIENCE_AGE_DATA}
              gradientFrom="#e94560"
              gradientTo="#7c3aed"
            />
          </div>
        </div>

        {/* Posting Frequency */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-base font-semibold text-foreground mb-2">요일별 게시 빈도</h2>
          <BarChartComponent data={POSTING_FREQ_DATA} gradientFrom="#e94560" gradientTo="#e94560" />
        </div>

        {/* Top Performing Posts */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-base font-semibold text-foreground mb-4">상위 게시물 (ER 기준)</h2>
          <div className="space-y-3">
            {topPosts.map((post, i) => (
              <div key={post.id} className="flex items-center gap-4 p-3 bg-background rounded-lg">
                <span className="text-lg font-bold text-brand-pink w-6 text-center">{i + 1}</span>
                <div className="w-10 h-10 rounded-md bg-card border border-border flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{post.timestamp}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-brand-pink">ER {post.er}%</p>
                  <p className="text-xs text-muted-foreground">
                    좋아요 {formatNumber(post.likes)} · 댓글 {formatNumber(post.comments)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
