import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createCloneForInfluencer } from "@/lib/ai-clone";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string; role: string }).id;
    const role = (session.user as { id: string; role: string }).role;

    if (role !== "CREATOR") {
      return NextResponse.json({ error: "Only creators can create an AI clone" }, { status: 403 });
    }

    const influencer = await prisma.influencer.findUnique({
      where: { userId },
    });

    if (!influencer) {
      return NextResponse.json({ error: "Influencer profile not found" }, { status: 404 });
    }

    // Prevent duplicate clone
    const existing = await prisma.aIClone.findUnique({
      where: { influencerId: influencer.id },
    });

    if (existing) {
      return NextResponse.json({ error: "AI clone already exists", clone: existing }, { status: 409 });
    }

    const clone = await createCloneForInfluencer(influencer.id);

    return NextResponse.json({ clone }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/ai-clone/create]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
