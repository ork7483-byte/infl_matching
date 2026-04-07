"use client";

import { useEffect, useState } from "react";

type MatchStatus = "pending" | "contacting" | "accepted" | "rejected" | "expired";

interface Match {
  id: string;
  brandName: string;
  brandEmail: string;
  influencerUsername: string;
  influencerFollowers: number;
  status: MatchStatus;
  requestedAt: string;
  campaignTitle: string;
  campaignType: string;
  campaignBudget: number;
  campaignStartDate: string;
  campaignEndDate: string;
  campaignDescription: string;
  adminNote: string;
  rejectionReason: string;
}

const STATUS_TABS: { label: string; value: string }[] = [
  { label: "전체", value: "all" },
  { label: "대기", value: "pending" },
  { label: "연락중", value: "contacting" },
  { label: "수락", value: "accepted" },
  { label: "거절", value: "rejected" },
  { label: "만료", value: "expired" },
];

const STATUS_LABELS: Record<MatchStatus, string> = {
  pending: "대기",
  contacting: "연락중",
  accepted: "수락",
  rejected: "거절",
  expired: "만료",
};

const STATUS_COLORS: Record<MatchStatus, { text: string; bg: string }> = {
  pending: { text: "#d97706", bg: "#fef3c7" },
  contacting: { text: "#2563eb", bg: "#dbeafe" },
  accepted: { text: "#059669", bg: "#d1fae5" },
  rejected: { text: "#dc2626", bg: "#fee2e2" },
  expired: { text: "#6b7280", bg: "#f3f4f6" },
};

const REJECTION_REASONS = ["일정 불가", "핏 불일치", "기타"];

const MOCK_MATCHES: Match[] = [
  {
    id: "1",
    brandName: "나이키 코리아",
    brandEmail: "marketing@nike.kr",
    influencerUsername: "style_jiyeon",
    influencerFollowers: 128000,
    status: "pending",
    requestedAt: "2026-04-07",
    campaignTitle: "스프링 런닝 컬렉션",
    campaignType: "인스타그램 피드",
    campaignBudget: 1500000,
    campaignStartDate: "2026-04-15",
    campaignEndDate: "2026-04-30",
    campaignDescription: "2026 스프링 런닝화 신제품 홍보 캠페인입니다. 자연스러운 일상 컨텐츠 형식으로 제품을 소개해 주세요.",
    adminNote: "",
    rejectionReason: "",
  },
  {
    id: "2",
    brandName: "올리브영",
    brandEmail: "collab@oliveyoung.com",
    influencerUsername: "beauty_suyeon",
    influencerFollowers: 54200,
    status: "contacting",
    requestedAt: "2026-04-06",
    campaignTitle: "봄맞이 스킨케어 루틴",
    campaignType: "유튜브 쇼츠",
    campaignBudget: 800000,
    campaignStartDate: "2026-04-20",
    campaignEndDate: "2026-05-10",
    campaignDescription: "봄철 피부 관리법과 함께 신제품 세럼을 소개하는 숏폼 콘텐츠를 제작해 주세요.",
    adminNote: "협력사 요청으로 우선 처리 필요",
    rejectionReason: "",
  },
  {
    id: "3",
    brandName: "무신사",
    brandEmail: "brand@musinsa.com",
    influencerUsername: "streetwear_junho",
    influencerFollowers: 221000,
    status: "accepted",
    requestedAt: "2026-04-05",
    campaignTitle: "SS26 스트리트 룩북",
    campaignType: "인스타그램 릴스",
    campaignBudget: 3000000,
    campaignStartDate: "2026-04-18",
    campaignEndDate: "2026-05-05",
    campaignDescription: "26 S/S 시즌 스트리트 무드의 룩북 릴스 콘텐츠입니다. 자유로운 스타일링으로 진행해 주세요.",
    adminNote: "계약서 발송 완료",
    rejectionReason: "",
  },
  {
    id: "4",
    brandName: "다이슨 코리아",
    brandEmail: "pr@dyson.kr",
    influencerUsername: "home_dayoung",
    influencerFollowers: 88000,
    status: "rejected",
    requestedAt: "2026-04-04",
    campaignTitle: "에어랩 스타일링 챌린지",
    campaignType: "틱톡",
    campaignBudget: 2000000,
    campaignStartDate: "2026-04-12",
    campaignEndDate: "2026-04-25",
    campaignDescription: "다이슨 에어랩을 활용한 헤어 스타일링 챌린지 영상을 제작해 주세요.",
    adminNote: "",
    rejectionReason: "일정 불가",
  },
  {
    id: "5",
    brandName: "스타벅스",
    brandEmail: "marketing@starbucks.kr",
    influencerUsername: "cafe_minseok",
    influencerFollowers: 42500,
    status: "expired",
    requestedAt: "2026-03-28",
    campaignTitle: "봄 시즌 음료 리뷰",
    campaignType: "인스타그램 스토리",
    campaignBudget: 500000,
    campaignStartDate: "2026-04-01",
    campaignEndDate: "2026-04-07",
    campaignDescription: "봄 시즌 신메뉴를 일상 속 자연스러운 분위기로 소개해 주세요.",
    adminNote: "",
    rejectionReason: "",
  },
  {
    id: "6",
    brandName: "삼성전자",
    brandEmail: "mobile@samsung.com",
    influencerUsername: "tech_seojin",
    influencerFollowers: 310000,
    status: "pending",
    requestedAt: "2026-04-07",
    campaignTitle: "갤럭시 S26 언박싱",
    campaignType: "유튜브",
    campaignBudget: 5000000,
    campaignStartDate: "2026-04-25",
    campaignEndDate: "2026-05-15",
    campaignDescription: "갤럭시 S26 신제품 언박싱 및 기능 리뷰 영상을 제작해 주세요.",
    adminNote: "",
    rejectionReason: "",
  },
];

const STATS = [
  { label: "총 요청", value: 48, color: "#7c3aed" },
  { label: "매칭 성공", value: 18, color: "#059669" },
  { label: "성공률", value: "37.5%", color: "#2563eb" },
  { label: "평균 소요일", value: "3.2일", color: "#d97706" },
];

export default function AdminMatches() {
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState("all");
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [editStatus, setEditStatus] = useState<MatchStatus>("pending");
  const [editNote, setEditNote] = useState("");
  const [editRejection, setEditRejection] = useState("");

  useEffect(() => {
    // Fetch from /api/admin/matches
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const filtered = MOCK_MATCHES.filter(
    (m) => statusTab === "all" || m.status === statusTab
  );

  const pendingCount = MOCK_MATCHES.filter((m) => m.status === "pending").length;

  const openModal = (match: Match) => {
    setSelectedMatch(match);
    setEditStatus(match.status);
    setEditNote(match.adminNote);
    setEditRejection(match.rejectionReason);
  };

  const closeModal = () => setSelectedMatch(null);

  const handleSave = () => {
    // Would call PATCH /api/admin/matches/:id
    closeModal();
  };

  return (
    <div style={{ padding: "24px", maxWidth: 1280, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", margin: 0 }}>
          매칭 요청 관리
        </h1>
        <span style={{ fontSize: 14, color: "#6b7280" }}>
          대기 <strong style={{ color: "#d97706" }}>{pendingCount}건</strong>
          {" · "}
          총 <strong style={{ color: "#111827" }}>{MOCK_MATCHES.length}건</strong>
        </span>
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
        {STATS.map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: 12,
              padding: "18px 20px",
            }}
          >
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>{stat.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusTab(tab.value)}
            style={{
              fontSize: 13,
              padding: "6px 16px",
              borderRadius: 20,
              border: "1px solid",
              borderColor: statusTab === tab.value ? "#7c3aed" : "#E5E7EB",
              background: statusTab === tab.value ? "#7c3aed" : "#fff",
              color: statusTab === tab.value ? "#fff" : "#374151",
              cursor: "pointer",
              fontWeight: statusTab === tab.value ? 600 : 400,
            }}
          >
            {tab.label}
            {tab.value !== "all" && (
              <span style={{ marginLeft: 6, opacity: 0.8 }}>
                {MOCK_MATCHES.filter((m) => m.status === tab.value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
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
        {loading ? (
          <div style={{ padding: 24 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                style={{ height: 44, background: "#F3F4F6", borderRadius: 6, marginBottom: 8 }}
              />
            ))}
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead style={{ background: "#F9FAFB" }}>
              <tr>
                {["#", "브랜드", "인플루언서", "상태", "요청일", ""].map((h) => (
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
              {filtered.map((m, idx) => {
                const sc = STATUS_COLORS[m.status];
                return (
                  <tr key={m.id} style={{ borderBottom: "1px solid #F3F4F6" }}>
                    <td style={{ padding: "11px 16px", fontSize: 12, color: "#9ca3af" }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: "11px 16px" }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>
                        {m.brandName}
                      </div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>{m.brandEmail}</div>
                    </td>
                    <td style={{ padding: "11px 16px" }}>
                      <div style={{ fontSize: 13, color: "#374151" }}>@{m.influencerUsername}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>
                        {m.influencerFollowers.toLocaleString()} 팔로워
                      </div>
                    </td>
                    <td style={{ padding: "11px 16px" }}>
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
                        {STATUS_LABELS[m.status]}
                      </span>
                    </td>
                    <td style={{ padding: "11px 16px", fontSize: 12, color: "#6b7280" }}>
                      {m.requestedAt}
                    </td>
                    <td style={{ padding: "11px 16px" }}>
                      <button
                        onClick={() => openModal(m)}
                        style={{
                          fontSize: 12,
                          padding: "5px 12px",
                          borderRadius: 6,
                          border: "1px solid #7c3aed",
                          background: "#fff",
                          color: "#7c3aed",
                          cursor: "pointer",
                          fontWeight: 500,
                        }}
                      >
                        처리
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{ padding: "32px 16px", textAlign: "center", fontSize: 13, color: "#9ca3af" }}
                  >
                    해당 상태의 요청이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Process Modal */}
      {selectedMatch && (
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
          onClick={closeModal}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 28,
              width: 520,
              maxWidth: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
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
                marginBottom: 22,
              }}
            >
              매칭 처리
            </h3>

            {/* Brand Info */}
            <div
              style={{
                background: "#F9FAFB",
                border: "1px solid #E5E7EB",
                borderRadius: 10,
                padding: "14px 16px",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "#9ca3af",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 8,
                }}
              >
                브랜드 정보
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
                {selectedMatch.brandName}
              </div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                {selectedMatch.brandEmail}
              </div>
            </div>

            {/* Influencer Info */}
            <div
              style={{
                background: "#F9FAFB",
                border: "1px solid #E5E7EB",
                borderRadius: 10,
                padding: "14px 16px",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "#9ca3af",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 8,
                }}
              >
                인플루언서 정보
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
                @{selectedMatch.influencerUsername}
              </div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                팔로워 {selectedMatch.influencerFollowers.toLocaleString()}명
              </div>
            </div>

            {/* Campaign Details */}
            <div
              style={{
                background: "#F9FAFB",
                border: "1px solid #E5E7EB",
                borderRadius: 10,
                padding: "14px 16px",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "#9ca3af",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 10,
                }}
              >
                캠페인 정보
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px" }}>
                <div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>제목</div>
                  <div style={{ fontSize: 13, color: "#111827", fontWeight: 500 }}>
                    {selectedMatch.campaignTitle}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>유형</div>
                  <div style={{ fontSize: 13, color: "#111827" }}>{selectedMatch.campaignType}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>예산</div>
                  <div style={{ fontSize: 13, color: "#7c3aed", fontWeight: 600 }}>
                    {selectedMatch.campaignBudget.toLocaleString()}원
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>기간</div>
                  <div style={{ fontSize: 13, color: "#111827" }}>
                    {selectedMatch.campaignStartDate} ~ {selectedMatch.campaignEndDate}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>설명</div>
                <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.6 }}>
                  {selectedMatch.campaignDescription}
                </div>
              </div>
            </div>

            {/* Status Change */}
            <div style={{ marginBottom: 14 }}>
              <label
                style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 6 }}
              >
                상태 변경
              </label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as MatchStatus)}
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
                {(Object.keys(STATUS_LABELS) as MatchStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>

            {/* Rejection Reason — only shown when status is rejected */}
            {editStatus === "rejected" && (
              <div style={{ marginBottom: 14 }}>
                <label
                  style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 6 }}
                >
                  거절 사유
                </label>
                <select
                  value={editRejection}
                  onChange={(e) => setEditRejection(e.target.value)}
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
                  <option value="">선택하세요</option>
                  {REJECTION_REASONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Admin Note */}
            <div style={{ marginBottom: 22 }}>
              <label
                style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 6 }}
              >
                관리자 메모
              </label>
              <textarea
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                rows={3}
                placeholder="내부 메모를 입력하세요..."
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  border: "1px solid #E5E7EB",
                  borderRadius: 8,
                  fontSize: 14,
                  color: "#111827",
                  background: "#fff",
                  resize: "vertical",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleSave}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: 8,
                  background: "#7c3aed",
                  color: "#fff",
                  border: "none",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                저장
              </button>
              <button
                onClick={closeModal}
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
