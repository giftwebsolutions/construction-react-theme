"use client";

import { useEffect } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <main id="main" className="container-page flex min-h-[70dvh] flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-accent-100 text-accent-700">
        <TriangleAlert className="size-9" aria-hidden />
      </div>
      <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
      <p className="mt-2 max-w-md text-muted-foreground">We couldn&apos;t load this page. It&apos;s usually temporary — please try again.</p>
      {error.digest && <p className="mt-2 font-mono text-xs text-muted-foreground">Ref: {error.digest}</p>}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset} size="lg" leftIcon={<RotateCcw className="size-4" aria-hidden />}>
          Try again
        </Button>
        <ButtonLink href="/" variant="outline" size="lg">
          Go to home
        </ButtonLink>
      </div>
    </main>
  );
}
