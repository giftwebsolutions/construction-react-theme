"use client";

import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import type { Facet, PriceRange, ProductQuery } from "@/types";
import { Checkbox } from "@/components/ui/Checkbox";
import { cn } from "@/lib/utils/cn";
import { formatSAR } from "@/lib/utils/format";
import { SINGLE_CHOICE, applyFacet, isSelected } from "./filter-state";

interface Props {
  facets: Facet[];
  priceRange: PriceRange;
  query: ProductQuery;
  onChange: (q: ProductQuery) => void;
  hidden?: string[];
}

/** Facet groups used by both the desktop sidebar (applies instantly) and the mobile sheet (staged). */
export function FilterPanel({ facets, priceRange, query, onChange, hidden = [] }: Props) {
  const visible = facets.filter((f) => !hidden.includes(f.key));
  const [first, ...rest] = visible;
  return (
    <div className="divide-y divide-border">
      {first && <FacetGroup facet={first} query={query} onChange={onChange} />}
      {priceRange.max > priceRange.min && <PriceFilter range={priceRange} query={query} onChange={onChange} />}
      {rest.map((f) => (
        <FacetGroup key={f.key} facet={f} query={query} onChange={onChange} />
      ))}
    </div>
  );
}

function FacetGroup({ facet, query, onChange }: { facet: Facet; query: ProductQuery; onChange: (q: ProductQuery) => void }) {
  const selectedCount = facet.options.filter((o) => isSelected(query, facet.key, o.value)).length;
  const [open, setOpen] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [term, setTerm] = useState("");
  const searchable = facet.options.length > 8;
  const filtered = term ? facet.options.filter((o) => o.label.toLowerCase().includes(term.toLowerCase())) : facet.options;
  const LIMIT = 6;
  const shown = expanded || term ? filtered : filtered.slice(0, LIMIT);
  const single = SINGLE_CHOICE.has(facet.key);
  const id = `facet-${facet.key.replace(/[^a-z0-9]/gi, "-")}`;

  return (
    <fieldset className="py-4">
      <legend className="w-full">
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls={id} className="flex w-full items-center justify-between gap-2 text-sm font-semibold text-foreground">
          <span>
            {facet.label}
            {selectedCount > 0 && <span className="ml-2 rounded-full bg-primary-800 px-1.5 py-0.5 text-[10px] font-bold text-white">{selectedCount}</span>}
          </span>
          <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} aria-hidden />
        </button>
      </legend>
      <div id={id} hidden={!open} className="mt-2">
        {searchable && (
          <div className="relative mb-2">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              type="search"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder={`Search ${facet.label.toLowerCase()}`}
              aria-label={`Search ${facet.label}`}
              className="h-9 w-full rounded-lg border border-border bg-surface pl-8 pr-2 text-sm focus:border-primary-600 focus:outline-none"
            />
          </div>
        )}
        <div className="space-y-0.5">
          {shown.map((o) => {
            const checked = isSelected(query, facet.key, o.value);
            return (
              <Checkbox
                key={o.value}
                inputType={single ? "radio" : "checkbox"}
                name={single ? id : undefined}
                label={o.label}
                count={o.count}
                checked={checked}
                disabled={!checked && o.count === 0}
                onChange={() => onChange(applyFacet(query, facet.key, o.value, !checked))}
              />
            );
          })}
          {term && filtered.length === 0 && <p className="py-2 text-xs text-muted-foreground">No matches</p>}
        </div>
        {!term && filtered.length > LIMIT && (
          <button type="button" onClick={() => setExpanded((e) => !e)} className="mt-1 text-xs font-semibold text-primary-700 hover:underline dark:text-primary-200">
            {expanded ? "Show less" : `+ ${filtered.length - LIMIT} more`}
          </button>
        )}
      </div>
    </fieldset>
  );
}

function PriceFilter({ range, query, onChange }: { range: PriceRange; query: ProductQuery; onChange: (q: ProductQuery) => void }) {
  const lo = query.minPrice ?? range.min;
  const hi = query.maxPrice ?? range.max;
  const [draft, setDraft] = useState<{ min: number; max: number } | null>(null);
  const cur = draft ?? { min: lo, max: hi };
  const step = Math.max(1, Math.round((range.max - range.min) / 100));
  const pct = (v: number) => ((v - range.min) / (range.max - range.min)) * 100;

  const commit = (v = cur) => {
    setDraft(null);
    const min = Math.max(range.min, Math.min(v.min, v.max));
    const max = Math.min(range.max, Math.max(v.min, v.max));
    onChange({ ...query, page: 1, minPrice: min > range.min ? min : undefined, maxPrice: max < range.max ? max : undefined });
  };

  const thumb =
    "pointer-events-none absolute inset-0 h-5 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-800 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary-800 [&::-moz-range-thumb]:bg-white";

  return (
    <fieldset className="py-4">
      <legend className="text-sm font-semibold text-foreground">Price (per unit)</legend>
      <div className="relative mt-4 h-5">
        <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-neutral-200 dark:bg-surface-muted" />
        <div className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary-800" style={{ left: `${pct(cur.min)}%`, right: `${100 - pct(cur.max)}%` }} />
        <input type="range" aria-label="Minimum price" min={range.min} max={range.max} step={step} value={cur.min} onChange={(e) => setDraft({ ...cur, min: Math.min(Number(e.target.value), cur.max) })} onPointerUp={() => commit()} onKeyUp={() => commit()} className={thumb} />
        <input type="range" aria-label="Maximum price" min={range.min} max={range.max} step={step} value={cur.max} onChange={(e) => setDraft({ ...cur, max: Math.max(Number(e.target.value), cur.min) })} onPointerUp={() => commit()} onKeyUp={() => commit()} className={thumb} />
      </div>
      <form
        className="mt-4 flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          commit({ min: Number(f.get("min")) || range.min, max: Number(f.get("max")) || range.max });
        }}
      >
        <label className="sr-only" htmlFor="pmin">Minimum price</label>
        <input id="pmin" name="min" key={`min-${lo}`} inputMode="numeric" defaultValue={lo} className="h-9 w-full min-w-0 rounded-lg border border-border bg-surface px-2 text-sm tabular-nums focus:border-primary-600 focus:outline-none" />
        <span className="text-muted-foreground">–</span>
        <label className="sr-only" htmlFor="pmax">Maximum price</label>
        <input id="pmax" name="max" key={`max-${hi}`} inputMode="numeric" defaultValue={hi} className="h-9 w-full min-w-0 rounded-lg border border-border bg-surface px-2 text-sm tabular-nums focus:border-primary-600 focus:outline-none" />
        <button type="submit" className="h-9 shrink-0 rounded-lg bg-primary-800 px-3 text-xs font-semibold text-white hover:bg-primary-600">Go</button>
      </form>
      <p className="mt-2 text-xs text-muted-foreground">
        {formatSAR(range.min)} – {formatSAR(range.max)}
      </p>
    </fieldset>
  );
}
