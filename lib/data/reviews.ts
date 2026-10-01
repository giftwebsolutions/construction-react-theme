import type { CustomerRole, Product, Question, Review } from "@/types";
import { hashString, pick, seeded } from "@/lib/utils/random";
import { CATALOGUE_DATE } from "./products";

const NAMES = [
  "Arun Prakash", "Kavitha R", "Suresh Babu", "Meena Krishnan", "Rajesh Kannan", "Vignesh M",
  "Divya Sundar", "Prakash Rao", "Harini S", "Ganesh Murthy", "Anand Pillai", "Revathi N",
  "Balaji V", "Fathima Begum", "Joseph Thomas", "Sathish Kumar", "Nandhini P", "Vinoth Raj",
];
const CITIES = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Al Ain", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain", "Dubai South", "Musaffah"];
const ROLES: CustomerRole[] = ["Contractor", "Homeowner", "Builder", "Engineer", "Architect", "Homeowner", "Contractor"];

const POSITIVE: [string, string][] = [
  ["Genuine product, delivered on time", "Batch date was recent and the packaging was intact. Delivery slot was honoured and the driver helped with unloading."],
  ["Best price in the area", "Compared with three local dealers — Smart-MEP was cheaper once bulk pricing kicked in, and the VAT invoice was a bonus."],
  ["Quality as described", "Exactly matches the specifications listed. Our site engineer checked the certificate and was satisfied."],
  ["Will order again", "Smooth ordering from my phone at site. Tracking updates were accurate and support answered on WhatsApp quickly."],
  ["Good for our project", "Used this for a G+1 residential project. Consistent quality across all lots we received."],
];
const MIXED: [string, string][] = [
  ["Good product, delivery slightly late", "Material quality is good, but the truck came a day later than promised because of rain. Support kept us informed."],
  ["Decent, packaging could be better", "Product is fine. A couple of units had damaged packaging but the replacement was arranged without fuss."],
];

/** Deterministic mock reviews for a product. */
export function generateReviews(product: Product, count = 8): Review[] {
  const rand = seeded(hashString(product.id + "reviews"));
  return Array.from({ length: count }, (_, i) => {
    const high = rand() < product.rating / 5.2;
    const rating = high ? (rand() < 0.65 ? 5 : 4) : rand() < 0.6 ? 3 : 2;
    const [title, body] = rating >= 4 ? pick(rand, POSITIVE) : pick(rand, MIXED);
    return {
      id: `${product.id}-r${i + 1}`,
      productId: product.id,
      author: pick(rand, NAMES),
      role: pick(rand, ROLES),
      city: pick(rand, CITIES),
      rating,
      title,
      body,
      date: new Date(CATALOGUE_DATE.getTime() - Math.floor(rand() * 240) * 86_400_000).toISOString(),
      verified: rand() > 0.15,
      helpful: Math.floor(rand() * 60),
    };
  }).sort((a, b) => b.date.localeCompare(a.date));
}

/** Star distribution that sums to reviewCount and averages close to rating. */
export function ratingBreakdown(product: Product): { stars: number; count: number }[] {
  const r = product.rating;
  const weights = [
    Math.max(0.02, (r - 3.2) * 0.45),
    Math.max(0.05, 0.32 - Math.abs(r - 4.2) * 0.2),
    0.1,
    0.05,
    0.03,
  ];
  const total = weights.reduce((a, b) => a + b, 0);
  const counts = weights.map((w) => Math.round((w / total) * product.reviewCount));
  return counts.map((count, i) => ({ stars: 5 - i, count }));
}

export function generateQuestions(product: Product): Question[] {
  const rand = seeded(hashString(product.id + "qa"));
  const minOrder = `${product.minOrderQty} ${product.unit}`;
  const qa: [string, string][] = [
    ["Do you deliver to construction sites outside city limits?", `Yes. Choose your site area on this page to see the delivery charge and ETA. ${product.deliveryType === "parcel" ? "This item ships by courier." : "This item is delivered by truck; please ensure vehicle access."}`],
    ["Will I get a VAT invoice for input credit?", "Yes, every order includes a VAT invoice. Add your TRN at checkout to receive a B2B invoice."],
    [`What is the minimum order quantity?`, `The minimum order is ${minOrder}. Bulk pricing applies automatically at higher quantities.`],
    ["Is a test certificate provided?", product.certifications?.length ? `Yes — ${product.certifications.join(", ")} documents are available under the Documents tab, and a lot-specific certificate ships with the order.` : "A product brochure is available under the Documents tab. Contact support for lot-specific documents."],
  ];
  return qa.map(([question, answer], i) => ({
    id: `${product.id}-q${i + 1}`,
    productId: product.id,
    question,
    answer,
    askedBy: pick(rand, NAMES),
    answeredBy: "Smart-MEP Materials Team",
    date: new Date(CATALOGUE_DATE.getTime() - Math.floor(rand() * 180) * 86_400_000).toISOString(),
  }));
}
