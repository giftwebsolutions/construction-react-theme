import Link from "next/link";
import { Headphones, PackageSearch, Warehouse } from "lucide-react";
import { LanguageSelect } from "./LanguageSelect";
import { LocationSelector } from "./LocationSelector";

export const HELPLINE = "800 284 5362";

export function TopBar() {
  return (
    <div className="hidden bg-primary-900 text-xs text-primary-100 lg:block">
      <div className="container-page flex h-9 items-center justify-between gap-6">
        <LocationSelector />
        <nav aria-label="Utility" className="flex items-center gap-5">
          <Link href="/bulk-enquiry" className="inline-flex items-center gap-1.5 hover:text-white">
            <Warehouse className="size-3.5 text-accent-500" aria-hidden /> Bulk / Project Enquiry
          </Link>
          <Link href="/account/orders" className="inline-flex items-center gap-1.5 hover:text-white">
            <PackageSearch className="size-3.5" aria-hidden /> Track Order
          </Link>
          <a href={`tel:${HELPLINE.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 hover:text-white">
            <Headphones className="size-3.5" aria-hidden /> {HELPLINE} <span className="text-primary-200/70">(8 AM – 8 PM)</span>
          </a>
          <LanguageSelect />
        </nav>
      </div>
    </div>
  );
}
