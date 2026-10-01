import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("size-9", className)} aria-hidden>
      <rect width="40" height="40" rx="10" fill="#F59E0B" />
      <path d="M9 29V17l11-7 11 7v12" fill="none" stroke="#0A1F44" strokeWidth="3.2" strokeLinejoin="round" />
      <path d="M15 29v-7h10v7" fill="none" stroke="#0A1F44" strokeWidth="3.2" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-2 rounded-lg", className)} aria-label="Smart-MEP home">
      <LogoMark />
      <span className={cn("font-display text-xl font-extrabold tracking-tight", tone === "light" ? "text-white" : "text-primary-800 dark:text-white")}>
        Smart<span className="text-accent-500">-MEP</span>
      </span>
    </Link>
  );
}
