"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const BENEFITS = [
  {
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    title: "오디언스 분석",
    description: "팔로워의 연령, 성별, 지역 등 상세 오디언스 데이터를 자동으로 분석합니다.",
  },
  {
    icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    title: "정확한 도달 수",
    description: "게시물별 실제 도달 수, 노출 수, 참여율을 정확하게 측정합니다.",
  },
  {
    icon: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z",
    title: "AI Muse 자동 생성",
    description: "연동 즉시 AI Muse이 생성되어 자는 동안에도 수익이 자동으로 발생합니다.",
  },
  {
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    title: "성장 트래킹",
    description: "팔로워 성장 추이와 콘텐츠 성과를 자동으로 트래킹합니다.",
  },
];

export default function InstagramConnectPage() {
  const { data: session } = useSession();
  const [showComingSoon, setShowComingSoon] = useState(false);

  // Mock: check if connected
  const isConnected = false;
  const connectedAccount = { username: "@kim_influencer", followers: "124.5K" };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Nav */}
      <header className="border-b border-border bg-card/50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-lg font-bold bg-gradient-to-r from-brand-purple to-brand-pink bg-clip-text text-transparent">
            Inflix
          </Link>
          {session?.user && (
            <Link
              href="/dashboard/creator"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              대시보드로 돌아가기
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {isConnected ? (
            /* Connected State */
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-pink to-brand-purple flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm mb-3">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  연동 완료
                </div>
                <h1 className="text-2xl font-bold text-foreground">Instagram 연동됨</h1>
                <p className="text-muted-foreground mt-2">
                  {connectedAccount.username} · 팔로워 {connectedAccount.followers}
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-sm text-muted-foreground">
                Instagram 계정이 성공적으로 연동되었습니다. 대시보드에서 모든 데이터를 확인할 수 있습니다.
              </div>
              <Link
                href="/dashboard/creator"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-pink text-white font-medium hover:opacity-90 transition-opacity min-h-[44px] cursor-pointer w-full sm:w-auto justify-center"
              >
                대시보드 바로가기
              </Link>
            </div>
          ) : (
            /* Connect State */
            <div className="space-y-8">
              {/* Hero */}
              <div className="text-center space-y-4">
                {/* Instagram gradient icon */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#f09433] via-[#e6683c] via-[#dc2743] to-[#cc2366] to-[#bc1888] flex items-center justify-center mx-auto">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Instagram 연동하기</h1>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Instagram 계정을 연동하면 더 정확한 분석 데이터를 받을 수 있습니다.
                  </p>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                {BENEFITS.map((benefit) => (
                  <div
                    key={benefit.title}
                    className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl"
                  >
                    <div className="w-10 h-10 rounded-lg bg-brand-pink/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-brand-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={benefit.icon} />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{benefit.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="space-y-3">
                <button
                  onClick={() => setShowComingSoon(true)}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] text-white font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 min-h-[48px] cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  Instagram 연동하기
                </button>

                {showComingSoon && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-sm text-yellow-400">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Instagram OAuth 연동 기능이 곧 출시됩니다. 빠르게 준비하고 있습니다!
                  </div>
                )}

                <p className="text-center text-xs text-muted-foreground">
                  Instagram Basic Display API를 통해 안전하게 연동됩니다.{" "}
                  <br />
                  Inflix는 게시물을 수정하거나 삭제하지 않습니다.
                </p>
              </div>

              {session?.user && (
                <Link
                  href="/dashboard/creator"
                  className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  나중에 연동하기
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
