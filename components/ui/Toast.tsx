"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useToastStore, type ToastItem } from "@/store/toast";

const icons = {
  success: <CheckCircle2 className="size-5 text-success" aria-hidden />,
  error: <XCircle className="size-5 text-danger" aria-hidden />,
  info: <Info className="size-5 text-primary-600" aria-hidden />,
  warning: <AlertTriangle className="size-5 text-accent-600" aria-hidden />,
};

/** Mount once in the root layout. Sits above the mobile bottom nav. */
export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  return (
    <div aria-live="polite" aria-relevant="additions" className="pointer-events-none fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-[80] flex flex-col items-center gap-2 px-4 lg:bottom-6 lg:right-6 lg:left-auto lg:items-end">
      {toasts.map((t) => (
        <ToastCard key={t.id} toast={t} />
      ))}
    </div>
  );
}

function ToastCard({ toast }: { toast: ToastItem }) {
  const dismiss = useToastStore((s) => s.dismiss);
  useEffect(() => {
    const id = setTimeout(() => dismiss(toast.id), toast.duration);
    return () => clearTimeout(id);
  }, [toast.id, toast.duration, dismiss]);
  return (
    <div role={toast.tone === "error" ? "alert" : "status"} className="pointer-events-auto flex w-full max-w-sm animate-toast-in items-start gap-3 rounded-xl border border-border bg-surface p-3.5 shadow-card-hover">
      <span className="mt-0.5 shrink-0">{icons[toast.tone]}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{toast.title}</p>
        {toast.description && <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{toast.description}</p>}
        {toast.action &&
          (toast.action.href ? (
            <Link href={toast.action.href} onClick={() => dismiss(toast.id)} className="mt-1.5 inline-block text-xs font-bold text-primary-700 hover:underline dark:text-primary-200">
              {toast.action.label}
            </Link>
          ) : (
            <button type="button" onClick={() => { toast.action?.onClick?.(); dismiss(toast.id); }} className="mt-1.5 text-xs font-bold text-primary-700 hover:underline dark:text-primary-200">
              {toast.action.label}
            </button>
          ))}
      </div>
      <button type="button" onClick={() => dismiss(toast.id)} className={cn("-m-1 inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-muted")} aria-label="Dismiss notification">
        <X className="size-4" aria-hidden />
      </button>
    </div>
  );
}
