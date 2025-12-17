import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 🔐 Read auth from cookie
  const token = req.cookies.get("accessToken")?.value;

  // ❌ Block dashboard without login
  if (pathname.startsWith("/admin") && !token) {
    return NextResponse.redirect(
      new URL("/", req.url)
    );
  }

  // 🔁 Logged-in user should not see login/signup
  if (
    (pathname === "/" || pathname === "/") &&
    token
  ) {
    return NextResponse.redirect(
      new URL("/admin", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
  ],
};
