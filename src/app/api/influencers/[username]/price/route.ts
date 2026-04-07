import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const isAuthenticated = !!session;

    if (!isAuthenticated) {
      return NextResponse.json({ data: null, _blurred: true });
    }

    const influencer = await prisma.influencer.findUnique({
      where: { username: params.username },
      select: { id: true },
    });

    if (!influencer) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }

    // Get latest prediction per contentType
    const predictions = await prisma.pricePrediction.findMany({
      where: { influencerId: influencer.id },
      orderBy: { calculatedAt: "desc" },
    });

    // Deduplicate: keep the most recent entry for each contentType
    const seen = new Set<string>();
    const latestPerContentType = predictions.filter((p) => {
      const key = p.contentType ?? "__null__";
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return NextResponse.json({ data: latestPerContentType });
  } catch (error) {
    console.error("[GET /api/influencers/[username]/price]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
