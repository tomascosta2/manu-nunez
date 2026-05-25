import { NextResponse } from "next/server";
import { signSession, verifyPassword, SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({}));
  if (typeof password !== "string" || !password) {
    return NextResponse.json({ ok: false, error: "Password requerido" }, { status: 400 });
  }
  const ok = await verifyPassword(password);
  if (!ok) {
    return NextResponse.json({ ok: false, error: "Password incorrecto" }, { status: 401 });
  }
  const token = await signSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
