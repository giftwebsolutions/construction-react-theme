"use client";

import { useId, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface AccordionItemData {
  id: string;
  title: ReactNode;
  content: ReactNode;
  meta?: ReactNode;
}

export function Accordion({ items, multiple = false, defaultOpen = [], className, itemClassName }: { items: AccordionItemData[]; multiple?: boolean; defaultOpen?: string[]; className?: string; itemClassName?: string }) {
  const [open, setOpen] = useState<string[]>(defaultOpen);
  const toggle = (id: string) =>
    setOpen((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : multiple ? [...cur, id] : [id]));
  return (
    <div className={cn("divide-y divide-border", className)}>
      {items.map((item) => (
        <AccordionItem key={item.id} item={item} open={open.includes(item.id)} onToggle={() => toggle(item.id)} className={itemClassName} />
      ))}
    </div>
  );
}

function AccordionItem({ item, open, onToggle, className }: { item: AccordionItemData; open: boolean; onToggle: () => void; className?: string }) {
  const id = useId();
  return (
    <div className={className}>
      <h3>
        <button
          type="button"
          id={`${id}-trigger`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          className="flex min-h-12 w-full items-center justify-between gap-4 py-3 text-left text-sm font-semibold text-foreground hover:text-primary-700 dark:hover:text-primary-200"
        >
          <span className="flex-1">{item.title}</span>
          {item.meta}
          <ChevronDown className={cn("size-4.5 shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-180")} aria-hidden />
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-trigger`}
        className={cn("grid transition-[grid-template-rows] duration-200 ease-out", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
      >
        <div className="overflow-hidden" inert={!open}>
          <div className="pb-4 text-sm leading-relaxed text-muted-foreground">{item.content}</div>
        </div>
      </div>
    </div>
  );
}
