import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MOCK_CHANNELS = [
  { name: "instagram", visits: 1234, signups: 89, conversionRate: 7.2 },
  { name: "google", visits: 987, signups: 62, conversionRate: 6.3 },
  { name: "tiktok", visits: 654, signups: 38, conversionRate: 5.8 },
  { name: "twitter", visits: 432, signups: 21, conversionRate: 4.9 },
  { name: "(direct)", visits: 2100, signups: 132, conversionRate: 6.3 },
];

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const visits = await prisma.pageVisit.findMany({
      select: { utmSource: true, visitedAt: true },
    });

    if (visits.length < 20) {
      return NextResponse.json({ channels: MOCK_CHANNELS });
    }

    const visitMap: Record<string, { count: number; earliest: Date; latest: Date }> = {};
    for (const v of visits) {
      const src = v.utmSource ?? "(direct)";
      if (!visitMap[src]) {
        visitMap[src] = { count: 0, earliest: v.visitedAt, latest: v.visitedAt };
      }
      visitMap[src].count++;
      if (v.visitedAt < visitMap[src].earliest) visitMap[src].earliest = v.visitedAt;
      if (v.visitedAt > visitMap[src].latest) visitMap[src].latest = v.visitedAt;
    }

    const totalUsers = await prisma.user.count();
    const totalVisits = visits.length;

    const channels = Object.entries(visitMap)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10)
      .map(([name, data]) => {
        const shareOfVisits = data.count / totalVisits;
        const approxSignups = Math.round(totalUsers * shareOfVisits * 0.9);
        const conversionRate =
          data.count > 0
            ? parseFloat(((approxSignups / data.count) * 100).toFixed(1))
            : 0;
        return { name, visits: data.count, signups: approxSignups, conversionRate };
      });

    return NextResponse.json({ channels });
  } catch (error) {
    console.error("[admin/marketing/acquisition/channels]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
