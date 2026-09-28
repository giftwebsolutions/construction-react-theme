"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const LABELS = ["Poor", "Fair", "Good", "Very good", "Excellent"];

export function StarInput({ value, onChange, name = "rating" }: { value: number; onChange: (v: number) => void; name?: string }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="flex items-center gap-3">
      <div role="radiogroup" aria-label="Your rating" className="flex" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="cursor-pointer p-1" onMouseEnter={() => setHover(n)}>
            <input type="radio" name={name} value={n} checked={value === n} onChange={() => onChange(n)} className="peer sr-only" aria-label={`${n} star${n > 1 ? "s" : ""} — ${LABELS[n - 1]}`} />
            <Star className={cn("size-8 transition-colors peer-focus-visible:rounded peer-focus-visible:outline-2 peer-focus-visible:outline-ring", n <= shown ? "fill-accent-500 text-accent-500" : "text-neutral-300")} aria-hidden />
          </label>
        ))}
      </div>
      <span className="text-sm font-medium text-muted-foreground" aria-live="polite">
        {shown ? LABELS[shown - 1] : "Tap to rate"}
      </span>
    </div>
  );
}
