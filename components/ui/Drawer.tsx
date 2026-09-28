"use client";

import { useId, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useFocusTrap } from "@/lib/hooks/use-focus-trap";
import { useLockBody } from "@/lib/hooks/use-lock-body";
import { useHydrated } from "@/lib/hooks/use-hydrated";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right" | "bottom";
  title?: ReactNode;
  /** Replace the default header entirely */
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  bodyClassName?: string;
  "aria-label"?: string;
}

const panel = {
  left: "inset-y-0 left-0 h-full w-[88vw] max-w-sm animate-slide-in-left",
  right: "inset-y-0 right-0 h-full w-[92vw] max-w-md animate-slide-in-right",
  bottom: "inset-x-0 bottom-0 max-h-[92dvh] w-full rounded-t-2xl animate-slide-up",
};

/** Side drawer (mobile nav, mini-cart) or bottom sheet (filters, sort). */
export function Drawer({ open, onClose, side = "right", title, header, children, footer, className, bodyClassName, "aria-label": ariaLabel }: DrawerProps) {
  const hydrated = useHydrated();
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useLockBody(open);
  useFocusTrap(ref, open, onClose);

  if (!hydrated || !open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 animate-fade-in bg-neutral-900/60 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={!title ? ariaLabel : undefined}
        tabIndex={-1}
        className={cn("absolute flex flex-col bg-surface shadow-2xl focus:outline-none", panel[side], className)}
      >
        {side === "bottom" && <div className="mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-neutral-200" aria-hidden />}
        {header ??
          (title && (
            <div className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border px-4">
              <h2 id={titleId} className="text-base font-bold text-foreground">
                {title}
              </h2>
              <button type="button" onClick={onClose} className="-mr-2 inline-flex size-11 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-muted hover:text-foreground" aria-label="Close">
                <X className="size-5" aria-hidden />
              </button>
            </div>
          ))}
        <div className={cn("flex-1 overflow-y-auto overscroll-contain", bodyClassName)}>{children}</div>
        {footer && <div className="shrink-0 border-t border-border bg-surface p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
