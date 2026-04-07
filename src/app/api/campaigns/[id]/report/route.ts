import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const format = searchParams.get("format") ?? "json";

    const campaign = await prisma.campaign.findUnique({
      where: { id: params.id },
      include: {
        brand: { select: { companyName: true } },
        campaignInfluencers: {
          include: {
            influencer: {
              select: {
                id: true,
                username: true,
                fullName: true,
                profilePicUrl: true,
                followersCount: true,
                avgEngagementRate: true,
                categories: true,
                audienceDemographics: {
                  orderBy: { collectedAt: "desc" },
                  take: 50,
                },
              },
            },
          },
        },
        campaignPosts: {
          include: {
            performanceSnapshots: {
              orderBy: { snapshotAt: "desc" },
            },
          },
        },
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    // Build per-influencer stats
    const influencerMap = new Map<
      string,
      {
        influencer: (typeof campaign.campaignInfluencers)[number]["influencer"];
        agreedFee: number | null;
        reach: number;
        impressions: number;
        likes: number;
        comments: number;
        posts: number;
      }
    >();

    for (const ci of campaign.campaignInfluencers) {
      influencerMap.set(ci.influencerId, {
        influencer: ci.influencer,
        agreedFee: ci.agreedFee,
        reach: 0,
        impressions: 0,
        likes: 0,
        comments: 0,
        posts: 0,
      });
    }

    // Build per-post stats and roll up to influencer
    const perPost = campaign.campaignPosts.map((post) => {
      const latest = post.performanceSnapshots[0];
      const reach = latest?.reach ?? 0;
      const impressions = latest?.impressions ?? 0;
      const likes = latest?.likeCount ?? 0;
      const comments = latest?.commentsCount ?? 0;
      const engagementRate = latest?.engagementRate ?? null;

      const entry = influencerMap.get(post.influencerId);
      if (entry) {
        entry.reach += reach;
        entry.impressions += impressions;
        entry.likes += likes;
        entry.comments += comments;
        entry.posts += 1;
      }

      return {
        postId: post.id,
        influencerId: post.influencerId,
        igMediaId: post.igMediaId,
        permalink: post.permalink,
        postedAt: post.postedAt,
        reach,
        impressions,
        likes,
        comments,
        engagementRate,
      };
    });

    // Summary
    let totalReach = 0;
    let totalImpressions = 0;
    let totalEngagement = 0;
    let totalFee = 0;

    Array.from(influencerMap.values()).forEach((entry) => {
      totalReach += entry.reach;
      totalImpressions += entry.impressions;
      totalEngagement += entry.likes + entry.comments;
      totalFee += entry.agreedFee ?? 0;
    });

    const summary = {
      campaignId: campaign.id,
      campaignName: campaign.name,
      brandName: campaign.brand.companyName,
      status: campaign.status,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      totalInfluencers: campaign.campaignInfluencers.length,
      totalPosts: campaign.campaignPosts.length,
      totalReach,
      totalImpressions,
      totalEngagement,
      avgEngagementRate:
        totalReach > 0 ? parseFloat(((totalEngagement / totalReach) * 100).toFixed(2)) : 0,
      totalBudget: campaign.budget,
      totalAgreedFee: totalFee,
    };

    const perInfluencer = Array.from(influencerMap.values()).map((entry) => ({
      influencer: entry.influencer,
      agreedFee: entry.agreedFee,
      posts: entry.posts,
      reach: entry.reach,
      impressions: entry.impressions,
      engagement: entry.likes + entry.comments,
      engagementRate:
        entry.reach > 0
          ? parseFloat((((entry.likes + entry.comments) / entry.reach) * 100).toFixed(2))
          : 0,
    }));

    // Audience data (aggregated from all influencers' demographics)
    const audienceMap = new Map<string, { breakdownType: string; breakdownKey: string; value: number; count: number }>();
    for (const ci of campaign.campaignInfluencers) {
      for (const demo of ci.influencer.audienceDemographics) {
        const key = `${demo.breakdownType}::${demo.breakdownKey}`;
        const existing = audienceMap.get(key);
        if (existing) {
          existing.value += demo.value;
          existing.count += 1;
        } else {
          audienceMap.set(key, {
            breakdownType: demo.breakdownType,
            breakdownKey: demo.breakdownKey,
            value: demo.value,
            count: 1,
          });
        }
      }
    }

    const audience = Array.from(audienceMap.values()).map((a) => ({
      breakdownType: a.breakdownType,
      breakdownKey: a.breakdownKey,
      avgValue: parseFloat((a.value / a.count).toFixed(2)),
    }));

    // ROI
    const roi = {
      totalAgreedFee: totalFee,
      costPerReach: totalReach > 0 ? parseFloat((totalFee / totalReach).toFixed(4)) : null,
      costPerEngagement: totalEngagement > 0 ? parseFloat((totalFee / totalEngagement).toFixed(4)) : null,
      costPerImpression: totalImpressions > 0 ? parseFloat((totalFee / totalImpressions).toFixed(4)) : null,
    };

    const reportData = { summary, perInfluencer, perPost, audience, roi };

    if (format === "json") {
      return NextResponse.json(reportData);
    }

    // PDF / Excel: placeholder — return JSON until generators are implemented
    return NextResponse.json({
      message: `${format.toUpperCase()} generation not yet implemented. Returning JSON data.`,
      ...reportData,
    });
  } catch (error) {
    console.error("[GET /api/campaigns/[id]/report]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
