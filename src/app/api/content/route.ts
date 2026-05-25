import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getContent, saveContent, type Content } from "@/lib/content";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  const data = await getContent();
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  const c = await cookies();
  const ok = await verifySession(c.get(SESSION_COOKIE)?.value);
  if (!ok) return NextResponse.json({ ok: false, error: "no auth" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as Content | null;
  if (!body) return NextResponse.json({ ok: false, error: "body inválido" }, { status: 400 });

  try {
    await saveContent(body);
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/content PUT] saveContent failed:", msg);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
