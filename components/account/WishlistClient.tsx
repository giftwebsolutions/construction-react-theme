"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import type { ProductCardData } from "@/lib/data/card";
import { useWishlist } from "@/store/lists";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { ProductCardSkeleton, ProductGrid } from "@/components/product/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button, ButtonLink } from "@/components/ui/Button";

export function WishlistCount() {
  const hydrated = useHydrated();
  const n = useWishlist((s) => s.ids.length);
  return <>{hydrated ? n : 0}</>;
}

export function WishlistGrid() {
  const hydrated = useHydrated();
  const { ids, clear } = useWishlist();
  const [data, setData] = useState<{ key: string; cards: ProductCardData[] } | null>(null);
  const key = ids.join(",");
  useEffect(() => {
    if (!hydrated || !key) return;
    let cancel = false;
    fetch(`/api/products?ids=${key}`).then((r) => r.json()).then((d) => !cancel && setData({ key, cards: d.cards }));
    return () => {
      cancel = true;
    };
  }, [hydrated, key]);

  if (!hydrated) return <div className="grid grid-cols-2 gap-3 md:grid-cols-3">{Array.from({ length: 3 }, (_, i) => <ProductCardSkeleton key={i} />)}</div>;
  if (!ids.length)
    return (
      <div className="rounded-2xl border border-border bg-surface">
        <EmptyState icon={<Heart aria-hidden />} title="Your wishlist is empty" description="Tap the heart on any product to save it for your next site order." actions={<ButtonLink href="/products">Explore products</ButtonLink>} />
      </div>
    );
  const cards = data?.cards.filter((c) => ids.includes(c.product.id)) ?? null;
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{ids.length} saved item{ids.length > 1 ? "s" : ""}</p>
        <Button variant="ghost" size="sm" onClick={clear}>Clear all</Button>
      </div>
      {cards ? <ProductGrid cards={cards} className="xl:grid-cols-3" /> : <div className="grid grid-cols-2 gap-3 md:grid-cols-3">{ids.slice(0, 6).map((i) => <ProductCardSkeleton key={i} />)}</div>}
    </>
  );
}
