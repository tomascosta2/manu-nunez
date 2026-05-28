"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminProvider, useAdmin } from "./AdminProvider";
import { PreviewPanel } from "./PreviewPanel";
import { ConfirmDialog } from "./ConfirmDialog";
import { ShortcutsModal } from "./ShortcutsModal";
import type { Content } from "@/lib/content";

const NAV: { href: string; label: string; icon: string }[] = [
  { href: "/admin", label: "Resumen", icon: "◇" },
  { href: "/admin/site", label: "Sitio", icon: "⚙" },
  { href: "/admin/hero", label: "Hero", icon: "★" },
  { href: "/admin/testimonios", label: "Testimonios", icon: "⌬" },
  { href: "/admin/galeria", label: "Galería", icon: "▣" },
  { href: "/admin/form", label: "Formulario", icon: "≡" },
  { href: "/admin/form-labels", label: "Form (labels)", icon: "≣" },
  { href: "/admin/calendly", label: "Calendly", icon: "▤" },
  { href: "/admin/thankyou", label: "Thank you", icon: "✓" },
  { href: "/admin/no-califica", label: "No califica", icon: "✕" },
  { href: "/admin/contact", label: "Contacto", icon: "@" },
  { href: "/admin/footer", label: "Footer", icon: "⌐" },
  { href: "/admin/legales", label: "Legales", icon: "§" },
];

function Toasts() {
  const { toasts } = useAdmin();
  return (
    <div className="fixed bottom-24 right-6 z-[60] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={
            "px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg pointer-events-auto flex items-center gap-3 " +
            (t.kind === "error"
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-emerald-50 text-emerald-700 border border-emerald-200")
          }
        >
          <span>{t.text}</span>
          {t.action && (
            <button
              type="button"
              onClick={t.action.onClick}
              className="text-[12px] font-semibold underline underline-offset-2 hover:opacity-80"
            >
              {t.action.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function ABBadge() {
  const { content, setActiveTest } = useAdmin();
  const id = content.activeTestId;
  if (!id) {
    return (
      <span className="text-[12px] text-neutral-500 px-3 py-1.5 rounded-full bg-white border border-neutral-200">
        Ningún A/B corriendo
      </span>
    );
  }
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF9A15]/10 border border-[#FF9A15]/40 text-[12px]">
      <span className="size-1.5 rounded-full bg-[#FF9A15] animate-pulse" />
      <span className="text-neutral-800">Test activo:</span>
      <code className="text-[#FF9A15] font-mono">{id}</code>
      <button
        onClick={() => setActiveTest(undefined)}
        className="ml-1 text-neutral-400 hover:text-neutral-700"
        title="Detener test"
      >
        ✕
      </button>
    </div>
  );
}

function PreviewButton() {
  const { previewOpen, setPreviewOpen } = useAdmin();
  return (
    <button
      type="button"
      onClick={() => setPreviewOpen(!previewOpen)}
      className={
        "text-[12px] px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1.5 " +
        (previewOpen
          ? "bg-[#FF9A15]/15 border-[#FF9A15]/50 text-[#c46e00]"
          : "bg-white border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:border-neutral-300")
      }
    >
      <span className="text-[10px]">▣</span>
      {previewOpen ? "Cerrar preview" : "Preview en vivo"}
    </button>
  );
}

function SaveBar() {
  const { dirty, saving, save, reset, invalid } = useAdmin();
  return (
    <div
      className={
        "fixed bottom-0 left-0 right-0 md:left-[240px] z-50 transition-transform " +
        (dirty || saving ? "translate-y-0" : "translate-y-full pointer-events-none")
      }
    >
      <div className="mx-auto max-w-3xl m-4 bg-white border border-neutral-200 rounded-xl shadow-lg px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-neutral-800">
          {saving ? "Guardando…" : invalid ? "Hay campos inválidos" : "Cambios sin guardar"}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={reset}
            disabled={saving}
            className="px-3 py-1.5 text-xs rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-700 disabled:opacity-50"
          >
            Descartar
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving || invalid}
            className="px-4 py-1.5 text-sm font-semibold rounded-md bg-[#FF9A15] text-white hover:brightness-110 disabled:opacity-50 flex items-center gap-2"
            title={invalid ? "Hay campos inválidos" : "Guardar (⌘S)"}
          >
            Guardar
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-black/15 text-white font-mono">⌘S</kbd>
          </button>
        </div>
      </div>
    </div>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 py-3">
      {NAV.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch
            onClick={onNavigate}
            className={
              "flex items-center gap-3 px-5 py-2 text-sm transition-colors " +
              (active
                ? "text-neutral-900 bg-[#FF9A15]/10 border-l-2 border-[#FF9A15] -ml-px pl-[18px] font-medium"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100")
            }
          >
            <span className="w-5 text-center text-neutral-400">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFooter() {
  const router = useRouter();
  const { setShortcutsOpen } = useAdmin();
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };
  return (
    <div className="p-4 border-t border-neutral-200 flex items-center justify-between">
      <button
        onClick={logout}
        className="text-xs text-neutral-500 hover:text-neutral-800"
      >
        Cerrar sesión →
      </button>
      <button
        type="button"
        onClick={() => setShortcutsOpen(true)}
        className="text-xs text-neutral-500 hover:text-neutral-800 px-2 py-0.5 rounded border border-neutral-200 hover:border-neutral-300"
        title="Ver atajos de teclado"
      >
        ?
      </button>
    </div>
  );
}

function DesktopSidebar() {
  return (
    <aside className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:w-[240px] flex-col bg-white border-r border-neutral-200">
      <div className="px-5 py-5 border-b border-neutral-200">
        <p className="text-[11px] text-neutral-400 tracking-[0.2em] uppercase">Admin</p>
        <p className="text-[15px] font-bold text-neutral-900 mt-1">Manuel Núñez</p>
        <p className="text-[12px] text-neutral-500 mt-0.5">Método M90</p>
      </div>
      <NavLinks />
      <SidebarFooter />
    </aside>
  );
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        className={
          "md:hidden fixed inset-0 z-[55] bg-neutral-900/40 backdrop-blur-sm transition-opacity " +
          (open ? "opacity-100" : "opacity-0 pointer-events-none")
        }
        onClick={onClose}
      />
      <aside
        className={
          "md:hidden fixed inset-y-0 left-0 z-[56] w-[260px] bg-white border-r border-neutral-200 flex flex-col transition-transform " +
          (open ? "translate-x-0" : "-translate-x-full")
        }
      >
        <div className="px-5 py-5 border-b border-neutral-200 flex items-start justify-between">
          <div>
            <p className="text-[11px] text-neutral-400 tracking-[0.2em] uppercase">Admin</p>
            <p className="text-[15px] font-bold text-neutral-900 mt-1">Manuel Núñez</p>
            <p className="text-[12px] text-neutral-500 mt-0.5">Método M90</p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-900 text-sm"
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>
        <NavLinks onNavigate={onClose} />
        <SidebarFooter />
      </aside>
    </>
  );
}

function MobileTopbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <div className="md:hidden sticky top-0 z-40 bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between gap-2">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Abrir menú"
        className="text-neutral-700 hover:text-neutral-900 p-1 rounded-md hover:bg-neutral-100"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <p className="font-bold text-sm flex-1 text-center -ml-7 text-neutral-900">Admin</p>
      <PreviewButton />
    </div>
  );
}

function DesktopTopbar() {
  return (
    <div className="hidden md:flex sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-neutral-200 px-8 py-3 items-center justify-end gap-3">
      <PreviewButton />
      <ABBadge />
    </div>
  );
}

function PanelInner({ children }: { children: React.ReactNode }) {
  const { previewOpen } = useAdmin();
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <DesktopSidebar />
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className={"md:pl-[240px] transition-[padding] " + (previewOpen ? "md:pr-[480px] lg:pr-[560px]" : "")}>
        <MobileTopbar onOpenMenu={() => setMobileOpen(true)} />
        <DesktopTopbar />
        <main className="px-5 md:px-8 py-6 md:py-8 pb-32 max-w-3xl mx-auto">
          {children}
        </main>
      </div>
      <SaveBar />
      <Toasts />
      <PreviewPanel />
      <ConfirmDialog />
      <ShortcutsModal />
    </div>
  );
}

export function Shell({ initial, children }: { initial: Content; children: React.ReactNode }) {
  return (
    <AdminProvider initial={initial}>
      <PanelInner>{children}</PanelInner>
    </AdminProvider>
  );
}
