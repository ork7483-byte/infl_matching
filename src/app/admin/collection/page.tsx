"use client";

import { useEffect, useState } from "react";

type SeedStatus = "pending" | "processing" | "done" | "failed";

interface Seed {
  id: string;
  username: string;
  category: string;
  status: SeedStatus;
  source: string;
  failCount: number;
  processedAt: string | null;
}

interface CollectionLog {
  id: string;
  date: string;
  total: number;
  success: number;
  fail: number;
  discovered: number;
  apiCalls: number;
  duration: string;
}

const SEED_STATUS_LABELS: Record<SeedStatus, string> = {
  pending: "대기",
  processing: "처리중",
  done: "완료",
  failed: "실패",
};

const SEED_STATUS_COLORS: Record<SeedStatus, { text: string; bg: string }> = {
  pending: { text: "#d97706", bg: "#fef3c7" },
  processing: { text: "#2563eb", bg: "#dbeafe" },
  done: { text: "#059669", bg: "#d1fae5" },
  failed: { text: "#dc2626", bg: "#fee2e2" },
};

const CATEGORIES = [
  "패션/뷰티",
  "음식/요리",
  "여행/라이프스타일",
  "테크/IT",
  "게임/e스포츠",
  "피트니스/건강",
  "금융/재테크",
  "교육/육아",
];

const CATEGORY_STATS = [
  { name: "패션/뷰티", count: 3842, total: 5000 },
  { name: "음식/요리", count: 2910, total: 5000 },
  { name: "여행/라이프스타일", count: 2105, total: 5000 },
  { name: "테크/IT", count: 1844, total: 5000 },
  { name: "게임/e스포츠", count: 1422, total: 5000 },
  { name: "피트니스/건강", count: 988, total: 5000 },
  { name: "금융/재테크", count: 562, total: 5000 },
  { name: "교육/육아", count: 340, total: 5000 },
];

const MOCK_SEEDS: Seed[] = [
  { id: "1", username: "style_jiyeon", category: "패션/뷰티", status: "done", source: "수동", failCount: 0, processedAt: "2026-04-07 14:22" },
  { id: "2", username: "foodie_minseo", category: "음식/요리", status: "done", source: "자동", failCount: 0, processedAt: "2026-04-07 13:10" },
  { id: "3", username: "traveler_hyun", category: "여행/라이프스타일", status: "processing", source: "자동", failCount: 0, processedAt: null },
  { id: "4", username: "tech_seojin", category: "테크/IT", status: "pending", source: "수동", failCount: 0, processedAt: null },
  { id: "5", username: "gamer_jungwoo", category: "게임/e스포츠", status: "failed", source: "자동", failCount: 3, processedAt: "2026-04-06 22:05" },
  { id: "6", username: "fit_chaerin", category: "피트니스/건강", status: "done", source: "자동", failCount: 0, processedAt: "2026-04-06 18:44" },
  { id: "7", username: "invest_dahye", category: "금융/재테크", status: "pending", source: "수동", failCount: 0, processedAt: null },
  { id: "8", username: "mom_soyoung", category: "교육/육아", status: "done", source: "수동", failCount: 0, processedAt: "2026-04-05 09:31" },
];

const MOCK_LOGS: CollectionLog[] = [
  { id: "1", date: "2026-04-07", total: 1240, success: 1198, fail: 42, discovered: 88, apiCalls: 620, duration: "4m 12s" },
  { id: "2", date: "2026-04-06", total: 1180, success: 1155, fail: 25, discovered: 74, apiCalls: 590, duration: "3m 58s" },
  { id: "3", date: "2026-04-05", total: 1320, success: 1280, fail: 40, discovered: 112, apiCalls: 660, duration: "4m 33s" },
  { id: "4", date: "2026-04-04", total: 980, success: 965, fail: 15, discovered: 55, apiCalls: 490, duration: "3m 21s" },
  { id: "5", date: "2026-04-03", total: 1450, success: 1390, fail: 60, discovered: 98, apiCalls: 725, duration: "5m 02s" },
];

export default function AdminCollection() {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showSeedModal, setShowSeedModal] = useState(false);
  const [seedInput, setSeedInput] = useState("");
  const [seedCategory, setSeedCategory] = useState(CATEGORIES[0]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    // Fetch from /api/admin/collection/stats, /seeds, /logs
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleInit = async () => {
    setActionLoading("init");
    try {
      // POST /api/admin/collection/init
      await new Promise((r) => setTimeout(r, 1000));
      showToast("시드가 초기화되었습니다.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRun = async () => {
    setActionLoading("run");
    try {
      // POST /api/admin/collection/run
      await new Promise((r) => setTimeout(r, 1200));
      showToast("수집이 시작되었습니다.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddSeeds = async () => {
    const lines = seedInput
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) return;
    setActionLoading("seed");
    try {
      // POST /api/admin/collection/seeds
      await new Promise((r) => setTimeout(r, 800));
      setShowSeedModal(false);
      setSeedInput("");
      showToast(`${lines.length}개의 시드가 추가되었습니다.`);
    } finally {
      setActionLoading(null);
    }
  };

  const statsCards = [
    {
      label: "총 수집",
      value: loading ? "..." : "14,013",
      sub: "source=collected",
      color: "#7c3aed",
    },
    { label: "오늘 수집", value: loading ? "..." : "1,240", sub: "+88 신규", color: "#059669" },
    { label: "시드 대기", value: loading ? "..." : "2", sub: "처리 예정", color: "#d97706" },
    { label: "수집 실패", value: loading ? "..." : "42", sub: "오늘 기준", color: "#dc2626" },
  ];

  return (
    <div style={{ padding: "24px", maxWidth: 1280, margin: "0 auto" }}>
      {/* Toast */}
      {toastMsg && (
        <div
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            background: "#111827",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 500,
            zIndex: 2000,
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }}
        >
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>
          수집 관리
        </h1>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleInit}
            disabled={actionLoading === "init"}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid #E5E7EB",
              background: "#fff",
              color: "#374151",
              fontSize: 13,
              fontWeight: 500,
              cursor: actionLoading === "init" ? "not-allowed" : "pointer",
              opacity: actionLoading === "init" ? 0.6 : 1,
            }}
          >
            {actionLoading === "init" ? "초기화 중..." : "시드 초기화"}
          </button>
          <button
            onClick={handleRun}
            disabled={actionLoading === "run"}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "1px solid #7c3aed",
              background: "#fff",
              color: "#7c3aed",
              fontSize: 13,
              fontWeight: 500,
              cursor: actionLoading === "run" ? "not-allowed" : "pointer",
              opacity: actionLoading === "run" ? 0.6 : 1,
            }}
          >
            {actionLoading === "run" ? "실행 중..." : "수집 수동 실행"}
          </button>
          <button
            onClick={() => setShowSeedModal(true)}
            style={{
              padding: "8px 16px",
              borderRadius: 8,
              border: "none",
              background: "#7c3aed",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            + 시드 추가
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {statsCards.map((card) => (
          <div
            key={card.label}
            style={{
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: 12,
              padding: "18px 20px",
            }}
          >
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>{card.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: card.color }}>{card.value}</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Category Breakdown */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          padding: "20px 24px",
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "#111827",
            margin: 0,
            marginBottom: 18,
          }}
        >
          카테고리별 수집 현황
        </h2>
        <div style={{ display: "grid", gap: 12 }}>
          {CATEGORY_STATS.map((cat) => {
            const pct = Math.round((cat.count / cat.total) * 100);
            return (
              <div key={cat.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 130, fontSize: 13, color: "#374151", flexShrink: 0 }}>
                  {cat.name}
                </div>
                <div
                  style={{
                    flex: 1,
                    height: 8,
                    background: "#F3F4F6",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${pct}%`,
                      height: "100%",
                      background: "#7c3aed",
                      borderRadius: 4,
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>
                <div
                  style={{ width: 70, textAlign: "right", fontSize: 13, color: "#6b7280", flexShrink: 0 }}
                >
                  {cat.count.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seed Table */}
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
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #E5E7EB",
            fontSize: 15,
            fontWeight: 600,
            color: "#111827",
          }}
        >
          시드 목록
        </div>
        {loading ? (
          <div style={{ padding: 24 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                style={{ height: 40, background: "#F3F4F6", borderRadius: 6, marginBottom: 8 }}
              />
            ))}
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead style={{ background: "#F9FAFB" }}>
              <tr>
                {["유저명", "카테고리", "상태", "소스", "실패수", "처리일시"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      fontSize: 12,
                      color: "#6b7280",
                      fontWeight: 500,
                      padding: "10px 16px",
                      borderBottom: "1px solid #E5E7EB",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_SEEDS.map((seed) => {
                const sc = SEED_STATUS_COLORS[seed.status];
                return (
                  <tr key={seed.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td style={{ padding: "10px 16px", fontSize: 13, color: "#111827", fontWeight: 500 }}>
                      @{seed.username}
                    </td>
                    <td style={{ padding: "10px 16px", fontSize: 12, color: "#6b7280" }}>
                      {seed.category}
                    </td>
                    <td style={{ padding: "10px 16px" }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: sc.text,
                          background: sc.bg,
                          borderRadius: 4,
                          padding: "3px 8px",
                        }}
                      >
                        {SEED_STATUS_LABELS[seed.status]}
                      </span>
                    </td>
                    <td style={{ padding: "10px 16px", fontSize: 12, color: "#6b7280" }}>
                      {seed.source}
                    </td>
                    <td style={{ padding: "10px 16px", fontSize: 13, color: seed.failCount > 0 ? "#dc2626" : "#9ca3af" }}>
                      {seed.failCount}
                    </td>
                    <td style={{ padding: "10px 16px", fontSize: 12, color: "#6b7280" }}>
                      {seed.processedAt ?? "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Collection Log Table */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          overflow: "hidden",
          overflowX: "auto",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #E5E7EB",
            fontSize: 15,
            fontWeight: 600,
            color: "#111827",
          }}
        >
          수집 로그
        </div>
        {loading ? (
          <div style={{ padding: 24 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                style={{ height: 40, background: "#F3F4F6", borderRadius: 6, marginBottom: 8 }}
              />
            ))}
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 620 }}>
            <thead style={{ background: "#F9FAFB" }}>
              <tr>
                {["날짜", "전체", "성공", "실패", "신규 발견", "API 호출", "소요시간"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      fontSize: 12,
                      color: "#6b7280",
                      fontWeight: 500,
                      padding: "10px 16px",
                      borderBottom: "1px solid #E5E7EB",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_LOGS.map((log) => (
                <tr key={log.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  <td style={{ padding: "10px 16px", fontSize: 13, color: "#111827", fontWeight: 500 }}>
                    {log.date}
                  </td>
                  <td style={{ padding: "10px 16px", fontSize: 13, color: "#374151" }}>
                    {log.total.toLocaleString()}
                  </td>
                  <td style={{ padding: "10px 16px", fontSize: 13, color: "#059669", fontWeight: 500 }}>
                    {log.success.toLocaleString()}
                  </td>
                  <td style={{ padding: "10px 16px", fontSize: 13, color: "#dc2626", fontWeight: 500 }}>
                    {log.fail.toLocaleString()}
                  </td>
                  <td style={{ padding: "10px 16px", fontSize: 13, color: "#7c3aed", fontWeight: 500 }}>
                    +{log.discovered}
                  </td>
                  <td style={{ padding: "10px 16px", fontSize: 12, color: "#6b7280" }}>
                    {log.apiCalls.toLocaleString()}
                  </td>
                  <td style={{ padding: "10px 16px", fontSize: 12, color: "#6b7280" }}>
                    {log.duration}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Seed Modal */}
      {showSeedModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 16,
          }}
          onClick={() => setShowSeedModal(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 28,
              width: 440,
              maxWidth: "100%",
              boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "#111827",
                marginTop: 0,
                marginBottom: 20,
              }}
            >
              시드 추가
            </h3>

            <div style={{ marginBottom: 16 }}>
              <label
                style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 6 }}
              >
                카테고리
              </label>
              <select
                value={seedCategory}
                onChange={(e) => setSeedCategory(e.target.value)}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  fontSize: 14,
                  color: "#111827",
                  background: "#fff",
                }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 22 }}>
              <label
                style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 6 }}
              >
                유저명 목록 (한 줄에 하나씩)
              </label>
              <textarea
                value={seedInput}
                onChange={(e) => setSeedInput(e.target.value)}
                rows={6}
                placeholder={"style_jiyeon\nbeauty_suyeon\ntech_seojin"}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  fontSize: 13,
                  color: "#111827",
                  background: "#fff",
                  resize: "vertical",
                  boxSizing: "border-box",
                  fontFamily: "monospace",
                }}
              />
              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
                {seedInput.split("\n").filter((l) => l.trim()).length}개 입력됨
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleAddSeeds}
                disabled={actionLoading === "seed" || !seedInput.trim()}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: 8,
                  background: "#7c3aed",
                  color: "#fff",
                  border: "none",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: actionLoading === "seed" || !seedInput.trim() ? "not-allowed" : "pointer",
                  opacity: actionLoading === "seed" || !seedInput.trim() ? 0.6 : 1,
                }}
              >
                {actionLoading === "seed" ? "추가 중..." : "추가"}
              </button>
              <button
                onClick={() => setShowSeedModal(false)}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: 8,
                  background: "#F9FAFB",
                  color: "#374151",
                  border: "1px solid #E5E7EB",
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
