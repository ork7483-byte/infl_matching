import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function findOrCreateCreditBalance(userId: string) {
  const now = new Date();
  const nextMonthReset = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  let balance = await prisma.creditBalance.findUnique({ where: { userId } });

  if (!balance) {
    balance = await prisma.creditBalance.create({
      data: {
        userId,
        monthlyCredits: 3,
        bonusCredits: 0,
        usedThisMonth: 0,
        resetDate: nextMonthReset,
      },
    });
  } else if (balance.resetDate <= now) {
    // Reset monthly usage if past reset date
    balance = await prisma.creditBalance.update({
      where: { userId },
      data: {
        usedThisMonth: 0,
        resetDate: nextMonthReset,
      },
    });
  }

  return balance;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const balance = await findOrCreateCreditBalance(userId);

    const available =
      balance.monthlyCredits - balance.usedThisMonth + balance.bonusCredits;

    return NextResponse.json({
      balance: {
        ...balance,
        available: Math.max(0, available),
      },
    });
  } catch (error) {
    console.error("[GET /api/ai-studio/credits]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const body = await request.json();
    const { amount, price } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "amount must be a positive integer" }, { status: 400 });
    }
    if (price == null || price < 0) {
      return NextResponse.json({ error: "price must be a non-negative number" }, { status: 400 });
    }

    // Create purchase record
    const purchase = await prisma.creditPurchase.create({
      data: {
        userId,
        amount: parseInt(amount, 10),
        price: parseInt(price, 10),
        status: "completed",
      },
    });

    // Add to bonus credits
    const balance = await findOrCreateCreditBalance(userId);
    const updatedBalance = await prisma.creditBalance.update({
      where: { userId },
      data: { bonusCredits: balance.bonusCredits + purchase.amount },
    });

    const available =
      updatedBalance.monthlyCredits - updatedBalance.usedThisMonth + updatedBalance.bonusCredits;

    return NextResponse.json({
      purchase,
      balance: {
        ...updatedBalance,
        available: Math.max(0, available),
      },
    }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/ai-studio/credits]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
