import { NextRequest, NextResponse } from "next/server";

const CATEGORY_MULTIPLIERS: Record<string, number> = {
  fashion: 1.2,
  beauty: 1.15,
  fitness: 1.1,
  food: 1.0,
  travel: 1.1,
  tech: 1.25,
  lifestyle: 1.0,
  gaming: 1.15,
  default: 1.0,
};

function getTier(followers: number): { tier: string; label: string } {
  if (followers < 10_000) return { tier: "nano", label: "Nano (1K–10K)" };
  if (followers < 100_000) return { tier: "micro", label: "Micro (10K–100K)" };
  if (followers < 500_000) return { tier: "mid", label: "Mid-tier (100K–500K)" };
  if (followers < 1_000_000) return { tier: "macro", label: "Macro (500K–1M)" };
  return { tier: "mega", label: "Mega (1M+)" };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const followersParam = searchParams.get("followers");
    const category = searchParams.get("category") ?? "default";

    if (!followersParam) {
      return NextResponse.json(
        { error: "followers query parameter is required" },
        { status: 400 }
      );
    }

    const followers = parseInt(followersParam, 10);
    if (isNaN(followers) || followers < 0) {
      return NextResponse.json(
        { error: "followers must be a non-negative integer" },
        { status: 400 }
      );
    }

    const multiplier =
      CATEGORY_MULTIPLIERS[category.toLowerCase()] ??
      CATEGORY_MULTIPLIERS["default"];

    const baseFeed = (followers / 1000) * 10000;
    const baseReel = (followers * 0.3 / 1000) * 20000;
    const baseStory = (followers / 1000) * 5000;

    const applyVariance = (base: number, mult: number) => ({
      min: Math.round(base * mult * 0.8),
      base: Math.round(base * mult),
      max: Math.round(base * mult * 1.3),
    });

    const { tier, label } = getTier(followers);

    return NextResponse.json({
      followers,
      category,
      tier,
      tierLabel: label,
      pricing: {
        feedPost: applyVariance(baseFeed, multiplier),
        reel: applyVariance(baseReel, multiplier),
        story: applyVariance(baseStory, multiplier),
      },
      note: "Prices in KRW. Ranges reflect engagement quality variance.",
    });
  } catch (error) {
    console.error("[GET /api/tools/price-calculator]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
