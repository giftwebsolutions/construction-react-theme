import { buildSmartCatalogue } from "./smart-catalogue";
import type { MaterialType, Product } from "@/types";
import { fromINR, slugify } from "@/lib/utils/format";
import { hashString, seeded } from "@/lib/utils/random";
import { unitLabel } from "@/lib/utils/units";
import { legacyCategories as categories, attributeLabel } from "./categories";
import { brands } from "./brands";
import type { ProductSeed } from "./seed/types";
import { cement } from "./seed/cement";
import { steel } from "./seed/steel";
import { bricks } from "./seed/bricks";
import { aggregates } from "./seed/aggregates";
import { tiles } from "./seed/tiles";
import { paint } from "./seed/paint";
import { waterproofing } from "./seed/waterproofing";
import { plumbing } from "./seed/plumbing";
import { electrical } from "./seed/electrical";
import { sanitary } from "./seed/sanitary";
import { wood } from "./seed/wood";
import { doorsWindows } from "./seed/doors-windows";
import { roofing } from "./seed/roofing";
import { hardware } from "./seed/hardware";
import { tools } from "./seed/tools";
import { safety } from "./seed/safety";

/** Fixed reference date keeps mock "new arrivals" deterministic across renders. */
export const CATALOGUE_DATE = new Date("2026-09-20T00:00:00+04:00");

const SEEDS: [MaterialType, ProductSeed[]][] = [
  ["cement", cement],
  ["steel", steel],
  ["bricks", bricks],
  ["aggregates", aggregates],
  ["tiles", tiles],
  ["paint", paint],
  ["waterproofing", waterproofing],
  ["plumbing", plumbing],
  ["electrical", electrical],
  ["sanitary", sanitary],
  ["wood", wood],
  ["doors-windows", doorsWindows],
  ["roofing", roofing],
  ["hardware", hardware],
  ["tools", tools],
  ["safety", safety],
];

const TYPE_CODE: Record<MaterialType, string> = {
  cement: "CEM", steel: "STL", bricks: "BRK", aggregates: "AGG", tiles: "TIL", paint: "PNT",
  waterproofing: "WPF", plumbing: "PLB", electrical: "ELC", sanitary: "SAN", wood: "WOD",
  "doors-windows": "DWG", roofing: "ROF", hardware: "HDW", tools: "TLS", safety: "SFT",
};

const DAY = 86_400_000;
/** UAE standard VAT rate applies to all building materials. */
const VAT_RATE = 5;
const PHOTOS_PER_TYPE = 6;

function attrToString(v: Product["attributes"][string]) {
  return Array.isArray(v) ? v.join(", ") : String(v);
}

function buildDescription(seed: ProductSeed, brandName: string, categoryName: string, unit: string) {
  const hl = seed.highlights?.length ? ` Key benefits include ${seed.highlights.map((h) => h.toLowerCase()).join(", ")}.` : "";
  return [
    `${seed.short}${hl}`,
    `Sourced directly from ${brandName}'s authorised distribution network, every unit ships with a VAT invoice and full manufacturer warranty. Prices shown are per ${unit} and include VAT; bulk tiers apply automatically in your cart.`,
    `Smart-MEP stocks ${categoryName.toLowerCase()} at regional warehouses for fast site delivery. Need a larger quantity or a project rate? Use "Request Bulk Quote" and our materials team will respond within 2 working hours.`,
  ].join("\n\n");
}

/** Seeds are authored in INR; convert every money field to AED before anything else reads it. */
function toAEDSeed(seed: ProductSeed): ProductSeed {
  return {
    ...seed,
    price: fromINR(seed.price),
    mrp: fromINR(seed.mrp),
    tiers: seed.tiers?.map(([q, p]) => [q, fromINR(p)] as [number, number]),
    variants: seed.variants?.map((v) => ({
      ...v,
      options: v.options.map((o) => ({ ...o, price: o.price && fromINR(o.price), mrp: o.mrp && fromINR(o.mrp) })),
    })),
  };
}

function buildProducts(): Product[] {
  const out: Product[] = [];
  const usedSlugs = new Set<string>();
  let g = 0;

  for (const [type, seeds] of SEEDS) {
    const category = categories.find((c) => c.materialType === type)!;
    seeds.map(toAEDSeed).forEach((seed, i) => {
      g++;
      const brand = brands.find((b) => b.slug === seed.brand);
      if (!brand) throw new Error(`Unknown brand "${seed.brand}" for ${seed.name}`);
      const sub = category.subCategories.find((s) => s.slug === seed.sub);
      if (!sub) throw new Error(`Unknown sub-category "${seed.sub}" for ${seed.name}`);

      const rand = seeded(hashString(seed.name));
      let slug = slugify(seed.name);
      while (usedSlugs.has(slug)) slug = `${slug}-${g}`;
      usedSlugs.add(slug);

      // The default variant option (matching the listed attribute) sets the headline price.
      let price = seed.price;
      let mrp = seed.mrp;
      for (const v of seed.variants ?? []) {
        const current = seed.attrs[v.key];
        const opt = v.options.find((o) => o.value === current) ?? v.options[0];
        if (opt?.price) {
          price = opt.price;
          mrp = opt.mrp ?? Math.max(mrp, opt.price);
          break;
        }
      }
      const attributes = { ...seed.attrs };
      for (const v of seed.variants ?? []) {
        if (attributes[v.key] === undefined) attributes[v.key] = v.options[0]!.value;
      }

      const min = seed.min ?? 1;
      const step = seed.step ?? 1;
      // 6 photos per material type; rotate so neighbouring products lead with different shots
      const images = [0, 1, 2].map((k) => `/images/products/${type}/${((i + k) % PHOTOS_PER_TYPE) + 1}.jpg`);

      const outOfStock = g % 19 === 7;
      const lowStock = g % 11 === 4;
      const stock = seed.stock ?? (outOfStock ? 0 : lowStock ? min * 3 : Math.round(min * (40 + rand() * 400)));

      const isNew = seed.isNew ?? false;
      const ageDays = isNew ? 3 + Math.floor(rand() * 25) : 45 + Math.floor(rand() * 600);
      const rating = Math.round((3.7 + rand() * 1.25) * 10) / 10;
      const reviewCount = Math.floor(8 + rand() * (seed.isBestSeller ? 2400 : 480));
      const soldCount = Math.floor((seed.isBestSeller ? 900 : 60) + rand() * 1500);

      const specifications: Product["specifications"] = [
        { label: "Brand", value: brand.name },
        ...Object.entries(attributes)
          .filter(([, v]) => attrToString(v) !== "—")
          .map(([k, v]) => ({ label: attributeLabel(k), value: attrToString(v) })),
        ...(seed.specs ?? []).map(([label, value]) => ({ label, value })),
        { label: "Sold per", value: unitLabel(seed.unit) },
        { label: "Minimum order", value: `${min} ${unitLabel(seed.unit, min)}` },
        { label: "VAT rate", value: `${VAT_RATE}%` },
        ...(seed.weightKg ? [{ label: `Weight per ${unitLabel(seed.unit)}`, value: `${seed.weightKg} kg` }] : []),
        { label: "Country of origin", value: "India" },
      ];

      const documents = seed.certs?.length
        ? [
            { label: "Technical Datasheet", url: "/docs/technical-datasheet.pdf" },
            { label: "Test / Compliance Certificate", url: "/docs/test-certificate.pdf" },
          ]
        : [{ label: "Product Brochure", url: "/docs/technical-datasheet.pdf" }];

      out.push({
        id: `prd-${String(g).padStart(3, "0")}`,
        slug,
        name: seed.name,
        sku: `BM-${TYPE_CODE[type]}-${brand.slug.slice(0, 3).toUpperCase()}-${1000 + g}`,
        brandId: brand.id,
        categoryId: category.id,
        subCategoryId: sub.id,
        materialType: type,
        images,
        shortDescription: seed.short,
        description: buildDescription(seed, brand.name, category.name, unitLabel(seed.unit)),
        unit: seed.unit,
        minOrderQty: min,
        stepQty: step,
        price,
        mrp,
        vatRate: VAT_RATE,
        tieredPricing: seed.tiers?.map(([minQty, pricePerUnit]) => ({ minQty, pricePerUnit })),
        variants: seed.variants,
        attributes,
        specifications,
        certifications: seed.certs?.filter(Boolean),
        stock,
        leadTimeDays: seed.lead ?? 3,
        deliveryType: seed.delivery,
        weightKg: seed.weightKg,
        rating,
        reviewCount,
        tags: [category.shortName, sub.name, brand.name, ...(seed.tags ?? [])],
        isNew,
        isFeatured: seed.isFeatured ?? false,
        isBestSeller: seed.isBestSeller ?? false,
        documents,
        highlights: seed.highlights ?? [],
        createdAt: new Date(CATALOGUE_DATE.getTime() - ageDays * DAY).toISOString(),
        soldCount,
      });
    });
  }
  return out;
}

export const products: Product[] = buildSmartCatalogue(buildProducts());
