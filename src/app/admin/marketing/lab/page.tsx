"use client";

import { useEffect, useState } from "react";

// ── Types & mock data ────────────────────────────────────────────────────────
interface Variant {
  label: string;
  rate: number;
}

interface Experiment {
  id: string;
  name: string;
  status: "running" | "completed" | "draft";
  variantA: Variant;
  variantB: Variant;
  winner: string | null;
  lift: string | null;
  confidence: number | null;
}

const EXPERIMENTS: Experiment[] = [
  {
    id: "exp-01",
    name: "CTA 버튼 색상 테스트",
    status: "completed",
    variantA: { label: "보라색 버튼 (기존)", rate: 4.2 },
    variantB: { label: "초록색 버튼 (신규)", rate: 5.6 },
    winner: "B",
    lift: "+1.4%p",
    confidence: 97,
  },
  {
    id: "exp-02",
    name: "가입 폼 단계 수 축소",
    status: "running",
    variantA: { label: "3단계 가입 (기존)", rate: 6.8 },
    variantB: { label: "2단계 가입 (신규)", rate: 7.4 },
    winner: null,
    lift: null,
    confidence: 74,
  },
  {
    id: "exp-03",
    name: "랜딩 헤드라인 문구",
    status: "draft",
    variantA: { label: "기존 문구", rate: 0 },
    variantB: { label: "신규 문구", rate: 0 },
    winner: null,
    lift: null,
    confidence: null,
  },
];

const STATUS_STYLES: Record<Experiment["status"], { label: string; color: string; bg: string }> = {
  running:   { label: "진행중",  color: "#10b981", bg: "#10b98118" },
  completed: { label: "완료",    color: "#3b82f6", bg: "#3b82f618" },
  draft:     { label: "초안",    color: "#6b7280", bg: "#6b728018" },
};

const TARGET_OPTIONS = ["전체", "브랜드", "크리에이터"];

// ── Component ────────────────────────────────────────────────────────────────
export default function LabPage() {
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState("전체");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    // Fetch from /api/admin/marketing/lab/experiments
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  async function handleSend() {
    if (!title.trim() || !content.trim()) return;
    setSending(true);
    try {
      // POST /api/admin/marketing/lab/notify
      await new Promise((res) => setTimeout(res, 800));
      const count = target === "전체" ? 342 : target === "브랜드" ? 128 : 214;
      setToast(`${count}명에게 발송 완료`);
      setTitle("");
      setContent("");
      setTimeout(() => setToast(null), 3500);
    } finally {
      setSending(false);
    }
  }

  const maxRate = 10; // scale for variant bars

  return (
    <div style={{ padding: 24, maxWidth: 1280, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 28, marginTop: 0 }}>
        실험실
      </h1>

      {/* ── Experiments List ── */}
      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginTop: 0, marginBottom: 16 }}>
          A/B 실험
        </h2>
        {loading ? (
          <div style={{ height: 280, background: "#F3F4F6", borderRadius: 12 }} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {EXPERIMENTS.map((exp) => {
              const s = STATUS_STYLES[exp.status];
              return (
                <div
                  key={exp.id}
                  style={{
                    background: "#fff",
                    border: "1px solid #E5E7EB",
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px 20px",
                      borderBottom: "1px solid #F3F4F6",
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{exp.name}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {exp.winner && (
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#7c3aed",
                            background: "#7c3aed18",
                            borderRadius: 4,
                            padding: "2px 10px",
                          }}
                        >
                          승자: {exp.winner} ({exp.lift}) · 신뢰도 {exp.confidence}%
                        </span>
                      )}
                      {exp.status === "running" && exp.confidence !== null && (
                        <span style={{ fontSize: 11, color: "#6b7280" }}>
                          신뢰도 {exp.confidence}%
                        </span>
                      )}
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: s.color,
                          background: s.bg,
                          borderRadius: 4,
                          padding: "2px 8px",
                        }}
                      >
                        {s.label}
                      </span>
                    </div>
                  </div>

                  {/* Body: variant bars */}
                  <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      { tag: "A", variant: exp.variantA },
                      { tag: "B", variant: exp.variantB },
                    ].map(({ tag, variant }) => {
                      const barPct = exp.status === "draft" ? 0 : (variant.rate / maxRate) * 100;
                      const isWinner = exp.winner === tag;
                      return (
                        <div key={tag} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: 4,
                              background: isWinner ? "#7c3aed" : "#F3F4F6",
                              color: isWinner ? "#fff" : "#6b7280",
                              fontSize: 11,
                              fontWeight: 700,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            {tag}
                          </div>
                          <div style={{ fontSize: 12, color: "#374151", width: 180, flexShrink: 0 }}>
                            {variant.label}
                          </div>
                          <div
                            style={{
                              flex: 1,
                              height: 20,
                              background: "#F3F4F6",
                              borderRadius: 4,
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${barPct}%`,
                                background: isWinner ? "#7c3aed" : "rgba(124,58,237,0.4)",
                                borderRadius: 4,
                                transition: "width 0.5s ease",
                              }}
                            />
                          </div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: "#374151", width: 44, textAlign: "right" }}>
                            {exp.status === "draft" ? "-" : `${variant.rate}%`}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Notification Sender ── */}
      <section
        style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          padding: 24,
          position: "relative",
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginTop: 0, marginBottom: 20 }}>
          알림 발송
        </h2>

        {/* Target */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 6 }}>
            발송 대상
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            {TARGET_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setTarget(opt)}
                style={{
                  padding: "6px 16px",
                  borderRadius: 6,
                  border: "1px solid",
                  borderColor: target === opt ? "#7c3aed" : "#E5E7EB",
                  background: target === opt ? "#7c3aed" : "#fff",
                  color: target === opt ? "#fff" : "#374151",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 6 }}>
            제목
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="알림 제목을 입력하세요"
            style={{
              width: "100%",
              padding: "9px 12px",
              border: "1px solid #E5E7EB",
              borderRadius: 8,
              fontSize: 13,
              color: "#111827",
              boxSizing: "border-box",
              outline: "none",
            }}
          />
        </div>

        {/* Content */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 6 }}>
            내용
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="알림 내용을 입력하세요"
            rows={4}
            style={{
              width: "100%",
              padding: "9px 12px",
              border: "1px solid #E5E7EB",
              borderRadius: 8,
              fontSize: 13,
              color: "#111827",
              boxSizing: "border-box",
              resize: "vertical",
              outline: "none",
              fontFamily: "inherit",
            }}
          />
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={sending || !title.trim() || !content.trim()}
          style={{
            padding: "10px 28px",
            borderRadius: 8,
            border: "none",
            background: sending || !title.trim() || !content.trim() ? "#E5E7EB" : "#7c3aed",
            color: sending || !title.trim() || !content.trim() ? "#9ca3af" : "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: sending || !title.trim() || !content.trim() ? "not-allowed" : "pointer",
            transition: "background 0.15s",
          }}
        >
          {sending ? "발송 중..." : "발송하기"}
        </button>

        {/* Toast */}
        {toast && (
          <div
            style={{
              position: "fixed",
              bottom: 32,
              left: "50%",
              transform: "translateX(-50%)",
              background: "#111827",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 500,
              zIndex: 9999,
              boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
              pointerEvents: "none",
            }}
          >
            {toast}
          </div>
        )}
      </section>
    </div>
  );
}
