import type { AttributeValue, DeliveryType, Unit, Variant } from "@/types";

/**
 * Compact authoring format for mock products. `buildProducts` in ../products.ts
 * expands these into full `Product` records (ids, SKUs, specs, ratings, stock…).
 */
export interface ProductSeed {
  name: string;
  /** brand slug */
  brand: string;
  /** sub-category slug within the file's category */
  sub: string;
  unit: Unit;
  price: number;
  mrp: number;
  /** Indian GST slab the seed was authored with; UAE VAT is a flat 5% (see products.ts). */
  gst: 5 | 12 | 18 | 28;
  min?: number;
  step?: number;
  short: string;
  attrs: Record<string, AttributeValue>;
  /** Extra specification rows beyond the attributes */
  specs?: [label: string, value: string][];
  certs?: string[];
  delivery: DeliveryType;
  weightKg?: number;
  lead?: number;
  /** [minQty, pricePerUnit][] */
  tiers?: [number, number][];
  variants?: Variant[];
  tags?: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  stock?: number;
  highlights?: string[];
}
