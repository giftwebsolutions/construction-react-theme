import { useId, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * CSS-only tooltip: shows on hover and keyboard focus of the trigger.
 * The trigger should be a focusable element (button/link).
 */
export function Tooltip({ content, children, side = "top", className }: { content: ReactNode; children: ReactNode; side?: "top" | "bottom"; className?: string }) {
  const id = useId();
  return (
    <span className={cn("group/tt relative inline-flex", className)} aria-describedby={id}>
      {children}
      <span
        id={id}
        role="tooltip"
        className={cn(
          "pointer-events-none absolute left-1/2 z-50 w-max max-w-56 -translate-x-1/2 rounded-md bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover/tt:opacity-100 group-focus-within/tt:opacity-100",
          side === "top" ? "bottom-full mb-2" : "top-full mt-2",
        )}
      >
        {content}
      </span>
    </span>
  );
}
