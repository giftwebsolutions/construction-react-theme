"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck, MessageSquarePlus, Star, ThumbsUp } from "lucide-react";
import type { Question, Review } from "@/types";
import { reviewSchema, type ReviewInput, questionSchema } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Rating } from "@/components/ui/Rating";
import { StarInput } from "@/components/ui/StarInput";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate, formatNumber } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { toast } from "@/store/toast";

export function Reviews({ productName, rating, reviewCount, reviews, breakdown }: { productName: string; rating: number; reviewCount: number; reviews: Review[]; breakdown: { stars: number; count: number }[] }) {
  const [filter, setFilter] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [helpful, setHelpful] = useState<string[]>([]);
  const total = breakdown.reduce((s, b) => s + b.count, 0) || 1;
  const list = filter ? reviews.filter((r) => r.rating === filter) : reviews;

  return (
    <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
      <div>
        <div className="flex items-center gap-4">
          <p className="font-display text-5xl font-extrabold text-foreground">{rating.toFixed(1)}</p>
          <div>
            <Rating value={rating} size="md" />
            <p className="mt-1 text-sm text-muted-foreground">{formatNumber(reviewCount)} ratings</p>
          </div>
        </div>
        <ul className="mt-5 space-y-2">
          {breakdown.map((b) => (
            <li key={b.stars}>
              <button type="button" onClick={() => setFilter(filter === b.stars ? null : b.stars)} aria-pressed={filter === b.stars} className={cn("flex w-full items-center gap-3 rounded-md px-1 py-1 text-sm", filter === b.stars && "bg-surface-muted")}>
                <span className="flex w-8 items-center gap-0.5 font-medium text-foreground">
                  {b.stars} <Star className="size-3 fill-accent-500 text-accent-500" aria-hidden />
                </span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-surface-muted">
                  <span className={cn("block h-full rounded-full", b.stars >= 4 ? "bg-success" : b.stars === 3 ? "bg-accent-500" : "bg-danger")} style={{ width: `${(b.count / total) * 100}%` }} />
                </span>
                <span className="w-12 text-right text-xs tabular-nums text-muted-foreground">{formatNumber(b.count)}</span>
              </button>
            </li>
          ))}
        </ul>
        <Button variant="outline" fullWidth className="mt-5" onClick={() => setOpen(true)} leftIcon={<MessageSquarePlus className="size-4" aria-hidden />}>
          Write a review
        </Button>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">{filter ? `${filter}-star reviews (${list.length})` : `Recent reviews`}</p>
          {filter && (
            <button type="button" onClick={() => setFilter(null)} className="text-xs font-semibold text-primary-700 hover:underline dark:text-primary-200">
              Show all
            </button>
          )}
        </div>
        {list.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No {filter}-star reviews yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {list.map((r) => (
              <li key={r.id} className="py-5 first:pt-0">
                <div className="flex items-start gap-3">
                  <Avatar name={r.author} size="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <Rating value={r.rating} size="xs" />
                      <p className="text-sm font-semibold text-foreground">{r.title}</p>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {r.author} · {r.role} · {r.city} · {formatDate(r.date)}
                    </p>
                    {r.verified && (
                      <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-success">
                        <BadgeCheck className="size-3.5" aria-hidden /> Verified purchase
                      </p>
                    )}
                    <p className="mt-2 text-sm leading-relaxed text-foreground">{r.body}</p>
                    <button type="button" disabled={helpful.includes(r.id)} onClick={() => setHelpful((h) => [...h, r.id])} className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground disabled:text-success">
                      <ThumbsUp className="size-3.5" aria-hidden /> Helpful ({r.helpful + (helpful.includes(r.id) ? 1 : 0)})
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <WriteReview open={open} onClose={() => setOpen(false)} productName={productName} />
    </div>
  );
}

function WriteReview({ open, onClose, productName }: { open: boolean; onClose: () => void; productName: string }) {
  const { control, register, handleSubmit, reset, formState } = useForm<ReviewInput>({ resolver: zodResolver(reviewSchema), defaultValues: { rating: 0, title: "", body: "" } });
  const submit = handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 500));
    reset();
    onClose();
    toast({ title: "Thanks for your review!", description: "It will appear after moderation (usually within 24 hours)." });
  });
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Write a review"
      description={productName}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} loading={formState.isSubmitting}>Submit review</Button>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div>
          <p className="mb-1 text-sm font-medium text-foreground">Overall rating</p>
          <Controller control={control} name="rating" render={({ field }) => <StarInput value={field.value} onChange={field.onChange} />} />
          {formState.errors.rating && <p role="alert" className="mt-1 text-xs font-medium text-danger">{formState.errors.rating.message}</p>}
        </div>
        <Input label="Title" placeholder="e.g. Good quality, fast delivery" error={formState.errors.title?.message} {...register("title")} />
        <Textarea label="Your review" rows={5} placeholder="How was the quality, packaging and delivery to site?" error={formState.errors.body?.message} {...register("body")} />
      </form>
    </Modal>
  );
}

export function QuestionsAnswers({ questions }: { questions: Question[] }) {
  const [q, setQ] = useState("");
  const [err, setErr] = useState<string>();
  const [asked, setAsked] = useState<string[]>([]);
  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const p = questionSchema.safeParse({ question: q });
          if (!p.success) return setErr(p.error.issues[0]?.message);
          setErr(undefined);
          setAsked((a) => [p.data.question, ...a]);
          setQ("");
          toast({ title: "Question submitted", description: "Our materials team usually answers within a few hours." });
        }}
        className="flex flex-col gap-2 sm:flex-row"
      >
        <Input containerClassName="flex-1" aria-label="Ask a question" placeholder="Have a question? e.g. Is this suitable for coastal areas?" value={q} onChange={(e) => setQ(e.target.value)} error={err} />
        <Button type="submit">Ask</Button>
      </form>
      <ul className="divide-y divide-border">
        {asked.map((a) => (
          <li key={a} className="py-4">
            <p className="text-sm font-semibold text-foreground">Q: {a}</p>
            <p className="mt-1 text-xs text-accent-700">Awaiting answer</p>
          </li>
        ))}
        {questions.map((x) => (
          <li key={x.id} className="py-4">
            <p className="text-sm font-semibold text-foreground">Q: {x.question}</p>
            <p className="mt-1.5 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">A:</span> {x.answer}
            </p>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {x.answeredBy} · {formatDate(x.date)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
