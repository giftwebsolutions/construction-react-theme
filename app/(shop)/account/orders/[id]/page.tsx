import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, CircleX, CreditCard, FileText, MapPin, Phone } from "lucide-react";
import { getSessionUser } from "@/lib/auth/session";
import { getOrderById } from "@/lib/data";
import { formatDate, formatDateTime, formatAED } from "@/lib/utils/format";
import { formatQty, perUnit } from "@/lib/utils/units";
import { OrderStatusBadge } from "@/components/account/StatusBadge";
import { InvoiceButton, ReorderButton } from "@/components/account/OrderActions";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { formatAddressArea } from "@/lib/data/locations";
import { formatPhone } from "@/lib/utils/validators";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = { title: "Order Details", robots: { index: false } };

const PAY = { card: "Card", wallet: "Apple Pay / Google Pay", bnpl: "Tabby (4 instalments)", "bank-transfer": "Bank Transfer", cod: "Cash on Delivery", credit: "Smart-MEP Credit" };

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = (await getSessionUser())!;
  const order = await getOrderById(user.id, (await params).id);
  if (!order) notFound();
  const lastDone = order.timeline.reduce((acc, t, i) => (t.date ? i : acc), 0);

  return (
    <div className="space-y-5">
      <Breadcrumb items={[{ label: "Account", href: "/account" }, { label: "Orders", href: "/account/orders" }, { label: order.number }]} />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-3 text-xl font-bold text-foreground sm:text-2xl">Order {order.number} <OrderStatusBadge status={order.status} /></h1>
          <p className="mt-1 text-sm text-muted-foreground">Placed {formatDateTime(order.createdAt)}</p>
        </div>
        <div className="flex gap-2">
          <InvoiceButton />
          <ReorderButton order={order} />
        </div>
      </div>

      <section className="rounded-xl border border-border bg-surface p-5 shadow-card" aria-labelledby="track">
        <h2 id="track" className="text-base font-bold text-foreground">Delivery tracking</h2>
        <ol className="mt-5 grid gap-0 md:grid-cols-5">
          {order.timeline.map((t, i) => {
            const done = !!t.date;
            const cancelled = t.status === "cancelled";
            return (
              <li key={t.status} className="relative flex gap-3 pb-6 md:flex-col md:items-center md:pb-0 md:text-center">
                {i < order.timeline.length - 1 && <span className={cn("absolute left-4 top-8 h-full w-0.5 md:left-1/2 md:top-4 md:h-0.5 md:w-full", i < lastDone ? "bg-success" : "bg-border")} aria-hidden />}
                <span className={cn("relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full", cancelled ? "bg-danger text-white" : done ? "bg-success text-white" : "border-2 border-border bg-surface text-muted-foreground")}>
                  {cancelled ? <CircleX className="size-4" aria-hidden /> : done ? <Check className="size-4" aria-hidden /> : <span className="text-xs font-bold">{i + 1}</span>}
                </span>
                <div className="md:mt-2">
                  <p className={cn("text-sm font-semibold", done ? "text-foreground" : "text-muted-foreground")}>{t.label}</p>
                  <p className="text-xs text-muted-foreground">{t.date ? formatDateTime(t.date) : i === 4 ? `Expected ${formatDate(order.expectedDelivery, { day: "numeric", month: "short" })}` : "Pending"}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <section className="rounded-xl border border-border bg-surface shadow-card" aria-labelledby="items">
          <h2 id="items" className="border-b border-border p-4 text-base font-bold text-foreground">Items ({order.lines.length})</h2>
          <ul className="divide-y divide-border">
            {order.lines.map((l) => (
              <li key={l.productId} className="flex gap-3 p-4">
                <Link href={`/product/${l.slug}`} className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-surface-muted"><Image src={l.image} alt="" fill sizes="64px" className="object-cover" /></Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/product/${l.slug}`} className="line-clamp-2 text-sm font-semibold text-foreground hover:text-primary-700">{l.name}</Link>
                  <p className="mt-1 text-xs text-muted-foreground">{formatQty(l.quantity, l.unit)} × {formatAED(l.unitPrice)}{perUnit(l.unit)} · VAT {l.vatRate}%</p>
                </div>
                <p className="text-sm font-bold tabular-nums text-foreground">{formatAED(l.unitPrice * l.quantity)}</p>
              </li>
            ))}
          </ul>
        </section>
        <div className="space-y-5">
          <section className="rounded-xl border border-border bg-surface p-4 text-sm shadow-card">
            <h2 className="flex items-center gap-2 font-bold text-foreground"><MapPin className="size-4" aria-hidden /> Delivery address</h2>
            <p className="mt-2 font-semibold text-foreground">{order.address.label}</p>
            <p className="text-muted-foreground">{order.address.name}<br />{order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ""}<br />{formatAddressArea(order.address)}</p>
            <p className="mt-2 flex items-center gap-1.5 text-muted-foreground"><Phone className="size-3.5" aria-hidden /> {formatPhone(order.address.phone)}</p>
          </section>
          <section className="rounded-xl border border-border bg-surface p-4 text-sm shadow-card">
            <h2 className="flex items-center gap-2 font-bold text-foreground"><CreditCard className="size-4" aria-hidden /> Payment</h2>
            <dl className="mt-3 space-y-1.5">
              <div className="flex justify-between"><dt className="text-muted-foreground">Taxable value</dt><dd className="tabular-nums">{formatAED(order.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">VAT</dt><dd className="tabular-nums">{formatAED(order.vatTotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Delivery</dt><dd className="tabular-nums">{order.deliveryCharge ? formatAED(order.deliveryCharge) : "FREE"}</dd></div>
              <div className="flex justify-between text-success"><dt>You saved</dt><dd className="tabular-nums">{formatAED(order.discount)}</dd></div>
              <div className="flex justify-between border-t border-border pt-2 text-base font-bold"><dt>Total</dt><dd className="tabular-nums">{formatAED(order.total)}</dd></div>
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">Paid via {PAY[order.paymentMethod]}</p>
            {order.trn && <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground"><FileText className="size-3.5" aria-hidden /> VAT invoice · {order.trn}</p>}
          </section>
        </div>
      </div>
    </div>
  );
}
