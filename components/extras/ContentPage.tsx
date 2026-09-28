import { Breadcrumb } from "@/components/ui/Breadcrumb";

/** Shared layout for policy / info pages: readable measure, sticky contents on desktop. */
export function ContentPage({ title, intro, updated, sections }: { title: string; intro?: string; updated?: string; sections: { id: string; heading: string; body: React.ReactNode }[] }) {
  return (
    <div className="container-page py-4 lg:py-6">
      <Breadcrumb items={[{ label: title }]} />
      <div className="mt-4 grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav aria-label="On this page" className="hidden lg:block">
          <ul className="sticky top-32 space-y-1 border-l border-border text-sm">
            {sections.map((s) => (
              <li key={s.id}><a href={`#${s.id}`} className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-muted-foreground hover:border-accent-500 hover:text-foreground">{s.heading}</a></li>
            ))}
          </ul>
        </nav>
        <article className="max-w-3xl rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-10">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">{title}</h1>
          {updated && <p className="mt-1 text-xs text-muted-foreground">Last updated {updated}</p>}
          {intro && <p className="mt-4 text-base leading-relaxed text-muted-foreground">{intro}</p>}
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-32 pt-8">
              <h2 className="text-lg font-bold text-foreground">{s.heading}</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-foreground">{s.body}</div>
            </section>
          ))}
        </article>
      </div>
    </div>
  );
}
