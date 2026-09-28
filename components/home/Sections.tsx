import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, BrickWall, Calculator, Clock, FileText, Layers, PaintRoller, Percent, Ruler, Smartphone, Truck, Grid2x2 } from "lucide-react";
import type { BlogPost, Brand, Category, Promo } from "@/types";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { formatDate } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

export function Section({ children, className, tone }: { children: React.ReactNode; className?: string; tone?: "muted" }) {
  return (
    <section className={cn("py-8 sm:py-10", tone === "muted" && "bg-surface-muted", className)}>
      <div className="container-page">{children}</div>
    </section>
  );
}

/* ------------------------------ Trust strip ------------------------------ */
const TRUST = [
  { icon: BadgeCheck, title: "Genuine Brands", body: "45+ authorised brands" },
  { icon: FileText, title: "VAT Invoice", body: "Claim full input credit" },
  { icon: Truck, title: "Site Delivery", body: "Truck & parcel to your site" },
  { icon: Percent, title: "Bulk Discounts", body: "Auto tier pricing" },
];
export function TrustStrip() {
  return (
    <div className="container-page -mt-px pt-4 lg:pt-6">
      <ul className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-surface p-3 shadow-card sm:gap-4 sm:p-4 lg:grid-cols-4">
        {TRUST.map((t) => (
          <li key={t.title} className="flex items-center gap-3 rounded-lg p-2">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-800 dark:bg-surface-muted dark:text-primary-100">
              <t.icon className="size-5" aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-foreground">{t.title}</span>
              <span className="block truncate text-xs text-muted-foreground">{t.body}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------------------- Shop by category --------------------------- */
export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <Section>
      <SectionHeading title="Shop by Category" description="Everything from foundation to finishing" href="/categories" />
      <ul className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 lg:mx-0 lg:grid lg:grid-cols-8 lg:gap-4 lg:overflow-visible lg:px-0">
        {categories.map((c) => (
          <li key={c.id} className="w-28 shrink-0 snap-start sm:w-32 lg:w-auto">
            <Link href={`/category/${c.slug}`} className="group flex h-full flex-col items-center rounded-xl border border-border bg-surface p-3 text-center transition hover:-translate-y-0.5 hover:border-primary-600 hover:shadow-card-hover">
              <span className="relative aspect-square w-full overflow-hidden rounded-lg bg-surface-muted">
                <Image src={c.image} alt="" fill sizes="(min-width:1024px) 140px, 128px" className="object-cover transition-transform duration-300 group-hover:scale-105" />
                <span className="absolute left-1.5 top-1.5 flex size-7 items-center justify-center rounded-md bg-surface/90 text-primary-800 dark:text-primary-100">
                  <CategoryIcon name={c.icon} className="size-4" />
                </span>
              </span>
              <span className="mt-2 line-clamp-2 text-xs font-semibold leading-tight text-foreground sm:text-sm">{c.name}</span>
              <span className="mt-0.5 text-[11px] text-muted-foreground">{c.productCount} products</span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* -------------------------------- Ad banners ------------------------------ */

/** Ad 1 — wide sale banner */
export function AdBannerWide() {
  return (
    <div className="container-page py-4">
      <Link href="/category/waterproofing-and-chemicals" className="group relative flex min-h-52 overflow-hidden rounded-2xl bg-sky-900 text-white sm:min-h-60">
        <div className="relative z-10 flex flex-col justify-center p-6 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-widest text-cyan-200">Summer Ready · Limited period</p>
          <p className="mt-2 font-display text-2xl font-extrabold leading-tight sm:text-4xl">
            Waterproofing Sale <span className="text-accent-400">up to 25% off</span>
          </p>
          <p className="mt-2 max-w-md text-sm text-cyan-100">Dr. Fixit, Fosroc & Asian Paints roof coatings, membranes and admixtures. Free applicator consultation.</p>
          <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-sky-900 transition group-hover:bg-accent-400 group-hover:text-neutral-900">
            Shop the sale <ArrowRight className="size-4" aria-hidden />
          </span>
        </div>
        <Image src="/images/categories/waterproofing-banner.jpg" alt="" fill sizes="(min-width:1280px) 1232px, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-950/95 via-sky-900/85 to-sky-900/20" aria-hidden />
        <span className="absolute right-3 top-3 rounded bg-black/25 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/80">Ad</span>
      </Link>
    </div>
  );
}

/** Ad 2 — three offer tiles */
const TILES = [
  { title: "Tiles from AED 1.40/sq ft", body: "Kajaria · Somany · Johnson", href: "/category/tiles-and-flooring", img: "/images/categories/tiles.jpg", tag: "Flat 15% off" },
  { title: "Paint your dream home", body: "Buy 20 L, get primer free", href: "/category/paints-and-coatings", img: "/images/categories/paint.jpg", tag: "Combo offer" },
  { title: "Pipes & fittings", body: "Astral · Supreme · Finolex", href: "/category/plumbing-and-pipes", img: "/images/categories/plumbing.jpg", tag: "Up to 20% off" },
];
export function AdTriple() {
  return (
    <div className="container-page py-4">
      <ul className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-3 md:gap-4 md:px-0">
        {TILES.map((t) => (
          <li key={t.title} className="w-[82%] shrink-0 snap-start md:w-auto">
            <Link href={t.href} className="group relative flex h-44 overflow-hidden rounded-2xl bg-primary-900 p-5 text-white">
              <Image src={t.img} alt="" fill sizes="(min-width:768px) 33vw, 82vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-900/70 to-transparent" aria-hidden />
              <div className="relative z-10 max-w-[65%]">
                <span className="inline-block rounded-full bg-accent-500 px-2.5 py-0.5 text-[11px] font-bold text-neutral-900">{t.tag}</span>
                <p className="mt-2 font-display text-lg font-bold leading-tight">{t.title}</p>
                <p className="mt-1 text-xs text-primary-100">{t.body}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent-400">
                  Shop now <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Ad 3 — contractor credit banner */
export function AdContractor() {
  return (
    <div className="container-page py-4">
      <div className="relative overflow-hidden rounded-2xl bg-primary-900 text-white">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent_0_22px,rgb(255_255_255/0.03)_22px_44px)]" aria-hidden />
        <div className="relative grid items-center gap-6 p-6 sm:p-10 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-400">For contractors & builders</p>
            <p className="mt-2 font-display text-2xl font-extrabold sm:text-3xl">30-day credit. Project pricing. One account.</p>
            <ul className="mt-4 grid gap-2 text-sm text-primary-100 sm:grid-cols-3">
              {["Pay Later up to AED 50,000", "Split delivery across sites", "Dedicated account manager"].map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <BadgeCheck className="size-4 shrink-0 text-accent-400" aria-hidden /> {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
            <Link href="/register?type=contractor" className="inline-flex h-12 items-center justify-center rounded-lg bg-accent-500 px-6 text-sm font-bold text-neutral-900 hover:bg-accent-400">
              Register as Contractor
            </Link>
            <Link href="/bulk-enquiry" className="inline-flex h-12 items-center justify-center rounded-lg border border-white/30 px-6 text-sm font-semibold hover:bg-white/10">
              Upload BOQ for a quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Promo pair ------------------------------- */
export function PromoPair({ promos }: { promos: Promo[] }) {
  return (
    <div className="container-page grid gap-4 py-4 md:grid-cols-2">
      {promos.map((p) => (
        <Link
          key={p.id}
          href={p.cta.href}
          className={cn(
            "group relative flex min-h-48 flex-col justify-center overflow-hidden rounded-2xl p-6 sm:p-8",
            p.tone === "primary" ? "bg-gradient-to-br from-primary-800 to-primary-600 text-white" : "bg-gradient-to-br from-accent-500 to-accent-400 text-neutral-900",
          )}
        >
          <Image src={p.tone === "primary" ? "/images/promo/bulk.svg" : "/images/promo/calculator.svg"} alt="" width={300} height={200} className="absolute -right-8 bottom-0 h-full w-auto opacity-40 transition-transform duration-500 group-hover:scale-105 sm:opacity-70" />
          <div className="relative max-w-xs">
            {p.tone === "primary" ? <Layers className="size-8 text-accent-400" aria-hidden /> : <Calculator className="size-8" aria-hidden />}
            <p className="mt-3 font-display text-2xl font-bold leading-tight">{p.title}</p>
            <p className={cn("mt-2 text-sm", p.tone === "primary" ? "text-primary-100" : "text-neutral-800")}>{p.subtitle}</p>
            <span className={cn("mt-4 inline-flex items-center gap-2 text-sm font-bold", p.tone === "primary" ? "text-accent-400" : "text-primary-900")}>
              {p.cta.label} <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

/* -------------------------------- Brands -------------------------------- */
export function BrandStrip({ brands }: { brands: Brand[] }) {
  const row = [...brands, ...brands];
  return (
    <Section tone="muted">
      <SectionHeading title="Shop by Brand" description="Authorised partner of trusted global and regional brands" href="/brands" linkLabel="All brands" />
      <div className="group/marquee relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <ul className="flex w-max gap-3 motion-safe:animate-[marquee_40s_linear_infinite] group-hover/marquee:[animation-play-state:paused] sm:gap-4">
          {row.map((b, i) => (
            <li key={`${b.id}-${i}`} aria-hidden={i >= brands.length || undefined}>
              <Link href={`/brand/${b.slug}`} tabIndex={i >= brands.length ? -1 : undefined} className="group flex h-16 w-40 items-center justify-center rounded-xl border border-border bg-surface px-3 transition hover:border-primary-600 hover:shadow-card sm:h-20 sm:w-48">
                <BrandLogo brand={b} muted />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* ------------------------------ Calculators ------------------------------ */
const CALCS = [
  { type: "cement", title: "Cement", body: "Bags for concrete by grade", icon: Layers },
  { type: "bricks", title: "Bricks & Blocks", body: "Bricks and mortar per wall", icon: BrickWall },
  { type: "tiles", title: "Tiles", body: "Boxes incl. 10% wastage", icon: Grid2x2 },
  { type: "paint", title: "Paint", body: "Litres, primer & putty", icon: PaintRoller },
  { type: "steel", title: "Steel", body: "TMT kg by element", icon: Ruler },
];
export function CalculatorTeaser() {
  return (
    <Section>
      <SectionHeading eyebrow="Free tools" title="Material Calculators" description="Estimate quantities before you buy — no more over-ordering" />
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-5">
        {CALCS.map((c, i) => (
          <li key={c.type} className={cn(i === 4 && "col-span-2 md:col-span-1")}>
            <Link href={`/calculators/${c.type}`} className="group flex h-full flex-col rounded-xl border border-border bg-surface p-4 transition hover:-translate-y-0.5 hover:border-accent-500 hover:shadow-card-hover sm:p-5">
              <span className="flex size-11 items-center justify-center rounded-xl bg-accent-100 text-accent-700 transition-colors group-hover:bg-accent-500 group-hover:text-neutral-900">
                <c.icon className="size-5.5" aria-hidden />
              </span>
              <span className="mt-3 font-semibold text-foreground">{c.title}</span>
              <span className="mt-0.5 text-xs text-muted-foreground">{c.body}</span>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary-700 dark:text-primary-200">
                Calculate <ArrowRight className="size-3.5" aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ---------------------------------- Blog --------------------------------- */
export function BlogSection({ posts }: { posts: BlogPost[] }) {
  return (
    <Section>
      <SectionHeading eyebrow="Build guides" title="From the BuildMart Blog" href="/blog" linkLabel="All articles" />
      <ul className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-3 md:px-0">
        {posts.map((p) => (
          <li key={p.id} className="w-[80%] shrink-0 snap-start md:w-auto">
            <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-card transition hover:shadow-card-hover">
              <Link href={`/blog/${p.slug}`} tabIndex={-1} aria-hidden className="relative block aspect-[16/9] overflow-hidden bg-surface-muted">
                <Image src={p.cover} alt="" fill sizes="(min-width:768px) 33vw, 80vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <p className="flex items-center gap-2 text-xs">
                  <span className="rounded bg-primary-50 px-2 py-0.5 font-semibold text-primary-800 dark:bg-surface-muted dark:text-primary-100">{p.category}</span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Clock className="size-3.5" aria-hidden /> {p.readMinutes} min read
                  </span>
                </p>
                <h3 className="mt-3 line-clamp-2 font-display text-lg font-bold leading-snug text-foreground">
                  <Link href={`/blog/${p.slug}`} className="hover:text-primary-700 dark:hover:text-primary-200">
                    {p.title}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
                <p className="mt-auto pt-4 text-xs text-muted-foreground">
                  {p.author} · {formatDate(p.date)}
                </p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ------------------------------ App download ----------------------------- */
export function AppBand({ newsletter }: { newsletter: React.ReactNode }) {
  return (
    <div className="container-page pt-6">
      <div className="grid gap-8 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 p-6 text-white sm:p-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="font-display text-2xl font-extrabold sm:text-3xl">Prices move weekly. Stay ahead.</p>
          <p className="mt-2 text-sm text-primary-100">Get cement & steel price alerts, new launches and site-ready offers. No spam — one email a week.</p>
          <div className="mt-5">{newsletter}</div>
        </div>
        <div className="flex items-center gap-5 rounded-xl bg-white/10 p-5">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-accent-500 text-neutral-900">
            <Smartphone className="size-8" aria-hidden />
          </span>
          <div>
            <p className="font-semibold">Order from your site with the BuildMart app</p>
            <p className="mt-1 text-xs text-primary-200">Re-order in 2 taps, track trucks live, share quotes on WhatsApp.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Google Play", "App Store"].map((s) => (
                <a key={s} href="#" className="inline-flex h-10 items-center rounded-lg bg-black/40 px-3 text-xs font-semibold hover:bg-black/60">
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
