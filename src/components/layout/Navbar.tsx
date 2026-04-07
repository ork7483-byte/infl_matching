"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const toolsDropdown = [
  // 분석 도구
  { label: "— 분석 도구", href: "", group: true },
  { label: "참여율 계산기", href: "/tools/engagement-rate" },
  { label: "가짜 팔로워 체크", href: "/tools/fake-follower-check" },
  { label: "프로필 감사 리포트", href: "/tools/instagram-audit" },
  { label: "팔로워 수 체크", href: "/tools/follower-count" },
  // 비교/탐색
  { label: "— 비교/탐색", href: "", group: true },
  { label: "인플루언서 비교", href: "/tools/compare" },
  { label: "유사 인플루언서 찾기", href: "/tools/lookalike" },
  { label: "카테고리별 랭킹", href: "/tools/top-influencers" },
  { label: "지역별 인플루언서", href: "/tools/influencers-by-location" },
  { label: "트렌딩 인플루언서", href: "/tools/trending" },
  // 비용/성과
  { label: "— 비용/성과", href: "", group: true },
  { label: "예상 단가 계산기", href: "/tools/price-calculator" },
  { label: "ROI 계산기", href: "/tools/roi-calculator" },
  { label: "미디어 가치(EMV)", href: "/tools/emv-calculator" },
  // 시장 분석
  { label: "— 시장 분석", href: "", group: true },
  { label: "해시태그 분석기", href: "/tools/hashtag-analyzer" },
  { label: "경쟁사 분석", href: "/tools/competitor-analysis" },
  { label: "브랜드 멘션 트래커", href: "/tools/brand-mention-tracker" },
  // 템플릿
  { label: "— 템플릿", href: "", group: true },
  { label: "캠페인 브리프 템플릿", href: "/tools/campaign-brief-template" },
  { label: "계약서 템플릿", href: "/tools/contract-template" },
];

const brandsDropdown = [
  { label: "브랜드를 위한 솔루션", href: "/for-brands" },
  { label: "캠페인 관리", href: "/for-brands/campaign" },
  { label: "성과 분석 & 리포트", href: "/for-brands/analytics" },
  { label: "인플루언서 검증", href: "/for-brands/verification" },
  { label: "AI 성과 예측", href: "/for-brands/ai-prediction" },
];

const creatorsDropdown = [
  { label: "크리에이터를 위한 솔루션", href: "/for-creators" },
  { label: "미디어킷 자동 생성", href: "/for-creators/mediakit" },
  { label: "캠페인 마켓플레이스", href: "/for-creators/marketplace" },
  { label: "내 성장 트래커", href: "/for-creators/growth" },
  { label: "수익 & 정산 관리", href: "/for-creators/earnings" },
];

interface DropdownMenuProps {
  label: string;
  href: string;
  items: { label: string; href: string }[];
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onToggle: () => void;
}

function DropdownMenu({
  label,
  href,
  items,
  isOpen,
  onMouseEnter,
  onMouseLeave,
  onToggle,
}: DropdownMenuProps) {
  const pathname = usePathname();

  return (
    <div
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Link
        href={href}
        onClick={(e) => {
          // On mobile (no hover), toggle dropdown instead of navigating
          if (window.innerWidth < 768) {
            e.preventDefault();
            onToggle();
          }
        }}
        className={`flex items-center gap-1 px-1 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer ${
          pathname.startsWith(href)
            ? "text-brand-purple"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {label}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Link>

      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 transition-all duration-200 ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden py-1 max-h-[70vh] overflow-y-auto">
          {items.map((item, i) =>
            (item as { group?: boolean }).group ? (
              <div key={`group-${i}`} className="px-4 py-1.5 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mt-1 first:mt-0">
                {item.label.replace("— ", "")}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 text-sm transition-colors duration-150 ${
                  pathname === item.href
                    ? "text-brand-purple bg-brand-purple/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-card-hover"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMobileOpen(false);
    setMobileDropdown(null);
  }, [pathname]);

  const handleMouseEnter = (key: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setOpenDropdown(key);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 100);
  };

  const navLinks = [
    { label: "Search", href: "/" },
    { label: "Gallery", href: "/gallery" },
    { label: "AI Studio ✨", href: "/ai-studio" },
    { label: "요금제", href: "/pricing" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <span className="text-xl font-bold">
                <span className="text-[#111827]">Infl</span><span className="text-[#7c3aed]">ix</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    pathname === link.href
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <DropdownMenu
                label="무료 도구"
                href="/tools/engagement-rate"
                items={toolsDropdown}
                isOpen={openDropdown === "tools"}
                onMouseEnter={() => handleMouseEnter("tools")}
                onMouseLeave={handleMouseLeave}
                onToggle={() =>
                  setOpenDropdown(openDropdown === "tools" ? null : "tools")
                }
              />

              <DropdownMenu
                label="For Brands"
                href="/for-brands"
                items={brandsDropdown}
                isOpen={openDropdown === "brands"}
                onMouseEnter={() => handleMouseEnter("brands")}
                onMouseLeave={handleMouseLeave}
                onToggle={() =>
                  setOpenDropdown(openDropdown === "brands" ? null : "brands")
                }
              />

              <DropdownMenu
                label="For Creators"
                href="/for-creators"
                items={creatorsDropdown}
                isOpen={openDropdown === "creators"}
                onMouseEnter={() => handleMouseEnter("creators")}
                onMouseLeave={handleMouseLeave}
                onToggle={() =>
                  setOpenDropdown(
                    openDropdown === "creators" ? null : "creators"
                  )
                }
              />
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-3">
              {session ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    {session.user?.name ?? session.user?.email}
                  </span>
                  {(session.user as { role?: string })?.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="px-3 py-1.5 text-xs font-medium rounded-md bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors cursor-pointer"
                    >
                      관리자
                    </Link>
                  )}
                  <Link
                    href={(session?.user as { role?: string })?.role === "ADMIN" ? "/admin" : (session?.user as { role?: string })?.role === "BRAND" ? "/dashboard/brand" : "/dashboard/creator"}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-[#7c3aed] text-white hover:bg-[#6d28d9] transition-colors duration-200"
                  >
                    대시보드
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg hover:border-border-light transition-colors duration-200"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    로그인
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-[#7c3aed] text-white hover:bg-[#6d28d9] transition-colors duration-200"
                  >
                    무료 시작하기
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden min-w-[44px] min-h-[44px] p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors duration-200 cursor-pointer flex items-center justify-center"
              aria-label="메뉴 열기"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[min(288px,85vw)] bg-white border-l border-[#E5E7EB] shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB]">
          <span className="text-lg font-bold">
            <span className="text-[#111827]">Infl</span><span className="text-[#7c3aed]">ix</span>
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background transition-colors duration-200 cursor-pointer flex items-center justify-center"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-4rem)]">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150 min-h-[44px] flex items-center cursor-pointer ${
                pathname === link.href
                  ? "text-foreground bg-brand-purple/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-background"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Tools Mobile */}
          <div>
            <button
              onClick={() =>
                setMobileDropdown(
                  mobileDropdown === "tools" ? null : "tools"
                )
              }
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background transition-colors duration-150 min-h-[44px] cursor-pointer"
            >
              무료 도구
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${mobileDropdown === "tools" ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {mobileDropdown === "tools" && (
              <div className="ml-3 mt-1 space-y-0.5 max-h-[40vh] overflow-y-auto">
                {toolsDropdown.map((item, i) =>
                  (item as { group?: boolean }).group ? (
                    <div key={`group-${i}`} className="px-4 py-1.5 text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mt-1 first:mt-0">
                      {item.label.replace("— ", "")}
                    </div>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block px-4 py-3 rounded-lg text-sm transition-colors duration-150 min-h-[44px] flex items-center cursor-pointer ${
                        pathname === item.href
                          ? "text-brand-purple bg-brand-purple/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-background"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>
            )}
          </div>

          {/* For Brands Mobile */}
          <div>
            <button
              onClick={() =>
                setMobileDropdown(
                  mobileDropdown === "brands" ? null : "brands"
                )
              }
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background transition-colors duration-150 min-h-[44px] cursor-pointer"
            >
              For Brands
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${mobileDropdown === "brands" ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {mobileDropdown === "brands" && (
              <div className="ml-3 mt-1 space-y-1">
                {brandsDropdown.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-4 py-3 rounded-lg text-sm transition-colors duration-150 min-h-[44px] flex items-center cursor-pointer ${
                      pathname === item.href
                        ? "text-brand-purple bg-brand-purple/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-background"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* For Creators Mobile */}
          <div>
            <button
              onClick={() =>
                setMobileDropdown(
                  mobileDropdown === "creators" ? null : "creators"
                )
              }
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background transition-colors duration-150 min-h-[44px] cursor-pointer"
            >
              For Creators
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${mobileDropdown === "creators" ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {mobileDropdown === "creators" && (
              <div className="ml-3 mt-1 space-y-1">
                {creatorsDropdown.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-4 py-3 rounded-lg text-sm transition-colors duration-150 min-h-[44px] flex items-center cursor-pointer ${
                      pathname === item.href
                        ? "text-brand-purple bg-brand-purple/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-background"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Auth */}
          <div className="pt-4 border-t border-border space-y-2">
            {session ? (
              <>
                <p className="px-3 text-xs text-muted truncate">
                  {session.user?.name ?? session.user?.email}
                </p>
                <Link
                  href={(session?.user as { role?: string })?.role === "ADMIN" ? "/admin" : (session?.user as { role?: string })?.role === "BRAND" ? "/dashboard/brand" : "/dashboard/creator"}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-center bg-[#7c3aed] text-white hover:bg-[#6d28d9] transition-colors duration-200 min-h-[44px] flex items-center justify-center cursor-pointer"
                >
                  대시보드
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground border border-border hover:border-border-light transition-colors duration-200 min-h-[44px] cursor-pointer"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-center text-muted-foreground hover:text-foreground border border-border hover:border-border-light transition-colors duration-200 min-h-[44px] flex items-center justify-center cursor-pointer"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-center bg-[#7c3aed] text-white hover:bg-[#6d28d9] transition-colors duration-200 min-h-[44px] flex items-center justify-center cursor-pointer"
                >
                  무료 시작하기
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
