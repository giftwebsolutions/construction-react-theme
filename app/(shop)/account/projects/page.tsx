import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList, MapPin, Plus } from "lucide-react";
import { getSessionUser } from "@/lib/auth/session";
import { getOrders, getProjects } from "@/lib/data";
import { formatCompactAED, formatDate, formatAED } from "@/lib/utils/format";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "My Projects", robots: { index: false } };

export default async function ProjectsPage() {
  const user = (await getSessionUser())!;
  const [projects, orders] = await Promise.all([getProjects(user.id), getOrders(user.id)]);
  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">Group orders by construction project to track spend against budget.</p>
        </div>
        <ButtonLink href="/bulk-enquiry" size="sm" leftIcon={<Plus className="size-4" aria-hidden />}>New project</ButtonLink>
      </div>
      {projects.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface"><EmptyState icon={<ClipboardList aria-hidden />} title="No projects yet" description="Create a project when you request a bulk quote, then tag orders to it." /></div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {projects.map((p) => {
            const po = orders.filter((o) => o.projectId === p.id && o.status !== "cancelled");
            const spent = po.reduce((s, o) => s + o.total, 0);
            const pct = Math.min(100, (spent / p.budget) * 100);
            return (
              <li key={p.id} className="rounded-xl border border-border bg-surface p-5 shadow-card">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display text-lg font-bold text-foreground">{p.name}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3.5" aria-hidden /> {p.location} · {p.type} · since {formatDate(p.startDate)}</p>
                  </div>
                  <Badge tone={p.status === "active" ? "success" : p.status === "planning" ? "warning" : "neutral"} size="md" className="capitalize">{p.status}</Badge>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs"><span className="text-muted-foreground">Material spend</span><span className="font-semibold text-foreground">{formatAED(spent)} of {formatCompactAED(p.budget)}</span></div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-muted" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label="Budget used">
                    <div className="h-full rounded-full bg-accent-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{po.length} orders</p>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {po.slice(0, 3).map((o) => (
                    <li key={o.id} className="flex justify-between gap-2">
                      <Link href={`/account/orders/${o.id}`} className="font-medium text-primary-700 hover:underline dark:text-primary-200">{o.number}</Link>
                      <span className="text-muted-foreground">{formatDate(o.createdAt)} · {formatAED(o.total)}</span>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
