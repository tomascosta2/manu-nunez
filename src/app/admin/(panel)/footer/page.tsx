"use client";

import { useAdmin } from "../AdminProvider";
import { ABInput, Card, PageHeader } from "../ui";

export default function FooterAdminPage() {
  const { content, setContent } = useAdmin();
  const update = (patch: Partial<NonNullable<typeof content.footer>>) =>
    setContent({ ...content, footer: { ...content.footer, ...patch } });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Footer"
        description="Marca, copyright, disclaimer de Meta y labels de los links legales."
      />
      <Card>
        <div className="space-y-5">
          <ABInput
            testId="footer.brandLine"
            label="Línea de marca"
            hint='Ej: "Manuel Núñez · Método M90".'
            value={content.footer?.brandLine}
            onChange={(brandLine) => update({ brandLine })}
          />
          <ABInput
            testId="footer.copyright"
            label="Copyright"
            hint='Usá {year} y se reemplaza con el año actual automáticamente. Ej: "© {year}. Todos los derechos reservados."'
            value={content.footer?.copyright}
            onChange={(copyright) => update({ copyright })}
          />
          <ABInput
            testId="footer.metaDisclaimer"
            label="Disclaimer de Meta"
            value={content.footer?.metaDisclaimer}
            onChange={(metaDisclaimer) => update({ metaDisclaimer })}
            multiline
          />
          <ABInput
            testId="footer.privacyLabel"
            label='Texto del link "Política de Privacidad"'
            value={content.footer?.privacyLabel}
            onChange={(privacyLabel) => update({ privacyLabel })}
          />
          <ABInput
            testId="footer.termsLabel"
            label='Texto del link "Términos y Condiciones"'
            value={content.footer?.termsLabel}
            onChange={(termsLabel) => update({ termsLabel })}
          />
        </div>
      </Card>
    </div>
  );
}
