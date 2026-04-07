import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CampaignStatus } from "@prisma/client";

interface RouteContext {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const userRole = (session.user as { role: string }).role;

    const campaign = await prisma.campaign.findUnique({
      where: { id: params.id },
      include: {
        campaignInfluencers: {
          include: {
            influencer: {
              select: {
                id: true,
                username: true,
                fullName: true,
                profilePicUrl: true,
                followersCount: true,
                avgEngagementRate: true,
                categories: true,
              },
            },
          },
        },
        campaignPosts: {
          include: {
            performanceSnapshots: {
              orderBy: { snapshotAt: "desc" },
              take: 1,
            },
          },
        },
        campaignApplications: {
          include: {
            influencer: {
              select: {
                id: true,
                username: true,
                fullName: true,
                profilePicUrl: true,
                followersCount: true,
                avgEngagementRate: true,
                categories: true,
              },
            },
          },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // IDOR check: verify ownership (admin can view all)
    if (userRole !== "ADMIN") {
      const brand = await prisma.brand.findUnique({ where: { userId } });
      if (!brand || campaign.brandId !== brand.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    // Calculate summary from latest snapshot per post
    let totalReach = 0;
    let totalEngagement = 0;
    let totalImpressions = 0;
    let engagementRateSum = 0;
    let postCount = 0;

    for (const post of campaign.campaignPosts) {
      const latest = post.performanceSnapshots[0];
      if (latest) {
        totalReach += latest.reach ?? 0;
        totalImpressions += latest.impressions ?? 0;
        totalEngagement += latest.likeCount + latest.commentsCount;
        if (latest.engagementRate != null) {
          engagementRateSum += latest.engagementRate;
          postCount++;
        }
      }
    }

    const summary = {
      totalReach,
      totalEngagement,
      totalImpressions,
      avgEngagementRate: postCount > 0 ? parseFloat((engagementRateSum / postCount).toFixed(2)) : 0,
    };

    return NextResponse.json({ campaign, summary });
  } catch (error) {
    console.error("[GET /api/campaigns/[id]]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const body = await request.json();
    const { status } = body;

    if (!status || !Object.values(CampaignStatus).includes(status as CampaignStatus)) {
      return NextResponse.json({ error: "Valid status is required" }, { status: 400 });
    }

    // Verify ownership
    const brand = await prisma.brand.findUnique({ where: { userId } });
    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const existing = await prisma.campaign.findUnique({
      where: { id: params.id },
      select: { brandId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    if (existing.brandId !== brand.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const campaign = await prisma.campaign.update({
      where: { id: params.id },
      data: { status: status as CampaignStatus },
    });

    return NextResponse.json({ campaign });
  } catch (error) {
    console.error("[PUT /api/campaigns/[id]]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
