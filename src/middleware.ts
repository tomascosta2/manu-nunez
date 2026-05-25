import { NextResponse, type NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";
import { AB_COOKIE } from "@/lib/ab-cookie";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  // 1. Sticky A/B variant — set on first visit, persists 180 días
  const existing = req.cookies.get(AB_COOKIE)?.value;
  if (existing !== "A" && existing !== "B") {
    const v = Math.random() < 0.5 ? "A" : "B";
    res.cookies.set(AB_COOKIE, v, {
      path: "/",
      maxAge: 60 * 60 * 24 * 180,
      sameSite: "lax",
    });
  }

  // 2. Admin auth
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = req.cookies.get(SESSION_COOKIE)?.value;
    const ok = await verifySession(token);
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon|.*\\..*).*)"],
};
