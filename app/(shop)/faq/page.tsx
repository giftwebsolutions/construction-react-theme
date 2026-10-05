import type { Metadata } from "next";
import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = { title: "FAQs", description: "Answers about ordering, delivery, VAT invoices, payments and returns at Smart-MEP.", alternates: { canonical: "/faq" } };

const GROUPS = [
  { id: "orders", title: "Orders & pricing", items: [
    ["Are prices inclusive of VAT?", "Yes. All prices include 5% UAE VAT. Your tax invoice shows the taxable value and VAT separately — add your TRN at checkout for a business invoice."],
    ["How does bulk pricing work?", "Many products have quantity tiers. When your cart quantity crosses a tier, the lower per-unit price applies automatically. For very large orders, request a project quote."],
    ["Can I change or cancel an order?", "You can cancel free of charge until the order is dispatched. After dispatch, contact support — truck orders may incur a return trip charge."],
  ] },
  { id: "delivery", title: "Delivery", items: [
    ["Do you deliver to construction sites?", "Yes. Heavy materials (cement, steel, sand, bricks) go by truck to your site with ground-level unloading. Lighter items ship as parcels."],
    ["How are delivery charges calculated?", "Parcel delivery is free above SAR 100. Truck delivery is free above SAR 2,500 and otherwise SAR 35–110 by weight. Exact charges show at checkout."],
    ["Can I choose a delivery slot?", "Yes. Pick a date and time slot at checkout. Our dispatcher calls one hour before arrival."],
  ] },
  { id: "vat", title: "VAT invoice & payments", items: [
    ["How do I get a VAT invoice with my TRN?", "Tick “Use TRN for business invoice” at checkout, or save your TRN in your profile. You can claim input tax credit on eligible purchases."],
    ["Which payment methods are available?", "Visa and Mastercard, Apple Pay, Google Pay, Tabby instalments, bank transfer and cash on delivery (up to SAR 2,500). Verified contractors can use Smart-MEP Credit with 30-day terms."],
  ] },
  { id: "returns", title: "Returns & quality", items: [
    ["What if material arrives damaged?", "Report within 48 hours with photos from your account or WhatsApp. We replace or refund damaged units."],
    ["Do you provide test certificates?", "Yes. Datasheets are on product pages, and lot-specific certificates (e.g. MTC for steel, cube reports for RMC) ship with your order."],
  ] },
];

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GROUPS.flatMap((g) => g.items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } }))),
  };
  return (
    <div className="container-page py-4 lg:py-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumb items={[{ label: "FAQs" }]} />
      <h1 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">Frequently asked questions</h1>
      <div className="mt-6 max-w-3xl space-y-6">
        {GROUPS.map((g) => (
          <section key={g.id} id={g.id} className="scroll-mt-32 rounded-2xl border border-border bg-surface px-5 pt-4 shadow-card sm:px-6" aria-labelledby={`h-${g.id}`}>
            <h2 id={`h-${g.id}`} className="text-lg font-bold text-foreground">{g.title}</h2>
            <Accordion items={g.items.map(([q, a], i) => ({ id: `${g.id}-${i}`, title: q!, content: a }))} />
          </section>
        ))}
        <p className="text-sm text-muted-foreground">Still have questions? <Link href="/contact" className="font-semibold text-primary-700 hover:underline dark:text-primary-200">Contact our team</Link>.</p>
      </div>
    </div>
  );
}
