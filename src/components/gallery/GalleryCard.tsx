"use client";

import MaskedValue from "@/components/MaskedValue";
import Badge from "@/components/ui/Badge";

export interface GalleryItem {
  id: string;
  type: "feed" | "reel" | "story";
  imageUrl: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  isVideo: boolean;
  username: string;
  profilePicUrl: string | null;
  category: string;
  campaignName?: string;
  brandName?: string;
  likesCount?: number;
  likeCount?: number;
  commentsCount: number;
  reach: number | null;
  engagementRate: number | null;
  caption?: string;
  postedAt?: string;
  influencer?: { username: string; fullName: string; profilePicUrl: string | null; followersCount: number };
}

interface GalleryCardProps {
  item: GalleryItem;
  onClick: () => void;
}

export default function GalleryCard({ item, onClick }: GalleryCardProps) {
  const isReel = item.type === "reel";

  return (
    <div
      className="break-inside-avoid mb-4 cursor-pointer group active:scale-[0.99] transition-transform duration-150"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
    >
      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
        {/* Image / Thumbnail */}
        <div className="relative overflow-hidden">
          {/* Aspect ratio wrapper: reels are 9:16, feed is 4:5 */}
          <div
            className={`relative w-full overflow-hidden ${
              isReel ? "aspect-[9/16]" : "aspect-[4/5]"
            }`}
          >
            <img
              src={item.imageUrl || item.mediaUrl || item.thumbnailUrl || ""}
              alt={`${item.username}의 콘텐츠`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />

            {/* Dark hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
              <span className="flex items-center gap-1 text-white font-semibold text-sm drop-shadow">
                <span>❤️</span>
                {(item.likesCount ?? item.likeCount ?? 0).toLocaleString()}
              </span>
              <span className="flex items-center gap-1 text-white font-semibold text-sm drop-shadow">
                <span>💬</span>
                {item.commentsCount.toLocaleString()}
              </span>
            </div>

            {/* Video play icon */}
            {item.isVideo && (
              <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-white ml-0.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            )}

            {/* Type badge */}
            <div className="absolute top-2 left-2">
              <span className="text-xs px-2 py-0.5 rounded-full bg-black/60 text-white font-medium backdrop-blur-sm">
                {item.type === "reel" ? "릴스" : item.type === "story" ? "스토리" : "피드"}
              </span>
            </div>
          </div>
        </div>

        {/* Card Info */}
        <div className="p-3 space-y-2">
          {/* Profile row */}
          <div className="flex items-center gap-2">
            {item.profilePicUrl ? (
              <img
                src={item.profilePicUrl}
                alt={item.username}
                className="w-8 h-8 rounded-full object-cover border border-border flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {item.username[0]?.toUpperCase() ?? "?"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground truncate">
                @{item.username}
              </p>
            </div>
            <Badge variant="purple" size="sm" className="flex-shrink-0">
              {item.category}
            </Badge>
          </div>

          {/* Campaign / brand */}
          {(item.campaignName || item.brandName) && (
            <div className="text-xs text-muted-foreground truncate">
              {item.campaignName && (
                <span className="text-foreground font-medium">
                  {item.campaignName}
                </span>
              )}
              {item.campaignName && item.brandName && (
                <span className="mx-1">·</span>
              )}
              {item.brandName && <span>{item.brandName}</span>}
            </div>
          )}

          {/* Stats row */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1 border-t border-border">
            <span className="flex items-center gap-1">
              <span>👁</span>
              <MaskedValue
                value={item.reach?.toLocaleString() ?? null}
                width="40px"
                className="text-foreground font-medium"
              />
            </span>
            <span className="flex items-center gap-1">
              <span>📊</span>
              <MaskedValue
                value={
                  item.engagementRate != null
                    ? `${item.engagementRate.toFixed(2)}%`
                    : null
                }
                width="40px"
                className="text-foreground font-medium"
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
