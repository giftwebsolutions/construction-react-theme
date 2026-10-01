import { BadgeCheck, FileText, HandCoins, Truck } from "lucide-react";

const POINTS = [
  { icon: BadgeCheck, t: "Genuine materials from 45+ brands" },
  { icon: FileText, t: "VAT invoice & input tax credit" },
  { icon: HandCoins, t: "Project pricing & 30-day credit for contractors" },
  { icon: Truck, t: "Scheduled truck delivery to your site" },
];

/** Split layout: dark-blue brand panel (desktop) + form card. Full-width form on mobile. */
export function AuthShell({ title, subtitle, children }: { title: string; subtitle?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="container-page py-6 lg:py-12">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl border border-border bg-surface shadow-card lg:grid-cols-[1fr_1.1fr]">
        <aside className="relative hidden overflow-hidden bg-primary-900 p-10 text-white lg:block">
          <div className="absolute inset-0 bg-[url('/images/hero/slide-4-mobile.jpg')] bg-cover bg-center opacity-40" aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/85 to-primary-900/60" aria-hidden />
          <div className="relative flex h-full flex-col">
            <p className="text-xs font-bold uppercase tracking-widest text-accent-400">Smart-MEP for builders</p>
            <p className="mt-3 font-display text-3xl font-extrabold leading-tight">Everything your site needs, one account away.</p>
            <ul className="mt-8 space-y-4">
              {POINTS.map((p) => (
                <li key={p.t} className="flex items-center gap-3 text-sm text-primary-100">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-accent-400"><p.icon className="size-4.5" aria-hidden /></span>
                  {p.t}
                </li>
              ))}
            </ul>
            <figure className="mt-auto rounded-xl bg-white/10 p-4 text-sm backdrop-blur">
              <blockquote className="text-primary-100">“Split deliveries across three sites with one PO is a game changer.”</blockquote>
              <figcaption className="mt-2 text-xs font-semibold text-white">Khalid Hassan · Builder, Sharjah</figcaption>
            </figure>
          </div>
        </aside>
        <div className="p-5 sm:p-10">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
