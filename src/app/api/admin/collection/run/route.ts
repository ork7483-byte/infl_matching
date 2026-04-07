import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { runCollection } from "@/lib/collection";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const limit = typeof body?.limit === "number" && body.limit > 0 ? body.limit : 10;

    const result = await runCollection(limit);

    return NextResponse.json({
      processed: result.processed,
      success: result.success,
      failed: result.failed,
      newDiscovered: result.newDiscovered,
      durationMs: result.durationMs,
    });
  } catch (error) {
    console.error("[admin/collection/run]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
