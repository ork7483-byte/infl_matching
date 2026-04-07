"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlurOverlay from "@/components/BlurOverlay";
import MaskedValue from "@/components/MaskedValue";
import Badge from "@/components/ui/Badge";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AqsScore {
  id: string;
  totalScore: number;
  engagementQuality: number;
  growthPattern: number;
  ratioAnalysis: number;
  contentConsistency: number;
  commentAuthenticity: number;
  calculatedAt: string;
}

interface Influencer {
  id: string;
  username: string;
  fullName: string;
  profilePicUrl: string | null;
  followersCount: number;
  followingCount: number;
  mediaCount: number;
  categories: string[];
  avgEngagementRate: number | null;
  isOauthConnected: boolean;
  aqsScore: AqsScore | null;
  _blurred?: boolean;
}

interface SearchResponse {
  results: Influencer[];
  total: number;
  page: number;
  limit: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function getAqsColor(score: number): string {
  if (score >= 90) return "#22c55e";
  if (score >= 70) return "#f59e0b";
  if (score >= 50) return "#f97316";
  return "#ef4444";
}

function getAqsEmoji(score: number): string {
  if (score >= 90) return "🟢";
  if (score >= 70) return "🟡";
  if (score >= 50) return "🟠";
  return "🔴";
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-border" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-border rounded w-24" />
          <div className="h-3 bg-border rounded w-32" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-border rounded w-20" />
        <div className="flex gap-2">
          <div className="h-5 bg-border rounded-full w-14" />
          <div className="h-5 bg-border rounded-full w-16" />
        </div>
      </div>
      <div className="h-8 bg-border rounded-lg" />
    </div>
  );
}

// ─── Influencer Card ─────────────────────────────────────────────────────────

function InfluencerCard({
  influencer,
  index,
}: {
  influencer: Influencer;
  index: number;
}) {
  const cardContent = (
    <div className="bg-card border border-border rounded-2xl p-5 hover:border-brand-purple/40 hover:shadow-glow transition-all duration-200 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-shrink-0">
          {influencer.profilePicUrl ? (
            <img
              src={influencer.profilePicUrl}
              alt={influencer.username}
              className="w-12 h-12 rounded-full object-cover border border-border"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold text-lg">
              {influencer.username[0]?.toUpperCase() ?? "?"}
            </div>
          )}
          {influencer.isOauthConnected && (
            <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-success rounded-full border-2 border-card" />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            @{influencer.username}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {influencer.fullName}
          </p>
        </div>
      </div>

      {/* Follower count */}
      <div className="mb-3">
        <p className="text-xs text-muted-foreground mb-0.5">팔로워</p>
        <p className="text-lg font-bold text-foreground">
          {formatFollowers(influencer.followersCount)}
        </p>
      </div>

      {/* Categories */}
      {influencer.categories.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {influencer.categories.slice(0, 3).map((cat) => (
            <Badge key={cat} variant="purple" size="sm">
              {cat}
            </Badge>
          ))}
          {influencer.categories.length > 3 && (
            <Badge variant="default" size="sm">
              +{influencer.categories.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Engagement rate + AQS */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <div>
          <span className="text-muted-foreground text-xs">참여율 </span>
          <MaskedValue
            value={
              influencer.avgEngagementRate != null
                ? `${influencer.avgEngagementRate.toFixed(2)}%`
                : null
            }
            width="48px"
            className="text-foreground font-medium"
          />
        </div>
        {influencer.aqsScore ? (
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full border"
            style={{
              color: getAqsColor(influencer.aqsScore.totalScore),
              borderColor: getAqsColor(influencer.aqsScore.totalScore) + "44",
              backgroundColor: getAqsColor(influencer.aqsScore.totalScore) + "18",
            }}
          >
            {getAqsEmoji(influencer.aqsScore.totalScore)} AQS{" "}
            {influencer.aqsScore.totalScore}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">AQS —</span>
        )}
      </div>

      {/* CTA */}
      <Link
        href={`/influencer/${influencer.username}`}
        className="mt-auto block w-full text-center px-4 py-2 rounded-lg bg-gradient-to-r from-brand-purple to-brand-pink text-white text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        상세 보기
      </Link>
    </div>
  );

  if (index >= 5) {
    return (
      <BlurOverlay className="h-full rounded-2xl" blurIntensity={6}>
        {cardContent}
      </BlurOverlay>
    );
  }

  return cardContent;
}

// ─── Filter Sidebar ───────────────────────────────────────────────────────────

const CATEGORIES = [
  "뷰티",
  "패션",
  "푸드",
  "여행",
  "테크",
  "라이프스타일",
  "피트니스",
  "육아",
];

interface Filters {
  minFollowers: string;
  maxFollowers: string;
  categories: string[];
  minEngagementRate: string;
  sortBy: "followers" | "engagement" | "aqs";
}

interface FilterSidebarProps {
  filters: Filters;
  onChange: (f: Filters) => void;
  onSearch: () => void;
}

function FilterSidebar({ filters, onChange, onSearch }: FilterSidebarProps) {
  const toggleCategory = (cat: string) => {
    const next = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onChange({ ...filters, categories: next });
  };

  return (
    <div className="space-y-6">
      {/* Follower range */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">팔로워 수</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">최소</label>
            <input
              type="number"
              placeholder="예: 1000"
              value={filters.minFollowers}
              onChange={(e) => onChange({ ...filters, minFollowers: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-brand-purple/60 transition-colors"
            />
            <div className="flex gap-1 mt-1 flex-wrap">
              {["1K", "10K", "100K"].map((label) => {
                const val = label === "1K" ? "1000" : label === "10K" ? "10000" : "100000";
                return (
                  <button
                    key={label}
                    onClick={() => onChange({ ...filters, minFollowers: val })}
                    className="text-xs px-2 py-0.5 rounded-md bg-card border border-border text-muted-foreground hover:border-brand-purple/50 hover:text-brand-purple-light transition-colors"
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">최대</label>
            <input
              type="number"
              placeholder="예: 500000"
              value={filters.maxFollowers}
              onChange={(e) => onChange({ ...filters, maxFollowers: e.target.value })}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-brand-purple/60 transition-colors"
            />
            <div className="flex gap-1 mt-1 flex-wrap">
              {["100K", "500K+"].map((label) => {
                const val = label === "100K" ? "100000" : "500000";
                return (
                  <button
                    key={label}
                    onClick={() => onChange({ ...filters, maxFollowers: val })}
                    className="text-xs px-2 py-0.5 rounded-md bg-card border border-border text-muted-foreground hover:border-brand-purple/50 hover:text-brand-purple-light transition-colors"
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">카테고리</h3>
        <div className="grid grid-cols-2 gap-y-2 gap-x-2">
          {CATEGORIES.map((cat) => {
            const checked = filters.categories.includes(cat);
            return (
              <label
                key={cat}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    checked
                      ? "bg-brand-purple border-brand-purple"
                      : "border-border group-hover:border-brand-purple/50"
                  }`}
                  onClick={() => toggleCategory(cat)}
                >
                  {checked && (
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-sm transition-colors ${
                    checked ? "text-foreground" : "text-muted-foreground"
                  }`}
                  onClick={() => toggleCategory(cat)}
                >
                  {cat}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Min engagement rate */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          최소 참여율
        </h3>
        <div className="relative">
          <input
            type="number"
            step="0.1"
            min="0"
            placeholder="예: 2.5"
            value={filters.minEngagementRate}
            onChange={(e) =>
              onChange({ ...filters, minEngagementRate: e.target.value })
            }
            className="w-full bg-background border border-border rounded-lg px-3 py-2 pr-8 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-brand-purple/60 transition-colors"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            %
          </span>
        </div>
      </div>

      {/* Sort by */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">정렬 기준</h3>
        <select
          value={filters.sortBy}
          onChange={(e) =>
            onChange({
              ...filters,
              sortBy: e.target.value as Filters["sortBy"],
            })
          }
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-brand-purple/60 transition-colors appearance-none cursor-pointer"
        >
          <option value="followers">팔로워 수</option>
          <option value="engagement">참여율</option>
          <option value="aqs">AQS 점수</option>
        </select>
      </div>

      {/* Search button */}
      <button
        onClick={onSearch}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink text-white font-semibold hover:opacity-90 transition-opacity shadow-glow"
      >
        검색
      </button>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SearchPage() {
  const { data: session } = useSession();

  const [filters, setFilters] = useState<Filters>({
    minFollowers: "",
    maxFollowers: "",
    categories: [],
    minEngagementRate: "",
    sortBy: "followers",
  });

  const [results, setResults] = useState<Influencer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const LIMIT = 12;

  const fetchResults = useCallback(
    async (currentPage = 1) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.minFollowers) params.set("minFollowers", filters.minFollowers);
        if (filters.maxFollowers) params.set("maxFollowers", filters.maxFollowers);
        if (filters.categories.length)
          params.set("categories", filters.categories.join(","));
        if (filters.minEngagementRate)
          params.set("minEngagementRate", filters.minEngagementRate);
        params.set("sortBy", filters.sortBy);
        params.set("page", String(currentPage));
        params.set("limit", String(LIMIT));

        const res = await fetch(`/api/influencers/search?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data: SearchResponse = await res.json();
        setResults(data.results);
        setTotal(data.total);
        setPage(currentPage);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    fetchResults(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            인플루언서{" "}
            <span className="bg-gradient-brand bg-clip-text text-transparent">
              검색
            </span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            AI 기반 필터로 최적의 인플루언서를 찾아보세요
          </p>
        </div>

        <div className="flex gap-6">
          {/* ─── Desktop Sidebar ─────────────────────────────────── */}
          <aside className="hidden md:block w-72 flex-shrink-0">
            <div className="bg-card border border-border rounded-2xl p-5 sticky top-24">
              <h2 className="text-base font-semibold text-foreground mb-5 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-brand-purple"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
                  />
                </svg>
                필터
              </h2>
              <FilterSidebar
                filters={filters}
                onChange={setFilters}
                onSearch={() => fetchResults(1)}
              />
            </div>
          </aside>

          {/* ─── Content ─────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter button */}
            <div className="md:hidden mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                총{" "}
                <span className="text-foreground font-semibold">{total}</span>
                명의 인플루언서
              </p>
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:border-brand-purple/50 hover:text-foreground transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
                  />
                </svg>
                필터
                {(filters.categories.length > 0 ||
                  filters.minFollowers ||
                  filters.maxFollowers ||
                  filters.minEngagementRate) && (
                  <span className="w-2 h-2 rounded-full bg-brand-purple" />
                )}
              </button>
            </div>

            {/* Desktop count */}
            <p className="hidden md:block text-sm text-muted-foreground mb-4">
              총{" "}
              <span className="text-foreground font-semibold">{total}</span>
              명의 인플루언서
            </p>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: LIMIT }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <p className="text-foreground font-semibold mb-1">
                  검색 결과가 없습니다
                </p>
                <p className="text-sm text-muted-foreground">
                  필터를 조정해 다시 시도해보세요
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((inf, idx) => (
                  <InfluencerCard key={inf.id} influencer={inf} index={idx} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => fetchResults(page - 1)}
                  className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:border-brand-purple/50 hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  이전
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => fetchResults(p)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                          p === page
                            ? "bg-brand-purple text-white"
                            : "border border-border text-muted-foreground hover:border-brand-purple/50 hover:text-foreground"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
                <button
                  disabled={page >= totalPages}
                  onClick={() => fetchResults(page + 1)}
                  className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:border-brand-purple/50 hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </div>
            )}

            {/* Non-auth upsell */}
            {!session && results.length > 0 && (
              <p className="text-center text-xs text-muted-foreground mt-4">
                <Link
                  href="/register"
                  className="text-brand-purple-light hover:underline"
                >
                  무료 회원가입
                </Link>
                하면 모든 인플루언서 데이터를 확인할 수 있어요
              </p>
            )}
          </div>
        </div>
      </main>

      {/* ─── Mobile Filter Drawer ─────────────────────────────────── */}
      {mobileFilterOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setMobileFilterOpen(false)}
        />
      )}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileFilterOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-foreground">필터</h2>
          <button
            onClick={() => setMobileFilterOpen(false)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
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
        <FilterSidebar
          filters={filters}
          onChange={setFilters}
          onSearch={() => {
            fetchResults(1);
            setMobileFilterOpen(false);
          }}
        />
      </div>

      <Footer />
    </div>
  );
}
