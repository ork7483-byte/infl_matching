"use client";

import { useEffect, useState } from "react";
import LineChartComponent from "@/components/charts/LineChartComponent";

const LANDING_PAGES = [
  { category: "범용", label: "메인 랜딩", url: "https://inflix.kr/" },
  { category: "브랜드", label: "브랜드 랜딩", url: "https://inflix.kr/for-brands" },
  { category: "크리에이터", label: "크리에이터 랜딩", url: "https://inflix.kr/for-creators" },
];

const UTM_PAGES = [
  { value: "/", label: "메인" },
  { value: "/for-brands", label: "브랜드" },
  { value: "/for-creators", label: "크리에이터" },
];
const UTM_SOURCES = ["google", "facebook", "instagram", "kakao", "naver", "twitter"];
const UTM_MEDIUMS = ["cpc", "social", "email", "organic", "referral"];
const UTM_CAMPAIGNS = ["spring2026", "launch", "awareness", "conversion", "retargeting"];
const UTM_CONTENTS = ["banner_a", "banner_b", "cta_btn", "text_link"];

interface VisitRow {
  source: string;
  visits: number;
  signups: number;
  conversion: string;
}

interface TrendPoint {
  date: string;
  value: number;
}

const MOCK_VISITS: VisitRow[] = [
  { source: "google", visits: 4820, signups: 312, conversion: "6.47%" },
  { source: "instagram", visits: 3140, signups: 187, conversion: "5.96%" },
  { source: "kakao", visits: 1920, signups: 98, conversion: "5.10%" },
  { source: "naver", visits: 1540, signups: 72, conversion: "4.68%" },
  { source: "facebook", visits: 870, signups: 31, conversion: "3.56%" },
  { source: "direct", visits: 640, signups: 18, conversion: "2.81%" },
];

const MOCK_TREND: TrendPoint[] = Array.from({ length: 30 }, (_, i) => ({
  date: `${i + 1}일`,
  value: Math.floor(Math.random() * 200) + 80,
}));

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button
      onClick={handleCopy}
      style={{
        fontSize: 12,
        padding: "4px 10px",
        borderRadius: 6,
        border: "1px solid #E5E7EB",
        background: copied ? "#7c3aed" : "#F9FAFB",
        color: copied ? "#fff" : "#374151",
        cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      {copied ? "복사됨" : "복사"}
    </button>
  );
}

const PERIOD_TABS = ["7일", "30일", "전체"];

export default function AdminMarketing() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30일");
  const [utmPage, setUtmPage] = useState("/");
  const [utmSource, setUtmSource] = useState("google");
  const [utmMedium, setUtmMedium] = useState("cpc");
  const [utmCampaign, setUtmCampaign] = useState("spring2026");
  const [utmContent, setUtmContent] = useState("banner_a");

  const generatedUrl = `https://inflix.kr${utmPage}?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}&utm_content=${utmContent}`;

  useEffect(() => {
    // Fetch from /api/admin/marketing/visits
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ padding: "24px", maxWidth: 1280, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 28, marginTop: 0 }}>
        마케팅 관리
      </h1>

      {/* Section 1: Landing Pages */}
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
          광고 랜딩 페이지
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {LANDING_PAGES.map((lp) => (
            <div
              key={lp.url}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "#F9FAFB",
                borderRadius: 8,
                padding: "12px 16px",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#7c3aed",
                  background: "#7c3aed18",
                  borderRadius: 4,
                  padding: "2px 8px",
                  minWidth: 60,
                  textAlign: "center",
                }}
              >
                {lp.category}
              </span>
              <span style={{ fontSize: 13, color: "#374151", flex: 1, minWidth: 160 }}>{lp.label}</span>
              <span
                style={{
                  fontSize: 12,
                  color: "#6b7280",
                  fontFamily: "monospace",
                  flex: 2,
                  minWidth: 200,
                  wordBreak: "break-all",
                }}
              >
                {lp.url}
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                <CopyButton text={lp.url} />
                <a
                  href={lp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 12,
                    padding: "4px 10px",
                    borderRadius: 6,
                    border: "1px solid #E5E7EB",
                    background: "#F9FAFB",
                    color: "#374151",
                    textDecoration: "none",
                  }}
                >
                  미리보기
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: UTM Builder */}
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
          UTM 링크 생성기
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 12,
            marginBottom: 16,
          }}
        >
          {[
            { label: "페이지", value: utmPage, setter: setUtmPage, options: UTM_PAGES.map(p => ({ value: p.value, label: p.label })) },
            { label: "소스 (source)", value: utmSource, setter: setUtmSource, options: UTM_SOURCES.map(s => ({ value: s, label: s })) },
            { label: "매체 (medium)", value: utmMedium, setter: setUtmMedium, options: UTM_MEDIUMS.map(s => ({ value: s, label: s })) },
            { label: "캠페인 (campaign)", value: utmCampaign, setter: setUtmCampaign, options: UTM_CAMPAIGNS.map(s => ({ value: s, label: s })) },
            { label: "콘텐츠 (content)", value: utmContent, setter: setUtmContent, options: UTM_CONTENTS.map(s => ({ value: s, label: s })) },
          ].map((field) => (
            <div key={field.label}>
              <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>
                {field.label}
              </label>
              <select
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  fontSize: 13,
                  color: "#111827",
                  background: "#fff",
                }}
              >
                {field.options.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <div
          style={{
            background: "#F9FAFB",
            border: "1px solid #E5E7EB",
            borderRadius: 8,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: 12,
              color: "#374151",
              fontFamily: "monospace",
              flex: 1,
              wordBreak: "break-all",
              minWidth: 200,
            }}
          >
            {generatedUrl}
          </span>
          <CopyButton text={generatedUrl} />
        </div>
      </section>

      {/* Section 3: Inflow Performance */}
      <section
        style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111827", margin: 0 }}>유입 성과</h2>
          <div style={{ display: "flex", gap: 4 }}>
            {PERIOD_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setPeriod(tab)}
                style={{
                  fontSize: 13,
                  padding: "5px 14px",
                  borderRadius: 6,
                  border: "1px solid",
                  borderColor: period === tab ? "#7c3aed" : "#E5E7EB",
                  background: period === tab ? "#7c3aed" : "#fff",
                  color: period === tab ? "#fff" : "#374151",
                  cursor: "pointer",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div style={{ height: 200, background: "#E5E7EB", borderRadius: 8 }} />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                {["소스", "방문수", "가입수", "전환율"].map((h) => (
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
              {MOCK_VISITS.map((row) => (
                <tr key={row.source} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td style={{ padding: "10px 16px 10px 0", fontSize: 13, color: "#111827", fontWeight: 500 }}>
                    {row.source}
                  </td>
                  <td style={{ padding: "10px 16px 10px 0", fontSize: 13, color: "#374151" }}>
                    {row.visits.toLocaleString()}
                  </td>
                  <td style={{ padding: "10px 16px 10px 0", fontSize: 13, color: "#374151" }}>
                    {row.signups.toLocaleString()}
                  </td>
                  <td style={{ padding: "10px 0 10px 0" }}>
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
                      {row.conversion}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Section 4: Trend Chart */}
      <section
        style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          padding: 24,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginTop: 0, marginBottom: 16 }}>
          일별 방문/가입 추이
        </h2>
        {loading ? (
          <div style={{ height: 220, background: "#E5E7EB", borderRadius: 8 }} />
        ) : (
          <LineChartComponent data={MOCK_TREND} showArea color="#7c3aed" />
        )}
      </section>
    </div>
  );
}
