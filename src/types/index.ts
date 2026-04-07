import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

export type UserRole = "BRAND" | "CREATOR" | "ADMIN";

export interface BlurredData<T> {
  data: T;
  _blurred: boolean;
}

export interface SearchFilters {
  minFollowers?: number;
  maxFollowers?: number;
  categories?: string[];
  minEngagementRate?: number;
  sortBy?: "followers" | "engagement" | "aqs";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface AqsGrade {
  score: number;
  grade: "excellent" | "good" | "caution" | "danger";
  color: string;
  emoji: string;
  label: string;
}

export function getAqsGrade(score: number): AqsGrade {
  if (score >= 90)
    return { score, grade: "excellent", color: "#22c55e", emoji: "🟢", label: "매우 건강" };
  if (score >= 70)
    return { score, grade: "good", color: "#f59e0b", emoji: "🟡", label: "양호" };
  if (score >= 50)
    return { score, grade: "caution", color: "#f97316", emoji: "🟠", label: "주의" };
  return { score, grade: "danger", color: "#ef4444", emoji: "🔴", label: "위험" };
}
