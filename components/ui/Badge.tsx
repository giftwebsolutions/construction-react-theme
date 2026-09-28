import type { ComponentProps } from "react";
import { cn } from "@/lib/utils/cn";

export type BadgeTone = "primary" | "accent" | "success" | "warning" | "danger" | "neutral" | "outline" | "dark";

const tones: Record<BadgeTone, string> = {
  primary: "bg-primary-100 text-primary-800 dark:bg-primary-700/40 dark:text-primary-100",
  accent: "bg-accent-500 text-neutral-900",
  success: "bg-success-50 text-green-800 dark:bg-green-900/40 dark:text-green-200",
  warning: "bg-warning-50 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200",
  danger: "bg-danger text-white",
  neutral: "bg-neutral-100 text-neutral-700 dark:bg-surface-muted dark:text-neutral-300",
  outline: "border border-border bg-surface text-foreground",
  dark: "bg-primary-900 text-white",
};

export interface BadgeProps extends ComponentProps<"span"> {
  tone?: BadgeTone;
  size?: "sm" | "md";
}

export function Badge({ tone = "primary", size = "sm", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-md font-semibold leading-none [&_svg]:size-3",
        size === "sm" ? "h-5 px-1.5 text-[11px]" : "h-6 px-2 text-xs",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
