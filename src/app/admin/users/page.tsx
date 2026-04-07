"use client";

import { useEffect, useState } from "react";
import DonutChart from "@/components/charts/DonutChart";
import BarChartComponent from "@/components/charts/BarChartComponent";

interface User {
  id: string;
  name: string;
  email: string;
  role: "BRAND" | "CREATOR" | "ADMIN";
  plan: string;
  isEarlyAccess: boolean;
  createdAt: string;
}

const ROLE_TABS = ["전체", "BRAND", "CREATOR", "ADMIN"];
const PLAN_OPTIONS = ["전체", "FREE", "PRO", "ENTERPRISE"];

const ROLE_COLORS: Record<string, string> = {
  BRAND: "#7c3aed",
  CREATOR: "#06b6d4",
  ADMIN: "#f59e0b",
};

const PLAN_COLORS: Record<string, string> = {
  FREE: "#6b7280",
  PRO: "#7c3aed",
  ENTERPRISE: "#10b981",
};

const MOCK_USERS: User[] = [
  { id: "1", name: "김민준", email: "minjun@example.com", role: "BRAND", plan: "PRO", isEarlyAccess: true, createdAt: "2026-04-07" },
  { id: "2", name: "이서연", email: "seoyeon@example.com", role: "CREATOR", plan: "FREE", isEarlyAccess: true, createdAt: "2026-04-07" },
  { id: "3", name: "박지훈", email: "jihoon@example.com", role: "CREATOR", plan: "PRO", isEarlyAccess: false, createdAt: "2026-04-06" },
  { id: "4", name: "최수아", email: "sua@example.com", role: "BRAND", plan: "ENTERPRISE", isEarlyAccess: false, createdAt: "2026-04-06" },
  { id: "5", name: "정도윤", email: "doyun@example.com", role: "CREATOR", plan: "FREE", isEarlyAccess: true, createdAt: "2026-04-05" },
  { id: "6", name: "한지민", email: "jimin@example.com", role: "ADMIN", plan: "ENTERPRISE", isEarlyAccess: false, createdAt: "2026-04-04" },
  { id: "7", name: "오승환", email: "seunghwan@example.com", role: "BRAND", plan: "PRO", isEarlyAccess: true, createdAt: "2026-04-03" },
  { id: "8", name: "윤아영", email: "ayoung@example.com", role: "CREATOR", plan: "FREE", isEarlyAccess: false, createdAt: "2026-04-02" },
];

const ROLE_DONUT = [
  { name: "브랜드", value: 420, color: "#7c3aed" },
  { name: "크리에이터", value: 780, color: "#06b6d4" },
  { name: "관리자", value: 48, color: "#f59e0b" },
];

const MONTHLY_SIGNUPS = [
  { name: "11월", value: 82 },
  { name: "12월", value: 104 },
  { name: "1월", value: 131 },
  { name: "2월", value: 148 },
  { name: "3월", value: 172 },
  { name: "4월", value: 56 },
];

const PAGE_SIZE = 5;

export default function AdminUsers() {
  const [loading, setLoading] = useState(true);
  const [roleTab, setRoleTab] = useState("전체");
  const [planFilter, setPlanFilter] = useState("전체");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<string>("");
  const [editPlan, setEditPlan] = useState<string>("");
  const [editEarlyAccess, setEditEarlyAccess] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    // Fetch from /api/admin/users, /api/admin/users/stats
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const filtered = MOCK_USERS.filter((u) => {
    const matchRole = roleTab === "전체" || u.role === roleTab;
    const matchPlan = planFilter === "전체" || u.plan === planFilter;
    const matchSearch =
      search === "" ||
      u.name.includes(search) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchPlan && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openEdit = (user: User) => {
    setSelectedUser(user);
    setEditRole(user.role);
    setEditPlan(user.plan);
    setEditEarlyAccess(user.isEarlyAccess);
  };

  const closeModal = () => setSelectedUser(null);

  const handleSave = () => {
    // Would call PATCH /api/admin/users/:id
    closeModal();
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDelete = (_id: string) => {
    // Would call DELETE /api/admin/users/:id
    setDeleteConfirm(null);
  };

  return (
    <div style={{ padding: "24px", maxWidth: 1280, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 24, marginTop: 0 }}>
        사용자 관리
      </h1>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <input
          type="text"
          placeholder="이름 또는 이메일 검색..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{
            padding: "8px 14px",
            border: "1px solid #E5E7EB",
            borderRadius: 8,
            fontSize: 16,
            color: "#111827",
            background: "#fff",
            minWidth: 220,
            minHeight: 44,
          }}
        />
        <div style={{ display: "flex", gap: 4 }}>
          {ROLE_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => { setRoleTab(tab); setPage(1); }}
              style={{
                fontSize: 13,
                padding: "6px 14px",
                borderRadius: 6,
                border: "1px solid",
                borderColor: roleTab === tab ? "#7c3aed" : "#E5E7EB",
                background: roleTab === tab ? "#7c3aed" : "#fff",
                color: roleTab === tab ? "#fff" : "#374151",
                cursor: "pointer",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <select
          value={planFilter}
          onChange={(e) => { setPlanFilter(e.target.value); setPage(1); }}
          style={{
            padding: "7px 12px",
            border: "1px solid #E5E7EB",
            borderRadius: 8,
            fontSize: 13,
            color: "#111827",
            background: "#fff",
          }}
        >
          {PLAN_OPTIONS.map((p) => <option key={p} value={p}>{p === "전체" ? "플랜 전체" : p}</option>)}
        </select>
      </div>

      {/* Table */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 24,
          overflowX: "auto",
        }}
      >
        {loading ? (
          <div style={{ padding: 24 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ height: 44, background: "#F3F4F6", borderRadius: 6, marginBottom: 8 }} />
            ))}
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead style={{ background: "#F9FAFB" }}>
              <tr>
                {["이름", "이메일", "역할", "플랜", "얼리액세스", "가입일", ""].map((h) => (
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
              {paginated.map((u) => (
                <tr
                  key={u.id}
                  style={{ borderBottom: "1px solid #F3F4F6", cursor: "pointer" }}
                  onClick={() => openEdit(u)}
                >
                  <td style={{ padding: "11px 16px", fontSize: 13, color: "#111827", fontWeight: 500 }}>{u.name}</td>
                  <td style={{ padding: "11px 16px", fontSize: 12, color: "#6b7280" }}>{u.email}</td>
                  <td style={{ padding: "11px 16px" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      color: ROLE_COLORS[u.role],
                      background: `${ROLE_COLORS[u.role]}18`,
                      borderRadius: 4, padding: "2px 7px",
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: "11px 16px" }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      color: PLAN_COLORS[u.plan] ?? "#6b7280",
                      background: `${PLAN_COLORS[u.plan] ?? "#6b7280"}18`,
                      borderRadius: 4, padding: "2px 7px",
                    }}>
                      {u.plan}
                    </span>
                  </td>
                  <td style={{ padding: "11px 16px" }}>
                    {u.isEarlyAccess && (
                      <span style={{
                        fontSize: 11, fontWeight: 600,
                        color: "#f59e0b", background: "#f59e0b18",
                        borderRadius: 4, padding: "2px 7px",
                      }}>
                        얼리 액세스
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "11px 16px", fontSize: 12, color: "#6b7280" }}>{u.createdAt}</td>
                  <td style={{ padding: "11px 16px" }} onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setDeleteConfirm(u.id)}
                      style={{
                        fontSize: 12, padding: "4px 10px", borderRadius: 6,
                        border: "1px solid #fecaca", background: "#fff5f5",
                        color: "#ef4444", cursor: "pointer",
                      }}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32 }}>
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          style={{
            padding: "6px 14px", borderRadius: 6, border: "1px solid #E5E7EB",
            background: "#fff", color: page <= 1 ? "#9ca3af" : "#374151",
            cursor: page <= 1 ? "not-allowed" : "pointer", fontSize: 13,
          }}
        >
          이전
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            style={{
              padding: "6px 12px", borderRadius: 6,
              border: "1px solid",
              borderColor: page === p ? "#7c3aed" : "#E5E7EB",
              background: page === p ? "#7c3aed" : "#fff",
              color: page === p ? "#fff" : "#374151",
              cursor: "pointer", fontSize: 13,
            }}
          >
            {p}
          </button>
        ))}
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          style={{
            padding: "6px 14px", borderRadius: 6, border: "1px solid #E5E7EB",
            background: "#fff", color: page >= totalPages ? "#9ca3af" : "#374151",
            cursor: page >= totalPages ? "not-allowed" : "pointer", fontSize: 13,
          }}
        >
          다음
        </button>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginTop: 0, marginBottom: 16 }}>역할 분포</h2>
          <DonutChart data={ROLE_DONUT} />
        </div>
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginTop: 0, marginBottom: 16 }}>월별 가입</h2>
          <BarChartComponent data={MONTHLY_SIGNUPS} />
        </div>
      </div>

      {/* Edit Modal */}
      {selectedUser && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: "#fff", borderRadius: 16, padding: 28,
              width: 400, maxWidth: "90vw", boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111827", marginTop: 0, marginBottom: 20 }}>
              사용자 편집
            </h3>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: "#374151", fontWeight: 500, marginBottom: 2 }}>{selectedUser.name}</div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{selectedUser.email}</div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>역할</label>
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13 }}
              >
                {["BRAND", "CREATOR", "ADMIN"].map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: "#6b7280", display: "block", marginBottom: 4 }}>플랜</label>
              <select
                value={editPlan}
                onChange={(e) => setEditPlan(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13 }}
              >
                {["FREE", "PRO", "ENTERPRISE"].map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
              <label style={{ fontSize: 13, color: "#374151" }}>얼리 액세스</label>
              <button
                onClick={() => setEditEarlyAccess((v) => !v)}
                style={{
                  width: 44, height: 24, borderRadius: 12,
                  border: "none", cursor: "pointer",
                  background: editEarlyAccess ? "#7c3aed" : "#E5E7EB",
                  position: "relative", transition: "background 0.2s",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 2, left: editEarlyAccess ? 22 : 2,
                    width: 20, height: 20, borderRadius: "50%",
                    background: "#fff", transition: "left 0.2s",
                  }}
                />
              </button>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleSave}
                style={{
                  flex: 1, padding: "9px 0", borderRadius: 8,
                  background: "#7c3aed", color: "#fff", border: "none",
                  fontSize: 14, fontWeight: 600, cursor: "pointer",
                }}
              >
                저장
              </button>
              <button
                onClick={closeModal}
                style={{
                  flex: 1, padding: "9px 0", borderRadius: 8,
                  background: "#F9FAFB", color: "#374151", border: "1px solid #E5E7EB",
                  fontSize: 14, cursor: "pointer",
                }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1001,
          }}
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            style={{
              background: "#fff", borderRadius: 16, padding: 28,
              width: 340, maxWidth: "90vw", textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 28, marginBottom: 12 }}>⚠️</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", marginBottom: 8, marginTop: 0 }}>
              사용자 삭제
            </h3>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
              이 작업은 되돌릴 수 없습니다. 정말 삭제하시겠습니까?
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                style={{
                  flex: 1, padding: "9px 0", borderRadius: 8,
                  background: "#ef4444", color: "#fff", border: "none",
                  fontSize: 14, fontWeight: 600, cursor: "pointer",
                }}
              >
                삭제
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  flex: 1, padding: "9px 0", borderRadius: 8,
                  background: "#F9FAFB", color: "#374151", border: "1px solid #E5E7EB",
                  fontSize: 14, cursor: "pointer",
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
