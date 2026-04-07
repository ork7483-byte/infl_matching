import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MOCK_DROPOFFS = [
  { page: "/signup", exits: 400, percentage: 33.3 },
  { page: "/", exits: 300, percentage: 25.0 },
  { page: "/for-brands", exits: 180, percentage: 15.0 },
  { page: "/for-creators", exits: 150, percentage: 12.5 },
  { page: "/pricing", exits: 170, percentage: 14.2 },
];

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const visits = await prisma.pageVisit.findMany({
      select: { path: true },
    });

    if (visits.length < 20) {
      return NextResponse.json({ dropoffs: MOCK_DROPOFFS });
    }

    const pathCounts: Record<string, number> = {};
    for (const v of visits) {
      const p = v.path ?? "/";
      pathCounts[p] = (pathCounts[p] ?? 0) + 1;
    }

    const total = visits.length;

    const dropoffs = Object.entries(pathCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([page, exits]) => ({
        page,
        exits,
        percentage: parseFloat(((exits / total) * 100).toFixed(1)),
      }));

    return NextResponse.json({ dropoffs });
  } catch (error) {
    console.error("[admin/marketing/conversion/dropoff]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
