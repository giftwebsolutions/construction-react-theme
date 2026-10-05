"use client";

import { Download, FileText, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import type { Product, Question, Review } from "@/types";
import { Accordion } from "@/components/ui/Accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { formatNumber } from "@/lib/utils/format";
import { QuestionsAnswers, Reviews } from "./Reviews";

interface Props {
  product: Product;
  reviews: Review[];
  breakdown: { stars: number; count: number }[];
  questions: Question[];
}

export function ProductInfo({ product: p, reviews, breakdown, questions }: Props) {
  const sections = [
    {
      id: "description",
      title: "Description",
      content: (
        <div className="max-w-3xl space-y-4 text-sm leading-relaxed text-foreground">
          {p.description.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          {p.highlights.length > 0 && (
            <ul className="grid gap-2 sm:grid-cols-2">
              {p.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" aria-hidden /> {h}
                </li>
              ))}
            </ul>
          )}
        </div>
      ),
    },
    {
      id: "specs",
      title: "Specifications",
      content: (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <tbody>
              {p.specifications.map((s, i) => (
                <tr key={s.label + i} className="border-b border-border last:border-0 odd:bg-surface-muted/60">
                  <th scope="row" className="w-2/5 px-4 py-3 text-left font-medium text-muted-foreground">{s.label}</th>
                  <td className="px-4 py-3 text-foreground">{s.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
    {
      id: "documents",
      title: "Documents",
      content: (
        <ul className="grid gap-3 sm:grid-cols-2">
          {(p.documents ?? []).map((d) => (
            <li key={d.label}>
              <a href={d.url} download className="flex items-center gap-3 rounded-xl border border-border p-4 hover:border-primary-600">
                <span className="flex size-10 items-center justify-center rounded-lg bg-danger-50 text-danger">
                  <FileText className="size-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-foreground">{d.label}</span>
                  <span className="text-xs text-muted-foreground">PDF · {p.sku}</span>
                </span>
                <Download className="size-4.5 text-muted-foreground" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: "delivery",
      title: "Delivery & Returns",
      content: (
        <div className="grid gap-4 text-sm sm:grid-cols-2">
          <div className="rounded-xl border border-border p-4">
            <p className="flex items-center gap-2 font-semibold text-foreground">
              <Truck className="size-4.5 text-primary-700 dark:text-primary-200" aria-hidden /> Delivery
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>{p.deliveryType === "parcel" ? "Ships by courier to your door." : "Delivered by truck/tractor to your site — ensure vehicle access."}</li>
              <li>Dispatch within {p.leadTimeDays} working day{p.leadTimeDays > 1 ? "s" : ""}; choose a delivery slot at checkout.</li>
              <li>Unloading to ground level included for truck orders. Floor delivery on request.</li>
              <li>Free truck delivery on orders above SAR 2,500; parcel free above SAR 100.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-border p-4">
            <p className="flex items-center gap-2 font-semibold text-foreground">
              <RotateCcw className="size-4.5 text-primary-700 dark:text-primary-200" aria-hidden /> Returns
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
              <li>Report damaged or wrong items within 48 hours of delivery with photos.</li>
              <li>Unopened, non-custom items returnable within 7 days (return freight applies).</li>
              <li>Cut-to-size, tinted and loose bulk materials are non-returnable.</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "reviews",
      title: `Reviews (${formatNumber(p.reviewCount)})`,
      content: <Reviews productName={p.name} rating={p.rating} reviewCount={p.reviewCount} reviews={reviews} breakdown={breakdown} />,
    },
    { id: "qa", title: `Q&A (${questions.length})`, content: <QuestionsAnswers questions={questions} /> },
  ];

  return (
    <section aria-label="Product information" id="details" className="scroll-mt-32">
      <div className="lg:hidden">
        <Accordion items={sections} defaultOpen={["description"]} multiple className="border-y border-border" />
      </div>
      <Tabs defaultValue="description" className="hidden lg:block">
        <TabsList aria-label="Product information">
          {sections.map((s) => (
            <TabsTrigger key={s.id} value={s.id}>
              {s.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {sections.map((s) => (
          <TabsContent key={s.id} value={s.id} className="pt-6">
            {s.content}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
