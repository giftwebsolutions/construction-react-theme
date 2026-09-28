import { Skeleton, SkeletonText } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="container-page py-6" role="status" aria-label="Loading product">
      <Skeleton className="h-4 w-64" />
      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-full" />
          <SkeletonText lines={2} />
          <Skeleton className="h-24 w-full rounded-xl" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-11 w-20" />)}
          </div>
          <Skeleton className="h-40 w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
