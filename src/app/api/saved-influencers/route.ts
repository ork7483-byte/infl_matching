import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // SavedInfluencer model not yet in schema — return empty list as placeholder
    return NextResponse.json({ savedInfluencers: [] });
  } catch (error) {
    console.error("[GET /api/saved-influencers]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // SavedInfluencer model not yet in schema — return success as placeholder
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/saved-influencers]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
