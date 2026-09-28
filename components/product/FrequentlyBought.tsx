"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Plus, ShoppingCart } from "lucide-react";
import type { ProductCardData } from "@/lib/data/card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { formatAED } from "@/lib/utils/format";
import { formatQty, perUnit } from "@/lib/utils/units";
import { useAddToCart } from "@/lib/hooks/use-add-to-cart";
import { toast } from "@/store/toast";

/** Bundle picker, e.g. Cement + M-Sand + Aggregate, each at its minimum order quantity. */
export function FrequentlyBought({ items }: { items: ProductCardData[] }) {
  const [picked, setPicked] = useState(items.map((i) => i.product.id));
  const addToCart = useAddToCart();
  const chosen = items.filter((i) => picked.includes(i.product.id));
  const total = chosen.reduce((s, i) => s + i.product.price * i.product.minOrderQty, 0);

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 shadow-card sm:p-6">
      <div className="no-scrollbar flex items-center gap-3 overflow-x-auto pb-2">
        {items.map((it, i) => (
          <div key={it.product.id} className="flex shrink-0 items-center gap-3">
            {i > 0 && <Plus className="size-5 shrink-0 text-muted-foreground" aria-hidden />}
            <Link href={`/product/${it.product.slug}`} className={cn("relative block size-24 overflow-hidden rounded-xl border-2 bg-surface-muted sm:size-28", picked.includes(it.product.id) ? "border-primary-600" : "border-transparent opacity-50")}>
              <Image src={it.product.images[0]!} alt={it.product.name} fill sizes="112px" className="object-cover" />
            </Link>
          </div>
        ))}
      </div>
      <ul className="mt-4 space-y-2.5">
        {items.map((it, i) => (
          <li key={it.product.id}>
            <label className="flex cursor-pointer items-start gap-3 text-sm">
              <input
                type="checkbox"
                checked={picked.includes(it.product.id)}
                disabled={i === 0}
                onChange={(e) => setPicked((p) => (e.target.checked ? [...p, it.product.id] : p.filter((x) => x !== it.product.id)))}
                className="mt-0.5 size-4.5 accent-primary-800"
              />
              <span className="min-w-0 flex-1">
                <span className="line-clamp-1 font-medium text-foreground">
                  {i === 0 && <span className="mr-1 text-xs font-bold text-muted-foreground">This item:</span>}
                  {it.product.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatQty(it.product.minOrderQty, it.product.unit)} × {formatAED(it.product.price)}
                  {perUnit(it.product.unit)}
                </span>
              </span>
              <span className="font-semibold tabular-nums text-foreground">{formatAED(it.product.price * it.product.minOrderQty)}</span>
            </label>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Bundle total ({chosen.length} items): <strong className="font-display text-xl text-foreground">{formatAED(total)}</strong>
        </p>
        <Button
          variant="accent"
          leftIcon={<ShoppingCart className="size-4" aria-hidden />}
          onClick={() => {
            chosen.forEach((c) => addToCart(c.product, { brandName: c.brand.name, quantity: c.product.minOrderQty, silent: true }));
            toast({ title: `${chosen.length} items added to cart`, action: { label: "View cart →", href: "/cart" } });
          }}
        >
          Add {chosen.length} to cart
        </Button>
      </div>
    </div>
  );
}
