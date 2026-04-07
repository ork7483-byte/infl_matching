import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const PLAN_COLORS: Record<string, string> = {
  FREE: "#94a3b8",
  PRO: "#6366f1",
  ENTERPRISE: "#f59e0b",
};

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const [
      completedRevenue,
      pendingRevenue,
      processingRevenue,
      planGroups,
      earlyAccessCount,
    ] = await Promise.all([
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: "COMPLETED" },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: "PENDING" },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: "PROCESSING" },
      }),
      prisma.user.groupBy({ by: ["plan"], _count: { _all: true } }),
      prisma.user.count({ where: { isEarlyAccess: true } }),
    ]);

    const planDistribution = planGroups.map((g) => ({
      name: g.plan,
      value: g._count._all,
      color: PLAN_COLORS[g.plan] ?? "#64748b",
    }));

    return NextResponse.json({
      totalRevenue: completedRevenue._sum.amount ?? 0,
      pendingAmount: pendingRevenue._sum.amount ?? 0,
      processingAmount: processingRevenue._sum.amount ?? 0,
      planDistribution,
      earlyAccessCount,
    });
  } catch (error) {
    console.error("[admin/revenue/stats]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
