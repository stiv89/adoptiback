"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

type Toast = {
  id: string;
  title?: string;
  description?: string;
  variant?: "success" | "error" | "info";
  duration?: number;
};

type ToastContextValue = {
  toast: (t: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  const toast = (t: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();
    const duration = t.duration ?? 3500;
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, duration);
  };

  const value = useMemo(() => ({ toast }), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted && typeof document !== "undefined"
        ? createPortal(
            <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-3">
              {toasts.map((t) => (
                <div
                  key={t.id}
                  className={clsx(
                    "pointer-events-auto w-full max-w-sm rounded-2xl border bg-white/95 p-4 shadow-lg backdrop-blur",
                    {
                      "border-green-200 text-green-800": t.variant === "success",
                      "border-red-200 text-red-800": t.variant === "error",
                      "border-neutral-200 text-neutral-800": !t.variant || t.variant === "info",
                    }
                  )}
                >
                  {t.title ? <p className="text-sm font-semibold">{t.title}</p> : null}
                  {t.description ? <p className="text-sm text-neutral-700">{t.description}</p> : null}
                </div>
              ))}
            </div>,
            document.body
          )
        : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

