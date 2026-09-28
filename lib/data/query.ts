import type { DeliveryType, ProductQuery, SortKey } from "@/types";

/**
 * Listing state lives in the URL so pages are shareable and SSR-rendered.
 *   ?q=cement&sub=opc-53,ppc&brand=ultratech&min=300&max=500&rating=4
 *   &stock=1&delivery=truck&cert=ISI&discount=10&sort=price-asc&page=2&view=list
 *   &f.grade=OPC%2053&f.grade=PPC        ← dynamic attribute facets (repeatable)
 */
export type SearchParams = Record<string, string | string[] | undefined>;

export const ATTR_PREFIX = "f.";
export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "popularity", label: "Popularity" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Customer Rating" },
];

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const list = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v : v ? [v] : []).flatMap((x) => x.split(",")).map((x) => x.trim()).filter(Boolean);
const num = (v: string | string[] | undefined) => {
  const n = Number(first(v));
  return Number.isFinite(n) && first(v) !== undefined && first(v) !== "" ? n : undefined;
};

export function parseProductQuery(sp: SearchParams, overrides: Partial<ProductQuery> = {}): ProductQuery {
  const attrs: Record<string, string[]> = {};
  for (const [k, v] of Object.entries(sp)) {
    if (!k.startsWith(ATTR_PREFIX) || v === undefined) continue;
    attrs[k.slice(ATTR_PREFIX.length)] = (Array.isArray(v) ? v : [v]).filter(Boolean);
  }
  const sort = first(sp.sort) as SortKey | undefined;
  const tag = first(sp.tag);
  return {
    q: first(sp.q)?.trim() || undefined,
    category: first(sp.category),
    sub: list(sp.sub),
    brand: list(sp.brand),
    minPrice: num(sp.min),
    maxPrice: num(sp.max),
    rating: num(sp.rating),
    inStock: first(sp.stock) === "1",
    delivery: list(sp.delivery) as DeliveryType[],
    cert: list(sp.cert),
    discount: num(sp.discount),
    attrs,
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? sort : undefined,
    page: num(sp.page) ?? 1,
    perPage: 24,
    tag: tag === "new" || tag === "featured" || tag === "bestseller" ? tag : undefined,
    ...overrides,
  };
}

/** Serialise a query back to URLSearchParams (omits empty values and defaults). */
export function toSearchParams(q: ProductQuery & { view?: string }): URLSearchParams {
  const p = new URLSearchParams();
  if (q.q) p.set("q", q.q);
  if (q.category) p.set("category", q.category);
  if (q.sub?.length) p.set("sub", q.sub.join(","));
  if (q.brand?.length) p.set("brand", q.brand.join(","));
  if (q.minPrice !== undefined) p.set("min", String(q.minPrice));
  if (q.maxPrice !== undefined) p.set("max", String(q.maxPrice));
  if (q.rating) p.set("rating", String(q.rating));
  if (q.inStock) p.set("stock", "1");
  if (q.delivery?.length) p.set("delivery", q.delivery.join(","));
  if (q.cert?.length) p.set("cert", q.cert.join(","));
  if (q.discount) p.set("discount", String(q.discount));
  for (const [k, values] of Object.entries(q.attrs ?? {})) for (const v of values) p.append(ATTR_PREFIX + k, v);
  if (q.tag) p.set("tag", q.tag);
  if (q.sort) p.set("sort", q.sort);
  if (q.page && q.page > 1) p.set("page", String(q.page));
  if (q.view && q.view !== "grid") p.set("view", q.view);
  return p;
}

export function countActiveFilters(q: ProductQuery) {
  return (
    (q.sub?.length ?? 0) +
    (q.brand?.length ?? 0) +
    (q.minPrice !== undefined || q.maxPrice !== undefined ? 1 : 0) +
    (q.rating ? 1 : 0) +
    (q.inStock ? 1 : 0) +
    (q.delivery?.length ?? 0) +
    (q.cert?.length ?? 0) +
    (q.discount ? 1 : 0) +
    Object.values(q.attrs ?? {}).reduce((s, v) => s + v.length, 0)
  );
}
