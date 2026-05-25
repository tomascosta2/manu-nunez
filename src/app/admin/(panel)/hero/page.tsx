"use client";

import { useAdmin } from "../AdminProvider";
import { ABInput, Card, Field, ImageInput, PageHeader } from "../ui";

export default function HeroPage() {
  const { content, setContent } = useAdmin();
  const update = (patch: Partial<NonNullable<typeof content.hero>>) =>
    setContent({ ...content, hero: { ...content.hero, ...patch } });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hero (home)"
        description="Lo primero que ve el visitante en la home."
      />

      <Card>
        <h3 className="font-semibold text-neutral-900 mb-1">Barra de social proof</h3>
        <p className="text-[12px] text-neutral-500 mb-4">
          Estrellas + texto + imagen que aparecen arriba del headline.
        </p>
        <div className="space-y-4">
          <Field label="Mostrar la barra completa">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={content.hero?.socialProofVisible ?? true}
                onChange={(e) => update({ socialProofVisible: e.target.checked })}
              />
              <span>Visible</span>
            </label>
          </Field>
          <Field label="Mostrar las 5 estrellas">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={content.hero?.showStars ?? true}
                onChange={(e) => update({ showStars: e.target.checked })}
              />
              <span>Visible</span>
            </label>
          </Field>
          <ABInput
            testId="hero.eyebrow"
            label="Texto"
            hint='Ej: "+100 PROFESIONALES TRANSFORMADOS".'
            value={content.hero?.eyebrow}
            onChange={(eyebrow) => update({ eyebrow })}
          />
          <Field
            label="Imagen"
            hint="Si la dejás vacía se usan los 5 avatares por defecto (avatar-1 a 5). Si subís una imagen, la reemplaza."
          >
            <ImageInput
              value={content.hero?.socialProofImageUrl}
              onChange={(socialProofImageUrl) => update({ socialProofImageUrl })}
            />
          </Field>
        </div>
      </Card>

      <Card>
        <div className="space-y-5">
          <ABInput
            testId="hero.headline"
            label="Headline"
            hint="Usá **doble asterisco** para resaltar palabras en color naranja."
            value={content.hero?.headline}
            onChange={(headline) => update({ headline })}
            multiline
            showAccentPreview
          />
          <ABInput
            testId="hero.description"
            label="Descripción debajo del headline"
            hint='Texto chico que aparece debajo del headline. Ej: "Con mi Método Impulso Profesional — Sin Dietas Extremas ni Rutinas Imposibles."'
            value={content.hero?.description}
            onChange={(description) => update({ description })}
            multiline
          />
          <ABInput
            testId="hero.vslEmbedUrl"
            label="URL del VSL"
            hint="Pegá el link del iframe embed (Wistia / Pandavideo / YouTube)."
            value={content.hero?.vslEmbedUrl}
            onChange={(vslEmbedUrl) => update({ vslEmbedUrl })}
          />
          <ABInput
            testId="hero.ctaText"
            label="Texto del botón principal (CTA)"
            value={content.hero?.ctaText}
            onChange={(ctaText) => update({ ctaText })}
          />
          <ABInput
            testId="hero.guaranteeText"
            label="Texto chico debajo del CTA (garantía)"
            value={content.hero?.guaranteeText}
            onChange={(guaranteeText) => update({ guaranteeText })}
          />
          <ABInput
            testId="hero.pdText"
            label="Texto PD"
            value={content.hero?.pdText}
            onChange={(pdText) => update({ pdText })}
            multiline
          />
        </div>
      </Card>
    </div>
  );
}
