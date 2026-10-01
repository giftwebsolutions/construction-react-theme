"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Calculator, ChevronRight, FileText, GitCompareArrows, Headphones, Heart, LogIn, LogOut, Package, Sparkles, Tag, User, Warehouse, X } from "lucide-react";
import type { Category } from "@/types";
import { Drawer } from "@/components/ui/Drawer";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { LogoMark } from "@/components/ui/Logo";
import { useUI } from "@/store/ui";
import { logout, type HeaderUser } from "./HeaderActions";
import { HELPLINE } from "./TopBar";

/** Left drawer with two-level drill-down navigation. */
export function MobileDrawer({ categories, user }: { categories: Category[]; user: HeaderUser | null }) {
  const { mobileNavOpen, setMobileNav } = useUI();
  const [level, setLevel] = useState<Category | null>(null);
  const router = useRouter();
  const close = () => {
    setMobileNav(false);
    setLevel(null);
  };
  const row = "flex min-h-12 w-full items-center gap-3 px-4 text-left text-sm font-medium text-foreground hover:bg-surface-muted";

  return (
    <Drawer
      open={mobileNavOpen}
      onClose={close}
      side="left"
      aria-label="Main menu"
      header={
        <div className="shrink-0 bg-primary-900 px-4 pb-4 pt-3 text-white">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 font-display text-lg font-extrabold">
              <LogoMark className="size-8" /> Smart<span className="text-accent-500">-MEP</span>
            </span>
            <button type="button" onClick={close} className="-mr-2 flex size-11 items-center justify-center rounded-lg hover:bg-white/10" aria-label="Close menu">
              <X className="size-5" aria-hidden />
            </button>
          </div>
          {user ? (
            <Link href="/account" onClick={close} className="mt-3 flex items-center gap-3 rounded-lg bg-white/10 p-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-accent-500 font-bold text-neutral-900">{user.name.slice(0, 1)}</span>
              <span className="min-w-0">
                <span className="block font-semibold">Hi, {user.name.split(" ")[0]}</span>
                <span className="block truncate text-xs text-primary-200">{user.email}</span>
              </span>
            </Link>
          ) : (
            <div className="mt-3 flex gap-2">
              <Link href="/login" onClick={close} className="flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-accent-500 text-sm font-semibold text-neutral-900">
                <LogIn className="size-4" aria-hidden /> Login
              </Link>
              <Link href="/register" onClick={close} className="flex h-10 flex-1 items-center justify-center rounded-lg border border-white/30 text-sm font-semibold">
                Register
              </Link>
            </div>
          )}
        </div>
      }
    >
      {level ? (
        <div className="animate-slide-in-right">
          <button type="button" onClick={() => setLevel(null)} className="flex min-h-12 w-full items-center gap-2 border-b border-border px-4 text-sm font-semibold text-primary-700 dark:text-primary-200">
            <ArrowLeft className="size-4" aria-hidden /> All categories
          </button>
          <div className="flex items-center gap-3 px-4 pb-2 pt-4">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary-50 text-primary-800 dark:bg-surface-muted dark:text-primary-100">
              <CategoryIcon name={level.icon} className="size-5" />
            </span>
            <p className="font-display text-base font-bold text-foreground">{level.name}</p>
          </div>
          <ul>
            <li>
              <Link href={`/category/${level.slug}`} onClick={close} className={`${row} font-semibold text-primary-700 dark:text-primary-200`}>
                Shop all {level.shortName}
              </Link>
            </li>
            {level.subCategories.map((s) => (
              <li key={s.id}>
                <Link href={`/category/${level.slug}?sub=${s.slug}`} onClick={close} className={row}>
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <nav aria-label="Mobile">
          <p className="px-4 pb-1 pt-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Shop by category</p>
          <ul>
            {categories.map((c) => (
              <li key={c.id}>
                <button type="button" onClick={() => setLevel(c)} className={row} aria-label={`${c.name}, show sub-categories`}>
                  <CategoryIcon name={c.icon} className="size-5 shrink-0 text-primary-700 dark:text-primary-200" />
                  <span className="flex-1">{c.name}</span>
                  <ChevronRight className="size-4 text-muted-foreground" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
          <div className="my-2 border-t border-border" />
          <ul>
            {[
              { href: "/products?tag=new", label: "New Arrivals", icon: Sparkles },
              { href: "/brands", label: "All Brands", icon: Tag },
              { href: "/calculators/cement", label: "Material Calculators", icon: Calculator },
              { href: "/bulk-enquiry", label: "Bulk / Project Enquiry", icon: Warehouse },
              { href: "/account/orders", label: "Track Order", icon: Package },
              { href: "/account/quotes", label: "My Quotes", icon: FileText },
              { href: "/wishlist", label: "Wishlist", icon: Heart },
              { href: "/compare", label: "Compare", icon: GitCompareArrows },
              { href: "/account", label: "My Account", icon: User },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={close} className={row}>
                  <l.icon className="size-5 text-muted-foreground" aria-hidden /> {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="m-4 rounded-xl bg-surface-muted p-4">
            <a href={`tel:${HELPLINE.replace(/\s/g, "")}`} className="flex items-center gap-3 text-sm">
              <Headphones className="size-5 text-primary-700 dark:text-primary-200" aria-hidden />
              <span>
                <span className="block font-semibold text-foreground">{HELPLINE}</span>
                <span className="text-xs text-muted-foreground">Toll-free · 8 AM – 8 PM, all days</span>
              </span>
            </a>
          </div>
          {user && (
            <button type="button" onClick={() => { close(); logout(router); }} className={`${row} mb-4 text-danger`}>
              <LogOut className="size-5" aria-hidden /> Logout
            </button>
          )}
        </nav>
      )}
    </Drawer>
  );
}
