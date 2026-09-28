import type { DeliveryEstimate, DeliveryType, Emirate } from "@/types";

export const EMIRATES = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"] as const satisfies readonly Emirate[];

export interface ServiceArea {
  id: string;
  area: string;
  emirate: Emirate;
  /** 0 = same-day zone around the Al Quoz warehouse, 2 = furthest */
  zone: 0 | 1 | 2;
}

/** Serviceable areas. Warehouse: Al Quoz Industrial Area 3, Dubai. */
export const SERVICE_AREAS: ServiceArea[] = [
  { id: "al-quoz", area: "Al Quoz", emirate: "Dubai", zone: 0 },
  { id: "business-bay", area: "Business Bay", emirate: "Dubai", zone: 0 },
  { id: "jumeirah", area: "Jumeirah", emirate: "Dubai", zone: 0 },
  { id: "al-barsha", area: "Al Barsha", emirate: "Dubai", zone: 0 },
  { id: "dubai-marina", area: "Dubai Marina", emirate: "Dubai", zone: 0 },
  { id: "jvc", area: "Jumeirah Village Circle", emirate: "Dubai", zone: 0 },
  { id: "deira", area: "Deira", emirate: "Dubai", zone: 1 },
  { id: "al-qusais", area: "Al Qusais", emirate: "Dubai", zone: 1 },
  { id: "dubai-south", area: "Dubai South", emirate: "Dubai", zone: 1 },
  { id: "jebel-ali", area: "Jebel Ali", emirate: "Dubai", zone: 1 },
  { id: "sharjah-industrial", area: "Industrial Area", emirate: "Sharjah", zone: 1 },
  { id: "al-nahda-shj", area: "Al Nahda", emirate: "Sharjah", zone: 1 },
  { id: "muwaileh", area: "Muwaileh", emirate: "Sharjah", zone: 1 },
  { id: "ajman-al-jurf", area: "Al Jurf", emirate: "Ajman", zone: 1 },
  { id: "ajman-al-rashidiya", area: "Al Rashidiya", emirate: "Ajman", zone: 1 },
  { id: "musaffah", area: "Musaffah", emirate: "Abu Dhabi", zone: 2 },
  { id: "khalifa-city", area: "Khalifa City", emirate: "Abu Dhabi", zone: 2 },
  { id: "al-reem", area: "Al Reem Island", emirate: "Abu Dhabi", zone: 2 },
  { id: "al-ain", area: "Al Ain", emirate: "Abu Dhabi", zone: 2 },
  { id: "uaq-city", area: "Umm Al Quwain City", emirate: "Umm Al Quwain", zone: 2 },
  { id: "rak-al-nakheel", area: "Al Nakheel", emirate: "Ras Al Khaimah", zone: 2 },
  { id: "rak-al-hamra", area: "Al Hamra", emirate: "Ras Al Khaimah", zone: 2 },
  { id: "fujairah-city", area: "Fujairah City", emirate: "Fujairah", zone: 2 },
  { id: "dibba", area: "Dibba", emirate: "Fujairah", zone: 2 },
];

export const DEFAULT_AREA_ID = "al-quoz";

export function lookupArea(id: string) {
  return SERVICE_AREAS.find((a) => a.id === id);
}

export const areaLabel = (a: Pick<ServiceArea, "area" | "emirate">) => `${a.area}, ${a.emirate}`;

export function estimateDelivery(areaId: string, deliveryType: DeliveryType, leadTimeDays: number): DeliveryEstimate {
  const loc = lookupArea(areaId);
  if (!loc) return { areaId, serviceable: false, message: "Select a delivery area in the UAE." };
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
  return new Intl.DateTimeFormat("en-AE", { weekday: "short", day: "numeric", month: "short" }).format(new Date(iso));
}

/** "Al Barsha, Dubai · P.O. Box 12345" */
export const formatAddressArea = (a: { area: string; emirate: string; poBox?: string }) =>
  `${a.area}, ${a.emirate}${a.poBox ? ` · P.O. Box ${a.poBox}` : ""}`;
