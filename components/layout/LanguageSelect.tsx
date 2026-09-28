"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Languages } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "ar", label: "Arabic", native: "العربية" },
] as const;

/** Language picker UI only — the storefront stays in English; wire an i18n library here when translations exist. */
export function LanguageSelect() {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<(typeof LANGUAGES)[number]["code"]>("en");
  const active = LANGUAGES.find((l) => l.code === current)!;

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

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open} aria-label={`Language: ${active.label}`} className="inline-flex items-center gap-1.5 hover:text-white">
        <Languages className="size-3.5" aria-hidden />
        <span className="font-semibold text-white">{active.native}</span>
        <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open && (
        <ul role="listbox" aria-label="Language" className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-lg border border-border bg-surface py-1 text-sm text-foreground shadow-lg">
          {LANGUAGES.map((l) => (
            <li key={l.code} role="option" aria-selected={l.code === current}>
              <button
                type="button"
                onClick={() => {
                  setCurrent(l.code);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left hover:bg-surface-muted"
              >
                <span lang={l.code} dir={l.code === "ar" ? "rtl" : undefined}>{l.native}</span>
                {l.code === current && <Check className="size-4 text-accent-600" aria-hidden />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
