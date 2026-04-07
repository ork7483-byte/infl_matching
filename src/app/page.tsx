"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  igrScore?: { totalScore: number; grade: string; label: string } | null;
  recentMediaThumbnails?: string[];
  estimatedPriceMin?: number;
  estimatedPriceMax?: number;
  bestPostThumbnail?: string;
  location?: string;
  gender?: string;
  avgRating?: number;
  reviewCount?: number;
  isTopCreator?: boolean;
  isUgc?: boolean;
  hasAiClone?: boolean;
  biography?: string;
}

interface SearchResponse {
  results: Influencer[];
  total: number;
  page: number;
  limit: number;
}

interface Filters {
  query: string;
  categories: string[];
  minFollowers: string;
  maxFollowers: string;
  minEngagementRate: string;
  maxEngagementRate: string;
  minAqs: string;
  maxAqs: string;
  platform: "instagram" | "youtube" | "tiktok";
  contentTypes: string[];
  sortBy: "followers" | "engagement" | "aqs";
  minPrice: string;
  maxPrice: string;
  gender: string;
  locations: string[];
  languages: string[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = ["뷰티", "패션", "푸드", "여행", "테크", "라이프스타일", "피트니스", "육아"];
const CONTENT_TYPES = ["피드", "릴스", "스토리"];
const LIMIT = 12;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function formatPrice(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${(n / 10_000).toFixed(0)}만`;
  return `${n.toLocaleString()}`;
}

function getAqsColor(score: number): string {
  if (score >= 90) return "#22c55e";
  if (score >= 70) return "#f59e0b";
  if (score >= 50) return "#f97316";
  return "#ef4444";
}

function getAqsGrade(score: number): string {
  if (score >= 90) return "🟢";
  if (score >= 70) return "🟡";
  if (score >= 50) return "🟠";
  return "🔴";
}

function getAqsLabel(score: number): string {
  if (score >= 90) return "우수";
  if (score >= 70) return "양호";
  if (score >= 50) return "보통";
  return "미흡";
}

// ─── ER Grade Helpers ────────────────────────────────────────────────────────

function getErGrade(er: number): { emoji: string; label: string; color: string } {
  if (er >= 6) return { emoji: "🟢", label: "매우 높음", color: "#22c55e" };
  if (er >= 3) return { emoji: "🟡", label: "높음", color: "#f59e0b" };
  if (er >= 1) return { emoji: "🟠", label: "보통", color: "#f97316" };
  return { emoji: "🔴", label: "낮음", color: "#ef4444" };
}

// 카테고리 평균값 (시드 데이터 기반 대략치)
const CATEGORY_AVG: Record<string, { er: number; aqs: number }> = {
  "뷰티": { er: 3.8, aqs: 65 },
  "패션": { er: 3.2, aqs: 62 },
  "푸드": { er: 4.1, aqs: 60 },
  "여행": { er: 3.5, aqs: 58 },
  "테크": { er: 2.8, aqs: 64 },
  "라이프스타일": { er: 3.0, aqs: 59 },
  "피트니스": { er: 4.5, aqs: 67 },
  "육아": { er: 3.6, aqs: 61 },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getCategoryAvg(categories: string[]) {
  const cat = categories[0];
  return CATEGORY_AVG[cat] || { er: 3.2, aqs: 62 };
}

function getOneLinerSummary(er: number | null, aqs: number | null, igr?: number | null): string {
  const erHigh = (er ?? 0) >= 3;
  const aqsHigh = (aqs ?? 0) >= 70;
  const igrHigh = (igr ?? 0) >= 70;
  const igrSuffix = igrHigh ? " + 알고리즘 노출도 유리해요" : "";
  if (erHigh && aqsHigh) return `반응도 좋고 팔로워도 진짜예요 👍${igrSuffix}`;
  if (erHigh && !aqsHigh) return "반응은 좋지만 가짜 팔로워가 의심돼요 ⚠️";
  if (!erHigh && aqsHigh) return `팔로워는 진짜인데 반응이 적은 편이에요${igrSuffix}`;
  return "팔로워와 반응 모두 확인이 필요해요 🔍";
}

// ─── Tooltip Component ───────────────────────────────────────────────────────

function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="relative group inline-flex ml-1 cursor-help">
      <svg className="w-3.5 h-3.5 text-[#9CA3AF] hover:text-[#7c3aed] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#111827] text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 max-w-[220px] whitespace-normal text-center leading-relaxed shadow-lg">
        {text}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#111827]" />
      </span>
    </span>
  );
}

function defaultFilters(): Filters {
  return {
    query: "",
    categories: [],
    minFollowers: "",
    maxFollowers: "",
    minEngagementRate: "",
    maxEngagementRate: "",
    minAqs: "",
    maxAqs: "",
    platform: "instagram",
    contentTypes: [],
    sortBy: "followers",
    minPrice: "",
    maxPrice: "",
    gender: "전체",
    locations: [],
    languages: [],
  };
}

function filtersToParams(f: Filters, page: number): URLSearchParams {
  const p = new URLSearchParams();
  if (f.query) p.set("q", f.query);
  if (f.categories.length) p.set("categories", f.categories.join(","));
  if (f.minFollowers) p.set("minFollowers", f.minFollowers);
  if (f.maxFollowers) p.set("maxFollowers", f.maxFollowers);
  if (f.minEngagementRate) p.set("minEngagementRate", f.minEngagementRate);
  if (f.maxEngagementRate) p.set("maxEngagementRate", f.maxEngagementRate);
  if (f.minAqs) p.set("minAqs", f.minAqs);
  if (f.maxAqs) p.set("maxAqs", f.maxAqs);
  if (f.platform !== "instagram") p.set("platform", f.platform);
  if (f.contentTypes.length) p.set("contentTypes", f.contentTypes.join(","));
  p.set("sortBy", f.sortBy);
  if (f.minPrice) p.set("minPrice", f.minPrice);
  if (f.maxPrice) p.set("maxPrice", f.maxPrice);
  if (f.gender && f.gender !== "전체") p.set("gender", f.gender);
  if (f.locations.length) p.set("locations", f.locations.join(","));
  if (f.languages.length) p.set("languages", f.languages.join(","));
  p.set("page", String(page));
  p.set("limit", String(LIMIT));
  return p;
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-5 animate-pulse flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-[#E5E7EB] flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-[#E5E7EB] rounded w-28" />
          <div className="h-3 bg-[#E5E7EB] rounded w-20" />
          <div className="flex gap-1">
            <div className="h-4 bg-[#E5E7EB] rounded-full w-12" />
            <div className="h-4 bg-[#E5E7EB] rounded-full w-14" />
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="h-3 bg-[#E5E7EB] rounded w-20" />
        <div className="h-3 bg-[#E5E7EB] rounded w-16" />
      </div>
      <div className="h-2 bg-[#E5E7EB] rounded-full" />
      <div className="flex gap-2">
        <div className="h-10 bg-[#E5E7EB] rounded-lg flex-1" />
        <div className="h-10 bg-[#E5E7EB] rounded-lg w-12" />
      </div>
    </div>
  );
}

function ListRowSkeleton() {
  return (
    <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl px-4 py-3 animate-pulse flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-[#E5E7EB] flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 bg-[#E5E7EB] rounded w-32" />
        <div className="h-2.5 bg-[#E5E7EB] rounded w-20" />
      </div>
      <div className="hidden md:flex gap-6">
        <div className="h-3 bg-[#E5E7EB] rounded w-16" />
        <div className="h-3 bg-[#E5E7EB] rounded w-16" />
        <div className="h-3 bg-[#E5E7EB] rounded w-16" />
      </div>
      <div className="h-8 bg-[#E5E7EB] rounded-lg w-20 flex-shrink-0" />
    </div>
  );
}

// ─── Signup Modal ─────────────────────────────────────────────────────────────

function SignupModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-8 max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#7c3aed]/20 flex items-center justify-center">
          <svg className="w-7 h-7 text-[#7c3aed]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-[#111827] mb-2">저장 기능은 회원 전용</h3>
        <p className="text-sm text-[#6B7280] mb-6">무료 회원가입 후 인플루언서를 저장하고<br />비교해 보세요.</p>
        <div className="flex flex-col gap-3">
          <Link
            href="/signup"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#e94560] text-white font-semibold hover:opacity-90 transition-opacity"
          >
            무료로 시작하기
          </Link>
          <button onClick={onClose} className="text-sm text-[#6B7280] hover:text-[#111827] transition-colors">
            나중에
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Influencer Card (Grid) ───────────────────────────────────────────────────

function InfluencerGridCard({
  influencer,
  index,
  isAuth,
  onSaveClick,
}: {
  influencer: Influencer;
  index: number;
  isAuth: boolean;
  onSaveClick: () => void;
}) {
  const mainImage =
    influencer.bestPostThumbnail ||
    influencer.profilePicUrl ||
    `https://picsum.photos/seed/${influencer.username}/400/500`;

  const estimatedPrice = Math.floor((influencer.followersCount / 1000) * 10000 * 0.7);

  const bioFirstLine = influencer.biography
    ? influencer.biography.split("\n")[0]?.slice(0, 40) +
      (influencer.biography.split("\n")[0]?.length > 40 ? "..." : "")
    : null;

  const cardContent = (
    <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl overflow-hidden hover:border-[#7c3aed]/40 hover:shadow-[0_0_20px_rgba(124,58,237,0.15)] transition-all duration-200 flex flex-col h-full">

      {/* ── Main image section ── */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F3F4F6]">
        <img
          src={mainImage}
          alt={influencer.username}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${influencer.username}/400/500`;
          }}
        />

        {/* Badge overlay — top-left */}
        {(influencer.isTopCreator || influencer.isUgc || influencer.hasAiClone) && (
          <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
            {influencer.isTopCreator && (
              <span className="bg-white/90 text-[#16a34a] text-[10px] font-semibold px-2 py-0.5 rounded-full leading-tight">
                🟢 Top
              </span>
            )}
            {influencer.isUgc && (
              <span className="bg-white/90 text-[#7c3aed] text-[10px] font-semibold px-2 py-0.5 rounded-full leading-tight">
                ⚡ UGC
              </span>
            )}
            {influencer.hasAiClone && (
              <span className="px-2 py-1 bg-purple-500/90 text-white text-xs rounded-full">🤖 AI Muse</span>
            )}
          </div>
        )}

        {/* Bottom-left: profile pic + IG icon + followers */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
          <div className="relative">
            {influencer.profilePicUrl ? (
              <img
                src={influencer.profilePicUrl}
                alt=""
                className="w-8 h-8 rounded-full object-cover border-2 border-white shadow"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#e94560] flex items-center justify-center text-white font-bold text-xs border-2 border-white shadow">
                {influencer.username[0]?.toUpperCase() ?? "?"}
              </div>
            )}
          </div>
          <span className="bg-white/90 text-[#111827] text-[10px] font-semibold px-1.5 py-0.5 rounded-full shadow flex items-center gap-0.5">
            <svg className="w-2.5 h-2.5 text-[#E1306C]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            {formatFollowers(influencer.followersCount)}
          </span>
        </div>

        {/* Bottom-right: estimated price */}
        <div className="absolute bottom-2 right-2">
          <MaskedValue
            value={`₩${formatPrice(estimatedPrice)}~`}
            width="64px"
            className="bg-white/90 text-[#111827] text-[10px] font-semibold px-1.5 py-0.5 rounded-full shadow"
          />
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="p-4 flex flex-col flex-1">

        {/* Username + star rating */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <p className="text-sm font-semibold text-[#111827] truncate">@{influencer.username}</p>
            {influencer.isOauthConnected && (
              <svg className="w-3.5 h-3.5 text-[#22c55e] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            )}
          </div>
          {(influencer.reviewCount ?? 0) > 0 && (
            <span className="text-xs text-[#F59E0B] font-semibold flex-shrink-0">
              ★ {influencer.avgRating?.toFixed(1)}
            </span>
          )}
        </div>

        {/* Bio first line */}
        {bioFirstLine && (
          <p className="text-[11px] text-[#6B7280] mb-2 leading-relaxed">{bioFirstLine}</p>
        )}

        {/* Category badges */}
        {influencer.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {influencer.categories.slice(0, 3).map((cat) => (
              <Badge key={cat} variant="purple" size="sm">{cat}</Badge>
            ))}
            {influencer.categories.length > 3 && (
              <Badge variant="default" size="sm">+{influencer.categories.length - 3}</Badge>
            )}
          </div>
        )}

        {/* ER */}
        <div className="flex items-center justify-between mb-1 text-xs">
          <span className="text-[#6B7280] flex items-center">참여율<InfoTooltip text="게시물에 반응(좋아요+댓글)한 비율이에요." /></span>
          {influencer.avgEngagementRate != null ? (
            <MaskedValue
              value={`${influencer.avgEngagementRate.toFixed(2)}% ${getErGrade(influencer.avgEngagementRate).emoji}`}
              width="72px"
              className="font-semibold text-[#111827]"
            />
          ) : (
            <MaskedValue value={null} width="48px" className="font-semibold text-[#111827]" />
          )}
        </div>

        {/* AQS bar */}
        {influencer.aqsScore ? (
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#6B7280] flex items-center">AQS<InfoTooltip text="팔로워가 진짜인지 평가한 점수예요." /></span>
              <MaskedValue
                value={`${getAqsGrade(influencer.aqsScore.totalScore)} ${influencer.aqsScore.totalScore} (${getAqsLabel(influencer.aqsScore.totalScore)})`}
                width="80px"
                className="text-xs font-semibold"
              />
            </div>
            <div className="h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${influencer.aqsScore.totalScore}%`,
                  backgroundColor: getAqsColor(influencer.aqsScore.totalScore),
                }}
              />
            </div>
          </div>
        ) : (
          <div className="mb-2">
            <p className="text-xs text-[#6B7280]">AQS 점수 없음</p>
          </div>
        )}

        {/* IGR Score */}
        {influencer.igrScore ? (
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-[#6B7280] flex items-center">
                IGR 등급
                <InfoTooltip text="Instagram 알고리즘이 이 계정을 얼마나 밀어주는지 평가한 등급이에요. S등급이면 노출이 매우 유리해요." />
              </span>
              <span className="text-xs font-semibold">
                {influencer.igrScore.grade} {influencer.igrScore.label}
              </span>
            </div>
            <div className="h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all"
                style={{ width: `${influencer.igrScore.totalScore}%`, backgroundColor: influencer.igrScore.totalScore >= 70 ? "#7c3aed" : influencer.igrScore.totalScore >= 50 ? "#22c55e" : "#f59e0b" }}
              />
            </div>
          </div>
        ) : null}

        {/* One-liner summary */}
        <div className="mb-2 px-2 py-1.5 bg-[#F9FAFB] rounded-lg">
          <p className="text-[11px] text-[#6B7280] leading-relaxed">
            💡 {getOneLinerSummary(influencer.avgEngagementRate, influencer.aqsScore?.totalScore ?? null, influencer.igrScore?.totalScore ?? null)}
          </p>
        </div>

        {/* Location */}
        {influencer.location && (
          <p className="text-[11px] text-[#9CA3AF] mb-2">📍 {influencer.location}</p>
        )}

        {/* Action buttons */}
        <div className="mt-auto flex gap-2 pt-1">
          <Link
            href={`/influencer/${influencer.username}`}
            className="flex-1 text-center px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#e94560] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            상세보기
          </Link>
          <button
            onClick={isAuth ? undefined : onSaveClick}
            className="w-10 h-10 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:border-[#e94560]/50 hover:text-[#e94560] transition-colors"
            title={isAuth ? "저장" : "로그인 후 저장"}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
        {influencer.hasAiClone && isAuth && (
          <Link
            href={`/ai-studio/generate?clone=${influencer.id}`}
            className="mt-1.5 block text-center text-xs text-[#7c3aed] hover:underline cursor-pointer"
          >
            AI로 시안 만들기 →
          </Link>
        )}
      </div>
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

// ─── Influencer Row (List) ────────────────────────────────────────────────────

function InfluencerListRow({
  influencer,
  index,
  isAuth,
  onSaveClick,
}: {
  influencer: Influencer;
  index: number;
  isAuth: boolean;
  onSaveClick: () => void;
}) {
  const listEstimatedPrice = Math.floor((influencer.followersCount / 1000) * 10000 * 0.7);
  const listThumb =
    influencer.bestPostThumbnail ||
    influencer.profilePicUrl ||
    `https://picsum.photos/seed/${influencer.username}/80/80`;

  const rowContent = (
    <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl px-4 py-3 hover:border-[#7c3aed]/40 transition-all duration-200 flex items-center gap-4">
      {/* Thumbnail */}
      <div className="relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border border-[#E5E7EB]">
        <img
          src={listThumb}
          alt=""
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${influencer.username}/80/80`;
          }}
        />
        {/* Badges overlay */}
        {(influencer.isTopCreator || influencer.isUgc) && (
          <div className="absolute top-0.5 left-0.5 flex gap-0.5">
            {influencer.isTopCreator && (
              <span className="bg-white/90 text-[#16a34a] text-[8px] font-bold px-1 py-px rounded-full">Top</span>
            )}
            {influencer.isUgc && (
              <span className="bg-white/90 text-[#7c3aed] text-[8px] font-bold px-1 py-px rounded-full">UGC</span>
            )}
          </div>
        )}
      </div>

      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {influencer.profilePicUrl ? (
          <img src={influencer.profilePicUrl} alt={influencer.username} className="w-10 h-10 rounded-full object-cover border border-[#E5E7EB]" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#e94560] flex items-center justify-center text-white font-bold">
            {influencer.username[0]?.toUpperCase() ?? "?"}
          </div>
        )}
      </div>

      {/* Name + categories */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold text-[#111827] truncate">@{influencer.username}</p>
          {influencer.isOauthConnected && (
            <span className="w-3.5 h-3.5 rounded-full bg-[#22c55e] flex-shrink-0" title="인증됨" />
          )}
          {(influencer.reviewCount ?? 0) > 0 && (
            <span className="text-[11px] text-[#F59E0B] font-semibold flex-shrink-0">★ {influencer.avgRating?.toFixed(1)}</span>
          )}
        </div>
        <div className="flex gap-1 mt-0.5 flex-wrap">
          {influencer.categories.slice(0, 2).map((cat) => (
            <Badge key={cat} variant="purple" size="sm">{cat}</Badge>
          ))}
        </div>
        {influencer.location && (
          <p className="text-[10px] text-[#9CA3AF] mt-0.5">📍 {influencer.location}</p>
        )}
      </div>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-6 text-sm flex-shrink-0">
        <div className="text-center">
          <p className="text-xs text-[#6B7280]">팔로워</p>
          <p className="font-semibold text-[#111827]">{formatFollowers(influencer.followersCount)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-[#6B7280] flex items-center justify-center">참여율<InfoTooltip text="게시물에 반응(좋아요+댓글)한 비율이에요. 숫자가 높을수록 팔로워와 소통이 활발해요." /></p>
          <MaskedValue
            value={influencer.avgEngagementRate != null ? `${influencer.avgEngagementRate.toFixed(2)}% ${getErGrade(influencer.avgEngagementRate).emoji}` : null}
            width="60px"
            className="font-semibold text-[#111827]"
          />
        </div>
        <div className="text-center">
          <p className="text-xs text-[#6B7280] flex items-center justify-center">AQS<InfoTooltip text="팔로워가 진짜인지 평가한 점수예요. 100에 가까울수록 가짜 팔로워가 적어요." /></p>
          {influencer.aqsScore ? (
            <MaskedValue
              value={`${getAqsGrade(influencer.aqsScore.totalScore)} ${influencer.aqsScore.totalScore}`}
              width="48px"
              className="font-semibold text-[#111827]"
            />
          ) : (
            <span className="text-[#6B7280] text-xs">—</span>
          )}
        </div>
        <div className="text-center hidden lg:block">
          <p className="text-xs text-[#6B7280]">예상 단가</p>
          <MaskedValue
            value={`₩${formatPrice(listEstimatedPrice)}~`}
            width="72px"
            className="font-semibold text-[#111827]"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <Link
          href={`/influencer/${influencer.username}`}
          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#e94560] text-white text-xs font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          상세 보기
        </Link>
        <button
          onClick={isAuth ? undefined : onSaveClick}
          className="w-8 h-8 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#6B7280] hover:border-[#e94560]/50 hover:text-[#e94560] transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
    </div>
  );

  if (index >= 5) {
    return (
      <BlurOverlay className="rounded-xl" blurIntensity={4}>
        {rowContent}
      </BlurOverlay>
    );
  }

  return rowContent;
}

// ─── Filter Sidebar ───────────────────────────────────────────────────────────

function FilterSidebar({
  filters,
  onChange,
  onSearch,
  onReset,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  onSearch: () => void;
  onReset: () => void;
}) {
  const toggleCategory = (cat: string) => {
    const next = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onChange({ ...filters, categories: next });
  };

  const toggleContentType = (type: string) => {
    const next = filters.contentTypes.includes(type)
      ? filters.contentTypes.filter((t) => t !== type)
      : [...filters.contentTypes, type];
    onChange({ ...filters, contentTypes: next });
  };

  const toggleLocation = (loc: string) => {
    const next = filters.locations.includes(loc)
      ? filters.locations.filter((l) => l !== loc)
      : [...filters.locations, loc];
    onChange({ ...filters, locations: next });
  };

  const toggleLanguage = (lang: string) => {
    const next = filters.languages.includes(lang)
      ? filters.languages.filter((l) => l !== lang)
      : [...filters.languages, lang];
    onChange({ ...filters, languages: next });
  };

  const PRICE_QUICK = [
    { label: "10만 이하", min: "", max: "10" },
    { label: "10~50만", min: "10", max: "50" },
    { label: "50~100만", min: "50", max: "100" },
    { label: "100만+", min: "100", max: "" },
  ];

  const followerQuickMin = [
    { label: "1K", val: "1000" },
    { label: "5K", val: "5000" },
    { label: "10K", val: "10000" },
    { label: "50K", val: "50000" },
    { label: "100K", val: "100000" },
  ];
  const followerQuickMax = [
    { label: "10K", val: "10000" },
    { label: "50K", val: "50000" },
    { label: "100K", val: "100000" },
    { label: "500K", val: "500000" },
    { label: "1M+", val: "10000000" },
  ];

  return (
    <div className="space-y-6">
      {/* 카테고리 */}
      <div>
        <h3 className="text-sm font-semibold text-[#111827] mb-3">카테고리</h3>
        <div className="grid grid-cols-2 gap-y-2">
          {CATEGORIES.map((cat) => {
            const checked = filters.categories.includes(cat);
            return (
              <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${
                    checked ? "bg-[#7c3aed] border-[#7c3aed]" : "border-[#E5E7EB] group-hover:border-[#7c3aed]/50"
                  }`}
                  onClick={() => toggleCategory(cat)}
                >
                  {checked && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-sm transition-colors ${checked ? "text-[#111827]" : "text-[#6B7280]"}`}
                  onClick={() => toggleCategory(cat)}
                >
                  {cat}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 팔로워 수 */}
      <div>
        <h3 className="text-sm font-semibold text-[#111827] mb-3">팔로워 수</h3>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label className="text-xs text-[#6B7280] mb-1 block">최소</label>
            <input
              type="number"
              placeholder="예: 1000"
              value={filters.minFollowers}
              onChange={(e) => onChange({ ...filters, minFollowers: e.target.value })}
              className="w-full bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg px-3 py-2 text-base text-[#111827] placeholder:text-[#6B7280]/50 focus:outline-none focus:border-[#7c3aed]/60 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-[#6B7280] mb-1 block">최대</label>
            <input
              type="number"
              placeholder="예: 500000"
              value={filters.maxFollowers}
              onChange={(e) => onChange({ ...filters, maxFollowers: e.target.value })}
              className="w-full bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg px-3 py-2 text-base text-[#111827] placeholder:text-[#6B7280]/50 focus:outline-none focus:border-[#7c3aed]/60 transition-colors"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mb-1">
          <span className="text-xs text-[#6B7280] w-full mb-0.5">최소 빠른 선택</span>
          {followerQuickMin.map(({ label, val }) => (
            <button
              key={label}
              onClick={() => onChange({ ...filters, minFollowers: val })}
              className={`text-xs px-2 py-0.5 rounded-md border transition-colors ${
                filters.minFollowers === val
                  ? "bg-[#7c3aed] border-[#7c3aed] text-white"
                  : "bg-[#FFFFFF] border-[#E5E7EB] text-[#6B7280] hover:border-[#7c3aed]/50 hover:text-[#111827]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1">
          <span className="text-xs text-[#6B7280] w-full mb-0.5">최대 빠른 선택</span>
          {followerQuickMax.map(({ label, val }) => (
            <button
              key={label}
              onClick={() => onChange({ ...filters, maxFollowers: val })}
              className={`text-xs px-2 py-0.5 rounded-md border transition-colors ${
                filters.maxFollowers === val
                  ? "bg-[#7c3aed] border-[#7c3aed] text-white"
                  : "bg-[#FFFFFF] border-[#E5E7EB] text-[#6B7280] hover:border-[#7c3aed]/50 hover:text-[#111827]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 참여율 (ER) */}
      <div>
        <h3 className="text-sm font-semibold text-[#111827] mb-3">참여율 (ER)</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-[#6B7280] mb-1 block">최소 (%)</label>
            <input
              type="number"
              step="0.5"
              min="0"
              placeholder="예: 0.5"
              value={filters.minEngagementRate}
              onChange={(e) => onChange({ ...filters, minEngagementRate: e.target.value })}
              className="w-full bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg px-3 py-2 text-base text-[#111827] placeholder:text-[#6B7280]/50 focus:outline-none focus:border-[#7c3aed]/60 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-[#6B7280] mb-1 block">최대 (%)</label>
            <input
              type="number"
              step="0.5"
              min="0"
              placeholder="예: 10"
              value={filters.maxEngagementRate}
              onChange={(e) => onChange({ ...filters, maxEngagementRate: e.target.value })}
              className="w-full bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg px-3 py-2 text-base text-[#111827] placeholder:text-[#6B7280]/50 focus:outline-none focus:border-[#7c3aed]/60 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* AQS 점수 */}
      <div>
        <h3 className="text-sm font-semibold text-[#111827] mb-2">AQS 점수</h3>
        <div className="flex items-center gap-2 mb-2 text-xs text-[#6B7280]">
          <span>🔴 0~49</span>
          <span>🟠 50~69</span>
          <span>🟡 70~89</span>
          <span>🟢 90+</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-[#6B7280] mb-1 block">최소 (0-100)</label>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="예: 70"
              value={filters.minAqs}
              onChange={(e) => onChange({ ...filters, minAqs: e.target.value })}
              className="w-full bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg px-3 py-2 text-base text-[#111827] placeholder:text-[#6B7280]/50 focus:outline-none focus:border-[#7c3aed]/60 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-[#6B7280] mb-1 block">최대 (0-100)</label>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="예: 100"
              value={filters.maxAqs}
              onChange={(e) => onChange({ ...filters, maxAqs: e.target.value })}
              className="w-full bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg px-3 py-2 text-base text-[#111827] placeholder:text-[#6B7280]/50 focus:outline-none focus:border-[#7c3aed]/60 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* 예상 단가 */}
      <div>
        <h3 className="text-sm font-semibold text-[#111827] mb-3">예상 단가 (피드)</h3>
        <div className="flex gap-1.5 flex-wrap mb-2">
          {PRICE_QUICK.map(({ label, min, max }) => {
            const active = filters.minPrice === min && filters.maxPrice === max;
            return (
              <button
                key={label}
                onClick={() => onChange({ ...filters, minPrice: min, maxPrice: max })}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  active
                    ? "bg-[#7c3aed] border-[#7c3aed] text-white"
                    : "bg-transparent border-[#E5E7EB] text-[#6B7280] hover:border-[#7c3aed]/50 hover:text-[#111827]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="최소 (만원)"
            value={filters.minPrice}
            onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
            className="w-full bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg px-3 py-2 text-base text-[#111827] placeholder:text-[#6B7280]/50 focus:outline-none focus:border-[#7c3aed]/60 transition-colors"
          />
          <input
            type="number"
            placeholder="최대 (만원)"
            value={filters.maxPrice}
            onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
            className="w-full bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg px-3 py-2 text-base text-[#111827] placeholder:text-[#6B7280]/50 focus:outline-none focus:border-[#7c3aed]/60 transition-colors"
          />
        </div>
      </div>

      {/* 성별 */}
      <div>
        <h3 className="text-sm font-semibold text-[#111827] mb-3">성별</h3>
        <div className="flex gap-2 flex-wrap">
          {["전체", "남성", "여성", "기타"].map((g) => (
            <button
              key={g}
              onClick={() => onChange({ ...filters, gender: g })}
              className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                filters.gender === g
                  ? "bg-[#7c3aed] border-[#7c3aed] text-white"
                  : "bg-transparent border-[#E5E7EB] text-[#6B7280] hover:border-[#7c3aed]/50 hover:text-[#111827]"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* 지역 */}
      <div>
        <h3 className="text-sm font-semibold text-[#111827] mb-3">지역</h3>
        <div className="grid grid-cols-2 gap-y-1.5 gap-x-2">
          {["서울", "부산", "대구", "인천", "대전", "광주", "기타", "해외"].map((loc) => {
            const checked = filters.locations.includes(loc);
            return (
              <label key={loc} className="flex items-center gap-2 cursor-pointer group">
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${
                    checked ? "bg-[#7c3aed] border-[#7c3aed]" : "border-[#E5E7EB] group-hover:border-[#7c3aed]/50"
                  }`}
                  onClick={() => toggleLocation(loc)}
                >
                  {checked && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-sm transition-colors ${checked ? "text-[#111827]" : "text-[#6B7280]"}`}
                  onClick={() => toggleLocation(loc)}
                >
                  {loc}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 언어 */}
      <div>
        <h3 className="text-sm font-semibold text-[#111827] mb-3">언어</h3>
        <div className="grid grid-cols-2 gap-y-1.5 gap-x-2">
          {["한국어", "영어", "일본어", "중국어", "기타"].map((lang) => {
            const checked = filters.languages.includes(lang);
            return (
              <label key={lang} className="flex items-center gap-2 cursor-pointer group">
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${
                    checked ? "bg-[#7c3aed] border-[#7c3aed]" : "border-[#E5E7EB] group-hover:border-[#7c3aed]/50"
                  }`}
                  onClick={() => toggleLanguage(lang)}
                >
                  {checked && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-sm transition-colors ${checked ? "text-[#111827]" : "text-[#6B7280]"}`}
                  onClick={() => toggleLanguage(lang)}
                >
                  {lang}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 플랫폼 */}
      <div>
        <h3 className="text-sm font-semibold text-[#111827] mb-3">플랫폼</h3>
        <div className="space-y-2">
          {[
            { value: "instagram", label: "Instagram", available: true },
            { value: "youtube", label: "YouTube", available: false },
            { value: "tiktok", label: "TikTok", available: false },
          ].map(({ value, label, available }) => (
            <label
              key={value}
              className={`flex items-center gap-2 ${available ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}
            >
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                  filters.platform === value
                    ? "border-[#7c3aed]"
                    : "border-[#E5E7EB]"
                }`}
                onClick={() => available && onChange({ ...filters, platform: value as Filters["platform"] })}
              >
                {filters.platform === value && (
                  <div className="w-2 h-2 rounded-full bg-[#7c3aed]" />
                )}
              </div>
              <span className="text-sm text-[#6B7280]">{label}</span>
              {!available && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-[#E5E7EB] text-[#6B7280]">준비중</span>
              )}
            </label>
          ))}
        </div>
      </div>

      {/* 콘텐츠 타입 */}
      <div>
        <h3 className="text-sm font-semibold text-[#111827] mb-3">콘텐츠 타입</h3>
        <div className="flex flex-wrap gap-2">
          {CONTENT_TYPES.map((type) => {
            const checked = filters.contentTypes.includes(type);
            return (
              <button
                key={type}
                onClick={() => toggleContentType(type)}
                className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                  checked
                    ? "bg-[#7c3aed] border-[#7c3aed] text-white"
                    : "bg-transparent border-[#E5E7EB] text-[#6B7280] hover:border-[#7c3aed]/50 hover:text-[#111827]"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-2 pt-1">
        <button
          onClick={onSearch}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#e94560] text-white font-semibold hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(124,58,237,0.3)] min-h-[44px] cursor-pointer"
        >
          검색하기
        </button>
        <button
          onClick={onReset}
          className="w-full py-3 text-sm text-[#6B7280] hover:text-[#111827] transition-colors min-h-[44px] cursor-pointer"
        >
          필터 초기화
        </button>
      </div>
    </div>
  );
}

// ─── Free Tools ───────────────────────────────────────────────────────────────

function FreeTools({ isAuth }: { isAuth: boolean }) {
  // Tool 1: ER Calculator
  const [erUsername, setErUsername] = useState("");
  const [erResult, setErResult] = useState<{ rate: string; grade: string } | null>(null);
  const [erLoading, setErLoading] = useState(false);

  const calcER = async () => {
    if (!erUsername.trim()) return;
    setErLoading(true);
    try {
      const res = await fetch(`/api/tools/engagement-rate?username=${encodeURIComponent(erUsername)}`);
      if (res.ok) {
        const data = await res.json();
        setErResult({ rate: data.engagementRate?.toFixed(2) ?? "—", grade: data.grade ?? "—" });
      } else {
        setErResult({ rate: "—", grade: "데이터 없음" });
      }
    } catch {
      setErResult({ rate: "—", grade: "오류 발생" });
    } finally {
      setErLoading(false);
    }
  };

  // Tool 2: Fake Follower Check
  const [ffUsername, setFfUsername] = useState("");
  const [ffResult, setFfResult] = useState<{ grade: string; summary: string } | null>(null);
  const [ffLoading, setFfLoading] = useState(false);

  const checkFF = async () => {
    if (!ffUsername.trim()) return;
    setFfLoading(true);
    try {
      const res = await fetch(`/api/tools/fake-followers?username=${encodeURIComponent(ffUsername)}`);
      if (res.ok) {
        const data = await res.json();
        setFfResult({ grade: data.grade ?? "🟡", summary: data.summary ?? "분석 완료" });
      } else {
        setFfResult({ grade: "🔴", summary: "데이터를 불러올 수 없습니다" });
      }
    } catch {
      setFfResult({ grade: "🔴", summary: "오류가 발생했습니다" });
    } finally {
      setFfLoading(false);
    }
  };

  // Tool 3: Price Estimator (frontend only)
  const [priceFollowers, setPriceFollowers] = useState("");
  const [priceCategory, setPriceCategory] = useState("뷰티");
  const [priceResult, setPriceResult] = useState<{ min: number; max: number } | null>(null);

  const calcPrice = () => {
    const f = parseInt(priceFollowers);
    if (isNaN(f) || f <= 0) return;
    const multipliers: Record<string, number> = {
      뷰티: 1.2, 패션: 1.1, 푸드: 0.9, 여행: 1.0, 테크: 1.3,
      라이프스타일: 0.95, 피트니스: 1.0, 육아: 0.9,
    };
    const m = multipliers[priceCategory] ?? 1.0;
    const base = f * 0.015 * m;
    setPriceResult({ min: Math.round(base * 0.7), max: Math.round(base * 1.3) });
  };

  return (
    <section className="mt-16 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#111827] mb-2">
          무료{" "}
          <span className="bg-gradient-to-r from-[#7c3aed] to-[#e94560] bg-clip-text text-transparent">
            분석 도구
          </span>
        </h2>
        <p className="text-[#6B7280] text-sm">회원가입 없이 바로 사용할 수 있는 인플루언서 분석 툴</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tool 1: ER Calculator */}
        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-[#7c3aed]/20 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-[#7c3aed]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-[#111827] mb-1">참여율 계산기</h3>
          <p className="text-xs text-[#6B7280] mb-4">인스타그램 아이디로 참여율을 즉시 계산</p>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="@username"
              value={erUsername}
              onChange={(e) => setErUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && calcER()}
              className="flex-1 bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg px-3 py-2 text-base text-[#111827] placeholder:text-[#6B7280]/50 focus:outline-none focus:border-[#7c3aed]/60"
            />
            <button
              onClick={calcER}
              disabled={erLoading}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#e94560] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {erLoading ? "..." : "계산"}
            </button>
          </div>
          {erResult && (
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#6B7280]">참여율</span>
                <span className="text-lg font-bold text-[#111827]">{erResult.rate}%</span>
              </div>
              {!isAuth && (
                <p className="text-xs text-[#6B7280] mt-2 border-t border-[#E5E7EB] pt-2">
                  상세 분석은{" "}
                  <Link href="/signup" className="text-[#7c3aed] hover:underline">
                    회원가입
                  </Link>{" "}
                  후 확인
                </p>
              )}
            </div>
          )}
        </div>

        {/* Tool 2: Fake Follower Check */}
        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-[#e94560]/20 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-[#e94560]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-[#111827] mb-1">가짜 팔로워 체크</h3>
          <p className="text-xs text-[#6B7280] mb-4">AI가 가짜 팔로워 비율을 분석합니다</p>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="@username"
              value={ffUsername}
              onChange={(e) => setFfUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && checkFF()}
              className="flex-1 bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg px-3 py-2 text-base text-[#111827] placeholder:text-[#6B7280]/50 focus:outline-none focus:border-[#e94560]/60"
            />
            <button
              onClick={checkFF}
              disabled={ffLoading}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#e94560] text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {ffLoading ? "..." : "체크"}
            </button>
          </div>
          {ffResult && (
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{ffResult.grade}</span>
                <span className="text-sm text-[#111827]">{ffResult.summary}</span>
              </div>
            </div>
          )}
        </div>

        {/* Tool 3: Price Estimator */}
        <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-[#22c55e]/20 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-[#111827] mb-1">예상 단가 계산기</h3>
          <p className="text-xs text-[#6B7280] mb-4">팔로워 수와 카테고리로 협업 단가 예측</p>
          <div className="space-y-2 mb-3">
            <input
              type="number"
              placeholder="팔로워 수 (예: 50000)"
              value={priceFollowers}
              onChange={(e) => setPriceFollowers(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg px-3 py-2 text-base text-[#111827] placeholder:text-[#6B7280]/50 focus:outline-none focus:border-[#22c55e]/60"
            />
            <select
              value={priceCategory}
              onChange={(e) => setPriceCategory(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#22c55e]/60 appearance-none cursor-pointer"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <button
              onClick={calcPrice}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#e94560] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              계산하기
            </button>
          </div>
          {priceResult && (
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-3">
              <p className="text-xs text-[#6B7280] mb-1">예상 협업 단가 (피드 기준)</p>
              <p className="text-lg font-bold text-[#111827]">
                ₩{formatPrice(priceResult.min)} ~ ₩{formatPrice(priceResult.max)}
              </p>
              <p className="text-xs text-[#6B7280] mt-1">* 실제 단가는 컨텐츠 품질에 따라 다를 수 있습니다</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── AI Model Tab ────────────────────────────────────────────────────────────

function AIModelTab() {
  const AI_MODELS = [
    { id: "sua", name: "수아", nameEn: "Sua", gender: "여성", age: "20대", styles: ["캐주얼", "라이프스타일"], portfolio: 24, image: true, video: true },
    { id: "haeun", name: "하은", nameEn: "Haeun", gender: "여성", age: "20대", styles: ["스포티", "피트니스"], portfolio: 20, image: true, video: false },
    { id: "jiyu", name: "지유", nameEn: "Jiyu", gender: "여성", age: "20대", styles: ["럭셔리", "패션"], portfolio: 18, image: true, video: true },
    { id: "seoyeon", name: "서연", nameEn: "Seoyeon", gender: "여성", age: "30대", styles: ["내추럴", "뷰티"], portfolio: 22, image: true, video: false },
    { id: "mina", name: "미나", nameEn: "Mina", gender: "여성", age: "20대", styles: ["스트릿", "힙"], portfolio: 16, image: true, video: false },
    { id: "yejin", name: "예진", nameEn: "Yejin", gender: "여성", age: "30대", styles: ["포멀", "비즈니스"], portfolio: 14, image: true, video: false },
    { id: "jiho", name: "지호", nameEn: "Jiho", gender: "남성", age: "30대", styles: ["비즈니스", "포멀"], portfolio: 18, image: true, video: true },
    { id: "minjun", name: "민준", nameEn: "Minjun", gender: "남성", age: "20대", styles: ["스트릿", "캐주얼"], portfolio: 16, image: true, video: false },
    { id: "hyunwoo", name: "현우", nameEn: "Hyunwoo", gender: "남성", age: "20대", styles: ["스포티", "피트니스"], portfolio: 20, image: true, video: true },
    { id: "taeyun", name: "태윤", nameEn: "Taeyun", gender: "남성", age: "30대", styles: ["럭셔리", "패션"], portfolio: 15, image: true, video: false },
    { id: "junseo", name: "준서", nameEn: "Junseo", gender: "남성", age: "20대", styles: ["내추럴", "캐주얼"], portfolio: 18, image: true, video: false },
    { id: "doyun", name: "도윤", nameEn: "Doyun", gender: "남성", age: "30대", styles: ["아웃도어", "라이프스타일"], portfolio: 14, image: true, video: false },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["전체", "여성", "남성"].map(g => (
          <button key={g} className="px-4 py-2 rounded-lg border border-[#E5E7EB] text-sm text-[#6B7280] hover:border-[#7c3aed] hover:text-[#7c3aed] cursor-pointer">
            {g}
          </button>
        ))}
      </div>

      {/* Model grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {AI_MODELS.map(model => (
          <Link key={model.id} href={`/ai-studio/models/${model.id}`} className="group cursor-pointer">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all">
              {/* Image */}
              <div className="relative aspect-[4/5] bg-[#F3F4F6]">
                <img src={`https://picsum.photos/seed/ai-${model.nameEn}/400/500`} alt={model.name} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 px-2 py-1 bg-blue-500/90 text-white text-xs rounded-full font-medium">🤖 AI</span>
              </div>
              {/* Info */}
              <div className="p-3">
                <p className="font-semibold text-[#111827] text-sm">{model.name} ({model.nameEn})</p>
                <p className="text-xs text-[#6B7280] mb-2">{model.age} · {model.gender}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {model.styles.map(s => (
                    <span key={s} className="px-2 py-0.5 bg-[#F3F4F6] text-[#6B7280] text-[10px] rounded-full">{s}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-[#6B7280]">
                  <span>📸 {model.portfolio}장</span>
                  <span>{model.image ? "이미지 ✅" : ""} {model.video ? "영상 ✅" : ""}</span>
                </div>
              </div>
              {/* CTA */}
              <div className="px-3 pb-3">
                <div className="w-full py-2 text-center bg-[#7c3aed] text-white text-xs font-medium rounded-lg group-hover:bg-[#6d28d9] transition-colors">
                  이 모델로 제작
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-8 text-center">
        <Link href="/ai-studio" className="inline-block px-8 py-3 bg-gradient-to-r from-[#7c3aed] to-[#e94560] text-white font-semibold rounded-xl hover:opacity-90 cursor-pointer">
          AI Studio에서 더 알아보기 →
        </Link>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <HomePage />
    </Suspense>
  );
}

function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isAuth = !!session;

  // Derive initial state from URL params
  const initFilters = (): Filters => {
    const q = searchParams.get("q") ?? "";
    const categories = searchParams.get("categories")?.split(",").filter(Boolean) ?? [];
    const minFollowers = searchParams.get("minFollowers") ?? "";
    const maxFollowers = searchParams.get("maxFollowers") ?? "";
    const minEngagementRate = searchParams.get("minEngagementRate") ?? "";
    const maxEngagementRate = searchParams.get("maxEngagementRate") ?? "";
    const minAqs = searchParams.get("minAqs") ?? "";
    const maxAqs = searchParams.get("maxAqs") ?? "";
    const sortBy = (searchParams.get("sortBy") as Filters["sortBy"]) ?? "followers";
    return {
      query: q,
      categories,
      minFollowers,
      maxFollowers,
      minEngagementRate,
      maxEngagementRate,
      minAqs,
      maxAqs,
      platform: "instagram",
      contentTypes: [],
      sortBy,
      minPrice: searchParams.get("minPrice") ?? "",
      maxPrice: searchParams.get("maxPrice") ?? "",
      gender: searchParams.get("gender") ?? "전체",
      locations: searchParams.get("locations")?.split(",").filter(Boolean) ?? [],
      languages: searchParams.get("languages")?.split(",").filter(Boolean) ?? [],
    };
  };

  const [searchTab, setSearchTab] = useState<"real" | "ai">(
    searchParams.get("tab") === "ai" ? "ai" : "real"
  );
  const [filters, setFilters] = useState<Filters>(initFilters);
  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");
  const [results, setResults] = useState<Influencer[]>([]);
  const [total, setTotal] = useState(0);
  const [totalCount, setTotalCount] = useState(15000);
  const [page, setPage] = useState(Number(searchParams.get("page") ?? "1"));
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch total creator count on mount
  useEffect(() => {
    fetch("/api/influencers/count")
      .then((r) => r.json())
      .then((d) => d.count && setTotalCount(d.count))
      .catch(() => {});
  }, []);

  const fetchResults = useCallback(
    async (currentPage = 1, f: Filters = filters) => {
      setLoading(true);
      setHasSearched(true);
      try {
        const params = filtersToParams(f, currentPage);
        const res = await fetch(`/api/influencers/search?${params.toString()}`);
        if (!res.ok) throw new Error("Failed");
        const data: SearchResponse = await res.json();
        setResults(data.results);
        setTotal(data.total);
        setPage(currentPage);

        // Sync URL
        const urlParams = new URLSearchParams();
        if (f.query) urlParams.set("q", f.query);
        if (f.categories.length) urlParams.set("categories", f.categories.join(","));
        if (f.minFollowers) urlParams.set("minFollowers", f.minFollowers);
        if (f.maxFollowers) urlParams.set("maxFollowers", f.maxFollowers);
        if (f.minEngagementRate) urlParams.set("minEngagementRate", f.minEngagementRate);
        if (f.maxEngagementRate) urlParams.set("maxEngagementRate", f.maxEngagementRate);
        if (f.minAqs) urlParams.set("minAqs", f.minAqs);
        if (f.maxAqs) urlParams.set("maxAqs", f.maxAqs);
        if (f.sortBy !== "followers") urlParams.set("sortBy", f.sortBy);
        if (currentPage > 1) urlParams.set("page", String(currentPage));
        const qs = urlParams.toString();
        router.push(`/${qs ? `?${qs}` : ""}`, { scroll: false });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [filters, router]
  );

  // Initial load
  useEffect(() => {
    fetchResults(page, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search on query input
  const handleSearchInput = (val: string) => {
    setSearchInput(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const newFilters = { ...filters, query: val };
      setFilters(newFilters);
      fetchResults(1, newFilters);
    }, 300);
  };

  // Debounced filter changes
  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchResults(1, newFilters);
    }, 500);
  };

  const handleCategoryChip = (cat: string) => {
    const newCategories = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    fetchResults(1, newFilters);
  };

  const handleReset = () => {
    const fresh = defaultFilters();
    setSearchInput("");
    setFilters(fresh);
    fetchResults(1, fresh);
  };

  const handleSort = (sortBy: Filters["sortBy"]) => {
    const newFilters = { ...filters, sortBy };
    setFilters(newFilters);
    fetchResults(1, newFilters);
  };

  const totalPages = Math.ceil(total / LIMIT);
  const hiddenCount = Math.max(0, total - 5);

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ─── Section 1: Hero Search Bar ─────────────────────────────── */}
        <section className={`bg-gradient-to-b from-[#F9FAFB] to-white border-b border-[#E5E7EB] px-4 transition-all duration-500 ${hasSearched ? "py-6" : "py-12"}`}>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111827] mb-2 leading-tight">
              데이터로 검증된{" "}
              <span className="bg-gradient-to-r from-[#7c3aed] to-[#e94560] bg-clip-text text-transparent">
                인플루언서
              </span>
              를
              <br />
              지금 바로 찾아보세요
            </h1>
            {!hasSearched && (
              <p className="text-[#6B7280] text-lg mb-2 transition-all duration-300">
                브랜드와 크리에이터를 연결하는 AI 기반 인플루언서 마케팅 플랫폼
              </p>
            )}
            <p className="text-[#6B7280] mb-6">
              총{" "}
              <span className="text-[#111827] font-semibold">
                {totalCount.toLocaleString()}+
              </span>
              명의 크리에이터가 등록되어 있습니다
            </p>

            {/* Search input */}
            <div className="flex gap-3 mb-6">
              <div className="flex-1 relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7280] pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="인플루언서 이름, @아이디, 또는 카테고리 검색..."
                  value={searchInput}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const newFilters = { ...filters, query: searchInput };
                      setFilters(newFilters);
                      fetchResults(1, newFilters);
                    }
                  }}
                  className="w-full bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl pl-12 pr-4 py-4 text-[#111827] placeholder:text-[#6B7280]/60 focus:outline-none focus:border-[#7c3aed]/60 focus:ring-2 focus:ring-[#7c3aed]/20 text-base transition-all cursor-text"
                />
              </div>
              <button
                onClick={() => {
                  const newFilters = { ...filters, query: searchInput };
                  setFilters(newFilters);
                  fetchResults(1, newFilters);
                }}
                className="px-6 py-4 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#e94560] text-white font-semibold hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(124,58,237,0.4)] whitespace-nowrap cursor-pointer min-h-[44px]"
              >
                검색하기
              </button>
            </div>

            {/* Category quick chips */}
            <div className="flex flex-wrap justify-center gap-2">
              {CATEGORIES.map((cat) => {
                const active = filters.categories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChip(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all min-h-[36px] cursor-pointer ${
                      active
                        ? "bg-[#7c3aed] border-[#7c3aed] text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]"
                        : "bg-transparent border-[#E5E7EB] text-[#6B7280] hover:border-[#7c3aed]/50 hover:text-[#111827]"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Trust metrics - hidden after search */}
            {!hasSearched && (
              <div className="flex justify-center gap-6 mt-6 transition-all duration-300">
                {[
                  { value: "15,000+", label: "크리에이터" },
                  { value: "500+", label: "브랜드" },
                  { value: "1,200+", label: "캠페인" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-xl font-bold bg-gradient-to-r from-[#7c3aed] to-[#e94560] bg-clip-text text-transparent">
                      {stat.value}
                    </p>
                    <p className="text-xs text-[#6B7280]">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Tab switcher */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="flex border-b border-[#E5E7EB]">
            <button
              onClick={() => { setSearchTab("real"); router.replace("/?tab=real", { scroll: false }); }}
              className={`flex-1 sm:flex-none px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                searchTab === "real"
                  ? "border-[#7c3aed] text-[#7c3aed]"
                  : "border-transparent text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              👤 실제 인플루언서
            </button>
            <button
              onClick={() => { setSearchTab("ai"); router.replace("/?tab=ai", { scroll: false }); }}
              className={`flex-1 sm:flex-none px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                searchTab === "ai"
                  ? "border-[#7c3aed] text-[#7c3aed]"
                  : "border-transparent text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              🤖 AI 모델
            </button>
          </div>
        </div>

        {searchTab === "real" ? (
          <>
        {/* ─── Section 2+3: Sidebar + Results ──────────────────────────── */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-6">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-5 sticky top-24">
                <h2 className="text-base font-semibold text-[#111827] mb-5 flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#7c3aed]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                  </svg>
                  필터
                </h2>
                <FilterSidebar
                  filters={filters}
                  onChange={handleFilterChange}
                  onSearch={() => fetchResults(1, filters)}
                  onReset={handleReset}
                />
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Mobile filter + results bar */}
              <div className="flex items-center justify-between mb-4 gap-3">
                <p className="text-sm text-[#6B7280]">
                  총{" "}
                  <span className="text-[#111827] font-semibold">{total.toLocaleString()}</span>
                  명 검색됨
                </p>
                <div className="flex items-center gap-2">
                  {/* Mobile filter button */}
                  <button
                    onClick={() => setMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E5E7EB] text-sm text-[#6B7280] hover:border-[#7c3aed]/50 hover:text-[#111827] transition-colors min-h-[44px] cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                    </svg>
                    필터
                    {(filters.categories.length > 0 || filters.minFollowers || filters.maxFollowers || filters.minEngagementRate || filters.minAqs) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]" />
                    )}
                  </button>

                  {/* Sort dropdown */}
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleSort(e.target.value as Filters["sortBy"])}
                    className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm text-[#111827] focus:outline-none focus:border-[#7c3aed]/60 appearance-none cursor-pointer"
                  >
                    <option value="followers">팔로워순</option>
                    <option value="engagement">참여율순</option>
                    <option value="aqs">AQS순</option>
                  </select>

                  {/* View toggle */}
                  <div className="flex border border-[#E5E7EB] rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`px-3 py-2 transition-colors ${viewMode === "grid" ? "bg-[#7c3aed] text-white" : "text-[#6B7280] hover:text-[#111827]"}`}
                      title="그리드 보기"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`px-3 py-2 transition-colors border-l border-[#E5E7EB] ${viewMode === "list" ? "bg-[#7c3aed] text-white" : "text-[#6B7280] hover:text-[#111827]"}`}
                      title="리스트 보기"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Results */}
              {loading ? (
                viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {Array.from({ length: LIMIT }).map((_, i) => <CardSkeleton key={i} />)}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {Array.from({ length: LIMIT }).map((_, i) => <ListRowSkeleton key={i} />)}
                  </div>
                )
              ) : results.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#FFFFFF] border border-[#E5E7EB] flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-[#6B7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="text-[#111827] font-semibold mb-1">검색 결과가 없습니다</p>
                  <p className="text-sm text-[#6B7280] mb-4">필터를 조정하거나 다른 키워드로 검색해보세요</p>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 rounded-lg border border-[#E5E7EB] text-sm text-[#6B7280] hover:border-[#7c3aed]/50 hover:text-[#111827] transition-colors"
                  >
                    필터 초기화
                  </button>
                </div>
              ) : viewMode === "grid" ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {results.slice(0, 5).map((inf, idx) => (
                      <InfluencerGridCard
                        key={inf.id}
                        influencer={inf}
                        index={idx}
                        isAuth={isAuth}
                        onSaveClick={() => setShowSignupModal(true)}
                      />
                    ))}
                  </div>

                  {/* CTA Banner between card 5 and 6 */}
                  {!isAuth && results.length > 5 && (
                    <div className="bg-gradient-to-r from-[#7c3aed]/20 to-[#e94560]/20 border border-[#7c3aed]/30 rounded-2xl p-6 text-center">
                      <p className="text-[#111827] font-semibold mb-2">
                        나머지{" "}
                        <span className="text-[#7c3aed]">{hiddenCount.toLocaleString()}명</span>
                        의 인플루언서를 확인하세요
                      </p>
                      <p className="text-sm text-[#6B7280] mb-4">무료 회원가입으로 모든 데이터에 접근하세요</p>
                      <Link
                        href="/signup"
                        className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#e94560] text-white font-semibold hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(124,58,237,0.4)]"
                      >
                        무료로 시작하기 →
                      </Link>
                    </div>
                  )}

                  {results.length > 5 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                      {results.slice(5).map((inf, idx) => (
                        <InfluencerGridCard
                          key={inf.id}
                          influencer={inf}
                          index={idx + 5}
                          isAuth={isAuth}
                          onSaveClick={() => setShowSignupModal(true)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {results.slice(0, 5).map((inf, idx) => (
                    <InfluencerListRow
                      key={inf.id}
                      influencer={inf}
                      index={idx}
                      isAuth={isAuth}
                      onSaveClick={() => setShowSignupModal(true)}
                    />
                  ))}

                  {!isAuth && results.length > 5 && (
                    <div className="bg-gradient-to-r from-[#7c3aed]/20 to-[#e94560]/20 border border-[#7c3aed]/30 rounded-xl p-5 text-center">
                      <p className="text-[#111827] font-semibold mb-2">
                        나머지{" "}
                        <span className="text-[#7c3aed]">{hiddenCount.toLocaleString()}명</span>
                        의 인플루언서를 확인하세요
                      </p>
                      <Link
                        href="/signup"
                        className="inline-block mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#e94560] text-white font-semibold hover:opacity-90 transition-opacity"
                      >
                        무료로 시작하기 →
                      </Link>
                    </div>
                  )}

                  {results.length > 5 && (
                    <div className="space-y-2">
                      {results.slice(5).map((inf, idx) => (
                        <InfluencerListRow
                          key={inf.id}
                          influencer={inf}
                          index={idx + 5}
                          isAuth={isAuth}
                          onSaveClick={() => setShowSignupModal(true)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Pagination */}
              {!loading && totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => fetchResults(page - 1, filters)}
                    className="px-4 py-2 rounded-lg border border-[#E5E7EB] text-sm text-[#6B7280] hover:border-[#7c3aed]/50 hover:text-[#111827] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    이전
                  </button>
                  <div className="flex gap-1">
                    {(() => {
                      const maxPages = Math.min(totalPages, 7);
                      let start = Math.max(1, page - 3);
                      const end = Math.min(start + maxPages - 1, totalPages);
                      start = Math.max(1, end - maxPages + 1);
                      return Array.from({ length: end - start + 1 }, (_, i) => start + i).map((p) => (
                        <button
                          key={p}
                          onClick={() => fetchResults(p, filters)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                            p === page
                              ? "bg-[#7c3aed] text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]"
                              : "border border-[#E5E7EB] text-[#6B7280] hover:border-[#7c3aed]/50 hover:text-[#111827]"
                          }`}
                        >
                          {p}
                        </button>
                      ));
                    })()}
                  </div>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => fetchResults(page + 1, filters)}
                    className="px-4 py-2 rounded-lg border border-[#E5E7EB] text-sm text-[#6B7280] hover:border-[#7c3aed]/50 hover:text-[#111827] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    다음
                  </button>
                </div>
              )}

              {/* Non-auth footer note */}
              {!isAuth && results.length > 0 && (
                <p className="text-center text-xs text-[#6B7280] mt-4">
                  <Link href="/signup" className="text-[#7c3aed] hover:underline">
                    무료 회원가입
                  </Link>
                  하면 모든 인플루언서의 상세 데이터를 확인할 수 있어요
                </p>
              )}
            </div>
          </div>

          {/* ─── Section 3: Free Tools ──────────────────────────────────── */}
          <FreeTools isAuth={isAuth} />
        </div>

        {/* ─── Section 4: 양쪽 분기 CTA ───────────────────────────────── */}
        <section className="py-20 px-4 bg-[#F9FAFB]">
          <div className="max-w-4xl mx-auto text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">어떤 목적으로 방문하셨나요?</h2>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Brand card */}
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-8 hover:border-[#7c3aed]/30 transition-colors flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-[#7c3aed]/10 flex items-center justify-center mb-5">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-[#111827] mb-3">브랜드 담당자</h3>
              <p className="text-[#6B7280] text-sm mb-5">검증된 인플루언서를 찾고 캠페인 성과를 추적하세요</p>
              <ul className="space-y-2 text-sm text-[#6B7280] mb-7">
                {["AI 인플루언서 검증", "캠페인 성과 트래킹", "리포트 자동 생성", "예상 광고단가 산출"].map((feat) => (
                  <li key={feat} className="flex items-center gap-2">
                    <span className="text-[#7c3aed]">✓</span>
                    {feat}
                  </li>
                ))}
              </ul>
              <Link
                href="/for-brands"
                className="mt-auto block text-center py-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#e94560] text-white font-semibold hover:opacity-90 transition-opacity min-h-[44px] flex items-center justify-center cursor-pointer"
              >
                브랜드로 시작하기 →
              </Link>
            </div>

            {/* Creator card */}
            <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl p-8 hover:border-[#e94560]/30 transition-colors flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-[#e94560]/10 flex items-center justify-center mb-5">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-bold text-[#111827] mb-3">크리에이터</h3>
              <p className="text-[#6B7280] text-sm mb-5">당신의 영향력을 데이터로 증명하고 브랜드와 연결되세요</p>
              <ul className="space-y-2 text-sm text-[#6B7280] mb-7">
                {["AI Muse 자동 생성", "캠페인 마켓플레이스", "성장 트래커", "수익/정산 관리"].map((feat) => (
                  <li key={feat} className="flex items-center gap-2">
                    <span className="text-[#e94560]">✓</span>
                    {feat}
                  </li>
                ))}
              </ul>
              <Link
                href="/for-creators"
                className="mt-auto block text-center py-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#e94560] text-white font-semibold hover:opacity-90 transition-opacity min-h-[44px] flex items-center justify-center cursor-pointer"
              >
                크리에이터로 시작하기 →
              </Link>
            </div>
          </div>
        </section>

        {/* ─── Section 5: FAQ ──────────────────────────────────────────── */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] text-center mb-10">
              자주 묻는 질문
            </h2>
            {[
              {
                q: "이 서비스는 무료인가요?",
                a: "네, 회원가입만 하면 모든 기능을 무료로 이용하실 수 있습니다.",
              },
              {
                q: "인플루언서 데이터는 어떻게 수집하나요?",
                a: "Instagram 공식 Graph API를 통해 데이터를 수집합니다. 인플루언서가 직접 OAuth를 연동하면 더 정확한 오디언스 데이터를 확인할 수 있습니다.",
              },
              {
                q: "AQS 점수는 무엇인가요?",
                a: "AQS(Audience Quality Score)는 오디언스 품질을 0~100점으로 평가하는 지표입니다. 참여 품질, 팔로워 성장 패턴, 댓글 진정성 등 5가지 축으로 산출됩니다.",
              },
              {
                q: "브랜드와 크리에이터 모두 사용할 수 있나요?",
                a: "네, 브랜드 담당자와 크리에이터 모두 사용할 수 있습니다. 회원가입 시 역할을 선택하면 각각에 맞는 기능을 제공합니다.",
              },
              {
                q: "Instagram 외 다른 플랫폼도 지원하나요?",
                a: "현재는 Instagram을 지원하고 있으며, YouTube와 TikTok은 준비 중입니다.",
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl mb-3"
              >
                <summary className="flex justify-between items-center cursor-pointer px-5 py-4 min-h-[44px] font-semibold text-[#111827]">
                  {faq.q}
                  <svg
                    className="w-5 h-5 text-[#6B7280] flex-shrink-0 ml-4 transition-transform group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="px-5 pb-5 text-sm text-[#6B7280]">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
          </>
        ) : (
          <AIModelTab />
        )}
      </main>

      {/* Mobile filter bottom sheet */}
      {mobileFilterOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileFilterOpen(false)}
        />
      )}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-[#FFFFFF] border-t border-[#E5E7EB] rounded-t-2xl p-5 max-h-[88vh] overflow-y-auto transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileFilterOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-[#E5E7EB] rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-[#111827]">필터</h2>
          <button
            onClick={() => setMobileFilterOpen(false)}
            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#FFFFFF] transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <FilterSidebar
          filters={filters}
          onChange={handleFilterChange}
          onSearch={() => {
            fetchResults(1, filters);
            setMobileFilterOpen(false);
          }}
          onReset={() => {
            handleReset();
            setMobileFilterOpen(false);
          }}
        />
      </div>

      {/* Signup modal */}
      {showSignupModal && <SignupModal onClose={() => setShowSignupModal(false)} />}

      <Footer />
    </div>
  );
}
