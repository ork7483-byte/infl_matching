import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role as string | undefined;

    if (role === "BRAND" && pathname.startsWith("/dashboard/creator")) {
      return NextResponse.redirect(new URL("/dashboard/brand", req.url));
    }

    if (role === "CREATOR" && pathname.startsWith("/dashboard/brand")) {
      return NextResponse.redirect(new URL("/dashboard/creator", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*"],
};
