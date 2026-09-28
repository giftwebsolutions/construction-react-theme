import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BadgeCheck, Calendar, Globe } from "lucide-react";
import { getBrandBySlug, getBrands, getProducts } from "@/lib/data";
import { parseProductQuery, type SearchParams } from "@/lib/data/query";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ListingView } from "@/components/listing/ListingView";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<SearchParams> };

export async function generateStaticParams() {
  return (await getBrands()).map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const b = await getBrandBySlug((await params).slug);
  if (!b) return { title: "Brand not found" };
  return { title: `${b.name} Products — Genuine, with VAT Invoice`, description: b.description, alternates: { canonical: `/brand/${b.slug}` } };
}

export default async function BrandPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();
  const query = parseProductQuery(sp, { brand: [slug] });
  const result = await getProducts(query);
  return (
    <div className="container-page py-4 lg:py-6">
      <Breadcrumb items={[{ label: "Brands", href: "/brands" }, { label: brand.name }]} />
      <section className="mt-4 flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6 shadow-card sm:flex-row sm:items-center sm:p-8">
        <div className="flex size-28 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface-muted p-3">
          <BrandLogo brand={brand} size="lg" className="flex-col text-center text-base" />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{brand.name}</h1>
          <p className="mt-0.5 text-sm font-medium text-accent-700">“{brand.tagline}”</p>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{brand.description}</p>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
            <li className="flex items-center gap-1.5"><BadgeCheck className="size-4 text-success" aria-hidden /> Authorised seller</li>
            <li className="flex items-center gap-1.5"><Calendar className="size-4" aria-hidden /> Since {brand.founded}</li>
            <li className="flex items-center gap-1.5"><Globe className="size-4" aria-hidden /> {brand.country}</li>
          </ul>
        </div>
      </section>
      <div className="mt-6">
        <ListingView result={result} query={query} ctx={{ basePath: `/brand/${slug}`, pathBrand: slug, view: sp.view === "list" ? "list" : "grid" }} hiddenFacets={["brand"]} />
      </div>
    </div>
  );
}
