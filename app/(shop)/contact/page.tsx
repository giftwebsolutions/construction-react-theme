import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ContactForm } from "@/components/extras/ContactForm";

export const metadata: Metadata = { title: "Contact Us", description: "Call, WhatsApp or email BuildMart for orders, quotes and delivery support.", alternates: { canonical: "/contact" } };

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ subject?: string }> }) {
  const { subject } = await searchParams;
  const items = [
    { i: Phone, t: "Call us (toll-free)", d: "800 284 5362", href: "tel:8002845362" },
    { i: MessageCircle, t: "WhatsApp", d: "+971 50 123 4567", href: "https://wa.me/971501234567" },
    { i: Mail, t: "Email", d: "support@buildmart.ae", href: "mailto:support@buildmart.ae" },
    { i: Clock, t: "Hours", d: "Mon–Sat 8 AM – 8 PM · Sun 9 AM – 1 PM" },
    { i: MapPin, t: "Head office & warehouse", d: "Warehouse 18, Al Quoz Industrial Area 3, Dubai, UAE" },
  ];
  return (
    <div className="container-page py-4 lg:py-6">
      <Breadcrumb items={[{ label: "Contact" }]} />
      <h1 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">Contact us</h1>
      <p className="mt-1 text-sm text-muted-foreground">Orders, deliveries, quotes or product advice — we&apos;re here to help.</p>
      <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
        <ul className="space-y-3">
          {items.map(({ i: I, t, d, href }) => (
            <li key={t}>
              {(() => {
                const inner = (
                  <>
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-800 dark:bg-surface-muted dark:text-primary-100"><I className="size-5" aria-hidden /></span>
                    <span><span className="block text-xs text-muted-foreground">{t}</span><span className="block text-sm font-semibold text-foreground">{d}</span></span>
                  </>
                );
                return href ? <a href={href} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 hover:border-primary-600">{inner}</a> : <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">{inner}</div>;
              })()}
            </li>
          ))}
        </ul>
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-8">
          <h2 className="mb-5 text-lg font-bold text-foreground">Send us a message</h2>
          <ContactForm subject={subject} />
        </div>
      </div>
    </div>
  );
}
