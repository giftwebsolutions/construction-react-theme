import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Login", robots: { index: false } };

const safeNext = (n?: string) => (n && n.startsWith("/") && !n.startsWith("//") ? n : "/account");

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <AuthShell title="Login to Smart-MEP" subtitle="Track orders, manage site addresses and get project pricing.">
      <LoginForm next={safeNext(next)} />
    </AuthShell>
  );
}
