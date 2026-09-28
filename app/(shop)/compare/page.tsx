import type { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CompareTable } from "@/components/extras/CompareTable";

export const metadata: Metadata = { title: "Compare Products", robots: { index: false } };

export default function ComparePage() {
  return (
    <div className="container-page py-4 lg:py-6">
      <Breadcrumb items={[{ label: "Compare" }]} />
      <h1 className="mb-5 mt-3 text-2xl font-bold text-foreground sm:text-3xl">Compare Products</h1>
      <CompareTable />
    </div>
  );
}
