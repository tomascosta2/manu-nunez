"use client";

import { useAdmin } from "../AdminProvider";
import { ABInput, Card, Field, GhostButton, PageHeader, PrimaryButton, inputClass, newId } from "../ui";
import type { FormQuestion, FormOption } from "@/lib/content";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}

export default function FormPage() {
  const { content, setContent, confirm } = useAdmin();
  const items = content.formQuestions ?? [];

  const updateQuestion = (idx: number, patch: Partial<FormQuestion>) =>
    setContent({ ...content, formQuestions: items.map((x, i) => (i === idx ? { ...x, ...patch } : x)) });
  const updateOption = (qi: number, oi: number, patch: Partial<FormOption>) => {
    const q = items[qi];
    if (!q?.options) return;
    const newOpts = q.options.map((o, i) => (i === oi ? { ...o, ...patch } : o));
    updateQuestion(qi, { options: newOpts });
  };
  const addOption = (qi: number) => {
    const q = items[qi];
    if (!q) return;
    const existing = q.options ?? [];
    let n = existing.length + 1;
    let value = `opcion-${n}`;
    while (existing.some((o) => o.value === value)) {
      n += 1;
      value = `opcion-${n}`;
    }
    const newOpt: FormOption = { _id: newId(), value, label: { a: "Nueva opción" } };
    updateQuestion(qi, { options: [...existing, newOpt] });
  };
  const removeOption = async (qi: number, oi: number) => {
    const q = items[qi];
    if (!q?.options) return;
    const opt = q.options[oi];
    const ok = await confirm({
      title: "¿Eliminar opción?",
      description: `Se va a eliminar la opción con value "${opt.value}". Si alguna lógica de calificación dependía de ese valor, va a dejar de aplicar.`,
      confirmLabel: "Eliminar",
      danger: true,
    });
    if (!ok) return;
    const newOpts = q.options.filter((_, i) => i !== oi);
    updateQuestion(qi, { options: newOpts });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Preguntas del formulario"
        description="Editás títulos, subtítulos, labels y opciones, y marcás con el check qué opciones CALIFICAN al lead. Un lead califica si ninguna de las opciones que eligió está destildada. Cambiar el value técnico de una opción solo si sabés lo que hacés."
      />

      <div className="space-y-5">
        {items.map((q, qi) => (
          <Card key={q._id}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[12px] text-neutral-500 font-mono">
                  #{qi + 1} · type={q.type} · id={q.id}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <ABInput
                testId={`form.q.${q.id}.title`}
                label="Título de la pregunta"
                value={q.title}
                onChange={(title) => updateQuestion(qi, { title })}
                multiline
              />
              <ABInput
                testId={`form.q.${q.id}.subtitle`}
                label="Subtítulo (opcional)"
                value={q.subtitle}
                onChange={(subtitle) => updateQuestion(qi, { subtitle })}
              />
              {q.type === "single" && (
                <div className="pl-4 border-l-2 border-neutral-200 space-y-3 mt-2">
                  <p className="text-[12px] text-neutral-600 uppercase tracking-widest">Opciones</p>
                  {(q.options ?? []).map((opt, oi) => {
                    const dup = (q.options ?? []).some((o, i) => i !== oi && o.value === opt.value);
                    return (
                      <div key={opt._id} className="space-y-2 rounded-md border border-neutral-200 p-3 bg-neutral-50/50">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[10px] text-neutral-400 font-mono">opción #{oi + 1}</p>
                          <GhostButton danger onClick={() => removeOption(qi, oi)}>Quitar opción</GhostButton>
                        </div>
                        <Field
                          label="value (clave técnica)"
                          hint={dup ? "" : "Lo usa la lógica de calificación. Solo letras, números y guiones."}
                        >
                          <input
                            className={inputClass + (dup ? " border-red-500/60 focus:border-red-500" : "")}
                            value={opt.value}
                            onChange={(e) => updateOption(qi, oi, { value: slugify(e.target.value) })}
                          />
                          {dup && (
                            <p className="text-[11px] text-red-600 mt-1">Este value ya existe en otra opción. Cambialo.</p>
                          )}
                        </Field>
                        <ABInput
                          testId={`form.q.${q.id}.opt.${opt._id}.label`}
                          label="Label (lo que ve el lead)"
                          value={opt.label}
                          onChange={(label) => updateOption(qi, oi, { label })}
                        />
                        <label className="flex items-center gap-2 text-[13px] text-neutral-700 cursor-pointer select-none pt-1">
                          <input
                            type="checkbox"
                            className="h-4 w-4"
                            checked={opt.qualifies !== false}
                            onChange={(e) => updateOption(qi, oi, { qualifies: e.target.checked })}
                          />
                          <span>Elegir esta opción <strong>califica</strong> al lead</span>
                        </label>
                      </div>
                    );
                  })}
                  <div>
                    <PrimaryButton onClick={() => addOption(qi)}>+ Agregar opción</PrimaryButton>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
