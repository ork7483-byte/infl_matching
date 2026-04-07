import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json() as { status: string; note?: string };

    if (!body.status) {
      return NextResponse.json({ error: "status is required" }, { status: 400 });
    }

    const validStatuses = ["PENDING", "PROCESSING", "COMPLETED", "FAILED"];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: `status must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = { status: body.status };
    if (body.note !== undefined) updateData.note = body.note;
    if (body.status === "COMPLETED") updateData.processedAt = new Date();

    const payment = await prisma.payment.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(payment);
  } catch (error) {
    console.error("[admin/revenue/payments/[id] PATCH]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
