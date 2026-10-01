import type { Metadata } from "next";
import Image from "next/image";
import { imageCredits } from "@/lib/data/credits";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export const metadata: Metadata = { title: "Image Credits", description: "Attribution for photographs used on Smart-MEP.", alternates: { canonical: "/image-credits" } };

export default function ImageCreditsPage() {
  return (
    <div className="container-page py-4 lg:py-6">
      <Breadcrumb items={[{ label: "Image Credits" }]} />
      <h1 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">Image credits</h1>
      <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
        Product and category photographs are illustrative stock images sourced via Openverse under Creative Commons licences (CC BY, CC0) or the Public Domain Mark. Images have been cropped and resized. We thank the photographers below.
      </p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {imageCredits.map((c) => (
          <li key={c.sourceUrl} className="flex gap-3 rounded-xl border border-border bg-surface p-3 text-xs">
            <span className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-surface-muted">
              <Image src={c.files[0]!} alt="" fill sizes="64px" className="object-cover" />
            </span>
            <span className="min-w-0">
              <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer" className="line-clamp-1 font-semibold text-foreground hover:underline">
                {c.title}
              </a>
              <span className="mt-0.5 block text-muted-foreground">
                by{" "}
                {c.creatorUrl ? (
                  <a href={c.creatorUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">{c.creator}</a>
                ) : (
                  c.creator
                )}
              </span>
              <span className="mt-0.5 block text-muted-foreground">
                {c.licenseUrl ? (
                  <a href={c.licenseUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-primary-700 hover:underline dark:text-primary-200">{c.license}</a>
                ) : (
                  c.license
                )}{" "}
                · via {c.source}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
