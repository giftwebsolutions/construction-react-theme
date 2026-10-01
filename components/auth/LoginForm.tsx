"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Mail, Smartphone } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { toast } from "@/store/toast";
import { OtpFlow } from "./OtpFlow";
import { PasswordInput, SocialLogin } from "./AuthParts";

export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const { register, handleSubmit, formState } = useForm<LoginInput>({ resolver: zodResolver(loginSchema), defaultValues: { identifier: "", password: "", remember: true } });

  const onSubmit = handleSubmit(async (values) => {
    setError(undefined);
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(values) });
    const d = await res.json();
    if (!res.ok) return setError(d.error);
    toast({ title: `Welcome back, ${d.name.split(" ")[0]}!` });
    router.push(next);
    router.refresh();
  });

  return (
    <>
      <p className="mb-5 flex items-start gap-2 rounded-lg bg-primary-50 p-3 text-xs text-primary-800 dark:bg-surface-muted dark:text-primary-100">
        <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
        <span>
          Demo login: <strong>demo@smart-mep.ae</strong> / <strong>Build@123</strong> — or OTP login with <strong>0501234567</strong> and code <strong>123456</strong>.
        </span>
      </p>
      <Tabs defaultValue="password">
        <TabsList variant="pill" aria-label="Login method">
          <TabsTrigger value="password"><Mail className="mr-1.5 inline size-4" aria-hidden />Password</TabsTrigger>
          <TabsTrigger value="otp"><Smartphone className="mr-1.5 inline size-4" aria-hidden />Login with OTP</TabsTrigger>
        </TabsList>
        <TabsContent value="password" className="pt-5">
          <form onSubmit={onSubmit} noValidate className="space-y-4">
            {error && <p role="alert" className="rounded-lg bg-danger-50 px-3 py-2.5 text-sm font-medium text-danger">{error}</p>}
            <Input label="Email or mobile number" autoComplete="username" inputSize="lg" error={formState.errors.identifier?.message} {...register("identifier")} />
            <PasswordInput autoComplete="current-password" inputSize="lg" error={formState.errors.password?.message} {...register("password")} />
            <div className="flex items-center justify-between">
              <Checkbox label="Keep me signed in" {...register("remember")} />
              <Link href="/forgot-password" className="text-sm font-semibold text-primary-700 hover:underline dark:text-primary-200">Forgot password?</Link>
            </div>
            <Button type="submit" size="lg" fullWidth loading={formState.isSubmitting} loadingText="Signing in…">Login</Button>
          </form>
        </TabsContent>
        <TabsContent value="otp" className="pt-5">
          <OtpFlow next={next} />
        </TabsContent>
      </Tabs>
      <SocialLogin />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to Smart-MEP?{" "}
        <Link href={`/register${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-primary-700 hover:underline dark:text-primary-200">Create an account</Link>
      </p>
    </>
  );
}
