import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MOCK_MODELS = [
  { id: "mock-1", name: "수아", nameEn: "Sua", gender: "female", ageGroup: "20s", styles: ["casual", "lifestyle", "beauty"], bodyType: "slim", ethnicity: "asian", profileImage: "https://picsum.photos/seed/ai-Sua/400/500", portfolioImages: Array.from({ length: 12 }, (_, j) => `https://picsum.photos/seed/ai-Sua-${j}/400/500`), description: "수아 (Sua)는 20s 여성 AI 모델입니다.", supportImage: true, supportVideo: true, isActive: true, sortOrder: 0, createdAt: new Date() },
  { id: "mock-2", name: "하은", nameEn: "Haeun", gender: "female", ageGroup: "20s", styles: ["sporty", "fitness"], bodyType: "regular", ethnicity: "asian", profileImage: "https://picsum.photos/seed/ai-Haeun/400/500", portfolioImages: Array.from({ length: 12 }, (_, j) => `https://picsum.photos/seed/ai-Haeun-${j}/400/500`), description: "하은 (Haeun)는 20s 여성 AI 모델입니다.", supportImage: true, supportVideo: true, isActive: true, sortOrder: 1, createdAt: new Date() },
  { id: "mock-3", name: "지유", nameEn: "Jiyu", gender: "female", ageGroup: "20s", styles: ["luxury", "fashion"], bodyType: "slim", ethnicity: "asian", profileImage: "https://picsum.photos/seed/ai-Jiyu/400/500", portfolioImages: Array.from({ length: 12 }, (_, j) => `https://picsum.photos/seed/ai-Jiyu-${j}/400/500`), description: "지유 (Jiyu)는 20s 여성 AI 모델입니다.", supportImage: true, supportVideo: true, isActive: true, sortOrder: 2, createdAt: new Date() },
  { id: "mock-4", name: "서연", nameEn: "Seoyeon", gender: "female", ageGroup: "30s", styles: ["natural", "beauty"], bodyType: "regular", ethnicity: "asian", profileImage: "https://picsum.photos/seed/ai-Seoyeon/400/500", portfolioImages: Array.from({ length: 12 }, (_, j) => `https://picsum.photos/seed/ai-Seoyeon-${j}/400/500`), description: "서연 (Seoyeon)는 30s 여성 AI 모델입니다.", supportImage: true, supportVideo: true, isActive: true, sortOrder: 3, createdAt: new Date() },
  { id: "mock-5", name: "미나", nameEn: "Mina", gender: "female", ageGroup: "20s", styles: ["street", "hip"], bodyType: "slim", ethnicity: "mixed", profileImage: "https://picsum.photos/seed/ai-Mina/400/500", portfolioImages: Array.from({ length: 12 }, (_, j) => `https://picsum.photos/seed/ai-Mina-${j}/400/500`), description: "미나 (Mina)는 20s 여성 AI 모델입니다.", supportImage: true, supportVideo: false, isActive: true, sortOrder: 4, createdAt: new Date() },
  { id: "mock-6", name: "예진", nameEn: "Yejin", gender: "female", ageGroup: "30s", styles: ["formal", "business"], bodyType: "regular", ethnicity: "asian", profileImage: "https://picsum.photos/seed/ai-Yejin/400/500", portfolioImages: Array.from({ length: 12 }, (_, j) => `https://picsum.photos/seed/ai-Yejin-${j}/400/500`), description: "예진 (Yejin)는 30s 여성 AI 모델입니다.", supportImage: true, supportVideo: false, isActive: true, sortOrder: 5, createdAt: new Date() },
  { id: "mock-7", name: "지호", nameEn: "Jiho", gender: "male", ageGroup: "30s", styles: ["business", "formal"], bodyType: "regular", ethnicity: "asian", profileImage: "https://picsum.photos/seed/ai-Jiho/400/500", portfolioImages: Array.from({ length: 12 }, (_, j) => `https://picsum.photos/seed/ai-Jiho-${j}/400/500`), description: "지호 (Jiho)는 30s 남성 AI 모델입니다.", supportImage: true, supportVideo: false, isActive: true, sortOrder: 6, createdAt: new Date() },
  { id: "mock-8", name: "민준", nameEn: "Minjun", gender: "male", ageGroup: "20s", styles: ["street", "casual"], bodyType: "slim", ethnicity: "asian", profileImage: "https://picsum.photos/seed/ai-Minjun/400/500", portfolioImages: Array.from({ length: 12 }, (_, j) => `https://picsum.photos/seed/ai-Minjun-${j}/400/500`), description: "민준 (Minjun)는 20s 남성 AI 모델입니다.", supportImage: true, supportVideo: false, isActive: true, sortOrder: 7, createdAt: new Date() },
  { id: "mock-9", name: "현우", nameEn: "Hyunwoo", gender: "male", ageGroup: "20s", styles: ["sporty", "fitness"], bodyType: "regular", ethnicity: "asian", profileImage: "https://picsum.photos/seed/ai-Hyunwoo/400/500", portfolioImages: Array.from({ length: 12 }, (_, j) => `https://picsum.photos/seed/ai-Hyunwoo-${j}/400/500`), description: "현우 (Hyunwoo)는 20s 남성 AI 모델입니다.", supportImage: true, supportVideo: false, isActive: true, sortOrder: 8, createdAt: new Date() },
  { id: "mock-10", name: "태윤", nameEn: "Taeyun", gender: "male", ageGroup: "30s", styles: ["luxury", "fashion"], bodyType: "slim", ethnicity: "asian", profileImage: "https://picsum.photos/seed/ai-Taeyun/400/500", portfolioImages: Array.from({ length: 12 }, (_, j) => `https://picsum.photos/seed/ai-Taeyun-${j}/400/500`), description: "태윤 (Taeyun)는 30s 남성 AI 모델입니다.", supportImage: true, supportVideo: false, isActive: true, sortOrder: 9, createdAt: new Date() },
  { id: "mock-11", name: "준서", nameEn: "Junseo", gender: "male", ageGroup: "20s", styles: ["natural", "casual"], bodyType: "regular", ethnicity: "asian", profileImage: "https://picsum.photos/seed/ai-Junseo/400/500", portfolioImages: Array.from({ length: 12 }, (_, j) => `https://picsum.photos/seed/ai-Junseo-${j}/400/500`), description: "준서 (Junseo)는 20s 남성 AI 모델입니다.", supportImage: true, supportVideo: false, isActive: true, sortOrder: 10, createdAt: new Date() },
  { id: "mock-12", name: "도윤", nameEn: "Doyun", gender: "male", ageGroup: "30s", styles: ["outdoor", "lifestyle"], bodyType: "regular", ethnicity: "asian", profileImage: "https://picsum.photos/seed/ai-Doyun/400/500", portfolioImages: Array.from({ length: 12 }, (_, j) => `https://picsum.photos/seed/ai-Doyun-${j}/400/500`), description: "도윤 (Doyun)는 30s 남성 AI 모델입니다.", supportImage: true, supportVideo: false, isActive: true, sortOrder: 11, createdAt: new Date() },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const gender = searchParams.get("gender");
    const ageGroup = searchParams.get("ageGroup");
    const style = searchParams.get("style");

    const where: Record<string, unknown> = { isActive: true };
    if (gender) where.gender = gender;
    if (ageGroup) where.ageGroup = ageGroup;

    let models = await prisma.aIModel.findMany({
      where,
      orderBy: { sortOrder: "asc" },
    });

    // Filter by style (array contains)
    if (style) {
      models = models.filter((m) => m.styles.includes(style));
    }

    // Fall back to mock data if DB is empty
    if (models.length === 0) {
      let mockFiltered = MOCK_MODELS;
      if (gender) mockFiltered = mockFiltered.filter((m) => m.gender === gender);
      if (ageGroup) mockFiltered = mockFiltered.filter((m) => m.ageGroup === ageGroup);
      if (style) mockFiltered = mockFiltered.filter((m) => m.styles.includes(style));
      return NextResponse.json({ models: mockFiltered });
    }

    return NextResponse.json({ models });
  } catch (error) {
    console.error("[GET /api/ai-studio/models]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
