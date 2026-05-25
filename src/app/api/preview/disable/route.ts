import { NextResponse } from "next/server";
import { PREVIEW_COOKIE } from "@/lib/content";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(PREVIEW_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
