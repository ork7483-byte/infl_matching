/**
 * Instagram Graph API Client
 *
 * Business Discovery API: 타 계정 공개 데이터 조회 (개발 모드에서도 가능)
 * Insights API: OAuth 연동 계정 인사이트 (본인 계정만)
 *
 * Rate Limit: 앱당 시간당 200회
 * 개발 모드: 본인 계정 + 테스트 유저만 접근 가능
 */

const GRAPH_API_BASE = "https://graph.facebook.com/v21.0";

interface IGConfig {
  accessToken: string;
  igUserId: string;
}

function getConfig(): IGConfig {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const igUserId = process.env.INSTAGRAM_USER_ID || "17841410385539405";

  if (!accessToken) {
    throw new Error("INSTAGRAM_ACCESS_TOKEN is not configured");
  }

  return { accessToken, igUserId };
}

// ============================================
// Rate Limiting
// ============================================

let requestCount = 0;
let windowStart = Date.now();
const MAX_REQUESTS_PER_HOUR = 190; // buffer below 200

async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now();
  if (now - windowStart > 3600000) {
    requestCount = 0;
    windowStart = now;
  }

  if (requestCount >= MAX_REQUESTS_PER_HOUR) {
    throw new Error("Instagram API rate limit reached. Try again later.");
  }

  requestCount++;
  const res = await fetch(url, { next: { revalidate: 300 } }); // 5min cache

  if (!res.ok) {
    const errorBody = await res.text();
    console.error(`[Instagram API] ${res.status}: ${errorBody}`);

    if (res.status === 190 || errorBody.includes("OAuthException")) {
      throw new Error("Instagram token expired or invalid");
    }

    throw new Error(`Instagram API error: ${res.status}`);
  }

  return res;
}

// ============================================
// Token Management
// ============================================

/**
 * Exchange short-lived token for long-lived (60 days)
 */
export async function exchangeForLongLivedToken(shortLivedToken: string): Promise<{
  access_token: string;
  token_type: string;
  expires_in: number;
}> {
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;

  if (!appId || !appSecret) {
    throw new Error("META_APP_ID and META_APP_SECRET are required");
  }

  const url = `${GRAPH_API_BASE}/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortLivedToken}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to exchange token");
  return res.json();
}

/**
 * Refresh a long-lived token (must be done before expiry)
 */
export async function refreshLongLivedToken(currentToken: string): Promise<{
  access_token: string;
  token_type: string;
  expires_in: number;
}> {
  const url = `${GRAPH_API_BASE}/oauth/access_token?grant_type=ig_exchange_token&access_token=${currentToken}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to refresh token");
  return res.json();
}

// ============================================
// Business Discovery API (타 계정 공개 데이터)
// ============================================

export interface IGUserProfile {
  id: string;
  username: string;
  name: string;
  biography: string;
  followers_count: number;
  follows_count: number;
  media_count: number;
  profile_picture_url: string;
  website?: string;
}

export interface IGMedia {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
}

/**
 * 타 계정의 공개 프로필 정보 조회
 * Business Discovery API - 개발 모드에서도 작동
 */
export async function getBusinessDiscovery(username: string): Promise<IGUserProfile | null> {
  try {
    const { accessToken, igUserId } = getConfig();
    const fields = "username,name,biography,followers_count,follows_count,media_count,profile_picture_url,website";
    const url = `${GRAPH_API_BASE}/${igUserId}?fields=business_discovery.fields(${fields}){username=${username}}&access_token=${accessToken}`;

    const res = await rateLimitedFetch(url);
    const data = await res.json();

    if (!data.business_discovery) return null;
    return data.business_discovery as IGUserProfile;
  } catch (error) {
    console.error(`[Instagram] getBusinessDiscovery(${username}):`, error);
    return null;
  }
}

/**
 * 타 계정의 최근 게시물 조회
 */
export async function getBusinessDiscoveryMedia(
  username: string,
  limit = 25
): Promise<IGMedia[]> {
  try {
    const { accessToken, igUserId } = getConfig();
    const mediaFields = "id,media_type,media_url,thumbnail_url,permalink,caption,timestamp,like_count,comments_count";
    const url = `${GRAPH_API_BASE}/${igUserId}?fields=business_discovery.fields(media.limit(${limit}){${mediaFields}}){username=${username}}&access_token=${accessToken}`;

    const res = await rateLimitedFetch(url);
    const data = await res.json();

    return data.business_discovery?.media?.data || [];
  } catch (error) {
    console.error(`[Instagram] getBusinessDiscoveryMedia(${username}):`, error);
    return [];
  }
}

/**
 * 프로필 + 최근 게시물 한번에 조회 (API 호출 1회로 최적화)
 */
export async function getFullBusinessDiscovery(
  username: string,
  mediaLimit = 25
): Promise<{ profile: IGUserProfile; media: IGMedia[] } | null> {
  try {
    const { accessToken, igUserId } = getConfig();
    const profileFields = "username,name,biography,followers_count,follows_count,media_count,profile_picture_url";
    const mediaFields = "id,media_type,media_url,thumbnail_url,permalink,caption,timestamp,like_count,comments_count";
    const url = `${GRAPH_API_BASE}/${igUserId}?fields=business_discovery.fields(${profileFields},media.limit(${mediaLimit}){${mediaFields}}){username=${username}}&access_token=${accessToken}`;

    const res = await rateLimitedFetch(url);
    const data = await res.json();

    if (!data.business_discovery) return null;

    const { media, ...profile } = data.business_discovery;
    return {
      profile: profile as IGUserProfile,
      media: (media?.data || []) as IGMedia[],
    };
  } catch (error) {
    console.error(`[Instagram] getFullBusinessDiscovery(${username}):`, error);
    return null;
  }
}

// ============================================
// Own Account Insights (OAuth 연동 계정만)
// ============================================

export interface IGInsight {
  name: string;
  period: string;
  values: { value: number; end_time?: string }[];
  title: string;
  description: string;
}

/**
 * 본인 계정의 미디어 인사이트 조회
 * Requires: instagram_manage_insights permission
 */
export async function getMediaInsights(
  mediaId: string,
  userAccessToken: string
): Promise<IGInsight[]> {
  try {
    const metrics = "reach,impressions,saved,shares";
    const url = `${GRAPH_API_BASE}/${mediaId}/insights?metric=${metrics}&access_token=${userAccessToken}`;

    const res = await rateLimitedFetch(url);
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error(`[Instagram] getMediaInsights(${mediaId}):`, error);
    return [];
  }
}

/**
 * 본인 계정의 오디언스 인구통계 조회
 * Requires: instagram_manage_insights permission + followers >= 100
 */
export async function getAudienceDemographics(
  userAccessToken: string,
  igUserId: string
): Promise<{
  gender: Record<string, number>;
  age: Record<string, number>;
  city: Record<string, number>;
  country: Record<string, number>;
} | null> {
  try {
    const metrics = "follower_demographics";
    const url = `${GRAPH_API_BASE}/${igUserId}/insights?metric=${metrics}&period=lifetime&metric_type=total_value&access_token=${userAccessToken}`;

    const res = await rateLimitedFetch(url);
    const data = await res.json();

    if (!data.data?.[0]?.total_value?.breakdowns) return null;

    const breakdowns = data.data[0].total_value.breakdowns;
    const result = {
      gender: {} as Record<string, number>,
      age: {} as Record<string, number>,
      city: {} as Record<string, number>,
      country: {} as Record<string, number>,
    };

    for (const breakdown of breakdowns) {
      const dimension = breakdown.dimension_keys?.[0];
      if (!dimension) continue;

      const key = dimension === "city" ? "city" :
                  dimension === "country" ? "country" :
                  dimension === "age" ? "age" :
                  dimension === "gender" ? "gender" : null;

      if (key && breakdown.results) {
        for (const item of breakdown.results) {
          const dimValue = item.dimension_values?.[0];
          if (dimValue) {
            result[key][dimValue] = item.value;
          }
        }
      }
    }

    return result as {
      gender: Record<string, number>;
      age: Record<string, number>;
      city: Record<string, number>;
      country: Record<string, number>;
    };
  } catch (error) {
    console.error(`[Instagram] getAudienceDemographics:`, error);
    return null;
  }
}

// ============================================
// Hashtag Search (캠페인 트래킹용)
// ============================================

/**
 * 해시태그 ID 조회
 */
export async function getHashtagId(hashtag: string): Promise<string | null> {
  try {
    const { accessToken, igUserId } = getConfig();
    const url = `${GRAPH_API_BASE}/ig_hashtag_search?q=${encodeURIComponent(hashtag)}&user_id=${igUserId}&access_token=${accessToken}`;

    const res = await rateLimitedFetch(url);
    const data = await res.json();
    return data.data?.[0]?.id || null;
  } catch (error) {
    console.error(`[Instagram] getHashtagId(${hashtag}):`, error);
    return null;
  }
}

/**
 * 해시태그 최근 게시물 조회
 */
export async function getHashtagRecentMedia(
  hashtagId: string,
  limit = 50
): Promise<IGMedia[]> {
  try {
    const { accessToken, igUserId } = getConfig();
    const fields = "id,media_type,permalink,caption,timestamp,like_count,comments_count";
    const url = `${GRAPH_API_BASE}/${hashtagId}/recent_media?user_id=${igUserId}&fields=${fields}&limit=${limit}&access_token=${accessToken}`;

    const res = await rateLimitedFetch(url);
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error(`[Instagram] getHashtagRecentMedia:`, error);
    return [];
  }
}

// ============================================
// Utility Functions
// ============================================

/**
 * 참여율 계산
 */
export function calculateEngagementRate(
  followersCount: number,
  media: IGMedia[]
): number {
  if (!media.length || followersCount === 0) return 0;

  const totalEngagement = media.reduce((sum, m) => {
    return sum + (m.like_count || 0) + (m.comments_count || 0);
  }, 0);

  const avgEngagement = totalEngagement / media.length;
  return parseFloat(((avgEngagement / followersCount) * 100).toFixed(2));
}

/**
 * 미디어 타입 변환 (IG API → Prisma enum)
 */
export function mapMediaType(igType: string): "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM" | "REEL" | "STORY" {
  switch (igType) {
    case "IMAGE": return "IMAGE";
    case "VIDEO": return "VIDEO";
    case "CAROUSEL_ALBUM": return "CAROUSEL_ALBUM";
    default: return "IMAGE";
  }
}

/**
 * Instagram API가 사용 가능한지 확인
 */
export function isInstagramConfigured(): boolean {
  return !!(process.env.INSTAGRAM_ACCESS_TOKEN && process.env.INSTAGRAM_USER_ID);
}
