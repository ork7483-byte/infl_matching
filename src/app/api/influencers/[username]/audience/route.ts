import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
// NOTE: Audience demographics require the influencer's own OAuth token
// (instagram_manage_insights permission). The getAudienceDemographics()
// function in src/lib/instagram.ts can be called once a creator connects
// their account. Until then, this route returns whatever is stored in DB.

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

    const demographics = await prisma.audienceDemographic.findMany({
      where: { influencerId: influencer.id },
      orderBy: [{ breakdownType: "asc" }, { value: "desc" }],
    });

    // Group by breakdownType
    const grouped: Record<string, { breakdownKey: string; value: number; collectedAt: Date }[]> = {};
    for (const item of demographics) {
      if (!grouped[item.breakdownType]) {
        grouped[item.breakdownType] = [];
      }
      grouped[item.breakdownType].push({
        breakdownKey: item.breakdownKey,
        value: item.value,
        collectedAt: item.collectedAt,
      });
    }

    return NextResponse.json({
      data: grouped,
      source: "database",
      // For fresh audience data, connect the creator's Instagram account
      // so their OAuth token can be used with getAudienceDemographics().
    });
  } catch (error) {
    console.error("[GET /api/influencers/[username]/audience]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
