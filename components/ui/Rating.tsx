import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatNumber } from "@/lib/utils/format";

export interface RatingProps {
  value: number;
  count?: number;
  size?: "xs" | "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

const px = { xs: "size-3", sm: "size-3.5", md: "size-4", lg: "size-5" };

/** Read-only star rating with fractional fill. */
export function Rating({ value, count, size = "sm", showValue = false, className }: RatingProps) {
  const pct = Math.max(0, Math.min(100, (value / 5) * 100));
  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="relative inline-flex" role="img" aria-label={`Rated ${value.toFixed(1)} out of 5${count !== undefined ? `, ${count} reviews` : ""}`}>
        <span className="flex text-neutral-300 dark:text-neutral-600">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className={cn(px[size], "fill-current")} aria-hidden />
          ))}
        </span>
        <span className="absolute inset-y-0 left-0 flex overflow-hidden text-accent-500" style={{ width: `${pct}%` }}>
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className={cn(px[size], "shrink-0 fill-current")} aria-hidden />
          ))}
        </span>
      </span>
      {showValue && <span className={cn("font-semibold text-foreground", size === "lg" ? "text-base" : "text-xs")}>{value.toFixed(1)}</span>}
      {count !== undefined && <span className={cn("text-muted-foreground", size === "lg" ? "text-sm" : "text-xs")}>({formatNumber(count)})</span>}
    </div>
  );
}

/** Compact pill: ★ 4.3 — used on cards where space is tight. */
export function RatingPill({ value, count, className }: { value: number; count?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs", className)}>
      <span className="inline-flex items-center gap-0.5 rounded bg-success px-1.5 py-0.5 font-semibold text-white">
        {value.toFixed(1)}
        <Star className="size-2.5 fill-current" aria-hidden />
      </span>
      {count !== undefined && <span className="text-muted-foreground">({formatNumber(count)})</span>}
      <span className="sr-only">Rated {value.toFixed(1)} out of 5</span>
    </span>
  );
}

/** Interactive star input for review forms. */
export { StarInput } from "./StarInput";
