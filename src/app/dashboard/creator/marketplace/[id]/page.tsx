"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface CampaignDetail {
  id: string;
  name: string;
  brand: string;
  brandLogo: string;
  description: string;
  category: string;
  rewardType: "PAID" | "PRODUCT" | "MIXED";
  rewardAmount: string;
  startDate: string;
  endDate: string;
  contentType: string;
  requirements: string;
  minFollowers: number;
  minER: number;
}

interface ApplicationStatus {
  applied: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED" | null;
}

const MOCK_CAMPAIGN: CampaignDetail = {
  id: "1",
  name: "여름 뷰티 신제품 리뷰 캠페인",
  brand: "GlowBrand",
  brandLogo: "G",
  description:
    "GlowBrand의 여름 신제품 라인인 '썸머 글로우' 제품 시리즈의 리뷰 콘텐츠를 제작해 주실 크리에이터를 모집합니다. 진정한 사용 경험을 바탕으로 자연스러운 콘텐츠를 제작해 주세요. 피드 1회 + 스토리 3회 이상 게시를 기본 조건으로 합니다.",
  category: "뷰티",
  rewardType: "PAID",
  rewardAmount: "₩300,000",
  startDate: "2025-07-01",
  endDate: "2025-07-31",
  contentType: "릴스/피드",
  requirements: "팔로워 1만 이상, ER 3% 이상, 뷰티 관련 콘텐츠 경험",
  minFollowers: 10000,
  minER: 3.0,
};

const APPLICATION_STATUSES: Record<string, { label: string; className: string }> = {
  PENDING: { label: "검토중", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  APPROVED: { label: "승인됨", className: "bg-green-500/20 text-green-400 border-green-500/30" },
  REJECTED: { label: "미선정", className: "bg-red-500/20 text-red-400 border-red-500/30" },
};

const REWARD_BADGE: Record<string, { label: string; className: string }> = {
  PAID: { label: "유료", className: "bg-green-500/20 text-green-400" },
  PRODUCT: { label: "제품 제공", className: "bg-blue-500/20 text-blue-400" },
  MIXED: { label: "유료 + 제품", className: "bg-brand-pink/20 text-brand-pink" },
};

export default function CampaignDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [appStatus, setAppStatus] = useState<ApplicationStatus>({ applied: false, status: null });
  const [modalOpen, setModalOpen] = useState(false);
  const [intro, setIntro] = useState("");
  const [expectedReach, setExpectedReach] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setCampaign(MOCK_CAMPAIGN);
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [id, session]);

  const handleApply = async () => {
    if (!intro.trim()) {
      setSubmitError("한 줄 자기소개를 입력해 주세요.");
      return;
    }
    if (!expectedReach || isNaN(Number(expectedReach))) {
      setSubmitError("예상 도달 수를 숫자로 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    // Simulate POST /api/marketplace/[id]/apply
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setAppStatus({ applied: true, status: "PENDING" });
    setModalOpen(false);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <DashboardLayout role="creator">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-brand-pink border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!campaign) {
    return (
      <DashboardLayout role="creator">
        <div className="text-center py-16 text-muted-foreground">캠페인을 찾을 수 없습니다.</div>
      </DashboardLayout>
    );
  }

  const rewardBadge = REWARD_BADGE[campaign.rewardType];

  return (
    <DashboardLayout role="creator">
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Back */}
        <Link
          href="/dashboard/creator/marketplace"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          마켓플레이스로 돌아가기
        </Link>

        {/* Campaign Header */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {campaign.brandLogo}
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">{campaign.brand}</p>
              <h1 className="text-xl font-bold text-foreground mt-0.5">{campaign.name}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2.5 py-0.5 rounded-full bg-background text-xs text-muted-foreground border border-border">
                  {campaign.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-background text-xs text-muted-foreground border border-border">
                  {campaign.contentType}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${rewardBadge.className}`}>
                  {rewardBadge.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Campaign Details */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h2 className="text-base font-semibold text-foreground">캠페인 정보</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{campaign.description}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">진행 기간</span>
                <span className="text-foreground">{campaign.startDate} ~ {campaign.endDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">콘텐츠 유형</span>
                <span className="text-foreground">{campaign.contentType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">최소 팔로워</span>
                <span className="text-foreground">{campaign.minFollowers.toLocaleString()}명</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">최소 ER</span>
                <span className="text-foreground">{campaign.minER}%</span>
              </div>
            </div>
          </div>

          {/* Reward Info + Apply */}
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h2 className="text-base font-semibold text-foreground">보상 정보</h2>
            <div className="bg-background rounded-lg p-4">
              <p className="text-xs text-muted-foreground">보상 유형</p>
              <p className="text-base font-bold text-foreground mt-0.5">{rewardBadge.label}</p>
              <p className="text-xs text-muted-foreground mt-3">보상 금액</p>
              <p className="text-2xl font-bold text-brand-pink mt-0.5">{campaign.rewardAmount}</p>
            </div>

            {/* Apply Section */}
            {appStatus.applied && appStatus.status ? (
              <div className={`flex items-center justify-between p-4 rounded-xl border ${APPLICATION_STATUSES[appStatus.status].className}`}>
                <div>
                  <p className="text-sm font-semibold">지원 완료</p>
                  <p className="text-xs mt-0.5">
                    상태: {APPLICATION_STATUSES[appStatus.status].label}
                  </p>
                </div>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            ) : (
              <button
                onClick={() => setModalOpen(true)}
                className="w-full py-3 rounded-xl bg-brand-pink text-white font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                지원하기
              </button>
            )}
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-base font-semibold text-foreground mb-3">지원 요건</h2>
          <p className="text-sm text-muted-foreground">{campaign.requirements}</p>
        </div>
      </div>

      {/* Apply Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">캠페인 지원</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">캠페인</p>
              <p className="text-sm font-medium text-foreground">{campaign.name}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  한 줄 자기소개 <span className="text-brand-pink">*</span>
                </label>
                <input
                  type="text"
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                  placeholder="나를 한 문장으로 소개해 주세요"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand-pink transition-colors"
                  maxLength={100}
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">{intro.length}/100</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  예상 도달 수 <span className="text-brand-pink">*</span>
                </label>
                <input
                  type="number"
                  value={expectedReach}
                  onChange={(e) => setExpectedReach(e.target.value)}
                  placeholder="예: 50000"
                  min={0}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand-pink transition-colors"
                />
                <p className="text-xs text-muted-foreground mt-1">게시물의 예상 노출 수를 입력해 주세요.</p>
              </div>

              {submitError && (
                <p className="text-sm text-red-400">{submitError}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 py-2.5 rounded-lg bg-background border border-border text-sm text-foreground hover:bg-card-hover transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleApply}
                disabled={submitting}
                className="flex-1 py-2.5 rounded-lg bg-brand-pink text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    제출 중...
                  </span>
                ) : (
                  "지원 제출"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
