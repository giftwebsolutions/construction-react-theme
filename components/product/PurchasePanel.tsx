"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BadgeCheck, Check, FileText, GitCompareArrows, Heart, Package, Share2, ShoppingCart, Warehouse, Zap } from "lucide-react";
import type { Product } from "@/types";
import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { cn } from "@/lib/utils/cn";
import { discountPercent, formatAED } from "@/lib/utils/format";
import { exclusiveOfVat, nextTier, tierPrice } from "@/lib/utils/pricing";
import { formatQty, formatWeight, perUnit, unitLabel } from "@/lib/utils/units";
import { priceForSelection, scaledTiers } from "@/lib/utils/variants";
import { useAddToCart } from "@/lib/hooks/use-add-to-cart";
import { useCompareToggle, useWishlistToggle } from "@/lib/hooks/use-toggle-lists";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { useCompare, useRecentlyViewed, useWishlist } from "@/store/lists";
import { toast } from "@/store/toast";
import { InlineCalculator } from "./InlineCalculator";
import { DeliveryChecker } from "./DeliveryChecker";

export const VARIANT_PREFIX = "v.";

export function PurchasePanel({ product: p, brandName, initialSelection }: { product: Product; brandName: string; initialSelection: Record<string, string> }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const [selection, setSelection] = useState(initialSelection);
  const [qty, setQty] = useState(p.minOrderQty);
  const [inclVat, setInclVat] = useState(true);
  const addToCart = useAddToCart();
  const toggleWish = useWishlistToggle();
  const toggleCompare = useCompareToggle();
  const wished = useWishlist((s) => s.ids.includes(p.id)) && hydrated;
  const compared = useCompare((s) => s.ids.includes(p.id)) && hydrated;
  const pushRecent = useRecentlyViewed((s) => s.push);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => pushRecent(p.id), [p.id, pushRecent]);

  // Mobile sticky bar appears once the main CTA scrolls out of view
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowSticky(!e!.isIntersecting && e!.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const { price, mrp } = priceForSelection(p, selection);
  const tiers = scaledTiers(p, price);
  const unitPrice = tierPrice(price, qty, tiers);
  const shown = (v: number) => (inclVat ? v : exclusiveOfVat(v, p.vatRate));
  const total = unitPrice * qty;
  const off = discountPercent(price, mrp);
  const upcoming = nextTier(qty, tiers);
  const outOfStock = p.stock <= 0;
  const packVariant = p.variants?.find((v) => v.key === "packSize");
  const packLitres = packVariant ? Number(String(selection.packSize ?? "").match(/[\d.]+/)?.[0]) || undefined : undefined;

  const select = (key: string, value: string) => {
    const next = { ...selection, [key]: value };
    setSelection(next);
    const url = new URL(window.location.href);
    url.searchParams.set(VARIANT_PREFIX + key, value);
    window.history.replaceState(null, "", url);
  };

  const add = (buyNow = false) => {
    addToCart(p, { brandName, quantity: qty, selection, sourceEl: document.querySelector<HTMLElement>("[data-gallery-main]"), silent: buyNow });
    if (buyNow) router.push("/checkout");
  };

  const share = async () => {
    const data = { title: p.name, text: `${p.name} — ${formatAED(price)}${perUnit(p.unit)} on BuildMart`, url: window.location.href };
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch {}
    } else {
      await navigator.clipboard.writeText(data.url);
      toast({ title: "Link copied", description: "Share it with your contractor or architect." });
    }
  };

  return (
    <div className="space-y-5">
      {/* Price block */}
      <div className="rounded-xl bg-surface-muted p-4">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <span className="font-display text-3xl font-extrabold text-foreground tabular-nums">
            {formatAED(shown(unitPrice))}
            <span className="ml-1 font-sans text-base font-medium text-muted-foreground">{perUnit(p.unit)}</span>
          </span>
          {off > 0 && (
            <>
              <span className="text-sm text-muted-foreground line-through">MRP {formatAED(shown(mrp))}</span>
              <span className="rounded bg-success px-1.5 py-0.5 text-xs font-bold text-white">{off}% off</span>
            </>
          )}
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">{inclVat ? `Inclusive of ${p.vatRate}% VAT` : `+ ${p.vatRate}% VAT (${formatAED(unitPrice - exclusiveOfVat(unitPrice, p.vatRate))})`}</p>
          <div className="inline-flex rounded-lg border border-border bg-surface p-0.5 text-xs font-semibold" role="group" aria-label="VAT display">
            {[true, false].map((v) => (
              <button key={String(v)} type="button" aria-pressed={inclVat === v} onClick={() => setInclVat(v)} className={cn("rounded-md px-2.5 py-1.5", inclVat === v ? "bg-primary-800 text-white" : "text-muted-foreground")}>
                {v ? "Incl. VAT" : "Excl. VAT"}
              </button>
            ))}
          </div>
        </div>
        {unitPrice < price && (
          <p className="mt-2 text-xs font-semibold text-success">
            Bulk price applied — you save {formatAED((price - unitPrice) * qty)} on this quantity
          </p>
        )}
      </div>

      {/* Variants */}
      {p.variants?.map((v) => (
        <fieldset key={v.key}>
          <legend className="mb-2 text-sm font-semibold text-foreground">
            {v.label}: <span className="font-normal text-muted-foreground">{v.options.find((o) => o.value === selection[v.key])?.label}</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {v.options.map((o) => {
              const active = selection[v.key] === o.value;
              return v.display === "swatch" ? (
                <button key={o.value} type="button" onClick={() => select(v.key, o.value)} aria-pressed={active} aria-label={o.label} title={o.label} className={cn("relative size-11 rounded-full border-2 p-0.5 transition", active ? "border-primary-800 dark:border-accent-400" : "border-border hover:border-neutral-400")}>
                  <span className="block size-full rounded-full ring-1 ring-black/10" style={{ backgroundColor: o.swatch }} />
                  {active && <Check className="absolute inset-0 m-auto size-4 text-white mix-blend-difference" aria-hidden />}
                </button>
              ) : (
                <button key={o.value} type="button" onClick={() => select(v.key, o.value)} aria-pressed={active} className={cn("min-h-11 rounded-lg border px-4 text-sm font-medium transition", active ? "border-primary-800 bg-primary-800 text-white" : "border-border bg-surface text-foreground hover:border-primary-600")}>
                  {o.label}
                  {o.price && o.price !== price && !active && <span className="ml-1.5 text-xs text-muted-foreground">{formatAED(o.price)}</span>}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      {/* Tier table */}
      {tiers && tiers.length > 0 && (
        <div>
          <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Package className="size-4 text-primary-700 dark:text-primary-200" aria-hidden /> Bulk pricing
          </p>
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-surface-muted text-xs text-muted-foreground">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left font-semibold">Quantity</th>
                  <th scope="col" className="px-3 py-2 text-right font-semibold">Price{perUnit(p.unit)}</th>
                  <th scope="col" className="px-3 py-2 text-right font-semibold">You save</th>
                </tr>
              </thead>
              <tbody>
                {[{ minQty: p.minOrderQty, pricePerUnit: price }, ...tiers].map((t, i, arr) => {
                  const nextMin = arr[i + 1]?.minQty;
                  const active = qty >= t.minQty && (!nextMin || qty < nextMin);
                  return (
                    <tr key={t.minQty} className={cn("border-t border-border", active && "bg-accent-50 font-semibold dark:bg-surface-muted")}>
                      <td className="px-3 py-2">
                        {t.minQty}
                        {nextMin ? `–${nextMin - 1}` : "+"} {unitLabel(p.unit, 2)}
                        {active && <span className="ml-2 text-[10px] font-bold uppercase text-accent-700">Current</span>}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">{formatAED(shown(t.pricePerUnit))}</td>
                      <td className="px-3 py-2 text-right text-success tabular-nums">{i === 0 ? "—" : `${discountPercent(t.pricePerUnit, price)}%`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quantity & totals */}
      <div ref={ctaRef} className="space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold text-foreground">Quantity ({unitLabel(p.unit, 2)})</p>
            <QuantityStepper value={qty} onChange={setQty} min={p.minOrderQty} step={p.stepQty} max={p.stock > 0 ? p.stock : undefined} unit={p.unit} />
          </div>
          <dl className="min-w-0 flex-1 text-right">
            <dt className="text-xs text-muted-foreground">Total</dt>
            <dd className="font-display text-2xl font-bold text-foreground tabular-nums">{formatAED(shown(total))}</dd>
            {p.weightKg ? <dd className="text-xs text-muted-foreground">Total weight ≈ {formatWeight(p.weightKg * qty)}</dd> : null}
          </dl>
        </div>
        {upcoming && (
          <p className="rounded-lg bg-primary-50 px-3 py-2 text-xs text-primary-800 dark:bg-surface-muted dark:text-primary-100">
            <Zap className="mr-1 inline size-3.5 text-accent-600" aria-hidden />
            Add {formatQty(upcoming.minQty - qty, p.unit)} more to pay {formatAED(shown(upcoming.pricePerUnit))}
            {perUnit(p.unit)}.{" "}
            <button type="button" onClick={() => setQty(upcoming.minQty)} className="font-bold underline">
              Update qty
            </button>
          </p>
        )}

        <p className={cn("flex items-center gap-2 text-sm font-medium", outOfStock ? "text-danger" : p.stock <= p.minOrderQty * 5 ? "text-accent-700" : "text-success")}>
          <span className={cn("size-2 rounded-full", outOfStock ? "bg-danger" : p.stock <= p.minOrderQty * 5 ? "bg-accent-500" : "bg-success")} aria-hidden />
          {outOfStock ? "Out of stock — expected in 7–10 days" : p.stock <= p.minOrderQty * 5 ? `Only ${formatQty(p.stock, p.unit)} left` : `In stock · ships in ${p.leadTimeDays} day${p.leadTimeDays > 1 ? "s" : ""}`}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="accent" size="lg" disabled={outOfStock} onClick={() => add()} leftIcon={<ShoppingCart className="size-5" aria-hidden />}>
            Add to Cart
          </Button>
          <Button variant="primary" size="lg" disabled={outOfStock} onClick={() => add(true)}>
            Buy Now
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => toggleWish(p.id, p.name)} aria-pressed={wished} leftIcon={<Heart className={cn("size-4", wished && "fill-danger text-danger")} aria-hidden />}>
            {wished ? "Saved" : "Wishlist"}
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={() => toggleCompare(p.id, p.name)} aria-pressed={compared} leftIcon={<GitCompareArrows className="size-4" aria-hidden />}>
            {compared ? "Comparing" : "Compare"}
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={share} leftIcon={<Share2 className="size-4" aria-hidden />}>
            Share
          </Button>
        </div>
        <Link href={`/bulk-enquiry?product=${p.slug}`} className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-primary-600 p-3.5 text-sm hover:bg-primary-50 dark:hover:bg-surface-muted">
          <span className="flex items-center gap-3">
            <FileText className="size-5 text-primary-700 dark:text-primary-200" aria-hidden />
            <span>
              <span className="block font-semibold text-foreground">Need a large quantity?</span>
              <span className="text-xs text-muted-foreground">Request a bulk quote — reply within 2 hours</span>
            </span>
          </span>
          <span className="text-xs font-bold text-primary-700 dark:text-primary-200">Get quote →</span>
        </Link>
      </div>

      <InlineCalculator materialType={p.materialType} unit={p.unit} attributes={p.attributes} packLitres={packLitres} onApply={(q) => setQty(Math.max(p.minOrderQty, q))} />

      <DeliveryChecker productId={p.id} />

      {/* Seller */}
      <div className="flex items-start gap-3 rounded-xl border border-border p-4 text-sm">
        <Warehouse className="mt-0.5 size-5 shrink-0 text-primary-700 dark:text-primary-200" aria-hidden />
        <div>
          <p className="font-semibold text-foreground">Sold by BuildMart Supply Pvt. Ltd.</p>
          <p className="text-xs text-muted-foreground">Ships from Al Quoz, Dubai warehouse · Authorised {brandName} distributor</p>
          <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-success">
            <BadgeCheck className="size-3.5" aria-hidden /> VAT invoice · Genuine product guarantee
          </p>
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div className={cn("fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-30 border-t border-border bg-surface/95 px-4 py-2.5 shadow-[0_-4px_16px_rgb(15_23_42/0.08)] backdrop-blur transition-transform lg:hidden", showSticky ? "translate-y-0" : "pointer-events-none translate-y-[200%]")} aria-hidden={!showSticky}>
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-bold leading-none text-foreground">
              {formatAED(shown(unitPrice))}
              <span className="ml-0.5 font-sans text-xs font-medium text-muted-foreground">{perUnit(p.unit)}</span>
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {formatQty(qty, p.unit)} · {formatAED(shown(total))}
            </p>
          </div>
          <Button variant="accent" disabled={outOfStock} onClick={() => add()} tabIndex={showSticky ? 0 : -1} leftIcon={<ShoppingCart className="size-4" aria-hidden />}>
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
