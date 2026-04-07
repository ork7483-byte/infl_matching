import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface NotifyBody {
  target: "all" | "brand" | "creator";
  title: string;
  content: string;
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body: NotifyBody = await request.json();
    const { target, title, content } = body;

    if (!target || !title || !content) {
      return NextResponse.json(
        { error: "target, title, content are required" },
        { status: 400 }
      );
    }

    const validTargets = ["all", "brand", "creator"];
    if (!validTargets.includes(target)) {
      return NextResponse.json(
        { error: "target must be one of: all, brand, creator" },
        { status: 400 }
      );
    }

    let whereClause: Record<string, unknown> = {};
    if (target === "brand") {
      whereClause = { role: "BRAND" };
    } else if (target === "creator") {
      whereClause = { role: "CREATOR" };
    }

    const sent = await prisma.user.count({ where: whereClause });

    return NextResponse.json({
      ok: true,
      sent,
      note: "알림 발송 기능은 준비 중입니다",
    });
  } catch (error) {
    console.error("[admin/marketing/lab/notify]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
