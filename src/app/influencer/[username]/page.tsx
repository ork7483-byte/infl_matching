"use client";

import { useState, useEffect } from "react";
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

export default function InfluencerProfilePage() {
  const params = useParams<{ username: string }>();
  const username = params?.username ?? "";
  const { data: session } = useSession();
  const isAuthed = !!session;

  const [profile, setProfile] = useState<InfluencerProfile | null>(null);
  const [audience, setAudience] = useState<AudienceData | null>(null);
  const [followerHistory, setFollowerHistory] = useState<FollowerHistoryPoint[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingAudience, setLoadingAudience] = useState(false);
  const [notFound, setNotFound] = useState(false);

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
        const data = await res.json();
        setProfile(data);
      })
      .catch(console.error)
      .finally(() => setLoadingProfile(false));
  }, [username]);

  // Fetch audience data
  useEffect(() => {
    if (!username) return;
    setLoadingAudience(true);
    fetch(`/api/influencers/${username}/audience`)
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        setAudience(data);
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
  const price = profile.pricePrediction;

  // Radar chart data
  const radarData = aqs
    ? [
        { subject: "참여 품질", score: aqs.engagementQuality, fullMark: 100 },
        { subject: "성장 패턴", score: aqs.growthPattern, fullMark: 100 },
        { subject: "비율 분석", score: aqs.ratioAnalysis, fullMark: 100 },
        { subject: "콘텐츠 일관성", score: aqs.contentConsistency, fullMark: 100 },
        { subject: "댓글 진성성", score: aqs.commentAuthenticity, fullMark: 100 },
      ]
    : [];

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
                <div className="flex flex-wrap gap-1.5">
                  {profile.categories.map((cat) => (
                    <Badge key={cat} variant="purple">
                      {cat}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── Grid layout ────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Row 1: Engagement + Recent Posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Engagement Rate */}
            <Section title="참여율 (Engagement Rate)">
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
                  <p className="text-3xl font-bold text-foreground">
                    <MaskedValue
                      value={
                        profile.avgEngagementRate != null
                          ? `${profile.avgEngagementRate.toFixed(2)}%`
                          : null
                      }
                      width="72px"
                      className="text-3xl font-bold"
                    />
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    평균 참여율
                  </p>
                </div>
              </div>
              {!isAuthed && (
                <p className="mt-4 text-xs text-muted-foreground">
                  실제 참여율 데이터는 로그인 후 확인 가능합니다
                </p>
              )}
            </Section>

            {/* Recent Posts */}
            <Section title="최근 게시물">
              <div className="grid grid-cols-3 gap-2">
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

          {/* Row 3: AQS Score */}
          <BlurOverlay
            className="rounded-2xl"
            ctaText="AQS 점수 전체 보기"
            ctaLink="/register"
          >
            <Section title="AQS 점수 (계정 품질 지수)">
              {aqs ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  {/* Grade + score */}
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div
                      className="w-20 h-20 rounded-full border-4 flex items-center justify-center"
                      style={{
                        borderColor: getAqsColor(aqs.totalScore),
                        backgroundColor: getAqsColor(aqs.totalScore) + "18",
                      }}
                    >
                      <span className="text-3xl font-bold" style={{ color: getAqsColor(aqs.totalScore) }}>
                        {getAqsEmoji(aqs.totalScore)}
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">
                        <MaskedValue
                          value={aqs.totalScore}
                          width="48px"
                          className="text-2xl font-bold"
                        />{" "}
                        <span className="text-base font-normal text-muted-foreground">
                          / 100
                        </span>
                      </p>
                      <Badge
                        variant={
                          aqs.totalScore >= 90
                            ? "success"
                            : aqs.totalScore >= 70
                            ? "warning"
                            : "danger"
                        }
                        size="md"
                      >
                        {getAqsLabel(aqs.totalScore)}
                      </Badge>
                    </div>
                  </div>
                  {/* Radar chart */}
                  <AqsRadarChart data={radarData} />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  AQS 데이터를 불러오는 중입니다
                </p>
              )}
            </Section>
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
              {price ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  {/* Gauge */}
                  <div>
                    <GaugeChart
                      value={(price.minPrice + price.maxPrice) / 2}
                      min={0}
                      max={Math.max(price.maxPrice * 1.2, 1000000)}
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
                          value={`${price.minPrice.toLocaleString()}원 ~ ${price.maxPrice.toLocaleString()}원`}
                          width="120px"
                          className="text-lg font-bold"
                        />
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 rounded-xl bg-background border border-border text-center">
                        <p className="text-xs text-muted-foreground mb-1">예상 도달</p>
                        <p className="text-sm font-semibold text-foreground">
                          <MaskedValue
                            value={
                              price.predictedReach != null
                                ? formatFollowers(price.predictedReach)
                                : null
                            }
                            width="40px"
                          />
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-background border border-border text-center">
                        <p className="text-xs text-muted-foreground mb-1">CPR</p>
                        <p className="text-sm font-semibold text-foreground">
                          <MaskedValue
                            value={
                              price.cpr != null
                                ? `${price.cpr.toFixed(1)}원`
                                : null
                            }
                            width="40px"
                          />
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-background border border-border text-center">
                        <p className="text-xs text-muted-foreground mb-1">CPE</p>
                        <p className="text-sm font-semibold text-foreground">
                          <MaskedValue
                            value={
                              price.cpe != null
                                ? `${price.cpe.toFixed(1)}원`
                                : null
                            }
                            width="40px"
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  예측 데이터를 준비 중입니다
                </p>
              )}
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
