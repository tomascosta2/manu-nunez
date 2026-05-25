"use client";

import { useAdmin } from "../AdminProvider";
import { ABInput, Card, PageHeader, SortableList, EmptyState, PrimaryButton, GhostButton, newId } from "../ui";
import type { FAQ } from "@/lib/content";

export default function ThankyouPage() {
  const { content, setContent } = useAdmin();
  const update = (patch: Partial<NonNullable<typeof content.thankyouPage>>) =>
    setContent({ ...content, thankyouPage: { ...content.thankyouPage, ...patch } });

  const faqs: FAQ[] = content.thankyouPage?.faqs ?? [];
  const updateFaqs = (next: FAQ[]) => update({ faqs: next });
  const addFaq = () =>
    updateFaqs([...faqs, { _id: newId(), question: { a: "" }, answer: { a: "" } }]);
  const updateFaq = (id: string, patch: Partial<FAQ>) =>
    updateFaqs(faqs.map((f) => (f._id === id ? { ...f, ...patch } : f)));
  const removeFaq = (id: string) => updateFaqs(faqs.filter((f) => f._id !== id));
  return (
    <div className="space-y-6">
      <PageHeader
        title="Página /pages/thankyou"
        description="La página de confirmación post-agenda con el botón de WhatsApp."
      />
      <Card>
        <div className="space-y-5">
          <ABInput
            testId="thankyouPage.title"
            label="Título"
            value={content.thankyouPage?.title}
            onChange={(title) => update({ title })}
          />
          <ABInput
            testId="thankyouPage.subtitle"
            label="Subtítulo"
            value={content.thankyouPage?.subtitle}
            onChange={(subtitle) => update({ subtitle })}
            multiline
          />
          <ABInput
            testId="thankyouPage.whatsappCtaText"
            label="Texto del botón de WhatsApp"
            value={content.thankyouPage?.whatsappCtaText}
            onChange={(whatsappCtaText) => update({ whatsappCtaText })}
          />
          <ABInput
            testId="thankyouPage.whatsappPrefilledMessage"
            label="Mensaje pre-llenado de WhatsApp"
            hint="Texto que el lead va a ver escrito al hacer click en el botón."
            value={content.thankyouPage?.whatsappPrefilledMessage}
            onChange={(whatsappPrefilledMessage) => update({ whatsappPrefilledMessage })}
            multiline
          />
          <ABInput
            testId="thankyouPage.videoEmbedUrl"
            label="URL del video (Panda / Wistia / YouTube)"
            hint='Pegá la URL completa del iframe embed. Si lo dejás vacío, no se muestra el video. Ej: https://player-vz-….tv.pandavideo.com/embed/?v=ID o https://www.youtube.com/embed/ID'
            value={content.thankyouPage?.videoEmbedUrl}
            onChange={(videoEmbedUrl) => update({ videoEmbedUrl })}
          />
          <ABInput
            testId="thankyouPage.videoSectionHeading"
            label="Título de la sección del video"
            hint='Ej: "¿Cómo funciona el método?"'
            value={content.thankyouPage?.videoSectionHeading}
            onChange={(videoSectionHeading) => update({ videoSectionHeading })}
          />
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold text-neutral-900 mb-4">Banner y mensajes</h3>
        <div className="space-y-5">
          <ABInput
            testId="thankyouPage.urgentBanner"
            label="Banner amarillo de urgencia (arriba)"
            value={content.thankyouPage?.urgentBanner}
            onChange={(urgentBanner) => update({ urgentBanner })}
          />
          <ABInput
            testId="thankyouPage.cancellationWarning"
            label="Aviso rojo bajo el CTA principal"
            value={content.thankyouPage?.cancellationWarning}
            onChange={(cancellationWarning) => update({ cancellationWarning })}
          />
          <ABInput
            testId="thankyouPage.scarcityMessage"
            label="Mensaje de escasez al final"
            value={content.thankyouPage?.scarcityMessage}
            onChange={(scarcityMessage) => update({ scarcityMessage })}
          />
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold text-neutral-900 mb-4">Checklist de compromiso</h3>
        <div className="space-y-5">
          <ABInput
            testId="thankyouPage.checklistLabel"
            label="Título del checklist"
            value={content.thankyouPage?.checklistLabel}
            onChange={(checklistLabel) => update({ checklistLabel })}
          />
          <ABInput
            testId="thankyouPage.check1"
            label="Check 1"
            value={content.thankyouPage?.check1}
            onChange={(check1) => update({ check1 })}
          />
          <ABInput
            testId="thankyouPage.check2"
            label="Check 2"
            value={content.thankyouPage?.check2}
            onChange={(check2) => update({ check2 })}
          />
          <ABInput
            testId="thankyouPage.check3"
            label="Check 3"
            value={content.thankyouPage?.check3}
            onChange={(check3) => update({ check3 })}
          />
        </div>
      </Card>

      <Card>
        <ABInput
          testId="thankyouPage.faqHeading"
          label='Título de la sección FAQ ("Preguntas frecuentes")'
          value={content.thankyouPage?.faqHeading}
          onChange={(faqHeading) => update({ faqHeading })}
        />
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-900">Preguntas frecuentes</h3>
          <PrimaryButton onClick={addFaq}>+ Agregar FAQ</PrimaryButton>
        </div>
        {faqs.length === 0 ? (
          <EmptyState
            icon="❓"
            title="Sin FAQs"
            description="Agregá preguntas que se muestren en la página de thankyou."
            action={<PrimaryButton onClick={addFaq}>+ Agregar FAQ</PrimaryButton>}
          />
        ) : (
          <SortableList
            items={faqs}
            onReorder={updateFaqs}
            renderItem={(f, i) => (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-400">#{i + 1}</span>
                  <GhostButton danger onClick={() => removeFaq(f._id)}>
                    Eliminar
                  </GhostButton>
                </div>
                <ABInput
                  testId={`thankyouPage.faq.${f._id}.q`}
                  label="Pregunta"
                  value={f.question}
                  onChange={(question) => updateFaq(f._id, { question })}
                />
                <ABInput
                  testId={`thankyouPage.faq.${f._id}.a`}
                  label="Respuesta"
                  value={f.answer}
                  onChange={(answer) => updateFaq(f._id, { answer })}
                  multiline
                />
              </div>
            )}
          />
        )}
      </Card>
    </div>
  );
}
