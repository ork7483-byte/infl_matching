"use client";

import { useEffect, useState } from "react";

// ── Mock data ────────────────────────────────────────────────────────────────
const SIGNUP_STEPS = [
  { label: "랜딩 방문",  count: 12_840, rate: 100,  dropoff: null },
  { label: "역할 선택",  count:  3_082, rate:  24.0, dropoff: "76.0%" },
  { label: "폼 입력",    count:  2_053, rate:  16.0, dropoff: "33.4%" },
  { label: "가입 완료",  count:    873, rate:   6.8, dropoff: "57.5%" },
];

const ROLE_CARDS = [
  { role: "브랜드",       rate: "5.2%", count: 341, color: "#7c3aed" },
  { role: "크리에이터",   rate: "8.1%", count: 532, color: "#10b981" },
];

const DROPOFF_TABLE = [
  { page: "랜딩 페이지",   exits:  9_758, pct: "76.0%" },
  { page: "역할 선택 페이지", exits: 1_029, pct: "33.4%" },
  { page: "폼 입력 페이지",  exits: 1_180, pct: "57.5%" },
];

// ── Component ────────────────────────────────────────────────────────────────
export default function ConversionPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch from /api/admin/marketing/conversion/steps and /dropoff
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 1280, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 28, marginTop: 0 }}>
        전환 분석
      </h1>

      {/* ── Signup Funnel Steps ── */}
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
          가입 퍼널 단계
        </h2>
        {loading ? (
          <div style={{ height: 260, background: "#F3F4F6", borderRadius: 8 }} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {SIGNUP_STEPS.map((step, idx) => (
              <div key={step.label}>
                {/* Dropoff indicator */}
                {step.dropoff && (
                  <div
                    style={{
                      fontSize: 11,
                      color: "#ef4444",
                      fontWeight: 600,
                      marginBottom: 6,
                      paddingLeft: 120,
                    }}
                  >
                    ↓ {step.dropoff} 이탈
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {/* Step index */}
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: "#7c3aed",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </div>
                  {/* Label */}
                  <div style={{ width: 80, fontSize: 13, fontWeight: 500, color: "#111827", flexShrink: 0 }}>
                    {step.label}
                  </div>
                  {/* Bar */}
                  <div
                    style={{
                      flex: 1,
                      height: 32,
                      background: "#F3F4F6",
                      borderRadius: 6,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${step.rate}%`,
                        background: "rgba(124,58,237,0.85)",
                        borderRadius: 6,
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: 10,
                      }}
                    >
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#fff", whiteSpace: "nowrap" }}>
                        {step.count.toLocaleString()} ({step.rate}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Role Comparison ── */}
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
          역할별 전환율
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {ROLE_CARDS.map((card) => (
            <div
              key={card.role}
              style={{
                background: "#F9FAFB",
                border: "1px solid #E5E7EB",
                borderRadius: 10,
                padding: "20px 24px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>{card.role}</div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: card.color,
                  marginBottom: 6,
                }}
              >
                {card.rate}
              </div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>
                {card.count.toLocaleString()}명 가입 완료
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Dropoff Analysis Table ── */}
      <section
        style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          padding: 24,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginTop: 0, marginBottom: 16 }}>
          페이지별 이탈 분석
        </h2>
        {loading ? (
          <div style={{ height: 140, background: "#F3F4F6", borderRadius: 8 }} />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                {["페이지", "이탈수", "이탈률"].map((h) => (
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
              {DROPOFF_TABLE.map((row) => (
                <tr key={row.page} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td style={{ padding: "11px 16px 11px 0", fontSize: 13, color: "#111827" }}>
                    {row.page}
                  </td>
                  <td style={{ padding: "11px 16px 11px 0", fontSize: 13, color: "#374151" }}>
                    {row.exits.toLocaleString()}
                  </td>
                  <td style={{ padding: "11px 0" }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#ef4444",
                        background: "#ef444418",
                        borderRadius: 4,
                        padding: "2px 8px",
                      }}
                    >
                      {row.pct}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
