"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { CalendarDays, CheckCircle2, CreditCard, Download, MapPin, Package } from "lucide-react";
import type { LastOrder } from "./CheckoutFlow";
import { ButtonLink } from "@/components/ui/Button";
import { formatDate, formatSAR } from "@/lib/utils/format";

const read = () => {
  try {
    return sessionStorage.getItem("bm-last-order");
  } catch {
    return null;
  }
};

export function OrderSuccess({ orderNumber }: { orderNumber: string }) {
  const raw = useSyncExternalStore(() => () => {}, read, () => null);
  const order: LastOrder | null = raw ? JSON.parse(raw) : null;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-border bg-surface p-6 text-center shadow-card sm:p-10">
        <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-success-50 text-success dark:bg-green-900/30">
          <CheckCircle2 className="size-11" aria-hidden />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-foreground sm:text-3xl">Order placed successfully!</h1>
        <p className="mt-2 text-muted-foreground">Thank you. A confirmation has been sent by SMS and email.</p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-lg bg-surface-muted px-4 py-2 text-sm">
          Order ID <strong className="font-mono text-base text-foreground">{orderNumber}</strong>
        </p>

        {order && (
          <div className="mt-8 text-left">
            <dl className="grid gap-4 rounded-xl bg-surface-muted p-4 text-sm sm:grid-cols-2">
              <div className="flex gap-3"><CalendarDays className="mt-0.5 size-4.5 shrink-0 text-primary-700 dark:text-primary-200" aria-hidden /><div><dt className="text-xs text-muted-foreground">Expected delivery</dt><dd className="font-semibold text-foreground">{formatDate(order.date, { weekday: "long", day: "numeric", month: "short" })}, {order.slot}</dd></div></div>
              <div className="flex gap-3"><MapPin className="mt-0.5 size-4.5 shrink-0 text-primary-700 dark:text-primary-200" aria-hidden /><div><dt className="text-xs text-muted-foreground">Delivering to</dt><dd className="font-semibold text-foreground">{order.address}</dd></div></div>
              <div className="flex gap-3"><CreditCard className="mt-0.5 size-4.5 shrink-0 text-primary-700 dark:text-primary-200" aria-hidden /><div><dt className="text-xs text-muted-foreground">Payment</dt><dd className="font-semibold text-foreground">{order.payment}</dd></div></div>
              <div className="flex gap-3"><Package className="mt-0.5 size-4.5 shrink-0 text-primary-700 dark:text-primary-200" aria-hidden /><div><dt className="text-xs text-muted-foreground">Order total</dt><dd className="font-display text-lg font-bold text-foreground">{formatSAR(order.total)}</dd></div></div>
            </dl>
            <ul className="mt-4 divide-y divide-border rounded-xl border border-border">
              {order.items.map((i) => (
                <li key={i.name} className="flex items-center gap-3 p-3">
                  <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-surface-muted"><Image src={i.image} alt="" fill sizes="48px" className="object-cover" /></span>
                  <span className="min-w-0 flex-1 text-sm"><span className="line-clamp-1 font-medium text-foreground">{i.name}</span><span className="text-xs text-muted-foreground">{i.qty}</span></span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <ButtonLink href="/docs/technical-datasheet.pdf" variant="outline" download leftIcon={<Download className="size-4" aria-hidden />}>Download invoice</ButtonLink>
          <ButtonLink href="/account/orders" variant="primary">Track order</ButtonLink>
          <ButtonLink href="/products" variant="accent">Continue shopping</ButtonLink>
        </div>
      </div>
    </div>
  );
}
