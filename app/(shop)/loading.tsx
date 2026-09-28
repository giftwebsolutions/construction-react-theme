import { Skeleton } from "@/components/ui/Skeleton";
import { ProductCardSkeleton } from "@/components/product/ProductCard";

export default function Loading() {
  return (
    <div className="container-page py-6" role="status" aria-label="Loading">
      <Skeleton className="aspect-[4/5] w-full rounded-2xl sm:aspect-[16/6]" />
      <Skeleton className="mt-8 h-7 w-48" />
      <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    </div>
  );
}
