import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calculator, FileText } from "lucide-react";
import { getBestSellers, getCategories, getCategoryBySlug, getProducts, getSubCategoryCounts, getTopBrandsForCategory } from "@/lib/data";
import { parseProductQuery, type SearchParams } from "@/lib/data/query";
import { toCards } from "@/lib/data/card";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ListingView } from "@/components/listing/ListingView";
import { ProductCarousel } from "@/components/home/ProductCarousel";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<SearchParams> };

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await getCategoryBySlug((await params).slug);
  if (!c) return { title: "Category not found" };
  return {
    title: `${c.name} — Buy Online at Best Price`,
    description: c.description,
    alternates: { canonical: `/category/${c.slug}` },
    openGraph: { images: [{ url: c.banner }] },
  };
}

const CALC: Record<string, string> = { cement: "cement", bricks: "bricks", tiles: "tiles", paint: "paint", steel: "steel", aggregates: "sand" };

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const query = parseProductQuery(sp, { category: slug });
  const isFiltered = Object.keys(sp).some((k) => k !== "view");
  const [result, subCounts, topBrands, best] = await Promise.all([
    getProducts(query),
    getSubCategoryCounts(category.id),
    getTopBrandsForCategory(category.id, 8),
    getBestSellers(10, category.id),
  ]);
  const ctx = { basePath: `/category/${slug}`, pathCategory: slug, view: sp.view === "list" ? ("list" as const) : ("grid" as const) };
  const calc = CALC[category.materialType];

  return (
    <div className="container-page py-4 lg:py-6">
      <Breadcrumb items={[{ label: "Categories", href: "/categories" }, { label: category.name }]} />

      {/* Landing banner */}
      <section className="relative mt-4 overflow-hidden rounded-2xl bg-primary-900 text-white">
        <Image src={category.banner} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/80 to-primary-900/30 sm:bg-gradient-to-r sm:from-primary-900/95 sm:via-primary-900/75 sm:to-primary-900/10" aria-hidden />
        <div className="relative max-w-2xl p-6 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-widest text-accent-400">{category.productCount} products</p>
          <h1 className="mt-2 text-2xl font-extrabold sm:text-4xl">{category.name}</h1>
          <p className="mt-2 text-sm text-primary-100 sm:text-base">{category.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {calc && (
              <Link href={`/calculators/${calc}`} className="inline-flex h-10 items-center gap-2 rounded-lg bg-accent-500 px-4 text-sm font-semibold text-neutral-900 hover:bg-accent-400">
                <Calculator className="size-4" aria-hidden /> Estimate quantity
              </Link>
            )}
            <Link href="/bulk-enquiry" className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/30 px-4 text-sm font-semibold hover:bg-white/10">
              <FileText className="size-4" aria-hidden /> Bulk quote
            </Link>
          </div>
        </div>
      </section>

      {/* Sub-categories */}
      <nav aria-label={`${category.name} sub-categories`} className="mt-6">
        <ul className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 lg:mx-0 lg:flex-wrap lg:px-0">
          {category.subCategories.map((s) => {
            const active = query.sub?.includes(s.slug);
            return (
              <li key={s.id} className="shrink-0">
                <Link
                  href={active ? `/category/${slug}` : `/category/${slug}?sub=${s.slug}`}
                  aria-current={active ? "true" : undefined}
                  className={`flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors ${active ? "border-primary-800 bg-primary-800 text-white" : "border-border bg-surface text-foreground hover:border-primary-600"}`}
                >
                  {s.name}
                  <span className={`text-xs ${active ? "text-primary-100" : "text-muted-foreground"}`}>{subCounts[s.id] ?? 0}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {!isFiltered && (
        <>
          {topBrands.length > 1 && (
            <section className="mt-8" aria-labelledby="tb">
              <h2 id="tb" className="mb-3 text-lg font-bold text-foreground">Top brands</h2>
              <ul className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 lg:mx-0 lg:px-0">
                {topBrands.map((b) => (
                  <li key={b.id} className="shrink-0">
                    <Link href={`/category/${slug}?brand=${b.slug}`} className="group flex h-14 w-40 items-center justify-center rounded-xl border border-border bg-surface px-3 hover:border-primary-600">
                      <BrandLogo brand={b} size="sm" muted />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {best.length > 2 && (
            <section className="mt-8" aria-labelledby="bs">
              <h2 id="bs" className="mb-4 text-lg font-bold text-foreground">Best sellers in {category.shortName}</h2>
              <ProductCarousel cards={toCards(best)} label={`Best sellers in ${category.shortName}`} />
            </section>
          )}
          <h2 className="mb-4 mt-10 text-lg font-bold text-foreground">All {category.name}</h2>
        </>
      )}

      <div className={isFiltered ? "mt-6" : undefined}>
        <ListingView result={result} query={query} ctx={ctx} hiddenFacets={[]} />
      </div>
    </div>
  );
}
