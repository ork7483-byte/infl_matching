import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import path from "path";
import fs from "fs";

interface SeedGroup {
  category: string;
  usernames: string[];
}

interface SeedsFile {
  seeds: SeedGroup[];
}

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const filePath = path.join(process.cwd(), "data", "collection-seeds.json");

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "collection-seeds.json not found at /data/collection-seeds.json" },
        { status: 404 }
      );
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed: SeedsFile = JSON.parse(raw);

    if (!Array.isArray(parsed?.seeds)) {
      return NextResponse.json(
        { error: "Invalid seeds file format: expected { seeds: [...] }" },
        { status: 400 }
      );
    }

    let added = 0;
    let skipped = 0;
    let total = 0;

    for (const group of parsed.seeds) {
      const { category, usernames } = group;

      if (!Array.isArray(usernames)) continue;

      for (const raw of usernames) {
        if (typeof raw !== "string" || !raw.trim()) continue;
        const username = raw.trim().toLowerCase();
        total++;

        try {
          const existing = await prisma.collectionSeed.findUnique({
            where: { username },
            select: { id: true },
          });

          if (existing) {
            skipped++;
            continue;
          }

          await prisma.collectionSeed.create({
            data: {
              username,
              category: category ?? null,
              source: "initial",
              status: "pending",
            },
          });
          added++;
        } catch {
          skipped++;
        }
      }
    }

    return NextResponse.json({ added, skipped, total });
  } catch (error) {
    console.error("[admin/collection/init]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
