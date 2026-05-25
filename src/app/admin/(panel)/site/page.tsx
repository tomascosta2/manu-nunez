"use client";

import { useEffect } from "react";
import { useAdmin } from "../AdminProvider";
import { Card, Field, PageHeader, inputClass } from "../ui";

function validateWhatsapp(v: string): string | null {
  if (!v) return null;
  if (!/^\d{10,15}$/.test(v)) return "Solo dígitos, sin + ni espacios. Entre 10 y 15 caracteres.";
  return null;
}
function validateCalendly(v: string): string | null {
  if (!v) return null;
  if (!/^https:\/\/calendly\.com\/[^\s]+/.test(v)) return "Tiene que empezar con https://calendly.com/";
  return null;
}
function validatePixel(v: string): string | null {
  if (!v) return null;
  if (!/^\d{15,16}$/.test(v)) return "Meta Pixel ID son 15 o 16 dígitos.";
  return null;
}
function validateHotjar(v: string): string | null {
  if (!v) return null;
  if (!/^\d{6,8}$/.test(v)) return "Hotjar Site ID son 6 a 8 dígitos.";
  return null;
}

function FieldWithError({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[13px] font-medium text-neutral-700">{label}</label>
      {children}
      {error ? (
        <p className="text-[11px] text-red-600 leading-tight">{error}</p>
      ) : (
        hint && <p className="text-[11px] text-neutral-500 leading-tight">{hint}</p>
      )}
    </div>
  );
}

export default function SitePage() {
  const { content, setContent, setFieldError } = useAdmin();
  const sc = content.siteConfig ?? {};
  const update = (patch: Partial<NonNullable<typeof content.siteConfig>>) =>
    setContent({ ...content, siteConfig: { ...sc, ...patch } });

  const errWhatsapp = validateWhatsapp(sc.whatsappNumber ?? "");
  const errCalendly = validateCalendly(sc.calendlyUrl ?? "");
  const errPixel = validatePixel(sc.pixelId ?? "");
  const errHotjar = validateHotjar(sc.hotjarId ?? "");

  useEffect(() => {
    setFieldError("site.whatsapp", errWhatsapp);
    setFieldError("site.calendly", errCalendly);
    setFieldError("site.pixel", errPixel);
    setFieldError("site.hotjar", errHotjar);
    return () => {
      setFieldError("site.whatsapp", null);
      setFieldError("site.calendly", null);
      setFieldError("site.pixel", null);
      setFieldError("site.hotjar", null);
    };
  }, [errWhatsapp, errCalendly, errPixel, errHotjar, setFieldError]);

  const errCls = "border-red-500/60 focus:border-red-500";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configuración del sitio"
        description="Datos de contacto, calendario y trackers. No tienen A/B porque son técnicos."
      />
      <Card>
        <div className="space-y-5">
          <FieldWithError label="WhatsApp" hint="Sin + ni espacios. Ej: 59894782361" error={errWhatsapp}>
            <input
              className={inputClass + (errWhatsapp ? " " + errCls : "")}
              value={sc.whatsappNumber ?? ""}
              onChange={(e) => update({ whatsappNumber: e.target.value })}
              placeholder="59894782361"
            />
          </FieldWithError>
          <FieldWithError
            label="URL pública de Calendly"
            hint="Ej: https://calendly.com/mathi/diagnostico"
            error={errCalendly}
          >
            <input
              className={inputClass + (errCalendly ? " " + errCls : "")}
              value={sc.calendlyUrl ?? ""}
              onChange={(e) => update({ calendlyUrl: e.target.value })}
              placeholder="https://calendly.com/…"
            />
          </FieldWithError>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FieldWithError label="Meta Pixel ID" hint="Solo el ID. Vacío = no inicializa." error={errPixel}>
              <input
                className={inputClass + (errPixel ? " " + errCls : "")}
                value={sc.pixelId ?? ""}
                onChange={(e) => update({ pixelId: e.target.value })}
                inputMode="numeric"
              />
            </FieldWithError>
            <FieldWithError label="Hotjar Site ID" hint="Solo el número. Vacío = no inicializa." error={errHotjar}>
              <input
                className={inputClass + (errHotjar ? " " + errCls : "")}
                value={sc.hotjarId ?? ""}
                onChange={(e) => update({ hotjarId: e.target.value })}
                inputMode="numeric"
              />
            </FieldWithError>
          </div>
        </div>
      </Card>
    </div>
  );
}
