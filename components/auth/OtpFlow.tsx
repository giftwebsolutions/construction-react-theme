"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { toast } from "@/store/toast";
import { OtpInput } from "./AuthParts";

/** Phone → 6-digit OTP (auto-advance boxes, 30s resend timer) → verify. */
export function OtpFlow({ next, initialPhone, autoSend = false }: { next: string; initialPhone?: string; autoSend?: boolean }) {
  const router = useRouter();
  const [phone, setPhone] = useState(initialPhone ?? "");
  const [sentTo, setSentTo] = useState<string | null>(autoSend && initialPhone ? `+971 •• ••• ${initialPhone.slice(-4)}` : null);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(autoSend ? 30 : 0);

  useEffect(() => {
    if (timer <= 0) return;
    const t = setTimeout(() => setTimer((x) => x - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  const send = async () => {
    setLoading(true);
    setError(undefined);
    const res = await fetch("/api/auth/otp", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "send", phone }) });
    const d = await res.json();
    setLoading(false);
    if (!res.ok) return setError(d.error);
    setSentTo(d.maskedPhone);
    setTimer(30);
    toast({ tone: "info", title: "OTP sent", description: "Demo code: 123456" });
  };

  const verify = async (code = otp) => {
    if (code.length !== 6) return setError("Enter the 6-digit code");
    setLoading(true);
    const res = await fetch("/api/auth/otp", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: "verify", phone, otp: code }) });
    const d = await res.json();
    setLoading(false);
    if (!res.ok) return setError(d.error);
    toast({ title: "Verified successfully" });
    router.push(next);
    router.refresh();
  };

  if (!sentTo)
    return (
      <form onSubmit={(e) => { e.preventDefault(); send(); }} className="space-y-4" noValidate>
        <Input label="Mobile number" inputMode="tel" autoComplete="tel" inputSize="lg" leftIcon={<span className="text-sm font-semibold text-foreground">+971</span>} className="pl-12" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, "").slice(0, 10))} error={error} />
        <Button type="submit" size="lg" fullWidth loading={loading} loadingText="Sending…">Send OTP</Button>
      </form>
    );

  return (
    <form onSubmit={(e) => { e.preventDefault(); verify(); }} className="space-y-5" noValidate>
      <p className="text-sm text-muted-foreground">
        Enter the 6-digit code sent to <strong className="text-foreground">{sentTo}</strong>{" "}
        {!initialPhone && <button type="button" onClick={() => { setSentTo(null); setOtp(""); }} className="font-semibold text-primary-700 hover:underline dark:text-primary-200">Change</button>}
      </p>
      <OtpInput value={otp} autoFocus error={error} onChange={(v) => { setOtp(v); setError(undefined); if (v.length === 6) verify(v); }} />
      <Button type="submit" size="lg" fullWidth loading={loading} loadingText="Verifying…">Verify & continue</Button>
      <p className="text-center text-sm text-muted-foreground" aria-live="polite">
        {timer > 0 ? <>Resend code in <strong className="tabular-nums text-foreground">0:{String(timer).padStart(2, "0")}</strong></> : <button type="button" onClick={send} className="font-semibold text-primary-700 hover:underline dark:text-primary-200">Resend code</button>}
      </p>
    </form>
  );
}
