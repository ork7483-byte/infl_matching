"use client";

import { useState, useEffect, Component, type ErrorInfo, type ReactNode } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlurOverlay from "@/components/BlurOverlay";
import MaskedValue from "@/components/MaskedValue";
import Badge from "@/components/ui/Badge";
import DonutChart from "@/components/charts/DonutChart";
import BarChartComponent from "@/components/charts/BarChartComponent";
import AqsRadarChart from "@/components/charts/AqsRadarChart";
import GaugeChart from "@/components/charts/GaugeChart";
import LineChartComponent from "@/components/charts/LineChartComponent";

// ─── Error Boundary ─────────────────────────────────────────────────────────
class ProfileErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; errorMsg: string }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMsg: "" };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMsg: error.message };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ProfileErrorBoundary]", error, info.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex flex-col">
          <Navbar />
          <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center mb-6">
              <span className="text-3xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">페이지 로드 오류</h1>
            <p className="text-gray-500 mb-2">프로필을 불러오는 중 문제가 발생했습니다</p>
            <p className="text-xs text-gray-400 mb-6 max-w-md">{this.state.errorMsg}</p>
            <a href="/" className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#e94560] text-white font-semibold hover:opacity-90">
              검색으로 돌아가기
            </a>
          </main>
          <Footer />
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface MediaSnapshot {
  id: string;
  igMediaId: string;
  mediaType: string;
  thumbnailUrl: string | null;
  permalink: string | null;
  likeCount: number | null;
  commentsCount: number | null;
  postedAt: string | null;
}

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

interface IgrScore {
  totalScore: number;
  grade: string;
  label: string;
  reelsPerformance: number;
  engagementQuality: number;
  contentStrategy: number;
  growthMomentum: number;
  description: string;
}

interface PricePrediction {
  id: string;
  minPrice: number;
  maxPrice: number;
  predictedReach: number | null;
  cpr: number | null;
  cpe: number | null;
  calculatedAt: string;
}

interface InfluencerProfile {
  id: string;
  username: string;
  fullName: string;
  biography: string | null;
  profilePicUrl: string | null;
  followersCount: number;
  followingCount: number;
  mediaCount: number;
  categories: string[];
  avgEngagementRate: number | null;
  isOauthConnected: boolean;
  aqsScore: AqsScore | null;
  pricePrediction: PricePrediction | null;
  mediaSnapshots: MediaSnapshot[];
  createdAt: string;
  updatedAt: string;
}

interface AudienceData {
  genderData: { name: string; value: number; color: string }[];
  ageData: { name: string; value: number }[];
  cityData: { name: string; value: number }[];
}

interface FollowerHistoryPoint {
  date: string;
  value: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function formatWon(n: number): string {
  if (n >= 10000) return `${Math.floor(n / 10000)}만`;
  return n.toLocaleString();
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

function getAqsLabel(score: number): string {
  if (score >= 90) return "매우 건강";
  if (score >= 70) return "양호";
  if (score >= 50) return "주의";
  return "위험";
}

function getErGrade(er: number): { emoji: string; label: string; color: string } {
  if (er >= 6) return { emoji: "🟢", label: "매우 높음", color: "#22c55e" };
  if (er >= 3) return { emoji: "🟡", label: "높음", color: "#f59e0b" };
  if (er >= 1) return { emoji: "🟠", label: "보통", color: "#f97316" };
  return { emoji: "🔴", label: "낮음", color: "#ef4444" };
}

const CATEGORY_AVG: Record<string, { er: number; aqs: number }> = {
  "뷰티": { er: 3.8, aqs: 65 }, "패션": { er: 3.2, aqs: 62 },
  "푸드": { er: 4.1, aqs: 60 }, "여행": { er: 3.5, aqs: 58 },
  "테크": { er: 2.8, aqs: 64 }, "라이프스타일": { er: 3.0, aqs: 59 },
  "피트니스": { er: 4.5, aqs: 67 }, "육아": { er: 3.6, aqs: 61 },
};

function getCategoryAvg(categories: string[]) {
  return CATEGORY_AVG[categories[0]] || { er: 3.2, aqs: 62 };
}

function getIgrColor(score: number): string {
  if (score >= 70) return "#7c3aed";
  if (score >= 50) return "#22c55e";
  return "#f59e0b";
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

function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="relative group inline-flex ml-1 cursor-help">
      <svg className="w-3.5 h-3.5 text-[#9CA3AF] hover:text-[#7c3aed] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#111827] text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 max-w-[220px] whitespace-normal text-center leading-relaxed shadow-lg">
        {text}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#111827]" />
      </span>
    </span>
  );
}

// ─── Skeletons ────────────────────────────────────────────────────────────────

function ProfileHeaderSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 mb-6 animate-pulse">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="w-24 h-24 rounded-full bg-border flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-border rounded w-32" />
          <div className="h-4 bg-border rounded w-48" />
          <div className="h-3 bg-border rounded w-full max-w-sm" />
          <div className="flex gap-4 mt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-1">
                <div className="h-5 bg-border rounded w-14" />
                <div className="h-3 bg-border rounded w-10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 animate-pulse">
      <div className="h-4 bg-border rounded w-32 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-4 bg-border rounded" />
        ))}
      </div>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-card border border-border rounded-2xl p-6 ${className}`}>
      <h2 className="text-base font-semibold text-foreground mb-5">{title}</h2>
      {children}
    </div>
  );
}

// ─── Not Found ────────────────────────────────────────────────────────────────

function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-card border border-border flex items-center justify-center mb-6">
          <svg
            className="w-10 h-10 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          인플루언서를 찾을 수 없습니다
        </h1>
        <p className="text-muted-foreground mb-6">
          해당 사용자가 존재하지 않거나 삭제된 계정입니다
        </p>
        <a
          href="/"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink text-white font-semibold hover:opacity-90 transition-opacity"
        >
          검색으로 돌아가기
        </a>
      </main>
      <Footer />
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function InfluencerProfilePageWrapper() {
  return (
    <ProfileErrorBoundary>
      <InfluencerProfilePage />
    </ProfileErrorBoundary>
  );
}

function InfluencerProfilePage() {
  const params = useParams<{ username: string }>();
  const username = params?.username ?? "";
  const { data: session } = useSession();
  const isAuthed = !!session;
  const isBrand = (session?.user as { role?: string })?.role === "BRAND";

  const [profile, setProfile] = useState<InfluencerProfile | null>(null);
  const [audience, setAudience] = useState<AudienceData | null>(null);
  const [followerHistory, setFollowerHistory] = useState<FollowerHistoryPoint[]>([]);
  const [igrScore, setIgrScore] = useState<IgrScore | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingAudience, setLoadingAudience] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState<"FEED" | "REEL" | "STORY">("FEED");

  // ─── Match Request Modal state ────────────────────────────────────────────
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [matchForm, setMatchForm] = useState({
    campaignTitle: "",
    campaignType: "스폰서 게시물",
    budget: "협의",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [matchSubmitting, setMatchSubmitting] = useState(false);
  const [matchSuccess, setMatchSuccess] = useState(false);

  async function handleMatchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setMatchSubmitting(true);
    try {
      const res = await fetch("/api/match/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          influencerId: profile.id,
          campaignTitle: matchForm.campaignTitle,
          campaignType: matchForm.campaignType,
          budget: matchForm.budget,
          startDate: matchForm.startDate || undefined,
          endDate: matchForm.endDate || undefined,
          description: matchForm.description,
        }),
      });
      if (res.ok) {
        setMatchSuccess(true);
        setMatchModalOpen(false);
        setMatchForm({
          campaignTitle: "",
          campaignType: "스폰서 게시물",
          budget: "협의",
          startDate: "",
          endDate: "",
          description: "",
        });
        setTimeout(() => setMatchSuccess(false), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setMatchSubmitting(false);
    }
  }

  // Fetch profile
  useEffect(() => {
    if (!username) return;
    setLoadingProfile(true);
    fetch(`/api/influencers/${username}`)
      .then(async (res) => {
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        if (!data || data.error) {
          setNotFound(true);
          return;
        }
        // Ensure arrays are always defined
        data.mediaSnapshots = data.mediaSnapshots ?? [];
        data.categories = data.categories ?? [];
        setProfile(data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoadingProfile(false));
  }, [username]);

  // Fetch audience data
  useEffect(() => {
    if (!username) return;
    setLoadingAudience(true);
    fetch(`/api/influencers/${username}/audience`)
      .then(async (res) => {
        if (!res.ok) return;
        const json = await res.json();
        // API may return { data: ..., _blurred } or direct audience object
        const d = json.data ?? json;
        if (d && d.genderData) {
          setAudience(d);
        }
        // If no genderData, leave audience as null → defaults will be used
      })
      .catch(console.error)
      .finally(() => setLoadingAudience(false));
  }, [username]);

  // Fetch follower history
  useEffect(() => {
    if (!username) return;
    fetch(`/api/influencers/${username}/follower-history`)
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        setFollowerHistory(Array.isArray(data) ? data : data.history ?? []);
      })
      .catch(console.error);
  }, [username]);

  // Fetch IGR score
  useEffect(() => {
    if (!username) return;
    fetch(`/api/influencers/${username}/igr`)
      .then(async (res) => {
        if (!res.ok) {
          // Mock fallback for demo
          setIgrScore({
            totalScore: 72,
            grade: "A",
            label: "우수",
            reelsPerformance: 78,
            engagementQuality: 70,
            contentStrategy: 65,
            growthMomentum: 75,
            description: "알고리즘 노출이 활발하게 이루어지고 있어요. 릴스 성과가 특히 높습니다.",
          });
          return;
        }
        const json = await res.json();
        // API wraps in { data: ... } — unwrap and validate
        const igrData = json.data ?? json;
        if (igrData && igrData.totalScore != null) {
          setIgrScore(igrData);
        } else {
          // Partial data (e.g. blurred) — use mock fallback
          setIgrScore({
            totalScore: 72,
            grade: igrData?.grade ?? "A",
            label: igrData?.label ?? "우수",
            reelsPerformance: 78,
            engagementQuality: 70,
            contentStrategy: 65,
            growthMomentum: 75,
            description: "알고리즘 노출이 활발하게 이루어지고 있어요. 릴스 성과가 특히 높습니다.",
          });
        }
      })
      .catch(() => {
        setIgrScore({
          totalScore: 72,
          grade: "A",
          label: "우수",
          reelsPerformance: 78,
          engagementQuality: 70,
          contentStrategy: 65,
          growthMomentum: 75,
          description: "알고리즘 노출이 활발하게 이루어지고 있어요. 릴스 성과가 특히 높습니다.",
        });
      });
  }, [username]);

  if (notFound) return <NotFound />;

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <ProfileHeaderSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <SectionSkeleton key={i} />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!profile) return null;

  const aqs = profile.aqsScore;
  const categoryAvg = getCategoryAvg(profile.categories);

  // Fake follower signals derived from AQS sub-scores
  const fakeFollowerSignals = aqs
    ? [
        {
          label: "참여율 이상",
          score: aqs.engagementQuality,
          detected: aqs.engagementQuality < 50,
        },
        {
          label: "팔로워/팔로잉 비율",
          score: aqs.ratioAnalysis,
          detected: aqs.ratioAnalysis < 50,
        },
        {
          label: "팔로워 급증/급감",
          score: aqs.growthPattern,
          detected: aqs.growthPattern < 50,
        },
        {
          label: "스팸 댓글",
          score: aqs.commentAuthenticity,
          detected: aqs.commentAuthenticity < 50,
        },
      ]
    : [];

  // Default audience placeholder (shown blurred for non-auth)
  const defaultAudienceGender = [
    { name: "여성", value: 62, color: "#e94560" },
    { name: "남성", value: 38, color: "#7c3aed" },
  ];
  const defaultAudienceAge = [
    { name: "18-24", value: 28 },
    { name: "25-34", value: 41 },
    { name: "35-44", value: 19 },
    { name: "45+", value: 12 },
  ];
  const defaultCityData = [
    { name: "서울", value: 35 },
    { name: "부산", value: 14 },
    { name: "인천", value: 11 },
    { name: "대구", value: 9 },
    { name: "기타", value: 31 },
  ];

  const genderData =
    isAuthed && audience ? audience.genderData : defaultAudienceGender;
  const ageData =
    isAuthed && audience ? audience.ageData : defaultAudienceAge;
  const cityData =
    isAuthed && audience ? audience.cityData : defaultCityData;

  // Follower history placeholder
  const defaultHistory: FollowerHistoryPoint[] = Array.from(
    { length: 12 },
    (_, i) => ({
      date: `${i + 1}월`,
      value: Math.round(
        profile.followersCount * (0.85 + 0.015 * i + Math.random() * 0.01)
      ),
    })
  );
  const historyData =
    isAuthed && followerHistory.length > 0 ? followerHistory : defaultHistory;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* ─── Profile Header ─────────────────────────────────────── */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {profile.profilePicUrl ? (
                <img
                  src={profile.profilePicUrl}
                  alt={profile.username}
                  className="w-24 h-24 rounded-full object-cover border-2 border-brand-purple/30"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold text-3xl">
                  {profile.username[0]?.toUpperCase() ?? "?"}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-foreground">
                  @{profile.username}
                </h1>
                {profile.isOauthConnected && (
                  <Badge variant="success" size="sm">
                    ✓ 인증됨
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-sm mb-2">
                {profile.fullName}
              </p>
              {profile.biography && (
                <p className="text-sm text-foreground/80 mb-3 leading-relaxed line-clamp-3">
                  {profile.biography}
                </p>
              )}

              {/* Stats row */}
              <div className="flex flex-wrap gap-6 mb-3">
                <div>
                  <p className="text-lg font-bold text-foreground">
                    {formatFollowers(profile.followersCount)}
                  </p>
                  <p className="text-xs text-muted-foreground">팔로워</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">
                    {formatFollowers(profile.followingCount)}
                  </p>
                  <p className="text-xs text-muted-foreground">팔로잉</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">
                    {profile.mediaCount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">게시물</p>
                </div>
              </div>

              {/* Category badges */}
              {profile.categories.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {profile.categories.map((cat) => (
                    <Badge key={cat} variant="purple">
                      {cat}
                    </Badge>
                  ))}
                </div>
              )}

              {/* CTA buttons */}
              {isBrand && (
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    onClick={() => setMatchModalOpen(true)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#e94560] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    매칭 요청
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── Success Toast ───────────────────────────────────────── */}
        {matchSuccess && (
          <div className="fixed top-6 right-6 z-50 bg-[#22c55e] text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in">
            매칭 요청이 성공적으로 전송되었습니다!
          </div>
        )}

        {/* ─── Match Request Modal ─────────────────────────────────── */}
        {matchModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
            onClick={(e) => { if (e.target === e.currentTarget) setMatchModalOpen(false); }}
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-[#111827]">매칭 요청</h2>
                <button
                  onClick={() => setMatchModalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F3F4F6] text-[#6B7280] transition-colors"
                  aria-label="닫기"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleMatchSubmit} className="space-y-5">
                {/* 캠페인명 */}
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">
                    캠페인명 <span className="text-[#e94560]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={matchForm.campaignTitle}
                    onChange={(e) => setMatchForm((f) => ({ ...f, campaignTitle: e.target.value }))}
                    placeholder="캠페인 이름을 입력하세요"
                    className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/40 focus:border-[#7c3aed] transition-colors"
                  />
                </div>

                {/* 캠페인 유형 */}
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">
                    캠페인 유형 <span className="text-[#e94560]">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["스폰서 게시물", "제품 리뷰", "UGC", "스토리", "릴스"].map((type) => (
                      <label key={type} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="campaignType"
                          value={type}
                          checked={matchForm.campaignType === type}
                          onChange={() => setMatchForm((f) => ({ ...f, campaignType: type }))}
                          className="accent-[#7c3aed]"
                        />
                        <span className="text-sm text-[#374151]">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 예산 범위 */}
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-2">예산 범위</label>
                  <div className="flex flex-wrap gap-2">
                    {["10만원 이하", "10~50만원", "50~100만원", "100~300만원", "300만원+", "협의"].map((b) => (
                      <label key={b} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="budget"
                          value={b}
                          checked={matchForm.budget === b}
                          onChange={() => setMatchForm((f) => ({ ...f, budget: b }))}
                          className="accent-[#7c3aed]"
                        />
                        <span className="text-sm text-[#374151]">{b}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 희망 기간 */}
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">희망 기간</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={matchForm.startDate}
                      onChange={(e) => setMatchForm((f) => ({ ...f, startDate: e.target.value }))}
                      className="flex-1 px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/40 focus:border-[#7c3aed] transition-colors"
                    />
                    <span className="text-[#6B7280] text-sm flex-shrink-0">~</span>
                    <input
                      type="date"
                      value={matchForm.endDate}
                      onChange={(e) => setMatchForm((f) => ({ ...f, endDate: e.target.value }))}
                      className="flex-1 px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/40 focus:border-[#7c3aed] transition-colors"
                    />
                  </div>
                </div>

                {/* 상세 설명 */}
                <div>
                  <label className="block text-sm font-medium text-[#374151] mb-1.5">
                    상세 설명 <span className="text-[#e94560]">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={matchForm.description}
                    onChange={(e) => setMatchForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="캠페인에 대해 자세히 설명해주세요"
                    className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/40 focus:border-[#7c3aed] transition-colors resize-none"
                  />
                </div>

                {/* Notice */}
                <div className="flex items-start gap-2 bg-[#F5F3FF] border border-[#7c3aed]/20 rounded-lg px-4 py-3">
                  <span className="text-base mt-0.5">📌</span>
                  <p className="text-xs text-[#5B21B6] leading-relaxed">
                    인플릭스가 연락하고 2~5일 내에 결과를 알려드릴게요
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={matchSubmitting}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#e94560] text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {matchSubmitting ? "전송 중..." : "매칭 요청 보내기"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ─── One-liner summary ──────────────────────────────────── */}
        <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4 mb-6">
          <p className="text-sm text-foreground">
            💡 {getOneLinerSummary(profile.avgEngagementRate, aqs?.totalScore ?? null, igrScore?.totalScore ?? null)}
          </p>
        </div>

        {/* ─── Grid layout ────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Row 1: Engagement + Recent Posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Engagement Rate */}
            <div className={`bg-card border border-border rounded-2xl p-6`}>
              <h2 className="text-base font-semibold text-foreground mb-5 flex items-center">
                참여율 (Engagement Rate)
                <InfoTooltip text="게시물에 반응(좋아요+댓글)한 비율이에요. 숫자가 높을수록 팔로워와 소통이 활발해요." />
              </h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-7 h-7 text-brand-purple"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div>
                  {profile.avgEngagementRate != null ? (
                    <>
                      <p className="text-3xl font-bold text-foreground">
                        {profile.avgEngagementRate.toFixed(2)}%{" "}
                        <span className="text-base font-normal" style={{ color: getErGrade(profile.avgEngagementRate).color }}>
                          {getErGrade(profile.avgEngagementRate).emoji} {getErGrade(profile.avgEngagementRate).label}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        평균 참여율
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        카테고리 평균 {categoryAvg.er.toFixed(1)}% 대비{" "}
                        <span className="font-semibold text-foreground">
                          {(profile.avgEngagementRate / categoryAvg.er).toFixed(1)}배
                        </span>
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-3xl font-bold text-foreground">
                        <MaskedValue value={null} width="72px" className="text-3xl font-bold" />
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        평균 참여율
                      </p>
                    </>
                  )}
                </div>
              </div>
              {!isAuthed && (
                <p className="mt-4 text-xs text-muted-foreground">
                  실제 참여율 데이터는 로그인 후 확인 가능합니다
                </p>
              )}
            </div>

            {/* Recent Posts */}
            <Section title="최근 게시물">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {profile.mediaSnapshots.map((post, idx) => {
                  const postCard = (
                    <a
                      key={post.id}
                      href={post.permalink ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative aspect-square bg-background border border-border rounded-xl overflow-hidden block"
                    >
                      {post.thumbnailUrl ? (
                        <img
                          src={post.thumbnailUrl}
                          alt="post"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white text-xs">
                        <span className="flex items-center gap-1">
                          ♥{" "}
                          <MaskedValue
                            value={post.likeCount}
                            width="28px"
                            className="text-xs"
                          />
                        </span>
                        <span className="flex items-center gap-1">
                          💬{" "}
                          <MaskedValue
                            value={post.commentsCount}
                            width="28px"
                            className="text-xs"
                          />
                        </span>
                      </div>
                    </a>
                  );

                  if (idx >= 3 && !isAuthed) {
                    return (
                      <BlurOverlay
                        key={post.id}
                        className="aspect-square rounded-xl"
                        blurIntensity={5}
                      >
                        {postCard}
                      </BlurOverlay>
                    );
                  }
                  return postCard;
                })}
              </div>
            </Section>
          </div>

          {/* Row 2: Audience Analysis */}
          <BlurOverlay
            className="rounded-2xl"
            ctaText="오디언스 분석 보기"
            ctaLink="/register"
          >
            <Section title="오디언스 분석">
              {loadingAudience ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-48 bg-border/40 rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground mb-3 text-center">
                      성별 분포
                    </p>
                    <DonutChart data={genderData} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-3 text-center">
                      연령대 분포
                    </p>
                    <BarChartComponent data={ageData} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-3 text-center">
                      주요 도시
                    </p>
                    <BarChartComponent
                      data={cityData}
                      gradientFrom="#e94560"
                      gradientTo="#7c3aed"
                    />
                  </div>
                </div>
              )}
            </Section>
          </BlurOverlay>

          {/* Row 3: AQS + IGR Score */}
          <BlurOverlay
            className="rounded-2xl"
            ctaText="AQS / IGR 점수 전체 보기"
            ctaLink="/register"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* AQS Card */}
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
                  <h3 className="text-base font-semibold text-foreground mb-1 flex items-center">
                    AQS 점수 (계정 품질 지수)
                    <InfoTooltip text="팔로워가 진짜인지 평가한 점수예요. 100에 가까울수록 가짜 팔로워가 적어요." />
                  </h3>
                  <p className="text-sm text-[#6B7280] mb-4">팔로워가 진짜인가?</p>
                  {aqs ? (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-14 h-14 rounded-full border-4 flex items-center justify-center flex-shrink-0"
                          style={{ borderColor: getAqsColor(aqs.totalScore), backgroundColor: getAqsColor(aqs.totalScore) + "18" }}
                        >
                          <span className="text-2xl font-bold" style={{ color: getAqsColor(aqs.totalScore) }}>
                            {getAqsEmoji(aqs.totalScore)}
                          </span>
                        </div>
                        <div>
                          <p className="text-xl font-bold text-foreground">
                            <MaskedValue value={aqs.totalScore} width="40px" className="text-xl font-bold" />
                            {" "}<span className="text-sm font-normal text-muted-foreground">/ 100</span>
                          </p>
                          <Badge variant={aqs.totalScore >= 90 ? "success" : aqs.totalScore >= 70 ? "warning" : "danger"} size="md">
                            {getAqsLabel(aqs.totalScore)}
                          </Badge>
                        </div>
                      </div>
                      <AqsRadarChart data={[
                        { subject: "참여 품질", score: aqs.engagementQuality, fullMark: 100 },
                        { subject: "성장 패턴", score: aqs.growthPattern, fullMark: 100 },
                        { subject: "비율 분석", score: aqs.ratioAnalysis, fullMark: 100 },
                        { subject: "콘텐츠 일관성", score: aqs.contentConsistency, fullMark: 100 },
                        { subject: "댓글 진성성", score: aqs.commentAuthenticity, fullMark: 100 },
                      ]} />
                      <p className="text-xs text-[#6B7280] mt-2">
                        카테고리 평균 {categoryAvg.aqs}점 대비{" "}
                        <span className="font-semibold" style={{ color: aqs.totalScore >= categoryAvg.aqs ? "#22c55e" : "#ef4444" }}>
                          {aqs.totalScore >= categoryAvg.aqs ? "높음" : "낮음"}
                        </span>
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">AQS 데이터를 불러오는 중입니다</p>
                  )}
                </div>

                {/* IGR Card */}
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6">
                  <h3 className="text-base font-semibold text-foreground mb-1 flex items-center">
                    IGR 등급 (알고리즘 노출 지수)
                    <InfoTooltip text="Instagram 알고리즘이 이 계정을 얼마나 밀어주는지 평가한 등급이에요. S/A/B/C/D로 나뉩니다." />
                  </h3>
                  <p className="text-sm text-[#6B7280] mb-4">알고리즘이 밀어주는가?</p>
                  {igrScore ? (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-14 h-14 rounded-full border-4 flex items-center justify-center flex-shrink-0"
                          style={{ borderColor: getIgrColor(igrScore.totalScore), backgroundColor: getIgrColor(igrScore.totalScore) + "18" }}
                        >
                          <span className="text-lg font-bold" style={{ color: getIgrColor(igrScore.totalScore) }}>
                            {igrScore.grade}
                          </span>
                        </div>
                        <div>
                          <p className="text-xl font-bold text-foreground">
                            {igrScore.totalScore}
                            {" "}<span className="text-sm font-normal text-muted-foreground">/ 100</span>
                          </p>
                          <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: getIgrColor(igrScore.totalScore) + "20", color: getIgrColor(igrScore.totalScore) }}>
                            {igrScore.label}
                          </span>
                        </div>
                      </div>
                      <AqsRadarChart data={[
                        { subject: "릴스 성과", score: igrScore.reelsPerformance, fullMark: 100 },
                        { subject: "참여 품질", score: igrScore.engagementQuality, fullMark: 100 },
                        { subject: "콘텐츠 전략", score: igrScore.contentStrategy, fullMark: 100 },
                        { subject: "성장 모멘텀", score: igrScore.growthMomentum, fullMark: 100 },
                      ]} />
                      <p className="text-xs text-[#6B7280] mt-2">{igrScore.description}</p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">IGR 데이터를 불러오는 중입니다</p>
                  )}
                </div>
              </div>

              {/* Brand explanation */}
              <div className="bg-[#F9FAFB] rounded-xl p-4">
                <p className="text-sm font-medium text-[#111827] mb-1">브랜드에게 이게 중요한 이유:</p>
                <p className="text-xs text-[#6B7280]">AQS가 높으면 → 진짜 사람에게 도달 | IGR이 높으면 → 더 많은 사람에게 노출</p>
              </div>
            </div>
          </BlurOverlay>

          {/* Row 4: Fake Follower Detection */}
          <BlurOverlay
            className="rounded-2xl"
            ctaText="가짜 팔로워 분석 보기"
            ctaLink="/register"
          >
            <Section title="가짜 팔로워 탐지">
              {aqs ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {fakeFollowerSignals.map((signal) => (
                    <div
                      key={signal.label}
                      className="flex items-center gap-4 p-4 rounded-xl border transition-colors"
                      style={{
                        borderColor: signal.detected
                          ? "#ef444433"
                          : "#22c55e33",
                        backgroundColor: signal.detected
                          ? "#ef444410"
                          : "#22c55e10",
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg"
                        style={{
                          backgroundColor: signal.detected
                            ? "#ef444420"
                            : "#22c55e20",
                        }}
                      >
                        {signal.detected ? "⚠️" : "✅"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {signal.label}
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{
                            color: signal.detected ? "#ef4444" : "#22c55e",
                          }}
                        >
                          {signal.detected ? "이상 감지됨" : "정상"}
                          {" · "}점수 {signal.score}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  분석 데이터 없음
                </p>
              )}
            </Section>
          </BlurOverlay>

          {/* Row 5: AI Price Prediction */}
          <BlurOverlay
            className="rounded-2xl"
            ctaText="예상 단가 확인하기"
            ctaLink="/register"
          >
            <Section title="AI 단가 예측">
              {(() => {
                const fc = profile.followersCount;
                const baseFee =
                  selectedContentType === "FEED"
                    ? (fc / 1000) * 10000
                    : selectedContentType === "REEL"
                    ? (fc / 1000) * 6000
                    : (fc / 1000) * 5000;
                const minFee = Math.round(baseFee * 0.7);
                const maxFee = Math.round(baseFee * 1.5);

                const tierLabel =
                  fc >= 1_000_000
                    ? { label: "메가(1M+)", feed: "800만원~", reel: "1,000만원~" }
                    : fc >= 500_000
                    ? { label: "매크로(500K~1M)", feed: "300~800만원", reel: "500~1,000만원" }
                    : fc >= 100_000
                    ? { label: "미드티어(100K~500K)", feed: "100~300만원", reel: "200~500만원" }
                    : fc >= 10_000
                    ? { label: "마이크로(10K~100K)", feed: "30~100만원", reel: "50~200만원" }
                    : { label: "나노(1K~10K)", feed: "5~30만원", reel: "10~50만원" };

                return (
                  <div className="space-y-4">
                    {/* Content type tabs */}
                    <div className="flex gap-2">
                      {(["FEED", "REEL", "STORY"] as const).map((type) => {
                        const label = type === "FEED" ? "피드" : type === "REEL" ? "릴스" : "스토리";
                        return (
                          <button
                            key={type}
                            onClick={() => setSelectedContentType(type)}
                            className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                              selectedContentType === type
                                ? "bg-violet-600 text-white border-violet-600"
                                : "bg-background text-muted-foreground border-border hover:border-violet-400"
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      {/* Gauge */}
                      <div>
                        <GaugeChart
                          value={baseFee}
                          min={0}
                          max={Math.max(maxFee * 1.2, 1000000)}
                          label="예상 평균 단가"
                          unit="원"
                        />
                      </div>
                      {/* Stats */}
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-background border border-border">
                          <p className="text-xs text-muted-foreground mb-1">예상 단가</p>
                          <p className="text-lg font-bold text-foreground">
                            <MaskedValue
                              value={`${formatWon(minFee)}원 ~ ${formatWon(maxFee)}원`}
                              width="120px"
                              className="text-lg font-bold"
                            />
                          </p>
                        </div>

                        {/* Tier market range */}
                        <div className="p-3 rounded-xl bg-background border border-border text-sm">
                          <p className="text-xs text-muted-foreground mb-1">업계 시장 범위 · {tierLabel.label}</p>
                          <p className="text-foreground font-medium">
                            피드 {tierLabel.feed} &nbsp;/&nbsp; 릴스 {tierLabel.reel}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Disclaimer */}
                    <p className="text-[11px] text-[#9CA3AF] italic mt-2">
                      이 금액은 업계 평균 기준의 추정치입니다. 실제 광고비는 카테고리, 콘텐츠 유형, 독점권, 캠페인 조건에 따라 달라질 수 있습니다.
                    </p>
                  </div>
                );
              })()}
            </Section>
          </BlurOverlay>

          {/* Row 6: Follower Growth Chart */}
          <BlurOverlay
            className="rounded-2xl"
            ctaText="팔로워 성장 추이 보기"
            ctaLink="/register"
          >
            <Section title="팔로워 성장 추이">
              <LineChartComponent
                data={historyData}
                color="#7c3aed"
                showArea
                label="월별 팔로워 수"
              />
            </Section>
          </BlurOverlay>
        </div>
      </main>

      <Footer />
    </div>
  );
}
