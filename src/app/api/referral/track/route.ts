import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const BASE_URL = "https://inflmatching.vercel.app";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body as { code?: string };

    if (!code || typeof code !== "string" || code.trim() === "") {
      return NextResponse.json(
        { error: "code is required" },
        { status: 400 }
      );
    }

    const normalizedCode = code.trim().toUpperCase();

    // Find the user who owns this referral code
    const referrer = await prisma.user.findUnique({
      where: { referralCode: normalizedCode },
      select: { id: true },
    });

    if (!referrer) {
      return NextResponse.json(
        { error: "Invalid referral code" },
        { status: 404 }
      );
    }

    // Upsert: one pending referral record per code (until completed)
    const existing = await prisma.referral.findFirst({
      where: {
        referrerId: referrer.id,
        referralCode: normalizedCode,
        status: "pending",
      },
    });

    if (existing) {
      // Already tracked; idempotent response
      return NextResponse.json({ success: true, referralId: existing.id });
    }

    const referral = await prisma.referral.create({
      data: {
        referrerId: referrer.id,
        referralCode: normalizedCode,
        referralLink: `${BASE_URL}/invite/${normalizedCode}`,
        status: "pending",
      },
    });

    return NextResponse.json({ success: true, referralId: referral.id });
  } catch (error) {
    console.error("[POST /api/referral/track]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
