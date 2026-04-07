"use client";

import { useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const REWARD_TIERS = [
  { count: 1, reward: "프리미엄 테마 해제", icon: "🎨" },
  { count: 3, reward: "인증 뱃지 부여", icon: "🏅" },
  { count: 5, reward: "검색 상단 노출", icon: "📈" },
  { count: 10, reward: "브랜드 우선 매칭", icon: "⭐" },
];

const MOCK_HISTORY: { name: string; date: string; status: "joined" | "pending" }[] = [];

function generateReferralCode(userId?: string | null): string {
  if (!userId) return "INFLIX-DEMO";
  const hash = Array.from(userId)
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
    .toString(36)
    .toUpperCase()
    .slice(0, 6);
  return `INFLIX-${hash}`;
}

export default function InvitePage() {
  const { data: session } = useSession();
  const [copied, setCopied] = useState(false);
  const invitedCount = 0;

  const referralCode = useMemo(
    () => generateReferralCode((session?.user as { id?: string })?.id ?? session?.user?.email),
    [session]
  );
  const inviteUrl = `https://inflix.io/invite/${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const nextTier = REWARD_TIERS.find((t) => t.count > invitedCount);
  const remainingToNext = nextTier ? nextTier.count - invitedCount : 0;

  const handleShareKakao = () => {
    alert("카카오톡 공유 기능은 준비 중입니다.");
  };

  const handleShareInstagram = () => {
    alert("Instagram DM 공유 기능은 준비 중입니다.");
  };

  return (
    <DashboardLayout role="creator">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">친구 초대</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            친구를 초대하고 프리미엄 혜택을 받으세요 🎁
          </p>
        </div>

        {/* Hero Banner */}
        <div className="rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#a78bfa] p-6 text-white text-center">
          <div className="text-4xl mb-3">🎁</div>
          <h2 className="text-xl font-bold mb-1">친구 초대하고 프리미엄 혜택 받기</h2>
          <p className="text-white/80 text-sm">
            1명만 초대해도 프리미엄 테마가 열려요!
          </p>
        </div>

        {/* Invite Link */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
          <h3 className="text-sm font-semibold text-[#374151] mb-3">내 초대 링크</h3>
          <div className="flex items-center gap-2 p-3 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] mb-3">
            <span className="flex-1 text-sm text-[#374151] font-mono truncate">{inviteUrl}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#7c3aed] text-white text-sm font-medium hover:bg-[#6d28d9] transition-colors"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  복사됨!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  링크 복사
                </>
              )}
            </button>

            <button
              onClick={handleShareInstagram}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#E5E7EB] text-[#374151] text-sm font-medium hover:bg-[#F9FAFB] transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              Instagram DM
            </button>

            <button
              onClick={handleShareKakao}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#E5E7EB] text-[#374151] text-sm font-medium hover:bg-[#F9FAFB] transition-colors"
            >
              <span className="text-base">💬</span>
              카카오톡
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-[#374151]">초대 현황</h3>
            <span className="text-sm font-bold text-[#7c3aed]">
              현재 {invitedCount}명 초대
            </span>
          </div>

          {/* Progress bar */}
          <div className="relative h-3 bg-[#F3F4F6] rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] rounded-full transition-all duration-500"
              style={{
                width: nextTier
                  ? `${Math.min((invitedCount / nextTier.count) * 100, 100)}%`
                  : "100%",
              }}
            />
          </div>

          {nextTier && (
            <p className="text-xs text-[#9CA3AF]">
              다음 보상까지 {remainingToNext}명 더 초대하면{" "}
              <span className="font-semibold text-[#7c3aed]">{nextTier.icon} {nextTier.reward}</span>
            </p>
          )}
        </div>

        {/* Reward Tiers */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
            <h3 className="text-sm font-semibold text-[#374151]">보상 단계</h3>
          </div>
          <div className="divide-y divide-[#E5E7EB]">
            {REWARD_TIERS.map((tier) => {
              const achieved = invitedCount >= tier.count;
              return (
                <div
                  key={tier.count}
                  className={`flex items-center justify-between px-5 py-4 ${
                    achieved ? "bg-[#7c3aed]/5" : "bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0 ${
                        achieved ? "bg-[#7c3aed]/15" : "bg-[#F3F4F6]"
                      }`}
                    >
                      {achieved ? "✅" : tier.icon}
                    </div>
                    <div>
                      <div className={`text-sm font-medium ${achieved ? "text-[#7c3aed]" : "text-[#374151]"}`}>
                        {tier.reward}
                      </div>
                      <div className="text-xs text-[#9CA3AF]">{tier.count}명 초대 시 달성</div>
                    </div>
                  </div>
                  {achieved && (
                    <span className="text-xs font-medium text-[#7c3aed] bg-[#7c3aed]/10 px-2 py-1 rounded-full">
                      달성!
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Invite History */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E5E7EB] bg-[#F9FAFB]">
            <h3 className="text-sm font-semibold text-[#374151]">초대 기록</h3>
          </div>

          {MOCK_HISTORY.length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-sm text-[#9CA3AF]">아직 초대한 친구가 없어요.</p>
              <p className="text-xs text-[#9CA3AF] mt-1">링크를 공유해 첫 번째 친구를 초대해보세요!</p>
            </div>
          ) : (
            <div className="divide-y divide-[#E5E7EB]">
              {MOCK_HISTORY.map((item) => (
                <div key={item.name} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <div className="text-sm font-medium text-[#374151]">{item.name}</div>
                    <div className="text-xs text-[#9CA3AF]">{item.date}</div>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      item.status === "joined"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status === "joined" ? "가입 완료" : "대기 중"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
