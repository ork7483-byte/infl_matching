import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: { id: string };
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const body = await request.json();
    const { influencerId, agreedFee } = body;

    if (!influencerId) {
      return NextResponse.json({ error: "influencerId is required" }, { status: 400 });
    }

    // Verify campaign ownership
    const brand = await prisma.brand.findUnique({ where: { userId } });
    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id: params.id },
      select: { brandId: true },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    if (campaign.brandId !== brand.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const campaignInfluencer = await prisma.campaignInfluencer.create({
      data: {
        campaignId: params.id,
        influencerId,
        agreedFee: agreedFee != null ? parseFloat(agreedFee) : null,
      },
    });

    return NextResponse.json({ campaignInfluencer }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/campaigns/[id]/influencers]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
