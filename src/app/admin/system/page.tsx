"use client";

import { useEffect, useState } from "react";

interface TokenStatus {
  active: boolean;
  expiryDate: string;
  daysRemaining: number;
  callsUsed: number;
  callsLimit: number;
}

interface DbModel {
  name: string;
  count: number;
}

interface EnvVar {
  key: string;
  value: string | null;
  set: boolean;
}

const MOCK_TOKEN: TokenStatus = {
  active: true,
  expiryDate: "2026-05-07",
  daysRemaining: 30,
  callsUsed: 45,
  callsLimit: 200,
};

const MOCK_DB: DbModel[] = [
  { name: "User", count: 1248 },
  { name: "Campaign", count: 87 },
  { name: "Application", count: 342 },
  { name: "Message", count: 2941 },
  { name: "InstagramProfile", count: 780 },
  { name: "Payment", count: 156 },
];

const ENV_KEYS = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "META_APP_ID",
  "META_APP_SECRET",
  "INSTAGRAM_ACCESS_TOKEN",
  "INSTAGRAM_USER_ID",
];

function maskValue(val: string): string {
  if (val.length <= 8) return "***";
  return val.slice(0, 5) + "..." + val.slice(-3);
}

function buildEnvVars(): EnvVar[] {
  return ENV_KEYS.map((key) => {
    // In a real implementation these would come from /api/admin/system/status
    const mockValues: Record<string, string | null> = {
      DATABASE_URL: "***masked***",
      NEXTAUTH_SECRET: "***masked***",
      META_APP_ID: "***masked***",
      META_APP_SECRET: "***masked***",
      INSTAGRAM_ACCESS_TOKEN: "***masked***",
      INSTAGRAM_USER_ID: "***masked***",
    };
    const value = mockValues[key] ?? null;
    return { key, value, set: value !== null };
  });
}

export default function AdminSystem() {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<TokenStatus | null>(null);
  const [db, setDb] = useState<DbModel[]>([]);
  const [envVars] = useState<EnvVar[]>(buildEnvVars());
  const [refreshing, setRefreshing] = useState(false);
  const [refreshMsg, setRefreshMsg] = useState("");

  useEffect(() => {
    // Fetch from /api/admin/system/status, /api/admin/system/db-stats
    const t = setTimeout(() => {
      setToken(MOCK_TOKEN);
      setDb(MOCK_DB);
      setLoading(false);
    }, 500);
    return () => clearTimeout(t);
  }, []);

  const handleTokenRefresh = async () => {
    setRefreshing(true);
    setRefreshMsg("");
    try {
      const res = await fetch("/api/instagram/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "refresh" }),
      });
      if (res.ok) {
        setRefreshMsg("토큰이 성공적으로 갱신되었습니다.");
        setToken((prev) => prev ? { ...prev, daysRemaining: 60, expiryDate: "2026-06-07" } : prev);
      } else {
        setRefreshMsg("갱신 실패: 서버 오류가 발생했습니다.");
      }
    } catch {
      setRefreshMsg("갱신 실패: 네트워크 오류가 발생했습니다.");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: 1280, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 28, marginTop: 0 }}>
        시스템 상태
      </h1>

      {/* Section 1: Instagram API */}
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
          Instagram API
        </h2>
        {loading || !token ? (
          <div style={{ height: 120, background: "#E5E7EB", borderRadius: 8 }} />
        ) : (
          <>
            {/* Token Status Card */}
            <div
              style={{
                background: "#F9FAFB",
                border: "1px solid #E5E7EB",
                borderRadius: 10,
                padding: 20,
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 20 }}>{token.active ? "🟢" : "🔴"}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
                    {token.active ? "토큰 활성" : "토큰 만료"}
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>
                    만료일: {token.expiryDate}
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  background: token.daysRemaining > 14 ? "#10b98118" : "#ef444418",
                  color: token.daysRemaining > 14 ? "#10b981" : "#ef4444",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                D-{token.daysRemaining}
              </div>
              <div style={{ marginLeft: "auto" }}>
                <button
                  onClick={handleTokenRefresh}
                  disabled={refreshing}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 8,
                    background: refreshing ? "#E5E7EB" : "#7c3aed",
                    color: refreshing ? "#9ca3af" : "#fff",
                    border: "none",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: refreshing ? "not-allowed" : "pointer",
                  }}
                >
                  {refreshing ? "갱신 중..." : "토큰 수동 갱신"}
                </button>
              </div>
            </div>

            {refreshMsg && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: refreshMsg.includes("성공") ? "#10b98118" : "#ef444418",
                  color: refreshMsg.includes("성공") ? "#10b981" : "#ef4444",
                  fontSize: 13,
                  marginBottom: 16,
                }}
              >
                {refreshMsg}
              </div>
            )}

            {/* API Usage Bar */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>API 호출 사용량</span>
                <span style={{ fontSize: 12, color: "#6b7280" }}>
                  {token.callsUsed} / {token.callsLimit} 사용
                </span>
              </div>
              <div style={{ height: 10, background: "#F3F4F6", borderRadius: 5, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${(token.callsUsed / token.callsLimit) * 100}%`,
                    background: "#7c3aed",
                    borderRadius: 5,
                  }}
                />
              </div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
                {Math.round((token.callsUsed / token.callsLimit) * 100)}% 사용됨
              </div>
            </div>
          </>
        )}
      </section>

      {/* Section 2: Database */}
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
          데이터베이스
        </h2>
        {loading ? (
          <div style={{ height: 200, background: "#E5E7EB", borderRadius: 8 }} />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#F9FAFB" }}>
              <tr>
                {["모델명", "레코드 수"].map((h) => (
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
              {db.map((model) => (
                <tr key={model.name} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td style={{ padding: "10px 16px", fontSize: 13, color: "#111827", fontWeight: 500, fontFamily: "monospace" }}>
                    {model.name}
                  </td>
                  <td style={{ padding: "10px 16px", fontSize: 13, color: "#374151" }}>
                    <span
                      style={{
                        background: "#7c3aed18",
                        color: "#7c3aed",
                        borderRadius: 4,
                        padding: "2px 8px",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {model.count.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Section 3: Env Vars */}
      <section
        style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          padding: 24,
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginTop: 0, marginBottom: 16 }}>
          환경 변수
        </h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ background: "#F9FAFB" }}>
            <tr>
              {["변수명", "상태", "값 (마스킹)"].map((h) => (
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
            {envVars.map((ev) => (
              <tr key={ev.key} style={{ borderBottom: "1px solid #F3F4F6" }}>
                <td style={{ padding: "10px 16px", fontSize: 13, color: "#111827", fontFamily: "monospace", fontWeight: 500 }}>
                  {ev.key}
                </td>
                <td style={{ padding: "10px 16px" }}>
                  {ev.set ? (
                    <span style={{ fontSize: 12, color: "#10b981" }}>✅ 설정됨</span>
                  ) : (
                    <span style={{ fontSize: 12, color: "#ef4444" }}>❌ 미설정</span>
                  )}
                </td>
                <td style={{ padding: "10px 16px", fontSize: 12, color: "#6b7280", fontFamily: "monospace" }}>
                  {ev.set && ev.value ? maskValue(ev.value) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
