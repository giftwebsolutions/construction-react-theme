import type { Metadata } from "next";
import { Clock, FileText, HandCoins, Truck } from "lucide-react";
import { getSessionUser } from "@/lib/auth/session";
import { getProductBySlug } from "@/lib/data";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { BulkEnquiryForm } from "@/components/extras/BulkEnquiryForm";

export const metadata: Metadata = { title: "Bulk / Project Enquiry", description: "Upload your BOQ and get consolidated project pricing for construction materials within 2 hours.", alternates: { canonical: "/bulk-enquiry" } };

export default async function BulkEnquiryPage({ searchParams }: { searchParams: Promise<{ product?: string; material?: string }> }) {
  const { product, material } = await searchParams;
  const [user, p] = await Promise.all([getSessionUser(), product ? getProductBySlug(product) : undefined]);
  return (
    <div className="container-page py-4 lg:py-6">
      <Breadcrumb items={[{ label: "Bulk Enquiry" }]} />
      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Get project pricing</h1>
          <p className="mb-6 mt-1 text-sm text-muted-foreground">Tell us what you need — we&apos;ll send one consolidated quote with delivery schedule.</p>
          <BulkEnquiryForm initialItem={p?.name ?? (material ? material[0]!.toUpperCase() + material.slice(1) : undefined)} user={user ? { name: user.name, email: user.email, phone: user.phone, company: user.company, trn: user.trn } : null} />
        </div>
        <aside className="space-y-4 lg:sticky lg:top-32 lg:self-start">
          <div className="rounded-xl bg-primary-900 p-5 text-white">
            <p className="font-display text-lg font-bold">Why request a quote?</p>
            <ul className="mt-4 space-y-4 text-sm">
              {[
                { i: Clock, t: "Response in 2 hours", d: "Mon–Sat, 8 AM – 8 PM" },
                { i: HandCoins, t: "Project rates", d: "Better than bulk tiers on 5 L+ orders" },
                { i: Truck, t: "Phased delivery", d: "Schedule deliveries by construction stage" },
                { i: FileText, t: "One VAT invoice", d: "Consolidated billing per project" },
              ].map(({ i: I, t, d }) => (
                <li key={t} className="flex gap-3">
                  <I className="mt-0.5 size-5 shrink-0 text-accent-400" aria-hidden />
                  <span><span className="block font-semibold">{t}</span><span className="text-xs text-primary-200">{d}</span></span>
                </li>
              ))}
            </ul>
          </div>
          <p className="rounded-xl border border-border bg-surface p-4 text-sm text-muted-foreground">Prefer to talk? Call <a href="tel:8002845362" className="font-semibold text-primary-700 dark:text-primary-200">800 284 5362</a> or WhatsApp your BOQ to <strong className="text-foreground">98765 43210</strong>.</p>
        </aside>
      </div>
    </div>
  );
}
