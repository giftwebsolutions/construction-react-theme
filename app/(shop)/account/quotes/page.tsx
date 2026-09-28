import type { Metadata } from "next";
import { FileText, Plus } from "lucide-react";
import { getSessionUser } from "@/lib/auth/session";
import { getQuotes } from "@/lib/data";
import { formatDate, formatAED } from "@/lib/utils/format";
import { formatQty } from "@/lib/utils/units";
import { QuoteStatusBadge } from "@/components/account/StatusBadge";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Bulk Quotes", robots: { index: false } };

export default async function QuotesPage() {
  const user = (await getSessionUser())!;
  const quotes = await getQuotes(user.id);
  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">Bulk Quote Requests</h1>
        <ButtonLink href="/bulk-enquiry" size="sm" variant="accent" leftIcon={<Plus className="size-4" aria-hidden />}>New request</ButtonLink>
      </div>
      {quotes.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface"><EmptyState icon={<FileText aria-hidden />} title="No quote requests yet" description="Upload a BOQ or list materials to get consolidated project pricing." actions={<ButtonLink href="/bulk-enquiry">Request a quote</ButtonLink>} /></div>
      ) : (
        <ul className="space-y-4">
          {quotes.map((q) => (
            <li key={q.id} className="rounded-xl border border-border bg-surface p-5 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">{q.number} · {formatDate(q.createdAt)} · {q.city}</p>
                  <p className="mt-0.5 font-semibold text-foreground">{q.projectName}</p>
                </div>
                <QuoteStatusBadge status={q.status} />
              </div>
              <ul className="mt-3 flex flex-wrap gap-2">
                {q.items.map((i) => (
                  <li key={i.name} className="rounded-lg bg-surface-muted px-2.5 py-1 text-xs text-foreground">{i.name} · <span className="text-muted-foreground">{formatQty(i.quantity, i.unit)}</span></li>
                ))}
              </ul>
              {q.notes && <p className="mt-3 text-sm text-muted-foreground">{q.notes}</p>}
              {q.quotedAmount && (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                  <p className="text-sm">
                    Quoted <strong className="font-display text-lg text-foreground">{formatAED(q.quotedAmount)}</strong>
                    {q.validTill && <span className="text-xs text-muted-foreground"> · valid till {formatDate(q.validTill)}</span>}
                  </p>
                  {q.status === "quoted" && (
                    <div className="flex gap-2">
                      <ButtonLink href="/docs/technical-datasheet.pdf" download variant="outline" size="sm">Download PDF</ButtonLink>
                      <ButtonLink href="/contact?subject=Accept%20quote" variant="accent" size="sm">Accept quote</ButtonLink>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
