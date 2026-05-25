"use client";

import { useAdmin } from "../AdminProvider";
import { ABInput, Card, EmptyState, Field, GhostButton, ImageInput, PageHeader, PrimaryButton, SortableList, inputClass, newId } from "../ui";
import type { ResultGalleryItem } from "@/lib/content";

export default function GaleriaPage() {
  const { content, setContent, confirm } = useAdmin();
  const items = content.resultGallery ?? [];
  const updateSection = (patch: Partial<NonNullable<typeof content.homeSections>>) =>
    setContent({ ...content, homeSections: { ...content.homeSections, ...patch } });
  const updateEyebrows = (patch: Partial<NonNullable<typeof content.sectionEyebrows>>) =>
    setContent({ ...content, sectionEyebrows: { ...content.sectionEyebrows, ...patch } });

  const reorder = (next: ResultGalleryItem[]) => setContent({ ...content, resultGallery: next });
  const update = (id: string, patch: Partial<ResultGalleryItem>) =>
    setContent({ ...content, resultGallery: items.map((x) => (x._id === id ? { ...x, ...patch } : x)) });
  const remove = async (id: string) => {
    const ok = await confirm({
      title: "¿Eliminar este resultado?",
      description: "La imagen sigue subida en Blob, pero deja de aparecer en el funnel.",
      confirmLabel: "Eliminar",
      danger: true,
    });
    if (!ok) return;
    setContent({ ...content, resultGallery: items.filter((x) => x._id !== id) });
  };
  const add = () =>
    setContent({ ...content, resultGallery: [...items, { _id: newId(), weight: "", beforeImageUrl: "", afterImageUrl: "" }] });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Galería de resultados"
        description="Cambios físicos antes/después que aparecen en la home. Arrastrá para reordenar."
      />

      <Card>
        <h3 className="font-semibold text-neutral-900 mb-4">Textos de la sección</h3>
        <div className="space-y-5">
          <ABInput
            testId="sectionEyebrows.results"
            label="Eyebrow (texto chico arriba del título)"
            value={content.sectionEyebrows?.results}
            onChange={(results) => updateEyebrows({ results })}
          />
          <ABInput
            testId="homeSections.resultsHeadline"
            label="Headline (título de la sección)"
            hint='Usá **doble asterisco** para resaltar palabras.'
            value={content.homeSections?.resultsHeadline}
            onChange={(resultsHeadline) => updateSection({ resultsHeadline })}
            multiline
            showAccentPreview
          />
          <ABInput
            testId="homeSections.resultsSubheading"
            label="Subtítulo debajo del headline"
            value={content.homeSections?.resultsSubheading}
            onChange={(resultsSubheading) => updateSection({ resultsSubheading })}
            multiline
          />
          <ABInput
            testId="homeSections.resultsOverlayLabel"
            label='Label del card "Tu próximo cambio"'
            value={content.homeSections?.resultsOverlayLabel}
            onChange={(resultsOverlayLabel) => updateSection({ resultsOverlayLabel })}
          />
          <ABInput
            testId="homeSections.resultsCalloutText"
            label="Texto sobre el collage final"
            value={content.homeSections?.resultsCalloutText}
            onChange={(resultsCalloutText) => updateSection({ resultsCalloutText })}
          />
          <ABInput
            testId="homeSections.resultsFinalCtaSubtext"
            label="Texto chico debajo del CTA final"
            value={content.homeSections?.resultsFinalCtaSubtext}
            onChange={(resultsFinalCtaSubtext) => updateSection({ resultsFinalCtaSubtext })}
            multiline
          />
        </div>
      </Card>

      {items.length === 0 ? (
        <EmptyState
          icon="▣"
          title="Galería vacía"
          description="Subí fotos antes/después con el peso bajado. Las imágenes se sirven desde Vercel Blob."
          action={<PrimaryButton onClick={add}>+ Agregar resultado</PrimaryButton>}
        />
      ) : (
        <>
          <SortableList
            items={items}
            onReorder={reorder}
            renderItem={(r, i) => (
              <div className="ml-2 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400 font-mono">#{i + 1}</span>
                  <GhostButton danger onClick={() => remove(r._id)}>Eliminar</GhostButton>
                </div>
                <Field label="Texto del cambio" hint='Ej: "-8 KG en 3 Meses"'>
                  <input
                    className={inputClass}
                    value={r.weight ?? ""}
                    onChange={(e) => update(r._id, { weight: e.target.value })}
                  />
                </Field>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Antes">
                    <ImageInput value={r.beforeImageUrl} onChange={(url) => update(r._id, { beforeImageUrl: url })} />
                  </Field>
                  <Field label="Después">
                    <ImageInput value={r.afterImageUrl} onChange={(url) => update(r._id, { afterImageUrl: url })} />
                  </Field>
                </div>
                {r.imageUrl && !r.beforeImageUrl && !r.afterImageUrl && (
                  <Field label="Imagen legacy" hint="Esta imagen quedó del formato anterior. Subí antes/después arriba para reemplazarla.">
                    <ImageInput value={r.imageUrl} onChange={(url) => update(r._id, { imageUrl: url })} />
                  </Field>
                )}
              </div>
            )}
          />
          <div className="pt-2">
            <PrimaryButton onClick={add}>+ Agregar resultado</PrimaryButton>
          </div>
        </>
      )}
    </div>
  );
}
