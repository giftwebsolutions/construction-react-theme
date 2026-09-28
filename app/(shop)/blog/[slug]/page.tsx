import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calculator, Clock } from "lucide-react";
import { getBlogPostBySlug, getBlogPosts, getProducts } from "@/lib/data";
import { toCards } from "@/lib/data/card";
import { formatDate } from "@/lib/utils/format";
import { Avatar } from "@/components/ui/Avatar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductCarousel } from "@/components/home/ProductCarousel";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getBlogPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getBlogPostBySlug((await params).slug);
  return p ? { title: p.title, description: p.excerpt, alternates: { canonical: `/blog/${p.slug}` }, openGraph: { type: "article", images: [{ url: p.cover }] } } : { title: "Article not found" };
}

export default async function BlogPost({ params }: Props) {
  const post = await getBlogPostBySlug((await params).slug);
  if (!post) notFound();
  const [related, others] = await Promise.all([getProducts({ q: post.category, perPage: 10 }), getBlogPosts()]);
  const more = others.filter((o) => o.id !== post.id).slice(0, 3);
  return (
    <article className="container-page py-4 lg:py-6">
      <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />
      <header className="mx-auto mt-6 max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-wider text-accent-600">{post.category}</p>
        <h1 className="mt-2 text-3xl font-extrabold leading-tight text-foreground text-balance sm:text-4xl">{post.title}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{post.excerpt}</p>
        <div className="mt-5 flex items-center gap-3">
          <Avatar name={post.author} size="sm" />
          <p className="text-sm"><span className="font-semibold text-foreground">{post.author}</span><span className="block text-xs text-muted-foreground">{post.authorRole} · {formatDate(post.date)} · <Clock className="inline size-3" aria-hidden /> {post.readMinutes} min read</span></p>
        </div>
      </header>
      <div className="relative mx-auto mt-8 aspect-[16/9] max-w-4xl overflow-hidden rounded-2xl bg-surface-muted"><Image src={post.cover} alt="" fill priority sizes="(min-width:1024px) 896px, 100vw" className="object-cover" /></div>
      <div className="mx-auto mt-8 max-w-3xl space-y-5 text-base leading-relaxed text-foreground">
        {post.body.map((b, i) => (b.startsWith("## ") ? <h2 key={i} className="pt-4 text-2xl font-bold">{b.slice(3)}</h2> : <p key={i}>{b}</p>))}
        <aside className="!mt-10 flex flex-col gap-4 rounded-2xl bg-primary-900 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-lg font-bold">Estimate quantities in seconds</p>
          <Link href="/calculators/cement" className="inline-flex h-11 items-center gap-2 rounded-lg bg-accent-500 px-5 text-sm font-bold text-neutral-900 hover:bg-accent-400"><Calculator className="size-4" aria-hidden /> Open calculators</Link>
        </aside>
        <ul className="flex flex-wrap gap-2 pt-2">{post.tags.map((t) => <li key={t} className="rounded-full bg-surface-muted px-3 py-1 text-xs text-muted-foreground">#{t}</li>)}</ul>
      </div>
      {related.items.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 text-xl font-bold text-foreground">Shop materials from this guide</h2>
          <ProductCarousel cards={toCards(related.items)} label="Related products" />
        </section>
      )}
      <section className="mt-14">
        <h2 className="mb-4 text-xl font-bold text-foreground">More guides</h2>
        <ul className="grid gap-4 md:grid-cols-3">
          {more.map((m) => (
            <li key={m.id}>
              <Link href={`/blog/${m.slug}`} className="flex gap-3 rounded-xl border border-border bg-surface p-3 hover:border-primary-600">
                <span className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-surface-muted"><Image src={m.cover} alt="" fill sizes="80px" className="object-cover" /></span>
                <span className="min-w-0"><span className="text-xs font-semibold text-accent-700">{m.category}</span><span className="line-clamp-2 text-sm font-semibold text-foreground">{m.title}</span></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
