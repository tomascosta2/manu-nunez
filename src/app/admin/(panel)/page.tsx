"use client";

import Link from "next/link";
import { useAdmin } from "./AdminProvider";
import { Card, PageHeader } from "./ui";

export default function Dashboard() {
  const { content } = useAdmin();
  const stats = [
    { label: "Testimonios con video", value: content.videoTestimonials?.length ?? 0, href: "/admin/testimonios" },
    { label: "Resultados en galería", value: content.resultGallery?.length ?? 0, href: "/admin/galeria" },
    { label: "Preguntas del form", value: content.formQuestions?.length ?? 0, href: "/admin/form" },
  ];
  const test = content.activeTestId;
  return (
    <div className="space-y-6">
      <PageHeader title="Resumen" description="Vista general del contenido del funnel y del A/B test corriendo." />

      <Card>
        <p className="text-[12px] tracking-widest uppercase text-neutral-500 mb-2">A/B Test</p>
        {test ? (
          <div>
            <p className="text-[15px] mb-1 text-neutral-900">
              Corriendo en <code className="text-[#c46e00] bg-[#FF9A15]/10 px-1.5 py-0.5 rounded font-mono text-[13px]">{test}</code>
            </p>
            <p className="text-[13px] text-neutral-500">50% del tráfico ve la variante B (sticky por cookie 180 días).</p>
          </div>
        ) : (
          <p className="text-[15px] text-neutral-600">Ningún test corriendo. Activá uno desde cualquier campo del admin.</p>
        )}
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {stats.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group bg-white border border-neutral-200 rounded-xl p-4 hover:border-[#FF9A15]/40 hover:bg-[#FF9A15]/[0.04] transition-colors"
          >
            <p className="text-[28px] font-bold tracking-tight text-neutral-900">{s.value}</p>
            <p className="text-[12px] text-neutral-500 group-hover:text-neutral-700 mt-0.5">{s.label}</p>
          </Link>
        ))}
      </div>

      <Card>
        <p className="text-[12px] tracking-widest uppercase text-neutral-500 mb-3">Atajos</p>
        <ul className="text-[13px] text-neutral-700 space-y-1.5">
          <li><kbd className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-200 font-mono mr-2 text-neutral-800">⌘ S</kbd> Guardar cambios</li>
          <li><span className="text-neutral-400 mr-2">●</span> Solo 1 A/B test puede correr a la vez globalmente</li>
          <li><span className="text-neutral-400 mr-2">●</span> Cambios se reflejan en el funnel en máximo 60s (revalidación)</li>
        </ul>
      </Card>
    </div>
  );
}
