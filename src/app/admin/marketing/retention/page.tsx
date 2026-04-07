"use client";

import { useEffect, useState } from "react";
import BarChartComponent from "@/components/charts/BarChartComponent";

// ── Mock data ────────────────────────────────────────────────────────────────
const COHORT_DATA = [
  { week: "2026-W10", w0: 100, w1: 42, w2: 28, w3: 19, w4: 14 },
  { week: "2026-W11", w0: 100, w1: 38, w2: 24, w3: 17, w4: 12 },
  { week: "2026-W12", w0: 100, w1: 45, w2: 31, w3: 22, w4: null },
  { week: "2026-W13", w0: 100, w1: 41, w2: 27, w3: null, w4: null },
  { week: "2026-W14", w0: 100, w1: 39, w2: null, w3: null, w4: null },
];

const METRICS = [
  { label: "DAU",  value: "1,248", sub: "일 활성 사용자" },
  { label: "WAU",  value: "4,830", sub: "주 활성 사용자" },
  { label: "MAU",  value: "12,100", sub: "월 활성 사용자" },
];

const ACTIVITY_DATA = [
  { name: "검색",     value: 8_420 },
  { name: "프로필",   value: 6_130 },
  { name: "갤러리",   value: 5_280 },
  { name: "캠페인",   value: 3_940 },
  { name: "대시보드", value: 2_810 },
];

const COHORT_COLS = [
  { key: "w0", label: "Week 0" },
  { key: "w1", label: "Week 1" },
  { key: "w2", label: "Week 2" },
  { key: "w3", label: "Week 3" },
  { key: "w4", label: "Week 4" },
];

function retentionColor(val: number | null): string {
  if (val === null) return "transparent";
  if (val >= 80) return "rgba(124,58,237,0.9)";
  if (val >= 50) return "rgba(124,58,237,0.55)";
  if (val >= 20) return "rgba(124,58,237,0.3)";
  return "rgba(124,58,237,0.12)";
}

function retentionText(val: number | null): string {
  if (val === null) return "-";
  return `${val}%`;
}

// ── Component ────────────────────────────────────────────────────────────────
export default function RetentionPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch from /api/admin/marketing/retention/cohort and /activity
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 1280, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 28, marginTop: 0 }}>
        유지 분석
      </h1>

      {/* ── DAU/WAU/MAU Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {METRICS.map((m) => (
          <div
            key={m.label}
            style={{
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: 12,
              padding: "20px 24px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>{m.sub}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#7c3aed", marginBottom: 4 }}>{m.value}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af" }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* ── Cohort Retention Table ── */}
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
          코호트 리텐션
        </h2>
        {loading ? (
          <div style={{ height: 200, background: "#F3F4F6", borderRadius: 8 }} />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                  <th
                    style={{
                      textAlign: "left",
                      fontSize: 12,
                      color: "#6b7280",
                      fontWeight: 500,
                      paddingBottom: 10,
                      paddingRight: 16,
                    }}
                  >
                    가입 주차
                  </th>
                  {COHORT_COLS.map((col) => (
                    <th
                      key={col.key}
                      style={{
                        textAlign: "center",
                        fontSize: 12,
                        color: "#6b7280",
                        fontWeight: 500,
                        paddingBottom: 10,
                        paddingRight: 8,
                      }}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COHORT_DATA.map((row) => (
                  <tr key={row.week} style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td style={{ padding: "8px 16px 8px 0", fontSize: 12, color: "#374151", fontWeight: 500 }}>
                      {row.week}
                    </td>
                    {COHORT_COLS.map((col) => {
                      const val = row[col.key as keyof typeof row] as number | null;
                      return (
                        <td key={col.key} style={{ padding: "6px 8px", textAlign: "center" }}>
                          <div
                            style={{
                              display: "inline-block",
                              minWidth: 52,
                              padding: "4px 8px",
                              borderRadius: 6,
                              background: retentionColor(val),
                              fontSize: 12,
                              fontWeight: val !== null ? 600 : 400,
                              color: val !== null && val >= 30 ? "#fff" : "#374151",
                            }}
                          >
                            {retentionText(val)}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Activity Chart ── */}
      <section
        style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          padding: 24,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginTop: 0, marginBottom: 16 }}>
          기능별 사용량
        </h2>
        {loading ? (
          <div style={{ height: 220, background: "#F3F4F6", borderRadius: 8 }} />
        ) : (
          <BarChartComponent data={ACTIVITY_DATA} />
        )}
      </section>
    </div>
  );
}
