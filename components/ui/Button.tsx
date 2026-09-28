import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type ButtonVariant = "primary" | "accent" | "outline" | "ghost" | "subtle" | "danger" | "link";
export type ButtonSize = "sm" | "md" | "lg" | "icon" | "icon-sm";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-[background-color,border-color,color,box-shadow,transform] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 active:scale-[0.98] select-none";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary-800 text-white shadow-sm hover:bg-primary-600",
  accent: "bg-accent-500 text-neutral-900 shadow-sm hover:bg-accent-400 active:bg-accent-600",
  outline: "border border-border bg-surface text-foreground hover:border-primary-600 hover:text-primary-700 dark:hover:text-primary-200",
  ghost: "text-foreground hover:bg-surface-muted",
  subtle: "bg-primary-50 text-primary-800 hover:bg-primary-100 dark:bg-surface-muted dark:text-primary-100",
  danger: "bg-danger text-white hover:bg-red-700",
  link: "h-auto px-0 text-primary-700 underline-offset-4 hover:underline dark:text-primary-200",
};

/* Heights keep touch targets ≥ 44px at md/lg; sm is for dense desktop UI. */
const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-11 w-11",
  "icon-sm": "h-9 w-9",
};

export function buttonVariants({ variant = "primary", size = "md", fullWidth, className }: { variant?: ButtonVariant; size?: ButtonSize; fullWidth?: boolean; className?: string } = {}) {
  return cn(base, variants[variant], variant !== "link" && sizes[size], fullWidth && "w-full", className);
}

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export interface ButtonProps extends ComponentProps<"button">, CommonProps {
  loading?: boolean;
  loadingText?: string;
}

export function Button({ variant, size, fullWidth, leftIcon, rightIcon, loading, loadingText, className, children, disabled, type = "button", ...props }: ButtonProps) {
  return (
    <button type={type} className={buttonVariants({ variant, size, fullWidth, className })} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : leftIcon}
      {loading && loadingText ? loadingText : children}
      {!loading && rightIcon}
    </button>
  );
}

export interface ButtonLinkProps extends ComponentProps<typeof Link>, CommonProps {}

export function ButtonLink({ variant, size, fullWidth, leftIcon, rightIcon, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonVariants({ variant, size, fullWidth, className })} {...props}>
      {leftIcon}
      {children}
      {rightIcon}
    </Link>
  );
}
