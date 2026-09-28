import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { OtpFlow } from "@/components/auth/OtpFlow";

export const metadata: Metadata = { title: "Verify Mobile Number", robots: { index: false } };

export default async function VerifyOtpPage({ searchParams }: { searchParams: Promise<{ phone?: string; next?: string }> }) {
  const { phone, next } = await searchParams;
  return (
    <AuthShell title="Verify your mobile number" subtitle="We sent a 6-digit code by SMS. (Demo code: 123456)">
      <OtpFlow next={next && next.startsWith("/") && !next.startsWith("//") ? next : "/account"} initialPhone={phone} autoSend={!!phone} />
    </AuthShell>
  );
}
