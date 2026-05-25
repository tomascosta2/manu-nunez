"use client";

import { useAdmin } from "../AdminProvider";
import { Card, Field, PageHeader, inputClass } from "../ui";

export default function LegalPagesAdmin() {
  const { content, setContent } = useAdmin();

  const update = (patch: Partial<NonNullable<typeof content.legalPages>>) =>
    setContent({ ...content, legalPages: { ...content.legalPages, ...patch } });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Páginas legales"
        description="Política de Privacidad y Términos y Condiciones que aparecen en el footer."
      />

      <Card>
        <div className="space-y-2 mb-4">
          <h3 className="text-[15px] font-semibold text-neutral-900">Política de Privacidad</h3>
          <p className="text-[12px] text-neutral-500">
            Renderiza en <code className="bg-neutral-100 px-1 py-0.5 rounded">/pages/politicas-de-privacidad</code>.
            Soporta markdown ligero: <code className="bg-neutral-100 px-1 rounded">#</code> para H1,{" "}
            <code className="bg-neutral-100 px-1 rounded">##</code> para H2,{" "}
            <code className="bg-neutral-100 px-1 rounded">**texto**</code> para negrita y{" "}
            <code className="bg-neutral-100 px-1 rounded">-</code> para listas.
          </p>
        </div>
        <Field label="Contenido">
          <textarea
            value={content.legalPages?.privacy ?? ""}
            onChange={(e) => update({ privacy: e.target.value })}
            rows={20}
            className={inputClass + " font-mono text-[13px] leading-[1.7]"}
            placeholder="# Política de Privacidad..."
          />
        </Field>
      </Card>

      <Card>
        <div className="space-y-2 mb-4">
          <h3 className="text-[15px] font-semibold text-neutral-900">Términos y Condiciones</h3>
          <p className="text-[12px] text-neutral-500">
            Renderiza en <code className="bg-neutral-100 px-1 py-0.5 rounded">/pages/terminos-y-condiciones</code>.
            Mismo formato markdown ligero.
          </p>
        </div>
        <Field label="Contenido">
          <textarea
            value={content.legalPages?.terms ?? ""}
            onChange={(e) => update({ terms: e.target.value })}
            rows={20}
            className={inputClass + " font-mono text-[13px] leading-[1.7]"}
            placeholder="# Términos y Condiciones..."
          />
        </Field>
      </Card>
    </div>
  );
}
