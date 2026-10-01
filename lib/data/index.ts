/* ============================================================================
   Smart-MEP data access layer
   Every UI read goes through these async functions. To connect a real backend
   (Laravel / REST), replace the bodies with fetch() calls that return the same
   types — no component changes required.
============================================================================ */
import type {
  Brand,
  Category,
  Facet,
  FacetOption,
  Product,
  ProductListResult,
  ProductQuery,
  SearchSuggestion,
} from "@/types";
import { discountPercent } from "@/lib/utils/format";
import { normalisePhone } from "@/lib/utils/validators";
import { products } from "./products";
import { categories, attributeLabel } from "./categories";
import { brands } from "./brands";
import { blogPosts, heroSlides, promos, testimonials } from "./content";
import { generateQuestions, generateReviews, ratingBreakdown } from "./reviews";
import { addresses, notifications, orders, projects, quotes, users } from "./account";
import { estimateDelivery } from "./locations";

/** Simulated network latency; set MOCK_LATENCY_MS to preview loading skeletons. */
const LATENCY = Number(process.env.MOCK_LATENCY_MS ?? 0);
const delay = <T>(value: T): Promise<T> =>
  LATENCY > 0 ? new Promise((r) => setTimeout(() => r(value), LATENCY)) : Promise.resolve(value);

const byId = <T extends { id: string }>(list: T[]) => new Map(list.map((x) => [x.id, x]));
const productById = byId(products);
const brandById = byId(brands);
const categoryById = byId(categories);
const subById = new Map(categories.flatMap((c) => c.subCategories.map((s) => [s.id, s] as const)));

/* --------------------------------- Lookups -------------------------------- */

export function brandOf(p: Product) {
  return brandById.get(p.brandId)!;
}
export function categoryOf(p: Product) {
  return categoryById.get(p.categoryId)!;
}
export function subCategoryOf(p: Product) {
  return subById.get(p.subCategoryId)!;
}

/* ------------------------------- Categories ------------------------------- */

export async function getCategories(): Promise<Category[]> {
  const counts = new Map<string, number>();
  for (const p of products) counts.set(p.categoryId, (counts.get(p.categoryId) ?? 0) + 1);
  return delay(categories.map((c) => ({ ...c, productCount: counts.get(c.id) ?? 0 })));
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const c = categories.find((x) => x.slug === slug);
  if (!c) return delay(undefined);
  return delay({ ...c, productCount: products.filter((p) => p.categoryId === c.id).length });
}

export async function getSubCategoryCounts(categoryId: string): Promise<Record<string, number>> {
  const out: Record<string, number> = {};
  for (const p of products) if (p.categoryId === categoryId) out[p.subCategoryId] = (out[p.subCategoryId] ?? 0) + 1;
  return delay(out);
}

/* --------------------------------- Brands --------------------------------- */

export async function getBrands(): Promise<(Brand & { productCount: number })[]> {
  const counts = new Map<string, number>();
  for (const p of products) counts.set(p.brandId, (counts.get(p.brandId) ?? 0) + 1);
  return delay(
    brands
      .map((b) => ({ ...b, productCount: counts.get(b.id) ?? 0 }))
      .filter((b) => b.productCount > 0)
      .sort((a, b) => a.name.localeCompare(b.name)),
  );
}

export async function getFeaturedBrands(): Promise<Brand[]> {
  return delay(brands.filter((b) => b.isFeatured));
}

export async function getBrandBySlug(slug: string): Promise<Brand | undefined> {
  return delay(brands.find((b) => b.slug === slug));
}

export async function getTopBrandsForCategory(categoryId: string, limit = 8): Promise<Brand[]> {
  const counts = new Map<string, number>();
  for (const p of products) if (p.categoryId === categoryId) counts.set(p.brandId, (counts.get(p.brandId) ?? 0) + p.soldCount);
  return delay(
    [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => brandById.get(id)!),
  );
}

/* -------------------------------- Products -------------------------------- */

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return delay(products.find((p) => p.slug === slug));
}

export async function getProductById(id: string): Promise<Product | undefined> {
  return delay(productById.get(id));
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  return delay(ids.map((id) => productById.get(id)).filter((p): p is Product => !!p));
}

export async function getNewArrivals(limit = 12): Promise<Product[]> {
  return delay([...products].filter((p) => p.isNew).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit));
}

export async function getBestSellers(limit = 12, categoryId?: string): Promise<Product[]> {
  return delay(
    products
      .filter((p) => p.isBestSeller && (!categoryId || p.categoryId === categoryId))
      .sort((a, b) => b.soldCount - a.soldCount)
      .slice(0, limit),
  );
}

export async function getFeaturedProducts(opts: { categorySlug?: string; limit?: number } = {}): Promise<Product[]> {
  const cat = opts.categorySlug ? categories.find((c) => c.slug === opts.categorySlug) : undefined;
  return delay(
    products
      .filter((p) => (p.isFeatured || p.isBestSeller) && (!cat || p.categoryId === cat.id))
      .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || b.soldCount - a.soldCount)
      .slice(0, opts.limit ?? 8),
  );
}

export async function getProductsByCategory(categorySlug: string, limit = 12): Promise<Product[]> {
  const cat = categories.find((c) => c.slug === categorySlug);
  if (!cat) return delay([]);
  return delay(products.filter((p) => p.categoryId === cat.id).sort((a, b) => b.soldCount - a.soldCount).slice(0, limit));
}

export async function getSimilarProducts(product: Product, limit = 10): Promise<Product[]> {
  return delay(
    products
      .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
      .map((p) => ({ p, score: (p.subCategoryId === product.subCategoryId ? 3 : 0) + (p.brandId === product.brandId ? 1 : 0) + p.rating / 5 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((x) => x.p),
  );
}

/** Materials that are typically bought together, by material type. */
const COMPANIONS: Partial<Record<Product["materialType"], Product["materialType"][]>> = {
  cement: ["aggregates", "steel"],
  steel: ["cement", "aggregates"],
  aggregates: ["cement", "steel"],
  bricks: ["cement", "aggregates"],
  tiles: ["waterproofing"],
  paint: ["paint", "tools"],
  plumbing: ["plumbing", "sanitary"],
  electrical: ["electrical"],
  sanitary: ["plumbing"],
  wood: ["hardware"],
  "doors-windows": ["hardware"],
  roofing: ["hardware"],
  hardware: ["tools"],
  tools: ["safety"],
  safety: ["tools"],
  waterproofing: ["cement"],
};

export async function getFrequentlyBoughtTogether(product: Product, limit = 2): Promise<Product[]> {
  const types = COMPANIONS[product.materialType] ?? [];
  const picks: Product[] = [];
  for (const t of types) {
    const best = products
      .filter((p) => p.materialType === t && p.id !== product.id && !picks.includes(p) && p.stock > 0)
      .sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller) || b.soldCount - a.soldCount)[0];
    if (best) picks.push(best);
    if (picks.length >= limit) break;
  }
  return delay(picks);
}

/** Mock recommendation engine: best sellers from categories the shopper viewed. */
export async function getRecommendations(viewedProductIds: string[], limit = 12): Promise<Product[]> {
  const viewed = new Set(viewedProductIds);
  const catIds = new Set(viewedProductIds.map((id) => productById.get(id)?.categoryId).filter(Boolean));
  const pool = products.filter((p) => !viewed.has(p.id) && p.stock > 0);
  const ranked = catIds.size
    ? pool.filter((p) => catIds.has(p.categoryId)).sort((a, b) => b.soldCount - a.soldCount)
    : pool.filter((p) => p.isBestSeller).sort((a, b) => b.soldCount - a.soldCount);
  const fill = pool.filter((p) => p.isBestSeller && !ranked.includes(p));
  return delay([...ranked, ...fill].slice(0, limit));
}

/* --------------------------- Listing & faceting --------------------------- */

type Dim = "sub" | "brand" | "price" | "rating" | "stock" | "delivery" | "cert" | "discount" | `attr:${string}`;

function attrValues(p: Product, key: string): string[] {
  const v = p.attributes[key];
  if (v === undefined) return [];
  return (Array.isArray(v) ? v : [String(v)]).filter((x) => x !== "—");
}

function searchScore(p: Product, tokens: string[]): number {
  if (!tokens.length) return 1;
  const brand = brandOf(p).name.toLowerCase();
  const cat = categoryOf(p);
  const sub = subCategoryOf(p).name.toLowerCase();
  const name = p.name.toLowerCase();
  const hay = [name, brand, cat.name.toLowerCase(), sub, p.tags.join(" ").toLowerCase(), Object.values(p.attributes).flat().join(" ").toLowerCase(), p.sku.toLowerCase()].join(" ");
  let score = 0;
  for (const t of tokens) {
    if (!hay.includes(t)) return 0;
    if (name.includes(t)) score += 3;
    if (brand.includes(t)) score += 2;
    if (sub.includes(t) || cat.name.toLowerCase().includes(t)) score += 2;
    score += 1;
  }
  return score;
}

function tokenize(q?: string) {
  return (q ?? "")
    .toLowerCase()
    .split(/[\s,]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

export async function getProducts(query: ProductQuery = {}): Promise<ProductListResult> {
  const perPage = query.perPage ?? 24;
  const page = Math.max(1, query.page ?? 1);
  const tokens = tokenize(query.q);
  const category = query.category ? categories.find((c) => c.slug === query.category) : undefined;

  // Base set: search term, category and tag scope (not user-toggleable facets).
  const scores = new Map<string, number>();
  const base = products.filter((p) => {
    if (category && p.categoryId !== category.id) return false;
    if (query.tag === "new" && !p.isNew) return false;
    if (query.tag === "featured" && !p.isFeatured) return false;
    if (query.tag === "bestseller" && !p.isBestSeller) return false;
    const s = searchScore(p, tokens);
    if (s === 0) return false;
    scores.set(p.id, s);
    return true;
  });

  const subSet = new Set(query.sub ?? []);
  const brandSet = new Set(query.brand ?? []);
  const deliverySet = new Set(query.delivery ?? []);
  const certSet = new Set(query.cert ?? []);
  const attrFilters = Object.entries(query.attrs ?? {}).filter(([, v]) => v.length);

  const passes = (p: Product, except?: Dim) => {
    if (except !== "sub" && subSet.size && !subSet.has(subCategoryOf(p).slug)) return false;
    if (except !== "brand" && brandSet.size && !brandSet.has(brandOf(p).slug)) return false;
    if (except !== "price" && query.minPrice !== undefined && p.price < query.minPrice) return false;
    if (except !== "price" && query.maxPrice !== undefined && p.price > query.maxPrice) return false;
    if (except !== "rating" && query.rating && p.rating < query.rating) return false;
    if (except !== "stock" && query.inStock && p.stock <= 0) return false;
    if (except !== "delivery" && deliverySet.size && !(deliverySet.has(p.deliveryType) || (p.deliveryType === "both" && deliverySet.size > 0))) return false;
    if (except !== "cert" && certSet.size && !(p.certifications ?? []).some((c) => certSet.has(c))) return false;
    if (except !== "discount" && query.discount && discountPercent(p.price, p.mrp) < query.discount) return false;
    for (const [key, values] of attrFilters) {
      if (except === `attr:${key}`) continue;
      const set = new Set(values);
      if (!attrValues(p, key).some((v) => set.has(v))) return false;
    }
    return true;
  };

  const filtered = base.filter((p) => passes(p));

  // Sorting
  const sort = query.sort ?? (tokens.length ? "relevance" : "popularity");
  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "newest":
        return b.createdAt.localeCompare(a.createdAt);
      case "rating":
        return b.rating - a.rating || b.reviewCount - a.reviewCount;
      case "popularity":
        return b.soldCount - a.soldCount;
      case "relevance":
      default:
        return (scores.get(b.id) ?? 0) - (scores.get(a.id) ?? 0) || Number(b.isBestSeller) - Number(a.isBestSeller) || b.soldCount - a.soldCount;
    }
  });

  // Facets (disjunctive: each facet's counts ignore its own selection)
  const facets: Facet[] = [];
  const count = (dim: Dim, valuesOf: (p: Product) => string[], labelOf: (v: string) => string = (v) => v): FacetOption[] => {
    const map = new Map<string, number>();
    for (const p of base) {
      if (!passes(p, dim)) continue;
      for (const v of new Set(valuesOf(p))) map.set(v, (map.get(v) ?? 0) + 1);
    }
    return [...map.entries()].map(([value, c]) => ({ value, label: labelOf(value), count: c }));
  };

  if (category) {
    const subOrder = category.subCategories.map((s) => s.slug);
    const subOpts = count("sub", (p) => [subCategoryOf(p).slug], (v) => category.subCategories.find((s) => s.slug === v)?.name ?? v).sort(
      (a, b) => subOrder.indexOf(a.value) - subOrder.indexOf(b.value),
    );
    if (subOpts.length > 1) facets.push({ key: "sub", label: "Sub-category", type: "checkbox", options: subOpts });
  } else {
    const catOpts = count("sub", (p) => [categoryOf(p).slug], (v) => categories.find((c) => c.slug === v)?.name ?? v);
    // For un-scoped listings, category acts as a navigational facet (links, not filters).
    if (catOpts.length > 1) facets.push({ key: "category", label: "Category", type: "checkbox", options: catOpts.sort((a, b) => b.count - a.count) });
  }

  const brandOpts = count("brand", (p) => [brandOf(p).slug], (v) => brands.find((b) => b.slug === v)?.name ?? v).sort((a, b) => a.label.localeCompare(b.label));
  if (brandOpts.length > 1) facets.push({ key: "brand", label: "Brand", type: "checkbox", options: brandOpts });

  if (category) {
    for (const key of category.facetKeys) {
      const opts = count(`attr:${key}`, (p) => attrValues(p, key)).sort((a, b) => naturalCompare(a.value, b.value));
      if (opts.length > 1) facets.push({ key: `attr:${key}`, label: attributeLabel(key), type: "checkbox", options: opts });
    }
  }

  const ratingOpts = [4, 3].map((r) => ({ value: String(r), label: `${r}★ & above`, count: base.filter((p) => passes(p, "rating") && p.rating >= r).length }));
  facets.push({ key: "rating", label: "Customer Rating", type: "checkbox", options: ratingOpts });

  const deliveryLabels: Record<string, string> = { parcel: "Parcel / Courier", truck: "Truck Delivery", both: "Parcel or Truck" };
  const delOpts = count("delivery", (p) => (p.deliveryType === "both" ? ["parcel", "truck"] : [p.deliveryType]), (v) => deliveryLabels[v] ?? v);
  if (delOpts.length > 1) facets.push({ key: "delivery", label: "Delivery Type", type: "checkbox", options: delOpts });

  const certOpts = count("cert", (p) => p.certifications ?? []).sort((a, b) => b.count - a.count).slice(0, 12);
  if (certOpts.length) facets.push({ key: "cert", label: "Certifications", type: "checkbox", options: certOpts });

  const discOpts = [10, 20, 30].map((d) => ({ value: String(d), label: `${d}% off or more`, count: base.filter((p) => passes(p, "discount") && discountPercent(p.price, p.mrp) >= d).length }));
  facets.push({ key: "discount", label: "Discount", type: "checkbox", options: discOpts.filter((o) => o.count > 0) });

  facets.push({
    key: "availability",
    label: "Availability",
    type: "checkbox",
    options: [{ value: "in-stock", label: "In stock only", count: base.filter((p) => passes(p, "stock") && p.stock > 0).length }],
  });

  const priceBase = base.filter((p) => passes(p, "price"));
  const prices = priceBase.map((p) => p.price);
  const priceRange = prices.length ? { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) } : { min: 0, max: 0 };

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  return delay({
    items: sorted.slice((page - 1) * perPage, page * perPage),
    total,
    page: Math.min(page, totalPages),
    perPage,
    totalPages,
    facets: facets.filter((f) => f.options.length > 0),
    priceRange,
  });
}

function naturalCompare(a: string, b: string) {
  return a.localeCompare(b, "en", { numeric: true, sensitivity: "base" });
}

/* ------------------------------ Search suggest ----------------------------- */

export async function getSearchSuggestions(q: string, categorySlug?: string, limit = 6): Promise<SearchSuggestion[]> {
  const tokens = tokenize(q);
  if (!tokens.length) return delay([]);
  const cat = categorySlug ? categories.find((c) => c.slug === categorySlug) : undefined;
  const lower = q.toLowerCase().trim();

  const cats: SearchSuggestion[] = categories
    .flatMap((c) => [
      { c, label: c.name, href: `/category/${c.slug}`, hit: c.name.toLowerCase().includes(lower) },
      ...c.subCategories.map((s) => ({ c, label: `${s.name} in ${c.shortName}`, href: `/category/${c.slug}?sub=${s.slug}`, hit: s.name.toLowerCase().includes(lower) })),
    ])
    .filter((x) => x.hit && (!cat || x.c.id === cat.id))
    .slice(0, 3)
    .map((x, i) => ({ type: "category", id: `${x.c.id}-${i}`, label: x.label, href: x.href, meta: "Category" }));

  const brs: SearchSuggestion[] = brands
    .filter((b) => b.name.toLowerCase().includes(lower))
    .slice(0, 2)
    .map((b) => ({ type: "brand", id: b.id, label: b.name, href: `/brand/${b.slug}`, meta: "Brand" }));

  const prods: SearchSuggestion[] = products
    .filter((p) => !cat || p.categoryId === cat.id)
    .map((p) => ({ p, s: searchScore(p, tokens) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || b.p.soldCount - a.p.soldCount)
    .slice(0, limit)
    .map(({ p }) => ({ type: "product", id: p.id, label: p.name, href: `/product/${p.slug}`, meta: brandOf(p).name, image: p.images[0] }));

  return delay([...cats, ...brs, ...prods]);
}

export const POPULAR_SEARCHES = ["OPC 53 cement", "TMT Fe550D", "AAC blocks", "M-Sand", "Vitrified tiles 600x600", "Waterproofing", "CPVC pipe", "FRLS wire"];

/* --------------------------- Reviews & questions --------------------------- */

export async function getReviews(productId: string) {
  const p = productById.get(productId);
  if (!p) return delay({ reviews: [], breakdown: [] as { stars: number; count: number }[] });
  return delay({ reviews: generateReviews(p, 8), breakdown: ratingBreakdown(p) });
}

export async function getQuestions(productId: string) {
  const p = productById.get(productId);
  return delay(p ? generateQuestions(p) : []);
}

/* -------------------------------- Content --------------------------------- */

export const getHeroSlides = async () => delay(heroSlides);
export const getPromos = async () => delay(promos);
export const getTestimonials = async () => delay(testimonials);
export async function getBlogPosts(limit?: number) {
  const sorted = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date));
  return delay(limit ? sorted.slice(0, limit) : sorted);
}
export const getBlogPostBySlug = async (slug: string) => delay(blogPosts.find((b) => b.slug === slug));

/* -------------------------------- Delivery -------------------------------- */

export async function checkDelivery(areaId: string, productId?: string) {
  const p = productId ? productById.get(productId) : undefined;
  return delay(estimateDelivery(areaId, p?.deliveryType ?? "both", p?.leadTimeDays ?? 2));
}

/* -------------------------------- Account --------------------------------- */

export const getUserById = async (id: string) => delay(users.find((u) => u.id === id));
export const getUserByEmail = async (email: string) => delay(users.find((u) => u.email.toLowerCase() === email.toLowerCase()));
export const getUserByPhone = async (phone: string) => delay(users.find((u) => u.phone === normalisePhone(phone)));
export const getAddresses = async (userId: string) => delay(userId === "u-1001" ? addresses : []);
export const getOrders = async (userId: string) => delay(orders.filter((o) => o.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
export const getOrderById = async (userId: string, id: string) => delay(orders.find((o) => o.userId === userId && o.id === id));
export const getQuotes = async (userId: string) => delay(quotes.filter((q) => q.userId === userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
export const getProjects = async (userId: string) => delay(projects.filter((p) => p.userId === userId));
export const getNotifications = async (userId: string) => delay(notifications.filter((n) => n.userId === userId));

export { categories, brands, products };
