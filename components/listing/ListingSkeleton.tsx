import { Skeleton } from "@/components/ui/Skeleton";
import { ProductCardSkeleton } from "@/components/product/ProductCard";

export function ListingSkeleton({ banner = false }: { banner?: boolean }) {
  return (
    <div className="container-page py-6" role="status" aria-label="Loading products">
      <Skeleton className="h-4 w-48" />
      {banner ? <Skeleton className="mt-4 h-40 w-full rounded-2xl" /> : <Skeleton className="mt-4 h-8 w-64" />}
      <div className="mt-6 grid gap-6 lg:grid-cols-[272px_1fr]">
        <div className="hidden space-y-4 rounded-xl border border-border bg-surface p-4 lg:block">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-5/6" />
              <Skeleton className="h-3.5 w-4/6" />
            </div>
          ))}
        </div>
        <div>
          <Skeleton className="mb-4 h-10 w-full lg:ml-auto lg:w-72" />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
