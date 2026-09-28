import type { Metadata } from "next";
import { ContentPage } from "@/components/extras/ContentPage";

export const metadata: Metadata = { title: "Returns & Refunds", alternates: { canonical: "/return-policy" } };

export default function Page() {
  return (
    <ContentPage
      title="Returns & Refunds"
      updated="1 September 2026"
      intro="Construction materials are heavy and often made to order, so returns work a little differently from other online stores."
      sections={[
        { id: "damaged", heading: "Damaged or wrong items", body: <p>Report within 48 hours of delivery with photos. We&apos;ll replace the affected units or refund them in full, including any delivery charge for those units.</p> },
        { id: "unopened", heading: "Unopened items", body: <ul><li>Returnable within 7 days if unopened and in original packaging.</li><li>Return freight is charged at actuals for truck items.</li><li>A 5% restocking fee applies to tiles and sanitaryware.</li></ul> },
        { id: "nonreturnable", heading: "Non-returnable items", body: <ul><li>Cement, sand, aggregates and ready-mix concrete once delivered.</li><li>Cut-to-size steel, glass, roofing sheets and boards.</li><li>Tinted paints and custom-made doors and windows.</li></ul> },
        { id: "refunds", heading: "Refund timelines", body: <p>Refunds are issued to the original payment method within 5–7 working days of approval. BuildMart Credit refunds are adjusted against your next statement.</p> },
      ]}
    />
  );
}
