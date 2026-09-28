"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { ArrowDownUp, Check, LayoutGrid, List, Loader2, SlidersHorizontal } from "lucide-react";
import type { Facet, PriceRange, ProductQuery, SortKey } from "@/types";
import type { ProductCardData } from "@/lib/data/card";
import { SORT_OPTIONS, countActiveFilters } from "@/lib/data/query";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { ProductGrid } from "@/components/product/ProductCard";
import { useUI } from "@/store/ui";
import { cn } from "@/lib/utils/cn";
import { FilterPanel } from "./FilterPanel";
import { clearFilters, listingHref, type ListingContext } from "./filter-state";

function useListingNav(ctx: ListingContext) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const setPending = useUI((s) => s.setListingPending);
  useEffect(() => setPending(pending), [pending, setPending]);
  return {
    pending,
    go: (q: ProductQuery, extra: { view?: string } = {}) => start(() => router.push(listingHref({ ...ctx, ...extra } as ListingContext, q), { scroll: false })),
  };
}

/** Desktop sticky sidebar — each change navigates immediately. */
export function FilterSidebar({ ctx, facets, priceRange, query, hidden }: { ctx: ListingContext; facets: Facet[]; priceRange: PriceRange; query: ProductQuery; hidden?: string[] }) {
  const { go, pending } = useListingNav(ctx);
  const active = countActiveFilters(query);
  return (
    <aside aria-label="Filters" className="hidden lg:block">
      <div className="sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto rounded-xl border border-border bg-surface px-4 pb-2 pt-4 shadow-card">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="flex items-center gap-2 text-base font-bold text-foreground">
            <SlidersHorizontal className="size-4.5" aria-hidden /> Filters
            {pending && <Loader2 className="size-4 animate-spin text-muted-foreground" aria-label="Updating" />}
          </h2>
          {active > 0 && (
            <button type="button" onClick={() => go(clearFilters(query, ctx))} className="text-xs font-semibold text-primary-700 hover:underline dark:text-primary-200">
              Clear all
            </button>
          )}
        </div>
        <FilterPanel facets={facets} priceRange={priceRange} query={query} onChange={(q) => go(q)} hidden={hidden} />
      </div>
    </aside>
  );
}

/** Sort dropdown + grid/list toggle (desktop), and sticky Filter / Sort bar with bottom sheets (mobile). */
export function ListingToolbar({ ctx, facets, priceRange, query, total, hidden }: { ctx: ListingContext; facets: Facet[]; priceRange: PriceRange; query: ProductQuery; total: number; hidden?: string[] }) {
  const { go } = useListingNav(ctx);
  const [sheet, setSheet] = useState<"filter" | "sort" | null>(null);
  const [staged, setStaged] = useState<ProductQuery>(query);
  const sort = query.sort ?? (query.q ? "relevance" : "popularity");
  const active = countActiveFilters(query);
  const view = ctx.view ?? "grid";
  const sortOptions = SORT_OPTIONS.filter((o) => o.value !== "relevance" || query.q);

  const openFilters = () => {
    setStaged(query);
    setSheet("filter");
  };

  return (
    <>
      {/* Desktop */}
      <div className="hidden items-center justify-end gap-3 lg:flex">
        <label htmlFor="sort" className="text-sm text-muted-foreground">
          Sort by
        </label>
        <select id="sort" value={sort} onChange={(e) => go({ ...query, sort: e.target.value as SortKey, page: 1 })} className="h-10 rounded-lg border border-border bg-surface px-3 pr-8 text-sm font-medium text-foreground focus:border-primary-600 focus:outline-none">
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <div className="flex rounded-lg border border-border bg-surface p-0.5" role="group" aria-label="View">
          {(["grid", "list"] as const).map((v) => (
            <Link
              key={v}
              href={listingHref({ ...ctx, view: v }, query)}
              scroll={false}
              aria-label={`${v} view`}
              aria-current={view === v ? "true" : undefined}
              className={cn("flex size-9 items-center justify-center rounded-md", view === v ? "bg-primary-800 text-white" : "text-muted-foreground hover:text-foreground")}
            >
              {v === "grid" ? <LayoutGrid className="size-4" aria-hidden /> : <List className="size-4" aria-hidden />}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div className="sticky top-14 z-30 -mx-4 grid grid-cols-2 border-y border-border bg-surface/95 backdrop-blur lg:hidden">
        <button type="button" onClick={openFilters} className="flex h-12 items-center justify-center gap-2 border-r border-border text-sm font-semibold text-foreground">
          <SlidersHorizontal className="size-4" aria-hidden /> Filter
          {active > 0 && <span className="rounded-full bg-accent-500 px-1.5 text-xs font-bold text-neutral-900">{active}</span>}
        </button>
        <button type="button" onClick={() => setSheet("sort")} className="flex h-12 items-center justify-center gap-2 text-sm font-semibold text-foreground">
          <ArrowDownUp className="size-4" aria-hidden /> {SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Sort"}
        </button>
      </div>

      <Drawer
        open={sheet === "filter"}
        onClose={() => setSheet(null)}
        side="bottom"
        title={`Filters${countActiveFilters(staged) ? ` (${countActiveFilters(staged)})` : ""}`}
        className="h-[92dvh]"
        bodyClassName="px-4"
        footer={
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={() => setStaged(clearFilters(query, ctx))}>
              Clear all
            </Button>
            <Button
              onClick={() => {
                setSheet(null);
                go(staged);
              }}
            >
              Show results
            </Button>
          </div>
        }
      >
        <FilterPanel facets={facets} priceRange={priceRange} query={staged} onChange={setStaged} hidden={hidden} />
      </Drawer>

      <Drawer open={sheet === "sort"} onClose={() => setSheet(null)} side="bottom" title="Sort by">
        <ul className="pb-[env(safe-area-inset-bottom)]">
          {sortOptions.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                onClick={() => {
                  setSheet(null);
                  go({ ...query, sort: o.value, page: 1 });
                }}
                className={cn("flex min-h-13 w-full items-center justify-between px-5 text-left text-sm", o.value === sort ? "font-bold text-primary-800 dark:text-accent-400" : "text-foreground")}
              >
                {o.label}
                {o.value === sort && <Check className="size-4.5" aria-hidden />}
              </button>
            </li>
          ))}
        </ul>
      </Drawer>
      <span className="sr-only" aria-live="polite">
        {total} products found
      </span>
    </>
  );
}

/** Dims results while a filter navigation is in flight. */
export function ResultsArea({ children }: { children: React.ReactNode }) {
  const pending = useUI((s) => s.listingPending);
  return <div className={cn("transition-opacity duration-150", pending && "pointer-events-none opacity-50")} aria-busy={pending}>{children}</div>;
}

/** Mobile "Load more" — appends the next pages client-side via /api/listing. */
export function LoadMore({ ctx, query, page, totalPages, view }: { ctx: ListingContext; query: ProductQuery; page: number; totalPages: number; view: "grid" | "list" }) {
  const [extra, setExtra] = useState<ProductCardData[]>([]);
  const [next, setNext] = useState(page + 1);
  const [loading, setLoading] = useState(false);
  if (page >= totalPages) return null;
  const load = async () => {
    setLoading(true);
    const qs = listingHref({ ...ctx, basePath: "" }, { ...query, category: ctx.pathCategory ?? query.category, brand: ctx.pathBrand ? [ctx.pathBrand] : query.brand, page: next }).replace(/^\?/, "");
    // listingHref strips path-fixed keys; add them back for the API.
    const params = new URLSearchParams(qs);
    if (ctx.pathCategory) params.set("category", ctx.pathCategory);
    if (ctx.pathBrand) params.set("brand", ctx.pathBrand);
    params.set("page", String(next));
    const d = await fetch(`/api/listing?${params}`).then((r) => r.json());
    setExtra((e) => [...e, ...d.cards]);
    setNext((n) => n + 1);
    setLoading(false);
  };
  return (
    <div className="lg:hidden">
      {extra.length > 0 && <ProductGrid cards={extra} view={view} className="mt-3" />}
      {next <= totalPages && (
        <Button variant="outline" fullWidth size="lg" className="mt-6" loading={loading} loadingText="Loading…" onClick={load}>
          Load more products
        </Button>
      )}
    </div>
  );
}
