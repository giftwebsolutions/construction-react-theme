import type { Unit } from "@/types";
import { cn } from "@/lib/utils/cn";
import { discountPercent, formatAED } from "@/lib/utils/format";
import { perUnit } from "@/lib/utils/units";

export interface PriceProps {
  price: number;
  mrp?: number;
  unit?: Unit;
  size?: "sm" | "md" | "lg" | "xl";
  showDiscount?: boolean;
  vatNote?: "incl" | "excl" | false;
  className?: string;
}

const sizes = {
  sm: { price: "text-base", unit: "text-xs", mrp: "text-xs" },
  md: { price: "text-lg", unit: "text-xs", mrp: "text-sm" },
  lg: { price: "text-2xl", unit: "text-sm", mrp: "text-sm" },
  xl: { price: "text-3xl", unit: "text-base", mrp: "text-base" },
};

/** Price is always paired with its unit: AED 17.75 /bag. */
export function Price({ price, mrp, unit, size = "md", showDiscount = true, vatNote = "incl", className }: PriceProps) {
  const s = sizes[size];
  const off = mrp ? discountPercent(price, mrp) : 0;
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className={cn("font-display font-bold tracking-tight text-foreground tabular-nums", s.price)}>
          {formatAED(price)}
          {unit && <span className={cn("ml-0.5 font-sans font-medium text-muted-foreground", s.unit)}>{perUnit(unit)}</span>}
        </span>
        {off > 0 && mrp && (
          <>
            <span className={cn("text-muted-foreground line-through tabular-nums", s.mrp)}>
              <span className="sr-only">MRP </span>
              {formatAED(mrp)}
            </span>
            {showDiscount && <span className={cn("font-semibold text-success", s.mrp)}>{off}% off</span>}
          </>
        )}
      </div>
      {vatNote && <span className="mt-0.5 text-[11px] text-muted-foreground">{vatNote === "incl" ? "Inclusive of VAT" : "Excl. VAT"}</span>}
    </div>
  );
}
