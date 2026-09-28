import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Create Account" };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string; type?: string }> }) {
  const { next, type } = await searchParams;
  const initialType = type === "contractor" || type === "business" ? type : "individual";
  return (
    <AuthShell title="Create your account" subtitle="Free forever. Contractors and businesses unlock credit and VAT invoicing.">
      <RegisterForm next={next && next.startsWith("/") && !next.startsWith("//") ? next : "/account"} initialType={initialType} />
    </AuthShell>
  );
}
