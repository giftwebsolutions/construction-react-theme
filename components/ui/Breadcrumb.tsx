import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface Crumb {
  label: string;
  href?: string;
}

/** Breadcrumb trail + BreadcrumbList JSON-LD for SEO. */
export function Breadcrumb({ items, className, siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000" }: { items: Crumb[]; className?: string; siteUrl?: string }) {
  const all: Crumb[] = [{ label: "Home", href: "/" }, ...items];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, ...(c.href ? { item: `${siteUrl}${c.href}` } : {}) })),
  };
  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0", className)}>
      <ol className="no-scrollbar flex items-center gap-1 overflow-x-auto whitespace-nowrap text-xs text-muted-foreground sm:text-sm">
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex min-w-0 items-center gap-1">
              {i > 0 && <ChevronRight className="size-3.5 shrink-0 text-neutral-400" aria-hidden />}
              {c.href && !last ? (
                <Link href={c.href} className="inline-flex items-center gap-1 rounded hover:text-primary-700 hover:underline dark:hover:text-primary-200">
                  {i === 0 && <Home className="size-3.5" aria-hidden />}
                  <span className={i === 0 ? "sr-only sm:not-sr-only" : undefined}>{c.label}</span>
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={cn("truncate", last && "font-medium text-foreground")}>
                  {c.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}
