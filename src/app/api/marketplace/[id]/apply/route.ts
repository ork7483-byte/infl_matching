import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const userRole = (session.user as { role: string }).role;

    if (userRole !== "CREATOR") {
      return NextResponse.json({ error: "Only creators can apply to campaigns" }, { status: 403 });
    }

    const influencer = await prisma.influencer.findUnique({
      where: { userId },
    });
    if (!influencer) {
      return NextResponse.json({ error: "Influencer profile not found" }, { status: 404 });
    }

    const campaign = await prisma.campaign.findUnique({
      where: { id: params.id },
    });
    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    const body = await request.json();
    const { message, expectedReach } = body as {
      message?: string;
      expectedReach?: number;
    };

    const existingApplication = await prisma.campaignApplication.findUnique({
      where: {
        campaignId_influencerId: {
          campaignId: params.id,
          influencerId: influencer.id,
        },
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied to this campaign" },
        { status: 409 }
      );
    }

    const application = await prisma.campaignApplication.create({
      data: {
        campaignId: params.id,
        influencerId: influencer.id,
        message: message ?? null,
        expectedReach: expectedReach ?? null,
      },
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/marketplace/[id]/apply]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
