import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { uploadImage } from "@/lib/blob";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  const c = await cookies();
  const ok = await verifySession(c.get(SESSION_COOKIE)?.value);
  if (!ok) return NextResponse.json({ ok: false, error: "no auth" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "file requerido" }, { status: 400 });
  }
  try {
    const url = await uploadImage(file);
    return NextResponse.json({ ok: true, url });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
