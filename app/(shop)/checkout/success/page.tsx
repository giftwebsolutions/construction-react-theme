import type { Metadata } from "next";
import { OrderSuccess } from "@/components/checkout/OrderSuccess";

export const metadata: Metadata = { title: "Order Confirmed", robots: { index: false } };

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams;
  return (
    <div className="container-page py-8 lg:py-12">
      <OrderSuccess orderNumber={order ?? "—"} />
    </div>
  );
}
