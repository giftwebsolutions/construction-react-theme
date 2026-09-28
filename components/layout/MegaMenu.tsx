"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowRight, ChevronRight, LayoutGrid } from "lucide-react";
import type { Brand, Category } from "@/types";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { cn } from "@/lib/utils/cn";

const HOVER_DELAY = 150;

const PROMOS: Record<string, { title: string; body: string; cta: string; href: string }> = {
  steel: { title: "Bulk TMT prices", body: "Buying 5+ tonnes? Get mill-direct rates with MTC.", cta: "Get Quote", href: "/bulk-enquiry?material=steel" },
  cement: { title: "Cement at plant rates", body: "Tiered pricing from 50 bags, truck to site.", cta: "Get Quote", href: "/bulk-enquiry?material=cement" },
  tiles: { title: "Free tile estimate", body: "Enter room size — get boxes, adhesive & grout.", cta: "Tile Calculator", href: "/calculators/tiles" },
  paint: { title: "How much paint?", body: "Litres, primer and putty for every room.", cta: "Paint Calculator", href: "/calculators/paint" },
};
const DEFAULT_PROMO = { title: "Project pricing", body: "Upload your BOQ and get one consolidated quote within 2 hours.", cta: "Request Quote", href: "/bulk-enquiry" };

export function MegaMenu({ categories, brands }: { categories: Category[]; brands: Brand[] }) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(categories[0]!.id);
  const openTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const pathname = usePathname();

  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const scheduleOpen = (catId?: string) => {
    clearTimeout(closeTimer.current);
    clearTimeout(openTimer.current);
    openTimer.current = setTimeout(() => {
      if (catId) setActiveId(catId);
      setOpen(true);
    }, HOVER_DELAY);
  };
  const scheduleClose = () => {
    clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), HOVER_DELAY);
  };

  const active = categories.find((c) => c.id === activeId) ?? categories[0]!;
  const activeBrands = brands.filter((b) => b.categoryIds.includes(active.id)).slice(0, 6);
  const promo = PROMOS[active.materialType] ?? DEFAULT_PROMO;
  const topNav = categories.slice(0, 7);

  // Split sub-categories into up to 3 columns
  const cols = 3;
  const per = Math.ceil(active.subCategories.length / cols);
  const columns = Array.from({ length: cols }, (_, i) => active.subCategories.slice(i * per, (i + 1) * per)).filter((c) => c.length);

  const onListKey = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLAnchorElement>("a"));
    const i = items.indexOf(document.activeElement as HTMLAnchorElement);
    const next = items[(i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length];
    next?.focus();
  };

  return (
    <div ref={root} className="relative hidden border-t border-white/10 bg-primary-800 lg:block" onMouseLeave={scheduleClose} onMouseEnter={() => clearTimeout(closeTimer.current)}>
      <nav aria-label="Product categories" className="container-page flex h-11 items-stretch gap-1">
        <button
          ref={trigger}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          onMouseEnter={() => scheduleOpen()}
          className={cn("-ml-3 inline-flex items-center gap-2 px-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700", open && "bg-primary-700")}
        >
          <LayoutGrid className="size-4.5 text-accent-400" aria-hidden />
          All Categories
        </button>
        <ul className="flex items-stretch">
          {topNav.map((c) => (
            <li key={c.id} className="flex">
              <Link
                href={`/category/${c.slug}`}
                onMouseEnter={() => scheduleOpen(c.id)}
                onFocus={() => setActiveId(c.id)}
                className={cn("inline-flex items-center px-3 text-sm font-medium text-primary-100 transition-colors hover:bg-primary-700 hover:text-white xl:px-4", pathname === `/category/${c.slug}` && "text-white shadow-[inset_0_-3px_0] shadow-accent-500")}
              >
                {c.shortName}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/products?tag=new" className="ml-auto inline-flex items-center px-3 text-sm font-semibold text-accent-400 hover:text-accent-500">
          New Arrivals
        </Link>
        <Link href="/brands" className="inline-flex items-center px-3 text-sm font-medium text-primary-100 hover:text-white">
          Brands
        </Link>
      </nav>

      {open && (
        <div id={panelId} className="absolute inset-x-0 top-full z-40 animate-fade-in border-b border-border bg-surface shadow-2xl" onMouseEnter={() => clearTimeout(closeTimer.current)}>
          <div className="container-page grid grid-cols-[260px_1fr_280px] gap-0">
            <ul className="max-h-[70vh] overflow-y-auto border-r border-border py-3" onKeyDown={onListKey} aria-label="Categories">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/category/${c.slug}`}
                    onMouseEnter={() => setActiveId(c.id)}
                    onFocus={() => setActiveId(c.id)}
                    aria-current={c.id === active.id ? "true" : undefined}
                    className={cn("flex items-center gap-3 rounded-l-lg px-3 py-2 text-sm font-medium text-foreground transition-colors", c.id === active.id ? "bg-primary-50 text-primary-800 dark:bg-surface-muted dark:text-white" : "hover:bg-surface-muted")}
                  >
                    <CategoryIcon name={c.icon} className="size-4.5 shrink-0 text-primary-700 dark:text-primary-200" />
                    <span className="flex-1 truncate">{c.name}</span>
                    <ChevronRight className={cn("size-4 text-muted-foreground", c.id !== active.id && "opacity-0")} aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="p-6">
              <div className="mb-4 flex items-baseline justify-between gap-4">
                <h2 className="text-lg font-bold text-foreground">{active.name}</h2>
                <Link href={`/category/${active.slug}`} className="inline-flex items-center gap-1 text-sm font-semibold text-primary-700 hover:underline dark:text-primary-200">
                  Shop all {active.productCount ? `(${active.productCount})` : ""}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
              <p className="mb-5 max-w-xl text-sm text-muted-foreground">{active.description}</p>
              <div className="grid grid-cols-3 gap-6">
                {columns.map((col, i) => (
                  <ul key={i} className="space-y-1">
                    {col.map((s) => (
                      <li key={s.id}>
                        <Link href={`/category/${active.slug}?sub=${s.slug}`} className="block rounded-md py-1.5 text-sm text-foreground hover:text-primary-700 hover:underline dark:hover:text-primary-200">
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>

            <div className="border-l border-border p-6">
              {activeBrands.length > 0 && (
                <>
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Featured brands</p>
                  <div className="grid grid-cols-2 gap-2">
                    {activeBrands.map((b) => (
                      <Link key={b.id} href={`/brand/${b.slug}`} className="group flex h-11 items-center justify-center rounded-lg border border-border px-2 hover:border-primary-600">
                        <BrandLogo brand={b} size="sm" muted className="truncate" />
                      </Link>
                    ))}
                  </div>
                </>
              )}
              <div className="mt-5 rounded-xl bg-gradient-to-br from-primary-800 to-primary-600 p-4 text-white">
                <p className="text-xs font-bold uppercase tracking-wider text-accent-400">Offer</p>
                <p className="mt-1 font-display text-lg font-bold">{promo.title}</p>
                <p className="mt-1 text-xs text-primary-100">{promo.body}</p>
                <Link href={promo.href} className="mt-3 inline-flex h-9 items-center gap-1 rounded-lg bg-accent-500 px-3 text-sm font-semibold text-neutral-900 hover:bg-accent-400">
                  {promo.cta} <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
