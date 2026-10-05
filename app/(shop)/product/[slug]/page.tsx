import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck } from "lucide-react";
import { brandOf, categoryOf, getFrequentlyBoughtTogether, getProductBySlug, getQuestions, getReviews, getSimilarProducts, products, subCategoryOf } from "@/lib/data";
import { toCardData, toCards } from "@/lib/data/card";
import type { SearchParams } from "@/lib/data/query";
import { defaultSelection } from "@/lib/utils/variants";
import { discountPercent } from "@/lib/utils/format";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Rating } from "@/components/ui/Rating";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Gallery } from "@/components/product/Gallery";
import { PurchasePanel, VARIANT_PREFIX } from "@/components/product/PurchasePanel";
import { ProductInfo } from "@/components/product/ProductInfo";
import { FrequentlyBought } from "@/components/product/FrequentlyBought";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { RecentlyViewed } from "@/components/home/PersonalSections";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<SearchParams> };

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProductBySlug((await params).slug);
  if (!p) return { title: "Product not found" };
  const brand = brandOf(p);
  return {
    title: `${p.name} — SAR ${p.price}/${p.unit}`,
    description: `${p.shortDescription} Buy genuine ${brand.name} with VAT invoice and site delivery.`,
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: { type: "website", title: p.name, description: p.shortDescription, images: [{ url: p.images[0]!, width: 800, height: 800, alt: p.name }] },
  };
}

export default async function ProductPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const brand = brandOf(product);
  const category = categoryOf(product);
  const sub = subCategoryOf(product);
  const [{ reviews, breakdown }, questions, similar, fbt] = await Promise.all([getReviews(product.id), getQuestions(product.id), getSimilarProducts(product, 10), getFrequentlyBoughtTogether(product, 2)]);

  // Variant selection from URL (?v.diameter=16 mm), falling back to defaults
  const selection = defaultSelection(product);
  for (const v of product.variants ?? []) {
    const fromUrl = sp[VARIANT_PREFIX + v.key];
    const val = Array.isArray(fromUrl) ? fromUrl[0] : fromUrl;
    if (val && v.options.some((o) => o.value === val)) selection[v.key] = val;
  }

  const off = discountPercent(product.price, product.mrp);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    image: product.images.map((i) => siteUrl + i),
    description: product.shortDescription,
    brand: { "@type": "Brand", name: brand.name },
    category: `${category.name} > ${sub.name}`,
    aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviewCount },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/product/${product.slug}`,
      priceCurrency: "SAR",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Smart-MEP" },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container-page py-4 lg:py-6">
        <Breadcrumb items={[{ label: category.name, href: `/category/${category.slug}` }, { label: sub.name, href: `/category/${category.slug}?sub=${sub.slug}` }, { label: product.name }]} />

        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-10">
          <Gallery
            images={product.images}
            alt={product.name}
            badges={
              <>
                {product.isNew && <Badge tone="accent" size="md">New</Badge>}
                {off >= 5 && <Badge tone="danger" size="md">-{off}%</Badge>}
                {product.isBestSeller && <Badge tone="dark" size="md">Best Seller</Badge>}
              </>
            }
          />

          <div className="min-w-0">
            <Link href={`/brand/${brand.slug}`} className="text-sm font-semibold uppercase tracking-wide text-primary-700 hover:underline dark:text-primary-200">
              {brand.name}
            </Link>
            <h1 className="mt-1 text-2xl font-bold leading-tight text-foreground sm:text-3xl">{product.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{product.shortDescription}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <a href="#details" className="inline-flex items-center gap-2 hover:underline">
                <Rating value={product.rating} count={product.reviewCount} showValue />
              </a>
              <span className="text-xs text-muted-foreground">SKU: {product.sku}</span>
            </div>
            {product.certifications && product.certifications.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-2" aria-label="Certifications">
                {product.certifications.map((c) => (
                  <li key={c} className="inline-flex items-center gap-1 rounded-md border border-success/30 bg-success-50 px-2 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-200">
                    <BadgeCheck className="size-3.5" aria-hidden /> {c}
                  </li>
                ))}
              </ul>
            )}
            {product.highlights.length > 0 && (
              <ul className="mt-4 space-y-1.5 text-sm text-foreground">
                {product.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent-500" aria-hidden /> {h}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-5">
              <PurchasePanel product={product} brandName={brand.name} initialSelection={selection} />
            </div>
          </div>
        </div>

        {fbt.length > 0 && (
          <section className="mt-12" aria-labelledby="fbt">
            <h2 id="fbt" className="mb-4 text-xl font-bold text-foreground sm:text-2xl">Frequently bought together</h2>
            <FrequentlyBought items={[toCardData(product), ...toCards(fbt)]} />
          </section>
        )}

        <div className="mt-12">
          <ProductInfo product={product} reviews={reviews} breakdown={breakdown} questions={questions} />
        </div>

        {similar.length > 0 && (
          <section className="mt-12">
            <SectionHeading title="Similar products" href={`/category/${category.slug}?sub=${sub.slug}`} />
            <ProductCarousel cards={toCards(similar)} label="Similar products" />
          </section>
        )}
      </div>
      <RecentlyViewed excludeId={product.id} />
    </>
  );
}
