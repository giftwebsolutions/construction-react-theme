import { PackageSearch } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ShopNotFound() {
  return (
    <div className="container-page py-10">
      <div className="rounded-2xl border border-border bg-surface">
        <EmptyState
          icon={<PackageSearch aria-hidden />}
          title="We couldn't find that page"
          description="The product or page may have moved or is no longer available. Try searching or browse our categories."
          actions={
            <>
              <ButtonLink href="/categories">Browse categories</ButtonLink>
              <ButtonLink href="/search" variant="outline">Search products</ButtonLink>
            </>
          }
        />
      </div>
    </div>
  );
}
