import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

interface RegisterBody {
  email: string;
  password: string;
  name?: string;
  role: "BRAND" | "CREATOR";
  companyName?: string;
  industry?: string;
  website?: string;
  username?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: RegisterBody = await req.json();
    const { email, password, name, role, companyName, industry, website, username } = body;

    // Validate required fields
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "email, password, and role are required" },
        { status: 400 }
      );
    }

    // Runtime role validation (TypeScript types are NOT runtime checks)
    if (role !== "BRAND" && role !== "CREATOR") {
      return NextResponse.json(
        { error: "role must be BRAND or CREATOR" },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Password strength validation
    if (password.length < 6 || password.length > 128) {
      return NextResponse.json(
        { error: "Password must be between 6 and 128 characters" },
        { status: 400 }
      );
    }

    if (role === "BRAND" && !companyName) {
      return NextResponse.json(
        { error: "companyName is required for BRAND role" },
        { status: 400 }
      );
    }

    if (role === "CREATOR" && !username) {
      return NextResponse.json(
        { error: "username is required for CREATOR role" },
        { status: 400 }
      );
    }

    // Check email uniqueness
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email is already in use" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name ?? null,
        role,
        ...(role === "BRAND" && companyName
          ? {
              brand: {
                create: {
                  companyName,
                  industry: industry ?? null,
                  website: website ?? null,
                },
              },
            }
          : {}),
        ...(role === "CREATOR" && username
          ? {
              influencer: {
                create: {
                  username,
                },
              },
            }
          : {}),
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (role === "BRAND") {
      try {
        await prisma.creditBalance.create({
          data: {
            userId: user.id,
            monthlyCredits: 3,
            bonusCredits: 5,
            usedThisMonth: 0,
            resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
          },
        });
      } catch (creditError) {
        // CreditBalance may already exist; log and continue
        console.warn("[register] creditBalance creation skipped:", creditError);
      }
    }

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("[register] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
