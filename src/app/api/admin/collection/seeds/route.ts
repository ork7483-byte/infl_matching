import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") ?? undefined;
    const category = searchParams.get("category") ?? undefined;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
    const skip = (page - 1) * limit;

    const where = {
      ...(status ? { status } : {}),
      ...(category ? { category } : {}),
    };

    const [seeds, total] = await Promise.all([
      prisma.collectionSeed.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.collectionSeed.count({ where }),
    ]);

    return NextResponse.json({
      seeds,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[admin/collection/seeds GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const usernames: unknown = body?.usernames;
    const category: string | undefined =
      typeof body?.category === "string" ? body.category : undefined;

    if (!Array.isArray(usernames) || usernames.length === 0) {
      return NextResponse.json(
        { error: "usernames must be a non-empty array" },
        { status: 400 }
      );
    }

    const validUsernames = usernames
      .filter((u): u is string => typeof u === "string" && u.trim().length > 0)
      .map((u) => u.trim().toLowerCase());

    if (validUsernames.length === 0) {
      return NextResponse.json(
        { error: "No valid usernames provided" },
        { status: 400 }
      );
    }

    // Add with source="initial" and optional category override
    let added = 0;
    for (const username of validUsernames) {
      try {
        await prisma.collectionSeed.upsert({
          where: { username },
          create: {
            username,
            category: category ?? null,
            source: "initial",
            status: "pending",
          },
          update: {},
        });
        added++;
      } catch {
        // Skip duplicates
      }
    }

    return NextResponse.json({ added, total: validUsernames.length });
  } catch (error) {
    console.error("[admin/collection/seeds POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
