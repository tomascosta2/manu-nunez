"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Content } from "@/lib/content";

type ToastAction = { label: string; onClick: () => void };
type Toast = {
  id: string;
  text: string;
  kind: "success" | "error";
  action?: ToastAction;
};

type ConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
};

type ConfirmState = ConfirmOptions & {
  resolve: (ok: boolean) => void;
};

type Ctx = {
  content: Content;
  setContent: (next: Content | ((prev: Content) => Content)) => void;
  dirty: boolean;
  saving: boolean;
  save: () => Promise<void>;
  reset: () => void;
  setActiveTest: (id: string | undefined) => void;
  toasts: Toast[];
  pushToast: (text: string, kind?: "success" | "error", opts?: { action?: ToastAction; duration?: number }) => void;
  // Preview
  previewOpen: boolean;
  previewPath: string;
  previewKey: number;
  setPreviewOpen: (open: boolean) => void;
  setPreviewPath: (path: string) => void;
  // Confirm dialog
  confirm: (opts: ConfirmOptions) => Promise<boolean>;
  pendingConfirm: ConfirmState | null;
  // Validation
  invalid: boolean;
  setFieldError: (key: string, error: string | null) => void;
  fieldErrors: Record<string, string>;
  // Shortcuts modal
  shortcutsOpen: boolean;
  setShortcutsOpen: (open: boolean) => void;
};

const AdminCtx = createContext<Ctx | null>(null);

export function useAdmin() {
  const c = useContext(AdminCtx);
  if (!c) throw new Error("useAdmin must be used inside AdminProvider");
  return c;
}

export function AdminProvider({ initial, children }: { initial: Content; children: React.ReactNode }) {
  const [content, setContentState] = useState<Content>(initial);
  const [savedSnapshot, setSavedSnapshot] = useState<string>(JSON.stringify(initial));
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPath, setPreviewPath] = useState("/");
  const [previewKey, setPreviewKey] = useState(0);
  const [pendingConfirm, setPendingConfirm] = useState<ConfirmState | null>(null);
  const [fieldErrors, setFieldErrorsState] = useState<Record<string, string>>({});
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  const dirty = JSON.stringify(content) !== savedSnapshot;
  const invalid = Object.values(fieldErrors).some((v) => !!v);

  const setContent = useCallback((next: Content | ((prev: Content) => Content)) => {
    setContentState((prev) => (typeof next === "function" ? (next as (p: Content) => Content)(prev) : next));
  }, []);

  const setActiveTest = useCallback((id: string | undefined) => {
    setContentState((prev) => ({ ...prev, activeTestId: id }));
  }, []);

  const setFieldError = useCallback((key: string, error: string | null) => {
    setFieldErrorsState((prev) => {
      if (!error) {
        if (!(key in prev)) return prev;
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: error };
    });
  }, []);

  const pushToast = useCallback(
    (text: string, kind: "success" | "error" = "success", opts?: { action?: ToastAction; duration?: number }) => {
      const id = Math.random().toString(36).slice(2);
      const duration = opts?.duration ?? 3000;
      setToasts((t) => [...t, { id, text, kind, action: opts?.action }]);
      if (duration > 0) {
        setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), duration);
      }
      return id;
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const save = useCallback(async () => {
    if (invalid) {
      pushToast("Hay campos inválidos. Revisalos antes de guardar.", "error");
      return;
    }
    setSaving(true);
    const prevSnapshot = savedSnapshot;
    try {
      const json = JSON.stringify(content);
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: json,
      });
      if (!res.ok) throw new Error("save failed");
      setSavedSnapshot(json);
      const undoId = Math.random().toString(36).slice(2);
      setToasts((t) => [
        ...t,
        {
          id: undoId,
          text: "Cambios guardados",
          kind: "success",
          action: {
            label: "Deshacer",
            onClick: async () => {
              setToasts((t) => t.filter((x) => x.id !== undoId));
              try {
                const r = await fetch("/api/content", {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: prevSnapshot,
                });
                if (!r.ok) throw new Error("undo failed");
                setContentState(JSON.parse(prevSnapshot));
                setSavedSnapshot(prevSnapshot);
                pushToast("Cambios revertidos");
              } catch {
                pushToast("No se pudo deshacer", "error");
              }
            },
          },
        },
      ]);
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== undoId)), 5000);
    } catch (e) {
      pushToast("Error al guardar", "error");
    } finally {
      setSaving(false);
    }
  }, [content, savedSnapshot, invalid, pushToast]);

  const reset = useCallback(() => {
    setContentState(JSON.parse(savedSnapshot));
  }, [savedSnapshot]);

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setPendingConfirm({
        ...opts,
        resolve: (ok: boolean) => {
          setPendingConfirm(null);
          resolve(ok);
        },
      });
    });
  }, []);

  // Cmd+S / Ctrl+S
  const dirtyRef = useRef(dirty);
  dirtyRef.current = dirty;
  const saveRef = useRef(save);
  saveRef.current = save;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inField = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (dirtyRef.current) saveRef.current();
        return;
      }
      if (e.key === "?" && e.shiftKey && !inField) {
        e.preventDefault();
        setShortcutsOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  // Preview: enable/disable cookie
  useEffect(() => {
    if (previewOpen) {
      fetch("/api/preview/enable", { method: "POST" }).catch(() => { });
    } else {
      fetch("/api/preview/disable", { method: "POST" }).catch(() => { });
    }
  }, [previewOpen]);

  // Preview: push draft + bump iframe key (debounced)
  const draftTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastDraftRef = useRef<string>("");
  useEffect(() => {
    if (!previewOpen) return;
    const json = JSON.stringify(content);
    if (json === lastDraftRef.current) return;
    if (draftTimer.current) clearTimeout(draftTimer.current);
    draftTimer.current = setTimeout(async () => {
      try {
        const r = await fetch("/api/content/draft", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: json,
        });
        if (r.ok) {
          lastDraftRef.current = json;
          setPreviewKey((k) => k + 1);
        }
      } catch { }
    }, 800);
    return () => {
      if (draftTimer.current) clearTimeout(draftTimer.current);
    };
  }, [content, previewOpen]);

  // Push initial draft when preview opens
  useEffect(() => {
    if (!previewOpen) return;
    const json = JSON.stringify(content);
    fetch("/api/content/draft", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: json,
    })
      .then((r) => {
        if (r.ok) {
          lastDraftRef.current = json;
          setPreviewKey((k) => k + 1);
        }
      })
      .catch(() => { });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewOpen]);

  const ctxValue: Ctx = {
    content,
    setContent,
    dirty,
    saving,
    save,
    reset,
    setActiveTest,
    toasts,
    pushToast,
    previewOpen,
    previewPath,
    previewKey,
    setPreviewOpen,
    setPreviewPath,
    confirm,
    pendingConfirm,
    invalid,
    setFieldError,
    fieldErrors,
    shortcutsOpen,
    setShortcutsOpen,
  };

  return <AdminCtx.Provider value={ctxValue}>{children}</AdminCtx.Provider>;
}
