export interface Coupon {
  code: string;
  description: string;
  kind: "percent" | "flat";
  value: number;
  minSubtotal: number;
  maxDiscount?: number;
}

export const coupons: Coupon[] = [
  { code: "BUILD5", description: "5% off on orders above AED 500 (max AED 100)", kind: "percent", value: 5, minSubtotal: 500, maxDiscount: 100 },
  { code: "FIRST25", description: "AED 25 off your first order above AED 250", kind: "flat", value: 25, minSubtotal: 250 },
  { code: "SITE50", description: "AED 50 off on truck orders above AED 2,500", kind: "flat", value: 50, minSubtotal: 2500 },
];

export function findCoupon(code: string) {
  return coupons.find((c) => c.code === code.trim().toUpperCase());
}
