"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";
import type { CardProduct } from "@/lib/data/card";
import { cartItemKey } from "@/lib/utils/cart";
import { normaliseQty } from "@/lib/utils/units";
import { browserStorage } from "./storage";

interface CartState {
  items: CartItem[];
  saved: CartItem[];
  couponCode?: string;
  add: (item: CartItem) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  saveForLater: (key: string) => void;
  moveToCart: (key: string) => void;
  removeSaved: (key: string) => void;
  applyCoupon: (code?: string) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      saved: [],
      couponCode: undefined,
      add: (item) =>
        set((s) => {
          const existing = s.items.find((i) => i.key === item.key);
          if (existing) {
            const quantity = normaliseQty(existing.quantity + item.quantity, item.minOrderQty, item.stepQty);
            return { items: s.items.map((i) => (i.key === item.key ? { ...i, quantity } : i)) };
          }
          return { items: [...s.items, { ...item, quantity: normaliseQty(item.quantity, item.minOrderQty, item.stepQty) }] };
        }),
      setQty: (key, qty) =>
        set((s) => ({
          items: s.items.map((i) => (i.key === key ? { ...i, quantity: normaliseQty(qty, i.minOrderQty, i.stepQty) } : i)),
        })),
      remove: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      saveForLater: (key) =>
        set((s) => {
          const item = s.items.find((i) => i.key === key);
          if (!item) return s;
          return { items: s.items.filter((i) => i.key !== key), saved: [item, ...s.saved.filter((i) => i.key !== key)] };
        }),
      moveToCart: (key) =>
        set((s) => {
          const item = s.saved.find((i) => i.key === key);
          if (!item) return s;
          return { saved: s.saved.filter((i) => i.key !== key), items: [...s.items.filter((i) => i.key !== key), item] };
        }),
      removeSaved: (key) => set((s) => ({ saved: s.saved.filter((i) => i.key !== key) })),
      applyCoupon: (code) => set({ couponCode: code?.trim().toUpperCase() || undefined }),
      clear: () => set({ items: [], couponCode: undefined }),
    }),
    { name: "bm-cart", storage: browserStorage, version: 1 },
  ),
);

/** Build a cart line from a product and the selected variant options. */
export function toCartItem(
  product: CardProduct,
  opts: { brandName: string; quantity: number; variant?: Record<string, string>; price?: number; mrp?: number },
): CartItem {
  return {
    key: cartItemKey(product.id, opts.variant),
    productId: product.id,
    slug: product.slug,
    name: product.name,
    brandName: opts.brandName,
    image: product.images[0]!,
    unit: product.unit,
    quantity: opts.quantity,
    minOrderQty: product.minOrderQty,
    stepQty: product.stepQty,
    variant: opts.variant,
    basePrice: opts.price ?? product.price,
    mrp: opts.mrp ?? product.mrp,
    vatRate: product.vatRate,
    // Scale bulk tiers proportionally when a variant changes the base price.
    tieredPricing:
      opts.price && opts.price !== product.price
        ? product.tieredPricing?.map((t) => ({ minQty: t.minQty, pricePerUnit: Math.round((t.pricePerUnit / product.price) * opts.price! * 100) / 100 }))
        : product.tieredPricing,
    deliveryType: product.deliveryType,
    weightKg: product.weightKg,
    leadTimeDays: product.leadTimeDays,
  };
}
