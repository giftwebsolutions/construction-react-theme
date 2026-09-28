import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { getNotifications } from "@/lib/data";
import { AccountNav } from "@/components/account/AccountNav";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/account");
  const unread = (await getNotifications(user.id)).filter((n) => !n.read).length;
  return (
    <div className="container-page py-4 lg:py-6">
      <div className="mb-4 flex items-center gap-3 lg:mb-6">
        <Avatar name={user.name} initials={user.avatar} size="lg" />
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">Welcome back,</p>
          <p className="truncate font-display text-xl font-bold text-foreground">{user.name}</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <Badge tone="primary" size="md" className="capitalize">{user.accountType}</Badge>
            {user.isVerifiedContractor && <Badge tone="success" size="md">Verified contractor</Badge>}
          </div>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <AccountNav unread={unread} />
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
