import type { Metadata } from "next";
import { SecurityForms } from "@/components/account/ProfileForms";

export const metadata: Metadata = { title: "Security", robots: { index: false } };

export default function SecurityPage() {
  return (
    <div>
      <h1 className="mb-5 text-xl font-bold text-foreground sm:text-2xl">Security</h1>
      <SecurityForms />
    </div>
  );
}
