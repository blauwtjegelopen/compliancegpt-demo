// apps/web/components/ToastProvider.tsx
"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import clsx from "clsx";

type Toast = {
  id: string;
  title?: string;
  description?: string;
  tone?: "success" | "error" | "info";
};

type NewToast = Omit<Toast, "id">;

const ToastCtx = createContext<{ push: (t: NewToast) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((t: NewToast) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, ...t }]);
  }, []);

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastCtx.Provider value={value}>
      {children}

      {/* Top-center stack */}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex justify-center px-3">
        <div className="flex w-full max-w-md flex-col gap-2">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDone={() => remove(t.id)} />
          ))}
        </div>
      </div>
    </ToastCtx.Provider>
  );
}

function ToastItem({
  toast,
  onDone,
}: {
  toast: Toast;
  onDone: () => void;
}) {
  // show/hide state to drive CSS transition
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef<number | null>(null);
  const removeTimer = useRef<number | null>(null);

  // mount animation (delay by a tick for transition to kick in)
  useEffect(() => {
    const t = window.setTimeout(() => setVisible(true), 16);
    // auto-hide after 3.2s, then remove after transition
    hideTimer.current = window.setTimeout(() => {
      setVisible(false);
      removeTimer.current = window.setTimeout(() => onDone(), 240);
    }, 3200);
    return () => {
      window.clearTimeout(t);
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
      if (removeTimer.current) window.clearTimeout(removeTimer.current);
    };
  }, [onDone]);

  return (
    <div
      className={clsx(
        "pointer-events-auto flex flex-col rounded-xl border px-4 py-3 shadow-sm backdrop-blur transition",
        // base palette
        "bg-white/95 text-gray-900 border-gray-200",
        "dark:bg-neutral-900/90 dark:text-gray-100 dark:border-white/10",
        // tone accents
        toast.tone === "success" &&
          "border-emerald-300/70 bg-emerald-50/80 dark:border-emerald-500/40 dark:bg-emerald-900/30",
        toast.tone === "error" &&
          "border-rose-300/70 bg-rose-50/80 dark:border-rose-500/40 dark:bg-rose-900/30",
        toast.tone === "info" &&
          "border-cyan-300/70 bg-cyan-50/80 dark:border-cyan-500/40 dark:bg-cyan-900/30"
      )}
      style={{
        // 👇 subtle motion + fade
        transform: visible ? "translateY(0)" : "translateY(-8px)",
        opacity: visible ? 1 : 0,
        transition:
          "transform 220ms cubic-bezier(.22,1,.36,1), opacity 220ms linear",
      }}
      role="status"
      aria-live="polite"
    >
      <div className="text-sm font-semibold">
        {toast.title ??
          (toast.tone === "error"
            ? "Something went wrong"
            : toast.tone === "success"
            ? "Done"
            : "Notice")}
      </div>
      {toast.description && (
        <div className="mt-0.5 text-xs text-gray-600 dark:text-gray-300">
          {toast.description}
        </div>
      )}
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider/>");
  return ctx;
}