import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string; role: string }).id;
    const role = (session.user as { id: string; role: string }).role;

    if (role !== "CREATOR") {
      return NextResponse.json({ error: "Only creators can disable their AI clone" }, { status: 403 });
    }

    const influencer = await prisma.influencer.findUnique({
      where: { userId },
    });

    if (!influencer) {
      return NextResponse.json({ error: "Influencer profile not found" }, { status: 404 });
    }

    const clone = await prisma.aIMuse.findUnique({
      where: { influencerId: influencer.id },
    });

    if (!clone) {
      return NextResponse.json({ error: "AI clone not found" }, { status: 404 });
    }

    if (clone.status === "disabled") {
      return NextResponse.json({ error: "AI clone is already disabled" }, { status: 400 });
    }

    const updatedClone = await prisma.aIMuse.update({
      where: { id: clone.id },
      data: {
        isPublic: false,
        status: "disabled",
      },
    });

    return NextResponse.json({ clone: updatedClone });
  } catch (error) {
    console.error("[POST /api/ai-muse/disable]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
