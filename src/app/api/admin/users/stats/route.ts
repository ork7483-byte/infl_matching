import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ROLE_COLORS: Record<string, string> = {
  BRAND: "#6366f1",
  CREATOR: "#22c55e",
  ADMIN: "#f59e0b",
};

const PLAN_COLORS: Record<string, string> = {
  FREE: "#94a3b8",
  PRO: "#6366f1",
  ENTERPRISE: "#f59e0b",
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

    const [roleGroups, planGroups, signupUsers] = await Promise.all([
      prisma.user.groupBy({ by: ["role"], _count: { _all: true } }),
      prisma.user.groupBy({ by: ["plan"], _count: { _all: true } }),
      prisma.user.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true },
      }),
    ]);

    const roleDistribution = roleGroups.map((g) => ({
      name: g.role,
      value: g._count._all,
      color: ROLE_COLORS[g.role] ?? "#64748b",
    }));

    const planDistribution = planGroups.map((g) => ({
      name: g.plan,
      value: g._count._all,
      color: PLAN_COLORS[g.plan] ?? "#64748b",
    }));

    // Build monthly signup counts for last 6 months
    const monthMap = new Map<string, number>();
    for (const user of signupUsers) {
      const key = `${user.createdAt.getFullYear()}-${user.createdAt.getMonth()}`;
      monthMap.set(key, (monthMap.get(key) ?? 0) + 1);
    }

    const monthlySignups: { name: string; value: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      monthlySignups.push({
        name: MONTH_NAMES[d.getMonth()],
        value: monthMap.get(key) ?? 0,
      });
    }

    return NextResponse.json({ roleDistribution, planDistribution, monthlySignups });
  } catch (error) {
    console.error("[admin/users/stats]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
