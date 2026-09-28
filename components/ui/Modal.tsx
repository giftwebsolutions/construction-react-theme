"use client";

import { useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useFocusTrap } from "@/lib/hooks/use-focus-trap";
import { useLockBody } from "@/lib/hooks/use-lock-body";
import { useHydrated } from "@/lib/hooks/use-hydrated";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const widths = { sm: "sm:max-w-sm", md: "sm:max-w-lg", lg: "sm:max-w-2xl", xl: "sm:max-w-4xl" };

/** Centered dialog on ≥640px; slides up as a bottom sheet on phones. */
export function Modal({ open, onClose, title, description, children, footer, size = "md", className }: ModalProps) {
  const hydrated = useHydrated();
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();
  useLockBody(open);
  useFocusTrap(ref, open, onClose);

  if (!hydrated || !open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4">
      <div className="absolute inset-0 animate-fade-in bg-neutral-900/60 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={cn(
          "relative flex max-h-[92dvh] w-full flex-col rounded-t-2xl bg-surface shadow-2xl animate-slide-up focus:outline-none sm:max-h-[85vh] sm:animate-toast-in sm:rounded-2xl",
          widths[size],
          className,
        )}
      >
        <div className="mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-neutral-200 sm:hidden" aria-hidden />
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 pb-4 pt-3 sm:pt-5">
          <div className="min-w-0">
            <h2 id={titleId} className="text-lg font-bold text-foreground">
              {title}
            </h2>
            {description && (
              <p id={descId} className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          <button type="button" onClick={onClose} className="-mr-2 -mt-1 inline-flex size-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-muted hover:text-foreground" aria-label="Close dialog">
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">{children}</div>
        {footer && <div className="flex flex-col-reverse gap-2 border-t border-border px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:flex-row sm:justify-end">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
