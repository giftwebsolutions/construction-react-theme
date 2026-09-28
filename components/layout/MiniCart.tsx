"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Trash2, Truck } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { computeCartTotals, lineTotal, unitPriceFor } from "@/lib/utils/cart";
import { formatAED } from "@/lib/utils/format";
import { perUnit } from "@/lib/utils/units";
import { useHydrated } from "@/lib/hooks/use-hydrated";

export function MiniCart() {
  const hydrated = useHydrated();
  const { miniCartOpen, setMiniCart } = useUI();
  const { items, setQty, remove, couponCode } = useCart();
  const totals = computeCartTotals(items, { couponCode });
  const close = () => setMiniCart(false);
  if (!hydrated) return null;

  return (
    <Drawer
      open={miniCartOpen}
      onClose={close}
      side="right"
      title={`Your Cart${items.length ? ` (${items.length})` : ""}`}
      footer={
        items.length > 0 && (
          <div className="space-y-3">
            {totals.mrpSavings > 0 && <p className="rounded-lg bg-success-50 px-3 py-2 text-xs font-semibold text-green-800">You save {formatAED(totals.mrpSavings)} on this order</p>}
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Subtotal (incl. VAT)</span>
              <span className="font-display text-xl font-bold text-foreground">{formatAED(totals.subtotal)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Delivery charges calculated at checkout.</p>
            <div className="grid grid-cols-2 gap-2">
              <ButtonLink href="/cart" variant="outline" onClick={close}>
                View Cart
              </ButtonLink>
              <ButtonLink href="/checkout" variant="accent" onClick={close}>
                Checkout
              </ButtonLink>
            </div>
          </div>
        )
      }
    >
      {items.length === 0 ? (
        <EmptyState
          compact
          icon={<ShoppingCart aria-hidden />}
          title="Your cart is empty"
          description="Add cement, steel, tiles and more — bulk prices apply automatically."
          actions={
            <ButtonLink href="/products" onClick={close}>
              Start shopping
            </ButtonLink>
          }
        />
      ) : (
        <div>
          {totals.groups.map((g) => (
            <section key={g.type} aria-label={`${g.type} delivery items`}>
              <p className="flex items-center gap-2 bg-surface-muted px-4 py-2 text-xs font-semibold text-muted-foreground">
                <Truck className="size-3.5" aria-hidden /> {g.type === "truck" ? "Truck delivery to site" : "Parcel delivery"} · {g.items.length} item{g.items.length > 1 ? "s" : ""}
              </p>
              <ul className="divide-y divide-border">
                {g.items.map((i) => (
                  <li key={i.key} className="flex gap-3 p-4">
                    <Link href={`/product/${i.slug}`} onClick={close} className="relative size-18 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                      <Image src={i.image} alt="" fill sizes="72px" className="object-cover" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link href={`/product/${i.slug}`} onClick={close} className="line-clamp-2 text-sm font-semibold text-foreground hover:text-primary-700">
                        {i.name}
                      </Link>
                      {i.variant && <p className="mt-0.5 text-xs text-muted-foreground">{Object.entries(i.variant).map(([k, v]) => `${k}: ${v}`).join(" · ")}</p>}
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatAED(unitPriceFor(i))}
                        {perUnit(i.unit)}
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <QuantityStepper value={i.quantity} onChange={(q) => setQty(i.key, q)} min={i.minOrderQty} step={i.stepQty} size="sm" label={`Quantity for ${i.name}`} />
                        <span className="text-sm font-bold text-foreground">{formatAED(lineTotal(i))}</span>
                      </div>
                    </div>
                    <button type="button" onClick={() => remove(i.key)} className="-mr-2 -mt-2 self-start rounded-lg p-2 text-muted-foreground hover:bg-danger-50 hover:text-danger" aria-label={`Remove ${i.name}`}>
                      <Trash2 className="size-4" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </Drawer>
  );
}
