"use client";

import { useAdmin } from "../AdminProvider";
import { ABInput, Card, PageHeader } from "../ui";

export default function FormLabelsPage() {
  const { content, setContent } = useAdmin();
  const update = (patch: Partial<NonNullable<typeof content.formLabels>>) =>
    setContent({ ...content, formLabels: { ...content.formLabels, ...patch } });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Formulario — Labels y botones"
        description="Textos de los labels, placeholders, validaciones y botones del formulario de calificación."
      />

      <Card>
        <h3 className="font-semibold text-neutral-900 mb-4">Paso de Contacto</h3>
        <div className="space-y-5">
          <ABInput testId="formLabels.nameLabel" label='Label "Nombre"' value={content.formLabels?.nameLabel} onChange={(nameLabel) => update({ nameLabel })} />
          <ABInput testId="formLabels.namePlaceholder" label='Placeholder del campo Nombre' value={content.formLabels?.namePlaceholder} onChange={(namePlaceholder) => update({ namePlaceholder })} />
          <ABInput testId="formLabels.emailLabel" label='Label "Correo electrónico"' value={content.formLabels?.emailLabel} onChange={(emailLabel) => update({ emailLabel })} />
          <ABInput testId="formLabels.emailPlaceholder" label='Placeholder del campo Email' value={content.formLabels?.emailPlaceholder} onChange={(emailPlaceholder) => update({ emailPlaceholder })} />
          <ABInput testId="formLabels.phoneLabel" label='Label "Número de teléfono"' value={content.formLabels?.phoneLabel} onChange={(phoneLabel) => update({ phoneLabel })} />
          <ABInput testId="formLabels.countryPlaceholder" label='Placeholder del select de país' value={content.formLabels?.countryPlaceholder} onChange={(countryPlaceholder) => update({ countryPlaceholder })} />
          <ABInput testId="formLabels.numberPlaceholder" label='Placeholder del campo Número' value={content.formLabels?.numberPlaceholder} onChange={(numberPlaceholder) => update({ numberPlaceholder })} />
          <ABInput testId="formLabels.phoneInvalidMessage" label="Mensaje cuando el teléfono no es válido" value={content.formLabels?.phoneInvalidMessage} onChange={(phoneInvalidMessage) => update({ phoneInvalidMessage })} />
          <ABInput testId="formLabels.phoneInvalidHint" label="Hint debajo del mensaje" value={content.formLabels?.phoneInvalidHint} onChange={(phoneInvalidHint) => update({ phoneInvalidHint })} multiline />
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold text-neutral-900 mb-4">Pregunta de objetivo (texto libre)</h3>
        <ABInput testId="formLabels.objectiveTip" label="Tip debajo del textarea" value={content.formLabels?.objectiveTip} onChange={(objectiveTip) => update({ objectiveTip })} />
      </Card>

      <Card>
        <h3 className="font-semibold text-neutral-900 mb-4">Botones</h3>
        <div className="space-y-5">
          <ABInput testId="formLabels.backButton" label='Botón "Atrás"' value={content.formLabels?.backButton} onChange={(backButton) => update({ backButton })} />
          <ABInput testId="formLabels.nextButton" label='Botón "Continuar"' value={content.formLabels?.nextButton} onChange={(nextButton) => update({ nextButton })} />
          <ABInput testId="formLabels.loadingButton" label='Botón mientras carga (último paso)' value={content.formLabels?.loadingButton} onChange={(loadingButton) => update({ loadingButton })} />
          <ABInput testId="formLabels.submitButton" label='Botón final "Aceptar y Agendar"' value={content.formLabels?.submitButton} onChange={(submitButton) => update({ submitButton })} />
        </div>
      </Card>
    </div>
  );
}
