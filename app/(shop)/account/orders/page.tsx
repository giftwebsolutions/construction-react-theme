import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";
import { getSessionUser } from "@/lib/auth/session";
import { getOrders, getProjects } from "@/lib/data";
import { formatDate, formatAED } from "@/lib/utils/format";
import { OrderStatusBadge } from "@/components/account/StatusBadge";
import { InvoiceButton, ReorderButton } from "@/components/account/OrderActions";
import { EmptyState } from "@/components/ui/EmptyState";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "My Orders", robots: { index: false } };

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const user = (await getSessionUser())!;
  const { status } = await searchParams;
  const [all, projects] = await Promise.all([getOrders(user.id), getProjects(user.id)]);
  const tabs = [
    { key: "all", label: "All" },
    { key: "active", label: "In progress" },
    { key: "delivered", label: "Delivered" },
    { key: "cancelled", label: "Cancelled" },
  ];
  const cur = status ?? "all";
  const orders = all.filter((o) => cur === "all" || (cur === "active" ? !["delivered", "cancelled"].includes(o.status) : o.status === cur));

  return (
    <div>
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">My Orders</h1>
      <nav aria-label="Filter orders" className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
        {tabs.map((t) => (
          <Link key={t.key} href={t.key === "all" ? "/account/orders" : `/account/orders?status=${t.key}`} aria-current={cur === t.key ? "page" : undefined} className={`h-9 shrink-0 rounded-full border px-4 text-sm font-semibold leading-9 ${cur === t.key ? "border-primary-800 bg-primary-800 text-white" : "border-border bg-surface text-foreground"}`}>
            {t.label}
          </Link>
        ))}
      </nav>
      {orders.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-border bg-surface">
          <EmptyState icon={<Package aria-hidden />} title="No orders here" description="Orders you place will show up here with live delivery tracking." actions={<ButtonLink href="/products">Browse products</ButtonLink>} />
        </div>
      ) : (
        <ul className="mt-5 space-y-4">
          {orders.map((o) => (
            <li key={o.id} className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-border bg-surface-muted px-4 py-3 text-xs">
                <div className="flex flex-wrap gap-x-6 gap-y-1">
                  <p><span className="text-muted-foreground">Order </span><strong className="text-foreground">{o.number}</strong></p>
                  <p><span className="text-muted-foreground">Placed </span><span className="text-foreground">{formatDate(o.createdAt)}</span></p>
                  <p><span className="text-muted-foreground">Total </span><strong className="text-foreground">{formatAED(o.total)}</strong></p>
                  {o.projectId && <p><span className="text-muted-foreground">Project </span><span className="text-foreground">{projects.find((p) => p.id === o.projectId)?.name}</span></p>}
                </div>
                <OrderStatusBadge status={o.status} />
              </div>
              <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                <div className="flex -space-x-3">
                  {o.lines.slice(0, 3).map((l) => (
                    <span key={l.productId} className="relative size-14 overflow-hidden rounded-lg border-2 border-surface bg-surface-muted"><Image src={l.image} alt="" fill sizes="56px" className="object-cover" /></span>
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium text-foreground">{o.lines.map((l) => l.name).join(" · ")}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {o.status === "delivered" ? `Delivered ${formatDate(o.timeline.find((t) => t.status === "delivered")?.date ?? o.expectedDelivery)}` : o.status === "cancelled" ? "Order cancelled" : `Expected by ${formatDate(o.expectedDelivery, { weekday: "short", day: "numeric", month: "short" })}`} · {o.address.label}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <ButtonLink href={`/account/orders/${o.id}`} variant="primary" size="sm" rightIcon={<ChevronRight className="size-4" aria-hidden />}>Details</ButtonLink>
                  {o.status !== "cancelled" && <InvoiceButton size="sm" />}
                  <ReorderButton order={o} size="sm" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
