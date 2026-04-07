import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RewardType } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const category = searchParams.get("category");
    const rewardTypeParam = searchParams.get("rewardType");
    const sortBy = searchParams.get("sortBy") ?? "newest";

    const rewardTypeFilter =
      rewardTypeParam &&
      Object.values(RewardType).includes(rewardTypeParam as RewardType)
        ? (rewardTypeParam as RewardType)
        : undefined;

    const orderBy = (() => {
      switch (sortBy) {
        case "deadline":
          return { endDate: "asc" as const };
        case "reward":
          return { rewardAmount: "desc" as const };
        default:
          return { createdAt: "desc" as const };
      }
    })();

    const campaigns = await prisma.campaign.findMany({
      where: {
        isPublic: true,
        status: "ACTIVE",
        ...(category ? { category } : {}),
        ...(rewardTypeFilter ? { rewardType: rewardTypeFilter } : {}),
      },
      include: {
        brand: {
          select: {
            companyName: true,
            logoUrl: true,
          },
        },
        _count: {
          select: { campaignApplications: true },
        },
      },
      orderBy,
    });

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error("[GET /api/marketplace]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
