"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, FileText, Package, Tag, User } from "lucide-react";
import type { Notification } from "@/types";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDateTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

const ICON = { order: Package, quote: FileText, offer: Tag, account: User };

export function NotificationList({ initial }: { initial: Notification[] }) {
  const [items, setItems] = useState(initial);
  const unread = items.filter((n) => !n.read).length;
  if (!items.length) return <div className="rounded-2xl border border-border bg-surface"><EmptyState icon={<Bell aria-hidden />} title="You're all caught up" description="Order, quote and price alerts will appear here." /></div>;
  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{unread} unread</p>
        {unread > 0 && <Button variant="ghost" size="sm" onClick={() => setItems((x) => x.map((n) => ({ ...n, read: true })))}>Mark all as read</Button>}
      </div>
      <ul className="overflow-hidden rounded-xl border border-border bg-surface shadow-card">
        {items.map((n) => {
          const Icon = ICON[n.kind];
          return (
            <li key={n.id} className={cn("border-b border-border last:border-0", !n.read && "bg-primary-50/60 dark:bg-surface-muted")}>
              <Link href={n.href ?? "#"} onClick={() => setItems((x) => x.map((y) => (y.id === n.id ? { ...y, read: true } : y)))} className="flex gap-3 p-4 hover:bg-surface-muted">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-muted text-primary-700 dark:bg-surface dark:text-primary-200"><Icon className="size-4.5" aria-hidden /></span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 text-sm font-semibold text-foreground">{n.title}{!n.read && <span className="size-2 rounded-full bg-accent-500" aria-label="Unread" />}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{n.body}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{formatDateTime(n.date)}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
