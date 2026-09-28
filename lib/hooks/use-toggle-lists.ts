"use client";

import { useCompare, useWishlist, COMPARE_LIMIT } from "@/store/lists";
import { toast } from "@/store/toast";

export function useWishlistToggle() {
  const toggle = useWishlist((s) => s.toggle);
  return (id: string, name: string) => {
    const on = toggle(id);
    toast({ tone: on ? "success" : "info", title: on ? "Saved to wishlist" : "Removed from wishlist", description: name, action: on ? { label: "View wishlist →", href: "/wishlist" } : undefined });
  };
}

export function useCompareToggle() {
  const { toggle, has, isFull } = useCompare();
  return (id: string, name: string) => {
    if (!has(id) && isFull()) {
      toast({ tone: "warning", title: `You can compare up to ${COMPARE_LIMIT} products`, action: { label: "Open compare →", href: "/compare" } });
      return;
    }
    const on = toggle(id);
    toast({ tone: on ? "success" : "info", title: on ? "Added to compare" : "Removed from compare", description: name, action: on ? { label: "Compare now →", href: "/compare" } : undefined });
  };
}
