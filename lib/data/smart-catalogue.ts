import type { Product } from "@/types";
import { categories, legacyCategories } from "./categories";

/** Preserve relevant template products and assign them to the Smart-MEP taxonomy.
 * Additional equipment entries are mock catalogue data, ready for an API replacement. */
export function buildSmartCatalogue(legacy: Product[]): Product[] {
  const mappings: Record<string, [string, string]> = {
    "cement:ready-mix-concrete": ["civil", "Ready-Mix Concrete"],
    "steel:structural-steel": ["civil", "Structural Steel"],
    "aggregates:aggregate": ["civil", "Coarse Aggregate"],
    "aggregates:gravel": ["civil", "Sub-Base Material"],
    "bricks:paver-blocks": ["civil", "Interlock / Pavers"],
    "electrical:conduits": ["electrical", "Conduits"],
    "electrical:mcbs-and-dbs": ["electrical", "SMDB / DB"],
    "electrical:lighting": ["electrical", "Lighting Fixtures"],
    "plumbing:water-tanks": ["plumbing", "Water Tanks"],
    "plumbing:valves": ["plumbing", "Valves"],
    "plumbing:fittings": ["plumbing", "Pipe Fittings"],
  };
  const output: Product[] = [];
  for (const p of legacy) {
    const old = legacyCategories.flatMap((c) => c.subCategories).find((s) => s.id === p.subCategoryId);
    let target = mappings[p.materialType + ":" + old?.slug];
    if (!target) {
      if (p.materialType === "cement") target = ["civil", "Cement"];
      else if (p.materialType === "steel") target = ["civil", "Reinforcement Steel"];
      else if (p.materialType === "aggregates") target = ["civil", "Fine Aggregate"];
      else if (p.materialType === "bricks") target = ["civil", "Concrete Blocks"];
      else if (p.materialType === "plumbing") target = ["plumbing", old?.slug === "pvc-pipes" ? "Drainage Pipe" : "Potable-Water Pipe"];
      else if (p.materialType === "sanitary") target = ["plumbing", "Sanitary Fixtures"];
      else if (p.materialType === "electrical" && old?.slug === "wires-and-cables") target = ["electrical", "LV Cables"];
      else continue;
    }
    const category = categories.find((c) => c.slug === target[0])!;
    const sub = category.subCategories.find((s) => s.name === target[1])!;
    output.push({ ...p, categoryId: category.id, subCategoryId: sub.id, tags: [category.name, sub.name, ...p.tags] });
  }
  let index = 0;
  for (const category of categories) {
    for (const sub of category.subCategories) {
      if (output.some((p) => p.subCategoryId === sub.id)) continue;
      index++;
      const pipe = /Pipe|Cables|Ductwork|Trays|Conduits/.test(sub.name);
      const bulk = /Aggregate|Sub-Base|Asphalt/.test(sub.name);
      const price = pipe ? 85 : bulk ? 160 : /Chillers|Boarding|Conveyor|Transformers|Generator/.test(sub.name) ? 28500 : /AHU|Pumps|MCC|Switchboards/.test(sub.name) ? 4850 : 180 + index * 35;
      const unit = pipe ? "metre" : bulk ? "tonne" : "piece";
      const name = sub.name + " — Project Series";
      output.push({
        id: "prd-smep-" + sub.slug + "-" + category.slug, slug: category.slug + "-" + sub.slug + "-project-series",
        name, sku: "SMEP-" + String(index).padStart(4, "0"), brandId: "brand-smart-mep",
        categoryId: category.id, subCategoryId: sub.id, materialType: category.materialType,
        images: [category.image, category.banner], shortDescription: sub.name + " for " + category.name.toLowerCase() + " projects. Select quantities and request a project quote.",
        description: "Project-series " + sub.name.toLowerCase() + " supplied through Smart-MEP. Coordinate the final specification, installation requirements and lead time with our project team before ordering.",
        unit, minOrderQty: 1, stepQty: 1, price, mrp: Math.round(price * 1.15), vatRate: 5,
        tieredPricing: [{ minQty: 10, pricePerUnit: Math.round(price * 0.95) }, { minQty: 50, pricePerUnit: Math.round(price * 0.9) }],
        attributes: { application: category.name, type: sub.name, grade: "Project Series" },
        specifications: [{ label: "Product type", value: sub.name }, { label: "Application", value: category.name }, { label: "Series", value: "Project Series" }, { label: "Sold per", value: unit }],
        stock: 100, leadTimeDays: price > 10000 ? 14 : 5, deliveryType: price > 4000 || bulk ? "truck" : "parcel",
        rating: 4.5, reviewCount: 12, tags: [category.name, sub.name], isNew: true, isFeatured: true, isBestSeller: index % 3 === 0,
        highlights: ["Project quantity pricing", "VAT invoice", "Delivery to your site"],
        createdAt: "2026-09-20T00:00:00+04:00", soldCount: 100 + index,
      });
    }
  }
  return output;
}
