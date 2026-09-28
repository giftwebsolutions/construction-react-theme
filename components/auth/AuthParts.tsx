"use client";

import { useRef, useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { passwordStrength } from "@/lib/utils/validators";
import { cn } from "@/lib/utils/cn";

export function PasswordInput({ label = "Password", error, hint, ...props }: Omit<ComponentProps<typeof Input>, "type" | "rightSlot">) {
  const [show, setShow] = useState(false);
  return (
    <Input
      label={label}
      type={show ? "text" : "password"}
      error={error}
      hint={hint}
      rightSlot={
        <button type="button" onClick={() => setShow((s) => !s)} className="flex size-10 items-center justify-center rounded-md text-muted-foreground hover:text-foreground" aria-label={show ? "Hide password" : "Show password"} aria-pressed={show}>
          {show ? <EyeOff className="size-4.5" aria-hidden /> : <Eye className="size-4.5" aria-hidden />}
        </button>
      }
      {...props}
    />
  );
}

export function StrengthMeter({ password }: { password: string }) {
  if (!password) return null;
  const { score, label } = passwordStrength(password);
  const colors = ["bg-danger", "bg-danger", "bg-accent-500", "bg-success", "bg-success"];
  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={cn("h-1.5 flex-1 rounded-full", i < score ? colors[score] : "bg-neutral-200 dark:bg-surface-muted")} />
        ))}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Password strength: <strong className="text-foreground">{label}</strong>
      </p>
    </div>
  );
}

/** Six single-digit boxes with auto-advance, backspace-to-previous and paste support. */
export function OtpInput({ value, onChange, error, autoFocus }: { value: string; onChange: (v: string) => void; error?: string; autoFocus?: boolean }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] ?? "");
  const setAt = (i: number, d: string) => {
    const next = digits.slice();
    next[i] = d;
    onChange(next.join("").slice(0, 6));
  };
  return (
    <div>
      <div className="flex justify-between gap-2" role="group" aria-label="One-time password">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            value={d}
            autoFocus={autoFocus && i === 0}
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            maxLength={1}
            aria-label={`Digit ${i + 1}`}
            aria-invalid={!!error}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "");
              if (!v) return setAt(i, "");
              if (v.length > 1) {
                onChange(v.slice(0, 6));
                refs.current[Math.min(v.length, 5)]?.focus();
                return;
              }
              setAt(i, v);
              refs.current[i + 1]?.focus();
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
              if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
              if (e.key === "ArrowRight" && i < 5) refs.current[i + 1]?.focus();
            }}
            onPaste={(e) => {
              const v = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
              if (!v) return;
              e.preventDefault();
              onChange(v);
              refs.current[Math.min(v.length, 5)]?.focus();
            }}
            className={cn(
              "h-14 w-full min-w-0 rounded-xl border bg-surface text-center font-display text-2xl font-bold text-foreground focus:outline-none focus:ring-3 sm:h-16",
              error ? "border-danger focus:ring-danger/15" : "border-border focus:border-primary-600 focus:ring-primary-600/15",
            )}
          />
        ))}
      </div>
      {error && <p role="alert" className="mt-2 text-xs font-medium text-danger">{error}</p>}
    </div>
  );
}

export function SocialLogin() {
  return (
    <>
      <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or continue with <span className="h-px flex-1 bg-border" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button type="button" className="flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-surface text-sm font-semibold text-foreground hover:bg-surface-muted" title="Social login is not configured in this demo">
          <svg viewBox="0 0 24 24" className="size-4.5" aria-hidden><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8Z"/><path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.3v3.1A12 12 0 0 0 12 24Z"/><path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1Z"/><path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.3 6.6l4 3.1c.9-2.9 3.6-4.9 6.7-4.9Z"/></svg>
          Google
        </button>
        <button type="button" className="flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-surface text-sm font-semibold text-foreground hover:bg-surface-muted" title="Social login is not configured in this demo">
          <svg viewBox="0 0 24 24" className="size-4.5 fill-current" aria-hidden><path d="M16.4 12.6c0-2.5 2-3.7 2.1-3.7a4.6 4.6 0 0 0-3.6-2c-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.8a4.9 4.9 0 0 0-4.1 2.5c-1.8 3.1-.5 7.6 1.3 10.1.8 1.2 1.8 2.6 3.1 2.5 1.3 0 1.7-.8 3.3-.8 1.5 0 1.9.8 3.3.8 1.4 0 2.2-1.2 3-2.5a10 10 0 0 0 1.4-2.8 4.4 4.4 0 0 1-2.7-4.2ZM14 5.3A4.4 4.4 0 0 0 15 2a4.6 4.6 0 0 0-3 1.5 4.2 4.2 0 0 0-1 3.2 3.8 3.8 0 0 0 3-1.4Z"/></svg>
          Apple
        </button>
      </div>
    </>
  );
}
