import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Lock } from "lucide-react";
import { getSessionUser } from "@/lib/auth/session";
import { getAddresses } from "@/lib/data";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/checkout");
  const addresses = await getAddresses(user.id);
  return (
    <div className="container-page py-4 lg:py-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Checkout</h1>
        <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><Lock className="size-3.5" aria-hidden /> Secure checkout</p>
      </div>
      <CheckoutFlow user={user} savedAddresses={addresses} />
    </div>
  );
}
