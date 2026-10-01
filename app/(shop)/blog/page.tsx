import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import { getBlogPosts } from "@/lib/data";
import { formatDate } from "@/lib/utils/format";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = { title: "Build Guides & Blog", description: "Practical guides on cement, steel, tiles, waterproofing and more from Smart-MEP's engineers.", alternates: { canonical: "/blog" } };

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const all = await getBlogPosts();
  const cats = [...new Set(all.map((p) => p.category))];
  const posts = category ? all.filter((p) => p.category === category) : all;
  const [lead, ...rest] = posts;
  return (
    <div className="container-page py-4 lg:py-6">
      <Breadcrumb items={[{ label: "Blog" }]} />
      <h1 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">Build Guides</h1>
      <p className="mt-1 text-sm text-muted-foreground">Straight answers from site engineers — pick the right material and buy the right quantity.</p>
      <nav aria-label="Blog categories" className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
        {["All", ...cats].map((c) => {
          const active = (c === "All" && !category) || c === category;
          return (
            <Link key={c} href={c === "All" ? "/blog" : `/blog?category=${c}`} aria-current={active ? "page" : undefined} className={`h-9 shrink-0 rounded-full border px-4 text-sm font-semibold leading-9 ${active ? "border-primary-800 bg-primary-800 text-white" : "border-border bg-surface text-foreground"}`}>{c}</Link>
          );
        })}
      </nav>
      {lead && (
        <Link href={`/blog/${lead.slug}`} className="group mt-6 grid overflow-hidden rounded-2xl border border-border bg-surface shadow-card md:grid-cols-2">
          <span className="relative aspect-[16/9] bg-surface-muted md:aspect-auto"><Image src={lead.cover} alt="" fill priority sizes="(min-width:768px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" /></span>
          <span className="flex flex-col justify-center p-6 sm:p-8">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-600">{lead.category} · Latest</span>
            <span className="mt-2 font-display text-2xl font-bold leading-tight text-foreground group-hover:text-primary-700 dark:group-hover:text-primary-200">{lead.title}</span>
            <span className="mt-2 text-sm text-muted-foreground">{lead.excerpt}</span>
            <span className="mt-4 text-xs text-muted-foreground">{lead.author} · {formatDate(lead.date)} · {lead.readMinutes} min read</span>
          </span>
        </Link>
      )}
      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((p) => (
          <li key={p.id}>
            <Link href={`/blog/${p.slug}`} className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-card transition hover:shadow-card-hover">
              <span className="relative aspect-[16/9] bg-surface-muted"><Image src={p.cover} alt="" fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" /></span>
              <span className="flex flex-1 flex-col p-5">
                <span className="flex items-center gap-2 text-xs"><span className="font-semibold text-accent-700">{p.category}</span><span className="inline-flex items-center gap-1 text-muted-foreground"><Clock className="size-3.5" aria-hidden />{p.readMinutes} min</span></span>
                <span className="mt-2 line-clamp-2 font-display text-lg font-bold leading-snug text-foreground">{p.title}</span>
                <span className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</span>
                <span className="mt-auto pt-4 text-xs text-muted-foreground">{p.author} · {formatDate(p.date)}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
