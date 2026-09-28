import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCategories, getSubCategoryCounts } from "@/lib/data";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

export const metadata: Metadata = { title: "All Categories", description: "Browse all construction material categories at BuildMart.", alternates: { canonical: "/categories" } };

export default async function CategoriesPage() {
  const categories = await getCategories();
  const counts = await Promise.all(categories.map((c) => getSubCategoryCounts(c.id)));
  return (
    <div className="container-page py-4 lg:py-6">
      <Breadcrumb items={[{ label: "All Categories" }]} />
      <h1 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">All Categories</h1>
      <p className="mt-1 text-sm text-muted-foreground">16 categories · everything from foundation to finishing</p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c, i) => (
          <li key={c.id} className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-card">
            <Link href={`/category/${c.slug}`} className="group flex items-center gap-4 border-b border-border p-4">
              <span className="relative size-18 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                <Image src={c.image} alt="" fill sizes="72px" className="object-cover transition-transform group-hover:scale-105" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2 font-display text-lg font-bold text-foreground group-hover:text-primary-700 dark:group-hover:text-primary-200">
                  <CategoryIcon name={c.icon} className="size-4.5 text-primary-700 dark:text-primary-200" /> {c.name}
                </span>
                <span className="text-xs text-muted-foreground">{c.productCount} products</span>
              </span>
              <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1" aria-hidden />
            </Link>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1 p-4 text-sm">
              {c.subCategories.map((s) => (
                <li key={s.id}>
                  <Link href={`/category/${c.slug}?sub=${s.slug}`} className="flex justify-between gap-2 py-1 text-muted-foreground hover:text-primary-700 dark:hover:text-primary-200">
                    <span className="truncate">{s.name}</span>
                    <span className="text-xs tabular-nums">{counts[i]![s.id] ?? 0}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
