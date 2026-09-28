"use client";

import { useState } from "react";
import type { ProductCardData } from "@/lib/data/card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils/cn";
import { ProductCarousel } from "./ProductCarousel";

export function FeaturedTabs({ tabs }: { tabs: { key: string; label: string; href: string; cards: ProductCardData[] }[] }) {
  const [active, setActive] = useState(tabs[0]!.key);
  const tab = tabs.find((t) => t.key === active)!;
  return (
    <>
      <SectionHeading eyebrow="Handpicked" title="Featured Products" href={tab.href} />
      <div role="tablist" aria-label="Featured category" className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={t.key === active}
            onClick={() => setActive(t.key)}
            className={cn("h-10 shrink-0 rounded-full border px-5 text-sm font-semibold transition-colors", t.key === active ? "border-primary-800 bg-primary-800 text-white" : "border-border bg-surface text-foreground hover:border-primary-600")}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" aria-label={tab.label}>
        <ProductCarousel key={tab.key} cards={tab.cards} label={`Featured ${tab.label}`} />
      </div>
    </>
  );
}
