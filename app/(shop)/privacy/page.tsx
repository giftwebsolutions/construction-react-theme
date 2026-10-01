import type { Metadata } from "next";
import { ContentPage } from "@/components/extras/ContentPage";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy" } };

export default function Page() {
  return (
    <ContentPage
      title="Privacy Policy"
      updated="1 September 2026"
      intro="This sample policy describes how a store like Smart-MEP collects and uses personal data. Replace it with a policy reviewed by your legal advisor before going live."
      sections={[
        { id: "collect", heading: "Information we collect", body: <ul><li>Account details: name, mobile, email, company and TRN.</li><li>Delivery details: site addresses and unloading notes.</li><li>Order and payment history (we do not store full card numbers).</li></ul> },
        { id: "use", heading: "How we use it", body: <p>To process orders, arrange deliveries, issue VAT invoices, provide support and, with your consent, send price alerts and offers.</p> },
        { id: "share", heading: "Sharing", body: <p>We share only what&apos;s needed with logistics partners, payment gateways and brands (for warranty). We never sell personal data.</p> },
        { id: "rights", heading: "Your rights", body: <p>You can access, correct or delete your data from your account or by emailing privacy@smart-mep.ae, in line with the Digital Personal Data Protection Act, 2023.</p> },
      ]}
    />
  );
}
