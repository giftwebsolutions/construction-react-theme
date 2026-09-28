import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category } from "@/types";
import type { ProductCardData } from "@/lib/data/card";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { ProductGrid } from "@/components/product/ProductCard";
import { ProductCarousel } from "./ProductCarousel";

/** Category block: title, sub-category chips, "View all", then a Swiper row or a full grid. */
export function CategoryRow({ category, cards, layout = "carousel" }: { category: Category; cards: ProductCardData[]; layout?: "carousel" | "grid" }) {
  return (
    <div>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-800 text-white">
            <CategoryIcon name={category.icon} className="size-5.5" />
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold text-foreground sm:text-2xl">{category.name}</h2>
            <p className="text-xs text-muted-foreground">{category.productCount} products</p>
          </div>
        </div>
        <Link href={`/category/${category.slug}`} className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-primary-700 dark:text-primary-200">
          View all <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      </div>
      <ul className="no-scrollbar -mx-4 mb-5 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-wrap lg:px-0">
        {category.subCategories.map((s) => (
          <li key={s.id} className="shrink-0">
            <Link href={`/category/${category.slug}?sub=${s.slug}`} className="inline-flex h-9 items-center rounded-full border border-border bg-surface px-4 text-sm text-foreground transition-colors hover:border-primary-600 hover:text-primary-700 dark:hover:text-primary-200">
              {s.name}
            </Link>
          </li>
        ))}
      </ul>
      {layout === "carousel" ? <ProductCarousel cards={cards} label={category.name} /> : <ProductGrid cards={cards} />}
    </div>
  );
}
