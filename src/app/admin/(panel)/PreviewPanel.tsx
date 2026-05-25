"use client";

import { useAdmin } from "./AdminProvider";

const PAGES: { value: string; label: string }[] = [
  { value: "/", label: "Home" },
  { value: "/pages/calendly", label: "Calendly" },
  { value: "/pages/thankyou", label: "Thank you" },
  { value: "/pages/contact", label: "Contact" },
  { value: "/pages/nothing-for-you-now", label: "Nothing for you now" },
];

export function PreviewPanel() {
  const { previewOpen, previewPath, previewKey, setPreviewOpen, setPreviewPath } = useAdmin();
  if (!previewOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full md:w-[480px] lg:w-[560px] bg-white border-l border-neutral-200 shadow-xl flex flex-col">
      <div className="px-4 py-3 border-b border-neutral-200 flex items-center gap-2">
        <span className="size-1.5 rounded-full bg-[#FF9A15] animate-pulse" />
        <p className="text-[12px] font-semibold text-neutral-800">Preview en vivo</p>
        <select
          value={previewPath}
          onChange={(e) => setPreviewPath(e.target.value)}
          className="ml-2 bg-white border border-neutral-200 rounded-md px-2 py-1 text-xs text-neutral-800 outline-none focus:border-[#FF9A15]"
        >
          {PAGES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        <div className="flex-1" />
        <a
          href={previewPath}
          target="_blank"
          rel="noreferrer"
          className="text-[11px] text-neutral-500 hover:text-neutral-900 px-2 py-1 rounded-md hover:bg-neutral-100"
          title="Abrir en pestaña nueva"
        >
          ↗
        </a>
        <button
          type="button"
          onClick={() => setPreviewOpen(false)}
          className="text-[11px] text-neutral-500 hover:text-neutral-900 px-2 py-1 rounded-md hover:bg-neutral-100"
          aria-label="Cerrar"
        >
          ✕
        </button>
      </div>
      <div className="flex-1 bg-neutral-100">
        <iframe
          key={`${previewPath}-${previewKey}`}
          src={previewPath}
          className="w-full h-full border-0"
          title="Preview del funnel"
        />
      </div>
      <div className="px-4 py-2 border-t border-neutral-200 text-[11px] text-neutral-500">
        Los cambios se reflejan automáticamente al dejar de tipear (~1s).
      </div>
    </div>
  );
}
