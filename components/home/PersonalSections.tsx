"use client";

import { useEffect, useState } from "react";
import type { ProductCardData } from "@/lib/data/card";
import { useRecentlyViewed } from "@/store/lists";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProductCardSkeleton, ProductGrid } from "@/components/product/ProductCard";
import { ProductCarousel } from "./ProductCarousel";

function useCards(url: string | null) {
  const [state, setState] = useState<{ url: string | null; cards: ProductCardData[] | null }>({ url: null, cards: null });
  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    fetch(url)
      .then((r) => r.json())
      .then((d) => !cancelled && setState({ url, cards: d.cards }))
      .catch(() => !cancelled && setState({ url, cards: [] }));
    return () => {
      cancelled = true;
    };
  }, [url]);
  return state.url === url ? state.cards : null;
}

/** Recently viewed — hidden when empty. */
export function RecentlyViewed({ excludeId, title = "Recently Viewed" }: { excludeId?: string; title?: string }) {
  const hydrated = useHydrated();
  const ids = useRecentlyViewed((s) => s.ids).filter((id) => id !== excludeId);
  const url = hydrated && ids.length ? `/api/products?ids=${ids.join(",")}` : null;
  const cards = useCards(url);
  if (!url || (cards && !cards.length)) return null;
  return (
    <section className="py-8 sm:py-10">
      <div className="container-page">
        <SectionHeading title={title} description="Pick up where you left off" />
        {cards ? (
          <ProductCarousel cards={cards} label={title} />
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        )}
      </div>
    </section>
  );
}

/** Recommended — based on recently viewed categories, falls back to best sellers. */
export function Recommended() {
  const hydrated = useHydrated();
  const ids = useRecentlyViewed((s) => s.ids);
  const cards = useCards(hydrated ? `/api/recommendations?ids=${ids.join(",")}` : null);
  return (
    <section className="bg-surface-muted py-8 sm:py-10">
      <div className="container-page">
        <SectionHeading eyebrow={ids.length ? "Based on your browsing" : "Popular right now"} title="Recommended for You" href="/products?sort=popularity" />
        {cards ? (
          <ProductGrid cards={cards.slice(0, 8)} />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        )}
      </div>
    </section>
  );
}
