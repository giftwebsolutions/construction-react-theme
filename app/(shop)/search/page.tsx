import type { Metadata } from "next";
import Link from "next/link";
import { Search, TrendingUp } from "lucide-react";
import { getCategories, getProducts, POPULAR_SEARCHES } from "@/lib/data";
import { parseProductQuery, type SearchParams } from "@/lib/data/query";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { ListingView } from "@/components/listing/ListingView";
import { SearchBar } from "@/components/layout/SearchBar";

export async function generateMetadata({ searchParams }: { searchParams: Promise<SearchParams> }): Promise<Metadata> {
  const q = parseProductQuery(await searchParams).q;
  return { title: q ? `Search results for “${q}”` : "Search", robots: { index: false, follow: true } };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const query = parseProductQuery(sp);
  const categories = await getCategories();

  if (!query.q && !query.category) {
    return (
      <div className="container-page py-6">
        <h1 className="text-2xl font-bold text-foreground">Search</h1>
        <SearchBar categories={categories.map((c) => ({ slug: c.slug, shortName: c.shortName }))} className="mt-4 lg:max-w-2xl" autoFocus />
        <h2 className="mt-8 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          <TrendingUp className="size-4" aria-hidden /> Popular searches
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {POPULAR_SEARCHES.map((t) => (
            <Link key={t} href={`/search?q=${encodeURIComponent(t)}`} className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm hover:border-primary-600">
              <Search className="size-3.5 text-muted-foreground" aria-hidden /> {t}
            </Link>
          ))}
        </div>
        <h2 className="mt-8 text-sm font-bold uppercase tracking-wider text-muted-foreground">Browse categories</h2>
        <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {categories.map((c) => (
            <li key={c.id}>
              <Link href={`/category/${c.slug}`} className="flex h-14 items-center gap-3 rounded-xl border border-border bg-surface px-3 text-sm font-medium hover:border-primary-600">
                <CategoryIcon name={c.icon} className="size-5 shrink-0 text-primary-700 dark:text-primary-200" /> {c.shortName}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const result = await getProducts(query);
  return (
    <div className="container-page py-4 lg:py-6">
      <Breadcrumb items={[{ label: "Search" }]} />
      <h1 className="mb-4 mt-3 text-xl font-bold text-foreground sm:text-2xl">
        {query.q ? (
          <>
            Results for <span className="text-primary-700 dark:text-accent-400">“{query.q}”</span>
          </>
        ) : (
          "Search results"
        )}
      </h1>
      <ListingView
        result={result}
        query={query}
        ctx={{ basePath: "/search", view: sp.view === "list" ? "list" : "grid" }}
        emptySuggestions={POPULAR_SEARCHES.map((t) => ({ label: t, href: `/search?q=${encodeURIComponent(t)}` }))}
      />
    </div>
  );
}
