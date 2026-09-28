"use client";

import { createContext, useContext, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface TabsCtx {
  value: string;
  setValue: (v: string) => void;
  baseId: string;
}
const Ctx = createContext<TabsCtx | null>(null);
type Variant = "underline" | "pill";
const VariantCtx = createContext<Variant>("underline");
const useTabs = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("Tabs components must be used inside <Tabs>");
  return c;
};

export function Tabs({ defaultValue, value, onValueChange, children, className }: { defaultValue?: string; value?: string; onValueChange?: (v: string) => void; children: ReactNode; className?: string }) {
  const [internal, setInternal] = useState(defaultValue ?? "");
  const baseId = useId();
  const current = value ?? internal;
  const setValue = (v: string) => {
    if (value === undefined) setInternal(v);
    onValueChange?.(v);
  };
  return (
    <Ctx.Provider value={{ value: current, setValue, baseId }}>
      <div className={className}>{children}</div>
    </Ctx.Provider>
  );
}

/** Tab list with roving focus (← → Home End), per WAI-ARIA tabs pattern. */
export function TabsList({ children, className, variant = "underline", "aria-label": ariaLabel }: { children: ReactNode; className?: string; variant?: Variant; "aria-label"?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const onKeyDown = (e: KeyboardEvent) => {
    const tabs = Array.from(ref.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])') ?? []);
    const i = tabs.indexOf(document.activeElement as HTMLButtonElement);
    if (i < 0) return;
    let next = -1;
    if (e.key === "ArrowRight") next = (i + 1) % tabs.length;
    if (e.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = tabs.length - 1;
    if (next >= 0) {
      e.preventDefault();
      tabs[next]!.focus();
      tabs[next]!.click();
    }
  };
  return (
    <VariantCtx.Provider value={variant}>
      <div
        ref={ref}
        role="tablist"
        aria-label={ariaLabel}
        onKeyDown={onKeyDown}
        className={cn("no-scrollbar flex overflow-x-auto", variant === "underline" ? "gap-6 border-b border-border" : "gap-2", className)}
      >
        {children}
      </div>
    </VariantCtx.Provider>
  );
}

export function TabsTrigger({ value, children, className, disabled }: { value: string; children: ReactNode; className?: string; disabled?: boolean }) {
  const { value: current, setValue, baseId } = useTabs();
  const variant = useContext(VariantCtx);
  const selected = current === value;
  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-selected={selected}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      onClick={() => setValue(value)}
      className={cn(
        "shrink-0 whitespace-nowrap text-sm font-semibold transition-colors disabled:opacity-40",
        variant === "underline"
          ? cn("-mb-px border-b-2 py-3", selected ? "border-accent-500 text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")
          : cn("h-9 rounded-full border px-4", selected ? "border-primary-800 bg-primary-800 text-white" : "border-border bg-surface text-foreground hover:border-primary-600"),
        className,
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className, keepMounted = false }: { value: string; children: ReactNode; className?: string; keepMounted?: boolean }) {
  const { value: current, baseId } = useTabs();
  const selected = current === value;
  if (!selected && !keepMounted) return null;
  return (
    <div role="tabpanel" id={`${baseId}-panel-${value}`} aria-labelledby={`${baseId}-tab-${value}`} hidden={!selected} tabIndex={0} className={cn("focus-visible:outline-none", className)}>
      {children}
    </div>
  );
}
