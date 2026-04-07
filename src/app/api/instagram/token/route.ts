import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { refreshLongLivedToken } from "@/lib/instagram";

/**
 * POST /api/instagram/token/refresh
 * Refreshes the current long-lived Instagram access token.
 *
 * The new token is returned in the response — update INSTAGRAM_ACCESS_TOKEN
 * in your environment manually. Env vars are not auto-updated by this endpoint.
 *
 * Requires authentication.
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    if (!currentToken) {
      return NextResponse.json(
        { error: "INSTAGRAM_ACCESS_TOKEN is not configured" },
        { status: 503 }
      );
    }

    const result = await refreshLongLivedToken(currentToken);

    return NextResponse.json({
      ok: true,
      token_type: result.token_type,
      expires_in: result.expires_in,
      // Return the token so the operator can update the env var.
      // Do not log this value — treat it as a secret.
      access_token: result.access_token,
      note: "Update INSTAGRAM_ACCESS_TOKEN in your environment with the new access_token above.",
    });
  } catch (error) {
    console.error("[POST /api/instagram/token/refresh]", error);
    return NextResponse.json({ error: "Failed to refresh token" }, { status: 500 });
  }
}
