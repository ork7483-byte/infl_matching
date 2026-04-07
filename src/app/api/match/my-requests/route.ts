import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user as { id: string; role: string };
    if (user.role !== "BRAND") {
      return NextResponse.json({ error: "Forbidden: BRAND role required" }, { status: 403 });
    }

    const brand = await prisma.brand.findUnique({ where: { userId: user.id } });
    if (!brand) {
      return NextResponse.json({ error: "Brand profile not found" }, { status: 404 });
    }

    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
    const skip = (page - 1) * limit;

    const [requests, total] = await Promise.all([
      prisma.matchRequest.findMany({
        where: { brandId: brand.id },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.matchRequest.count({ where: { brandId: brand.id } }),
    ]);

    // Enrich with influencer info
    const influencerIds = Array.from(new Set(requests.map((r) => r.influencerId)));
    const influencers = await prisma.influencer.findMany({
      where: { id: { in: influencerIds } },
      select: { id: true, username: true, fullName: true, profilePicUrl: true, followersCount: true },
    });
    const influencerMap = Object.fromEntries(influencers.map((inf) => [inf.id, inf]));

    const enriched = requests.map((r) => ({
      ...r,
      influencer: influencerMap[r.influencerId] ?? null,
    }));

    return NextResponse.json({ requests: enriched, total, page, limit });
  } catch (error) {
    console.error("[GET /api/match/my-requests]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
