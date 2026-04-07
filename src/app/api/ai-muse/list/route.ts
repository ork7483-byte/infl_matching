import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const style = searchParams.get("style");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
    const skip = (page - 1) * limit;

    const clones = await prisma.aIMuse.findMany({
      where: {
        status: "active",
        isPublic: true,
        ...(style ? { styles: { has: style } } : {}),
        ...(category
          ? {
              influencer: {
                categories: { has: category },
              },
            }
          : {}),
      },
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
            location: true,
          },
        },
      },
      orderBy: { totalUsageCount: "desc" },
      skip,
      take: limit,
    });

    const total = await prisma.aIMuse.count({
      where: {
        status: "active",
        isPublic: true,
        ...(style ? { styles: { has: style } } : {}),
        ...(category
          ? {
              influencer: {
                categories: { has: category },
              },
            }
          : {}),
      },
    });

    return NextResponse.json({
      clones,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/ai-muse/list]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
