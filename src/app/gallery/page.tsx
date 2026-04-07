"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GalleryCard, { type GalleryItem } from "@/components/gallery/GalleryCard";
import ContentDetailModal from "@/components/gallery/ContentDetailModal";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GalleryResponse {
  results: GalleryItem[];
  items?: GalleryItem[];
  total: number;
  page: number;
  limit?: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = ["전체", "뷰티", "패션", "푸드", "라이프스타일", "테크", "피트니스"];
const CONTENT_TYPES = [
  { label: "전체", value: "all" },
  { label: "피드", value: "feed" },
  { label: "릴스", value: "reel" },
  { label: "스토리", value: "story" },
];
const SORT_OPTIONS = [
  { label: "최신순", value: "latest" },
  { label: "도달 높은순", value: "reach" },
  { label: "참여율 높은순", value: "engagement" },
  { label: "좋아요순", value: "likes" },
];
const LIMIT = 20;

// ─── Skeleton ────────────────────────────────────────────────────────────────

function GalleryCardSkeleton() {
  return (
    <div className="break-inside-avoid mb-4 animate-pulse">
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="aspect-[4/5] bg-border w-full" />
        <div className="p-3 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-border flex-shrink-0" />
            <div className="flex-1 h-3 bg-border rounded" />
            <div className="w-12 h-4 bg-border rounded-full" />
          </div>
          <div className="h-3 bg-border rounded w-3/4" />
          <div className="flex gap-2 pt-1 border-t border-border">
            <div className="h-3 bg-border rounded w-16" />
            <div className="h-3 bg-border rounded w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mock data generator (for demo when API is not ready) ─────────────────────

function generateMockItems(page: number, category: string, type: string): GalleryItem[] {
  const categories = ["뷰티", "패션", "푸드", "라이프스타일", "테크", "피트니스"];
  const types: GalleryItem["type"][] = ["feed", "reel", "story"];
  const usernames = ["jiyeon.beauty", "fashionista_kr", "foodie.seoul", "lifestyle.kr", "tech.review", "fitlife.kr", "beauty.queen", "style.icon"];

  // Placeholder images with different aspect ratios for visual variety
  const placeholderImages = [
    "https://picsum.photos/seed/g1/400/500",
    "https://picsum.photos/seed/g2/400/711",
    "https://picsum.photos/seed/g3/400/400",
    "https://picsum.photos/seed/g4/400/600",
    "https://picsum.photos/seed/g5/400/500",
    "https://picsum.photos/seed/g6/400/711",
    "https://picsum.photos/seed/g7/400/500",
    "https://picsum.photos/seed/g8/400/400",
    "https://picsum.photos/seed/g9/400/600",
    "https://picsum.photos/seed/g10/400/500",
    "https://picsum.photos/seed/g11/400/711",
    "https://picsum.photos/seed/g12/400/500",
    "https://picsum.photos/seed/g13/400/400",
    "https://picsum.photos/seed/g14/400/600",
    "https://picsum.photos/seed/g15/400/500",
    "https://picsum.photos/seed/g16/400/711",
    "https://picsum.photos/seed/g17/400/500",
    "https://picsum.photos/seed/g18/400/400",
    "https://picsum.photos/seed/g19/400/600",
    "https://picsum.photos/seed/g20/400/500",
  ];

  return Array.from({ length: LIMIT }, (_, i) => {
    const idx = (page - 1) * LIMIT + i;
    const cat = category === "전체" ? categories[idx % categories.length] : category;
    const contentType = type === "all" ? types[idx % types.length] : (type as GalleryItem["type"]);
    const username = usernames[idx % usernames.length];
    const isVid = contentType === "reel";

    return {
      id: `item-${idx}`,
      type: contentType,
      imageUrl: placeholderImages[i % placeholderImages.length],
      isVideo: isVid,
      username,
      profilePicUrl: `https://i.pravatar.cc/64?img=${(idx % 70) + 1}`,
      category: cat,
      campaignName: idx % 3 === 0 ? `${cat} 캠페인 ${idx + 1}` : undefined,
      brandName: idx % 3 === 0 ? `브랜드 ${String.fromCharCode(65 + (idx % 26))}` : undefined,
      likesCount: Math.floor(Math.random() * 10000) + 500,
      commentsCount: Math.floor(Math.random() * 500) + 20,
      reach: Math.floor(Math.random() * 50000) + 5000,
      engagementRate: Math.random() * 8 + 1,
      caption: idx % 4 !== 0 ? `${cat} 관련 콘텐츠입니다. 이 캠페인에서 많은 관심을 받았어요. 여러분도 한번 확인해보세요! #${cat} #인플루언서 #콘텐츠` : undefined,
    };
  });
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────

function CTABanner() {
  return (
    <div className="break-inside-avoid mb-4">
      <div className="bg-[#F5F3FF] border border-brand-purple/30 rounded-2xl p-5 text-center">
        <div className="text-2xl mb-2">🔓</div>
        <p className="text-sm font-semibold text-foreground mb-1">
          성과 데이터와 함께 콘텐츠를 분석하세요
        </p>
        <Link
          href="/signup"
          className="inline-block mt-3 px-5 py-2.5 rounded-xl bg-gradient-brand text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-glow"
        >
          무료 회원가입으로 전체 데이터 보기
        </Link>
        <div className="flex items-center justify-center gap-3 mt-3 text-xs text-muted-foreground flex-wrap">
          <span>✓ 도달/임프레션</span>
          <span>✓ 참여율</span>
          <span>✓ 크리에이터 제안하기</span>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GalleryPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <GalleryPage />
    </Suspense>
  );
}

function GalleryPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Tab state
  const [galleryTab, setGalleryTab] = useState<"real" | "ai">(
    searchParams.get("tab") === "ai" ? "ai" : "real"
  );

  // Filter state from URL
  const [category, setCategory] = useState(searchParams.get("category") ?? "전체");
  const [contentType, setContentType] = useState(searchParams.get("type") ?? "all");
  const [sort, setSort] = useState(searchParams.get("sort") ?? "latest");

  // Data state
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Modal state
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  // Intersection observer for infinite scroll
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Sync filters to URL
  const syncUrl = useCallback(
    (cat: string, type: string, s: string) => {
      const params = new URLSearchParams();
      if (cat !== "전체") params.set("category", cat);
      if (type !== "all") params.set("type", type);
      if (s !== "latest") params.set("sort", s);
      const qs = params.toString();
      router.replace(`/gallery${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router]
  );

  const fetchItems = useCallback(
    async (nextPage: number, reset: boolean) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category !== "전체") params.set("category", category);
        if (contentType !== "all") params.set("type", contentType);
        params.set("sort", sort);
        params.set("page", String(nextPage));
        params.set("limit", String(LIMIT));

        let data: GalleryResponse;
        try {
          const res = await fetch(`/api/gallery?${params.toString()}`);
          if (!res.ok) throw new Error("API not ready");
          data = await res.json();
        } catch {
          // Fallback to mock data
          const mockItems = generateMockItems(nextPage, category, contentType);
          data = {
            results: mockItems,
            total: 1200,
            page: nextPage,
          };
        }

        // Normalize API results to match GalleryItem interface
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const rawItems = (data.results || data.items || []).map((item: any) => ({
          ...item,
          imageUrl: item.imageUrl || item.mediaUrl || item.thumbnailUrl || "",
          username: item.username || item.influencer?.username || "",
          profilePicUrl: item.profilePicUrl ?? item.influencer?.profilePicUrl ?? null,
          likesCount: item.likesCount ?? item.likeCount ?? 0,
          commentsCount: item.commentsCount ?? 0,
          type: item.type || (item.mediaType === "REEL" ? "reel" : item.mediaType === "STORY" ? "story" : "feed"),
          isVideo: item.isVideo ?? (item.mediaType === "VIDEO" || item.mediaType === "REEL"),
          category: item.category || "",
        })) as GalleryItem[];

        if (reset) {
          setItems(rawItems);
        } else {
          setItems((prev) => [...prev, ...rawItems]);
        }
        setTotal(data.total ?? 0);
        setPage(nextPage);
        setHasMore(rawItems.length === LIMIT);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [category, contentType, sort]
  );

  // Initial load + filter change
  useEffect(() => {
    setPage(1);
    fetchItems(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, contentType, sort]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          fetchItems(page + 1, false);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loading, hasMore, page, fetchItems]);

  // URL sync for modal
  useEffect(() => {
    if (selectedItem) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("content", selectedItem.id);
      router.replace(`/gallery?${params.toString()}`, { scroll: false });
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("content");
      router.replace(`/gallery${params.toString() ? `?${params.toString()}` : ""}`, {
        scroll: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem]);

  const handleFilterChange = (cat: string, type: string, s: string) => {
    setCategory(cat);
    setContentType(type);
    setSort(s);
    syncUrl(cat, type, s);
  };

  const openModal = (item: GalleryItem, index: number) => {
    setSelectedItem(item);
    setSelectedIndex(index);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setSelectedIndex(-1);
  };

  const handlePrev = () => {
    if (selectedIndex > 0) {
      const newIdx = selectedIndex - 1;
      setSelectedItem(items[newIdx]);
      setSelectedIndex(newIdx);
    }
  };

  const handleNext = () => {
    if (selectedIndex < items.length - 1) {
      const newIdx = selectedIndex + 1;
      setSelectedItem(items[newIdx]);
      setSelectedIndex(newIdx);
    }
  };

  const relatedItems = selectedItem
    ? items.filter((it) => it.username === selectedItem.username && it.id !== selectedItem.id).slice(0, 8)
    : [];

  // Build masonry items with CTA banner injected after index 11
  const masonryItems: Array<{ type: "card"; item: GalleryItem; index: number } | { type: "cta" }> = [];
  items.forEach((item, idx) => {
    if (idx === 12 && !session) {
      masonryItems.push({ type: "cta" });
    }
    masonryItems.push({ type: "card", item, index: idx });
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* ─── Hero ──────────────────────────────────────────────── */}
        <section className="relative py-12 sm:py-16 overflow-hidden">
          {/* Purple gradient mesh background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-80 h-80 bg-brand-purple/10 rounded-full blur-3xl" />
            <div className="absolute top-0 right-1/4 w-64 h-64 bg-brand-pink/8 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple-light text-xs font-medium mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-pulse" />
              1,200+개의 검증된 캠페인 콘텐츠
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
              실제 캠페인에서 탄생한{" "}
              <span className="bg-gradient-brand bg-clip-text text-transparent">
                콘텐츠
              </span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
              성과 데이터와 함께 확인하세요
            </p>
          </div>
        </section>

        {/* ─── Tab Switcher ──────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="flex border-b border-[#E5E7EB]">
            <button
              onClick={() => { setGalleryTab("real"); router.replace("/gallery?tab=real", { scroll: false }); }}
              className={`flex-1 sm:flex-none px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                galleryTab === "real"
                  ? "border-[#7c3aed] text-[#7c3aed]"
                  : "border-transparent text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              👤 실제 인플루언서
            </button>
            <button
              onClick={() => { setGalleryTab("ai"); router.replace("/gallery?tab=ai", { scroll: false }); }}
              className={`flex-1 sm:flex-none px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                galleryTab === "ai"
                  ? "border-[#7c3aed] text-[#7c3aed]"
                  : "border-transparent text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              🤖 AI 콘텐츠
            </button>
          </div>
        </div>

        {galleryTab === "real" ? (<>
        {/* ─── Filter Bar ────────────────────────────────────────── */}
        <div className="sticky top-16 z-30 bg-background/90 backdrop-blur-xl border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category tabs */}
            <div className="flex items-center gap-0 overflow-x-auto no-scrollbar border-b border-border/50">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleFilterChange(cat, contentType, sort)}
                  className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-150 min-h-[44px] cursor-pointer ${
                    category === cat
                      ? "border-brand-purple text-brand-purple-light"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Type chips + sort */}
            <div className="flex items-center justify-between gap-4 py-3">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {CONTENT_TYPES.map((ct) => (
                  <button
                    key={ct.value}
                    onClick={() => handleFilterChange(category, ct.value, sort)}
                    className={`flex-shrink-0 px-3 py-2 rounded-full text-xs font-medium border transition-colors duration-150 min-h-[36px] cursor-pointer ${
                      contentType === ct.value
                        ? "bg-brand-purple/20 border-brand-purple/40 text-brand-purple-light"
                        : "bg-card border-border text-muted-foreground hover:border-border-light hover:text-foreground"
                    }`}
                  >
                    {ct.label}
                  </button>
                ))}
              </div>

              <select
                value={sort}
                onChange={(e) => handleFilterChange(category, contentType, e.target.value)}
                className="flex-shrink-0 bg-card border border-border rounded-lg px-3 py-2 text-base text-foreground focus:outline-none focus:border-brand-purple/60 transition-colors cursor-pointer appearance-none min-h-[40px]"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ─── Masonry Grid ──────────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Result count */}
          <p className="text-sm text-muted-foreground mb-6">
            총 <span className="text-foreground font-semibold">{(total || 0).toLocaleString()}</span>개의 콘텐츠
          </p>

          {/* Masonry columns via CSS column-count */}
          <div
            className="columns-2 sm:columns-3 lg:columns-4 gap-4"
            style={{ columnGap: "16px" }}
          >
            {loading && items.length === 0
              ? Array.from({ length: LIMIT }).map((_, i) => (
                  <GalleryCardSkeleton key={i} />
                ))
              : masonryItems.map((entry) =>
                  entry.type === "cta" ? (
                    <CTABanner key="cta" />
                  ) : (
                    <GalleryCard
                      key={entry.item.id}
                      item={entry.item}
                      onClick={() => openModal(entry.item, entry.index)}
                    />
                  )
                )}

            {/* Loading skeletons for append */}
            {loading && items.length > 0 &&
              Array.from({ length: 4 }).map((_, i) => (
                <GalleryCardSkeleton key={`skeleton-append-${i}`} />
              ))}
          </div>

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="h-8 mt-4" />

          {/* No more results indicator */}
          {!loading && !hasMore && items.length > 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">
              모든 콘텐츠를 확인했어요
            </p>
          )}

          {/* Empty state */}
          {!loading && items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-foreground font-semibold mb-1">콘텐츠가 없습니다</p>
              <p className="text-sm text-muted-foreground">필터를 조정해 다시 시도해보세요</p>
            </div>
          )}
        </div>
        </>) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {["전체", "제품촬영", "라이프스타일", "패션", "뷰티", "푸드"].map(cat => (
              <button key={cat} className="px-4 py-2 rounded-full border border-[#E5E7EB] text-sm text-[#6B7280] hover:border-[#7c3aed] cursor-pointer">{cat}</button>
            ))}
          </div>

          {/* AI Content Masonry */}
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4">
            {Array.from({length: 16}, (_, i) => {
              const models = ["수아","하은","지유","서연","미나","예진","지호","민준","현우","태윤","준서","도윤"];
              const types = ["제품촬영","라이프스타일","패션","뷰티","SNS","스포츠"];
              const model = models[i % models.length];
              const type = types[i % types.length];
              const isReel = i % 4 === 0;
              return (
                <Link key={i} href={`/ai-studio/generate?model=${model}`} className="break-inside-avoid mb-4 block group cursor-pointer">
                  <div className="relative bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:shadow-md transition-all">
                    <div className={`relative ${isReel ? "aspect-[9/16]" : "aspect-[4/5]"} bg-[#F3F4F6]`}>
                      <img src={`https://picsum.photos/seed/ai-content-${i}/400/${isReel ? 711 : 500}`} alt="" className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 px-2 py-1 bg-blue-500/90 text-white text-xs rounded-full">🤖 AI Generated</span>
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm font-medium">이 스타일로 만들기 →</span>
                      </div>
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-medium text-[#111827]">🤖 {model}</p>
                      <p className="text-[10px] text-[#6B7280]">{type}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <Link href="/ai-studio" className="inline-block px-8 py-3 bg-[#7c3aed] text-white font-semibold rounded-xl hover:opacity-90 cursor-pointer">
              AI Studio에서 직접 만들어보기 →
            </Link>
          </div>
        </div>
        )}
      </main>

      <Footer />

      {/* Content Detail Modal */}
      {selectedItem && (
        <ContentDetailModal
          item={selectedItem}
          onClose={closeModal}
          onPrev={selectedIndex > 0 ? handlePrev : undefined}
          onNext={selectedIndex < items.length - 1 ? handleNext : undefined}
          relatedItems={relatedItems}
        />
      )}
    </div>
  );
}
