"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, Search, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useCounts } from "./HeaderActions";

const TABS = [
  { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  { href: "/categories", label: "Categories", icon: LayoutGrid, match: (p: string) => p.startsWith("/categor") },
  { href: "/search", label: "Search", icon: Search, match: (p: string) => p.startsWith("/search") },
  { href: "/cart", label: "Cart", icon: ShoppingCart, match: (p: string) => p.startsWith("/cart") },
  { href: "/account", label: "Account", icon: User, match: (p: string) => p.startsWith("/account") || p === "/login" },
];

export function BottomNav() {
  const pathname = usePathname();
  const { cart } = useCounts();
  return (
    <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      <ul className="grid h-16 grid-cols-5">
        {TABS.map((t) => {
          const active = t.match(pathname);
          return (
            <li key={t.href}>
              <Link href={t.href} aria-current={active ? "page" : undefined} className={cn("relative flex h-full flex-col items-center justify-center gap-1 text-[11px] font-medium", active ? "text-primary-800 dark:text-accent-400" : "text-muted-foreground")}>
                {active && <span className="absolute inset-x-5 top-0 h-0.5 rounded-full bg-accent-500" aria-hidden />}
                <span className="relative" {...(t.href === "/cart" ? { "data-cart-target": true } : {})}>
                  <t.icon className={cn("size-5.5", active && "stroke-[2.25]")} aria-hidden />
                  {t.href === "/cart" && cart > 0 && (
                    <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-neutral-900">{cart}</span>
                  )}
                </span>
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
