"use client";

import { useState, type ReactNode } from "react";
import { useAdmin } from "./AdminProvider";
import type { AB } from "@/lib/ab-cookie";
import { parseAccent } from "@/lib/parseAccent";
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, useSortable, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ── Page header / section ──────────────────────────────────
export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="mb-8 pb-6 border-b border-neutral-200">
      <h1 className="text-[24px] font-bold tracking-tight text-neutral-900">{title}</h1>
      {description && <p className="text-[14px] text-neutral-600 mt-1.5 max-w-2xl">{description}</p>}
    </header>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={"bg-white border border-neutral-200 rounded-xl p-5 " + className}>
      {children}
    </div>
  );
}

export const inputClass =
  "w-full bg-white border border-neutral-300 rounded-lg px-3 py-2.5 text-neutral-900 text-[14px] outline-none focus:border-[#FF9A15] focus:ring-2 focus:ring-[#FF9A15]/20 transition-colors placeholder:text-neutral-400";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[13px] font-medium text-neutral-700">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-neutral-500 leading-tight">{hint}</p>}
    </div>
  );
}

// ── A/B input with single-test enforcement + accent preview ────
export function ABInput({
  label,
  hint,
  testId,
  value,
  onChange,
  multiline = false,
  showAccentPreview = false,
  placeholder,
}: {
  label: string;
  hint?: string;
  testId: string;
  value?: AB;
  onChange: (v: AB) => void;
  multiline?: boolean;
  showAccentPreview?: boolean;
  placeholder?: string;
}) {
  const { content, setActiveTest } = useAdmin();
  const isActive = content.activeTestId === testId;
  const v = value ?? {};
  const InputEl = multiline ? "textarea" : "input";
  const baseCls = inputClass + (multiline ? " min-h-[80px] leading-snug" : "");

  return (
    <div className={"rounded-lg p-3 -mx-3 transition-colors " + (isActive ? "bg-[#FF9A15]/[0.06] ring-1 ring-[#FF9A15]/40" : "")}>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[13px] font-medium text-neutral-700">{label}</label>
        <button
          type="button"
          onClick={() => setActiveTest(isActive ? undefined : testId)}
          className={
            "text-[11px] px-2 py-0.5 rounded-md transition-colors " +
            (isActive
              ? "bg-[#FF9A15] text-white"
              : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100")
          }
        >
          {isActive ? "● A/B activo" : "Activar A/B"}
        </button>
      </div>
      <InputEl
        className={baseCls}
        value={v.a ?? ""}
        placeholder={placeholder ?? "Variante A (default)"}
        onChange={(e) => onChange({ ...v, a: (e.target as HTMLInputElement | HTMLTextAreaElement).value })}
      />
      {showAccentPreview && v.a && v.a.includes("**") && (
        <div className="mt-2 px-3 py-2 bg-neutral-100 rounded-md text-[13px] leading-relaxed text-neutral-800">
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 mr-2">Preview:</span>
          {parseAccent(v.a)}
        </div>
      )}
      {isActive && (
        <>
          <InputEl
            className={baseCls + " mt-2 border-[#FF9A15]/60"}
            value={v.b ?? ""}
            placeholder="Variante B (50% del tráfico la verá)"
            onChange={(e) => onChange({ ...v, b: (e.target as HTMLInputElement | HTMLTextAreaElement).value })}
          />
          {showAccentPreview && v.b && v.b.includes("**") && (
            <div className="mt-2 px-3 py-2 bg-[#FF9A15]/10 rounded-md text-[13px] leading-relaxed text-neutral-800">
              <span className="text-[10px] uppercase tracking-widest text-[#FF9A15] mr-2">Preview B:</span>
              {parseAccent(v.b)}
            </div>
          )}
        </>
      )}
      {hint && <p className="text-[11px] text-neutral-500 mt-1.5">{hint}</p>}
    </div>
  );
}

// ── Image input ──────────────────────────────────────────────
export function ImageInput({ value, onChange, aspect = "square" }: { value?: string; onChange: (url: string) => void; aspect?: "square" | "video" }) {
  const [uploading, setUploading] = useState(false);
  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.ok) onChange(data.url);
      else alert("Error subiendo imagen: " + (data.error ?? "desconocido"));
    } finally {
      setUploading(false);
    }
  };
  const aspectCls = aspect === "video" ? "aspect-video" : "aspect-square";
  return (
    <div className="flex items-center gap-3">
      <label className={"group relative cursor-pointer " + aspectCls + " w-24 rounded-md overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0 flex items-center justify-center"}>
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-neutral-400 text-[10px]">Sin imagen</span>
        )}
        <span className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[11px] text-white transition-opacity">
          {uploading ? "Subiendo…" : value ? "Reemplazar" : "Subir"}
        </span>
        <input type="file" accept="image/*" className="hidden" onChange={onPick} disabled={uploading} />
      </label>
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-xs text-red-500 hover:text-red-600"
        >
          Quitar
        </button>
      )}
    </div>
  );
}

// ── Sortable list ─────────────────────────────────────────────
export function SortableList<T extends { _id: string }>({
  items,
  onReorder,
  renderItem,
}: {
  items: T[];
  onReorder: (next: T[]) => void;
  renderItem: (item: T, index: number) => ReactNode;
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((x) => x._id === active.id);
    const newIndex = items.findIndex((x) => x._id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;
    onReorder(arrayMove(items, oldIndex, newIndex));
  };
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items.map((x) => x._id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {items.map((item, i) => (
            <SortableRow key={item._id} id={item._id}>
              {renderItem(item, i)}
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({ id, children }: { id: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.6 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} className="bg-white border border-neutral-200 rounded-lg p-4 relative">
      <button
        {...attributes}
        {...listeners}
        type="button"
        className="absolute -left-7 top-4 cursor-grab active:cursor-grabbing text-neutral-300 hover:text-neutral-500 px-1"
        aria-label="Arrastrar"
      >
        ⋮⋮
      </button>
      {children}
    </div>
  );
}

// ── Empty state ──────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }: { icon?: string; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="border border-dashed border-neutral-300 rounded-xl py-10 px-6 text-center bg-white">
      {icon && <div className="text-3xl text-neutral-300 mb-3">{icon}</div>}
      <p className="font-semibold text-neutral-900">{title}</p>
      {description && <p className="text-[13px] text-neutral-500 mt-1 max-w-md mx-auto">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ── Buttons ──────────────────────────────────────────────────
export function PrimaryButton({ children, onClick, disabled, type = "button" }: { children: ReactNode; onClick?: () => void; disabled?: boolean; type?: "button" | "submit" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#FF9A15] text-white hover:brightness-110 disabled:opacity-50 transition"
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, onClick, disabled, danger = false }: { children: ReactNode; onClick?: () => void; disabled?: boolean; danger?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        "px-3 py-1.5 text-xs rounded-md transition disabled:opacity-50 " +
        (danger
          ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900")
      }
    >
      {children}
    </button>
  );
}

export function newId() {
  return typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
}
