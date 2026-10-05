"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, MapPin, Truck, XCircle } from "lucide-react";
import type { DeliveryEstimate } from "@/types";
import { useDeliveryLocation } from "@/store/ui";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { formatSAR } from "@/lib/utils/format";
import { DEFAULT_AREA_ID, SAUDI_REGIONS, SERVICE_AREAS, areaLabel, lookupArea } from "@/lib/data/locations";

export function DeliveryChecker({ productId }: { productId: string }) {
  const hydrated = useHydrated();
  const { areaId, setLocation } = useDeliveryLocation();
  const [result, setResult] = useState<DeliveryEstimate | null>(null);
  const [loading, setLoading] = useState(false);

  const check = async (id: string) => {
    setLoading(true);
    const r: DeliveryEstimate = await fetch(`/api/delivery?area=${id}&productId=${productId}`).then((x) => x.json());
    setResult(r);
    setLoading(false);
  };

  // Estimate for the saved area once hydrated
  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    fetch(`/api/delivery?area=${areaId}&productId=${productId}`)
      .then((x) => x.json())
      .then((r) => !cancelled && setResult(r));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, productId]);

  return (
    <div className="rounded-xl border border-border p-4">
      <label htmlFor="pdp-area" className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <MapPin className="size-4 text-primary-700 dark:text-primary-200" aria-hidden /> Check delivery to your site
      </label>
      <div className="mt-3 flex items-center gap-2">
        <select
          id="pdp-area"
          value={hydrated ? areaId : DEFAULT_AREA_ID}
          onChange={(e) => {
            const a = lookupArea(e.target.value);
            if (!a) return;
            setLocation(a.id, areaLabel(a));
            check(a.id);
          }}
          className="h-11 min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 text-base focus:border-primary-600 focus:outline-none focus:ring-3 focus:ring-primary-600/15 sm:text-sm"
        >
          {SAUDI_REGIONS.map((em) => (
            <optgroup key={em} label={em}>
              {SERVICE_AREAS.filter((a) => a.emirate === em).map((a) => (
                <option key={a.id} value={a.id}>
                  {areaLabel(a)}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        {loading && <Loader2 className="size-5 shrink-0 animate-spin text-muted-foreground" aria-label="Checking" />}
      </div>
      {result && (
        <div className="mt-3 text-sm" role="status">
          {result.serviceable ? (
            <div className="space-y-1.5">
              <p className="flex items-start gap-2 font-medium text-success">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden /> {result.message}
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Truck className="size-4 shrink-0" aria-hidden />
                {result.deliveryType === "truck" ? "Truck delivery" : "Parcel delivery"} · {result.charge ? `${formatSAR(result.charge)} delivery` : "Free delivery"}
                {result.emirate ? ` · ${result.emirate}` : ""}
              </p>
            </div>
          ) : (
            <p className="flex items-start gap-2 font-medium text-danger">
              <XCircle className="mt-0.5 size-4 shrink-0" aria-hidden /> {result.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
