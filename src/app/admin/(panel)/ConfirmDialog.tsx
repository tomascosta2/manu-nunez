"use client";

import { useEffect } from "react";
import { useAdmin } from "./AdminProvider";

export function ConfirmDialog() {
  const { pendingConfirm } = useAdmin();

  useEffect(() => {
    if (!pendingConfirm) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") pendingConfirm.resolve(false);
      if (e.key === "Enter") pendingConfirm.resolve(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pendingConfirm]);

  if (!pendingConfirm) return null;
  const { title, description, confirmLabel = "Confirmar", cancelLabel = "Cancelar", danger, resolve } = pendingConfirm;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        className="bg-white border border-neutral-200 rounded-xl shadow-xl max-w-sm w-full p-5"
      >
        <p className="text-[16px] font-semibold mb-1.5 text-neutral-900">{title}</p>
        {description && <p className="text-[13px] text-neutral-600 leading-relaxed">{description}</p>}
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            autoFocus
            onClick={() => resolve(false)}
            className="px-3 py-1.5 text-sm rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => resolve(true)}
            className={
              "px-3 py-1.5 text-sm font-semibold rounded-md text-white hover:brightness-110 " +
              (danger ? "bg-red-500" : "bg-[#FF9A15]")
            }
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
