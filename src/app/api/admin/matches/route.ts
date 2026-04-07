import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = request.nextUrl;
    const statusFilter = searchParams.get("status") ?? undefined;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
    const skip = (page - 1) * limit;

    const where = statusFilter ? { status: statusFilter } : {};

    const [requests, total] = await Promise.all([
      prisma.matchRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.matchRequest.count({ where }),
    ]);

    // Enrich with brand and influencer info
    const brandIds = Array.from(new Set(requests.map((r) => r.brandId)));
    const influencerIds = Array.from(new Set(requests.map((r) => r.influencerId)));

    const [brands, influencers] = await Promise.all([
      prisma.brand.findMany({
        where: { id: { in: brandIds } },
        select: { id: true, companyName: true, logoUrl: true },
      }),
      prisma.influencer.findMany({
        where: { id: { in: influencerIds } },
        select: { id: true, username: true, fullName: true, profilePicUrl: true, followersCount: true },
      }),
    ]);

    const brandMap = Object.fromEntries(brands.map((b) => [b.id, b]));
    const influencerMap = Object.fromEntries(influencers.map((inf) => [inf.id, inf]));

    const enriched = requests.map((r) => ({
      ...r,
      brand: brandMap[r.brandId] ?? null,
      influencer: influencerMap[r.influencerId] ?? null,
    }));

    return NextResponse.json({ requests: enriched, total, page, limit });
  } catch (error) {
    console.error("[GET /api/admin/matches]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
