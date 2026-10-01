import Link from "next/link";
import { BadgeCheck, CreditCard, FileText, Mail, MapPin, Phone, ShieldCheck, Truck } from "lucide-react";
import type { Category } from "@/types";
import { Logo } from "@/components/ui/Logo";
import { NewsletterForm } from "./NewsletterForm";
import { HELPLINE } from "./TopBar";

const TRUST = [
  { icon: BadgeCheck, title: "Genuine Products", body: "Direct from brands & authorised distributors" },
  { icon: FileText, title: "VAT Invoice", body: "Claim input tax credit on every order" },
  { icon: ShieldCheck, title: "Secure Payments", body: "Cards, Apple Pay, Tabby & credit" },
  { icon: Truck, title: "Site Delivery", body: "Truck & parcel delivery to your site" },
];

const COMPANY = [
  ["About Smart-MEP", "/about"],
  ["Contact Us", "/contact"],
  ["Build Guides & Blog", "/blog"],
  ["All Brands", "/brands"],
  ["Material Calculators", "/calculators/cement"],
];
const HELP = [
  ["Shipping & Delivery", "/shipping-policy"],
  ["Returns & Refunds", "/return-policy"],
  ["VAT Invoice & ITC", "/faq#vat"],
  ["Bulk & Project Orders", "/bulk-enquiry"],
  ["FAQs", "/faq"],
  ["Track Your Order", "/account/orders"],
];

function Social({ label, d }: { label: string; d: string }) {
  return (
    <a href="#" aria-label={label} className="flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-accent-500 hover:text-neutral-900">
      <svg viewBox="0 0 24 24" className="size-4.5" fill="currentColor" aria-hidden>
        <path d={d} />
      </svg>
    </a>
  );
}

const PAYMENTS = ["VISA", "Mastercard", "Apple Pay", "Google Pay", "Tabby", "COD"];

export function Footer({ categories }: { categories: Category[] }) {
  return (
    <footer className="mt-16 bg-primary-900 pb-20 text-primary-100 lg:pb-0">
      <div className="border-b border-white/10">
        <ul className="container-page grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
          {TRUST.map((t) => (
            <li key={t.title} className="flex items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-accent-400">
                <t.icon className="size-5.5" aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-semibold text-white">{t.title}</span>
                <span className="mt-0.5 block text-xs text-primary-200">{t.body}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo tone="light" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-primary-200">
            Construction materials from 45+ trusted brands, delivered to your site with VAT invoice and bulk pricing. Built for contractors, builders, architects and homeowners.
          </p>
          <p className="mt-6 text-sm font-semibold text-white">Get weekly cement & steel price updates</p>
          <NewsletterForm className="mt-3 max-w-md" />
          <div className="mt-6 flex gap-2">
            <Social label="Facebook" d="M14 8h3V4h-3c-2.8 0-4 1.7-4 4.3V10H7v4h3v8h4v-8h3l1-4h-4V8.6c0-.4.3-.6.6-.6Z" />
            <Social label="Instagram" d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4ZM17.3 5.5a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4ZM12 3c-2.4 0-2.7 0-3.7.1-3.4.1-5 1.8-5.2 5.2C3 9.3 3 9.6 3 12s0 2.7.1 3.7c.1 3.4 1.8 5 5.2 5.2 1 .1 1.3.1 3.7.1s2.7 0 3.7-.1c3.4-.1 5-1.8 5.2-5.2.1-1 .1-1.3.1-3.7s0-2.7-.1-3.7c-.1-3.4-1.8-5-5.2-5.2C14.7 3 14.4 3 12 3Z" />
            <Social label="YouTube" d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
            <Social label="LinkedIn" d="M6.5 8.5h-3V20h3V8.5ZM5 3.5a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6ZM20.5 13.3c0-3-1.6-4.9-4.2-4.9a3.6 3.6 0 0 0-3.2 1.8V8.5h-3V20h3v-6c0-1.6.7-2.8 2.2-2.8s2.2 1.1 2.2 2.8v6h3v-6.7Z" />
            <Social label="WhatsApp" d="M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1a15 15 0 0 1-1.5-.6c-2.7-1.2-4.4-3.9-4.6-4.1-.1-.2-1.1-1.4-1.1-2.7s.7-2 1-2.2c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.8 2c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.7 1.2 1.5 1.9 1 .9 1.9 1.2 2.2 1.3.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3Z" />
          </div>
        </div>

        <nav aria-label="Shop categories">
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">Shop</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm lg:grid-cols-1">
            {categories.slice(0, 10).map((c) => (
              <li key={c.id}>
                <Link href={`/category/${c.slug}`} className="hover:text-white hover:underline">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="grid grid-cols-2 gap-8 lg:col-span-2">
          <nav aria-label="Company">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Company</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {COMPANY.map(([l, h]) => (
                <li key={h}>
                  <Link href={h!} className="hover:text-white hover:underline">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Help">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">Help</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {HELP.map(([l, h]) => (
                <li key={h}>
                  <Link href={h!} className="hover:text-white hover:underline">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <address className="col-span-2 space-y-3 text-sm not-italic">
            <p className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent-400" aria-hidden />
              Emirates Building, Riyadh, Kingdom of Saudi Arabia.
            </p>
            <p className="flex items-center gap-2.5">
              <Phone className="size-4 text-accent-400" aria-hidden />
              <a href={`tel:${HELPLINE.replace(/\s/g, "")}`} className="hover:text-white">
                {HELPLINE} (toll-free)
              </a>
            </p>
            <p className="flex items-center gap-2.5">
              <Mail className="size-4 text-accent-400" aria-hidden />
              <a href="mailto:support@smart-mep.ae" className="hover:text-white">
                support@smart-mep.ae
              </a>
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {["Google Play", "App Store"].map((s) => (
                <a key={s} href="#" className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/20 bg-black/30 px-3 text-left hover:border-white/40">
                  <span className="text-[10px] leading-tight text-primary-200">
                    {s === "App Store" ? "Download on the" : "Get it on"}
                    <span className="block text-sm font-semibold text-white">{s}</span>
                  </span>
                </a>
              ))}
            </div>
          </address>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-4 py-6 text-xs text-primary-200 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Smart-MEP Supply Pvt. Ltd. · TRN 33AABCB1234C1Z5 · All prices inclusive of VAT</p>
          <div className="flex flex-wrap items-center gap-2">
            <CreditCard className="size-4" aria-hidden />
            <span className="sr-only">Payment methods:</span>
            {PAYMENTS.map((p) => (
              <span key={p} className="rounded bg-white px-2 py-1 text-[10px] font-bold text-primary-900">
                {p}
              </span>
            ))}
          </div>
          <nav aria-label="Legal" className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/image-credits" className="hover:text-white">Image credits</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
