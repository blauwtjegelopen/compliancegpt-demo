// apps/web/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // ✅ Allowlist the public demo route (no auth required)
  if (pathname.startsWith("/admin/demo")) {
    return NextResponse.next();
  }

  // (Optional) allow other public admin paths in the future:
  // if (pathname.startsWith("/admin/public")) return NextResponse.next();

  // 🔐 Require auth for the rest of /admin
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

// Protect /admin and nested routes (demo is allowlisted inside the middleware)
export const config = {
  matcher: ["/admin", "/admin/:path*"],
};