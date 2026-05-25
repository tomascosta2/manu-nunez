"use client";

import { useAdmin } from "../AdminProvider";
import { ABInput, Card, EmptyState, Field, GhostButton, PageHeader, PrimaryButton, SortableList, inputClass, newId } from "../ui";
import type { VideoTestimonial } from "@/lib/content";

export default function TestimoniosPage() {
  const { content, setContent, confirm } = useAdmin();
  const items = content.videoTestimonials ?? [];
  const updateSection = (patch: Partial<NonNullable<typeof content.homeSections>>) =>
    setContent({ ...content, homeSections: { ...content.homeSections, ...patch } });
  const updateEyebrows = (patch: Partial<NonNullable<typeof content.sectionEyebrows>>) =>
    setContent({ ...content, sectionEyebrows: { ...content.sectionEyebrows, ...patch } });

  const reorder = (next: VideoTestimonial[]) => setContent({ ...content, videoTestimonials: next });
  const update = (id: string, patch: Partial<VideoTestimonial>) =>
    setContent({ ...content, videoTestimonials: items.map((x) => (x._id === id ? { ...x, ...patch } : x)) });
  const remove = async (id: string) => {
    const item = items.find((x) => x._id === id);
    const ok = await confirm({
      title: "¿Eliminar testimonio?",
      description: item?.nombre ? `Se va a eliminar "${item.nombre}". Recordá guardar para que aplique.` : "Recordá guardar para que aplique.",
      confirmLabel: "Eliminar",
      danger: true,
    });
    if (!ok) return;
    setContent({ ...content, videoTestimonials: items.filter((x) => x._id !== id) });
  };
  const add = () =>
    setContent({
      ...content,
      videoTestimonials: [...items, { _id: newId(), videoUrl: "", titulo: "", story: "", nombre: "", dato: "" }],
    });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Testimonios con video"
        description="Aparecen en la home. Arrastrá para reordenar."
      />

      <Card>
        <h3 className="font-semibold text-neutral-900 mb-4">Textos de la sección</h3>
        <div className="space-y-5">
          <ABInput
            testId="sectionEyebrows.testimonials"
            label="Eyebrow (texto chico arriba del título)"
            value={content.sectionEyebrows?.testimonials}
            onChange={(testimonials) => updateEyebrows({ testimonials })}
          />
          <ABInput
            testId="homeSections.testimonialsHeadline"
            label="Headline (título de la sección)"
            hint='Usá **doble asterisco** para resaltar palabras.'
            value={content.homeSections?.testimonialsHeadline}
            onChange={(testimonialsHeadline) => updateSection({ testimonialsHeadline })}
            multiline
            showAccentPreview
          />
          <ABInput
            testId="homeSections.testimonialsCta"
            label="Texto del botón CTA debajo de los testimonios"
            value={content.homeSections?.testimonialsCta}
            onChange={(testimonialsCta) => updateSection({ testimonialsCta })}
          />
          <ABInput
            testId="homeSections.testimonialsCtaSubtext"
            label="Texto chico debajo del CTA"
            value={content.homeSections?.testimonialsCtaSubtext}
            onChange={(testimonialsCtaSubtext) => updateSection({ testimonialsCtaSubtext })}
            multiline
          />
        </div>
      </Card>

      {items.length === 0 ? (
        <EmptyState
          icon="⌬"
          title="Aún no agregaste testimonios"
          description="Cada testimonio incluye un video de Wistia/Pandavideo, título, historia y datos de la persona."
          action={<PrimaryButton onClick={add}>+ Agregar primero</PrimaryButton>}
        />
      ) : (
        <>
          <SortableList
            items={items}
            onReorder={reorder}
            renderItem={(t, i) => (
              <div className="ml-2 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400 font-mono">#{i + 1}</span>
                  <GhostButton danger onClick={() => remove(t._id)}>Eliminar</GhostButton>
                </div>
                <Field label="URL del video (iframe embed)">
                  <input
                    className={inputClass}
                    value={t.videoUrl ?? ""}
                    onChange={(e) => update(t._id, { videoUrl: e.target.value })}
                    placeholder="https://fast.wistia.net/embed/iframe/…"
                  />
                </Field>
                <Field label="Título del testimonio">
                  <input className={inputClass} value={t.titulo ?? ""} onChange={(e) => update(t._id, { titulo: e.target.value })} />
                </Field>
                <Field label="Historia">
                  <textarea
                    className={inputClass + " min-h-[60px]"}
                    value={t.story ?? ""}
                    onChange={(e) => update(t._id, { story: e.target.value })}
                  />
                </Field>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Field label="Nombre">
                    <input className={inputClass} value={t.nombre ?? ""} onChange={(e) => update(t._id, { nombre: e.target.value })} />
                  </Field>
                  <Field label="Dato (edad, ciudad)">
                    <input className={inputClass} value={t.dato ?? ""} onChange={(e) => update(t._id, { dato: e.target.value })} />
                  </Field>
                </div>
              </div>
            )}
          />
          <div className="pt-2">
            <PrimaryButton onClick={add}>+ Agregar testimonio</PrimaryButton>
          </div>
        </>
      )}
    </div>
  );
}
