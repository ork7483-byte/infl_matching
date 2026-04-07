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
    const { searchParams } = request.nextUrl;

    const modelId = searchParams.get("modelId");
    const contentType = searchParams.get("contentType");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { userId, isSample: false };
    if (modelId) where.modelId = modelId;
    if (contentType) where.contentType = contentType;

    const [generations, total] = await Promise.all([
      prisma.aIGeneration.findMany({
        where,
        include: {
          model: {
            select: {
              id: true,
              name: true,
              nameEn: true,
              profileImage: true,
              gender: true,
              ageGroup: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.aIGeneration.count({ where }),
    ]);

    return NextResponse.json({
      generations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GET /api/ai-studio/my-content]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
