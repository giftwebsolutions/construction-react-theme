import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { BackToTop } from "@/components/layout/BackToTop";
import { TopBar } from "@/components/layout/TopBar";
import { getCategories, brands } from "@/lib/data";
import { getSessionUser } from "@/lib/auth/session";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const [categories, user] = await Promise.all([getCategories(), getSessionUser()]);
  return (
    <>
      <TopBar />
      <Header categories={categories} brands={brands} user={user ? { name: user.name, email: user.email } : null} />
      <main id="main" className="min-h-[60vh]">
        {children}
      </main>
      <Footer categories={categories} />
      <BottomNav />
      <BackToTop />
    </>
  );
}
