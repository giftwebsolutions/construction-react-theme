import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth/session";
import { ProfileForm } from "@/components/account/ProfileForms";

export const metadata: Metadata = { title: "Profile", robots: { index: false } };

export default async function ProfilePage() {
  const user = (await getSessionUser())!;
  return (
    <div>
      <h1 className="mb-5 text-xl font-bold text-foreground sm:text-2xl">Profile & VAT</h1>
      <ProfileForm user={user} />
    </div>
  );
}
