/** Catalogue seed prices are authored in INR; they are converted to AED once when the catalogue is built. */
export const INR_PER_AED = 22.7;

/** INR → AED, rounded to a shelf-friendly step (fils under 10, quarter-dirham under 1,000, whole dirhams above). */
export function fromINR(inr: number) {
  const aed = inr / INR_PER_AED;
  if (aed < 10) return Math.max(0.05, Math.round(aed * 20) / 20);
  if (aed < 1000) return Math.round(aed * 4) / 4;
  return Math.round(aed);
}

const aedFormatter = new Intl.NumberFormat("en-AE", {
  style: "currency",
  currency: "AED",
  maximumFractionDigits: 0,
});

const aedFormatterFils = new Intl.NumberFormat("en-AE", {
  style: "currency",
  currency: "AED",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("en-AE");

/** AED 1,234.50 — shows fils only when present or requested. */
export function formatAED(amount: number, opts: { fils?: boolean } = {}) {
  const hasFils = Math.round(amount * 100) % 100 !== 0;
  return (opts.fils || hasFils ? aedFormatterFils : aedFormatter).format(amount);
}

/** 1,234 */
export function formatNumber(n: number, maxFractionDigits = 2) {
  if (maxFractionDigits === 2) return numberFormatter.format(n);
  return new Intl.NumberFormat("en-AE", { maximumFractionDigits: maxFractionDigits }).format(n);
}

/** Compact notation: AED 1.2M, AED 340K */
export function formatCompactAED(amount: number) {
  if (amount >= 1_000_000) return `AED ${(amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 2)}M`;
  if (amount >= 100_000) return `AED ${(amount / 1_000).toFixed(0)}K`;
  return formatAED(amount);
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) {
  return new Intl.DateTimeFormat("en-AE", opts).format(new Date(iso));
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("en-AE", {
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
