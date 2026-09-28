import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function SectionHeading({ title, eyebrow, description, href, linkLabel = "View all", action, className, as: Tag = "h2" }: { title: ReactNode; eyebrow?: string; description?: ReactNode; href?: string; linkLabel?: string; action?: ReactNode; className?: string; as?: "h1" | "h2" | "h3" }) {
  return (
    <div className={cn("mb-5 flex items-end justify-between gap-4 sm:mb-6", className)}>
      <div className="min-w-0">
        {eyebrow && <p className="mb-1 text-xs font-bold uppercase tracking-wider text-accent-600">{eyebrow}</p>}
        <Tag className="text-2xl font-bold text-foreground">{title}</Tag>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
      {href && (
        <Link href={href} className="group inline-flex shrink-0 items-center gap-1 rounded text-sm font-semibold text-primary-700 hover:text-primary-600 dark:text-primary-200">
          {linkLabel}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      )}
    </div>
  );
}
