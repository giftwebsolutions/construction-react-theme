import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { WishlistGrid } from "@/components/account/WishlistClient";

export const metadata: Metadata = { title: "Wishlist", robots: { index: false } };

export default function WishlistPage() {
  return (
    <div className="container-page py-4 lg:py-6">
      <Breadcrumb items={[{ label: "Wishlist" }]} />
      <h1 className="mb-5 mt-3 text-2xl font-bold text-foreground sm:text-3xl">My Wishlist</h1>
      <WishlistGrid />
    </div>
  );
}
