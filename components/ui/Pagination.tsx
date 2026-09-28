import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/** Page numbers with ellipses: 1 … 4 5 6 … 12 */
export function pageRange(current: number, total: number, siblings = 1): (number | "…")[] {
  const range: (number | "…")[] = [];
  const start = Math.max(2, current - siblings);
  const end = Math.min(total - 1, current + siblings);
  range.push(1);
  if (start > 2) range.push("…");
  for (let i = start; i <= end; i++) range.push(i);
  if (end < total - 1) range.push("…");
  if (total > 1) range.push(total);
  return range;
}

const item = "inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-sm font-semibold transition-colors";

/** Link-based pagination so every page is SSR-rendered and crawlable. */
export function Pagination({ page, totalPages, hrefFor, className }: { page: number; totalPages: number; hrefFor: (page: number) => string; className?: string }) {
  if (totalPages <= 1) return null;
  const prev = page > 1 ? hrefFor(page - 1) : undefined;
  const next = page < totalPages ? hrefFor(page + 1) : undefined;
  return (
    <nav aria-label="Pagination" className={cn("flex items-center justify-center gap-1", className)}>
      {prev ? (
        <Link href={prev} rel="prev" className={cn(item, "gap-1 text-foreground hover:bg-surface-muted")} aria-label="Previous page">
          <ChevronLeft className="size-4" aria-hidden />
          <span className="hidden sm:inline">Prev</span>
        </Link>
      ) : (
        <span className={cn(item, "gap-1 text-neutral-300 dark:text-neutral-600")} aria-disabled="true">
          <ChevronLeft className="size-4" aria-hidden />
          <span className="hidden sm:inline">Prev</span>
        </span>
      )}
      <ul className="flex items-center gap-1">
        {pageRange(page, totalPages).map((p, i) =>
          p === "…" ? (
            <li key={`e${i}`} className="px-1 text-muted-foreground" aria-hidden>
              …
            </li>
          ) : (
            <li key={p} className={cn(Math.abs(p - page) > 1 && p !== 1 && p !== totalPages && "hidden sm:block")}>
              <Link
                href={hrefFor(p)}
                aria-current={p === page ? "page" : undefined}
                aria-label={`Page ${p}`}
                className={cn(item, p === page ? "bg-primary-800 text-white" : "text-foreground hover:bg-surface-muted")}
              >
                {p}
              </Link>
            </li>
          ),
        )}
      </ul>
      {next ? (
        <Link href={next} rel="next" className={cn(item, "gap-1 text-foreground hover:bg-surface-muted")} aria-label="Next page">
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-4" aria-hidden />
        </Link>
      ) : (
        <span className={cn(item, "gap-1 text-neutral-300 dark:text-neutral-600")} aria-disabled="true">
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-4" aria-hidden />
        </span>
      )}
    </nav>
  );
}
