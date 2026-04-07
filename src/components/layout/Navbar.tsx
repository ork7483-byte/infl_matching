"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

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
  items: { label: string; href: string }[];
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onToggle: () => void;
}

function DropdownMenu({
  label,
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
      <button
        onClick={onToggle}
        className={`flex items-center gap-1 px-1 py-2 text-sm font-medium transition-colors duration-200 ${
          items.some((item) => pathname.startsWith(item.href))
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
      </button>

      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 transition-all duration-200 ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden py-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2.5 text-sm transition-colors duration-150 ${
                pathname === item.href
                  ? "text-brand-purple bg-brand-purple/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-card-hover"
              }`}
            >
              {item.label}
            </Link>
          ))}
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
    { label: "홈", href: "/" },
    { label: "인플루언서 검색", href: "/search" },
    { label: "요금제", href: "/pricing" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <span className="text-xl font-bold bg-gradient-brand bg-clip-text text-transparent">
                InfluSync
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
                label="For Brands"
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
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-brand text-white hover:opacity-90 transition-opacity duration-200"
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
                    href="/register"
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-brand text-white hover:opacity-90 transition-opacity duration-200 shadow-glow"
                  >
                    무료 시작하기
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-card transition-colors duration-200"
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
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-card border-l border-border shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="text-lg font-bold bg-gradient-brand bg-clip-text text-transparent">
            InfluSync
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background transition-colors duration-200"
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
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                pathname === link.href
                  ? "text-foreground bg-brand-purple/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-background"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* For Brands Mobile */}
          <div>
            <button
              onClick={() =>
                setMobileDropdown(
                  mobileDropdown === "brands" ? null : "brands"
                )
              }
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background transition-colors duration-150"
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
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
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
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background transition-colors duration-150"
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
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
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
                  href="/dashboard"
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-center bg-gradient-brand text-white hover:opacity-90 transition-opacity duration-200"
                >
                  대시보드
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground border border-border hover:border-border-light transition-colors duration-200"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-center text-muted-foreground hover:text-foreground border border-border hover:border-border-light transition-colors duration-200"
                >
                  로그인
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium text-center bg-gradient-brand text-white hover:opacity-90 transition-opacity duration-200"
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
