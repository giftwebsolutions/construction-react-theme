"use client";

import { useCallback } from "react";
import type { Product } from "@/types";
import type { CardProduct } from "@/lib/data/card";
import { toCartItem, useCart } from "@/store/cart";
import { toast } from "@/store/toast";
import { defaultSelection, priceForSelection, selectionLabels } from "@/lib/utils/variants";
import { formatQty } from "@/lib/utils/units";

/** Animate a thumbnail flying into the visible cart icon. Respects reduced motion. */
export function flyToCart(source: HTMLElement | null) {
  if (!source || typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const target = Array.from(document.querySelectorAll<HTMLElement>("[data-cart-target]")).find((el) => el.offsetParent !== null);
  if (!target) return;
  const from = source.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const ghost = source.cloneNode(true) as HTMLElement;
  Object.assign(ghost.style, {
    position: "fixed", left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px`,
    zIndex: "90", pointerEvents: "none", borderRadius: "12px", overflow: "hidden", transition: "transform .6s cubic-bezier(.5,-.2,.7,1), opacity .6s",
  });
  document.body.appendChild(ghost);
  requestAnimationFrame(() => {
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);
    ghost.style.transform = `translate(${dx}px, ${dy}px) scale(0.08)`;
    ghost.style.opacity = "0.4";
  });
  setTimeout(() => {
    ghost.remove();
    target.animate([{ transform: "scale(1)" }, { transform: "scale(1.25)" }, { transform: "scale(1)" }], { duration: 300 });
  }, 620);
}

export function useAddToCart() {
  const add = useCart((s) => s.add);
  return useCallback(
    (product: CardProduct | Product, opts: { brandName: string; quantity: number; selection?: Record<string, string>; sourceEl?: HTMLElement | null; silent?: boolean }) => {
      const selection = opts.selection ?? defaultSelection(product);
      const { price, mrp } = priceForSelection(product, selection);
      const labels = selectionLabels(product, selection);
      add(toCartItem(product, { brandName: opts.brandName, quantity: opts.quantity, variant: Object.keys(labels).length ? labels : undefined, price, mrp }));
      flyToCart(opts.sourceEl ?? null);
      if (!opts.silent)
        toast({
          title: "Added to cart",
          description: `${formatQty(opts.quantity, product.unit)} · ${product.name}`,
          action: { label: "View cart →", href: "/cart" },
        });
    },
    [add],
  );
}
