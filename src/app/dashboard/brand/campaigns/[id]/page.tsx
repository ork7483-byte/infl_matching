"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import BarChartComponent from "@/components/charts/BarChartComponent";
import LineChartComponent from "@/components/charts/LineChartComponent";

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  DRAFT: { label: "초안", className: "bg-gray-500/20 text-gray-400" },
  ACTIVE: { label: "진행중", className: "bg-green-500/20 text-green-400" },
  PAUSED: { label: "일시정지", className: "bg-yellow-500/20 text-yellow-400" },
  COMPLETED: { label: "완료", className: "bg-blue-500/20 text-blue-400" },
  CANCELLED: { label: "취소", className: "bg-red-500/20 text-red-400" },
};

interface Campaign {
  id: string;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  budget: number;
  isPublic: boolean;
  description?: string;
}

interface PerformanceSummary {
  totalReach: number;
  totalEngagement: number;
  totalImpressions: number;
  avgEngagementRate: number;
}

interface InfluencerPerf {
  name: string;
  value: number;
}

interface TimePoint {
  date: string;
  value: number;
}

interface Post {
  id: string;
  influencer: string;
  thumbnail: string;
  likes: number;
  comments: number;
  reach: number;
}

interface Application {
  id: string;
  influencer: string;
  followers: string;
  er: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
}

const MOCK_CAMPAIGN: Campaign = {
  id: "1",
  name: "여름 신제품 론칭 캠페인",
  status: "ACTIVE",
  startDate: "2025-06-01",
  endDate: "2025-06-30",
  budget: 3000000,
  isPublic: true,
  description: "여름 신제품 런칭을 위한 SNS 인플루언서 마케팅 캠페인입니다.",
};

const MOCK_PERF: PerformanceSummary = {
  totalReach: 420000,
  totalEngagement: 18900,
  totalImpressions: 580000,
  avgEngagementRate: 4.5,
};

const MOCK_INFLUENCER_PERF: InfluencerPerf[] = [
  { name: "@beauty_j", value: 8200 },
  { name: "@life_mia", value: 5600 },
  { name: "@travel_k", value: 3400 },
  { name: "@food_s", value: 1700 },
];

const MOCK_TIMELINE: TimePoint[] = [
  { date: "6/1", value: 1200 },
  { date: "6/5", value: 3400 },
  { date: "6/10", value: 5800 },
  { date: "6/15", value: 9200 },
  { date: "6/20", value: 13600 },
  { date: "6/25", value: 17800 },
  { date: "6/30", value: 18900 },
];

const MOCK_POSTS: Post[] = [
  { id: "p1", influencer: "@beauty_j", thumbnail: "https://placehold.co/80x80/1a1a2e/7c3aed?text=1", likes: 4200, comments: 180, reach: 32000 },
  { id: "p2", influencer: "@life_mia", thumbnail: "https://placehold.co/80x80/1a1a2e/e94560?text=2", likes: 3100, comments: 95, reach: 24000 },
  { id: "p3", influencer: "@travel_k", thumbnail: "https://placehold.co/80x80/1a1a2e/7c3aed?text=3", likes: 1800, comments: 62, reach: 16000 },
];

const MOCK_APPLICATIONS: Application[] = [
  { id: "a1", influencer: "@fashion_h", followers: "45.2K", er: "5.8%", status: "PENDING" },
  { id: "a2", influencer: "@style_y", followers: "28.7K", er: "7.1%", status: "PENDING" },
  { id: "a3", influencer: "@daily_n", followers: "92.4K", er: "3.2%", status: "ACCEPTED" },
];

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/campaigns/${id}`);
        if (res.ok) {
          const data = await res.json();
          setCampaign(data);
        } else {
          setCampaign({ ...MOCK_CAMPAIGN, id });
        }
      } catch {
        setCampaign({ ...MOCK_CAMPAIGN, id });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function updateStatus(newStatus: string) {
    setStatusUpdating(true);
    try {
      await fetch(`/api/campaigns/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setCampaign((prev) => prev ? { ...prev, status: newStatus } : prev);
    } catch {
      setCampaign((prev) => prev ? { ...prev, status: newStatus } : prev);
    } finally {
      setStatusUpdating(false);
    }
  }

  async function handleApplication(appId: string, action: "ACCEPTED" | "REJECTED") {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: action } : a))
    );
    try {
      await fetch(`/api/campaigns/${id}/applications/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }),
      });
    } catch {
      // optimistic update stays
    }
  }

  if (loading) {
    return (
      <DashboardLayout role="brand">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!campaign) {
    return (
      <DashboardLayout role="brand">
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
          <p>캠페인을 찾을 수 없습니다.</p>
          <button onClick={() => router.back()} className="mt-4 text-brand-purple hover:underline text-sm">돌아가기</button>
        </div>
      </DashboardLayout>
    );
  }

  const badge = STATUS_BADGE[campaign.status] ?? STATUS_BADGE.DRAFT;

  return (
    <DashboardLayout role="brand">
      <div className="space-y-6">
        {/* Campaign Header */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-bold text-foreground">{campaign.name}</h1>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}>
                  {badge.label}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {campaign.startDate} ~ {campaign.endDate} &nbsp;·&nbsp; 예산 ₩{campaign.budget.toLocaleString()}
              </p>
              {campaign.description && (
                <p className="text-sm text-muted-foreground">{campaign.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={`/dashboard/brand/campaigns/${id}/report`}
                className="px-3 py-1.5 rounded-lg bg-card-hover border border-border text-sm text-foreground hover:border-brand-purple/50 transition-colors"
              >
                리포트
              </Link>
              {campaign.status === "DRAFT" && (
                <button
                  onClick={() => updateStatus("ACTIVE")}
                  disabled={statusUpdating}
                  className="px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-sm hover:bg-green-500/30 transition-colors disabled:opacity-50"
                >
                  시작
                </button>
              )}
              {campaign.status === "ACTIVE" && (
                <button
                  onClick={() => updateStatus("PAUSED")}
                  disabled={statusUpdating}
                  className="px-3 py-1.5 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 text-sm hover:bg-yellow-500/30 transition-colors disabled:opacity-50"
                >
                  일시정지
                </button>
              )}
              {campaign.status === "PAUSED" && (
                <button
                  onClick={() => updateStatus("ACTIVE")}
                  disabled={statusUpdating}
                  className="px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-sm hover:bg-green-500/30 transition-colors disabled:opacity-50"
                >
                  재개
                </button>
              )}
              {(campaign.status === "ACTIVE" || campaign.status === "PAUSED") && (
                <button
                  onClick={() => updateStatus("COMPLETED")}
                  disabled={statusUpdating}
                  className="px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm hover:bg-blue-500/30 transition-colors disabled:opacity-50"
                >
                  완료
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Performance Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "총 도달", value: formatNumber(MOCK_PERF.totalReach) },
            { label: "총 참여", value: formatNumber(MOCK_PERF.totalEngagement) },
            { label: "총 임프레션", value: formatNumber(MOCK_PERF.totalImpressions) },
            { label: "평균 참여율", value: `${MOCK_PERF.avgEngagementRate}%` },
          ].map((item) => (
            <div key={item.label} className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-2">{item.label}</p>
              <p className="text-xl font-bold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart: Influencer Performance */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">인플루언서별 참여 수</h2>
            <BarChartComponent data={MOCK_INFLUENCER_PERF} />
          </div>

          {/* Line Chart: Time Series */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">누적 참여 추이</h2>
            <LineChartComponent data={MOCK_TIMELINE} showArea color="#7c3aed" />
          </div>
        </div>

        {/* Post List */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-foreground">게시물 성과</h2>
          </div>
          <div className="divide-y divide-border/50">
            {MOCK_POSTS.map((post) => (
              <div key={post.id} className="flex items-center gap-4 px-5 py-4 hover:bg-card-hover transition-colors">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.thumbnail} alt="post" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{post.influencer}</p>
                  <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                    <span>좋아요 {post.likes.toLocaleString()}</span>
                    <span>댓글 {post.comments.toLocaleString()}</span>
                    <span>도달 {formatNumber(post.reach)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Management */}
        {campaign.isPublic && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-base font-semibold text-foreground">캠페인 지원 현황</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-5 py-3 text-muted-foreground font-medium">인플루언서</th>
                    <th className="text-left px-5 py-3 text-muted-foreground font-medium">팔로워</th>
                    <th className="text-left px-5 py-3 text-muted-foreground font-medium">참여율</th>
                    <th className="text-left px-5 py-3 text-muted-foreground font-medium">상태</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} className="border-b border-border/50 hover:bg-card-hover transition-colors">
                      <td className="px-5 py-3.5 font-medium text-foreground">{app.influencer}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{app.followers}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{app.er}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          app.status === "ACCEPTED" ? "bg-green-500/20 text-green-400"
                          : app.status === "REJECTED" ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                        }`}>
                          {app.status === "ACCEPTED" ? "수락됨" : app.status === "REJECTED" ? "거절됨" : "검토중"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {app.status === "PENDING" && (
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleApplication(app.id, "ACCEPTED")}
                              className="px-2.5 py-1 rounded bg-green-500/20 text-green-400 text-xs hover:bg-green-500/30 transition-colors"
                            >
                              수락
                            </button>
                            <button
                              onClick={() => handleApplication(app.id, "REJECTED")}
                              className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30 transition-colors"
                            >
                              거절
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
