"use client";

import { useEffect, useState } from "react";
import LineChartComponent from "@/components/charts/LineChartComponent";

// ── Mock data ────────────────────────────────────────────────────────────────
const FUNNEL_STAGES = [
  { label: "방문",      count: 12_840, rate: 100,  pct: "100%" },
  { label: "가입시작",  count:  2_710, rate:  21.1, pct: "21.1%" },
  { label: "가입완료",  count:    872, rate:   6.8, pct: "6.8%" },
  { label: "첫사용",    count:    431, rate:   3.4, pct: "3.4%" },
  { label: "재방문",    count:    218, rate:   1.7, pct: "1.7%" },
];

// Conversion rate between consecutive stages
const BETWEEN_RATES = ["21.1%", "32.2%", "49.4%", "50.6%"];

const TREND_DATA = Array.from({ length: 30 }, (_, i) => ({
  date: `${i + 1}일`,
  value: Math.floor(80 + Math.sin(i / 4) * 30 + Math.random() * 40),
}));

const CONVERSION_TABLE = [
  { stage: "방문 → 가입시작",   count: 2_710, rate: "21.1%", wow: "+1.2%p" },
  { stage: "가입시작 → 가입완료", count: 872,  rate: "32.2%", wow: "-0.8%p" },
  { stage: "가입완료 → 첫사용",  count: 431,   rate: "49.4%", wow: "+3.1%p" },
  { stage: "첫사용 → 재방문",    count: 218,   rate: "50.6%", wow: "+0.4%p" },
];

// ── Component ────────────────────────────────────────────────────────────────
export default function FunnelPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch from /api/admin/marketing/funnel/stats and /funnel/trend
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const maxCount = FUNNEL_STAGES[0].count;

  return (
    <div style={{ padding: 24, maxWidth: 1280, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 28, marginTop: 0 }}>
        퍼널 대시보드
      </h1>

      {/* ── Funnel Visualization ── */}
      <section
        style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginTop: 0, marginBottom: 20 }}>
          퍼널 시각화
        </h2>
        {loading ? (
          <div style={{ height: 260, background: "#F3F4F6", borderRadius: 8 }} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {FUNNEL_STAGES.map((stage, idx) => {
              const barWidth = (stage.count / maxCount) * 100;
              const opacity = 1 - idx * 0.15;
              return (
                <div key={stage.label}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 2 }}>
                    <div style={{ width: 72, fontSize: 12, color: "#6b7280", textAlign: "right", flexShrink: 0 }}>
                      {stage.label}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        height: 36,
                        background: "#F3F4F6",
                        borderRadius: 6,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${barWidth}%`,
                          background: `rgba(124,58,237,${opacity})`,
                          borderRadius: 6,
                          display: "flex",
                          alignItems: "center",
                          paddingLeft: 10,
                          transition: "width 0.6s ease",
                        }}
                      >
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#fff", whiteSpace: "nowrap" }}>
                          {stage.count.toLocaleString()} ({stage.pct})
                        </span>
                      </div>
                    </div>
                  </div>
                  {idx < FUNNEL_STAGES.length - 1 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 12, height: 22 }}>
                      <div style={{ width: 72, flexShrink: 0 }} />
                      <div style={{ paddingLeft: 10, fontSize: 11, color: "#ef4444", fontWeight: 600 }}>
                        ↓ 전환율 {BETWEEN_RATES[idx]}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Trend Chart ── */}
      <section
        style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginTop: 0, marginBottom: 16 }}>
          30일 방문 추이
        </h2>
        {loading ? (
          <div style={{ height: 220, background: "#F3F4F6", borderRadius: 8 }} />
        ) : (
          <LineChartComponent data={TREND_DATA} showArea color="#7c3aed" />
        )}
      </section>

      {/* ── Conversion Rates Table ── */}
      <section
        style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          padding: 24,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginTop: 0, marginBottom: 16 }}>
          단계별 전환율
        </h2>
        {loading ? (
          <div style={{ height: 160, background: "#F3F4F6", borderRadius: 8 }} />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                {["단계", "전환수", "전환율", "전주 대비"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      fontSize: 12,
                      color: "#6b7280",
                      fontWeight: 500,
                      paddingBottom: 10,
                      paddingRight: 16,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CONVERSION_TABLE.map((row) => {
                const isPositive = row.wow.startsWith("+");
                return (
                  <tr key={row.stage} style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td style={{ padding: "11px 16px 11px 0", fontSize: 13, color: "#111827" }}>
                      {row.stage}
                    </td>
                    <td style={{ padding: "11px 16px 11px 0", fontSize: 13, color: "#374151" }}>
                      {row.count.toLocaleString()}
                    </td>
                    <td style={{ padding: "11px 16px 11px 0" }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#7c3aed",
                          background: "#7c3aed18",
                          borderRadius: 4,
                          padding: "2px 8px",
                        }}
                      >
                        {row.rate}
                      </span>
                    </td>
                    <td style={{ padding: "11px 0" }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: isPositive ? "#10b981" : "#ef4444",
                          background: isPositive ? "#10b98118" : "#ef444418",
                          borderRadius: 4,
                          padding: "2px 8px",
                        }}
                      >
                        {row.wow}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
