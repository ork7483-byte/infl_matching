"use client";

import { useEffect, useState } from "react";
import BarChartComponent from "@/components/charts/BarChartComponent";
import DonutChart from "@/components/charts/DonutChart";

interface Campaign {
  id: string;
  title: string;
  brand: string;
  influencerCount: number;
  status: "ACTIVE" | "COMPLETED" | "DRAFT" | "PAUSED";
  budget: number;
  startDate: string;
  endDate: string;
}

const STATUS_TABS = ["전체", "ACTIVE", "COMPLETED", "DRAFT", "PAUSED"];

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "#10b981",
  COMPLETED: "#3b82f6",
  DRAFT: "#6b7280",
  PAUSED: "#f59e0b",
};

const MOCK_CAMPAIGNS: Campaign[] = [
  { id: "1", title: "봄 신상 프로모션", brand: "패션브랜드A", influencerCount: 12, status: "ACTIVE", budget: 5000000, startDate: "2026-03-15", endDate: "2026-04-30" },
  { id: "2", title: "뷰티 콜라보", brand: "코스메틱B", influencerCount: 8, status: "ACTIVE", budget: 3200000, startDate: "2026-04-01", endDate: "2026-04-30" },
  { id: "3", title: "여행 패키지 홍보", brand: "여행사C", influencerCount: 3, status: "DRAFT", budget: 1800000, startDate: "2026-05-01", endDate: "2026-05-31" },
  { id: "4", title: "신제품 런칭", brand: "테크D", influencerCount: 20, status: "COMPLETED", budget: 7500000, startDate: "2026-02-01", endDate: "2026-03-31" },
  { id: "5", title: "라이프스타일 캠페인", brand: "리빙E", influencerCount: 6, status: "PAUSED", budget: 2100000, startDate: "2026-03-01", endDate: "2026-03-31" },
  { id: "6", title: "식품 브랜드 알리기", brand: "푸드F", influencerCount: 15, status: "ACTIVE", budget: 4400000, startDate: "2026-04-07", endDate: "2026-05-07" },
  { id: "7", title: "스포츠 용품 홍보", brand: "스포츠G", influencerCount: 9, status: "COMPLETED", budget: 2900000, startDate: "2026-01-15", endDate: "2026-02-28" },
];

const MONTHLY_CAMPAIGNS = [
  { name: "11월", value: 14 },
  { name: "12월", value: 18 },
  { name: "1월", value: 22 },
  { name: "2월", value: 19 },
  { name: "3월", value: 31 },
  { name: "4월", value: 12 },
];

const STATUS_DONUT = [
  { name: "활성", value: 37, color: "#10b981" },
  { name: "완료", value: 28, color: "#3b82f6" },
  { name: "초안", value: 14, color: "#6b7280" },
  { name: "일시정지", value: 8, color: "#f59e0b" },
];

export default function AdminCampaigns() {
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState("전체");

  useEffect(() => {
    // Fetch from /api/admin/campaigns, /api/admin/campaigns/stats
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const filtered = MOCK_CAMPAIGNS.filter(
    (c) => statusTab === "전체" || c.status === statusTab
  );

  const totalCampaigns = MOCK_CAMPAIGNS.length;
  const totalBudget = MOCK_CAMPAIGNS.reduce((s, c) => s + c.budget, 0);
  const activeCampaigns = MOCK_CAMPAIGNS.filter((c) => c.status === "ACTIVE").length;

  return (
    <div style={{ padding: "24px", maxWidth: 1280, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 24, marginTop: 0 }}>
        캠페인 모니터링
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "총 캠페인", value: totalCampaigns.toString(), icon: "📢" },
          { label: "총 예산", value: `₩${totalBudget.toLocaleString()}`, icon: "💰" },
          { label: "활성 캠페인", value: activeCampaigns.toString(), icon: "✅" },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: 12,
              padding: 20,
            }}
          >
            {loading ? (
              <div style={{ height: 60, background: "#E5E7EB", borderRadius: 6 }} />
            ) : (
              <>
                <div style={{ fontSize: 26, marginBottom: 8 }}>{card.icon}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>{card.value}</div>
                <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{card.label}</div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Status Filter */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16, flexWrap: "wrap" }}>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusTab(tab)}
            style={{
              fontSize: 13, padding: "6px 14px", borderRadius: 6,
              border: "1px solid",
              borderColor: statusTab === tab ? "#7c3aed" : "#E5E7EB",
              background: statusTab === tab ? "#7c3aed" : "#fff",
              color: statusTab === tab ? "#fff" : "#374151",
              cursor: "pointer",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Campaign Table */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          overflow: "hidden",
          overflowX: "auto",
          marginBottom: 24,
        }}
      >
        {loading ? (
          <div style={{ padding: 24 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ height: 44, background: "#F3F4F6", borderRadius: 6, marginBottom: 8 }} />
            ))}
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead style={{ background: "#F9FAFB" }}>
              <tr>
                {["캠페인명", "브랜드", "인플루언서", "상태", "예산", "기간", ""].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left", fontSize: 12, color: "#6b7280",
                      fontWeight: 500, padding: "10px 16px", borderBottom: "1px solid #E5E7EB",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td style={{ padding: "11px 16px", fontSize: 13, color: "#111827", fontWeight: 500 }}>{c.title}</td>
                  <td style={{ padding: "11px 16px", fontSize: 12, color: "#6b7280" }}>{c.brand}</td>
                  <td style={{ padding: "11px 16px", fontSize: 13, color: "#374151" }}>{c.influencerCount}명</td>
                  <td style={{ padding: "11px 16px" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      color: STATUS_COLORS[c.status],
                      background: `${STATUS_COLORS[c.status]}18`,
                      borderRadius: 4, padding: "2px 7px",
                    }}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ padding: "11px 16px", fontSize: 12, color: "#374151" }}>
                    ₩{c.budget.toLocaleString()}
                  </td>
                  <td style={{ padding: "11px 16px", fontSize: 11, color: "#6b7280" }}>
                    {c.startDate} ~ {c.endDate}
                  </td>
                  <td style={{ padding: "11px 16px" }}>
                    <button
                      style={{
                        fontSize: 12, padding: "4px 10px", borderRadius: 6,
                        border: "1px solid #E5E7EB", background: "#F9FAFB",
                        color: "#374151", cursor: "pointer",
                      }}
                    >
                      상세
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: 32, textAlign: "center", color: "#6b7280", fontSize: 13 }}>
                    해당하는 캠페인이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginTop: 0, marginBottom: 16 }}>
            월별 캠페인 생성
          </h2>
          <BarChartComponent data={MONTHLY_CAMPAIGNS} />
        </div>
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginTop: 0, marginBottom: 16 }}>
            상태 분포
          </h2>
          <DonutChart data={STATUS_DONUT} />
        </div>
      </div>
    </div>
  );
}
