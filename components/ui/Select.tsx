import { useId, type ComponentProps, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { fieldBase, FieldError, FieldHint, Label } from "./Input";

export interface SelectProps extends Omit<ComponentProps<"select">, "size"> {
  label?: ReactNode;
  error?: string;
  hint?: ReactNode;
  options?: { value: string; label: string; disabled?: boolean }[];
  placeholder?: string;
  containerClassName?: string;
  selectSize?: "sm" | "md";
}

/** Native select for best mobile ergonomics, styled to match inputs. */
export function Select({ label, error, hint, options, placeholder, id, className, containerClassName, required, children, selectSize = "md", ...props }: SelectProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  return (
    <div className={containerClassName}>
      {label && (
        <Label htmlFor={selectId} required={required}>
          {label}
        </Label>
      )}
      <div className="relative">
        <select
          id={selectId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${selectId}-error` : undefined}
          className={cn(fieldBase, "appearance-none pr-10", selectSize === "sm" ? "h-9 text-sm" : "h-11", className)}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options?.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" aria-hidden />
      </div>
      <FieldError id={`${selectId}-error`}>{error}</FieldError>
      {!error && <FieldHint>{hint}</FieldHint>}
    </div>
  );
}
