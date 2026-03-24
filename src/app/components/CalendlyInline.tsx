"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const CALENDLY_URL = "https://calendly.com/sarlomanuel33/30min";
const CALL_SHEDULED_TEST = "https://n8n.srv953925.hstgr.cloud/webhook-test/2db9bfb5-0323-4d9e-aa37-dfded650a180";
const CALL_SHEDULED = "https://n8n.srv953925.hstgr.cloud/webhook/2db9bfb5-0323-4d9e-aa37-dfded650a180";

const getCookieValue = (cookieName: string) => {
  if (typeof document === "undefined") return "";
  const name = cookieName + "=";
  const decodedCookie = decodeURIComponent(document.cookie || "");
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim();
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return "";
};

const ensureFbcFromFbclid = () => {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const fbclid = params.get("fbclid");
  if (!fbclid) return;
  const existing = getCookieValue("_fbc");
  if (existing) {
    try { localStorage.setItem("_fbc", existing); } catch {}
    return;
  }
  const fbc = `fb.1.${Date.now()}.${fbclid}`;
  const isLocalhost =
    window.location.hostname.includes("localhost") ||
    window.location.hostname.includes("127.0.0.1");
  const cookie = isLocalhost
    ? `_fbc=${fbc}; path=/; SameSite=Lax`
    : `_fbc=${fbc}; path=/; SameSite=None; Secure`;
  document.cookie = cookie;
  try { localStorage.setItem("_fbc", fbc); } catch {}
};

const fireFbq = (
  eventName: string,
  eventId: string,
  payload: Record<string, unknown> = {},
  onSuccess?: () => void
) => {
  let attempts = 0;
  const tryFire = () => {
    attempts += 1;
    const fbq = (window as any)?.fbq;
    if (typeof fbq === "function") {
      try {
        fbq("track", eventName, payload, { eventID: eventId });
        onSuccess?.();
      } catch {}
      return;
    }
    if (attempts < 10) setTimeout(tryFire, 200);
  };
  tryFire();
};

type Props = {
  name: string;
  email: string;
  phone: string;
};

export default function CalendlyInline({ name, email, phone }: Props) {
  const [frameLoaded, setFrameLoaded] = useState(false);

  const emailRef = useRef(email);
  const phoneRef = useRef(phone);

  useEffect(() => { emailRef.current = email; }, [email]);
  useEffect(() => { phoneRef.current = phone; }, [phone]);

  useEffect(() => {
    ensureFbcFromFbclid();
    try {
      const fbp = getCookieValue("_fbp");
      const fbc = getCookieValue("_fbc");
      if (fbp) localStorage.setItem("_fbp", fbp);
      if (fbc) localStorage.setItem("_fbc", fbc);
    } catch {}
  }, []);

  // Lead Pixel (dedup con CAPI) al montar si es calificado
  useEffect(() => {
    try {
      const isQualified = localStorage.getItem("isQualified");
      if (isQualified !== "true") return;

      const alreadyFired = localStorage.getItem("lead_fired");
      if (alreadyFired) return;

      const leadEventId =
        localStorage.getItem("lead_event_id") ||
        `lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      fireFbq("Lead", leadEventId, {}, () => {
        localStorage.setItem("lead_fired", leadEventId);
        localStorage.removeItem("lead_event_id");
      });
    } catch {}
  }, []);

  // Listener de eventos de Calendly
  useEffect(() => {
    const handleCalendlyEvent = (e: MessageEvent) => {
      const origin = (e.origin || "").toLowerCase();
      if (!origin.endsWith("calendly.com")) return;

      if (e.data?.event === "calendly.event_scheduled") {
        const currentEmail = emailRef.current;
        const currentPhone = phoneRef.current;
        const isLocalhost =
          window.location.hostname.includes("localhost") ||
          window.location.hostname.includes("127.0.0.1");

        fetch(isLocalhost ? CALL_SHEDULED_TEST : CALL_SHEDULED, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: currentEmail, phone: currentPhone }),
        }).catch(() => {});

        const isQualified = localStorage.getItem("isQualified");
        const fbp = getCookieValue("_fbp") || localStorage.getItem("_fbp") || null;
        const fbc = getCookieValue("_fbc") || localStorage.getItem("_fbc") || null;

        if (isQualified === "true") {
          const eventId = `schedule-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
          localStorage.setItem("schedule_event_id", eventId);

          const scheduleFired = localStorage.getItem("schedule_fired");
          if (scheduleFired !== "true") {
            fireFbq("Schedule", eventId, {}, () => {
              localStorage.setItem("schedule_fired", "true");
            });
          }

          fetch("/api/track/qualified-shedule", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              eventName: "Schedule",
              email: currentEmail,
              phone: currentPhone,
              fbp,
              fbc,
              eventId,
            }),
          }).catch(() => {});
        }

        setTimeout(() => {
          window.location.href = "/pages/thankyou";
        }, 600);
      }
    };

    window.addEventListener("message", handleCalendlyEvent);
    return () => window.removeEventListener("message", handleCalendlyEvent);
  }, []);

  // URL fija al montar
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const calendlyUrl = useMemo(() => {
    const domain = typeof window !== "undefined" ? window.location.hostname : "localhost";
    return `${CALENDLY_URL}?hide_gdpr_banner=1&embed_type=InlineWidget&embed_domain=${domain}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;
  }, []);

  return (
    <main>
      <section className="pt-8 pb-[80px]">
        <div className="max-w-[1200px] mx-auto px-4">
          <h1 className="text-[24px] md:text-[32px] font-bold leading-[120%] max-w-[800px] mb-8 mx-auto text-center">
            <span className="text-[#0051ff]">¡Último paso!</span> Elegí una fecha
            y hora que te queden cómodas y empezá hoy mismo!
          </h1>

          <div className="gap-8">
            <div className="bg-white w-full min-h-[600px] rounded-lg overflow-clip relative">
              {!frameLoaded && (
                <div className="absolute inset-0 animate-pulse bg-gray-100">
                  <div className="h-10 w-3/4 mx-auto mt-6 rounded bg-gray-200" />
                  <div className="h-6 w-1/2 mx-auto mt-4 rounded bg-gray-200" />
                  <div className="h-[560px] mt-6 mx-4 rounded-lg bg-gray-200" />
                </div>
              )}

              <iframe
                key="calendly"
                title="Calendly Inline"
                src={calendlyUrl}
                loading="eager"
                width="100%"
                height="800"
                className="w-full h-[800px] border-0"
                onLoad={() => setFrameLoaded(true)}
                referrerPolicy="no-referrer-when-downgrade"
                allow="clipboard-write; geolocation; microphone; camera"
              />
            </div>

            <p className="text-center mt-4 mx-auto">
              En caso de no encontrar horarios disponibles escribime por WhatsApp al{" "}
              <a
                className="underline text-blue-500"
                href="https://wa.me/5492216720769"
                target="_blank"
                rel="noreferrer"
              >
                +54 9 2216720769
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
