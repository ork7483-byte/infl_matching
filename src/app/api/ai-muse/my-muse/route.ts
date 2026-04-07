import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string; role: string }).id;
    const role = (session.user as { id: string; role: string }).role;

    if (role !== "CREATOR") {
      return NextResponse.json({ error: "Only creators can access this endpoint" }, { status: 403 });
    }

    const influencer = await prisma.influencer.findUnique({
      where: { userId },
    });

    if (!influencer) {
      return NextResponse.json({ error: "Influencer profile not found" }, { status: 404 });
    }

    const clone = await prisma.aIMuse.findUnique({
      where: { influencerId: influencer.id },
      include: {
        revenues: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        usageLogs: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!clone) {
      return NextResponse.json({ error: "AI clone not found" }, { status: 404 });
    }

    return NextResponse.json({
      clone: {
        ...clone,
        totalEarnings: clone.totalEarnings,
        totalUsageCount: clone.totalUsageCount,
      },
    });
  } catch (error) {
    console.error("[GET /api/ai-muse/my-muse]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
