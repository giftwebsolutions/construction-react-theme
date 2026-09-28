import type { Product } from "@/types";
import { brandOf, categoryOf } from "./index";

/** Lean product shape for cards (drops long text) — safe to serialise to client components. */
export type CardProduct = Omit<Product, "description" | "specifications" | "documents" | "highlights" | "tags">;

export interface ProductCardData {
  product: CardProduct;
  brand: { name: string; slug: string };
  categorySlug: string;
  chips: string[];
}

export function toCardData(p: Product): ProductCardData {
  const { description: _d, specifications: _s, documents: _doc, highlights: _h, tags: _t, ...lean } = p;
  void _d; void _s; void _doc; void _h; void _t;
  const cat = categoryOf(p);
  const brand = brandOf(p);
  const chips = cat.cardAttributeKeys
    .map((k) => p.attributes[k])
    .filter((v) => v !== undefined && v !== "—")
    .map((v) => (Array.isArray(v) ? v.join("/") : String(v)));
  return { product: lean, brand: { name: brand.name, slug: brand.slug }, categorySlug: cat.slug, chips };
}

export const toCards = (ps: Product[]) => ps.map(toCardData);
