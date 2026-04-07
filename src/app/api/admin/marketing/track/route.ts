import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      path: string;
      utmSource?: string;
      utmMedium?: string;
      utmCampaign?: string;
      utmContent?: string;
      referrer?: string;
    };

    if (!body.path || typeof body.path !== "string") {
      return NextResponse.json({ error: "path is required" }, { status: 400 });
    }

    const visit = await prisma.pageVisit.create({
      data: {
        path: body.path,
        utmSource: body.utmSource ?? null,
        utmMedium: body.utmMedium ?? null,
        utmCampaign: body.utmCampaign ?? null,
        utmContent: body.utmContent ?? null,
        referrer: body.referrer ?? null,
      },
    });

    return NextResponse.json(visit, { status: 201 });
  } catch (error) {
    console.error("[admin/marketing/track]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
