"use client";

import { useEffect } from "react";
import { useAdmin } from "./AdminProvider";

const SHORTCUTS: { keys: string[]; label: string }[] = [
  { keys: ["⌘", "S"], label: "Guardar cambios" },
  { keys: ["?"], label: "Ver atajos" },
  { keys: ["Esc"], label: "Cerrar diálogos / paneles" },
  { keys: ["Enter"], label: "Confirmar diálogo" },
];

export function ShortcutsModal() {
  const { shortcutsOpen, setShortcutsOpen } = useAdmin();

  useEffect(() => {
    if (!shortcutsOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShortcutsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcutsOpen, setShortcutsOpen]);

  if (!shortcutsOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm"
      onClick={() => setShortcutsOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-neutral-200 rounded-xl shadow-xl max-w-sm w-full p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-[16px] font-semibold text-neutral-900">Atajos</p>
          <button
            type="button"
            onClick={() => setShortcutsOpen(false)}
            className="text-neutral-500 hover:text-neutral-900 text-sm"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        <ul className="space-y-2.5">
          {SHORTCUTS.map((s) => (
            <li key={s.label} className="flex items-center justify-between text-[13px]">
              <span className="text-neutral-700">{s.label}</span>
              <span className="flex gap-1">
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-neutral-800"
                  >
                    {k}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
