/* ============================================================================
   Material estimators. Rule-of-thumb figures used by Indian site engineers;
   results are estimates and the UI labels them as such.
============================================================================ */

export type CalculatorType = "cement" | "bricks" | "tiles" | "paint" | "steel" | "sand";

export interface EstimateLine {
  label: string;
  value: number;
  unit: string;
  hint?: string;
}

const round = (n: number, d = 0) => {
  const f = 10 ** d;
  return Math.round(n * f) / f;
};

/* ------------------------------- Concrete -------------------------------- */

export const CONCRETE_MIXES = {
  M10: { label: "M10 (1:3:6)", ratio: [1, 3, 6] },
  M15: { label: "M15 (1:2:4)", ratio: [1, 2, 4] },
  M20: { label: "M20 (1:1.5:3)", ratio: [1, 1.5, 3] },
  M25: { label: "M25 (1:1:2)", ratio: [1, 1, 2] },
} as const;
export type ConcreteGrade = keyof typeof CONCRETE_MIXES;

const DRY_VOLUME_FACTOR = 1.54;
const CEMENT_BAG_CUM = 0.0347; // 50 kg bag ≈ 0.0347 m³
const CFT_PER_CUM = 35.3147;

/** Concrete volume (m³) → cement bags, sand cft, aggregate cft. */
export function estimateConcrete(volumeCum: number, grade: ConcreteGrade): EstimateLine[] {
  const [c, s, a] = CONCRETE_MIXES[grade].ratio;
  const total = c + s + a;
  const dry = volumeCum * DRY_VOLUME_FACTOR;
  const cementCum = (dry * c) / total;
  return [
    { label: "Cement", value: Math.ceil(cementCum / CEMENT_BAG_CUM), unit: "bags (50 kg)" },
    { label: "Sand", value: round(((dry * s) / total) * CFT_PER_CUM), unit: "cft" },
    { label: "Aggregate (20 mm)", value: round(((dry * a) / total) * CFT_PER_CUM), unit: "cft" },
  ];
}

/** Quick built-up-area thumb rule: ~0.4 bags cement per sq ft for RCC framed houses. */
export function estimateCementByArea(builtUpSqft: number): EstimateLine[] {
  return [
    { label: "Cement", value: Math.ceil(builtUpSqft * 0.4), unit: "bags", hint: "≈ 0.4 bag / sq ft (RCC frame)" },
    { label: "Sand", value: Math.ceil(builtUpSqft * 1.816), unit: "cft", hint: "≈ 1.816 cft / sq ft" },
    { label: "Aggregate", value: Math.ceil(builtUpSqft * 1.35), unit: "cft", hint: "≈ 1.35 cft / sq ft" },
    { label: "Steel", value: Math.ceil(builtUpSqft * 4), unit: "kg", hint: "≈ 4 kg / sq ft" },
  ];
}

/* --------------------------------- Bricks -------------------------------- */

export const BRICK_SIZES = {
  standard: { label: "Standard (190×90×90 mm)", l: 0.19, w: 0.09, h: 0.09 },
  traditional: { label: "Traditional (230×110×75 mm)", l: 0.23, w: 0.11, h: 0.075 },
  aac600: { label: "AAC Block (600×200×200 mm)", l: 0.6, w: 0.2, h: 0.2 },
  aac600x150: { label: "AAC Block (600×200×150 mm)", l: 0.6, w: 0.15, h: 0.2 },
} as const;
export type BrickSize = keyof typeof BRICK_SIZES;

/**
 * Wall (length m × height m × thickness m) → bricks + mortar materials.
 * Mortar joint 10 mm, mortar ratio 1:6, 5% wastage.
 */
export function estimateBricks(lengthM: number, heightM: number, thicknessM: number, size: BrickSize, mortarRatio = 6): EstimateLine[] {
  const b = BRICK_SIZES[size];
  const joint = size.startsWith("aac") ? 0.003 : 0.01;
  const wallVol = lengthM * heightM * thicknessM;
  const unitWithMortar = (b.l + joint) * (b.w + joint) * (b.h + joint);
  const count = wallVol / unitWithMortar;
  const brickVol = count * b.l * b.w * b.h;
  const mortarWet = Math.max(wallVol - brickVol, 0);
  const mortarDry = mortarWet * 1.33;
  const cementCum = mortarDry / (1 + mortarRatio);
  const sandCum = cementCum * mortarRatio;
  return [
    { label: size.startsWith("aac") ? "Blocks" : "Bricks", value: Math.ceil(count * 1.05), unit: "pieces", hint: "incl. 5% wastage" },
    { label: "Cement", value: Math.ceil(cementCum / CEMENT_BAG_CUM), unit: "bags (50 kg)" },
    { label: "Sand", value: round(sandCum * CFT_PER_CUM, 1), unit: "cft" },
  ];
}

/* ---------------------------------- Tiles -------------------------------- */

/** Floor area (sq ft) + tile coverage per box → boxes needed incl. wastage. */
export function estimateTiles(areaSqft: number, coveragePerBoxSqft: number, wastagePct = 10): EstimateLine[] {
  const withWastage = areaSqft * (1 + wastagePct / 100);
  const boxes = Math.ceil(withWastage / coveragePerBoxSqft);
  return [
    { label: "Area incl. wastage", value: round(withWastage, 1), unit: "sq ft", hint: `+${wastagePct}% cutting wastage` },
    { label: "Boxes needed", value: boxes, unit: "boxes" },
    { label: "Tile adhesive", value: Math.ceil(areaSqft / 50), unit: "bags (20 kg)", hint: "≈ 50 sq ft per bag" },
    { label: "Grout", value: Math.ceil(areaSqft / 100), unit: "kg", hint: "≈ 1 kg per 100 sq ft" },
  ];
}

/* ---------------------------------- Paint -------------------------------- */

/** Wall area (sq ft) → litres of paint, primer and putty. */
export function estimatePaint(areaSqft: number, coverageSqftPerLitrePerCoat = 120, coats = 2): EstimateLine[] {
  const paint = (areaSqft * coats) / coverageSqftPerLitrePerCoat;
  return [
    { label: "Paint", value: Math.ceil(paint * 1.05), unit: "litres", hint: `${coats} coats, incl. 5% wastage` },
    { label: "Primer", value: Math.ceil(areaSqft / 110), unit: "litres", hint: "1 coat" },
    { label: "Wall putty", value: Math.ceil(areaSqft / 12), unit: "kg", hint: "2 coats" },
  ];
}

/** Choose the cheapest pack combination for a litre requirement. */
export function packSplit(litres: number, packs: number[] = [20, 10, 4, 1]) {
  const sorted = [...packs].sort((a, b) => b - a);
  let remaining = Math.ceil(litres);
  const result: { size: number; count: number }[] = [];
  for (const size of sorted) {
    const count = Math.floor(remaining / size);
    if (count > 0) {
      result.push({ size, count });
      remaining -= count * size;
    }
  }
  if (remaining > 0) {
    const smallest = sorted[sorted.length - 1]!;
    const existing = result.find((r) => r.size === smallest);
    if (existing) existing.count += Math.ceil(remaining / smallest);
    else result.push({ size: smallest, count: Math.ceil(remaining / smallest) });
  }
  return result;
}

/* ---------------------------------- Steel -------------------------------- */

/** Weight of a TMT bar per metre: D² / 162 (kg/m). */
export const tmtWeightPerMetre = (diameterMm: number) => (diameterMm * diameterMm) / 162;

export const STEEL_BY_ELEMENT = {
  slab: { label: "Slab", kgPerCum: 80 },
  beam: { label: "Beam", kgPerCum: 150 },
  column: { label: "Column", kgPerCum: 180 },
  footing: { label: "Footing", kgPerCum: 70 },
} as const;
export type StructuralElement = keyof typeof STEEL_BY_ELEMENT;

export function estimateSteelByVolume(volumeCum: number, element: StructuralElement): EstimateLine[] {
  const kg = volumeCum * STEEL_BY_ELEMENT[element].kgPerCum;
  return [
    { label: "Steel", value: Math.ceil(kg), unit: "kg", hint: `≈ ${STEEL_BY_ELEMENT[element].kgPerCum} kg / m³ for ${STEEL_BY_ELEMENT[element].label.toLowerCase()}` },
    { label: "Steel", value: round(kg / 1000, 2), unit: "tonne" },
    { label: "Binding wire", value: Math.ceil(kg * 0.01), unit: "kg", hint: "≈ 1% of steel weight" },
  ];
}

export function estimateSteelBars(diameterMm: number, totalLengthM: number, barLengthM = 12): EstimateLine[] {
  const perM = tmtWeightPerMetre(diameterMm);
  return [
    { label: "Weight per metre", value: round(perM, 3), unit: "kg/m" },
    { label: "Bars (12 m)", value: Math.ceil(totalLengthM / barLengthM), unit: "bars" },
    { label: "Total weight", value: round(perM * totalLengthM, 1), unit: "kg" },
  ];
}

/* ---------------------------------- Sand --------------------------------- */

export const SAND_USES = {
  plaster12: { label: "Plastering 12 mm (1:4)", thicknessM: 0.012, ratio: 4 },
  plaster20: { label: "Plastering 20 mm (1:6)", thicknessM: 0.02, ratio: 6 },
  flooring: { label: "Floor bedding 40 mm (1:4)", thicknessM: 0.04, ratio: 4 },
} as const;
export type SandUse = keyof typeof SAND_USES;

export function estimatePlaster(areaSqm: number, use: SandUse): EstimateLine[] {
  const u = SAND_USES[use];
  const wet = areaSqm * u.thicknessM;
  const dry = wet * 1.27 * 1.2; // dry volume + 20% for uneven surface
  const cementCum = dry / (1 + u.ratio);
  const sandCum = cementCum * u.ratio;
  return [
    { label: "Cement", value: Math.ceil(cementCum / CEMENT_BAG_CUM), unit: "bags (50 kg)" },
    { label: "Sand", value: round(sandCum * CFT_PER_CUM, 1), unit: "cft" },
    { label: "Sand", value: round(sandCum * 1.6, 2), unit: "tonne", hint: "≈ 1.6 t / m³" },
  ];
}

export const CALCULATORS: { type: CalculatorType; title: string; description: string }[] = [
  { type: "cement", title: "Cement Calculator", description: "Bags of cement, sand and aggregate for concrete by grade." },
  { type: "bricks", title: "Brick & Block Calculator", description: "Bricks or AAC blocks plus mortar for any wall size." },
  { type: "tiles", title: "Tile Calculator", description: "Boxes of tiles, adhesive and grout for your floor or wall." },
  { type: "paint", title: "Paint Calculator", description: "Litres of paint, primer and putty for your walls." },
  { type: "steel", title: "Steel Calculator", description: "TMT steel weight by element or bar diameter." },
  { type: "sand", title: "Sand Calculator", description: "Sand and cement for plastering and floor bedding." },
];
