"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { emailSchema } from "@/lib/validations";
import { cn } from "@/lib/utils/cn";

export function NewsletterForm({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState<string>();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const p = emailSchema.safeParse(email);
    if (!p.success) return setError("Enter a valid email address");
    setError(undefined);
    setState("loading");
    await fetch("/api/newsletter", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: p.data }) });
    setState("done");
  };

  if (state === "done")
    return (
      <p role="status" className={cn("flex items-center gap-2 text-sm font-medium", tone === "dark" ? "text-white" : "text-foreground", className)}>
        <CheckCircle2 className="size-5 text-success" aria-hidden /> You&apos;re subscribed. Watch for weekly price updates!
      </p>
    );

  return (
    <form onSubmit={submit} noValidate className={className}>
      <div className="flex gap-2">
        <label htmlFor={`nl-${tone}`} className="sr-only">
          Email address
        </label>
        <input
          id={`nl-${tone}`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          aria-invalid={!!error}
          className={cn(
            "h-12 min-w-0 flex-1 rounded-lg px-4 text-base focus:outline-none focus:ring-3 sm:text-sm",
            tone === "dark" ? "border border-white/20 bg-white/10 text-white placeholder:text-primary-200 focus:ring-accent-500/40" : "border border-border bg-surface text-foreground focus:ring-primary-600/15",
          )}
        />
        <button type="submit" disabled={state === "loading"} className="inline-flex h-12 items-center gap-2 rounded-lg bg-accent-500 px-5 text-sm font-semibold text-neutral-900 hover:bg-accent-400 disabled:opacity-60">
          <Send className="size-4" aria-hidden /> <span className="hidden sm:inline">Subscribe</span>
        </button>
      </div>
      {error && <p role="alert" className="mt-2 text-xs font-medium text-red-300">{error}</p>}
    </form>
  );
}
