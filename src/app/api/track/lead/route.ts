import { NextResponse } from 'next/server';
import { getContent } from '@/lib/content';

export async function POST(req: Request) {
  const data = await req.json();

  if (!data.email || !data.phone) {
    return NextResponse.json({ success: false, error: "Faltan email o phone" }, { status: 400 });
  }

  const content = await getContent();
  const pixelId = (content.siteConfig?.pixelId ?? '').replace(/[^0-9]/g, '');
  const accessToken = content.siteConfig?.metaCapiToken || process.env.API_ACCESS_TOKEN;
  const testCode = content.siteConfig?.metaCapiTestCode || undefined;
  if (!pixelId || !accessToken) {
    return NextResponse.json({ success: true, skipped: 'no_pixel_or_token' });
  }

  const hashEmail = await hashSHA256(data.email);
  const hashPhone = await hashSHA256(data.phone);

  const response = await fetch(
    `https://graph.facebook.com/v22.0/${pixelId}/events?access_token=${accessToken}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [
          {
            event_id: data.eventId ?? `lead-${Date.now()}`,
            event_name: 'Lead',
            event_time: Math.floor(Date.now() / 1000),
            action_source: 'website',
            user_data: {
              em: [hashEmail],
              ph: [hashPhone],
              fbp: data.fbp,
              fbc: data.fbc,
              client_user_agent: req.headers.get('user-agent') ?? '',
              client_ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '',
            },
          },
        ],
        ...(testCode ? { test_event_code: testCode } : {}),
      }),
    }
  );

  const result = await response.json();
  console.log("[track/lead] Meta response:", result);

  return NextResponse.json({ success: true });
}

async function hashSHA256(value: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(value.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}
