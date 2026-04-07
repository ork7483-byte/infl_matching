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
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(todayStart.getTime() - 14 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      todaySignups,
      lastWeekSignups,
      prevWeekSignups,
      activeCampaigns,
      prevWeekActiveCampaigns,
      totalRevenue,
      prevWeekRevenue,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: twoWeeksAgo, lt: weekAgo } } }),
      prisma.campaign.count({ where: { status: "ACTIVE" } }),
      prisma.campaign.count({
        where: { status: "ACTIVE", createdAt: { lt: weekAgo } },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: "COMPLETED" },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: "COMPLETED", processedAt: { lt: weekAgo } },
      }),
    ]);

    const currentRevenue = totalRevenue._sum.amount ?? 0;
    const previousRevenue = prevWeekRevenue._sum.amount ?? 0;

    const signupChange =
      prevWeekSignups > 0
        ? Math.round(((lastWeekSignups - prevWeekSignups) / prevWeekSignups) * 100)
        : lastWeekSignups > 0
        ? 100
        : 0;

    const revenueChange =
      previousRevenue > 0
        ? Math.round(((currentRevenue - previousRevenue) / previousRevenue) * 100)
        : currentRevenue > 0
        ? 100
        : 0;

    return NextResponse.json({
      totalUsers,
      todaySignups,
      activeCampaigns,
      totalRevenue: currentRevenue,
      weekOverWeek: {
        signups: signupChange,
        campaigns: prevWeekActiveCampaigns > 0
          ? Math.round(((activeCampaigns - prevWeekActiveCampaigns) / prevWeekActiveCampaigns) * 100)
          : activeCampaigns > 0 ? 100 : 0,
        revenue: revenueChange,
      },
    });
  } catch (error) {
    console.error("[admin/dashboard/stats]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
