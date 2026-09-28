"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Clock, LayoutGrid, Search, Tag, TrendingUp, X } from "lucide-react";
import type { SearchSuggestion } from "@/types";
import { useSearchHistory } from "@/store/lists";
import { useHydrated } from "@/lib/hooks/use-hydrated";
import { cn } from "@/lib/utils/cn";

const POPULAR = ["OPC 53 cement", "TMT Fe550D", "AAC blocks", "M-Sand", "Vitrified tiles", "Waterproofing", "CPVC pipe", "FRLS wire"];

interface Option {
  key: string;
  label: string;
  href: string;
  kind: "recent" | "popular" | SearchSuggestion["type"];
  meta?: string;
  image?: string;
}

export function SearchBar({ categories, className, autoFocus, onNavigate }: { categories: { slug: string; shortName: string }[]; className?: string; autoFocus?: boolean; onNavigate?: () => void }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const { terms, add, remove } = useSearchHistory();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const wrap = useRef<HTMLDivElement>(null);
  const listId = useId();

  // Debounced suggestions
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) return;
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(term)}${cat ? `&category=${cat}` : ""}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((d) => setSuggestions(d.suggestions))
        .catch(() => {});
    }, 180);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q, cat]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const searchHref = (term: string) => `/search?q=${encodeURIComponent(term)}${cat ? `&category=${cat}` : ""}`;
  const typing = q.trim().length >= 2;
  const options: Option[] = typing
    ? suggestions.map((s) => ({ key: s.type + s.id, label: s.label, href: s.href, kind: s.type, meta: s.meta, image: s.image }))
    : [
        ...(hydrated ? terms.slice(0, 5) : []).map((t) => ({ key: "r" + t, label: t, href: searchHref(t), kind: "recent" as const })),
        ...POPULAR.map((t) => ({ key: "p" + t, label: t, href: searchHref(t), kind: "popular" as const })),
      ];

  const go = (href: string, term?: string) => {
    if (term) add(term);
    setOpen(false);
    setActive(-1);
    onNavigate?.();
    router.push(href);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (active >= 0 && options[active]) {
      const o = options[active];
      return go(o.href, o.kind === "recent" || o.kind === "popular" ? o.label : q);
    }
    const term = q.trim();
    if (!term) return;
    go(searchHref(term), term);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(options.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(-1, i - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  };

  const icon = (o: Option) =>
    o.kind === "recent" ? <Clock className="size-4" /> : o.kind === "popular" ? <TrendingUp className="size-4" /> : o.kind === "category" ? <LayoutGrid className="size-4" /> : o.kind === "brand" ? <Tag className="size-4" /> : <Search className="size-4" />;

  return (
    <div ref={wrap} className={cn("relative", className)}>
      <form role="search" onSubmit={submit} className="flex h-11 items-stretch overflow-hidden rounded-lg border-2 border-primary-800 bg-surface focus-within:border-accent-500 lg:h-12">
        <div className="relative hidden border-r border-border md:block">
          <label htmlFor={`${listId}-cat`} className="sr-only">
            Search in category
          </label>
          <select id={`${listId}-cat`} value={cat} onChange={(e) => setCat(e.target.value)} className="h-full max-w-40 appearance-none bg-surface-muted pl-3 pr-8 text-sm font-medium text-foreground focus:outline-none">
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.shortName}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        </div>
        <input
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-o${active}` : undefined}
          aria-label="Search products, brands and categories"
          autoFocus={autoFocus}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActive(-1);
            if (e.target.value.trim().length < 2) setSuggestions([]);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search cement, TMT, tiles, brands…"
          className="min-w-0 flex-1 bg-transparent px-3 text-base text-foreground placeholder:text-neutral-400 focus:outline-none sm:text-sm [&::-webkit-search-cancel-button]:hidden"
        />
        {q && (
          <button type="button" onClick={() => { setQ(""); setSuggestions([]); }} className="px-2 text-muted-foreground hover:text-foreground" aria-label="Clear search">
            <X className="size-4" aria-hidden />
          </button>
        )}
        <button type="submit" className="flex w-12 items-center justify-center bg-accent-500 text-neutral-900 hover:bg-accent-400 lg:w-14" aria-label="Search">
          <Search className="size-5" aria-hidden />
        </button>
      </form>

      {open && options.length > 0 && (
        <div className="absolute inset-x-0 top-full z-50 mt-1.5 max-h-[70vh] overflow-y-auto rounded-xl border border-border bg-surface py-2 shadow-card-hover">
          {!typing && <p className="px-4 pb-1 pt-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{hydrated && terms.length ? "Recent & popular" : "Popular searches"}</p>}
          <ul id={listId} role="listbox" aria-label="Search suggestions">
            {options.map((o, i) => (
              <li key={o.key} id={`${listId}-o${i}`} role="option" aria-selected={i === active} className={cn("flex items-center", i === active && "bg-surface-muted")}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(o.href, o.kind === "recent" || o.kind === "popular" ? o.label : q.trim())}
                  className="flex min-w-0 flex-1 items-center gap-3 px-4 py-2 text-left text-sm"
                  tabIndex={-1}
                >
                  {o.image ? (
                    <span className="relative size-9 shrink-0 overflow-hidden rounded-md bg-surface-muted">
                      <Image src={o.image} alt="" fill sizes="36px" className="object-cover" />
                    </span>
                  ) : (
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-surface-muted text-muted-foreground" aria-hidden>
                      {icon(o)}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-foreground">{o.label}</span>
                    {o.meta && <span className="block text-xs text-muted-foreground">{o.meta}</span>}
                  </span>
                </button>
                {o.kind === "recent" && (
                  <button type="button" tabIndex={-1} onClick={() => remove(o.label)} className="mr-2 rounded p-2 text-muted-foreground hover:text-foreground" aria-label={`Remove ${o.label} from recent searches`}>
                    <X className="size-3.5" aria-hidden />
                  </button>
                )}
              </li>
            ))}
          </ul>
          {typing && (
            <button type="button" onClick={() => go(searchHref(q.trim()), q.trim())} className="mt-1 flex w-full items-center gap-2 border-t border-border px-4 pt-2.5 text-sm font-semibold text-primary-700 dark:text-primary-200">
              <Search className="size-4" aria-hidden /> See all results for “{q.trim()}”
            </button>
          )}
        </div>
      )}
    </div>
  );
}
