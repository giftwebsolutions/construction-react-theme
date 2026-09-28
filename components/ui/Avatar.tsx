import { cn } from "@/lib/utils/cn";
import { initials as toInitials } from "@/lib/utils/format";

const PALETTE = ["bg-primary-700", "bg-accent-600", "bg-emerald-600", "bg-rose-600", "bg-violet-600", "bg-sky-600"];

export function Avatar({ name, initials, size = "md", className }: { name: string; initials?: string; size?: "sm" | "md" | "lg"; className?: string }) {
  const text = initials ?? toInitials(name);
  const color = PALETTE[[...name].reduce((s, c) => s + c.charCodeAt(0), 0) % PALETTE.length];
  const dim = { sm: "size-8 text-xs", md: "size-11 text-sm", lg: "size-16 text-lg" }[size];
  return (
    <span className={cn("inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white", color, dim, className)} aria-hidden>
      {text}
    </span>
  );
}
