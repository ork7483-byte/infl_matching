"use client";

import { useEffect, useState } from "react";
import LineChartComponent from "@/components/charts/LineChartComponent";
import DonutChart from "@/components/charts/DonutChart";

interface StatCard {
  icon: string;
  label: string;
  value: string;
  change: number;
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface RecentCampaign {
  id: string;
  title: string;
  brand: string;
  status: string;
  budget: number;
}

interface SignupPoint {
  date: string;
  value: number;
}

interface RoleRatio {
  name: string;
  value: number;
  color: string;
}

function Skeleton({ w = "100%", h = 20 }: { w?: string; h?: number }) {
  return (
    <div
      style={{
        width: w,
        height: h,
        background: "#E5E7EB",
        borderRadius: 6,
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    />
  );
}

const today = new Date().toLocaleDateString("ko-KR", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const MOCK_STATS: StatCard[] = [
  { icon: "👥", label: "총 가입자", value: "1,248", change: 12.4 },
  { icon: "📅", label: "오늘 가입", value: "34", change: 5.2 },
  { icon: "📢", label: "활성 캠페인", value: "87", change: -2.1 },
  { icon: "💰", label: "총 매출", value: "₩24,500,000", change: 18.7 },
];

const MOCK_SIGNUPS: SignupPoint[] = Array.from({ length: 30 }, (_, i) => ({
  date: `${i + 1}일`,
  value: Math.floor(Math.random() * 50) + 10,
}));

const MOCK_ROLES: RoleRatio[] = [
  { name: "브랜드", value: 420, color: "#7c3aed" },
  { name: "크리에이터", value: 780, color: "#06b6d4" },
  { name: "관리자", value: 48, color: "#f59e0b" },
];

const MOCK_USERS: RecentUser[] = [
  { id: "1", name: "김민준", email: "minjun@example.com", role: "BRAND", createdAt: "2026-04-07" },
  { id: "2", name: "이서연", email: "seoyeon@example.com", role: "CREATOR", createdAt: "2026-04-07" },
  { id: "3", name: "박지훈", email: "jihoon@example.com", role: "CREATOR", createdAt: "2026-04-06" },
  { id: "4", name: "최수아", email: "sua@example.com", role: "BRAND", createdAt: "2026-04-06" },
  { id: "5", name: "정도윤", email: "doyun@example.com", role: "CREATOR", createdAt: "2026-04-05" },
];

const MOCK_CAMPAIGNS: RecentCampaign[] = [
  { id: "1", title: "봄 신상 프로모션", brand: "패션브랜드A", status: "ACTIVE", budget: 5000000 },
  { id: "2", title: "뷰티 콜라보", brand: "코스메틱B", status: "ACTIVE", budget: 3200000 },
  { id: "3", title: "여행 패키지 홍보", brand: "여행사C", status: "DRAFT", budget: 1800000 },
  { id: "4", title: "신제품 런칭", brand: "테크D", status: "COMPLETED", budget: 7500000 },
  { id: "5", title: "라이프스타일 캠페인", brand: "리빙E", status: "PAUSED", budget: 2100000 },
];

const ROLE_COLORS: Record<string, string> = {
  BRAND: "#7c3aed",
  CREATOR: "#06b6d4",
  ADMIN: "#f59e0b",
};

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "#10b981",
  DRAFT: "#6b7280",
  COMPLETED: "#3b82f6",
  PAUSED: "#f59e0b",
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats] = useState<StatCard[]>(MOCK_STATS);
  const [signups] = useState<SignupPoint[]>(MOCK_SIGNUPS);
  const [roles] = useState<RoleRatio[]>(MOCK_ROLES);
  const [recentUsers] = useState<RecentUser[]>(MOCK_USERS);
  const [recentCampaigns] = useState<RecentCampaign[]>(MOCK_CAMPAIGNS);

  useEffect(() => {
    // Simulate fetch from /api/admin/dashboard/stats, /signups, /recent
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ padding: "24px", maxWidth: 1280, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>
          Inflix 운영 대시보드
        </h1>
        <p style={{ color: "#6b7280", fontSize: 14, marginTop: 4 }}>{today}</p>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 16,
          marginBottom: 24,
        }}
        className="md:grid-cols-4"
      >
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 12,
                  padding: 20,
                }}
              >
                <Skeleton h={40} />
              </div>
            ))
          : stats.map((s, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 12,
                  padding: 20,
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#111827" }}>{s.value}</div>
                <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{s.label}</div>
                <div
                  style={{
                    fontSize: 12,
                    marginTop: 6,
                    color: s.change >= 0 ? "#10b981" : "#ef4444",
                    fontWeight: 600,
                  }}
                >
                  {s.change >= 0 ? "↑" : "↓"} {Math.abs(s.change)}%
                </div>
              </div>
            ))}
      </div>

      {/* Row 2: Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div
          style={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 16, marginTop: 0 }}>
            30일 가입 추이
          </h2>
          {loading ? (
            <Skeleton h={220} />
          ) : (
            <LineChartComponent data={signups} showArea color="#7c3aed" />
          )}
        </div>
        <div
          style={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 16, marginTop: 0 }}>
            역할별 비율
          </h2>
          {loading ? (
            <Skeleton h={220} />
          ) : (
            <DonutChart data={roles} />
          )}
        </div>
      </div>

      {/* Row 3: Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent Users */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 16, marginTop: 0 }}>
            최근 가입자
          </h2>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} h={32} />)}
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 360 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                  {["이름", "이메일", "역할", "가입일"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        fontSize: 12,
                        color: "#6b7280",
                        fontWeight: 500,
                        paddingBottom: 8,
                        paddingRight: 12,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u) => (
                  <tr key={u.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td style={{ padding: "8px 12px 8px 0", fontSize: 13, color: "#111827" }}>{u.name}</td>
                    <td style={{ padding: "8px 12px 8px 0", fontSize: 12, color: "#6b7280" }}>{u.email}</td>
                    <td style={{ padding: "8px 12px 8px 0" }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: ROLE_COLORS[u.role] ?? "#6b7280",
                          background: `${ROLE_COLORS[u.role] ?? "#6b7280"}18`,
                          borderRadius: 4,
                          padding: "2px 6px",
                        }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: "8px 0 8px 0", fontSize: 12, color: "#6b7280" }}>{u.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>

        {/* Recent Campaigns */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: 12,
            padding: 20,
          }}
        >
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 16, marginTop: 0 }}>
            최근 캠페인
          </h2>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} h={32} />)}
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 360 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                  {["캠페인명", "브랜드", "상태", "예산"].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        fontSize: 12,
                        color: "#6b7280",
                        fontWeight: 500,
                        paddingBottom: 8,
                        paddingRight: 12,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentCampaigns.map((c) => (
                  <tr key={c.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td style={{ padding: "8px 12px 8px 0", fontSize: 13, color: "#111827" }}>{c.title}</td>
                    <td style={{ padding: "8px 12px 8px 0", fontSize: 12, color: "#6b7280" }}>{c.brand}</td>
                    <td style={{ padding: "8px 12px 8px 0" }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: STATUS_COLORS[c.status] ?? "#6b7280",
                          background: `${STATUS_COLORS[c.status] ?? "#6b7280"}18`,
                          borderRadius: 4,
                          padding: "2px 6px",
                        }}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td style={{ padding: "8px 0 8px 0", fontSize: 12, color: "#6b7280" }}>
                      ₩{c.budget.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @media (min-width: 768px) {
          .md\\:grid-cols-4 { grid-template-columns: repeat(4, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
