import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth/session";
import { getAddresses } from "@/lib/data";
import { AddressBook } from "@/components/account/AddressBook";

export const metadata: Metadata = { title: "Site Addresses", robots: { index: false } };

export default async function AddressesPage() {
  const user = (await getSessionUser())!;
  return (
    <div>
      <h1 className="text-xl font-bold text-foreground sm:text-2xl">Site Addresses</h1>
      <p className="mb-5 mt-1 text-sm text-muted-foreground">Save each construction site with unloading notes so drivers find the right gate.</p>
      <AddressBook initial={await getAddresses(user.id)} />
    </div>
  );
}
