"use client";

import Link from "next/link";
import { useState } from "react";
import { Calculator } from "lucide-react";
import type { MaterialType, Unit } from "@/types";
import { formatNumber } from "@/lib/utils/format";
import { unitLabel } from "@/lib/utils/units";

const num = (s: string | number | string[] | undefined) => {
  const m = String(Array.isArray(s) ? s[0] : (s ?? "")).match(/[\d.]+/);
  return m ? Number(m[0]) : NaN;
};

interface Cfg {
  label: string;
  input: string;
  hint: string;
  compute: (v: number) => { qty: number; text: string } | null;
  full?: string;
}

/** Quick in-page estimator: returns a quantity in the product's own unit. */
export function InlineCalculator({ materialType, unit, attributes, packLitres, onApply }: { materialType: MaterialType; unit: Unit; attributes: Record<string, string | number | string[]>; packLitres?: number; onApply: (qty: number) => void }) {
  const [value, setValue] = useState("");
  const cfg = config(materialType, unit, attributes, packLitres);
  if (!cfg) return null;
  const v = Number(value);
  const res = v > 0 ? cfg.compute(v) : null;

  return (
    <div className="rounded-xl bg-accent-50 p-4 ring-1 ring-accent-100 dark:bg-surface-muted dark:ring-border">
      <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Calculator className="size-4 text-accent-700" aria-hidden /> {cfg.label}
      </p>
      <div className="mt-3 flex items-center gap-2">
        <label htmlFor="calc-in" className="sr-only">{cfg.input}</label>
        <input id="calc-in" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value.replace(/[^\d.]/g, ""))} placeholder={cfg.input} className="h-11 min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 text-base focus:border-primary-600 focus:outline-none sm:text-sm" />
        <button type="button" disabled={!res} onClick={() => res && onApply(res.qty)} className="h-11 shrink-0 rounded-lg bg-primary-800 px-4 text-sm font-semibold text-white hover:bg-primary-600 disabled:opacity-40">
          Use {res ? `${formatNumber(res.qty)} ${unitLabel(unit, res.qty)}` : "qty"}
        </button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground" aria-live="polite">{res ? res.text : cfg.hint}</p>
      {cfg.full && (
        <Link href={cfg.full} className="mt-1 inline-block text-xs font-semibold text-primary-700 hover:underline dark:text-primary-200">
          Detailed calculator →
        </Link>
      )}
    </div>
  );
}

function config(type: MaterialType, unit: Unit, attrs: Record<string, string | number | string[]>, packLitres?: number): Cfg | null {
  if (type === "tiles" && unit === "box") {
    const cov = num(attrs.coveragePerBox);
    if (!cov) return null;
    return {
      label: "How many boxes do I need?",
      input: "Floor / wall area in sq ft",
      hint: `Each box covers ${cov} sq ft. We add 10% for cutting wastage.`,
      full: "/calculators/tiles",
      compute: (a) => {
        const qty = Math.ceil((a * 1.1) / cov);
        return { qty, text: `${formatNumber(a * 1.1, 1)} sq ft incl. 10% wastage → ${qty} boxes` };
      },
    };
  }
  if (type === "tiles" && unit === "sqft")
    return { label: "Area to cover", input: "Area in sq ft", hint: "We add 5% for cutting and edge wastage.", compute: (a) => ({ qty: Math.ceil(a * 1.05), text: `${Math.ceil(a * 1.05)} sq ft incl. 5% wastage` }) };
  if (type === "paint" && packLitres) {
    const cov = num(attrs.coverage) || 100;
    const coats = num(attrs.coats) || 2;
    return {
      label: "How much paint do I need?",
      input: "Wall area in sq ft",
      hint: `Coverage ≈ ${cov} sq ft/L per coat · ${coats} coats`,
      full: "/calculators/paint",
      compute: (a) => {
        const litres = (a * coats) / cov;
        const qty = Math.max(1, Math.ceil(litres / packLitres));
        return { qty, text: `≈ ${formatNumber(litres, 1)} L for ${coats} coats → ${qty} × ${packLitres} L pack` };
      },
    };
  }
  if (type === "cement" && unit === "bag")
    return { label: "Cement for your build", input: "Built-up area in sq ft", hint: "Thumb rule ≈ 0.4 bag per sq ft for an RCC-framed house.", full: "/calculators/cement", compute: (a) => ({ qty: Math.ceil(a * 0.4), text: `≈ ${Math.ceil(a * 0.4)} bags for ${formatNumber(a)} sq ft` }) };
  if (type === "steel" && unit === "kg")
    return { label: "Steel for your build", input: "Built-up area in sq ft", hint: "Thumb rule ≈ 4 kg TMT per sq ft (G+1 residential).", full: "/calculators/steel", compute: (a) => ({ qty: Math.ceil((a * 4) / 50) * 50, text: `≈ ${formatNumber(a * 4)} kg (${formatNumber((a * 4) / 1000, 2)} tonne)` }) };
  if (type === "bricks" && unit === "piece") {
    const size = String(attrs.size ?? "");
    const dims = size.match(/(\d+)×(\d+)×(\d+)/);
    if (!dims) return null;
    const [l, , h] = [Number(dims[1]) / 1000, Number(dims[2]) / 1000, Number(dims[3]) / 1000];
    const faceSqft = (l + 0.01) * (h + 0.01) * 10.7639;
    return { label: "Pieces for a wall", input: "Wall face area in sq ft", hint: "Single-leaf wall, 10 mm joints, 5% wastage.", full: "/calculators/bricks", compute: (a) => ({ qty: Math.ceil((a / faceSqft) * 1.05), text: `≈ ${Math.ceil((a / faceSqft) * 1.05)} pieces for ${formatNumber(a)} sq ft of wall` }) };
  }
  if (type === "aggregates" && unit === "tonne")
    return { label: "Quantity for your build", input: "Built-up area in sq ft", hint: "≈ 1.8 cft sand / 1.35 cft aggregate per sq ft; 1 tonne ≈ 22 cft.", full: "/calculators/sand", compute: (a) => ({ qty: Math.ceil((a * 1.6) / 22), text: `≈ ${formatNumber(a * 1.6)} cft → ${Math.ceil((a * 1.6) / 22)} tonnes` }) };
  if (type === "wood" && unit === "sqft")
    return { label: "Sheets needed", input: "Number of 8×4 ft sheets", hint: "Priced per sq ft · 1 sheet = 32 sq ft.", compute: (n) => ({ qty: Math.ceil(n) * 32, text: `${Math.ceil(n)} sheets = ${Math.ceil(n) * 32} sq ft` }) };
  return null;
}
