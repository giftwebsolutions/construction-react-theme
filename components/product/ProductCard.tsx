"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Bell, GitCompareArrows, Heart, ShoppingCart, Truck } from "lucide-react";
import type { ProductCardData } from "@/lib/data/card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { RatingPill } from "@/components/ui/Rating";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils/cn";
import { discountPercent, formatSAR } from "@/lib/utils/format";
import { bestTier } from "@/lib/utils/pricing";
import { perUnit, unitLabel } from "@/lib/utils/units";
import { useAddToCart } from "@/lib/hooks/use-add-to-cart";
import { useCompareToggle, useWishlistToggle } from "@/lib/hooks/use-toggle-lists";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { useCompare, useWishlist } from "@/store/lists";

export const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA4IDgnPjxyZWN0IHdpZHRoPSc4JyBoZWlnaHQ9JzgnIGZpbGw9JyNlNmVkZjgnLz48L3N2Zz4=";

export interface ProductCardProps {
  data: ProductCardData;
  variant?: "grid" | "list";
  priority?: boolean;
  className?: string;
}

export function ProductCard({ data, variant = "grid", priority, className }: ProductCardProps) {
  const { product: p, brand, chips } = data;
  const [qty, setQty] = useState(p.minOrderQty);
  const imgRef = useRef<HTMLDivElement>(null);
  const addToCart = useAddToCart();
  const toggleWish = useWishlistToggle();
  const toggleCompare = useCompareToggle();
  const hydrated = useHydrated();
  const wished = useWishlist((s) => s.ids.includes(p.id)) && hydrated;
  const compared = useCompare((s) => s.ids.includes(p.id)) && hydrated;

  const off = discountPercent(p.price, p.mrp);
  const tier = bestTier(p.tieredPricing);
  const outOfStock = p.stock <= 0;
  const lowStock = !outOfStock && p.stock <= p.minOrderQty * 5;
  const href = `/product/${p.slug}`;
  const isList = variant === "list";

  const badges = (
    <div className="pointer-events-none absolute left-2 top-2 z-10 flex flex-col items-start gap-1">
      {p.isNew && <Badge tone="accent">New</Badge>}
      {off >= 5 && <Badge tone="danger">-{off}%</Badge>}
      {p.isBestSeller && <Badge tone="dark">Best Seller</Badge>}
      {p.certifications?.includes("ISI") && <Badge tone="outline">ISI</Badge>}
    </div>
  );

  const iconBtn = "flex size-9 items-center justify-center rounded-full bg-surface/95 shadow-sm ring-1 ring-border transition-colors hover:text-primary-700";
  const actions = (
    <div className="absolute right-2 top-2 z-10 flex flex-col gap-1.5">
      <button type="button" onClick={() => toggleWish(p.id, p.name)} aria-pressed={wished} aria-label={wished ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`} className={cn(iconBtn, wished ? "text-danger" : "text-neutral-500")}>
        <Heart className={cn("size-4.5", wished && "fill-current")} aria-hidden />
      </button>
      <button type="button" onClick={() => toggleCompare(p.id, p.name)} aria-pressed={compared} aria-label={compared ? `Remove ${p.name} from compare` : `Add ${p.name} to compare`} className={cn(iconBtn, compared ? "bg-primary-800 text-white ring-primary-800 hover:text-white" : "text-neutral-500")}>
        <GitCompareArrows className="size-4.5" aria-hidden />
      </button>
    </div>
  );

  const image = (
    <div ref={imgRef} className={cn("relative overflow-hidden bg-surface-muted", isList ? "aspect-square w-32 shrink-0 rounded-lg sm:w-48" : "aspect-square rounded-t-xl")}>
      <Link href={href} tabIndex={-1} aria-hidden className="block size-full">
        <Image src={p.images[0]!} alt="" fill sizes={isList ? "192px" : "(min-width:1280px) 280px, (min-width:768px) 33vw, 50vw"} priority={priority} placeholder="blur" blurDataURL={BLUR_DATA_URL} className="object-cover transition-opacity duration-300 group-hover:opacity-0" />
        {p.images[1] && <Image src={p.images[1]} alt="" fill sizes={isList ? "192px" : "(min-width:1280px) 280px, 50vw"} className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100" />}
      </Link>
      {outOfStock && <span className="absolute inset-x-0 bottom-0 bg-neutral-900/75 py-1.5 text-center text-xs font-semibold text-white">Out of stock</span>}
    </div>
  );

  const body = (
    <>
      <Link href={`/brand/${brand.slug}`} className="text-xs font-semibold uppercase tracking-wide text-primary-700 hover:underline dark:text-primary-200">
        {brand.name}
      </Link>
      <h3 className={cn("mt-1 text-sm font-semibold leading-snug text-foreground", isList ? "line-clamp-2 sm:text-base" : "line-clamp-2 min-h-[2.5rem]")}>
        <Link href={href} className="hover:text-primary-700 dark:hover:text-primary-200">
          {p.name}
        </Link>
      </h3>
      {chips.length > 0 && (
        <p className="mt-1.5 truncate text-xs text-muted-foreground" title={chips.join(" · ")}>
          {chips.join(" · ")}
        </p>
      )}
      {isList && <p className="mt-2 line-clamp-2 hidden text-sm text-muted-foreground sm:block">{p.shortDescription}</p>}
      <div className="mt-2 flex items-center gap-2">
        <RatingPill value={p.rating} count={p.reviewCount} />
        {p.deliveryType !== "parcel" && (
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground" title="Truck delivery to site">
            <Truck className="size-3.5" aria-hidden /> Site delivery
          </span>
        )}
      </div>
      <Price price={p.price} mrp={p.mrp} unit={p.unit} size="md" className="mt-2.5" />
      <p className="mt-1 min-h-4 text-[11px] font-medium text-success">
        {tier ? `${formatSAR(tier.pricePerUnit)}${perUnit(p.unit)} for ${tier.minQty}+ ${unitLabel(p.unit, tier.minQty)}` : lowStock ? <span className="text-accent-700">Only a few left</span> : null}
      </p>
    </>
  );

  const buy = outOfStock ? (
    <Button variant="outline" size="md" fullWidth leftIcon={<Bell className="size-4" aria-hidden />} onClick={() => toggleWish(p.id, p.name)}>
      Notify me
    </Button>
  ) : (
    <div className="flex flex-col gap-2">
      <QuantityStepper value={qty} onChange={setQty} min={p.minOrderQty} step={p.stepQty} size="sm" fullWidth label={`Quantity for ${p.name}`} />
      <Button
        variant="accent"
        size="sm"
        fullWidth
        className="h-10"
        leftIcon={<ShoppingCart className="size-4 shrink-0" aria-hidden />}
        onClick={() => addToCart(p, { brandName: brand.name, quantity: qty, sourceEl: imgRef.current })}
        aria-label={`Add ${qty} ${unitLabel(p.unit, qty)} of ${p.name} to cart`}
      >
        Add to Cart
      </Button>
    </div>
  );

  if (isList) {
    return (
      <article className={cn("group relative flex gap-4 rounded-xl border border-border bg-surface p-3 shadow-card transition-shadow hover:shadow-card-hover sm:p-4", className)}>
        <div className="relative">
          {image}
          {badges}
        </div>
        <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:gap-6">
          <div className="min-w-0 flex-1">{body}</div>
          <div className="mt-3 flex flex-col gap-2 sm:mt-0 sm:w-56 sm:justify-end">
            {buy}
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="flex-1" onClick={() => toggleWish(p.id, p.name)} leftIcon={<Heart className={cn("size-4", wished && "fill-danger text-danger")} aria-hidden />}>
                {wished ? "Saved" : "Save"}
              </Button>
              <Button variant="ghost" size="sm" className="flex-1" onClick={() => toggleCompare(p.id, p.name)} leftIcon={<GitCompareArrows className="size-4" aria-hidden />}>
                {compared ? "Added" : "Compare"}
              </Button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={cn("group relative flex h-full flex-col rounded-xl border border-border bg-surface shadow-card transition-shadow duration-200 hover:shadow-card-hover", className)}>
      {image}
      {badges}
      {actions}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {body}
        <div className="mt-auto pt-3">{buy}</div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton({ variant = "grid" }: { variant?: "grid" | "list" }) {
  if (variant === "list")
    return (
      <div className="flex gap-4 rounded-xl border border-border bg-surface p-4">
        <Skeleton className="aspect-square w-32 rounded-lg sm:w-48" />
        <div className="flex-1 space-y-2.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-6 w-28" />
        </div>
      </div>
    );
  return (
    <div className="flex flex-col rounded-xl border border-border bg-surface">
      <Skeleton className="aspect-square w-full rounded-b-none rounded-t-xl" />
      <div className="space-y-2.5 p-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-28" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 flex-1" />
        </div>
      </div>
    </div>
  );
}

export function ProductGrid({ cards, view = "grid", className, priorityCount = 0 }: { cards: ProductCardData[]; view?: "grid" | "list"; className?: string; priorityCount?: number }) {
  if (view === "list")
    return (
      <div className={cn("flex flex-col gap-3", className)}>
        {cards.map((c, i) => (
          <ProductCard key={c.product.id} data={c} variant="list" priority={i < priorityCount} />
        ))}
      </div>
    );
  return (
    <div className={cn("grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4", className)}>
      {cards.map((c, i) => (
        <ProductCard key={c.product.id} data={c} priority={i < priorityCount} />
      ))}
    </div>
  );
}
