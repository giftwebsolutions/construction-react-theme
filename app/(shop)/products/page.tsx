import type { Metadata } from "next";
import { getProducts } from "@/lib/data";
import { parseProductQuery, type SearchParams } from "@/lib/data/query";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ListingView } from "@/components/listing/ListingView";

const TAG_TITLES = { new: "New Arrivals", featured: "Featured Products", bestseller: "Best Sellers" } as const;

export async function generateMetadata({ searchParams }: { searchParams: Promise<SearchParams> }): Promise<Metadata> {
  const q = parseProductQuery(await searchParams);
  const title = q.tag ? TAG_TITLES[q.tag] : "All Construction Materials";
  return { title, description: "Browse cement, steel, bricks, sand, tiles, paints, plumbing, electrical and more with VAT invoice and bulk pricing.", alternates: { canonical: "/products" } };
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const query = parseProductQuery(sp);
  const result = await getProducts(query);
  const title = query.tag ? TAG_TITLES[query.tag] : "All Products";
  return (
    <div className="container-page py-4 lg:py-6">
      <Breadcrumb items={[{ label: title }]} />
      <h1 className="mb-4 mt-3 text-2xl font-bold text-foreground sm:text-3xl">{title}</h1>
      <ListingView result={result} query={query} ctx={{ basePath: "/products", view: sp.view === "list" ? "list" : "grid" }} />
    </div>
  );
}
