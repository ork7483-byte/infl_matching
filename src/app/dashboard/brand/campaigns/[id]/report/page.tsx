"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import BarChartComponent from "@/components/charts/BarChartComponent";
import LineChartComponent from "@/components/charts/LineChartComponent";

const MOCK_CAMPAIGN_NAME = "여름 신제품 론칭 캠페인";
const MOCK_DATE_RANGE = "2025-06-01 ~ 2025-06-30";

const MOCK_SUMMARY = {
  totalReach: 420000,
  totalEngagement: 18900,
  totalImpressions: 580000,
  avgEngagementRate: 4.5,
  totalSpend: 2850000,
  roi: 3.2,
};

const MOCK_INFLUENCERS = [
  { name: "@beauty_j", platform: "Instagram", followers: "125K", posts: 3, reach: 180000, engagement: 8200, er: "6.5%", spend: 800000 },
  { name: "@life_mia", platform: "Instagram", followers: "88K", posts: 2, reach: 142000, engagement: 5600, er: "5.2%", spend: 600000 },
  { name: "@travel_k", platform: "TikTok", followers: "204K", posts: 2, reach: 98000, engagement: 3400, er: "3.8%", spend: 900000 },
];

const MOCK_POSTS = [
  { influencer: "@beauty_j", type: "FEED", likes: 4200, comments: 180, shares: 320, reach: 32000 },
  { influencer: "@beauty_j", type: "REEL", likes: 6800, comments: 290, shares: 510, reach: 68000 },
  { influencer: "@life_mia", type: "STORY", likes: 2100, comments: 45, shares: 180, reach: 44000 },
  { influencer: "@travel_k", type: "REEL", likes: 1800, comments: 62, shares: 240, reach: 98000 },
];

const MOCK_AUDIENCE = {
  ageGroups: [
    { group: "18-24", pct: 28 },
    { group: "25-34", pct: 42 },
    { group: "35-44", pct: 18 },
    { group: "45+", pct: 12 },
  ],
  genders: [{ label: "여성", pct: 68 }, { label: "남성", pct: 32 }],
  topLocations: ["서울 (34%)", "경기 (19%)", "부산 (8%)", "인천 (6%)", "기타 (33%)"],
};

const MOCK_TIMELINE = [
  { date: "6/1", value: 1200 },
  { date: "6/5", value: 3400 },
  { date: "6/10", value: 5800 },
  { date: "6/15", value: 9200 },
  { date: "6/20", value: 13600 },
  { date: "6/25", value: 17800 },
  { date: "6/30", value: 18900 },
];

function formatNumber(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

type Section = "summary" | "influencer" | "post" | "audience" | "roi";

export default function CampaignReportPage() {
  const params = useParams();
  const id = params?.id as string;
  const [downloading, setDownloading] = useState<"pdf" | "excel" | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("summary");

  async function handleDownload(format: "pdf" | "excel") {
    setDownloading(format);
    try {
      const res = await fetch(`/api/campaigns/${id}/report?format=${format}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `campaign-report-${id}.${format === "pdf" ? "pdf" : "xlsx"}`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        alert("다운로드 기능은 준비 중입니다.");
      }
    } catch {
      alert("다운로드 기능은 준비 중입니다.");
    } finally {
      setDownloading(null);
    }
  }

  const SECTIONS: { key: Section; label: string }[] = [
    { key: "summary", label: "캠페인 요약" },
    { key: "influencer", label: "인플루언서별" },
    { key: "post", label: "게시물별" },
    { key: "audience", label: "오디언스" },
    { key: "roi", label: "ROI" },
  ];

  return (
    <DashboardLayout role="brand">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href={`/dashboard/brand/campaigns/${id}`} className="text-muted-foreground hover:text-foreground transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-xl font-bold text-foreground">캠페인 리포트</h1>
            </div>
            <p className="text-sm text-muted-foreground">{MOCK_CAMPAIGN_NAME} · {MOCK_DATE_RANGE}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleDownload("pdf")}
              disabled={downloading !== null}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-purple text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {downloading === "pdf" ? "다운로드 중..." : "PDF 다운로드"}
            </button>
            <button
              onClick={() => handleDownload("excel")}
              disabled={downloading !== null}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-foreground text-sm font-medium hover:bg-card-hover transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {downloading === "excel" ? "다운로드 중..." : "Excel 다운로드"}
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-1 bg-card border border-border rounded-lg p-1 w-fit overflow-x-auto">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                activeSection === s.key
                  ? "bg-brand-purple text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Section: Campaign Summary */}
        {activeSection === "summary" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "총 도달", value: formatNumber(MOCK_SUMMARY.totalReach) },
                { label: "총 참여", value: formatNumber(MOCK_SUMMARY.totalEngagement) },
                { label: "총 임프레션", value: formatNumber(MOCK_SUMMARY.totalImpressions) },
                { label: "평균 참여율", value: `${MOCK_SUMMARY.avgEngagementRate}%` },
                { label: "총 집행 예산", value: `₩${MOCK_SUMMARY.totalSpend.toLocaleString()}` },
                { label: "ROI", value: `${MOCK_SUMMARY.roi}x` },
              ].map((item) => (
                <div key={item.label} className="bg-card border border-border rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-2">{item.label}</p>
                  <p className="text-2xl font-bold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">참여 추이</h3>
              <LineChartComponent data={MOCK_TIMELINE} showArea color="#7c3aed" />
            </div>
          </div>
        )}

        {/* Section: Per Influencer */}
        {activeSection === "influencer" && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">인플루언서별 도달 수</h3>
              <BarChartComponent
                data={MOCK_INFLUENCERS.map((i) => ({ name: i.name, value: i.reach }))}
              />
            </div>
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      {["인플루언서", "플랫폼", "팔로워", "게시물", "도달", "참여", "참여율", "집행금액"].map((h) => (
                        <th key={h} className="text-left px-5 py-3 text-muted-foreground font-medium whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_INFLUENCERS.map((inf) => (
                      <tr key={inf.name} className="border-b border-border/50 hover:bg-card-hover transition-colors">
                        <td className="px-5 py-3.5 font-medium text-foreground">{inf.name}</td>
                        <td className="px-5 py-3.5 text-muted-foreground">{inf.platform}</td>
                        <td className="px-5 py-3.5 text-muted-foreground">{inf.followers}</td>
                        <td className="px-5 py-3.5 text-muted-foreground">{inf.posts}</td>
                        <td className="px-5 py-3.5 text-foreground">{formatNumber(inf.reach)}</td>
                        <td className="px-5 py-3.5 text-foreground">{formatNumber(inf.engagement)}</td>
                        <td className="px-5 py-3.5 text-green-400">{inf.er}</td>
                        <td className="px-5 py-3.5 text-foreground">₩{inf.spend.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Section: Per Post */}
        {activeSection === "post" && (
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["인플루언서", "콘텐츠 유형", "좋아요", "댓글", "공유", "도달"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-muted-foreground font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_POSTS.map((post, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-card-hover transition-colors">
                      <td className="px-5 py-3.5 font-medium text-foreground">{post.influencer}</td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded bg-brand-purple/15 text-brand-purple text-xs">{post.type}</span>
                      </td>
                      <td className="px-5 py-3.5 text-foreground">{post.likes.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-foreground">{post.comments.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-foreground">{post.shares.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-foreground">{formatNumber(post.reach)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section: Audience */}
        {activeSection === "audience" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">연령대 분포</h3>
              <div className="space-y-3">
                {MOCK_AUDIENCE.ageGroups.map((ag) => (
                  <div key={ag.group}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{ag.group}</span>
                      <span className="text-foreground font-medium">{ag.pct}%</span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2">
                      <div
                        className="bg-gradient-brand h-2 rounded-full transition-all duration-500"
                        style={{ width: `${ag.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">성별 분포</h3>
                <div className="space-y-3">
                  {MOCK_AUDIENCE.genders.map((g) => (
                    <div key={g.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{g.label}</span>
                        <span className="text-foreground font-medium">{g.pct}%</span>
                      </div>
                      <div className="w-full bg-border rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${g.label === "여성" ? "bg-brand-pink" : "bg-brand-purple"}`}
                          style={{ width: `${g.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">주요 지역</h3>
                <ul className="space-y-2">
                  {MOCK_AUDIENCE.topLocations.map((loc) => (
                    <li key={loc} className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-purple flex-shrink-0" />
                      {loc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Section: ROI */}
        {activeSection === "roi" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: "총 집행 예산", value: `₩${MOCK_SUMMARY.totalSpend.toLocaleString()}`, sub: "원" },
                { label: "추정 매출 기여", value: `₩${(MOCK_SUMMARY.totalSpend * MOCK_SUMMARY.roi).toLocaleString()}`, sub: "원" },
                { label: "ROI", value: `${MOCK_SUMMARY.roi}x`, sub: "투자 대비 수익" },
              ].map((item) => (
                <div key={item.label} className="bg-card border border-border rounded-xl p-5">
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className="text-2xl font-bold text-foreground">{item.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.sub}</p>
                </div>
              ))}
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">인플루언서별 CPE (참여당 비용)</h3>
              <BarChartComponent
                data={MOCK_INFLUENCERS.map((i) => ({
                  name: i.name,
                  value: Math.round(i.spend / i.engagement),
                }))}
                gradientFrom="#e94560"
                gradientTo="#7c3aed"
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
