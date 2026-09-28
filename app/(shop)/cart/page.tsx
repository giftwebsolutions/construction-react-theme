import type { Metadata } from "next";
import { getBestSellers } from "@/lib/data";
import { toCards } from "@/lib/data/card";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = { title: "Your Cart", robots: { index: false } };

export default async function CartPage() {
  const recs = await getBestSellers(12);
  return (
    <div className="container-page py-4 lg:py-6">
      <Breadcrumb items={[{ label: "Cart" }]} />
      <h1 className="mb-5 mt-3 text-2xl font-bold text-foreground sm:text-3xl">Shopping Cart</h1>
      <CartView recommendations={toCards(recs)} />
    </div>
  );
}
