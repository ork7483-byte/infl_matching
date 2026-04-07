import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: { influencerId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { influencerId } = params;

    // Verify the user owns this influencer profile
    const influencer = await prisma.influencer.findUnique({
      where: { id: influencerId },
      select: { userId: true },
    });
    if (!influencer) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }
    if (influencer.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const payments = await prisma.payment.findMany({
      where: { influencerId },
      include: {
        campaignInfluencer: {
          include: {
            campaign: {
              include: {
                brand: {
                  select: {
                    companyName: true,
                    logoUrl: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { requestedAt: "desc" },
    });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let totalEarnings = 0;
    let thisMonthEarnings = 0;
    let pendingAmount = 0;
    let completedAmount = 0;

    const monthlyMap = new Map<string, number>();

    for (const payment of payments) {
      if (payment.status === "COMPLETED") {
        totalEarnings += payment.amount;
        completedAmount += payment.amount;

        const monthKey = payment.requestedAt.toISOString().slice(0, 7);
        monthlyMap.set(monthKey, (monthlyMap.get(monthKey) ?? 0) + payment.amount);
      }

      if (payment.status === "PENDING" || payment.status === "PROCESSING") {
        pendingAmount += payment.amount;
      }

      if (
        payment.status === "COMPLETED" &&
        payment.requestedAt >= startOfMonth
      ) {
        thisMonthEarnings += payment.amount;
      }
    }

    const monthlyEarnings = Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, amount]) => ({ month, amount: parseFloat(amount.toFixed(2)) }));

    const paymentList = payments.map((p) => ({
      id: p.id,
      amount: p.amount,
      status: p.status,
      requestedAt: p.requestedAt,
      processedAt: p.processedAt,
      note: p.note,
      campaign: {
        id: p.campaignInfluencer.campaign.id,
        name: p.campaignInfluencer.campaign.name,
        brand: p.campaignInfluencer.campaign.brand,
      },
    }));

    return NextResponse.json({
      influencerId,
      summary: {
        totalEarnings: parseFloat(totalEarnings.toFixed(2)),
        thisMonthEarnings: parseFloat(thisMonthEarnings.toFixed(2)),
        pendingAmount: parseFloat(pendingAmount.toFixed(2)),
        completedAmount: parseFloat(completedAmount.toFixed(2)),
      },
      monthlyEarnings,
      payments: paymentList,
    });
  } catch (error) {
    console.error("[GET /api/earnings/[influencerId]]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
