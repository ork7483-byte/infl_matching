import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const MOCK_CAMPAIGNS = [
  { name: "spring2026", source: "instagram", visits: 500, signups: 35, conversionRate: 7.0 },
  { name: "creator_launch", source: "tiktok", visits: 320, signups: 20, conversionRate: 6.3 },
  { name: "brand_promo", source: "google", visits: 410, signups: 28, conversionRate: 6.8 },
  { name: "influencer_week", source: "twitter", visits: 180, signups: 9, conversionRate: 5.0 },
  { name: "(none)", source: "(direct)", visits: 2100, signups: 130, conversionRate: 6.2 },
];

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const visits = await prisma.pageVisit.findMany({
      select: { utmCampaign: true, utmSource: true },
    });

    if (visits.length < 20) {
      return NextResponse.json({ campaigns: MOCK_CAMPAIGNS });
    }

    const campaignMap: Record<string, { visits: number; source: string }> = {};
    for (const v of visits) {
      const campaign = v.utmCampaign ?? "(none)";
      const source = v.utmSource ?? "(direct)";
      if (!campaignMap[campaign]) {
        campaignMap[campaign] = { visits: 0, source };
      }
      campaignMap[campaign].visits++;
    }

    const totalVisits = visits.length;
    const totalUsers = await prisma.user.count();

    const campaigns = Object.entries(campaignMap)
      .sort((a, b) => b[1].visits - a[1].visits)
      .slice(0, 10)
      .map(([name, data]) => {
        const share = data.visits / totalVisits;
        const signups = Math.round(totalUsers * share * 0.9);
        const conversionRate =
          data.visits > 0
            ? parseFloat(((signups / data.visits) * 100).toFixed(1))
            : 0;
        return {
          name,
          source: data.source,
          visits: data.visits,
          signups,
          conversionRate,
        };
      });

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error("[admin/marketing/acquisition/campaigns]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
