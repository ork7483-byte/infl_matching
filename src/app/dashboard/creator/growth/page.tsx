"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import LineChartComponent from "@/components/charts/LineChartComponent";
import BarChartComponent from "@/components/charts/BarChartComponent";

type Period = "daily" | "weekly" | "monthly";

const FOLLOWER_DATA: Record<Period, { date: string; value: number }[]> = {
  daily: [
    { date: "06/14", value: 122100 },
    { date: "06/15", value: 122450 },
    { date: "06/16", value: 122890 },
    { date: "06/17", value: 123200 },
    { date: "06/18", value: 123580 },
    { date: "06/19", value: 124100 },
    { date: "06/20", value: 124500 },
  ],
  weekly: [
    { date: "5/3주", value: 119200 },
    { date: "5/4주", value: 120100 },
    { date: "6/1주", value: 121400 },
    { date: "6/2주", value: 122600 },
    { date: "6/3주", value: 124500 },
  ],
  monthly: [
    { date: "1월", value: 108000 },
    { date: "2월", value: 111500 },
    { date: "3월", value: 115200 },
    { date: "4월", value: 118900 },
    { date: "5월", value: 121400 },
    { date: "6월", value: 124500 },
  ],
};

const ER_DATA: Record<Period, { date: string; value: number }[]> = {
  daily: [
    { date: "06/14", value: 4.2 },
    { date: "06/15", value: 5.1 },
    { date: "06/16", value: 4.7 },
    { date: "06/17", value: 4.9 },
    { date: "06/18", value: 6.2 },
    { date: "06/19", value: 4.8 },
    { date: "06/20", value: 5.0 },
  ],
  weekly: [
    { date: "5/3주", value: 4.0 },
    { date: "5/4주", value: 4.3 },
    { date: "6/1주", value: 4.6 },
    { date: "6/2주", value: 4.9 },
    { date: "6/3주", value: 4.8 },
  ],
  monthly: [
    { date: "1월", value: 3.8 },
    { date: "2월", value: 4.0 },
    { date: "3월", value: 4.2 },
    { date: "4월", value: 4.5 },
    { date: "5월", value: 4.6 },
    { date: "6월", value: 4.8 },
  ],
};

const MONTHLY_POSTS_DATA = [
  { name: "1월", value: 18 },
  { name: "2월", value: 22 },
  { name: "3월", value: 19 },
  { name: "4월", value: 25 },
  { name: "5월", value: 21 },
  { name: "6월", value: 16 },
];

const TOP_POSTS = [
  { id: "1", date: "2025-06-18", likes: 9340, comments: 420, er: 7.8 },
  { id: "2", date: "2025-06-20", likes: 8420, comments: 312, er: 7.1 },
  { id: "3", date: "2025-06-06", likes: 7650, comments: 287, er: 6.4 },
];

const MOM_GROWTH = 2.56;

const PERIOD_LABELS: Record<Period, string> = {
  daily: "일별",
  weekly: "주별",
  monthly: "월별",
};

export default function CreatorGrowthPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("weekly");

  useEffect(() => {
    // Simulate fetch from /api/growth/[influencerId]
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, [session]);

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
            <h1 className="text-2xl font-bold text-foreground">성장 트래커</h1>
            <p className="text-muted-foreground mt-1 text-sm">팔로워 및 참여율 추이를 확인하세요.</p>
          </div>
          {/* MoM Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-sm font-semibold text-green-400">MoM +{MOM_GROWTH}%</span>
            <span className="text-xs text-muted-foreground">전월 대비 성장</span>
          </div>
        </div>

        {/* Period Toggle */}
        <div className="flex gap-1 p-1 bg-card border border-border rounded-lg w-fit">
          {(["daily", "weekly", "monthly"] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                period === p
                  ? "bg-brand-pink text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>

        {/* Follower Trend */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-base font-semibold text-foreground mb-4">팔로워 추이</h2>
          <LineChartComponent
            data={FOLLOWER_DATA[period]}
            color="#e94560"
            showArea={true}
            label="팔로워 수"
          />
        </div>

        {/* ER Trend */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-base font-semibold text-foreground mb-4">참여율(ER) 추이</h2>
          <LineChartComponent
            data={ER_DATA[period]}
            color="#7c3aed"
            showArea={true}
            label="참여율 (%)"
          />
        </div>

        {/* Monthly Stats Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Monthly Post Count */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-base font-semibold text-foreground mb-2">월별 게시물 수</h2>
            <BarChartComponent
              data={MONTHLY_POSTS_DATA}
              gradientFrom="#e94560"
              gradientTo="#7c3aed"
            />
            <p className="text-xs text-muted-foreground mt-2">
              월평균 게시물:{" "}
              <span className="text-foreground font-medium">
                {Math.round(MONTHLY_POSTS_DATA.reduce((s, d) => s + d.value, 0) / MONTHLY_POSTS_DATA.length)}개
              </span>
            </p>
          </div>

          {/* Top Posts Highlight */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-base font-semibold text-foreground mb-4">이번 달 TOP 게시물</h2>
            <div className="space-y-3">
              {TOP_POSTS.map((post, i) => (
                <div key={post.id} className="flex items-center gap-3 p-3 bg-background rounded-lg">
                  <span className="text-base font-bold text-brand-pink w-5">{i + 1}</span>
                  <div className="w-8 h-8 rounded bg-card border border-border flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">{post.date}</p>
                    <p className="text-xs text-foreground mt-0.5">
                      좋아요 {post.likes.toLocaleString()} · 댓글 {post.comments}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-green-400">ER {post.er}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
