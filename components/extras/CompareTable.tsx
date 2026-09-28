"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { GitCompareArrows, ShoppingCart, X } from "lucide-react";
import type { Product } from "@/types";
import { useCompare, COMPARE_LIMIT } from "@/store/lists";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { useAddToCart } from "@/lib/hooks/use-add-to-cart";
import { attributeLabel } from "@/lib/data/categories";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Price } from "@/components/ui/Price";
import { RatingPill } from "@/components/ui/Rating";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils/cn";

const val = (v: Product["attributes"][string] | undefined) => (v === undefined ? "—" : Array.isArray(v) ? v.join(", ") : String(v));

export function CompareTable() {
  const hydrated = useHydrated();
  const { ids, remove, clear } = useCompare();
  const [data, setData] = useState<{ key: string; products: Product[]; brands: Record<string, string> } | null>(null);
  const [diffOnly, setDiffOnly] = useState(false);
  const addToCart = useAddToCart();
  const key = ids.join(",");

  useEffect(() => {
    if (!hydrated || !key) return;
    let cancel = false;
    fetch(`/api/products?ids=${key}&full=1`).then((r) => r.json()).then((d) => !cancel && setData({ key, ...d }));
    return () => {
      cancel = true;
    };
  }, [hydrated, key]);

  if (!hydrated) return <Skeleton className="h-96 rounded-xl" />;
  if (!ids.length)
    return (
      <div className="rounded-2xl border border-border bg-surface">
        <EmptyState icon={<GitCompareArrows aria-hidden />} title="Nothing to compare yet" description={`Tap the compare icon on up to ${COMPARE_LIMIT} products to see specs side by side.`} actions={<ButtonLink href="/products">Browse products</ButtonLink>} />
      </div>
    );
  const products = (data?.products ?? []).filter((p) => ids.includes(p.id));
  if (!products.length) return <Skeleton className="h-96 rounded-xl" />;

  const keys = [...new Set(products.flatMap((p) => Object.keys(p.attributes)))];
  const rows: { label: string; values: string[] }[] = [
    { label: "Brand", values: products.map((p) => data!.brands[p.brandId] ?? "") },
    { label: "Unit", values: products.map((p) => p.unit) },
    { label: "Min. order", values: products.map((p) => `${p.minOrderQty} ${p.unit}`) },
    { label: "VAT", values: products.map((p) => `${p.vatRate}%`) },
    { label: "Delivery", values: products.map((p) => (p.deliveryType === "both" ? "Parcel / Truck" : p.deliveryType === "truck" ? "Truck" : "Parcel")) },
    { label: "Lead time", values: products.map((p) => `${p.leadTimeDays} days`) },
    { label: "Certifications", values: products.map((p) => p.certifications?.join(", ") || "—") },
    ...keys.map((k) => ({ label: attributeLabel(k), values: products.map((p) => val(p.attributes[k])) })),
  ];
  const shown = diffOnly ? rows.filter((r) => new Set(r.values).size > 1) : rows;

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" checked={diffOnly} onChange={(e) => setDiffOnly(e.target.checked)} className="size-4.5 accent-primary-800" /> Show differences only
        </label>
        <Button variant="ghost" size="sm" onClick={clear}>Clear all</Button>
      </div>
      <div className="-mx-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:px-0">
        <table className="w-full min-w-[640px] border-separate border-spacing-0 overflow-hidden rounded-xl border border-border bg-surface text-sm">
          <thead>
            <tr>
              <th scope="col" className="sticky left-0 z-10 w-36 border-b border-border bg-surface p-3 text-left align-bottom text-xs font-semibold uppercase text-muted-foreground">{products.length} products</th>
              {products.map((p) => (
                <th key={p.id} scope="col" className="w-60 border-b border-l border-border p-3 text-left align-top font-normal">
                  <div className="relative">
                    <button type="button" onClick={() => remove(p.id)} className="absolute -right-1 -top-1 z-10 flex size-8 items-center justify-center rounded-full bg-surface text-muted-foreground shadow ring-1 ring-border hover:text-danger" aria-label={`Remove ${p.name}`}><X className="size-4" aria-hidden /></button>
                    <Link href={`/product/${p.slug}`} className="relative block aspect-square w-full overflow-hidden rounded-lg bg-surface-muted"><Image src={p.images[0]!} alt="" fill sizes="240px" className="object-cover" /></Link>
                    <Link href={`/product/${p.slug}`} className="mt-2 line-clamp-2 text-sm font-semibold text-foreground hover:text-primary-700">{p.name}</Link>
                    <RatingPill value={p.rating} count={p.reviewCount} className="mt-1" />
                    <Price price={p.price} mrp={p.mrp} unit={p.unit} size="sm" className="mt-2" />
                    <Button variant="accent" size="sm" fullWidth className="mt-3" disabled={p.stock <= 0} leftIcon={<ShoppingCart className="size-4" aria-hidden />} onClick={() => addToCart(p, { brandName: data!.brands[p.brandId] ?? "", quantity: p.minOrderQty })}>
                      {p.stock <= 0 ? "Out of stock" : "Add to cart"}
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => {
              const differs = new Set(r.values).size > 1;
              return (
                <tr key={r.label}>
                  <th scope="row" className="sticky left-0 z-10 border-b border-border bg-surface p-3 text-left text-xs font-semibold text-muted-foreground">{r.label}</th>
                  {r.values.map((v, i) => (
                    <td key={i} className={cn("border-b border-l border-border p-3 capitalize text-foreground", differs && "bg-accent-50/60 dark:bg-surface-muted")}>{v}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
