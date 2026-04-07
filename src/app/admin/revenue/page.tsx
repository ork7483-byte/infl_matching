"use client";

import { useEffect, useState } from "react";

interface Payment {
  id: string;
  influencer: string;
  campaign: string;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
}

const MOCK_PAYMENTS: Payment[] = [
  { id: "1", influencer: "이서연", campaign: "봄 신상 프로모션", amount: 480000, status: "PENDING" },
  { id: "2", influencer: "박지훈", campaign: "뷰티 콜라보", amount: 320000, status: "COMPLETED" },
  { id: "3", influencer: "정도윤", campaign: "뷰티 콜라보", amount: 290000, status: "PENDING" },
  { id: "4", influencer: "윤아영", campaign: "신제품 런칭", amount: 750000, status: "COMPLETED" },
  { id: "5", influencer: "강현우", campaign: "식품 브랜드 알리기", amount: 210000, status: "FAILED" },
  { id: "6", influencer: "손예림", campaign: "봄 신상 프로모션", amount: 520000, status: "PENDING" },
];

const STATUS_COLORS: Record<string, { text: string; bg: string }> = {
  PENDING: { text: "#f59e0b", bg: "#f59e0b18" },
  COMPLETED: { text: "#10b981", bg: "#10b98118" },
  FAILED: { text: "#ef4444", bg: "#ef444418" },
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "대기중",
  COMPLETED: "완료",
  FAILED: "실패",
};

const PLAN_DIST = [
  { label: "Free", count: 820, pct: 65.7, color: "#6b7280" },
  { label: "Pro", count: 392, pct: 31.4, color: "#7c3aed" },
  { label: "Enterprise", count: 36, pct: 2.9, color: "#10b981" },
];

export default function AdminRevenue() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>(MOCK_PAYMENTS);

  useEffect(() => {
    // Fetch from /api/admin/revenue/stats, /api/admin/revenue/payments
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const totalRevenue = 0;
  const thisMonth = 0;
  const pendingCount = payments.filter((p) => p.status === "PENDING").length;
  const completedCount = payments.filter((p) => p.status === "COMPLETED").length;

  const handleSettle = (id: string) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "COMPLETED" } : p))
    );
  };

  return (
    <div style={{ padding: "24px", maxWidth: 1280, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 24, marginTop: 0 }}>
        매출 / 정산
      </h1>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "총 매출", value: `₩${totalRevenue.toLocaleString()}`, icon: "💰", sub: "누적 기준" },
          { label: "이번달 매출", value: `₩${thisMonth.toLocaleString()}`, icon: "📅", sub: "2026년 4월" },
          { label: "대기중 정산", value: `${pendingCount}건`, icon: "⏳", sub: "처리 필요" },
          { label: "완료 정산", value: `${completedCount}건`, icon: "✅", sub: "이번달" },
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
              <div style={{ height: 64, background: "#E5E7EB", borderRadius: 6 }} />
            ) : (
              <>
                <div style={{ fontSize: 26, marginBottom: 6 }}>{card.icon}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>{card.value}</div>
                <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{card.label}</div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{card.sub}</div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Plan Distribution */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginTop: 0, marginBottom: 20 }}>
          플랜 분포
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {PLAN_DIST.map((plan) => (
            <div key={plan.label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{plan.label}</span>
                <span style={{ fontSize: 12, color: "#6b7280" }}>
                  {plan.count.toLocaleString()}명 ({plan.pct}%)
                </span>
              </div>
              <div style={{ height: 8, background: "#F3F4F6", borderRadius: 4, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${plan.pct}%`,
                    background: plan.color,
                    borderRadius: 4,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Early Access */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          padding: 20,
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div style={{ fontSize: 32 }}>⚡</div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#7c3aed" }}>247명</div>
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>얼리 액세스 가입자</div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#7c3aed",
              background: "#7c3aed18",
              borderRadius: 6,
              padding: "4px 12px",
            }}
          >
            전체의 19.8%
          </span>
        </div>
      </div>

      {/* Payment Table */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E7EB" }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111827", margin: 0 }}>정산 내역</h2>
        </div>
        {loading ? (
          <div style={{ padding: 24 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ height: 44, background: "#F3F4F6", borderRadius: 6, marginBottom: 8 }} />
            ))}
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#F9FAFB" }}>
              <tr>
                {["인플루언서", "캠페인", "금액", "상태", "처리"].map((h) => (
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
              {payments.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#111827", fontWeight: 500 }}>{p.influencer}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#6b7280" }}>{p.campaign}</td>
                  <td style={{ padding: "12px 16px", fontSize: 13, color: "#374151", fontWeight: 600 }}>
                    ₩{p.amount.toLocaleString()}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        fontSize: 11, fontWeight: 600,
                        color: STATUS_COLORS[p.status].text,
                        background: STATUS_COLORS[p.status].bg,
                        borderRadius: 4, padding: "2px 7px",
                      }}
                    >
                      {STATUS_LABELS[p.status]}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {p.status === "PENDING" && (
                      <button
                        onClick={() => handleSettle(p.id)}
                        style={{
                          fontSize: 12, padding: "5px 12px", borderRadius: 6,
                          border: "none", background: "#7c3aed", color: "#fff",
                          cursor: "pointer", fontWeight: 600,
                        }}
                      >
                        정산 처리
                      </button>
                    )}
                    {p.status === "COMPLETED" && (
                      <span style={{ fontSize: 12, color: "#10b981" }}>완료됨</span>
                    )}
                    {p.status === "FAILED" && (
                      <span style={{ fontSize: 12, color: "#ef4444" }}>재처리 필요</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
