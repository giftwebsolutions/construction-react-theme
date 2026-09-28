import type { Metadata } from "next";
import { ContentPage } from "@/components/extras/ContentPage";

export const metadata: Metadata = { title: "Shipping & Delivery Policy", alternates: { canonical: "/shipping-policy" } };

export default function Page() {
  return (
    <ContentPage
      title="Shipping & Delivery Policy"
      updated="1 September 2026"
      intro="We deliver construction materials by truck to your site and by parcel to your door. This policy explains timelines, charges and what we need from you on delivery day."
      sections={[
        { id: "modes", heading: "Delivery modes", body: <><p><strong>Truck delivery</strong> is used for cement, steel, sand, aggregates, bricks, blocks and large tiles or boards. It includes unloading to ground level.</p><p><strong>Parcel delivery</strong> is used for paints, electricals, plumbing, hardware, tools and safety gear.</p></> },
        { id: "charges", heading: "Charges", body: <ul><li>Parcel: free above AED 100, otherwise AED 5.</li><li>Truck: free above AED 2,500; otherwise AED 35 (up to 1 tonne), AED 65 (up to 5 tonnes), AED 110 (above 5 tonnes).</li><li>Floor-level delivery, crane or long-carry charges are quoted in advance.</li></ul> },
        { id: "timelines", heading: "Timelines", body: <p>Most orders dispatch within 1–3 working days. Estimated delivery dates show on each product page after you choose your delivery area, and at checkout.</p> },
        { id: "site", heading: "Site access", body: <ul><li>Ensure the truck can reach within 20 m of the unloading point.</li><li>Someone must be present to receive and count the material.</li><li>Add unloading notes to your site address to help our driver.</li></ul> },
        { id: "shortage", heading: "Shortage or damage", body: <p>Count and inspect material on arrival. Note any shortage or damage on the delivery challan and report within 48 hours with photos.</p> },
      ]}
    />
  );
}
