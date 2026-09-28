import type { Metadata } from "next";
import Link from "next/link";
import { getBrands, getCategories } from "@/lib/data";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { BrandLogo } from "@/components/ui/BrandLogo";

export const metadata: Metadata = { title: "All Brands", description: "Shop genuine products from 45+ construction material brands.", alternates: { canonical: "/brands" } };

export default async function BrandsPage() {
  const [brands, categories] = await Promise.all([getBrands(), getCategories()]);
  const letters = [...new Set(brands.map((b) => b.name[0]!.toUpperCase()))].sort();
  const featured = brands.filter((b) => b.isFeatured);
  return (
    <div className="container-page py-4 lg:py-6">
      <Breadcrumb items={[{ label: "Brands" }]} />
      <h1 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">Shop by Brand</h1>
      <p className="mt-1 text-sm text-muted-foreground">{brands.length} authorised brands · genuine products with manufacturer warranty</p>

      <h2 className="mt-8 text-lg font-bold text-foreground">Featured brands</h2>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {featured.map((b) => (
          <li key={b.id}>
            <Link href={`/brand/${b.slug}`} className="group flex h-full flex-col items-center justify-center gap-2 rounded-xl border border-border bg-surface p-5 text-center shadow-card transition hover:border-primary-600 hover:shadow-card-hover">
              <BrandLogo brand={b} />
              <span className="text-xs text-muted-foreground">{b.productCount} products</span>
            </Link>
          </li>
        ))}
      </ul>

      <nav aria-label="Jump to letter" className="no-scrollbar sticky top-14 z-20 -mx-4 mt-10 flex gap-1 overflow-x-auto border-y border-border bg-background/95 px-4 py-2 backdrop-blur lg:top-32 lg:mx-0 lg:rounded-lg lg:border">
        {letters.map((l) => (
          <a key={l} href={`#brands-${l}`} className="flex size-9 shrink-0 items-center justify-center rounded-md text-sm font-semibold text-foreground hover:bg-surface-muted">
            {l}
          </a>
        ))}
      </nav>
      <div className="mt-6 space-y-8">
        {letters.map((l) => (
          <section key={l} id={`brands-${l}`} className="scroll-mt-44" aria-labelledby={`h-${l}`}>
            <h2 id={`h-${l}`} className="mb-3 font-display text-2xl font-bold text-primary-800 dark:text-primary-200">{l}</h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {brands
                .filter((b) => b.name[0]!.toUpperCase() === l)
                .map((b) => (
                  <li key={b.id}>
                    <Link href={`/brand/${b.slug}`} className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4 hover:border-primary-600">
                      <span className="min-w-0">
                        <BrandLogo brand={b} size="sm" />
                        <span className="mt-1 block truncate text-xs text-muted-foreground">{b.categoryIds.map((id) => categories.find((c) => c.id === id)?.shortName).filter(Boolean).join(" · ")}</span>
                      </span>
                      <span className="shrink-0 text-xs font-semibold text-muted-foreground">{b.productCount}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
