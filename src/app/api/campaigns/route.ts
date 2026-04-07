import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CampaignStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { searchParams } = request.nextUrl;
    const statusParam = searchParams.get("status");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
    const skip = (page - 1) * limit;

    const brand = await prisma.brand.findUnique({ where: { userId } });
    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const statusFilter =
      statusParam && Object.values(CampaignStatus).includes(statusParam as CampaignStatus)
        ? (statusParam as CampaignStatus)
        : undefined;

    const campaigns = await prisma.campaign.findMany({
      where: {
        brandId: brand.id,
        ...(statusFilter ? { status: statusFilter } : {}),
      },
      include: {
        _count: { select: { campaignInfluencers: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    return NextResponse.json({ campaigns, page, limit });
  } catch (error) {
    console.error("[GET /api/campaigns]", error);
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
    const body = await request.json();
    const {
      name,
      description,
      hashtag,
      contentType,
      budget,
      startDate,
      endDate,
      isPublic,
      category,
      rewardType,
      rewardAmount,
      requirements,
    } = body;

    if (!name) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const brand = await prisma.brand.findUnique({ where: { userId } });
    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const campaign = await prisma.campaign.create({
      data: {
        brandId: brand.id,
        name,
        description: description ?? null,
        hashtag: hashtag ?? null,
        contentType: contentType ?? null,
        budget: budget != null ? parseFloat(budget) : null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        isPublic: isPublic ?? false,
        category: category ?? null,
        rewardType: rewardType ?? null,
        rewardAmount: rewardAmount != null ? parseFloat(rewardAmount) : null,
        requirements: requirements ?? null,
      },
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/campaigns]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
