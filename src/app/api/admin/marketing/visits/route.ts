import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { searchParams } = request.nextUrl;
    const utmSource = searchParams.get("utmSource") ?? undefined;
    const path = searchParams.get("path") ?? undefined;
    const from = searchParams.get("from") ?? undefined;
    const to = searchParams.get("to") ?? undefined;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (utmSource) {
      where.utmSource = { contains: utmSource, mode: "insensitive" };
    }

    if (path) {
      where.path = { contains: path, mode: "insensitive" };
    }

    if (from || to) {
      where.visitedAt = {
        ...(from ? { gte: new Date(from) } : {}),
        ...(to ? { lte: new Date(to) } : {}),
      };
    }

    const [visits, total] = await Promise.all([
      prisma.pageVisit.findMany({
        where,
        skip,
        take: limit,
        orderBy: { visitedAt: "desc" },
      }),
      prisma.pageVisit.count({ where }),
    ]);

    return NextResponse.json({ visits, total, page, limit });
  } catch (error) {
    console.error("[admin/marketing/visits]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
