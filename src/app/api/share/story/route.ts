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

    let shareUrl: string | undefined;
    try {
      const body = await request.json();
      shareUrl = body?.shareUrl;
    } catch {
      // body is optional
    }

    const shareAction = await prisma.shareAction.create({
      data: {
        userId,
        shareType: "instagram_story",
        shareUrl: shareUrl ?? null,
      },
    });

    return NextResponse.json({ success: true, id: shareAction.id }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/share/story]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
