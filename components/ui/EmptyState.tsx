import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function EmptyState({ icon, title, description, actions, children, className, compact }: { icon?: ReactNode; title: ReactNode; description?: ReactNode; actions?: ReactNode; children?: ReactNode; className?: string; compact?: boolean }) {
  return (
    <div className={cn("flex flex-col items-center text-center", compact ? "px-4 py-8" : "px-4 py-14 sm:py-20", className)}>
      {icon && (
        <div className="relative mb-5 flex size-20 items-center justify-center rounded-full bg-primary-50 text-primary-700 dark:bg-surface-muted dark:text-primary-200 [&_svg]:size-9">
          <span className="absolute inset-2 rounded-full border-2 border-dashed border-primary-200 dark:border-primary-700" aria-hidden />
          {icon}
        </div>
      )}
      <h2 className={cn("font-bold text-foreground text-balance", compact ? "text-base" : "text-lg sm:text-2xl")}>{title}</h2>
      {description && <p className="mt-2 max-w-md text-sm text-muted-foreground text-balance">{description}</p>}
      {actions && <div className="mt-6 flex flex-wrap justify-center gap-3">{actions}</div>}
      {children}
    </div>
  );
}
