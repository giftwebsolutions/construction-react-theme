import type { VatRate, TierPrice } from "@/types";

/**
 * All catalogue prices are stored VAT-inclusive (as UAE retail prices are displayed).
 * These helpers derive the exclusive value and tax split.
 */
export function exclusiveOfVat(inclusive: number, rate: VatRate) {
  return inclusive / (1 + rate / 100);
}

export function inclusiveOfVat(exclusive: number, rate: VatRate) {
  return exclusive * (1 + rate / 100);
}

export function vatAmountFromInclusive(inclusive: number, rate: VatRate) {
  return inclusive - exclusiveOfVat(inclusive, rate);
}

export const round2 = (n: number) => Math.round(n * 100) / 100;

/** Price per unit for a quantity, applying the best matching bulk tier. */
export function tierPrice(basePrice: number, qty: number, tiers?: TierPrice[]) {
  if (!tiers?.length) return basePrice;
  const match = [...tiers].sort((a, b) => b.minQty - a.minQty).find((t) => qty >= t.minQty);
  return match ? Math.min(match.pricePerUnit, basePrice) : basePrice;
}

/** Next cheaper tier the buyer could reach, for "SAR 17.25/bag for 100+" hints. */
export function nextTier(qty: number, tiers?: TierPrice[]) {
  if (!tiers?.length) return undefined;
  return [...tiers].sort((a, b) => a.minQty - b.minQty).find((t) => t.minQty > qty);
}

export function bestTier(tiers?: TierPrice[]) {
  if (!tiers?.length) return undefined;
  return [...tiers].sort((a, b) => a.pricePerUnit - b.pricePerUnit)[0];
}

export interface VatLine {
  amountInclusive: number;
  rate: VatRate;
}

export interface VatBreakup {
  taxable: number;
  totalTax: number;
  byRate: { rate: VatRate; taxable: number; tax: number }[];
}

/** UAE VAT: a single federal rate, so no emirate-level split is needed. */
export function calcVAT(lines: VatLine[]): VatBreakup {
  const map = new Map<VatRate, { taxable: number; tax: number }>();
  for (const l of lines) {
    const taxable = exclusiveOfVat(l.amountInclusive, l.rate);
    const tax = l.amountInclusive - taxable;
    const cur = map.get(l.rate) ?? { taxable: 0, tax: 0 };
    map.set(l.rate, { taxable: cur.taxable + taxable, tax: cur.tax + tax });
  }
  const byRate = [...map.entries()]
    .sort(([a], [b]) => a - b)
    .map(([rate, v]) => ({ rate, taxable: round2(v.taxable), tax: round2(v.tax) }));
  const taxable = round2(byRate.reduce((s, r) => s + r.taxable, 0));
  const totalTax = round2(byRate.reduce((s, r) => s + r.tax, 0));
  return { taxable, totalTax, byRate };
}

/** Delivery fee rules (mock): parcel free above SAR 100; truck by weight band. */
export function deliveryCharge(type: "parcel" | "truck", subtotal: number, weightKg: number) {
  if (type === "parcel") return subtotal >= 100 ? 0 : 5;
  if (subtotal >= 2500) return 0;
  if (weightKg <= 1000) return 35;
  if (weightKg <= 5000) return 65;
  return 110;
}
