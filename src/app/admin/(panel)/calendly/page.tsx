"use client";

import { useAdmin } from "../AdminProvider";
import { ABInput, Card, Field, PageHeader, inputClass } from "../ui";

function validateCalendly(v: string): string | null {
  if (!v) return null;
  if (!/^https:\/\/calendly\.com\/[^\s]+/.test(v)) return "Tiene que empezar con https://calendly.com/";
  return null;
}

export default function CalendlyPage() {
  const { content, setContent } = useAdmin();
  const update = (patch: Partial<NonNullable<typeof content.calendlyPage>>) =>
    setContent({ ...content, calendlyPage: { ...content.calendlyPage, ...patch } });
  const updateSite = (patch: Partial<NonNullable<typeof content.siteConfig>>) =>
    setContent({ ...content, siteConfig: { ...content.siteConfig, ...patch } });

  const url = content.siteConfig?.calendlyUrl ?? "";
  const errUrl = validateCalendly(url);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Página /pages/calendly"
        description="La página donde el lead califica y agenda su llamada."
      />

      <Card>
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-neutral-700">URL pública de Calendly</label>
          <input
            className={inputClass + (errUrl ? " border-red-500/60 focus:border-red-500" : "")}
            value={url}
            onChange={(e) => updateSite({ calendlyUrl: e.target.value })}
            placeholder="https://calendly.com/…"
          />
          {errUrl ? (
            <p className="text-[11px] text-red-600 leading-tight">{errUrl}</p>
          ) : (
            <p className="text-[11px] text-neutral-500 leading-tight">
              También se edita en <a href="/admin/site" className="underline hover:text-neutral-800">Sitio</a>. Ejemplo: https://calendly.com/mathi/diagnostico
            </p>
          )}
        </div>
      </Card>

      <Card>
        <div className="space-y-5">
          <ABInput
            testId="calendlyPage.title"
            label="Título"
            value={content.calendlyPage?.title}
            onChange={(title) => update({ title })}
          />
          <ABInput
            testId="calendlyPage.subtitle"
            label="Subtítulo"
            value={content.calendlyPage?.subtitle}
            onChange={(subtitle) => update({ subtitle })}
          />
          <ABInput
            testId="calendlyPage.pdText"
            label="Aviso debajo del calendario (PD)"
            hint="Aparece debajo del iframe del Calendly."
            value={content.calendlyPage?.pdText}
            onChange={(pdText) => update({ pdText })}
            multiline
          />
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold text-neutral-900 mb-4">Calendly inline (después del form)</h3>
        <p className="text-[11px] text-neutral-500 mb-4">
          Cuando el lead completa el form en la home, se muestra Calendly inline (sin pasar por /pages/calendly).
          Acá editás los textos de esa vista.
        </p>
        <div className="space-y-5">
          <ABInput
            testId="calendlyPage.eyebrow"
            label="Eyebrow (texto chico arriba del título)"
            hint='Solo se muestra en /pages/calendly. Ej: "Reservá tu lugar".'
            value={content.calendlyPage?.eyebrow}
            onChange={(eyebrow) => update({ eyebrow })}
          />
          <ABInput
            testId="calendlyPage.urgentHeadline"
            label="Headline urgente (Calendly inline post-form)"
            hint='Ej: "¡Último paso! Elegí una fecha y hora...". Solo se muestra cuando el lead completa el form en la home.'
            value={content.calendlyPage?.urgentHeadline}
            onChange={(urgentHeadline) => update({ urgentHeadline })}
            multiline
          />
        </div>
      </Card>
    </div>
  );
}
