"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        return;
      }

      // Fetch session to determine role-based redirect
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const role = session?.user?.role;

      if (role === "ADMIN") {
        router.push("/admin");
      } else if (role === "BRAND") {
        router.push("/dashboard/brand");
      } else if (role === "CREATOR") {
        router.push("/dashboard/creator");
      } else {
        router.push("/");
      }
    } catch {
      setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#FFFFFF" }}>
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "#7c3aed" }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "#e94560" }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7c3aed, #e94560)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                  fill="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              className="text-2xl font-bold tracking-tight"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #e94560)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Inflix
            </span>
          </div>
          <p style={{ color: "#6B7280" }} className="text-sm mt-1">
            인플루언서 마케팅 플랫폼
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-6 sm:p-8"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5E7EB",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          }}
        >
          <h1
            className="text-xl font-semibold mb-6"
            style={{ color: "#111827" }}
          >
            로그인
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1.5"
                style={{ color: "#6B7280" }}
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full rounded-lg px-4 py-3 text-base outline-none transition-all"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  color: "#111827",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#7c3aed";
                  e.currentTarget.style.boxShadow = "0 0 0 1px #7c3aed";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#E5E7EB";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1.5"
                style={{ color: "#6B7280" }}
              >
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg px-4 py-3 text-base outline-none transition-all"
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  color: "#111827",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#7c3aed";
                  e.currentTarget.style.boxShadow = "0 0 0 1px #7c3aed";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#E5E7EB";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Error message */}
            {error && (
              <div
                className="rounded-lg px-4 py-3 text-sm"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  color: "#ef4444",
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-all mt-2 relative overflow-hidden min-h-[48px]"
              style={{
                background: loading
                  ? "#E5E7EB"
                  : "linear-gradient(135deg, #7c3aed, #e94560)",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  로그인 중...
                </span>
              ) : (
                "로그인"
              )}
            </button>
          </form>
        </div>

        {/* Sign up link */}
        <p
          className="text-center text-sm mt-6"
          style={{ color: "#6B7280" }}
        >
          계정이 없으신가요?{" "}
          <Link
            href="/signup"
            className="font-medium transition-colors"
            style={{ color: "#7c3aed" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#8b5cf6")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#7c3aed")}
          >
            무료 회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}
