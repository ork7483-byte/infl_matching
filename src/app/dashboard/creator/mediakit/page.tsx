"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/layout/DashboardLayout";

type Theme = "minimal" | "modern" | "bold";

const THEMES: { id: Theme; label: string; description: string; accent: string }[] = [
  {
    id: "minimal",
    label: "미니멀",
    description: "깔끔하고 심플한 흑백 레이아웃",
    accent: "#6B7280",
  },
  {
    id: "modern",
    label: "모던",
    description: "그라데이션 포인트의 현대적인 디자인",
    accent: "#7c3aed",
  },
  {
    id: "bold",
    label: "볼드",
    description: "강렬한 색감의 임팩트 있는 스타일",
    accent: "#e94560",
  },
];

const MOCK_PROFILE = {
  name: "김인플루",
  handle: "@kim_influencer",
  bio: "라이프스타일 · 뷰티 · 여행을 사랑하는 크리에이터입니다 ✨",
  followers: "124.5K",
  er: "4.8%",
  avgReach: "42.3K",
  categories: ["라이프스타일", "뷰티", "여행", "피트니스"],
  contact: "contact@kiminfl.com",
};

const THEME_STYLES: Record<Theme, { bg: string; border: string; accent: string; headerBg: string }> = {
  minimal: {
    bg: "bg-white",
    border: "border-gray-200",
    accent: "text-gray-800",
    headerBg: "bg-gray-50",
  },
  modern: {
    bg: "bg-[#0f0f1a]",
    border: "border-[#E5E7EB]",
    accent: "text-[#7c3aed]",
    headerBg: "bg-gradient-to-br from-[#FFFFFF] to-[#0f0f1a]",
  },
  bold: {
    bg: "bg-[#FFFFFF]",
    border: "border-[#e94560]/30",
    accent: "text-[#e94560]",
    headerBg: "bg-gradient-to-br from-[#e94560]/10 to-[#FFFFFF]",
  },
};

export default function MediaKitPage() {
  const { data: session } = useSession();
  const [selectedTheme, setSelectedTheme] = useState<Theme>("modern");
  const [copied, setCopied] = useState(false);

  const userName = session?.user?.name ?? MOCK_PROFILE.name;
  const style = THEME_STYLES[selectedTheme];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://inflsync.com/mediakit/${MOCK_PROFILE.handle}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    alert("PDF 다운로드 기능은 준비 중입니다.");
  };

  return (
    <DashboardLayout role="creator">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">미디어킷 생성</h1>
          <p className="text-muted-foreground mt-1 text-sm">브랜드에 보낼 나만의 미디어킷을 만드세요.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left: Controls */}
          <div className="space-y-5">
            {/* Theme Selection */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h2 className="text-base font-semibold text-foreground mb-4">테마 선택</h2>
              <div className="grid grid-cols-3 gap-3">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                      selectedTheme === theme.id
                        ? "border-brand-pink bg-brand-pink/5"
                        : "border-border hover:border-border/80 bg-background"
                    }`}
                  >
                    {selectedTheme === theme.id && (
                      <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-brand-pink flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                    )}
                    {/* Theme color swatch */}
                    <div
                      className="w-8 h-8 rounded-lg mb-2"
                      style={{ backgroundColor: theme.accent }}
                    />
                    <p className="text-sm font-semibold text-foreground">{theme.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{theme.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleDownloadPDF}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-pink text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                PDF 다운로드
              </button>
              <button
                onClick={handleCopyLink}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-card border border-border text-foreground text-sm font-medium hover:bg-card-hover transition-colors"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-400">복사됨!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    공유 링크 복사
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h2 className="text-base font-semibold text-foreground mb-4">미리보기</h2>
            {/* Media Kit Preview */}
            <div className={`rounded-xl overflow-hidden border ${style.border} ${style.bg}`}>
              {/* Header */}
              <div className={`${style.headerBg} p-6 text-center`}>
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3"
                  style={{
                    background:
                      selectedTheme === "minimal"
                        ? "#6b7280"
                        : "linear-gradient(135deg, #7c3aed, #e94560)",
                  }}
                >
                  {userName[0]?.toUpperCase() ?? "K"}
                </div>
                <p className={`text-lg font-bold ${selectedTheme === "minimal" ? "text-gray-900" : "text-white"}`}>
                  {userName}
                </p>
                <p className={`text-sm mt-0.5 ${style.accent}`}>{MOCK_PROFILE.handle}</p>
                <p className={`text-xs mt-2 max-w-xs mx-auto ${selectedTheme === "minimal" ? "text-gray-500" : "text-gray-400"}`}>
                  {MOCK_PROFILE.bio}
                </p>
              </div>

              {/* Stats */}
              <div className={`grid grid-cols-3 divide-x ${style.border} border-t ${style.border}`}>
                {[
                  { label: "팔로워", value: MOCK_PROFILE.followers },
                  { label: "ER", value: MOCK_PROFILE.er },
                  { label: "평균 도달", value: MOCK_PROFILE.avgReach },
                ].map((stat) => (
                  <div key={stat.label} className="p-3 text-center">
                    <p className={`text-sm font-bold ${style.accent}`}>{stat.value}</p>
                    <p className={`text-xs mt-0.5 ${selectedTheme === "minimal" ? "text-gray-400" : "text-gray-500"}`}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Content Thumbnails */}
              <div className={`p-4 border-t ${style.border}`}>
                <p className={`text-xs font-medium mb-2 ${selectedTheme === "minimal" ? "text-gray-500" : "text-gray-400"}`}>
                  콘텐츠 샘플
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className={`aspect-square rounded-md ${
                        selectedTheme === "minimal" ? "bg-gray-100" : "bg-[#FFFFFF]"
                      } flex items-center justify-center`}
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories + Contact */}
              <div className={`p-4 border-t ${style.border}`}>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {MOCK_PROFILE.categories.map((cat) => (
                    <span
                      key={cat}
                      className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor:
                          selectedTheme === "minimal"
                            ? "#f3f4f6"
                            : "rgba(124,58,237,0.15)",
                        color:
                          selectedTheme === "minimal"
                            ? "#E5E7EB"
                            : "#a78bfa",
                      }}
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                <p className={`text-xs ${selectedTheme === "minimal" ? "text-gray-400" : "text-gray-500"}`}>
                  {MOCK_PROFILE.contact}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
