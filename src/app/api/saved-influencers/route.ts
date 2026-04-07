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

    const userId = (session.user as { id: string }).id;
    const brand = await prisma.brand.findUnique({ where: { userId } });
    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const { searchParams } = request.nextUrl;
    const status = searchParams.get("status") ?? undefined;

    const savedInfluencers = await prisma.savedInfluencer.findMany({
      where: {
        brandId: brand.id,
        ...(status ? { status } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ savedInfluencers });
  } catch (error) {
    console.error("[GET /api/saved-influencers]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const brand = await prisma.brand.findUnique({ where: { userId } });
    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const body = await request.json();
    const { influencerId, status, tags, notes, rating } = body;

    if (!influencerId) {
      return NextResponse.json({ error: "influencerId is required" }, { status: 400 });
    }

    const saved = await prisma.savedInfluencer.upsert({
      where: { brandId_influencerId: { brandId: brand.id, influencerId } },
      create: {
        brandId: brand.id,
        influencerId,
        status: status ?? "discovered",
        tags: tags ?? [],
        notes: notes ?? null,
        rating: rating != null ? parseFloat(rating) : null,
      },
      update: {
        ...(status !== undefined ? { status } : {}),
        ...(tags !== undefined ? { tags } : {}),
        ...(notes !== undefined ? { notes } : {}),
        ...(rating !== undefined ? { rating: rating != null ? parseFloat(rating) : null } : {}),
      },
    });

    return NextResponse.json({ savedInfluencer: saved }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/saved-influencers]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
