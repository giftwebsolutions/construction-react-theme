"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Laptop, Smartphone } from "lucide-react";
import type { z } from "zod";
import type { User } from "@/types";
import { changePasswordSchema, profileSchema } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { PasswordInput, StrengthMeter } from "@/components/auth/AuthParts";
import { isValidTRN } from "@/lib/utils/validators";
import { toast } from "@/store/toast";

export function ProfileForm({ user }: { user: User }) {
  const { register, handleSubmit, control, formState } = useForm<z.input<typeof profileSchema>, unknown, z.output<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, email: user.email, phone: user.phone, company: user.company ?? "", trn: user.trn ?? "" },
  });
  const trn = useWatch({ control, name: "trn" }) ?? "";
  const e = formState.errors;
  const onSubmit = handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 500));
    toast({ title: "Profile updated" });
  });
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <section className="rounded-xl border border-border bg-surface p-5 shadow-card">
        <h2 className="text-base font-bold text-foreground">Personal information</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input label="Full name" error={e.name?.message} {...register("name")} />
          <Input label="Email" type="email" error={e.email?.message} {...register("email")} />
          <Input label="Mobile number" inputMode="tel" error={e.phone?.message} hint="Verified ✓" {...register("phone")} />
        </div>
      </section>
      <section className="rounded-xl border border-border bg-surface p-5 shadow-card">
        <h2 className="text-base font-bold text-foreground">Business & VAT details</h2>
        <p className="mt-1 text-sm text-muted-foreground">Used on VAT invoices so you can claim input tax credit.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input label="Company / firm name" {...register("company")} />
          <Input label="TRN" maxLength={15} inputMode="numeric" error={e.trn?.message} hint={trn && isValidTRN(trn) ? "✓ Valid TRN" : "15 digits, e.g. 100234567800003"} {...register("trn")} />
        </div>
      </section>
      <section className="rounded-xl border border-border bg-surface p-5 shadow-card">
        <h2 className="text-base font-bold text-foreground">Communication preferences</h2>
        <div className="mt-3 space-y-1">
          <Checkbox label="Order & delivery updates on WhatsApp" defaultChecked />
          <Checkbox label="Weekly cement & steel price alerts" defaultChecked />
          <Checkbox label="Offers and new product launches" />
        </div>
      </section>
      <Button type="submit" loading={formState.isSubmitting}>Save changes</Button>
    </form>
  );
}

export function SecurityForms() {
  const { register, handleSubmit, control, reset, formState } = useForm<z.infer<typeof changePasswordSchema>>({ resolver: zodResolver(changePasswordSchema), defaultValues: { current: "", password: "", confirmPassword: "" } });
  const pw = useWatch({ control, name: "password" }) ?? "";
  const [sessions, setSessions] = useState([
    { id: "s1", icon: Laptop, device: "Chrome on macOS", place: "Dubai, UAE", when: "Active now", current: true },
    { id: "s2", icon: Smartphone, device: "BuildMart app · Android", place: "Sharjah, UAE", when: "2 hours ago", current: false },
    { id: "s3", icon: Smartphone, device: "Safari on iPhone", place: "Abu Dhabi, UAE", when: "3 days ago", current: false },
  ]);
  const onSubmit = handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 500));
    reset();
    toast({ title: "Password changed", description: "Other devices have been signed out." });
  });
  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} noValidate className="rounded-xl border border-border bg-surface p-5 shadow-card">
        <h2 className="text-base font-bold text-foreground">Change password</h2>
        <div className="mt-4 grid gap-4 sm:max-w-md">
          <PasswordInput label="Current password" autoComplete="current-password" error={formState.errors.current?.message} {...register("current")} />
          <div>
            <PasswordInput label="New password" autoComplete="new-password" error={formState.errors.password?.message} {...register("password")} />
            <StrengthMeter password={pw} />
          </div>
          <PasswordInput label="Confirm new password" autoComplete="new-password" error={formState.errors.confirmPassword?.message} {...register("confirmPassword")} />
        </div>
        <Button type="submit" className="mt-5" loading={formState.isSubmitting}>Update password</Button>
      </form>
      <section className="rounded-xl border border-border bg-surface p-5 shadow-card">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-bold text-foreground">Active sessions</h2>
          {sessions.length > 1 && <Button variant="ghost" size="sm" className="text-danger" onClick={() => { setSessions((s) => s.filter((x) => x.current)); toast({ title: "Signed out of other devices" }); }}>Sign out all others</Button>}
        </div>
        <ul className="mt-3 divide-y divide-border">
          {sessions.map((s) => (
            <li key={s.id} className="flex items-center gap-3 py-3">
              <s.icon className="size-5 text-muted-foreground" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{s.device} {s.current && <span className="ml-1 text-xs font-semibold text-success">· This device</span>}</p>
                <p className="text-xs text-muted-foreground">{s.place} · {s.when}</p>
              </div>
              {!s.current && <Button variant="outline" size="sm" onClick={() => setSessions((x) => x.filter((y) => y.id !== s.id))}>Sign out</Button>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
