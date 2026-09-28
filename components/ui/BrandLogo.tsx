import type { Brand } from "@/types";
import { cn } from "@/lib/utils/cn";

/**
 * Wordmark placeholder for brand logos (swap for real SVG logos when licensed).
 * `muted` renders grayscale until hovered — used in the brand strip.
 */
export function BrandLogo({ brand, size = "md", muted = false, className }: { brand: Pick<Brand, "name" | "color">; size?: "sm" | "md" | "lg"; muted?: boolean; className?: string }) {
  const text = { sm: "text-sm", md: "text-base", lg: "text-xl" }[size];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-display font-extrabold tracking-tight transition-[filter,opacity] duration-200",
        muted && "opacity-60 grayscale group-hover:opacity-100 group-hover:grayscale-0 group-focus-visible:opacity-100 group-focus-visible:grayscale-0",
        text,
        className,
      )}
      style={{ color: brand.color }}
    >
      <span className="inline-block size-[0.7em] rotate-45 rounded-[2px]" style={{ backgroundColor: brand.color }} aria-hidden />
      <span className="dark:brightness-150">{brand.name}</span>
    </span>
  );
}
