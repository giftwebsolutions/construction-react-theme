/** Fixed normalization for legacy catalogue fixtures; this is not a live exchange rate. */
const SEED_PRICE_SCALE = 22.7;

/** Preserve the template's existing sample prices and shelf rounding. */
export function fromSeedPrice(seedPrice: number) {
  const amount = seedPrice / SEED_PRICE_SCALE;
  if (amount < 10) return Math.max(0.05, Math.round(amount * 20) / 20);
  if (amount < 1000) return Math.round(amount * 4) / 4;
  return Math.round(amount);
}

const sarFormatter = new Intl.NumberFormat("en-SA", {
  style: "currency",
  currency: "SAR",
  currencyDisplay: "code",
  maximumFractionDigits: 0,
});

const sarFormatterHalalas = new Intl.NumberFormat("en-SA", {
  style: "currency",
  currency: "SAR",
  currencyDisplay: "code",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-SA");

/** SAR 1,234.50 — shows halalas only when present or requested. */
export function formatSAR(amount: number, opts: { halalas?: boolean } = {}) {
  const hasHalalas = Math.round(amount * 100) % 100 !== 0;
  return (opts.halalas || hasHalalas ? sarFormatterHalalas : sarFormatter).format(amount);
}

/** 1,234 */
export function formatNumber(n: number, maxFractionDigits = 2) {
  if (maxFractionDigits === 2) return numberFormatter.format(n);
  return new Intl.NumberFormat("en-SA", { maximumFractionDigits: maxFractionDigits }).format(n);
}

/** Compact notation: SAR 1.2M, SAR 340K */
export function formatCompactSAR(amount: number) {
  if (amount >= 1_000_000) return `SAR ${(amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 2)}M`;
  if (amount >= 100_000) return `SAR ${(amount / 1_000).toFixed(0)}K`;
  return formatSAR(amount);
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) {
  return new Intl.DateTimeFormat("en-SA", opts).format(new Date(iso));
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("en-SA", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function discountPercent(price: number, mrp: number) {
  if (!mrp || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export function pluralize(n: number, singular: string, plural = `${singular}s`) {
  return `${formatNumber(n)} ${n === 1 ? singular : plural}`;
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}
