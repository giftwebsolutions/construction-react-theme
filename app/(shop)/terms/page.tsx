import type { Metadata } from "next";
import { ContentPage } from "@/components/extras/ContentPage";

export const metadata: Metadata = { title: "Terms & Conditions", alternates: { canonical: "/terms" } };

export default function Page() {
  return (
    <ContentPage
      title="Terms & Conditions"
      updated="1 September 2026"
      intro="These sample terms govern use of the Smart-MEP website. Have them reviewed by a qualified professional before launch."
      sections={[
        { id: "orders", heading: "Orders and pricing", body: <p>Prices are in UAE Dirham (AED) and include VAT. Market-linked items (steel, cement) may be re-confirmed before dispatch if prices change significantly; you may cancel without charge in that case.</p> },
        { id: "estimates", heading: "Calculators and estimates", body: <p>Material calculators give indicative quantities using standard thumb rules. Final quantities should be confirmed by a qualified engineer.</p> },
        { id: "credit", heading: "Credit accounts", body: <p>Smart-MEP Credit is available to verified contractors, subject to separate credit terms. Late payments may attract interest and suspension of credit.</p> },
        { id: "liability", heading: "Liability", body: <p>Our liability is limited to the value of the goods supplied. Manufacturer warranties apply as per brand terms.</p> },
        { id: "law", heading: "Governing law", body: <p>These terms are governed by the federal laws of the United Arab Emirates as applied in the Emirate of Dubai, with the courts of Dubai having jurisdiction.</p> },
      ]}
    />
  );
}
