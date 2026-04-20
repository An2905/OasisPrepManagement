import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth-constants";

function redirectToLogin(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.searchParams.set("next", req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get(SESSION_COOKIE)?.value ?? "";

  if (pathname.startsWith("/admin")) {
    if (!token) return redirectToLogin(req);
  }

  if (pathname.startsWith("/staff")) {
    if (!token) return redirectToLogin(req);
  }

  if (pathname === "/login" && token) {
    // Defer role-based redirect to /api/auth/me on client; keep middleware cheap.
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/staff/:path*", "/login"],
};

