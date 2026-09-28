"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, ClipboardList, FileText, GitCompareArrows, Heart, LogOut, MapPin, Package, ShoppingCart, User, UserPlus } from "lucide-react";
import { useCart } from "@/store/cart";
import { useCompare, useWishlist } from "@/store/lists";
import { useUI } from "@/store/ui";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { cn } from "@/lib/utils/cn";

export interface HeaderUser {
  name: string;
  email: string;
}

function CountBadge({ n }: { n: number }) {
  if (!n) return null;
  return (
    <span className="absolute -right-1 -top-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-neutral-900 ring-2 ring-primary-900" aria-hidden>
      {n > 99 ? "99+" : n}
    </span>
  );
}

const iconLink = "relative flex size-11 flex-col items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10";

export function useCounts() {
  const hydrated = useHydrated();
  const cart = useCart((s) => s.items.length);
  const wish = useWishlist((s) => s.ids.length);
  const compare = useCompare((s) => s.ids.length);
  return hydrated ? { cart, wish, compare } : { cart: 0, wish: 0, compare: 0 };
}

export function logout(router: ReturnType<typeof useRouter>) {
  return fetch("/api/auth/logout", { method: "POST" }).then(() => {
    router.push("/");
    router.refresh();
  });
}

export function HeaderActions({ user }: { user: HeaderUser | null }) {
  const counts = useCounts();
  const setMiniCart = useUI((s) => s.setMiniCart);
  return (
    <div className="flex items-center gap-0.5 sm:gap-1">
      <Link href="/wishlist" className={cn(iconLink, "hidden sm:flex")} aria-label={`Wishlist, ${counts.wish} items`}>
        <Heart className="size-5.5" aria-hidden />
        <CountBadge n={counts.wish} />
      </Link>
      <Link href="/compare" className={cn(iconLink, "hidden md:flex")} aria-label={`Compare, ${counts.compare} items`}>
        <GitCompareArrows className="size-5.5" aria-hidden />
        <CountBadge n={counts.compare} />
      </Link>
      <AccountMenu user={user} />
      <button type="button" onClick={() => setMiniCart(true)} className={cn(iconLink, "lg:w-auto lg:flex-row lg:gap-2 lg:px-3")} aria-label={`Cart, ${counts.cart} items`}>
        <span className="relative" data-cart-target>
          <ShoppingCart className="size-5.5" aria-hidden />
          <CountBadge n={counts.cart} />
        </span>
        <span className="hidden text-sm font-semibold lg:inline">Cart</span>
      </button>
    </div>
  );
}

function AccountMenu({ user }: { user: HeaderUser | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const links = [
    { href: "/account", label: "My Account", icon: User },
    { href: "/account/orders", label: "Orders & Tracking", icon: Package },
    { href: "/account/quotes", label: "Bulk Quotes", icon: FileText },
    { href: "/account/projects", label: "My Projects", icon: ClipboardList },
    { href: "/account/addresses", label: "Site Addresses", icon: MapPin },
  ];

  return (
    <div ref={ref} className="relative hidden lg:block">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={id} className={cn(iconLink, "w-auto flex-row gap-2 px-3")}>
        <User className="size-5.5" aria-hidden />
        <span className="text-left leading-tight">
          <span className="block text-[11px] text-primary-200">{user ? "Hello," : "Hello, sign in"}</span>
          <span className="flex items-center gap-1 text-sm font-semibold">
            {user ? user.name.split(" ")[0] : "Account"} <ChevronDown className="size-3.5" aria-hidden />
          </span>
        </span>
      </button>
      {open && (
        <div id={id} className="absolute right-0 top-full z-50 mt-2 w-64 animate-fade-in rounded-xl border border-border bg-surface p-2 text-foreground shadow-card-hover">
          {user ? (
            <div className="border-b border-border px-3 pb-3 pt-2">
              <p className="font-semibold">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          ) : (
            <div className="space-y-2 border-b border-border p-2 pb-3">
              <Link href="/login" onClick={() => setOpen(false)} className="flex h-10 items-center justify-center rounded-lg bg-primary-800 text-sm font-semibold text-white hover:bg-primary-600">
                Login
              </Link>
              <p className="text-center text-xs text-muted-foreground">
                New here?{" "}
                <Link href="/register" onClick={() => setOpen(false)} className="font-semibold text-primary-700 hover:underline dark:text-primary-200">
                  Create an account
                </Link>
              </p>
            </div>
          )}
          <ul className="py-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-surface-muted">
                  <l.icon className="size-4 text-muted-foreground" aria-hidden /> {l.label}
                </Link>
              </li>
            ))}
            {!user && (
              <li>
                <Link href="/register?type=contractor" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-surface-muted">
                  <UserPlus className="size-4 text-muted-foreground" aria-hidden /> Contractor sign-up
                </Link>
              </li>
            )}
          </ul>
          {user && (
            <button type="button" onClick={() => logout(router)} className="flex w-full items-center gap-3 rounded-lg border-t border-border px-3 py-2.5 text-sm text-danger hover:bg-danger-50">
              <LogOut className="size-4" aria-hidden /> Logout
            </button>
          )}
        </div>
      )}
    </div>
  );
}
