import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export const fieldBase =
  "w-full rounded-lg border border-border bg-surface px-3.5 text-base text-foreground placeholder:text-neutral-400 shadow-[inset_0_1px_1px_rgb(15_23_42/0.03)] transition-colors hover:border-neutral-300 focus:border-primary-600 focus:outline-none focus:ring-3 focus:ring-primary-600/15 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-muted-foreground aria-invalid:border-danger aria-invalid:focus:ring-danger/15 sm:text-sm";

export function Label({ className, required, children, ...props }: ComponentProps<"label"> & { required?: boolean }) {
  return (
    <label className={cn("mb-1.5 block text-sm font-medium text-foreground", className)} {...props}>
      {children}
      {required && <span className="ml-0.5 text-danger" aria-hidden>*</span>}
    </label>
  );
}

export function FieldError({ id, children }: { id?: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs font-medium text-danger">
      {children}
    </p>
  );
}

export function FieldHint({ id, children }: { id?: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-1.5 text-xs text-muted-foreground">
      {children}
    </p>
  );
}

export interface InputProps extends Omit<ComponentProps<"input">, "size"> {
  label?: ReactNode;
  error?: string;
  hint?: ReactNode;
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
  inputSize?: "md" | "lg";
  containerClassName?: string;
}

export function Input({ label, error, hint, leftIcon, rightSlot, inputSize = "md", id, className, containerClassName, required, ...props }: InputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  return (
    <div className={containerClassName}>
      {label && (
        <Label htmlFor={inputId} required={required}>
          {label}
        </Label>
      )}
      <div className="relative">
        {leftIcon && <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400 [&_svg]:size-4.5">{leftIcon}</span>}
        <input
          id={inputId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={cn(error && errId, hint && hintId) || undefined}
          className={cn(fieldBase, inputSize === "lg" ? "h-12" : "h-11", leftIcon && "pl-10", rightSlot && "pr-12", className)}
          {...props}
        />
        {rightSlot && <div className="absolute inset-y-0 right-1 flex items-center">{rightSlot}</div>}
      </div>
      <FieldError id={errId}>{error}</FieldError>
      {!error && <FieldHint id={hintId}>{hint}</FieldHint>}
    </div>
  );
}

export interface TextareaProps extends ComponentProps<"textarea"> {
  label?: ReactNode;
  error?: string;
  hint?: ReactNode;
  containerClassName?: string;
}

export function Textarea({ label, error, hint, id, className, containerClassName, required, rows = 4, ...props }: TextareaProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  return (
    <div className={containerClassName}>
      {label && (
        <Label htmlFor={inputId} required={required}>
          {label}
        </Label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        className={cn(fieldBase, "py-2.5 leading-relaxed", className)}
        {...props}
      />
      <FieldError id={`${inputId}-error`}>{error}</FieldError>
      {!error && <FieldHint id={`${inputId}-hint`}>{hint}</FieldHint>}
    </div>
  );
}
