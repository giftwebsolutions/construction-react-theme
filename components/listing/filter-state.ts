import type { DeliveryType, ProductQuery } from "@/types";
import { toSearchParams } from "@/lib/data/query";

/** Keys the page fixes via its path (e.g. /category/[slug], /brand/[slug]) — never serialised. */
export interface ListingContext {
  basePath: string;
  pathCategory?: string;
  pathBrand?: string;
  view?: "grid" | "list";
}

export function listingHref(ctx: ListingContext, q: ProductQuery, overrides: Partial<ProductQuery> & { view?: string } = {}) {
  const merged: ProductQuery & { view?: string } = { ...q, view: ctx.view, ...overrides };
  if (ctx.pathCategory) merged.category = undefined;
  if (ctx.pathBrand) merged.brand = undefined;
  const qs = toSearchParams(merged).toString();
  return qs ? `${ctx.basePath}?${qs}` : ctx.basePath;
}

const toggle = (list: string[] | undefined, v: string, on: boolean) => {
  const set = new Set(list ?? []);
  if (on) set.add(v);
  else set.delete(v);
  return [...set];
};

/** Is option `value` of facet `key` currently selected? */
export function isSelected(q: ProductQuery, key: string, value: string): boolean {
  if (key === "sub") return !!q.sub?.includes(value);
  if (key === "brand") return !!q.brand?.includes(value);
  if (key === "category") return q.category === value;
  if (key === "rating") return q.rating === Number(value);
  if (key === "discount") return q.discount === Number(value);
  if (key === "availability") return !!q.inStock;
  if (key === "delivery") return !!q.delivery?.includes(value as DeliveryType);
  if (key === "cert") return !!q.cert?.includes(value);
  if (key.startsWith("attr:")) return !!q.attrs?.[key.slice(5)]?.includes(value);
  return false;
}

/** Return a new query with one facet option toggled; always resets to page 1. */
export function applyFacet(q: ProductQuery, key: string, value: string, on: boolean): ProductQuery {
  const next: ProductQuery = { ...q, page: 1, attrs: { ...(q.attrs ?? {}) } };
  if (key === "sub") next.sub = toggle(q.sub, value, on);
  else if (key === "brand") next.brand = toggle(q.brand, value, on);
  else if (key === "category") {
    next.category = on ? value : undefined;
    next.sub = [];
    next.attrs = {};
  } else if (key === "rating") next.rating = on ? Number(value) : undefined;
  else if (key === "discount") next.discount = on ? Number(value) : undefined;
  else if (key === "availability") next.inStock = on;
  else if (key === "delivery") next.delivery = toggle(q.delivery, value, on) as DeliveryType[];
  else if (key === "cert") next.cert = toggle(q.cert, value, on);
  else if (key.startsWith("attr:")) {
    const k = key.slice(5);
    const vals = toggle(q.attrs?.[k], value, on);
    if (vals.length) next.attrs![k] = vals;
    else delete next.attrs![k];
  }
  return next;
}

export function clearFilters(q: ProductQuery, ctx: ListingContext): ProductQuery {
  return { q: q.q, sort: q.sort, tag: q.tag, category: ctx.pathCategory ? q.category : undefined, page: 1 };
}

/** Single-choice facets render as radios. */
export const SINGLE_CHOICE = new Set(["rating", "discount", "category"]);
