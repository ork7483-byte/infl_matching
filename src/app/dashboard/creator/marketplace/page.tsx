"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";

type RewardType = "ALL" | "PAID" | "PRODUCT" | "MIXED";
type SortType = "newest" | "deadline" | "reward";

interface Campaign {
  id: string;
  name: string;
  brand: string;
  brandLogo: string;
  category: string;
  rewardType: "PAID" | "PRODUCT" | "MIXED";
  rewardAmount: string;
  startDate: string;
  endDate: string;
  requirements: string;
  contentType: string;
}

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "1",
    name: "여름 뷰티 신제품 리뷰 캠페인",
    brand: "GlowBrand",
    brandLogo: "G",
    category: "뷰티",
    rewardType: "PAID",
    rewardAmount: "₩300,000",
    startDate: "2025-07-01",
    endDate: "2025-07-31",
    requirements: "팔로워 1만 이상, ER 3% 이상",
    contentType: "릴스/피드",
  },
  {
    id: "2",
    name: "라이프스타일 브랜드 체험단",
    brand: "LifeStyleCo",
    brandLogo: "L",
    category: "라이프스타일",
    rewardType: "PRODUCT",
    rewardAmount: "제품 제공",
    startDate: "2025-07-05",
    endDate: "2025-07-25",
    requirements: "팔로워 5천 이상",
    contentType: "피드",
  },
  {
    id: "3",
    name: "피트니스 앱 홍보 캠페인",
    brand: "FitLife App",
    brandLogo: "F",
    category: "피트니스",
    rewardType: "MIXED",
    rewardAmount: "₩150,000 + 앱 구독권",
    startDate: "2025-07-10",
    endDate: "2025-08-10",
    requirements: "팔로워 2만 이상, 피트니스 콘텐츠",
    contentType: "릴스/스토리",
  },
  {
    id: "4",
    name: "여행 패키지 콘텐츠 기획",
    brand: "TravelPro",
    brandLogo: "T",
    category: "여행",
    rewardType: "PAID",
    rewardAmount: "₩500,000",
    startDate: "2025-07-15",
    endDate: "2025-08-15",
    requirements: "팔로워 3만 이상, 여행 콘텐츠 경험",
    contentType: "피드/릴스",
  },
  {
    id: "5",
    name: "식품 브랜드 레시피 콘텐츠",
    brand: "TastyFood",
    brandLogo: "TF",
    category: "푸드",
    rewardType: "PRODUCT",
    rewardAmount: "제품 제공 + 식사권",
    startDate: "2025-07-20",
    endDate: "2025-08-05",
    requirements: "팔로워 8천 이상, 음식 관련 콘텐츠",
    contentType: "피드",
  },
  {
    id: "6",
    name: "패션 하우스 가을 컬렉션",
    brand: "FashionHouse",
    brandLogo: "FH",
    category: "패션",
    rewardType: "MIXED",
    rewardAmount: "₩200,000 + 의류 제공",
    startDate: "2025-08-01",
    endDate: "2025-08-31",
    requirements: "팔로워 1.5만 이상",
    contentType: "피드/릴스",
  },
];

const REWARD_BADGE: Record<string, { label: string; className: string }> = {
  PAID: { label: "유료", className: "bg-green-500/20 text-green-400" },
  PRODUCT: { label: "제품", className: "bg-blue-500/20 text-blue-400" },
  MIXED: { label: "혼합", className: "bg-brand-pink/20 text-brand-pink" },
};

const CATEGORIES = ["전체", "뷰티", "라이프스타일", "피트니스", "여행", "푸드", "패션"];

export default function MarketplacePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [category, setCategory] = useState("전체");
  const [rewardType, setRewardType] = useState<RewardType>("ALL");
  const [sort, setSort] = useState<SortType>("newest");

  useEffect(() => {
    // Simulate fetch from /api/marketplace
    const timer = setTimeout(() => {
      setCampaigns(MOCK_CAMPAIGNS);
      setLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [session]);

  const filtered = campaigns
    .filter((c) => category === "전체" || c.category === category)
    .filter((c) => rewardType === "ALL" || c.rewardType === rewardType)
    .sort((a, b) => {
      if (sort === "deadline") return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
      if (sort === "reward") {
        const aVal = parseInt(a.rewardAmount.replace(/[^0-9]/g, "")) || 0;
        const bVal = parseInt(b.rewardAmount.replace(/[^0-9]/g, "")) || 0;
        return bVal - aVal;
      }
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });

  if (loading) {
    return (
      <DashboardLayout role="creator">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-brand-pink border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="creator">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">캠페인 마켓플레이스</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            나에게 맞는 캠페인을 찾아 지원해보세요. ({filtered.length}개)
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  category === cat
                    ? "bg-brand-pink text-white"
                    : "bg-background border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Reward Type + Sort */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">보상 유형</span>
              <select
                value={rewardType}
                onChange={(e) => setRewardType(e.target.value as RewardType)}
                className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-brand-pink"
              >
                <option value="ALL">전체</option>
                <option value="PAID">유료</option>
                <option value="PRODUCT">제품</option>
                <option value="MIXED">혼합</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">정렬</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortType)}
                className="bg-background border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-brand-pink"
              >
                <option value="newest">최신순</option>
                <option value="deadline">마감 임박순</option>
                <option value="reward">보상 높은순</option>
              </select>
            </div>
          </div>
        </div>

        {/* Campaign Cards Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            조건에 맞는 캠페인이 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((campaign) => {
              const badge = REWARD_BADGE[campaign.rewardType];
              return (
                <div
                  key={campaign.id}
                  className="bg-card border border-border rounded-xl p-5 flex flex-col hover:border-brand-pink/40 transition-colors"
                >
                  {/* Brand */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {campaign.brandLogo}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{campaign.brand}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.className}`}>
                        {badge.label}
                      </span>
                    </div>
                  </div>

                  {/* Campaign Name */}
                  <h3 className="text-sm font-semibold text-foreground mb-1">{campaign.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{campaign.category} · {campaign.contentType}</p>

                  {/* Details */}
                  <div className="space-y-1.5 mb-4 flex-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-foreground font-medium">{campaign.rewardAmount}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {campaign.startDate} ~ {campaign.endDate}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {campaign.requirements}
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/creator/marketplace/${campaign.id}`}
                    className="w-full text-center px-4 py-2 rounded-lg bg-brand-pink/10 text-brand-pink text-sm font-medium hover:bg-brand-pink/20 transition-colors border border-brand-pink/20"
                  >
                    상세 보기
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
