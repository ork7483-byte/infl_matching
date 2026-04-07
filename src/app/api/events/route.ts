import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/events — Public event tracking endpoint
 * Records user behavior events for marketing funnel analysis
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.eventType) {
      return NextResponse.json({ error: "eventType is required" }, { status: 400 });
    }

    // Input validation
    const ALLOWED_EVENT_TYPES = [
      "page_view", "search", "filter_change", "gallery_view", "profile_view",
      "signup_start", "signup_complete", "login", "pricing_view", "cta_click",
      "tool_use", "onboarding_step", "referral_click", "contact_submit",
    ];
    const eventType = String(body.eventType).slice(0, 100);
    if (!ALLOWED_EVENT_TYPES.includes(eventType)) {
      return NextResponse.json({ error: "Invalid eventType" }, { status: 400 });
    }

    // Limit metadata size
    const metadata = body.metadata || null;
    if (metadata && JSON.stringify(metadata).length > 4096) {
      return NextResponse.json({ error: "metadata too large" }, { status: 400 });
    }

    const event = await prisma.eventLog.create({
      data: {
        eventType,
        userId: body.userId ? String(body.userId).slice(0, 100) : null,
        sessionId: body.sessionId ? String(body.sessionId).slice(0, 100) : null,
        path: body.path ? String(body.path).slice(0, 500) : null,
        metadata,
        utmSource: body.utmSource ? String(body.utmSource).slice(0, 200) : null,
        utmMedium: body.utmMedium ? String(body.utmMedium).slice(0, 200) : null,
        utmCampaign: body.utmCampaign ? String(body.utmCampaign).slice(0, 200) : null,
      },
    });

    return NextResponse.json({ id: event.id }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/events]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
