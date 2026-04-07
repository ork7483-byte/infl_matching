import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { influencerId, campaignTitle, campaignType, budget, startDate, endDate, description } = body;

    if (!influencerId || !campaignTitle || !campaignType || !description) {
      return NextResponse.json(
        { error: "influencerId, campaignTitle, campaignType, description are required" },
        { status: 400 }
      );
    }

    const influencer = await prisma.influencer.findUnique({ where: { id: influencerId } });
    if (!influencer) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }

    const matchRequest = await prisma.matchRequest.create({
      data: {
        brandId: brand.id,
        influencerId,
        campaignTitle,
        campaignType,
        budget: budget ?? null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        description,
        status: "pending",
      },
    });

    return NextResponse.json({ matchRequest }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/match/request]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
