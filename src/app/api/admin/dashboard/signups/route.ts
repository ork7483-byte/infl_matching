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
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const users = await prisma.user.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    // Build a map of date -> count
    const countMap = new Map<string, number>();
    for (const user of users) {
      const dateKey = user.createdAt.toISOString().slice(0, 10);
      countMap.set(dateKey, (countMap.get(dateKey) ?? 0) + 1);
    }

    // Fill all 30 days, including zeros
    const result: { date: string; count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      result.push({ date: key, count: countMap.get(key) ?? 0 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("[admin/dashboard/signups]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
