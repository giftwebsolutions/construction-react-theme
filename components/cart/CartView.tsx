"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Bookmark, Heart, Lock, ShoppingCart, Tag, Trash2, Truck } from "lucide-react";
import type { ProductCardData } from "@/lib/data/card";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/lists";
import { useDeliveryLocation } from "@/store/ui";
import { toast } from "@/store/toast";
import { lookupArea } from "@/lib/data/locations";
import { computeCartTotals, lineTotal, unitPriceFor } from "@/lib/utils/cart";
import { formatAED } from "@/lib/utils/format";
import { nextTier } from "@/lib/utils/pricing";
import { formatQty, formatWeight, perUnit } from "@/lib/utils/units";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { Skeleton } from "@/components/ui/Skeleton";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { coupons } from "@/lib/data/coupons";
import { OrderSummary } from "./OrderSummary";

export function CartView({ recommendations }: { recommendations: ProductCardData[] }) {
  const hydrated = useHydrated();
  const { items, saved, couponCode, setQty, remove, saveForLater, moveToCart, removeSaved, applyCoupon } = useCart();
  const wishToggle = useWishlist((s) => s.toggle);
  const wishHas = useWishlist((s) => s.has);
  const { areaId } = useDeliveryLocation();
  const placeOfSupply = lookupArea(areaId)?.emirate ?? "Dubai";
  const [code, setCode] = useState("");
  const totals = computeCartTotals(items, { couponCode });

  if (!hydrated)
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-3">{Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-36 rounded-xl" />)}</div>
        <Skeleton className="h-80 rounded-xl" />
      </div>
    );

  if (!items.length)
    return (
      <>
        <div className="rounded-2xl border border-border bg-surface">
          <EmptyState
            icon={<ShoppingCart aria-hidden />}
            title="Your cart is empty"
            description="Browse cement, steel, tiles and more. Bulk prices apply automatically as you add quantity."
            actions={
              <>
                <ButtonLink href="/products">Start shopping</ButtonLink>
                <ButtonLink href="/bulk-enquiry" variant="outline">Request bulk quote</ButtonLink>
              </>
            }
          />
        </div>
        <SavedList saved={saved} moveToCart={moveToCart} removeSaved={removeSaved} />
        <Recs cards={recommendations} />
      </>
    );

  const moveToWishlist = (key: string, productId: string, name: string) => {
    if (!wishHas(productId)) wishToggle(productId);
    remove(key);
    toast({ title: "Moved to wishlist", description: name });
  };

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
        <div className="space-y-5">
          {totals.groups.map((g) => (
            <section key={g.type} className="overflow-hidden rounded-xl border border-border bg-surface shadow-card" aria-labelledby={`grp-${g.type}`}>
              <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface-muted px-4 py-3">
                <h2 id={`grp-${g.type}`} className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <Truck className="size-4.5 text-primary-700 dark:text-primary-200" aria-hidden />
                  {g.type === "truck" ? "Truck delivery to site" : "Parcel delivery"} ({g.items.length})
                </h2>
                <p className="text-xs text-muted-foreground">
                  Est. {g.etaDays}–{g.etaDays + 1} days · {formatWeight(g.weightKg)} · {g.charge ? `${formatAED(g.charge)} delivery` : "Free delivery"}
                </p>
              </header>
              <ul className="divide-y divide-border">
                {g.items.map((i) => {
                  const upcoming = nextTier(i.quantity, i.tieredPricing);
                  return (
                    <li key={i.key} className="flex gap-3 p-4 sm:gap-4">
                      <Link href={`/product/${i.slug}`} className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-surface-muted sm:size-28">
                        <Image src={i.image} alt="" fill sizes="112px" className="object-cover" />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <div className="flex gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold uppercase text-primary-700 dark:text-primary-200">{i.brandName}</p>
                            <Link href={`/product/${i.slug}`} className="line-clamp-2 text-sm font-semibold text-foreground hover:text-primary-700 sm:text-base">{i.name}</Link>
                            {i.variant && <p className="mt-0.5 text-xs text-muted-foreground">{Object.entries(i.variant).map(([k, v]) => `${k}: ${v}`).join(" · ")}</p>}
                          </div>
                          <p className="hidden text-right font-display text-lg font-bold tabular-nums text-foreground sm:block">{formatAED(lineTotal(i))}</p>
                        </div>
                        <p className="mt-1 text-sm text-foreground">
                          {formatAED(unitPriceFor(i))}
                          <span className="text-xs text-muted-foreground">{perUnit(i.unit)}</span>
                          {unitPriceFor(i) < i.basePrice && <span className="ml-2 text-xs font-semibold text-success">Bulk price</span>}
                          {i.mrp > unitPriceFor(i) && <span className="ml-2 text-xs text-muted-foreground line-through">{formatAED(i.mrp)}</span>}
                        </p>
                        {upcoming && (
                          <button type="button" onClick={() => setQty(i.key, upcoming.minQty)} className="mt-1 text-left text-xs text-primary-700 hover:underline dark:text-primary-200">
                            Add {formatQty(upcoming.minQty - i.quantity, i.unit)} more for {formatAED(upcoming.pricePerUnit)}{perUnit(i.unit)}
                          </button>
                        )}
                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                          <QuantityStepper value={i.quantity} onChange={(q) => setQty(i.key, q)} min={i.minOrderQty} step={i.stepQty} size="sm" label={`Quantity for ${i.name}`} />
                          <p className="font-display text-base font-bold tabular-nums text-foreground sm:hidden">{formatAED(lineTotal(i))}</p>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold">
                          <button type="button" onClick={() => saveForLater(i.key)} className="inline-flex min-h-8 items-center gap-1.5 text-muted-foreground hover:text-foreground"><Bookmark className="size-3.5" aria-hidden /> Save for later</button>
                          <button type="button" onClick={() => moveToWishlist(i.key, i.productId, i.name)} className="inline-flex min-h-8 items-center gap-1.5 text-muted-foreground hover:text-foreground"><Heart className="size-3.5" aria-hidden /> Move to wishlist</button>
                          <button type="button" onClick={() => remove(i.key)} className="inline-flex min-h-8 items-center gap-1.5 text-danger hover:underline"><Trash2 className="size-3.5" aria-hidden /> Remove</button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
          <SavedList saved={saved} moveToCart={moveToCart} removeSaved={removeSaved} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-32">
          <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground"><Tag className="size-4 text-accent-600" aria-hidden /> Apply coupon</p>
            {totals.coupon ? (
              <div className="mt-3 flex items-center justify-between rounded-lg border border-dashed border-success bg-success-50 px-3 py-2 dark:bg-green-900/20">
                <span className="text-sm"><strong className="text-green-800 dark:text-green-200">{totals.coupon.code}</strong> <span className="text-xs text-muted-foreground">applied</span></span>
                <button type="button" onClick={() => applyCoupon(undefined)} className="text-xs font-semibold text-danger">Remove</button>
              </div>
            ) : (
              <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); applyCoupon(code); }}>
                <label htmlFor="coupon" className="sr-only">Coupon code</label>
                <input id="coupon" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Enter code" className="h-11 min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 text-base uppercase focus:border-primary-600 focus:outline-none sm:text-sm" />
                <Button type="submit" variant="outline">Apply</Button>
              </form>
            )}
            {totals.couponError && <p role="alert" className="mt-2 text-xs font-medium text-danger">{totals.couponError}</p>}
            <ul className="mt-3 space-y-1.5">
              {coupons.map((c) => (
                <li key={c.code} className="flex items-start justify-between gap-2 text-xs">
                  <span className="text-muted-foreground"><strong className="text-foreground">{c.code}</strong> — {c.description}</span>
                  {couponCode !== c.code && <button type="button" onClick={() => applyCoupon(c.code)} className="shrink-0 font-semibold text-primary-700 dark:text-primary-200">Apply</button>}
                </li>
              ))}
            </ul>
          </div>
          <OrderSummary totals={totals} placeOfSupply={placeOfSupply}>
            <ButtonLink href="/checkout" variant="accent" size="lg" fullWidth className="mt-4" rightIcon={<ArrowRight className="size-4" aria-hidden />}>
              Proceed to Checkout
            </ButtonLink>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground"><Lock className="size-3.5" aria-hidden /> Secure checkout · VAT invoice</p>
          </OrderSummary>
        </aside>
      </div>

      {/* Mobile checkout bar */}
      <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-30 flex items-center gap-3 border-t border-border bg-surface/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex-1">
          <p className="font-display text-lg font-bold leading-none text-foreground">{formatAED(totals.grandTotal)}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{totals.lineCount} items · incl. VAT & delivery</p>
        </div>
        <ButtonLink href="/checkout" variant="accent">Checkout</ButtonLink>
      </div>
      <Recs cards={recommendations} />
    </>
  );
}

function SavedList({ saved, moveToCart, removeSaved }: { saved: ReturnType<typeof useCart.getState>["saved"]; moveToCart: (k: string) => void; removeSaved: (k: string) => void }) {
  if (!saved.length) return null;
  return (
    <section className="mt-6 rounded-xl border border-border bg-surface p-4 shadow-card" aria-labelledby="saved">
      <h2 id="saved" className="text-base font-bold text-foreground">Saved for later ({saved.length})</h2>
      <ul className="mt-3 divide-y divide-border">
        {saved.map((i) => (
          <li key={i.key} className="flex items-center gap-3 py-3">
            <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface-muted"><Image src={i.image} alt="" fill sizes="56px" className="object-cover" /></span>
            <div className="min-w-0 flex-1">
              <Link href={`/product/${i.slug}`} className="line-clamp-1 text-sm font-semibold text-foreground">{i.name}</Link>
              <p className="text-xs text-muted-foreground">{formatAED(i.basePrice)}{perUnit(i.unit)} · {formatQty(i.quantity, i.unit)}</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => moveToCart(i.key)}>Move to cart</Button>
            <button type="button" onClick={() => removeSaved(i.key)} className="rounded-lg p-2 text-muted-foreground hover:text-danger" aria-label={`Remove ${i.name}`}><Trash2 className="size-4" aria-hidden /></button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Recs({ cards }: { cards: ProductCardData[] }) {
  return (
    <section className="mt-12 pb-16 lg:pb-0">
      <h2 className="mb-4 text-xl font-bold text-foreground">You may also need</h2>
      <ProductCarousel cards={cards} label="Recommended products" />
    </section>
  );
}
