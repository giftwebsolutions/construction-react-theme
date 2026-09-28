import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/PasswordForms";

export const metadata: Metadata = { title: "Forgot Password", robots: { index: false } };

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Forgot your password?" subtitle="Enter your email or mobile and we'll send you a reset link.">
      <ForgotPasswordForm />
    </AuthShell>
  );
}
