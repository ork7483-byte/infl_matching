"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const navItems = [
  { label: "대시보드", href: "/admin", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  {
    label: "마케팅",
    href: "/admin/marketing",
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    subItems: [
      { label: "마케팅 홈", href: "/admin/marketing" },
      { label: "퍼널 대시보드", href: "/admin/marketing/funnel" },
      { label: "유입 분석", href: "/admin/marketing/acquisition" },
      { label: "전환 분석", href: "/admin/marketing/conversion" },
      { label: "유지 분석", href: "/admin/marketing/retention" },
      { label: "실험실", href: "/admin/marketing/lab" },
    ],
  },
  { label: "사용자 관리", href: "/admin/users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
  { label: "캠페인", href: "/admin/campaigns", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" },
  { label: "매출/정산", href: "/admin/revenue", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { label: "시스템", href: "/admin/system", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const hasSubItems = "subItems" in item && item.subItems;
          const isParentActive = isActive(item.href);

          return (
            <div key={item.href}>
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors min-h-[44px] cursor-pointer ${
                  isParentActive && !hasSubItems
                    ? "bg-[#7c3aed]/10 text-[#7c3aed] font-medium"
                    : isParentActive && hasSubItems
                    ? "text-[#7c3aed] font-medium"
                    : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]"
                }`}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
                {item.label}
                {hasSubItems && (
                  <svg className={`w-4 h-4 ml-auto transition-transform ${isParentActive ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </Link>
              {hasSubItems && isParentActive && (
                <div className="ml-8 mt-1 space-y-0.5">
                  {item.subItems.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block px-3 py-2 rounded-md text-xs transition-colors cursor-pointer min-h-[36px] flex items-center ${
                        pathname === sub.href
                          ? "text-[#7c3aed] bg-[#7c3aed]/5 font-medium"
                          : "text-[#9CA3AF] hover:text-[#6B7280] hover:bg-[#F3F4F6]"
                      }`}
                    >
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-[#E5E7EB]">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-sm text-[#6B7280] hover:text-[#111827] cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          메인 사이트
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#E5E7EB] h-14 flex items-center px-4 lg:px-6">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 mr-2 rounded-lg text-[#6B7280] hover:bg-[#F3F4F6] min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Link href="/admin" className="font-bold text-[#111827]">
          Inflix <span className="text-amber-600 text-sm">Admin</span>
        </Link>
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden sm:block text-sm text-[#6B7280]">
            {session?.user?.email}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm text-[#6B7280] hover:text-[#111827] cursor-pointer min-h-[44px] px-2 flex items-center"
          >
            로그아웃
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-60 bg-[#F9FAFB] border-r border-[#E5E7EB] flex-shrink-0">
          <SidebarContent />
        </aside>

        {/* Mobile Overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setMobileOpen(false)} />
        )}

        {/* Mobile Sidebar */}
        <div className={`fixed top-14 left-0 z-50 h-[calc(100%-56px)] w-60 bg-[#F9FAFB] border-r border-[#E5E7EB] transform transition-transform lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <SidebarContent />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
