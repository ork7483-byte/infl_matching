import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const [recentUsers, recentCampaigns] = await Promise.all([
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          plan: true,
          createdAt: true,
        },
      }),
      prisma.campaign.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          status: true,
          budget: true,
          createdAt: true,
          brand: {
            select: { companyName: true },
          },
        },
      }),
    ]);

    return NextResponse.json({ recentUsers, recentCampaigns });
  } catch (error) {
    console.error("[admin/dashboard/recent]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
