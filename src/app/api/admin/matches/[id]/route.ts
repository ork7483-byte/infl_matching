import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { role: string }).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, adminNote, contactedAt, respondedAt, rejectionReason } = body;

    const existing = await prisma.matchRequest.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "MatchRequest not found" }, { status: 404 });
    }

    const updated = await prisma.matchRequest.update({
      where: { id },
      data: {
        ...(status !== undefined && { status }),
        ...(adminNote !== undefined && { adminNote }),
        ...(contactedAt !== undefined && { contactedAt: contactedAt ? new Date(contactedAt) : null }),
        ...(respondedAt !== undefined && { respondedAt: respondedAt ? new Date(respondedAt) : null }),
        ...(rejectionReason !== undefined && { rejectionReason }),
      },
    });

    return NextResponse.json({ matchRequest: updated });
  } catch (error) {
    console.error("[PATCH /api/admin/matches/[id]]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
