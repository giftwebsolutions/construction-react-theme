import type { CartItem } from "@/types";
import { findCoupon, type Coupon } from "@/lib/data/coupons";
import { calcVAT, deliveryCharge, round2, tierPrice, type VatBreakup } from "./pricing";

export const cartItemKey = (productId: string, variant?: Record<string, string>) =>
  variant && Object.keys(variant).length
    ? `${productId}::${Object.entries(variant)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${v}`)
        .join("|")}`
    : productId;

export const unitPriceFor = (item: Pick<CartItem, "basePrice" | "quantity" | "tieredPricing">) =>
  tierPrice(item.basePrice, item.quantity, item.tieredPricing);

export const lineTotal = (item: CartItem) => round2(unitPriceFor(item) * item.quantity);
export const lineWeight = (item: CartItem) => (item.weightKg ?? 0) * item.quantity;

/** "both" items ride with the truck when heavy, otherwise ship as parcel. */
export function resolvedDeliveryType(item: CartItem): "parcel" | "truck" {
  if (item.deliveryType === "both") return lineWeight(item) > 150 ? "truck" : "parcel";
  return item.deliveryType;
}

export interface DeliveryGroup {
  type: "parcel" | "truck";
  items: CartItem[];
  subtotal: number;
  weightKg: number;
  charge: number;
  etaDays: number;
}

export interface CartTotals {
  itemCount: number;
  lineCount: number;
  mrpTotal: number;
  subtotal: number; // VAT inclusive, after bulk tiers
  tierSavings: number;
  mrpSavings: number;
  couponDiscount: number;
  coupon?: Coupon;
  couponError?: string;
  deliveryTotal: number;
  vat: VatBreakup;
  grandTotal: number;
  totalWeightKg: number;
  groups: DeliveryGroup[];
}

export function computeCartTotals(items: CartItem[], opts: { couponCode?: string } = {}): CartTotals {
  const subtotal = round2(items.reduce((s, i) => s + lineTotal(i), 0));
  const baseTotal = items.reduce((s, i) => s + i.basePrice * i.quantity, 0);
  const mrpTotal = round2(items.reduce((s, i) => s + i.mrp * i.quantity, 0));

  const groups: DeliveryGroup[] = (["truck", "parcel"] as const)
    .map((type) => {
      const gi = items.filter((i) => resolvedDeliveryType(i) === type);
      const gSubtotal = round2(gi.reduce((s, i) => s + lineTotal(i), 0));
      const weight = gi.reduce((s, i) => s + lineWeight(i), 0);
      return {
        type,
        items: gi,
        subtotal: gSubtotal,
        weightKg: weight,
        charge: gi.length ? deliveryCharge(type, gSubtotal, weight) : 0,
        etaDays: gi.length ? Math.max(...gi.map((i) => i.leadTimeDays)) + (type === "truck" ? 0 : 1) : 0,
      };
    })
    .filter((g) => g.items.length > 0);

  let coupon: Coupon | undefined;
  let couponError: string | undefined;
  let couponDiscount = 0;
  if (opts.couponCode) {
    coupon = findCoupon(opts.couponCode);
    if (!coupon) couponError = "This coupon code isn't valid.";
    else if (subtotal < coupon.minSubtotal) {
      couponError = `Add items worth SAR ${(coupon.minSubtotal - subtotal).toLocaleString("en-SA", { maximumFractionDigits: 0 })} more to use ${coupon.code}.`;
      coupon = undefined;
    } else if (coupon.code === "SITE50" && !groups.some((g) => g.type === "truck")) {
      couponError = "SITE50 applies to orders with truck delivery.";
      coupon = undefined;
    } else {
      couponDiscount = coupon.kind === "percent" ? (subtotal * coupon.value) / 100 : coupon.value;
      if (coupon.maxDiscount) couponDiscount = Math.min(couponDiscount, coupon.maxDiscount);
      couponDiscount = round2(couponDiscount);
    }
  }

  // Coupon discount is apportioned across lines before tax is split out.
  const factor = subtotal > 0 ? (subtotal - couponDiscount) / subtotal : 1;
  const vat = calcVAT(
    items.map((i) => ({ amountInclusive: lineTotal(i) * factor, rate: i.vatRate })),
  );
  const deliveryTotal = groups.reduce((s, g) => s + g.charge, 0);

  return {
    itemCount: items.reduce((s, i) => s + i.quantity, 0),
    lineCount: items.length,
    mrpTotal,
    subtotal,
    tierSavings: round2(baseTotal - subtotal),
    mrpSavings: round2(mrpTotal - subtotal),
    couponDiscount,
    coupon,
    couponError,
    deliveryTotal,
    vat,
    grandTotal: round2(subtotal - couponDiscount + deliveryTotal),
    totalWeightKg: items.reduce((s, i) => s + lineWeight(i), 0),
    groups,
  };
}
