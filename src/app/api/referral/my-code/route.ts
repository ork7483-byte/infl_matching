import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const BASE_URL = "https://inflmatching.vercel.app";
const CODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const CODE_LENGTH = 6;

function generateCode(): string {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_CHARS.charAt(Math.floor(Math.random() * CODE_CHARS.length));
  }
  return code;
}

async function getUniqueCode(): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = generateCode();
    const existing = await prisma.user.findUnique({
      where: { referralCode: code },
      select: { id: true },
    });
    if (!existing) return code;
  }
  // Fallback: append timestamp suffix to guarantee uniqueness
  return generateCode() + Date.now().toString(36).toUpperCase().slice(-2);
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    let user = await prisma.user.findUnique({
      where: { id: userId },
      select: { referralCode: true, referralCount: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.referralCode) {
      const code = await getUniqueCode();
      user = await prisma.user.update({
        where: { id: userId },
        data: { referralCode: code },
        select: { referralCode: true, referralCount: true },
      });
    }

    const code = user.referralCode!;

    const [totalInvited, completed] = await Promise.all([
      prisma.referral.count({ where: { referrerId: userId } }),
      prisma.referral.count({ where: { referrerId: userId, status: "completed" } }),
    ]);

    return NextResponse.json({
      code,
      link: `${BASE_URL}/invite/${code}`,
      stats: { totalInvited, completed },
    });
  } catch (error) {
    console.error("[GET /api/referral/my-code]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
