"use client";

import { useAdmin } from "../AdminProvider";
import { ABInput, Card, Field, PageHeader, inputClass } from "../ui";

export default function ContactAdminPage() {
  const { content, setContent } = useAdmin();
  const update = (patch: Partial<NonNullable<typeof content.contactPage>>) =>
    setContent({ ...content, contactPage: { ...content.contactPage, ...patch } });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Página /pages/contact"
        description="Mensaje de gracias + link al Instagram que se muestra después del primer paso del form."
      />
      <Card>
        <div className="space-y-5">
          <ABInput
            testId="contactPage.thankYouMessage"
            label="Mensaje de gracias"
            value={content.contactPage?.thankYouMessage}
            onChange={(thankYouMessage) => update({ thankYouMessage })}
            multiline
          />
          <ABInput
            testId="contactPage.followInstagramText"
            label="Texto sobre el ícono de Instagram"
            value={content.contactPage?.followInstagramText}
            onChange={(followInstagramText) => update({ followInstagramText })}
          />
          <Field
            label="URL del Instagram"
            hint='Ej: https://www.instagram.com/mathiasguevaracoach/. Dejá vacío para ocultar el ícono.'
          >
            <input
              type="url"
              className={inputClass}
              value={content.contactPage?.instagramUrl ?? ""}
              onChange={(e) => update({ instagramUrl: e.target.value })}
              placeholder="https://www.instagram.com/usuario/"
            />
          </Field>
        </div>
      </Card>
    </div>
  );
}
