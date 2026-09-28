import type { Unit } from "@/types";

const UNIT_LABELS: Record<Unit, { short: string; singular: string; plural: string }> = {
  bag: { short: "bag", singular: "bag", plural: "bags" },
  kg: { short: "kg", singular: "kg", plural: "kg" },
  tonne: { short: "tonne", singular: "tonne", plural: "tonnes" },
  piece: { short: "pc", singular: "piece", plural: "pieces" },
  sqft: { short: "sq ft", singular: "sq ft", plural: "sq ft" },
  sqm: { short: "sq m", singular: "sq m", plural: "sq m" },
  cft: { short: "cft", singular: "cft", plural: "cft" },
  cum: { short: "cu m", singular: "cu m", plural: "cu m" },
  litre: { short: "L", singular: "litre", plural: "litres" },
  metre: { short: "m", singular: "metre", plural: "metres" },
  rft: { short: "rft", singular: "running ft", plural: "running ft" },
  box: { short: "box", singular: "box", plural: "boxes" },
  set: { short: "set", singular: "set", plural: "sets" },
  load: { short: "load", singular: "load", plural: "loads" },
  pack: { short: "pack", singular: "pack", plural: "packs" },
  coil: { short: "coil", singular: "coil", plural: "coils" },
};

/** "/bag", "/sq ft" — always pair a price with its unit. */
export function perUnit(unit: Unit) {
  return `/${UNIT_LABELS[unit].short}`;
}

export function unitLabel(unit: Unit, qty = 1) {
  return qty === 1 ? UNIT_LABELS[unit].singular : UNIT_LABELS[unit].plural;
}

export function unitShort(unit: Unit) {
  return UNIT_LABELS[unit].short;
}

export function formatQty(qty: number, unit: Unit) {
  return `${new Intl.NumberFormat("en-AE").format(qty)} ${unitLabel(unit, qty)}`;
}

/* Conversions used by calculators and the listing "price per" helpers */
export const SQFT_PER_SQM = 10.7639;
export const CFT_PER_CUM = 35.3147;

export const sqmToSqft = (sqm: number) => sqm * SQFT_PER_SQM;
export const sqftToSqm = (sqft: number) => sqft / SQFT_PER_SQM;
export const cumToCft = (cum: number) => cum * CFT_PER_CUM;
export const cftToCum = (cft: number) => cft / CFT_PER_CUM;
export const kgToTonne = (kg: number) => kg / 1000;

/** Round a quantity up to satisfy min order and step. */
export function normaliseQty(qty: number, minOrderQty: number, stepQty: number) {
  if (!Number.isFinite(qty) || qty < minOrderQty) return minOrderQty;
  const steps = Math.ceil((qty - minOrderQty) / stepQty);
  return minOrderQty + steps * stepQty;
}

export function formatWeight(kg: number) {
  if (kg >= 1000) return `${(kg / 1000).toLocaleString("en-AE", { maximumFractionDigits: 2 })} tonne`;
  return `${kg.toLocaleString("en-AE", { maximumFractionDigits: 1 })} kg`;
}
