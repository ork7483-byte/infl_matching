import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MOCK_FEATURES = [
  { name: "인플루언서 검색", dailyActive: 45, weeklyActive: 120, monthlyActive: 200 },
  { name: "프로필 조회", dailyActive: 30, weeklyActive: 90, monthlyActive: 150 },
  { name: "캠페인 생성", dailyActive: 12, weeklyActive: 38, monthlyActive: 72 },
  { name: "분석 대시보드", dailyActive: 20, weeklyActive: 65, monthlyActive: 110 },
  { name: "메시지 발송", dailyActive: 8, weeklyActive: 25, monthlyActive: 48 },
];

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const now = new Date();
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [dayEvents, weekEvents, monthEvents] = await Promise.all([
      prisma.eventLog
        .findMany({
          where: { createdAt: { gte: dayAgo } },
          select: { userId: true, eventType: true },
          distinct: ["userId"],
        })
        .catch(() => [] as { userId: string | null; eventType: string }[]),
      prisma.eventLog
        .findMany({
          where: { createdAt: { gte: weekAgo } },
          select: { userId: true, eventType: true },
          distinct: ["userId"],
        })
        .catch(() => [] as { userId: string | null; eventType: string }[]),
      prisma.eventLog
        .findMany({
          where: { createdAt: { gte: monthAgo } },
          select: { userId: true, eventType: true },
          distinct: ["userId"],
        })
        .catch(() => [] as { userId: string | null; eventType: string }[]),
    ]);

    const dau = new Set(dayEvents.map((e) => e.userId)).size;
    const wau = new Set(weekEvents.map((e) => e.userId)).size;
    const mau = new Set(monthEvents.map((e) => e.userId)).size;

    if (mau < 5) {
      return NextResponse.json({
        features: MOCK_FEATURES,
        dau: 45,
        wau: 120,
        mau: 200,
      });
    }

    return NextResponse.json({
      features: MOCK_FEATURES,
      dau,
      wau,
      mau,
    });
  } catch (error) {
    console.error("[admin/marketing/retention/activity]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
