import type { Product, TierPrice } from "@/types";

type VariantSource = Pick<Product, "variants" | "attributes" | "price" | "mrp" | "tieredPricing">;

/** key -> option value, defaulting to the option that matches the product attribute. */
export function defaultSelection(p: VariantSource): Record<string, string> {
  const sel: Record<string, string> = {};
  for (const v of p.variants ?? []) {
    const attr = p.attributes[v.key];
    sel[v.key] = (v.options.find((o) => o.value === attr) ?? v.options[0])!.value;
  }
  return sel;
}

/** Price/MRP for a selection — the first variant with its own price wins. */
export function priceForSelection(p: VariantSource, sel: Record<string, string>) {
  for (const v of p.variants ?? []) {
    const opt = v.options.find((o) => o.value === sel[v.key]);
    if (opt?.price) return { price: opt.price, mrp: opt.mrp ?? Math.max(opt.price, p.mrp) };
  }
  return { price: p.price, mrp: p.mrp };
}

/** Human labels for the cart line, e.g. { Diameter: "12 mm" }. */
export function selectionLabels(p: VariantSource, sel: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const v of p.variants ?? []) {
    const opt = v.options.find((o) => o.value === sel[v.key]);
    if (opt) out[v.label] = opt.label;
  }
  return out;
}

/** Bulk tiers scaled to a variant's price (tiers are authored against the base price). */
export function scaledTiers(p: VariantSource, price: number): TierPrice[] | undefined {
  if (!p.tieredPricing) return undefined;
  if (price === p.price) return p.tieredPricing;
  return p.tieredPricing.map((t) => ({ minQty: t.minQty, pricePerUnit: Math.round((t.pricePerUnit / p.price) * price * 100) / 100 }));
}
