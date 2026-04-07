"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type Role = "BRAND" | "CREATOR";

const INDUSTRY_OPTIONS = [
  { value: "뷰티", label: "뷰티" },
  { value: "패션", label: "패션" },
  { value: "푸드", label: "푸드" },
  { value: "테크", label: "테크" },
  { value: "라이프스타일", label: "라이프스타일" },
  { value: "기타", label: "기타" },
];

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  if (pw.length === 0) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score: 1, label: "약함", color: "#ef4444" };
  if (score <= 3) return { score: 2, label: "보통", color: "#f59e0b" };
  return { score: 3, label: "강함", color: "#22c55e" };
}

const inputStyle = (focused: boolean): React.CSSProperties => ({
  background: "#FFFFFF",
  border: `1px solid ${focused ? "#7c3aed" : "#E5E7EB"}`,
  boxShadow: focused ? "0 0 0 1px #7c3aed" : "none",
  color: "#111827",
  transition: "border-color 0.15s, box-shadow 0.15s",
});

function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium mb-1.5"
        style={{ color: "#6B7280" }}
      >
        {label}
        {required && <span style={{ color: "#e94560" }} className="ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={type === "password" ? "new-password" : type === "email" ? "email" : "off"}
        className="w-full rounded-lg px-4 py-3 text-sm outline-none"
        style={inputStyle(focused)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium mb-1.5"
        style={{ color: "#6B7280" }}
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg px-4 py-3 text-sm outline-none appearance-none"
        style={inputStyle(focused)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <option value="" style={{ background: "#FFFFFF" }}>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ background: "#FFFFFF" }}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role") as Role | null;

  const [step, setStep] = useState<"role" | "form">(roleParam ? "form" : "role");
  const [selectedRole, setSelectedRole] = useState<Role | null>(roleParam);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  // Brand
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [website, setWebsite] = useState("");
  // Creator
  const [username, setUsername] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);

  const passwordStrength = getPasswordStrength(password);

  useEffect(() => {
    if (roleParam) {
      setSelectedRole(roleParam);
      setStep("form");
    }
  }, [roleParam]);

  function handleRoleSelect(role: Role) {
    setAnimating(true);
    setSelectedRole(role);
    setTimeout(() => {
      setStep("form");
      setAnimating(false);
    }, 200);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    try {
      const body: Record<string, string> = {
        email,
        password,
        role: selectedRole!,
      };
      if (name) body.name = name;
      if (selectedRole === "BRAND") {
        body.companyName = companyName;
        if (industry) body.industry = industry;
        if (website) body.website = website;
      } else {
        body.username = username;
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "회원가입에 실패했습니다.");
        return;
      }

      // Auto-login after registration
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError("가입은 완료되었지만 로그인에 실패했습니다. 로그인 페이지로 이동해주세요.");
        return;
      }

      router.push(
        selectedRole === "BRAND" ? "/dashboard/brand" : "/dashboard/creator"
      );
    } catch {
      setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "#FFFFFF" }}
    >
      {/* Background glows */}
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
            {step === "role" ? "시작하는 방법을 선택하세요" : "계정 정보를 입력하세요"}
          </p>
        </div>

        {/* Step 1: Role selection */}
        {step === "role" && (
          <div
            className="space-y-4"
            style={{
              opacity: animating ? 0 : 1,
              transform: animating ? "translateY(-8px)" : "translateY(0)",
              transition: "opacity 0.2s, transform 0.2s",
            }}
          >
            {/* Brand card */}
            <button
              type="button"
              onClick={() => handleRoleSelect("BRAND")}
              className="w-full rounded-2xl p-6 text-left group transition-all duration-200"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#7c3aed";
                e.currentTarget.style.boxShadow = "0 0 24px rgba(124,58,237,0.15)";
                e.currentTarget.style.background = "#F5F3FF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#E5E7EB";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.background = "#FFFFFF";
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)" }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                    <line x1="12" y1="12" x2="12" y2="16" />
                    <line x1="10" y1="14" x2="14" y2="14" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-base" style={{ color: "#111827" }}>
                      브랜드
                    </h3>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                  <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
                    인플루언서를 찾고 캠페인을 관리하는 브랜드 또는 마케터
                  </p>
                  <span
                    className="inline-block mt-3 text-xs font-medium px-3 py-1 rounded-full"
                    style={{ background: "rgba(124,58,237,0.15)", color: "#7c3aed" }}
                  >
                    시작하기
                  </span>
                </div>
              </div>
            </button>

            {/* Creator card */}
            <button
              type="button"
              onClick={() => handleRoleSelect("CREATOR")}
              className="w-full rounded-2xl p-6 text-left transition-all duration-200"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#e94560";
                e.currentTarget.style.boxShadow = "0 0 24px rgba(233,69,96,0.15)";
                e.currentTarget.style.background = "#FFF1F2";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#E5E7EB";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.background = "#FFFFFF";
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(233,69,96,0.15)", border: "1px solid rgba(233,69,96,0.3)" }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e94560" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-base" style={{ color: "#111827" }}>
                      크리에이터
                    </h3>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e94560" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                  <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
                    브랜드와 협업하고 수익을 창출하는 인플루언서 또는 크리에이터
                  </p>
                  <span
                    className="inline-block mt-3 text-xs font-medium px-3 py-1 rounded-full"
                    style={{ background: "rgba(233,69,96,0.15)", color: "#e94560" }}
                  >
                    시작하기
                  </span>
                </div>
              </div>
            </button>

            <p className="text-center text-sm mt-6" style={{ color: "#6B7280" }}>
              이미 계정이 있으신가요?{" "}
              <Link
                href="/login"
                className="font-medium"
                style={{ color: "#7c3aed" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#8b5cf6")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#7c3aed")}
              >
                로그인
              </Link>
            </p>
          </div>
        )}

        {/* Step 2: Registration form */}
        {step === "form" && selectedRole && (
          <div
            style={{
              opacity: animating ? 0 : 1,
              transform: animating ? "translateY(8px)" : "translateY(0)",
              transition: "opacity 0.2s, transform 0.2s",
            }}
          >
            {/* Role badge + back button */}
            <div className="flex items-center gap-3 mb-4">
              <button
                type="button"
                onClick={() => {
                  setAnimating(true);
                  setTimeout(() => {
                    setStep("role");
                    setAnimating(false);
                  }, 200);
                }}
                className="flex items-center gap-1.5 text-sm transition-colors"
                style={{ color: "#6B7280" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#111827")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 5l-7 7 7 7" />
                </svg>
                뒤로
              </button>
              <span
                className="text-xs font-medium px-2.5 py-1 rounded-full"
                style={
                  selectedRole === "BRAND"
                    ? { background: "rgba(124,58,237,0.15)", color: "#7c3aed" }
                    : { background: "rgba(233,69,96,0.15)", color: "#e94560" }
                }
              >
                {selectedRole === "BRAND" ? "브랜드" : "크리에이터"}
              </span>
            </div>

            <div
              className="rounded-2xl p-8"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E5E7EB",
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              }}
            >
              <h1 className="text-xl font-semibold mb-6" style={{ color: "#111827" }}>
                회원가입
              </h1>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Common fields */}
                <InputField
                  id="email"
                  label="이메일"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="name@company.com"
                  required
                />

                {/* Password with strength indicator */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: "#6B7280" }}
                  >
                    비밀번호<span style={{ color: "#e94560" }} className="ml-0.5">*</span>
                  </label>
                  <PasswordInput
                    id="password"
                    value={password}
                    onChange={setPassword}
                    placeholder="최소 8자 이상"
                  />
                  {/* Strength indicator */}
                  {password.length > 0 && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3].map((seg) => (
                          <div
                            key={seg}
                            className="h-1 flex-1 rounded-full transition-all duration-300"
                            style={{
                              background:
                                passwordStrength.score >= seg
                                  ? passwordStrength.color
                                  : "#E5E7EB",
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-xs" style={{ color: passwordStrength.color }}>
                        비밀번호 강도: {passwordStrength.label}
                      </p>
                    </div>
                  )}
                </div>

                <InputField
                  id="confirmPassword"
                  label="비밀번호 확인"
                  type="password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="비밀번호를 다시 입력하세요"
                  required
                />

                {/* Confirm password match indicator */}
                {confirmPassword.length > 0 && (
                  <p
                    className="text-xs -mt-2"
                    style={{
                      color: password === confirmPassword ? "#22c55e" : "#ef4444",
                    }}
                  >
                    {password === confirmPassword
                      ? "비밀번호가 일치합니다."
                      : "비밀번호가 일치하지 않습니다."}
                  </p>
                )}

                <InputField
                  id="name"
                  label="이름 (선택)"
                  value={name}
                  onChange={setName}
                  placeholder="홍길동"
                />

                {/* Divider */}
                <div className="flex items-center gap-3 py-1">
                  <div className="flex-1 h-px" style={{ background: "#E5E7EB" }} />
                  <span className="text-xs" style={{ color: "#6B7280" }}>
                    {selectedRole === "BRAND" ? "브랜드 정보" : "크리에이터 정보"}
                  </span>
                  <div className="flex-1 h-px" style={{ background: "#E5E7EB" }} />
                </div>

                {/* Role-specific fields */}
                {selectedRole === "BRAND" && (
                  <>
                    <InputField
                      id="companyName"
                      label="회사명"
                      value={companyName}
                      onChange={setCompanyName}
                      placeholder="(주)인플루싱크"
                      required
                    />
                    <SelectField
                      id="industry"
                      label="업종 (선택)"
                      value={industry}
                      onChange={setIndustry}
                      options={INDUSTRY_OPTIONS}
                      placeholder="업종을 선택하세요"
                    />
                    <InputField
                      id="website"
                      label="웹사이트 (선택)"
                      type="url"
                      value={website}
                      onChange={setWebsite}
                      placeholder="https://example.com"
                    />
                  </>
                )}

                {selectedRole === "CREATOR" && (
                  <InputField
                    id="username"
                    label="Instagram 사용자명"
                    value={username}
                    onChange={setUsername}
                    placeholder="@username"
                    required
                  />
                )}

                {/* Error */}
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
                  className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-all mt-2"
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
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      가입 중...
                    </span>
                  ) : (
                    "가입하기"
                  )}
                </button>
              </form>
            </div>

            <p className="text-center text-sm mt-6" style={{ color: "#6B7280" }}>
              이미 계정이 있으신가요?{" "}
              <Link
                href="/login"
                className="font-medium"
                style={{ color: "#7c3aed" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#8b5cf6")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#7c3aed")}
              >
                로그인
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Separate password input component with show/hide toggle
function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        autoComplete="new-password"
        className="w-full rounded-lg px-4 py-3 pr-11 text-sm outline-none"
        style={inputStyle(focused)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
        style={{ color: "#6B7280" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#111827")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#6B7280")}
        tabIndex={-1}
      >
        {show ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: "#FFFFFF" }}
        >
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "#7c3aed", borderTopColor: "transparent" }}
          />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
