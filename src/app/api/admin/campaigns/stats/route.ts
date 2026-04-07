import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "#94a3b8",
  ACTIVE: "#22c55e",
  PAUSED: "#f59e0b",
  COMPLETED: "#6366f1",
  CANCELLED: "#ef4444",
};

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const [statusGroups, budgetResult, recentCampaigns] = await Promise.all([
      prisma.campaign.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.campaign.aggregate({ _sum: { budget: true } }),
      prisma.campaign.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true },
      }),
    ]);

    const statusDistribution = statusGroups.map((g) => ({
      name: g.status,
      value: g._count._all,
      color: STATUS_COLORS[g.status] ?? "#64748b",
    }));

    // Monthly creation counts
    const monthMap = new Map<string, number>();
    for (const c of recentCampaigns) {
      const key = `${c.createdAt.getFullYear()}-${c.createdAt.getMonth()}`;
      monthMap.set(key, (monthMap.get(key) ?? 0) + 1);
    }

    const monthlyCreation: { name: string; value: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      monthlyCreation.push({
        name: MONTH_NAMES[d.getMonth()],
        value: monthMap.get(key) ?? 0,
      });
    }

    return NextResponse.json({
      statusDistribution,
      totalBudget: budgetResult._sum.budget ?? 0,
      monthlyCreation,
    });
  } catch (error) {
    console.error("[admin/campaigns/stats]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
