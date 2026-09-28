import type { Metadata } from "next";
import { BadgeCheck, Building2, Truck, Users } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "About Us", description: "BuildMart makes buying construction materials simple, transparent and site-ready.", alternates: { canonical: "/about" } };

const STATS = [
  { v: "12,000+", l: "Builders & homeowners served" },
  { v: "45+", l: "Authorised brands" },
  { v: "40+", l: "Cities with site delivery" },
  { v: "2 hrs", l: "Average quote turnaround" },
];

export default function AboutPage() {
  return (
    <div className="container-page py-4 lg:py-6">
      <Breadcrumb items={[{ label: "About" }]} />
      <section className="mt-4 overflow-hidden rounded-2xl bg-primary-900 px-6 py-12 text-white sm:px-12 sm:py-16">
        <p className="text-xs font-bold uppercase tracking-widest text-accent-400">Our story</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-extrabold leading-tight sm:text-5xl">Building materials, bought the way builders actually work.</h1>
        <p className="mt-4 max-w-2xl text-primary-100">Started in Dubai in 2021 by a civil engineer and a third-generation building-materials trader, BuildMart brings transparent prices, genuine brands and reliable site delivery to contractors and homeowners across all seven emirates.</p>
      </section>
      <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((s) => (
          <li key={s.l} className="rounded-xl border border-border bg-surface p-5 text-center shadow-card">
            <p className="font-display text-3xl font-extrabold text-primary-800 dark:text-accent-400">{s.v}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.l}</p>
          </li>
        ))}
      </ul>
      <section className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { i: BadgeCheck, t: "Genuine, always", d: "We buy only from manufacturers and authorised distributors. Every order ships with a VAT invoice and batch documents." },
          { i: Truck, t: "Site-ready logistics", d: "Our own fleet and partner trucks deliver on scheduled slots with unloading — no more chasing lorries." },
          { i: Users, t: "Built for contractors", d: "Project pricing, credit terms, split deliveries and a dedicated account manager for repeat buyers." },
          { i: Building2, t: "Local warehouses", d: "Regional stock points keep lead times short and prices close to plant rates." },
        ].map(({ i: I, t, d }) => (
          <div key={t} className="rounded-xl border border-border bg-surface p-6">
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent-100 text-accent-700"><I className="size-5.5" aria-hidden /></span>
            <h2 className="mt-4 font-display text-lg font-bold text-foreground">{t}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>
      <section className="mt-12 flex flex-col items-center rounded-2xl border border-border bg-surface p-8 text-center shadow-card">
        <h2 className="text-2xl font-bold text-foreground">Starting a project?</h2>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground">Share your BOQ and get one consolidated quote with a delivery plan for every stage of construction.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/bulk-enquiry" variant="accent">Request a quote</ButtonLink>
          <ButtonLink href="/contact" variant="outline">Contact us</ButtonLink>
        </div>
      </section>
    </div>
  );
}
