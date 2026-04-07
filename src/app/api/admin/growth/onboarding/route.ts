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

    const userRole = (session.user as { role: string }).role;
    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [
      totalSignups,
      igConnected,
      aiMuseCreators,
      shareUsers,
    ] = await Promise.all([
      // Step 1: all users who signed up (any role)
      prisma.user.count(),
      // Step 2: creators who connected Instagram
      prisma.influencer.count({ where: { isOauthConnected: true } }),
      // Step 3: creators who have at least one portfolio item (AI Muse built)
      prisma.influencer.count({
        where: { portfolioItems: { some: {} } },
      }),
      // Step 4: users who shared at least once
      prisma.shareAction
        .groupBy({ by: ["userId"] })
        .then((rows) => rows.length),
    ]);

    const pct = (numerator: number) =>
      totalSignups > 0
        ? parseFloat(((numerator / totalSignups) * 100).toFixed(1))
        : 0;

    return NextResponse.json({
      funnel: [
        {
          step: "signup",
          label: "Signed Up",
          count: totalSignups,
          percentage: 100,
        },
        {
          step: "ig_connect",
          label: "Connected Instagram",
          count: igConnected,
          percentage: pct(igConnected),
        },
        {
          step: "ai_muse",
          label: "Built Media Kit",
          count: aiMuseCreators,
          percentage: pct(aiMuseCreators),
        },
        {
          step: "share",
          label: "Shared Once",
          count: shareUsers,
          percentage: pct(shareUsers),
        },
      ],
    });
  } catch (error) {
    console.error("[GET /api/admin/growth/onboarding]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
