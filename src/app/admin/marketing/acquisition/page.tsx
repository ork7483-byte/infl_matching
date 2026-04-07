"use client";

import { useEffect, useState } from "react";
import BarChartComponent from "@/components/charts/BarChartComponent";

// ── Mock data ────────────────────────────────────────────────────────────────
const CHANNEL_CHART_DATA = [
  { name: "google",    value: 4_820 },
  { name: "instagram", value: 3_140 },
  { name: "facebook",  value:   870 },
  { name: "kakao",     value: 1_920 },
  { name: "naver",     value: 1_540 },
  { name: "direct",    value:   640 },
];

const CHANNEL_STATS = [
  { channel: "google",    visits: 4_820, signups: 312, rate: "6.47%" },
  { channel: "instagram", visits: 3_140, signups: 187, rate: "5.96%" },
  { channel: "kakao",     visits: 1_920, signups:  98, rate: "5.10%" },
  { channel: "naver",     visits: 1_540, signups:  72, rate: "4.68%" },
  { channel: "facebook",  visits:   870, signups:  31, rate: "3.56%" },
  { channel: "direct",    visits:   640, signups:  18, rate: "2.81%" },
];

const CAMPAIGN_STATS = [
  { name: "Spring 2026",   source: "google",    visits: 2_100, signups: 158, rate: "7.52%" },
  { name: "Creator Push",  source: "instagram", visits: 1_840, signups: 110, rate: "5.98%" },
  { name: "Brand Retarget",source: "facebook",  visits:   820, signups:  29, rate: "3.54%" },
  { name: "Launch PR",     source: "naver",     visits:   960, signups:  48, rate: "5.00%" },
  { name: "Awareness",     source: "kakao",     visits: 1_200, signups:  54, rate: "4.50%" },
];

const MAX_VISITS = CHANNEL_STATS[0].visits;

// ── Component ────────────────────────────────────────────────────────────────
export default function AcquisitionPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch from /api/admin/marketing/acquisition/channels and /campaigns
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 1280, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 28, marginTop: 0 }}>
        유입 분석
      </h1>

      {/* ── Channel Bar Chart ── */}
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
          채널별 방문수
        </h2>
        {loading ? (
          <div style={{ height: 220, background: "#F3F4F6", borderRadius: 8 }} />
        ) : (
          <BarChartComponent data={CHANNEL_CHART_DATA} />
        )}
      </section>

      {/* ── Channel Stats Table ── */}
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
          채널별 성과
        </h2>
        {loading ? (
          <div style={{ height: 200, background: "#F3F4F6", borderRadius: 8 }} />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                {["채널", "방문수", "가입수", "전환율", "방문 비율"].map((h) => (
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
              {CHANNEL_STATS.map((row) => {
                const barPct = (row.visits / MAX_VISITS) * 100;
                return (
                  <tr key={row.channel} style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td style={{ padding: "11px 16px 11px 0", fontSize: 13, fontWeight: 600, color: "#111827" }}>
                      {row.channel}
                    </td>
                    <td style={{ padding: "11px 16px 11px 0", fontSize: 13, color: "#374151" }}>
                      {row.visits.toLocaleString()}
                    </td>
                    <td style={{ padding: "11px 16px 11px 0", fontSize: 13, color: "#374151" }}>
                      {row.signups.toLocaleString()}
                    </td>
                    <td style={{ padding: "11px 16px 11px 0" }}>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#10b981",
                          background: "#10b98118",
                          borderRadius: 4,
                          padding: "2px 8px",
                        }}
                      >
                        {row.rate}
                      </span>
                    </td>
                    <td style={{ padding: "11px 0", width: 160 }}>
                      <div
                        style={{
                          height: 8,
                          background: "#F3F4F6",
                          borderRadius: 4,
                          overflow: "hidden",
                          width: "100%",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${barPct}%`,
                            background: "#7c3aed",
                            borderRadius: 4,
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      {/* ── Campaign Performance Table ── */}
      <section
        style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          padding: 24,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginTop: 0, marginBottom: 16 }}>
          캠페인 성과
        </h2>
        {loading ? (
          <div style={{ height: 180, background: "#F3F4F6", borderRadius: 8 }} />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                {["캠페인", "소스", "방문수", "가입수", "전환율"].map((h) => (
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
              {CAMPAIGN_STATS.map((row) => (
                <tr key={row.name} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td style={{ padding: "11px 16px 11px 0", fontSize: 13, fontWeight: 500, color: "#111827" }}>
                    {row.name}
                  </td>
                  <td style={{ padding: "11px 16px 11px 0" }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#7c3aed",
                        background: "#7c3aed18",
                        borderRadius: 4,
                        padding: "2px 8px",
                      }}
                    >
                      {row.source}
                    </span>
                  </td>
                  <td style={{ padding: "11px 16px 11px 0", fontSize: 13, color: "#374151" }}>
                    {row.visits.toLocaleString()}
                  </td>
                  <td style={{ padding: "11px 16px 11px 0", fontSize: 13, color: "#374151" }}>
                    {row.signups.toLocaleString()}
                  </td>
                  <td style={{ padding: "11px 0" }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#10b981",
                        background: "#10b98118",
                        borderRadius: 4,
                        padding: "2px 8px",
                      }}
                    >
                      {row.rate}
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
