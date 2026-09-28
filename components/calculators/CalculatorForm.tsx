"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Info, ShoppingCart } from "lucide-react";
import {
  BRICK_SIZES,
  CONCRETE_MIXES,
  SAND_USES,
  STEEL_BY_ELEMENT,
  estimateBricks,
  estimateCementByArea,
  estimateConcrete,
  estimatePaint,
  estimatePlaster,
  estimateSteelBars,
  estimateSteelByVolume,
  estimateTiles,
  packSplit,
  type BrickSize,
  type CalculatorType,
  type ConcreteGrade,
  type EstimateLine,
  type SandUse,
  type StructuralElement,
} from "@/lib/utils/calculators";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { formatNumber } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

const SHOP: Record<CalculatorType, { label: string; href: string }[]> = {
  cement: [{ label: "Cement", href: "/category/cement-and-concrete" }, { label: "M-Sand", href: "/category/sand-and-aggregates?sub=m-sand" }, { label: "Aggregate", href: "/category/sand-and-aggregates?sub=aggregate" }],
  bricks: [{ label: "Bricks & Blocks", href: "/category/bricks-and-blocks" }, { label: "Cement", href: "/category/cement-and-concrete" }],
  tiles: [{ label: "Tiles", href: "/category/tiles-and-flooring" }, { label: "Tile Adhesive", href: "/category/waterproofing-and-chemicals?sub=tile-adhesive" }],
  paint: [{ label: "Paints", href: "/category/paints-and-coatings" }, { label: "Putty", href: "/category/paints-and-coatings?sub=putty" }],
  steel: [{ label: "TMT Bars", href: "/category/steel-and-tmt?sub=tmt-bars" }, { label: "Binding Wire", href: "/category/steel-and-tmt?sub=binding-wire" }],
  sand: [{ label: "Sand", href: "/category/sand-and-aggregates" }, { label: "Cement", href: "/category/cement-and-concrete" }],
};

const n = (s: string) => {
  const v = Number(s);
  return Number.isFinite(v) && v > 0 ? v : 0;
};

function Field({ label, value, onChange, suffix, hint }: { label: string; value: string; onChange: (v: string) => void; suffix?: string; hint?: string }) {
  return (
    <Input
      label={label}
      inputMode="decimal"
      value={value}
      hint={hint}
      onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ""))}
      rightSlot={suffix ? <span className="pr-3 text-xs font-medium text-muted-foreground">{suffix}</span> : undefined}
    />
  );
}

export function CalculatorForm({ type }: { type: CalculatorType }) {
  const [a, setA] = useState<Record<string, string>>({
    volume: "10", area: "1200", grade: "M20", mode: "volume",
    length: "10", height: "3", thickness: "0.23", brick: "standard",
    tileArea: "500", coverage: "15.5", wastage: "10",
    paintArea: "2400", paintCoverage: "120", coats: "2",
    steelMode: "element", element: "slab", steelVolume: "12", dia: "12", barLength: "600",
    sandArea: "100", use: "plaster12",
  });
  const set = (k: string) => (v: string) => setA((s) => ({ ...s, [k]: v }));

  let lines: EstimateLine[] = [];
  let extra: React.ReactNode = null;
  let inputs: React.ReactNode = null;

  if (type === "cement") {
    inputs = (
      <>
        <div className="grid grid-cols-2 gap-2 sm:col-span-2" role="radiogroup" aria-label="Estimate by">
          {[["volume", "Concrete volume"], ["area", "Built-up area"]].map(([v, l]) => (
            <button key={v} type="button" role="radio" aria-checked={a.mode === v} onClick={() => set("mode")(v!)} className={cn("h-11 rounded-lg border text-sm font-semibold", a.mode === v ? "border-primary-800 bg-primary-800 text-white" : "border-border bg-surface text-foreground")}>{l}</button>
          ))}
        </div>
        {a.mode === "volume" ? (
          <>
            <Field label="Concrete volume" value={a.volume!} onChange={set("volume")} suffix="m³" hint="Length × width × depth in metres" />
            <Select label="Concrete grade" value={a.grade} onChange={(e) => set("grade")(e.target.value)} options={Object.entries(CONCRETE_MIXES).map(([k, v]) => ({ value: k, label: v.label }))} />
          </>
        ) : (
          <Field label="Built-up area" value={a.area!} onChange={set("area")} suffix="sq ft" hint="Total floor area of the building" />
        )}
      </>
    );
    lines = a.mode === "volume" ? estimateConcrete(n(a.volume!), a.grade as ConcreteGrade) : estimateCementByArea(n(a.area!));
  }

  if (type === "bricks") {
    inputs = (
      <>
        <Field label="Wall length" value={a.length!} onChange={set("length")} suffix="m" />
        <Field label="Wall height" value={a.height!} onChange={set("height")} suffix="m" />
        <Select label="Wall thickness" value={a.thickness} onChange={(e) => set("thickness")(e.target.value)} options={[{ value: "0.1", label: "4\" (100 mm) partition" }, { value: "0.15", label: "6\" (150 mm)" }, { value: "0.23", label: "9\" (230 mm) external" }]} />
        <Select label="Brick / block" value={a.brick} onChange={(e) => set("brick")(e.target.value)} options={Object.entries(BRICK_SIZES).map(([k, v]) => ({ value: k, label: v.label }))} />
      </>
    );
    lines = estimateBricks(n(a.length!), n(a.height!), n(a.thickness!), a.brick as BrickSize);
  }

  if (type === "tiles") {
    inputs = (
      <>
        <Field label="Area to tile" value={a.tileArea!} onChange={set("tileArea")} suffix="sq ft" />
        <Field label="Coverage per box" value={a.coverage!} onChange={set("coverage")} suffix="sq ft" hint="Printed on the box, e.g. 600×600 × 4 pcs = 15.5" />
        <Select label="Laying pattern" value={a.wastage} onChange={(e) => set("wastage")(e.target.value)} options={[{ value: "10", label: "Straight (10% wastage)" }, { value: "15", label: "Diagonal / herringbone (15%)" }, { value: "7", label: "Large-format, few cuts (7%)" }]} />
      </>
    );
    lines = n(a.coverage!) ? estimateTiles(n(a.tileArea!), n(a.coverage!), n(a.wastage!)) : [];
  }

  if (type === "paint") {
    inputs = (
      <>
        <Field label="Wall area" value={a.paintArea!} onChange={set("paintArea")} suffix="sq ft" hint="Tip: carpet area × 3.5 ≈ wall area for a typical room" />
        <Field label="Coverage per coat" value={a.paintCoverage!} onChange={set("paintCoverage")} suffix="sq ft/L" />
        <Select label="Number of coats" value={a.coats} onChange={(e) => set("coats")(e.target.value)} options={[{ value: "1", label: "1 coat (repaint, same colour)" }, { value: "2", label: "2 coats (recommended)" }, { value: "3", label: "3 coats (dark to light)" }]} />
      </>
    );
    lines = n(a.paintCoverage!) ? estimatePaint(n(a.paintArea!), n(a.paintCoverage!), n(a.coats!)) : [];
    const litres = lines[0]?.value ?? 0;
    if (litres)
      extra = (
        <p className="mt-3 text-sm text-muted-foreground">
          Buy as: <strong className="text-foreground">{packSplit(litres).map((p) => `${p.count} × ${p.size} L`).join(" + ")}</strong>
        </p>
      );
  }

  if (type === "steel") {
    inputs = (
      <>
        <div className="grid grid-cols-2 gap-2 sm:col-span-2" role="radiogroup" aria-label="Estimate by">
          {[["element", "By RCC element"], ["bars", "By bar length"]].map(([v, l]) => (
            <button key={v} type="button" role="radio" aria-checked={a.steelMode === v} onClick={() => set("steelMode")(v!)} className={cn("h-11 rounded-lg border text-sm font-semibold", a.steelMode === v ? "border-primary-800 bg-primary-800 text-white" : "border-border bg-surface text-foreground")}>{l}</button>
          ))}
        </div>
        {a.steelMode === "element" ? (
          <>
            <Select label="Element" value={a.element} onChange={(e) => set("element")(e.target.value)} options={Object.entries(STEEL_BY_ELEMENT).map(([k, v]) => ({ value: k, label: v.label }))} />
            <Field label="Concrete volume" value={a.steelVolume!} onChange={set("steelVolume")} suffix="m³" />
          </>
        ) : (
          <>
            <Select label="Bar diameter" value={a.dia} onChange={(e) => set("dia")(e.target.value)} options={[8, 10, 12, 16, 20, 25, 32].map((d) => ({ value: String(d), label: `${d} mm` }))} />
            <Field label="Total running length" value={a.barLength!} onChange={set("barLength")} suffix="m" />
          </>
        )}
      </>
    );
    lines = a.steelMode === "element" ? estimateSteelByVolume(n(a.steelVolume!), a.element as StructuralElement) : estimateSteelBars(n(a.dia!), n(a.barLength!));
  }

  if (type === "sand") {
    inputs = (
      <>
        <Field label="Area" value={a.sandArea!} onChange={set("sandArea")} suffix="m²" hint="1 m² ≈ 10.76 sq ft" />
        <Select label="Work type" value={a.use} onChange={(e) => set("use")(e.target.value)} options={Object.entries(SAND_USES).map(([k, v]) => ({ value: k, label: v.label }))} />
      </>
    );
    lines = estimatePlaster(n(a.sandArea!), a.use as SandUse);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <form onSubmit={(e) => e.preventDefault()} className="grid gap-4 rounded-xl border border-border bg-surface p-5 shadow-card sm:grid-cols-2 sm:p-6">
        {inputs}
      </form>
      <aside className="rounded-xl bg-primary-900 p-5 text-white shadow-card sm:p-6" aria-live="polite">
        <p className="text-xs font-bold uppercase tracking-widest text-accent-400">Estimate</p>
        {lines.length ? (
          <dl className="mt-4 space-y-3">
            {lines.map((l, i) => (
              <div key={l.label + i} className="flex items-baseline justify-between gap-3 border-b border-white/10 pb-3 last:border-0">
                <dt className="text-sm text-primary-100">
                  {l.label}
                  {l.hint && <span className="block text-[11px] text-primary-200/80">{l.hint}</span>}
                </dt>
                <dd className="text-right font-display text-2xl font-bold tabular-nums">
                  {formatNumber(l.value)} <span className="text-xs font-medium text-primary-200">{l.unit}</span>
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="mt-4 text-sm text-primary-200">Enter your measurements to see the estimate.</p>
        )}
        <div className="[&_strong]:text-white [&_p]:text-primary-200">{extra}</div>
        <p className="mt-4 flex items-start gap-2 text-xs text-primary-200"><Info className="mt-0.5 size-3.5 shrink-0" aria-hidden /> Estimates use standard thumb rules. Confirm final quantities with your site engineer.</p>
        <div className="mt-5 grid gap-2">
          {SHOP[type].map((s, i) => (
            <Link key={s.href} href={s.href} className={cn("flex h-11 items-center justify-center gap-2 rounded-lg text-sm font-semibold", i === 0 ? "bg-accent-500 text-neutral-900 hover:bg-accent-400" : "border border-white/25 hover:bg-white/10")}>
              {i === 0 && <ShoppingCart className="size-4" aria-hidden />} Shop {s.label} {i > 0 && <ArrowRight className="size-4" aria-hidden />}
            </Link>
          ))}
        </div>
      </aside>
    </div>
  );
}
