import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ENV_VARS = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "INSTAGRAM_CLIENT_ID",
  "INSTAGRAM_CLIENT_SECRET",
  "INSTAGRAM_APP_ID",
  "INSTAGRAM_APP_SECRET",
];

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const igToken = await prisma.apiToken.findUnique({
      where: { provider: "instagram" },
      select: { expiresAt: true, refreshedAt: true, createdAt: true },
    });

    let tokenStatus: {
      found: boolean;
      expiresAt: string | null;
      daysRemaining: number | null;
      isValid: boolean;
    } = { found: false, expiresAt: null, daysRemaining: null, isValid: false };

    if (igToken) {
      const now = new Date();
      const daysRemaining = Math.floor(
        (igToken.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      tokenStatus = {
        found: true,
        expiresAt: igToken.expiresAt.toISOString(),
        daysRemaining,
        isValid: daysRemaining > 0,
      };
    }

    const envVarsStatus = ENV_VARS.map((name) => ({
      name,
      isSet: Boolean(process.env[name]),
    }));

    return NextResponse.json({
      igToken: tokenStatus,
      envVars: envVarsStatus,
      appInfo: {
        nodeEnv: process.env.NODE_ENV,
        nextAuthUrl: process.env.NEXTAUTH_URL
          ? process.env.NEXTAUTH_URL.replace(/\/\/.*@/, "//***@")
          : null,
        checkedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[admin/system/status]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
