import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const isAuthenticated = !!session;

    const { searchParams } = request.nextUrl;
    const requestedLimit = Math.max(1, parseInt(searchParams.get("limit") ?? "24", 10));
    const effectiveLimit = isAuthenticated ? requestedLimit : Math.min(requestedLimit, 3);

    const influencer = await prisma.influencer.findUnique({
      where: { username: params.username },
      select: { id: true },
    });

    if (!influencer) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }

    const posts = await prisma.mediaSnapshot.findMany({
      where: { influencerId: influencer.id },
      orderBy: { postedAt: "desc" },
      take: effectiveLimit,
    });

    if (!isAuthenticated) {
      return NextResponse.json({
        data: posts.map((post) => ({
          id: post.id,
          igMediaId: post.igMediaId,
          mediaType: post.mediaType,
          caption: post.caption,
          thumbnailUrl: post.thumbnailUrl,
          permalink: post.permalink,
          postedAt: post.postedAt,
          collectedAt: post.collectedAt,
          likeCount: null,
          commentsCount: null,
          reach: null,
          impressions: null,
          saved: null,
          shares: null,
        })),
        _blurred: true,
      });
    }

    return NextResponse.json({ data: posts });
  } catch (error) {
    console.error("[GET /api/influencers/[username]/posts]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
