import type { DeliveryEstimate, DeliveryType, SaudiRegion } from "@/types";

export const SAUDI_REGIONS = ["Riyadh","Makkah","Madinah","Eastern Province","Asir","Tabuk","Qassim","Hail","Northern Borders","Jazan","Najran","Al Bahah","Al Jawf"] as const satisfies readonly SaudiRegion[];

export interface ServiceArea {
  id: string;
  area: string;
  /** Legacy address field name; contains a Saudi region. */
  emirate: SaudiRegion;
  /** Demo delivery zones; replace with backend coverage and estimates. */
  zone: 0 | 1 | 2;
}

/** Saudi delivery locations for the sample template. */
export const SERVICE_AREAS: ServiceArea[] = [
  { id: "riyadh", area: "Riyadh", emirate: "Riyadh", zone: 0 },
  { id: "al-kharj", area: "Al Kharj", emirate: "Riyadh", zone: 1 },
  { id: "jeddah", area: "Jeddah", emirate: "Makkah", zone: 1 },
  { id: "makkah", area: "Makkah", emirate: "Makkah", zone: 1 },
  { id: "taif", area: "Taif", emirate: "Makkah", zone: 2 },
  { id: "madinah", area: "Madinah", emirate: "Madinah", zone: 2 },
  { id: "yanbu", area: "Yanbu", emirate: "Madinah", zone: 2 },
  { id: "dammam", area: "Dammam", emirate: "Eastern Province", zone: 1 },
  { id: "khobar", area: "Khobar", emirate: "Eastern Province", zone: 1 },
  { id: "jubail", area: "Jubail", emirate: "Eastern Province", zone: 1 },
  { id: "abha", area: "Abha", emirate: "Asir", zone: 2 },
  { id: "tabuk", area: "Tabuk", emirate: "Tabuk", zone: 2 },
  { id: "buraydah", area: "Buraydah", emirate: "Qassim", zone: 2 },
  { id: "hail", area: "Hail", emirate: "Hail", zone: 2 },
  { id: "arar", area: "Arar", emirate: "Northern Borders", zone: 2 },
  { id: "jazan", area: "Jazan", emirate: "Jazan", zone: 2 },
  { id: "najran", area: "Najran", emirate: "Najran", zone: 2 },
  { id: "al-bahah", area: "Al Bahah", emirate: "Al Bahah", zone: 2 },
  { id: "sakaka", area: "Sakaka", emirate: "Al Jawf", zone: 2 },
];

export const DEFAULT_AREA_ID = "riyadh";

export function lookupArea(id: string) {
  return SERVICE_AREAS.find((a) => a.id === id);
}

export const areaLabel = (a: Pick<ServiceArea, "area" | "emirate">) => `${a.area}, ${a.emirate}`;

export function estimateDelivery(areaId: string, deliveryType: DeliveryType, leadTimeDays: number): DeliveryEstimate {
  const loc = lookupArea(areaId);
  if (!loc) return { areaId, serviceable: false, message: "Select a delivery city in Saudi Arabia." };
  const truck = deliveryType !== "parcel";
  const etaDays = leadTimeDays + loc.zone;
  const charge = truck ? [25, 45, 80][loc.zone]! : [0, 10, 15][loc.zone]!;
  return {
    areaId,
    serviceable: true,
    area: loc.area,
    emirate: loc.emirate,
    etaDays,
    etaDate: addDays(etaDays),
    charge,
    deliveryType: truck ? "truck" : "parcel",
    message: `${truck ? "Truck" : "Parcel"} delivery to ${loc.area} by ${formatShort(addDays(etaDays))}`,
  };
}

function addDays(days: number) {
  return new Date(Date.now() + days * 86_400_000).toISOString();
}

function formatShort(iso: string) {
  return new Intl.DateTimeFormat("en-SA", { weekday: "short", day: "numeric", month: "short" }).format(new Date(iso));
}

/** "Riyadh, Riyadh · P.O. Box 12345" */
export const formatAddressArea = (a: { area: string; emirate: string; poBox?: string }) =>
  `${a.area}, ${a.emirate}${a.poBox ? ` · P.O. Box ${a.poBox}` : ""}`;
