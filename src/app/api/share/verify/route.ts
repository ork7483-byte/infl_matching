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

    const userId = (session.user as { id: string }).id;

    const body = await request.json();
    const { shareActionId } = body as { shareActionId?: string };

    if (!shareActionId) {
      return NextResponse.json(
        { error: "shareActionId is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.shareAction.findUnique({
      where: { id: shareActionId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Share action not found" }, { status: 404 });
    }

    if (existing.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await prisma.shareAction.update({
      where: { id: shareActionId },
      data: {
        verified: true,
        rewardGiven: true,
        rewardType: "premium_mediakit",
      },
    });

    return NextResponse.json({
      success: true,
      shareActionId: updated.id,
      rewardType: updated.rewardType,
    });
  } catch (error) {
    console.error("[POST /api/share/verify]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
