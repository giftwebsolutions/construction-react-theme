import type { Metadata } from "next";
import { WishlistGrid } from "@/components/account/WishlistClient";

export const metadata: Metadata = { title: "My Wishlist", robots: { index: false } };

export default function AccountWishlist() {
  return (
    <div>
      <h1 className="mb-4 text-xl font-bold text-foreground sm:text-2xl">Wishlist</h1>
      <WishlistGrid />
    </div>
  );
}
