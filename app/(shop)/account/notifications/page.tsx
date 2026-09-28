import type { Metadata } from "next";
import { getSessionUser } from "@/lib/auth/session";
import { getNotifications } from "@/lib/data";
import { NotificationList } from "@/components/account/NotificationList";

export const metadata: Metadata = { title: "Notifications", robots: { index: false } };

export default async function NotificationsPage() {
  const user = (await getSessionUser())!;
  return (
    <div>
      <h1 className="mb-5 text-xl font-bold text-foreground sm:text-2xl">Notifications</h1>
      <NotificationList initial={await getNotifications(user.id)} />
    </div>
  );
}
