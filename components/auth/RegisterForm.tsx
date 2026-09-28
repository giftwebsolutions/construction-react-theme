"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, HardHat, User } from "lucide-react";
import type { z } from "zod";
import { registerSchema } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { Checkbox, RadioCard } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { isValidTRN } from "@/lib/utils/validators";
import { PasswordInput, SocialLogin, StrengthMeter } from "./AuthParts";

type FormIn = z.input<typeof registerSchema>;
type FormOut = z.output<typeof registerSchema>;

export function RegisterForm({ next, initialType }: { next: string; initialType: "individual" | "contractor" | "business" }) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const { register, handleSubmit, control, formState } = useForm<FormIn, unknown, FormOut>({
    resolver: zodResolver(registerSchema),
    defaultValues: { accountType: initialType, name: "", email: "", phone: "", company: "", trn: "", password: "", confirmPassword: "" },
  });
  const type = useWatch({ control, name: "accountType" });
  const password = useWatch({ control, name: "password" }) ?? "";
  const trn = useWatch({ control, name: "trn" }) ?? "";
  const e = formState.errors;

  const onSubmit = handleSubmit(async (values) => {
    setError(undefined);
    const res = await fetch("/api/auth/register", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(values) });
    const d = await res.json();
    if (!res.ok) return setError(d.error);
    router.push(`/verify-otp?phone=${d.phone}&next=${encodeURIComponent(next)}`);
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {error && <p role="alert" className="rounded-lg bg-danger-50 px-3 py-2.5 text-sm font-medium text-danger">{error}</p>}
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-foreground">I am a</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          <RadioCard value="individual" icon={<User />} label="Individual" description="Home builder" {...register("accountType")} />
          <RadioCard value="contractor" icon={<HardHat />} label="Contractor" description="Project pricing & credit" {...register("accountType")} />
          <RadioCard value="business" icon={<Briefcase />} label="Business" description="VAT invoice" {...register("accountType")} />
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Full name" autoComplete="name" required error={e.name?.message} containerClassName="sm:col-span-2" {...register("name")} />
        <Input label="Email" type="email" autoComplete="email" required error={e.email?.message} {...register("email")} />
        <Input label="Mobile number" inputMode="tel" autoComplete="tel" required error={e.phone?.message} {...register("phone")} />
        {type !== "individual" && (
          <>
            <Input label={type === "contractor" ? "Firm / company name" : "Registered business name"} required error={e.company?.message} {...register("company")} />
            <Input
              label={`TRN${type === "business" ? "" : " (optional)"}`}
              required={type === "business"}
              maxLength={15}
              inputMode="numeric"
              error={e.trn?.message}
              hint={trn && isValidTRN(trn) ? "✓ Valid TRN" : "15 digits, e.g. 100234567800003"}
              {...register("trn")}
            />
          </>
        )}
        <div>
          <PasswordInput autoComplete="new-password" required error={e.password?.message} {...register("password")} />
          <StrengthMeter password={password} />
        </div>
        <PasswordInput label="Confirm password" autoComplete="new-password" required error={e.confirmPassword?.message} {...register("confirmPassword")} />
      </div>
      <Checkbox
        label={<>I agree to the <Link href="/terms" className="font-semibold text-primary-700 underline dark:text-primary-200">Terms</Link> and <Link href="/privacy" className="font-semibold text-primary-700 underline dark:text-primary-200">Privacy Policy</Link></>}
        {...register("acceptTerms")}
      />
      {e.acceptTerms && <p role="alert" className="-mt-3 text-xs font-medium text-danger">{e.acceptTerms.message}</p>}
      <Button type="submit" size="lg" fullWidth loading={formState.isSubmitting} loadingText="Creating account…">Create account</Button>
      <SocialLogin />
      <p className="text-center text-sm text-muted-foreground">
        Already have an account? <Link href="/login" className="font-semibold text-primary-700 hover:underline dark:text-primary-200">Login</Link>
      </p>
    </form>
  );
}
