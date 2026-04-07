import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const GRAPH_API = "https://graph.facebook.com/v25.0";

/**
 * POST /api/instagram/token
 *
 * Actions:
 * - { action: "exchange" } — 단기 토큰 → 장기 토큰 교환 (60일)
 * - { action: "refresh" }  — 장기 토큰 갱신 (만료 전 실행)
 * - { action: "status" }   — 현재 토큰 상태 조회
 * - { action: "check" }    — 만료 7일 전이면 자동 갱신
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const action = body.action || "status";

    const appId = process.env.META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;

    switch (action) {
      // ─── 단기 → 장기 토큰 교환 ─────────────────────────────
      case "exchange": {
        const shortToken = body.token || process.env.INSTAGRAM_ACCESS_TOKEN;
        if (!shortToken || !appId || !appSecret) {
          return NextResponse.json(
            { error: "Missing token, META_APP_ID, or META_APP_SECRET" },
            { status: 400 }
          );
        }

        const url = `${GRAPH_API}/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortToken}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.error) {
          return NextResponse.json(
            { error: data.error.message, type: data.error.type },
            { status: 400 }
          );
        }

        // DB에 저장
        const expiresAt = new Date(Date.now() + data.expires_in * 1000);
        await prisma.apiToken.upsert({
          where: { provider: "instagram" },
          update: {
            accessToken: data.access_token,
            tokenType: data.token_type || "bearer",
            expiresAt,
            refreshedAt: new Date(),
          },
          create: {
            provider: "instagram",
            accessToken: data.access_token,
            tokenType: data.token_type || "bearer",
            expiresAt,
          },
        });

        return NextResponse.json({
          ok: true,
          action: "exchange",
          access_token: data.access_token,
          expires_in: data.expires_in,
          expires_at: expiresAt.toISOString(),
          saved_to_db: true,
          note: "장기 토큰이 DB에 저장되었습니다. Vercel 환경변수도 업데이트하세요.",
        });
      }

      // ─── 장기 토큰 갱신 ─────────────────────────────────────
      case "refresh": {
        const dbToken = await prisma.apiToken.findUnique({
          where: { provider: "instagram" },
        });
        const currentToken = dbToken?.accessToken || process.env.INSTAGRAM_ACCESS_TOKEN;

        if (!currentToken) {
          return NextResponse.json(
            { error: "No token found in DB or environment" },
            { status: 400 }
          );
        }

        const url = `${GRAPH_API}/oauth/access_token?grant_type=ig_exchange_token&access_token=${currentToken}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.error) {
          return NextResponse.json(
            { error: data.error.message, type: data.error.type },
            { status: 400 }
          );
        }

        const expiresAt = new Date(Date.now() + data.expires_in * 1000);
        await prisma.apiToken.upsert({
          where: { provider: "instagram" },
          update: {
            accessToken: data.access_token,
            tokenType: data.token_type || "bearer",
            expiresAt,
            refreshedAt: new Date(),
          },
          create: {
            provider: "instagram",
            accessToken: data.access_token,
            tokenType: data.token_type || "bearer",
            expiresAt,
          },
        });

        return NextResponse.json({
          ok: true,
          action: "refresh",
          access_token: data.access_token,
          expires_in: data.expires_in,
          expires_at: expiresAt.toISOString(),
          saved_to_db: true,
        });
      }

      // ─── 토큰 상태 조회 ────────────────────────────────────
      case "status": {
        const dbToken = await prisma.apiToken.findUnique({
          where: { provider: "instagram" },
        });

        if (!dbToken) {
          return NextResponse.json({
            ok: true,
            action: "status",
            source: "environment",
            has_env_token: !!process.env.INSTAGRAM_ACCESS_TOKEN,
            db_token: null,
            note: "DB에 저장된 토큰이 없습니다. exchange를 먼저 실행하세요.",
          });
        }

        const now = new Date();
        const daysUntilExpiry = Math.floor(
          (dbToken.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        const needsRefresh = daysUntilExpiry <= 7;

        return NextResponse.json({
          ok: true,
          action: "status",
          source: "database",
          expires_at: dbToken.expiresAt.toISOString(),
          days_until_expiry: daysUntilExpiry,
          needs_refresh: needsRefresh,
          last_refreshed: dbToken.refreshedAt.toISOString(),
        });
      }

      // ─── 자동 체크 + 갱신 ──────────────────────────────────
      case "check": {
        const dbToken = await prisma.apiToken.findUnique({
          where: { provider: "instagram" },
        });

        if (!dbToken) {
          return NextResponse.json({
            ok: true,
            action: "check",
            refreshed: false,
            reason: "No token in DB",
          });
        }

        const now = new Date();
        const daysUntilExpiry = Math.floor(
          (dbToken.expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        // 7일 이상 남았으면 갱신 불필요
        if (daysUntilExpiry > 7) {
          return NextResponse.json({
            ok: true,
            action: "check",
            refreshed: false,
            reason: `Token still valid for ${daysUntilExpiry} days`,
            expires_at: dbToken.expiresAt.toISOString(),
          });
        }

        // 자동 갱신 실행
        const url = `${GRAPH_API}/oauth/access_token?grant_type=ig_exchange_token&access_token=${dbToken.accessToken}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.error) {
          return NextResponse.json({
            ok: false,
            action: "check",
            refreshed: false,
            error: data.error.message,
          });
        }

        const expiresAt = new Date(Date.now() + data.expires_in * 1000);
        await prisma.apiToken.update({
          where: { provider: "instagram" },
          data: {
            accessToken: data.access_token,
            expiresAt,
            refreshedAt: new Date(),
          },
        });

        return NextResponse.json({
          ok: true,
          action: "check",
          refreshed: true,
          new_expires_at: expiresAt.toISOString(),
          days_gained: Math.floor(data.expires_in / 86400),
        });
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}. Use: exchange, refresh, status, check` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("[POST /api/instagram/token]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
