"use client";

import { useState } from "react";
import { Download, RotateCcw } from "lucide-react";
import type { Order, Product } from "@/types";
import { Button, ButtonLink } from "@/components/ui/Button";
import { toCartItem, useCart } from "@/store/cart";
import { toast } from "@/store/toast";

export function ReorderButton({ order, size = "md" }: { order: Order; size?: "sm" | "md" }) {
  const add = useCart((s) => s.add);
  const [loading, setLoading] = useState(false);
  const reorder = async () => {
    setLoading(true);
    const ids = order.lines.map((l) => l.productId).join(",");
    const { products, brands } = (await fetch(`/api/products?ids=${ids}&full=1`).then((r) => r.json())) as { products: Product[]; brands: Record<string, string> };
    let n = 0;
    for (const l of order.lines) {
      const p = products.find((x) => x.id === l.productId);
      if (!p || p.stock <= 0) continue;
      add(toCartItem(p, { brandName: brands[p.brandId] ?? "", quantity: l.quantity }));
      n++;
    }
    setLoading(false);
    toast({ title: `${n} item${n === 1 ? "" : "s"} added to cart`, description: `From order ${order.number}`, action: { label: "View cart →", href: "/cart" } });
  };
  return (
    <Button variant="accent" size={size} loading={loading} leftIcon={<RotateCcw className="size-4" aria-hidden />} onClick={reorder}>
      Reorder
    </Button>
  );
}

export function InvoiceButton({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <ButtonLink href="/docs/technical-datasheet.pdf" download variant="outline" size={size} leftIcon={<Download className="size-4" aria-hidden />}>
      Invoice
    </ButtonLink>
  );
}
