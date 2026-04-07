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

    const event = await prisma.eventLog.create({
      data: {
        eventType: body.eventType,
        userId: body.userId || null,
        sessionId: body.sessionId || null,
        path: body.path || null,
        metadata: body.metadata || null,
        utmSource: body.utmSource || null,
        utmMedium: body.utmMedium || null,
        utmCampaign: body.utmCampaign || null,
      },
    });

    return NextResponse.json({ id: event.id }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/events]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
