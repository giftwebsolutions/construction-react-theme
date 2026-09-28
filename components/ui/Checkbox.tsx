import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

const control =
  "peer shrink-0 appearance-none border border-neutral-300 bg-surface transition-colors checked:border-primary-800 checked:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-500";

export interface CheckboxProps extends Omit<ComponentProps<"input">, "type"> {
  label?: ReactNode;
  description?: ReactNode;
  count?: number;
  containerClassName?: string;
  /** Render as a radio (same visual) for single-choice facet groups */
  inputType?: "checkbox" | "radio";
}

export function Checkbox({ label, description, count, id, className, containerClassName, inputType = "checkbox", ...props }: CheckboxProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <label htmlFor={inputId} className={cn("group flex min-h-9 cursor-pointer items-start gap-3 py-1 text-sm", props.disabled && "cursor-not-allowed opacity-60", containerClassName)}>
      <span className="relative mt-0.5 inline-flex">
        <input id={inputId} type={inputType} className={cn(control, "size-4.5", inputType === "radio" ? "rounded-full" : "rounded-[5px]", className)} {...props} />
        <svg viewBox="0 0 16 16" className="pointer-events-none absolute inset-0 m-auto size-3.5 text-white opacity-0 peer-checked:opacity-100" aria-hidden>
          <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {(label || description) && (
        <span className="flex min-w-0 flex-1 items-start justify-between gap-2">
          <span className="min-w-0">
            <span className="block text-foreground">{label}</span>
            {description && <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>}
          </span>
          {count !== undefined && <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{count}</span>}
        </span>
      )}
    </label>
  );
}

export interface RadioProps extends Omit<ComponentProps<"input">, "type"> {
  label?: ReactNode;
  description?: ReactNode;
  containerClassName?: string;
}

export function Radio({ label, description, id, className, containerClassName, ...props }: RadioProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <label htmlFor={inputId} className={cn("flex min-h-9 cursor-pointer items-start gap-3 py-1 text-sm", props.disabled && "cursor-not-allowed opacity-60", containerClassName)}>
      <span className="relative mt-0.5 inline-flex">
        <input id={inputId} type="radio" className={cn(control, "size-4.5 rounded-full", className)} {...props} />
        <span className="pointer-events-none absolute inset-0 m-auto size-1.5 rounded-full bg-white opacity-0 peer-checked:opacity-100" aria-hidden />
      </span>
      {(label || description) && (
        <span className="min-w-0">
          <span className="block text-foreground">{label}</span>
          {description && <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>}
        </span>
      )}
    </label>
  );
}

/** Large selectable card built on a radio — for payment methods, delivery slots, account types. */
export function RadioCard({ label, description, icon, id, className, ...props }: Omit<ComponentProps<"input">, "type"> & { label: ReactNode; description?: ReactNode; icon?: ReactNode }) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <label
      htmlFor={inputId}
      className={cn(
        "relative flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary-600 has-[:checked]:border-primary-700 has-[:checked]:bg-primary-50 has-[:checked]:ring-1 has-[:checked]:ring-primary-700 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring dark:has-[:checked]:bg-surface-muted",
        props.disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      <input id={inputId} type="radio" className="sr-only" {...props} />
      {icon && <span className="mt-0.5 text-primary-700 dark:text-primary-200 [&_svg]:size-5">{icon}</span>}
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-muted-foreground">{description}</span>}
      </span>
    </label>
  );
}
