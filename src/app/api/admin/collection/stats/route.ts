import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [
      totalCollected,
      todayCollected,
      pendingSeeds,
      failedSeeds,
      categoryRaw,
    ] = await Promise.all([
      prisma.influencer.count({ where: { source: "collected" } }),
      prisma.influencer.count({
        where: {
          source: "collected",
          collectedAt: { gte: todayStart },
        },
      }),
      prisma.collectionSeed.count({ where: { status: "pending" } }),
      prisma.collectionSeed.count({ where: { status: "failed" } }),
      prisma.influencer.findMany({
        where: { source: "collected" },
        select: { categories: true },
      }),
    ]);

    // Build category breakdown from categories array field
    const categoryBreakdown: Record<string, number> = {};
    for (const row of categoryRaw) {
      for (const cat of row.categories) {
        categoryBreakdown[cat] = (categoryBreakdown[cat] ?? 0) + 1;
      }
    }

    return NextResponse.json({
      totalCollected,
      todayCollected,
      pendingSeeds,
      failedSeeds,
      categoryBreakdown,
    });
  } catch (error) {
    console.error("[admin/collection/stats]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
