import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";
import { PREVIEW_COOKIE } from "@/lib/content";

export async function POST() {
  const c = await cookies();
  const ok = await verifySession(c.get(SESSION_COOKIE)?.value);
  if (!ok) return NextResponse.json({ ok: false }, { status: 401 });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(PREVIEW_COOKIE, "1", {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 4,
  });
  return res;
}
