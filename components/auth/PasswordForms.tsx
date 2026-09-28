"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, MailCheck } from "lucide-react";
import type { z } from "zod";
import { forgotPasswordSchema, resetPasswordSchema } from "@/lib/validations";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput, StrengthMeter } from "./AuthParts";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState<string | null>(null);
  const { register, handleSubmit, formState } = useForm<z.infer<typeof forgotPasswordSchema>>({ resolver: zodResolver(forgotPasswordSchema) });
  const onSubmit = handleSubmit(async (v) => {
    await fetch("/api/auth/forgot", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(v) });
    setSent(v.identifier);
  });
  if (sent)
    return (
      <div className="text-center">
        <MailCheck className="mx-auto size-12 text-success" aria-hidden />
        <p className="mt-4 text-sm text-muted-foreground">If an account exists for <strong className="text-foreground">{sent}</strong>, we&apos;ve sent a password reset link. It expires in 30 minutes.</p>
        <ButtonLink href="/reset-password?token=demo" className="mt-6" fullWidth>Open reset link (demo)</ButtonLink>
        <Link href="/login" className="mt-4 inline-block text-sm font-semibold text-primary-700 hover:underline dark:text-primary-200">Back to login</Link>
      </div>
    );
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <Input label="Email or mobile number" inputSize="lg" autoComplete="username" error={formState.errors.identifier?.message} {...register("identifier")} />
      <Button type="submit" size="lg" fullWidth loading={formState.isSubmitting}>Send reset link</Button>
      <p className="text-center text-sm"><Link href="/login" className="font-semibold text-primary-700 hover:underline dark:text-primary-200">Back to login</Link></p>
    </form>
  );
}

export function ResetPasswordForm() {
  const [done, setDone] = useState(false);
  const { register, handleSubmit, control, formState } = useForm<z.infer<typeof resetPasswordSchema>>({ resolver: zodResolver(resetPasswordSchema), defaultValues: { password: "", confirmPassword: "" } });
  const pw = useWatch({ control, name: "password" }) ?? "";
  const onSubmit = handleSubmit(async (v) => {
    const res = await fetch("/api/auth/reset", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(v) });
    if (res.ok) setDone(true);
  });
  if (done)
    return (
      <div className="text-center">
        <CheckCircle2 className="mx-auto size-12 text-success" aria-hidden />
        <p className="mt-4 text-sm text-muted-foreground">Your password has been updated. You can now log in with your new password.</p>
        <ButtonLink href="/login" className="mt-6" fullWidth>Go to login</ButtonLink>
      </div>
    );
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div>
        <PasswordInput label="New password" autoComplete="new-password" error={formState.errors.password?.message} {...register("password")} />
        <StrengthMeter password={pw} />
      </div>
      <PasswordInput label="Confirm new password" autoComplete="new-password" error={formState.errors.confirmPassword?.message} {...register("confirmPassword")} />
      <Button type="submit" size="lg" fullWidth loading={formState.isSubmitting}>Update password</Button>
    </form>
  );
}
