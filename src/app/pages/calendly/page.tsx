"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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

  // si ya existe _fbc, no lo pisamos
  const existing = getCookieValue("_fbc");
  if (existing) {
    try {
      localStorage.setItem("_fbc", existing);
    } catch {}
    return;
  }

  const fbc = `fb.1.${Date.now()}.${fbclid}`;

  // En localhost, Secure no funciona en http
  const isLocalhost =
    window.location.hostname.includes("localhost") ||
    window.location.hostname.includes("127.0.0.1");

  const cookie = isLocalhost
    ? `_fbc=${fbc}; path=/; SameSite=Lax`
    : `_fbc=${fbc}; path=/; SameSite=None; Secure`;

  document.cookie = cookie;

  try {
    localStorage.setItem("_fbc", fbc);
  } catch {}
};

export default function CalendlyFast() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [frameLoaded, setFrameLoaded] = useState(false);

  // refs para evitar "stale state" dentro del listener
  const emailRef = useRef("");
  const phoneRef = useRef("");

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

  // Prefill desde localStorage + asegurar cookies fbp/fbc
  useEffect(() => {
    ensureFbcFromFbclid();

    const n = localStorage.getItem("name") || "";
    const e = localStorage.getItem("email") || "";
    const p = localStorage.getItem("phone") || "";

    setName(n);
    setEmail(e);
    setPhone(p);

    emailRef.current = e;
    phoneRef.current = p;

    // guardar fbp/fbc en localStorage (debug/consistencia)
    try {
      const fbp = getCookieValue("_fbp");
      const fbc = getCookieValue("_fbc");
      if (fbp) localStorage.setItem("_fbp", fbp);
      if (fbc) localStorage.setItem("_fbc", fbc);
    } catch {}
  }, []);

  useEffect(() => {
    emailRef.current = email;
  }, [email]);

  useEffect(() => {
    phoneRef.current = phone;
  }, [phone]);

  const hostname = typeof window !== "undefined" ? window.location.hostname : "";
  const isLocalhost =
    hostname.includes("localhost") || hostname.includes("127.0.0.1");
  // Ojo: hostname.endsWith(".local") no te sirve para localhost común
  const isLocalEnv = isLocalhost || hostname.endsWith(".local");

  // Lead Pixel (dedup con CAPI) al entrar si es calificado
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
      // Calendly puede emitir desde calendly.com o subdominios
      const origin = (e.origin || "").toLowerCase();
      if (!origin.endsWith("calendly.com")) return;

      if (e.data?.event === "calendly.event_scheduled") {
        const currentEmail = emailRef.current;
        const currentPhone = phoneRef.current;

        const webhookCallScheduled = isLocalhost
          ? "https://n8n.srv953925.hstgr.cloud/webhook-test/2db9bfb5-0323-4d9e-aa37-dfded650a180"
          : "https://n8n.srv953925.hstgr.cloud/webhook/2db9bfb5-0323-4d9e-aa37-dfded650a180";

        // Webhook n8n
        fetch(webhookCallScheduled, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: currentEmail,
            phone: currentPhone,
          }),
        }).catch((err) => console.error("Tracking error:", err));

        const isQualified = localStorage.getItem("isQualified");

        // ✅ Leer desde cookies (fuente real) + fallback localStorage
        const fbpCookie = getCookieValue("_fbp");
        const fbcCookie = getCookieValue("_fbc");
        const fbp = fbpCookie || localStorage.getItem("_fbp") || null;
        const fbc = fbcCookie || localStorage.getItem("_fbc") || null;

        // Debug (sacalo después)
        console.log("[Calendly scheduled]", {
          hostname,
          isQualified,
          email: currentEmail,
          phone: currentPhone,
          fbp,
          fbc,
        });

        if (isQualified === "true") {
          const eventId = `schedule-${Date.now()}-${Math.random()
            .toString(36)
            .slice(2, 8)}`;

          localStorage.setItem("schedule_event_id", eventId);

          // CAPI sólo si NO estamos en local
          if (!isLocalEnv) {
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
            }).catch((err) => console.error("Qualified schedule error:", err));
          } else {
            console.log("No se envió evento a API: entorno local");
          }

          // Pixel Schedule (dedup con CAPI)
          const scheduleFired = localStorage.getItem("schedule_fired");
          if (scheduleFired !== "true") {
            fireFbq("Schedule", eventId, {}, () => {
              localStorage.setItem("schedule_fired", "true");
            });
          }
        } else {
          console.log("No se envió evento: no calificado");
        }

        setTimeout(() => {
          window.location.href = "/pages/thankyou";
        }, 600);
      }
    };

    window.addEventListener("message", handleCalendlyEvent);
    return () => window.removeEventListener("message", handleCalendlyEvent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // URL Calendly (corregida: sin comillas raras y sin doble ?)
  const calendlyUrl = useMemo(() => {
    const base = "https://calendly.com/sarlomanuel33/30min";

    const params = new URLSearchParams({
      hide_gdpr_banner: "1",
      embed_type: "InlineWidget",
      embed_domain: typeof window !== "undefined" ? window.location.hostname : "",
      name,
      email,
    });

    return `${base}?${params.toString()}`;
  }, [name, email]);

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
                key={calendlyUrl}
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