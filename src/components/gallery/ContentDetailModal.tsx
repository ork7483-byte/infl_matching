"use client";

import { useEffect, useCallback, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import MaskedValue from "@/components/MaskedValue";
import Badge from "@/components/ui/Badge";
import type { GalleryItem } from "./GalleryCard";

interface ContentDetailModalProps {
  item: GalleryItem | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  relatedItems?: GalleryItem[];
}

export default function ContentDetailModal({
  item,
  onClose,
  onPrev,
  onNext,
  relatedItems = [],
}: ContentDetailModalProps) {
  const { data: session } = useSession();
  const [captionExpanded, setCaptionExpanded] = useState(false);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  // Reset caption expanded state on item change
  useEffect(() => {
    setCaptionExpanded(false);
  }, [item?.id]);

  if (!item) return null;

  const isReel = item.type === "reel";
  const captionTruncated =
    item.caption && item.caption.length > 120 && !captionExpanded;
  const displayCaption = captionTruncated
    ? item.caption!.slice(0, 120) + "..."
    : item.caption;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal container */}
      <div className="relative z-10 w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90vh] bg-white border-0 sm:border border-[#E5E7EB] sm:rounded-2xl overflow-hidden flex flex-col sm:flex-row shadow-2xl">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
          aria-label="닫기"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Prev button */}
        {onPrev && (
          <button
            onClick={onPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors hidden sm:flex"
            aria-label="이전"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Next button */}
        {onNext && (
          <button
            onClick={onNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors hidden sm:flex"
            aria-label="다음"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* ─── Left: Image/Video ─────────────────────────── */}
        <div className="w-full sm:w-[60%] flex-shrink-0 bg-black flex items-center justify-center overflow-hidden">
          <div
            className={`relative w-full overflow-hidden ${
              isReel ? "aspect-[9/16] max-h-[50vh] sm:max-h-[90vh]" : "aspect-[4/5] max-h-[50vh] sm:max-h-[90vh]"
            }`}
          >
            <img
              src={item.imageUrl}
              alt={`${item.username}의 콘텐츠`}
              className="w-full h-full object-contain"
            />
            {item.isVideo && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ─── Right: Info ───────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-y-auto max-h-[50vh] sm:max-h-[90vh]">
          <div className="p-5 space-y-5">
            {/* Profile */}
            <div className="flex items-start gap-3">
              {item.profilePicUrl ? (
                <img
                  src={item.profilePicUrl}
                  alt={item.username}
                  className="w-12 h-12 rounded-full object-cover border border-border flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold flex-shrink-0">
                  {item.username[0]?.toUpperCase() ?? "?"}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">
                  @{item.username}
                </p>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="purple" size="sm">{item.category}</Badge>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#F3F4F6] border border-[#E5E7EB] text-[#6B7280]">
                    {item.type === "reel" ? "릴스" : item.type === "story" ? "스토리" : "피드"}
                  </span>
                </div>
              </div>
            </div>

            {/* Campaign info */}
            {(item.campaignName || item.brandName) && (
              <div className="bg-[#F9FAFB] rounded-xl p-3 border border-[#E5E7EB]">
                {item.campaignName && (
                  <p className="text-sm font-semibold text-foreground">
                    {item.campaignName}
                  </p>
                )}
                {item.brandName && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.brandName}
                  </p>
                )}
              </div>
            )}

            {/* Performance metrics */}
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                성과 지표
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <MetricCell icon="❤️" label="좋아요" value={item.likesCount.toLocaleString()} />
                <MetricCell icon="💬" label="댓글" value={item.commentsCount.toLocaleString()} />
                <MetricCell
                  icon="👁"
                  label="도달"
                  value={
                    <MaskedValue
                      value={item.reach?.toLocaleString() ?? null}
                      width="48px"
                      className="text-foreground font-semibold text-sm"
                    />
                  }
                />
                <MetricCell
                  icon="📊"
                  label="참여율"
                  value={
                    <MaskedValue
                      value={item.engagementRate != null ? `${item.engagementRate.toFixed(2)}%` : null}
                      width="48px"
                      className="text-foreground font-semibold text-sm"
                    />
                  }
                />
                <MetricCell
                  icon="💾"
                  label="저장"
                  value={<MaskedValue value={null} width="48px" className="text-foreground font-semibold text-sm" />}
                />
                <MetricCell
                  icon="👀"
                  label="임프레션"
                  value={<MaskedValue value={null} width="48px" className="text-foreground font-semibold text-sm" />}
                />
              </div>
            </div>

            {/* Caption */}
            {item.caption && (
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  캡션
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {displayCaption}
                </p>
                {item.caption.length > 120 && (
                  <button
                    onClick={() => setCaptionExpanded(!captionExpanded)}
                    className="text-xs text-brand-purple-light hover:underline mt-1"
                  >
                    {captionExpanded ? "접기" : "더 보기"}
                  </button>
                )}
              </div>
            )}

            {/* Action buttons */}
            <div className="space-y-2">
              <Link
                href={`/influencer/${item.username}`}
                className="block w-full text-center px-4 py-2.5 rounded-xl border border-brand-purple/40 text-brand-purple-light text-sm font-semibold hover:bg-brand-purple/10 transition-colors"
              >
                크리에이터 프로필 보기
              </Link>
              {session ? (
                <button className="w-full px-4 py-2.5 rounded-xl bg-[#7c3aed] text-white text-sm font-semibold hover:bg-[#6d28d9] transition-colors">
                  캠페인 제안하기
                </button>
              ) : (
                <Link
                  href="/register"
                  className="block w-full text-center px-4 py-2.5 rounded-xl bg-[#7c3aed] text-white text-sm font-semibold hover:bg-[#6d28d9] transition-colors"
                >
                  회원가입 후 캠페인 제안하기
                </Link>
              )}
            </div>
          </div>

          {/* Related content */}
          {relatedItems.length > 0 && (
            <div className="px-5 pb-5">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                이 크리에이터의 다른 콘텐츠
              </h4>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {relatedItems.map((related) => (
                  <div
                    key={related.id}
                    className="flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border border-border cursor-pointer hover:border-brand-purple/50 transition-colors"
                  >
                    <img
                      src={related.imageUrl}
                      alt={`관련 콘텐츠`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCell({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="bg-[#F9FAFB] rounded-xl p-3 border border-[#E5E7EB]">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-sm">{icon}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}
