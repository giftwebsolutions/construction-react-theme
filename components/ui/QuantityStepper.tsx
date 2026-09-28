"use client";

import { useId, useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { Unit } from "@/types";
import { cn } from "@/lib/utils/cn";
import { normaliseQty, unitLabel } from "@/lib/utils/units";

export interface QuantityStepperProps {
  value: number;
  onChange: (qty: number) => void;
  min?: number;
  step?: number;
  max?: number;
  unit?: Unit;
  size?: "sm" | "md";
  label?: string;
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

/** Quantity input that respects minimum order and step (e.g. 50 kg increments). */
export function QuantityStepper({ value, onChange, min = 1, step = 1, max, unit, size = "md", label = "Quantity", className, disabled, fullWidth }: QuantityStepperProps) {
  const id = useId();
  // Draft text only exists while the user is typing; otherwise show the controlled value.
  const [draft, setDraft] = useState<string | null>(null);

  const clamp = (n: number) => {
    const q = normaliseQty(n, min, step);
    return max !== undefined ? Math.min(q, Math.max(min, max - ((max - min) % step))) : q;
  };
  const commit = () => {
    if (draft === null) return;
    const n = Number(draft);
    const next = clamp(Number.isFinite(n) && draft.trim() !== "" ? n : min);
    setDraft(null);
    if (next !== value) onChange(next);
  };
  const canDec = value - step >= min;
  const canInc = max === undefined || value + step <= max;
  const h = size === "sm" ? "h-9" : "h-11";
  const w = size === "sm" ? "w-9" : "w-11";

  return (
    <div className={cn("inline-flex flex-col", fullWidth && "flex w-full", className)}>
      <label htmlFor={id} className="sr-only">
        {label}
        {unit ? ` in ${unitLabel(unit, 2)}` : ""}
      </label>
      <div className={cn("inline-flex items-stretch overflow-hidden rounded-lg border border-border bg-surface", fullWidth && "flex w-full", disabled && "opacity-50")}>
        <button type="button" className={cn(w, h, "flex items-center justify-center text-foreground transition-colors hover:bg-surface-muted disabled:text-neutral-300 dark:disabled:text-neutral-600")} onClick={() => onChange(clamp(value - step))} disabled={disabled || !canDec} aria-label={`Decrease by ${step}`}>
          <Minus className="size-4" aria-hidden />
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          step={step}
          max={max}
          value={draft ?? String(value)}
          disabled={disabled}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            }
          }}
          className={cn(h, "w-16 min-w-0 border-x border-border bg-transparent text-center text-sm font-semibold tabular-nums text-foreground focus:outline-none focus-visible:bg-primary-50 dark:focus-visible:bg-surface-muted", size === "sm" && "w-14", fullWidth && "w-auto flex-1")}
        />
        <button type="button" className={cn(w, h, "flex items-center justify-center text-foreground transition-colors hover:bg-surface-muted disabled:text-neutral-300 dark:disabled:text-neutral-600")} onClick={() => onChange(clamp(value + step))} disabled={disabled || !canInc} aria-label={`Increase by ${step}`}>
          <Plus className="size-4" aria-hidden />
        </button>
      </div>
      {unit && (min > 1 || step > 1) && (
        <span className="mt-1 text-[11px] text-muted-foreground">
          Min {min} {unitLabel(unit, min)}
          {step > 1 ? ` · steps of ${step}` : ""}
        </span>
      )}
    </div>
  );
}
