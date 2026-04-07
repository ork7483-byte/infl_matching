import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const EXPERIMENTS = [
  {
    id: "exp-1",
    name: "랜딩 CTA 색상",
    status: "running",
    variantA: { name: "퍼플", conversions: 45, total: 500, rate: 9.0 },
    variantB: { name: "그린", conversions: 52, total: 500, rate: 10.4 },
    winner: "B",
    confidence: 87,
  },
  {
    id: "exp-2",
    name: "가입 단계 수",
    status: "completed",
    variantA: { name: "3단계", conversions: 120, total: 1000, rate: 12.0 },
    variantB: { name: "2단계", conversions: 145, total: 1000, rate: 14.5 },
    winner: "B",
    confidence: 95,
  },
  {
    id: "exp-3",
    name: "무료 체험 표시",
    status: "draft",
    variantA: { name: "현재", conversions: 0, total: 0, rate: 0 },
    variantB: { name: "강조형", conversions: 0, total: 0, rate: 0 },
    winner: null,
    confidence: 0,
  },
];

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as { role: string }).role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    return NextResponse.json({ experiments: EXPERIMENTS });
  } catch (error) {
    console.error("[admin/marketing/lab/experiments]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
