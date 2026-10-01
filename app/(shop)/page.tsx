import type { Metadata } from "next";
import { HeroSlider } from "@/components/home/HeroSlider";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { FeaturedTabs } from "@/components/home/FeaturedTabs";
import { CategoryRow } from "@/components/home/CategoryRow";
import { Testimonials } from "@/components/home/Testimonials";
import { Recommended, RecentlyViewed } from "@/components/home/PersonalSections";
import { AdBannerWide, AdContractor, AdTriple, AppBand, BlogSection, BrandStrip, CalculatorTeaser, CategoryGrid, PromoPair, Section, TrustStrip } from "@/components/home/Sections";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { ProductGrid } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  getBestSellers,
  getBlogPosts,
  getBrands,
  getCategories,
  getFeaturedProducts,
  getHeroSlides,
  getNewArrivals,
  getProductsByCategory,
  getPromos,
  getTestimonials,
} from "@/lib/data";
import { toCards } from "@/lib/data/card";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: "Smart-MEP — Airport Systems, Mechanical, Electrical & Construction Supplies" },
  alternates: { canonical: "/" },
};

const FEATURED_TABS = [
  { key: "all", label: "All", slug: undefined },
  { key: "civil", label: "Civil", slug: "civil" },
  { key: "electrical", label: "Electrical", slug: "electrical" },
  { key: "mechanical", label: "Mechanical", slug: "mechanical" },
  { key: "fire", label: "Fire Protection", slug: "fire-protection" },
] as const;

export default async function HomePage() {
  const [slides, categories, newArrivals, bestSellers, brands, promos, testimonials, posts, cement, steel, tiles, plumbing, ...featured] = await Promise.all([
    getHeroSlides(),
    getCategories(),
    getNewArrivals(12),
    getBestSellers(8),
    getBrands(),
    getPromos(),
    getTestimonials(),
    getBlogPosts(3),
    getProductsByCategory("civil", 10),
    getProductsByCategory("electrical", 10),
    getProductsByCategory("mechanical", 8),
    getProductsByCategory("plumbing", 10),
    ...FEATURED_TABS.map((t) => getFeaturedProducts({ categorySlug: t.slug, limit: 10 })),
  ]);
  const cat = (slug: string) => categories.find((c) => c.slug === slug)!;

  return (
    <>
      {/* 1. Hero */}
      <div className="lg:container-page lg:pt-6">
        <HeroSlider slides={slides} />
      </div>

      {/* 2. Shop by category */}
      <CategoryGrid categories={categories} />

      {/* 3. Trust strip */}
      <TrustStrip />

      {/* 4. New arrivals — swiper */}
      <Section className="pt-2 sm:pt-4">
        <SectionHeading eyebrow="Just landed" title="New Arrivals" href="/products?tag=new" />
        <ProductCarousel cards={toCards(newArrivals)} label="New arrivals" />
      </Section>

      {/* 5. Featured — swiper with tabs */}
      <Section>
        <FeaturedTabs
          tabs={FEATURED_TABS.map((t, i) => ({
            key: t.key,
            label: t.label,
            href: t.slug ? `/category/${t.slug}` : "/products?tag=featured",
            cards: toCards(featured[i]!),
          }))}
        />
      </Section>

      {/* Ad 1 */}
      <AdBannerWide />

      {/* 6. Best sellers — full grid */}
      <Section tone="muted" className="mt-6">
        <SectionHeading eyebrow="Most ordered" title="Best Sellers" description="What contractors are buying this month" href="/products?tag=bestseller" />
        <ProductGrid cards={toCards(bestSellers)} />
      </Section>

      {/* 7. Promo pair */}
      <div className="pt-6">
        <PromoPair promos={promos} />
      </div>

      {/* 8–9. Category rows — swiper */}
      <Section>
        <CategoryRow category={cat("civil")} cards={toCards(cement)} />
      </Section>
      <Section className="pt-0 sm:pt-2">
        <CategoryRow category={cat("electrical")} cards={toCards(steel)} />
      </Section>

      {/* Ad 2 */}
      <AdTriple />

      {/* 10. Tiles — full grid */}
      <Section>
        <CategoryRow category={cat("mechanical")} cards={toCards(tiles)} layout="grid" />
      </Section>

      {/* 11. Plumbing — swiper */}
      <Section className="pt-0 sm:pt-2">
        <CategoryRow category={cat("plumbing")} cards={toCards(plumbing)} />
      </Section>

      {/* 12. Brands */}
      <BrandStrip brands={brands.filter((b) => b.isFeatured).concat(brands.filter((b) => !b.isFeatured).slice(0, 8))} />

      {/* Ad 3 */}
      <div className="pt-6">
        <AdContractor />
      </div>

      {/* 13. Recently viewed — swiper (client, hidden if empty) */}
      <RecentlyViewed />

      {/* 14. Recommended — grid (client) */}
      <Recommended />

      {/* 15. Calculators */}
      <CalculatorTeaser />

      {/* 16. Testimonials — swiper */}
      <Section tone="muted">
        <SectionHeading eyebrow="4.7★ from 12,000+ buyers" title="Trusted on Sites Across the UAE" />
        <Testimonials items={testimonials} />
      </Section>

      {/* 17. Blog */}
      <BlogSection posts={posts} />

      {/* 18. Newsletter / app */}
      <AppBand newsletter={<NewsletterForm />} />
    </>
  );
}
