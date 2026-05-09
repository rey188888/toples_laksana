import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Skip login page
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    const secret = getJwtSecret();
    if (!secret) throw new Error("JWT_SECRET not set");
    
    await jose.jwtVerify(token, secret);
    return NextResponse.next();
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
