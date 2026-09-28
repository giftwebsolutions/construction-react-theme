"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import type { Brand, Category } from "@/types";
import { Logo } from "@/components/ui/Logo";
import { useUI } from "@/store/ui";
import { cn } from "@/lib/utils/cn";
import { HeaderActions, type HeaderUser } from "./HeaderActions";
import { MegaMenu } from "./MegaMenu";
import { MobileDrawer } from "./MobileDrawer";
import { MiniCart } from "./MiniCart";
import { LocationSelector } from "./LocationSelector";
import { SearchBar } from "./SearchBar";

/** Sticky header: mega-menu bar and mobile search collapse when scrolling down, reappear on scroll up. */
export function Header({ categories, brands, user }: { categories: Category[]; brands: Brand[]; user: HeaderUser | null }) {
  const setMobileNav = useUI((s) => s.setMobileNav);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (Math.abs(y - last) > 8) setCollapsed(y > 160 && y > last);
        last = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const searchCats = categories.map((c) => ({ slug: c.slug, shortName: c.shortName }));

  return (
    <>
      <header className="sticky top-0 z-40 bg-primary-900 shadow-md">
        <div className="container-page flex h-14 items-center gap-2 lg:h-18 lg:gap-6">
          <button type="button" onClick={() => setMobileNav(true)} className="-ml-2 flex size-11 items-center justify-center rounded-lg text-white hover:bg-white/10 lg:hidden" aria-label="Open menu">
            <Menu className="size-6" aria-hidden />
          </button>
          <Logo tone="light" className="shrink-0 [&_svg]:size-8 lg:[&_svg]:size-9" />
          <SearchBar categories={searchCats} className="hidden flex-1 lg:block" />
          <div className="ml-auto lg:ml-0">
            <HeaderActions user={user} />
          </div>
        </div>
        <div className={cn("grid transition-[grid-template-rows] duration-200 lg:hidden", collapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]")}>
          <div className="overflow-hidden">
            <div className="container-page pb-2.5">
              <SearchBar categories={searchCats} />
              <LocationSelector className="mt-1.5" />
            </div>
          </div>
        </div>
        <div className={cn("grid transition-[grid-template-rows] duration-200", collapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]")}>
          <div className={cn(collapsed ? "overflow-hidden" : "overflow-visible")}>
            <MegaMenu categories={categories} brands={brands} />
          </div>
        </div>
      </header>
      <MobileDrawer categories={categories} user={user} />
      <MiniCart />
    </>
  );
}

