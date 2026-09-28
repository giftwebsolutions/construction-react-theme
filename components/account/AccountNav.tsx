"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ClipboardList, FileText, Heart, LayoutDashboard, LogOut, MapPin, Package, Shield, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { logout } from "@/components/layout/HeaderActions";

export const ACCOUNT_LINKS = [
  { href: "/account", label: "Overview", icon: LayoutDashboard },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/quotes", label: "Bulk Quotes", icon: FileText },
  { href: "/account/projects", label: "Projects", icon: ClipboardList },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/notifications", label: "Notifications", icon: Bell },
  { href: "/account/profile", label: "Profile & VAT", icon: User },
  { href: "/account/security", label: "Security", icon: Shield },
];

export function AccountNav({ unread }: { unread: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (h: string) => (h === "/account" ? pathname === h : pathname.startsWith(h));
  return (
    <>
      {/* Mobile: horizontal scroll tabs */}
      <nav aria-label="Account" className="no-scrollbar sticky top-14 z-20 -mx-4 flex gap-1 overflow-x-auto border-b border-border bg-background/95 px-4 py-2 backdrop-blur lg:hidden">
        {ACCOUNT_LINKS.map((l) => (
          <Link key={l.href} href={l.href} aria-current={isActive(l.href) ? "page" : undefined} className={cn("flex h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-medium", isActive(l.href) ? "bg-primary-800 text-white" : "text-muted-foreground hover:bg-surface")}>
            <l.icon className="size-4" aria-hidden /> {l.label}
            {l.href.endsWith("notifications") && unread > 0 && <span className="rounded-full bg-accent-500 px-1.5 text-[10px] font-bold text-neutral-900">{unread}</span>}
          </Link>
        ))}
      </nav>
      {/* Desktop sidebar */}
      <nav aria-label="Account" className="hidden lg:block">
        <ul className="sticky top-32 space-y-1 rounded-xl border border-border bg-surface p-2 shadow-card">
          {ACCOUNT_LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} aria-current={isActive(l.href) ? "page" : undefined} className={cn("flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors", isActive(l.href) ? "bg-primary-50 text-primary-800 dark:bg-surface-muted dark:text-white" : "text-muted-foreground hover:bg-surface-muted hover:text-foreground")}>
                <l.icon className="size-4.5" aria-hidden />
                <span className="flex-1">{l.label}</span>
                {l.href.endsWith("notifications") && unread > 0 && <span className="rounded-full bg-accent-500 px-1.5 text-[10px] font-bold text-neutral-900">{unread}</span>}
              </Link>
            </li>
          ))}
          <li className="border-t border-border pt-1">
            <button type="button" onClick={() => logout(router)} className="flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-danger hover:bg-danger-50">
              <LogOut className="size-4.5" aria-hidden /> Logout
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}
