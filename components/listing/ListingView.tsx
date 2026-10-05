import Link from "next/link";
import { PackageSearch, X } from "lucide-react";
import type { ProductListResult, ProductQuery } from "@/types";
import { toCards } from "@/lib/data/card";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { ProductGrid } from "@/components/product/ProductCard";
import { formatSAR, formatNumber } from "@/lib/utils/format";
import { applyFacet, clearFilters, isSelected, listingHref, type ListingContext } from "./filter-state";
import { FilterSidebar, ListingToolbar, LoadMore, ResultsArea } from "./ListingControls";

interface Chip {
  label: string;
  href: string;
}

function activeChips(result: ProductListResult, q: ProductQuery, ctx: ListingContext, hidden: string[] = []): Chip[] {
  const chips: Chip[] = [];
  for (const f of result.facets) {
    if (hidden.includes(f.key)) continue;
    for (const o of f.options) {
      if (!isSelected(q, f.key, o.value)) continue;
      if (f.key === "category" && ctx.pathCategory) continue;
      chips.push({ label: f.key.startsWith("attr:") ? `${f.label}: ${o.label}` : o.label, href: listingHref(ctx, applyFacet(q, f.key, o.value, false)) });
    }
  }
  if (q.minPrice !== undefined || q.maxPrice !== undefined) {
    chips.push({
      label: `${formatSAR(q.minPrice ?? result.priceRange.min)} – ${formatSAR(q.maxPrice ?? result.priceRange.max)}`,
      href: listingHref(ctx, { ...q, minPrice: undefined, maxPrice: undefined, page: 1 }),
    });
  }
  return chips;
}

export function ListingView({ result, query, ctx, hiddenFacets, emptySuggestions }: { result: ProductListResult; query: ProductQuery; ctx: ListingContext; hiddenFacets?: string[]; emptySuggestions?: { label: string; href: string }[] }) {
  const view = ctx.view ?? "grid";
  const cards = toCards(result.items);
  const chips = activeChips(result, query, ctx, hiddenFacets);
  const from = result.total ? (result.page - 1) * result.perPage + 1 : 0;
  const to = Math.min(result.total, result.page * result.perPage);

  return (
    <div className="grid gap-6 lg:grid-cols-[272px_1fr]">
      <FilterSidebar ctx={ctx} facets={result.facets} priceRange={result.priceRange} query={query} hidden={hiddenFacets} />
      <div className="min-w-0">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <p className="hidden text-sm text-muted-foreground lg:block">
            {result.total ? (
              <>
                Showing <strong className="text-foreground">{from}–{to}</strong> of <strong className="text-foreground">{formatNumber(result.total)}</strong> products
              </>
            ) : (
              "No products found"
            )}
          </p>
          <ListingToolbar ctx={ctx} facets={result.facets} priceRange={result.priceRange} query={query} total={result.total} hidden={hiddenFacets} />
          <p className="text-sm text-muted-foreground lg:hidden">{formatNumber(result.total)} products</p>
        </div>

        {chips.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2" aria-label="Active filters">
            {chips.map((c) => (
              <Link key={c.href + c.label} href={c.href} scroll={false} className="inline-flex h-8 items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 pl-3 pr-2 text-xs font-medium text-primary-800 hover:border-primary-600 dark:border-primary-700 dark:bg-surface-muted dark:text-primary-100" aria-label={`Remove filter ${c.label}`}>
                {c.label} <X className="size-3.5" aria-hidden />
              </Link>
            ))}
            <Link href={listingHref(ctx, clearFilters(query, ctx))} scroll={false} className="px-2 text-xs font-semibold text-danger hover:underline">
              Clear all
            </Link>
          </div>
        )}

        <ResultsArea>
          {cards.length ? (
            <>
              <ProductGrid cards={cards} view={view} priorityCount={4} />
              <LoadMore ctx={ctx} query={query} page={result.page} totalPages={result.totalPages} view={view} />
              <Pagination page={result.page} totalPages={result.totalPages} hrefFor={(p) => listingHref(ctx, { ...query, page: p })} className="mt-10 hidden lg:flex" />
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-surface">
              <EmptyState
                icon={<PackageSearch aria-hidden />}
                title={query.q ? `No results for “${query.q}”` : "No products match these filters"}
                description="Try removing a filter, checking the spelling, or browsing a related category."
                actions={
                  <>
                    {chips.length > 0 && <ButtonLink href={listingHref(ctx, clearFilters(query, ctx))}>Clear all filters</ButtonLink>}
                    <ButtonLink href="/categories" variant="outline">
                      Browse categories
                    </ButtonLink>
                  </>
                }
              >
                {emptySuggestions && emptySuggestions.length > 0 && (
                  <div className="mt-8">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Popular searches</p>
                    <div className="mt-3 flex flex-wrap justify-center gap-2">
                      {emptySuggestions.map((s) => (
                        <Link key={s.href} href={s.href} className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-primary-600">
                          {s.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </EmptyState>
            </div>
          )}
        </ResultsArea>
      </div>
    </div>
  );
}
