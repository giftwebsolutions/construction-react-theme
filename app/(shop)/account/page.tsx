import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calculator, FileText, Heart, Package, Truck, Upload } from "lucide-react";
import { getSessionUser } from "@/lib/auth/session";
import { getOrders, getQuotes } from "@/lib/data";
import { formatDate, formatAED } from "@/lib/utils/format";
import { OrderStatusBadge } from "@/components/account/StatusBadge";
import { WishlistCount } from "@/components/account/WishlistClient";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "My Account", robots: { index: false } };

export default async function AccountOverview() {
  const user = (await getSessionUser())!;
  const [orders, quotes] = await Promise.all([getOrders(user.id), getQuotes(user.id)]);
  const pending = orders.filter((o) => ["placed", "confirmed", "dispatched", "out-for-delivery"].includes(o.status));
  const activeQuotes = quotes.filter((q) => q.status === "submitted" || q.status === "under-review" || q.status === "quoted");
  const spend = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);

  const stats = [
    { label: "Total orders", value: orders.length, icon: Package, href: "/account/orders" },
    { label: "Pending deliveries", value: pending.length, icon: Truck, href: "/account/orders" },
    { label: "Active quotes", value: activeQuotes.length, icon: FileText, href: "/account/quotes" },
    { label: "Wishlist", value: <WishlistCount />, icon: Heart, href: "/account/wishlist" },
  ];

  return (
    <div className="space-y-6">
      <ul className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {stats.map((s) => (
          <li key={s.label}>
            <Link href={s.href} className="flex h-full flex-col rounded-xl border border-border bg-surface p-4 shadow-card transition hover:border-primary-600">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary-50 text-primary-800 dark:bg-surface-muted dark:text-primary-100"><s.icon className="size-5" aria-hidden /></span>
              <span className="mt-3 font-display text-3xl font-bold text-foreground">{s.value}</span>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      {user.isVerifiedContractor && user.creditLimit && (
        <div className="flex flex-col gap-3 rounded-xl bg-gradient-to-r from-primary-800 to-primary-600 p-5 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-accent-400">Smart-MEP Credit</p>
            <p className="mt-1 font-display text-2xl font-bold">{formatAED(user.creditLimit - 142000)} available</p>
            <p className="text-xs text-primary-100">of {formatAED(user.creditLimit)} limit · 30-day terms · next due 15 Oct</p>
          </div>
          <p className="text-sm text-primary-100">Lifetime spend: <strong className="text-white">{formatAED(spend)}</strong></p>
        </div>
      )}

      <section className="rounded-xl border border-border bg-surface shadow-card" aria-labelledby="ro">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 id="ro" className="text-base font-bold text-foreground">Recent orders</h2>
          <Link href="/account/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-primary-700 dark:text-primary-200">View all <ArrowRight className="size-4" aria-hidden /></Link>
        </div>
        {orders.length === 0 ? (
          <EmptyState compact icon={<Package aria-hidden />} title="No orders yet" description="Your orders and deliveries will appear here." actions={<ButtonLink href="/products">Start shopping</ButtonLink>} />
        ) : (
          <>
            <ul className="divide-y divide-border md:hidden">
              {orders.slice(0, 4).map((o) => (
                <li key={o.id}>
                  <Link href={`/account/orders/${o.id}`} className="flex items-center gap-3 p-4">
                    <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-surface-muted"><Image src={o.lines[0]!.image} alt="" fill sizes="48px" className="object-cover" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-foreground">{o.number}</span>
                      <span className="block text-xs text-muted-foreground">{formatDate(o.createdAt)} · {o.lines.length} items</span>
                    </span>
                    <span className="text-right"><span className="block text-sm font-bold text-foreground">{formatAED(o.total)}</span><OrderStatusBadge status={o.status} /></span>
                  </Link>
                </li>
              ))}
            </ul>
            <table className="hidden w-full text-sm md:table">
              <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr><th className="px-4 py-3 font-semibold">Order</th><th className="px-4 py-3 font-semibold">Date</th><th className="px-4 py-3 font-semibold">Items</th><th className="px-4 py-3 font-semibold">Status</th><th className="px-4 py-3 text-right font-semibold">Total</th></tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="border-t border-border hover:bg-surface-muted/60">
                    <td className="px-4 py-3"><Link href={`/account/orders/${o.id}`} className="font-semibold text-primary-700 hover:underline dark:text-primary-200">{o.number}</Link></td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(o.createdAt)}</td>
                    <td className="max-w-56 truncate px-4 py-3 text-foreground">{o.lines.map((l) => l.name).join(", ")}</td>
                    <td className="px-4 py-3"><OrderStatusBadge status={o.status} /></td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums text-foreground">{formatAED(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </section>

      <section aria-labelledby="qa">
        <h2 id="qa" className="mb-3 text-base font-bold text-foreground">Quick actions</h2>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { href: "/bulk-enquiry", label: "Upload BOQ", icon: Upload },
            { href: "/account/orders", label: "Track delivery", icon: Truck },
            { href: "/calculators/cement", label: "Calculators", icon: Calculator },
            { href: "/account/addresses", label: "Add site address", icon: Package },
          ].map((a) => (
            <li key={a.label}>
              <Link href={a.href} className="flex h-full items-center gap-3 rounded-xl border border-border bg-surface p-4 text-sm font-semibold text-foreground hover:border-accent-500">
                <a.icon className="size-5 text-accent-600" aria-hidden /> {a.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      {pending[0] && <p className="text-xs text-muted-foreground">Next delivery expected {formatDate(pending[0].expectedDelivery, { weekday: "long", day: "numeric", month: "short" })} for {pending[0].number}.</p>}
    </div>
  );
}
