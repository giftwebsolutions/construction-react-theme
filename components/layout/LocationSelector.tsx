"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, MapPin, Search } from "lucide-react";
import { useDeliveryLocation } from "@/store/ui";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { EMIRATES, SERVICE_AREAS, areaLabel } from "@/lib/data/locations";
import { cn } from "@/lib/utils/cn";
import { toast } from "@/store/toast";

const DEFAULT_LABEL = "Riyadh, Kingdom of Saudi Arabia"; // Default label for the delivery location

export function LocationSelector({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  const hydrated = useHydrated();
  const { areaId, label, setLocation } = useDeliveryLocation();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return EMIRATES.map((emirate) => ({
      emirate,
      areas: SERVICE_AREAS.filter((a) => a.emirate === emirate && (!needle || `${a.area} ${a.emirate}`.toLowerCase().includes(needle))),
    })).filter((g) => g.areas.length);
  }, [q]);

  const choose = (a: (typeof SERVICE_AREAS)[number]) => {
    setLocation(a.id, areaLabel(a));
    setOpen(false);
    toast({ title: `Delivering to ${a.area}`, description: "Delivery charges and dates updated for your location." });
  };

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          setQ("");
        }}
        aria-expanded={open}
        aria-controls={id}
        className={cn("inline-flex items-center gap-1.5 rounded-md py-1 text-xs font-medium", tone === "dark" ? "text-primary-100 hover:text-white" : "text-muted-foreground hover:text-foreground")}
      >
        <MapPin className="size-3.5 text-accent-500" aria-hidden />
        <span>
          Deliver to <strong className={tone === "dark" ? "text-white" : "text-foreground"}>{hydrated ? label : DEFAULT_LABEL}</strong>
        </span>
        <ChevronDown className="size-3.5" aria-hidden />
      </button>
      {open && (
        <div id={id} className="absolute left-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] animate-fade-in rounded-xl border border-border bg-surface p-4 text-foreground shadow-card-hover">
          <p className="text-sm font-semibold">Choose your delivery area</p>
          <p className="mt-1 text-xs text-muted-foreground">We deliver across all seven emirates. Charges and ETA depend on your site area.</p>
          <label className="relative mt-3 block">
            <span className="sr-only">Search area</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search area or emirate"
              className="h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-sm focus:border-primary-600 focus:outline-none focus:ring-3 focus:ring-primary-600/15"
            />
          </label>
          <div className="mt-2 max-h-72 overflow-y-auto overscroll-contain">
            {groups.length === 0 && <p className="px-2 py-4 text-center text-xs text-muted-foreground">No matching area. Request a bulk quote for special arrangements.</p>}
            {groups.map((g) => (
              <div key={g.emirate} role="group" aria-label={g.emirate} className="py-1">
                <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{g.emirate}</p>
                {g.areas.map((a) => (
                  <button key={a.id} type="button" onClick={() => choose(a)} className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm hover:bg-surface-muted">
                    {a.area}
                    {hydrated && a.id === areaId && <Check className="size-4 text-accent-600" aria-label="Selected" />}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
