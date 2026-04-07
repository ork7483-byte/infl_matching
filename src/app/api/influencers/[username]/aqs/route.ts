import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function getAqsGradeColor(score: number): string {
  if (score >= 75) return "green";
  if (score >= 50) return "yellow";
  if (score >= 25) return "orange";
  return "red";
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const isAuthenticated = !!session;

    const influencer = await prisma.influencer.findUnique({
      where: { username: params.username },
      select: { id: true },
    });

    if (!influencer) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }

    const latestAqs = await prisma.aqsScore.findFirst({
      where: { influencerId: influencer.id },
      orderBy: { calculatedAt: "desc" },
    });

    if (!latestAqs) {
      return NextResponse.json({ data: null });
    }

    if (!isAuthenticated) {
      return NextResponse.json({
        data: {
          gradeColor: getAqsGradeColor(latestAqs.totalScore),
        },
        _blurred: true,
      });
    }

    return NextResponse.json({ data: latestAqs });
  } catch (error) {
    console.error("[GET /api/influencers/[username]/aqs]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
