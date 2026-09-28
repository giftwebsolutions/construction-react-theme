import type { Metadata } from "next";
import { Search } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-dvh flex-col bg-background">
      <div className="container-page py-5">
        <Logo />
      </div>
      <div className="container-page flex flex-1 flex-col items-center justify-center pb-20 text-center">
        <div className="relative mb-8">
          <p className="font-display text-[7rem] font-extrabold leading-none tracking-tighter text-primary-100 sm:text-[10rem] dark:text-surface-muted" aria-hidden>
            404
          </p>
          <div className="absolute inset-x-0 bottom-3 mx-auto h-3 w-40 rounded-full bg-[repeating-linear-gradient(45deg,#F59E0B_0_12px,#0A1F44_12px_24px)] sm:w-56" aria-hidden />
        </div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">This page is still under construction</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Try searching for a material or head back to the store.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" variant="primary" size="lg">
            Back to home
          </ButtonLink>
          <ButtonLink href="/products" variant="outline" size="lg" leftIcon={<Search className="size-4" aria-hidden />}>
            Browse all products
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
