import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/PasswordForms";

export const metadata: Metadata = { title: "Reset Password", robots: { index: false } };

export default function ResetPasswordPage() {
  return (
    <AuthShell title="Set a new password" subtitle="Use at least 8 characters with a mix of letters and numbers.">
      <ResetPasswordForm />
    </AuthShell>
  );
}
