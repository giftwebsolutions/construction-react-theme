import type { Address, Notification, Order, OrderEvent, OrderStatus, Project, QuoteRequest, User } from "@/types";
import { products } from "./products";
import { round2 } from "@/lib/utils/pricing";

/* Demo credentials for mock auth: demo@smart-mep.ae / Build@123 */
export const DEMO_PASSWORD = "Build@123";

export const users: User[] = [
  {
    id: "u-1001",
    name: "Omar Al Mansoori",
    email: "demo@smart-mep.ae",
    phone: "501234567",
    accountType: "contractor",
    company: "Al Mansoori Contracting LLC",
    trn: "100234567800003",
    avatar: "OM",
    memberSince: "2024-03-14",
    creditLimit: 22000,
    isVerifiedContractor: true,
  },
];

export const addresses: Address[] = [
  {
    id: "addr-1",
    label: "Site A — Al Barsha",
    name: "Omar Al Mansoori",
    phone: "501234567",
    line1: "Villa 14, Street 21, Al Barsha South 2",
    line2: "Plot 673-0214",
    landmark: "Behind Al Barsha Pond Park",
    area: "Al Barsha",
    emirate: "Dubai",
    unloadingNotes: "Truck can reach the gate. Unload near the east boundary wall.",
    craneAccess: false,
    floor: 0,
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Site B — Muwaileh",
    name: "Rashid Khan (Site Supervisor)",
    phone: "552345678",
    line1: "Plot C-221, Muwaileh Commercial",
    landmark: "Near University City Road exit",
    area: "Muwaileh",
    emirate: "Sharjah",
    unloadingNotes: "Site gate closes at 6 PM — morning slot preferred for blocks.",
    craneAccess: true,
    floor: 2,
  },
  {
    id: "addr-3",
    label: "Office",
    name: "Al Mansoori Contracting LLC",
    phone: "501234567",
    line1: "Office 1204, Bay Square Building 7",
    line2: "12th Floor",
    area: "Business Bay",
    emirate: "Dubai",
    poBox: "123456",
  },
];

export const projects: Project[] = [
  { id: "prj-1", userId: "u-1001", name: "Al Barsha Villa (G+1)", location: "Al Barsha, Dubai", type: "Residential", startDate: "2026-05-02", status: "active", budget: 185000 },
  { id: "prj-2", userId: "u-1001", name: "Muwaileh Residences", location: "Muwaileh, Sharjah", type: "Commercial", startDate: "2026-02-15", status: "active", budget: 815000 },
  { id: "prj-3", userId: "u-1001", name: "Business Bay Office Fit-out", location: "Business Bay, Dubai", type: "Renovation", startDate: "2025-11-10", status: "completed", budget: 42000 },
];

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: "placed", label: "Order placed" },
  { status: "confirmed", label: "Confirmed by warehouse" },
  { status: "dispatched", label: "Dispatched" },
  { status: "out-for-delivery", label: "Out for delivery" },
  { status: "delivered", label: "Delivered" },
];

function timeline(createdAt: string, reached: OrderStatus): OrderEvent[] {
  const idx = STEPS.findIndex((s) => s.status === reached);
  const base = new Date(createdAt).getTime();
  const offsets = [0, 3, 22, 46, 52]; // hours
  return STEPS.map((s, i) => ({
    status: s.status,
    label: s.label,
    date: i <= idx ? new Date(base + offsets[i]! * 3_600_000).toISOString() : null,
  }));
}

const P = (slug: string) => {
  const p = products.find((x) => x.slug === slug);
  if (!p) throw new Error(`Order seed references unknown product ${slug}`);
  return p;
};

interface OrderSeed {
  id: string;
  createdAt: string;
  status: OrderStatus;
  address: Address;
  projectId?: string;
  lines: [slug: string, qty: number][];
  payment: Order["paymentMethod"];
}

const seeds: OrderSeed[] = [
  { id: "ord-24091", createdAt: "2026-09-25T10:12:00+04:00", status: "confirmed", address: addresses[0]!, projectId: "prj-1", payment: "credit",
    lines: [["ultratech-opc-53-grade-cement", 120], ["tata-tiscon-550sd-tmt-bar", 1500], ["robo-m-sand-for-concrete-double-washed", 16]] },
  { id: "ord-24077", createdAt: "2026-09-19T16:40:00+04:00", status: "out-for-delivery", address: addresses[1]!, projectId: "prj-2", payment: "wallet",
    lines: [["magicrete-aac-block-600-200-150-mm", 800], ["mechanical-gi-ductwork-project-series", 40]] },
  { id: "ord-24012", createdAt: "2026-09-02T09:05:00+04:00", status: "delivered", address: addresses[0]!, projectId: "prj-1", payment: "bank-transfer",
    lines: [["havells-lifeline-plus-hrfr-house-wire-90-m", 12], ["electrical-main-switchboards-project-series", 3], ["finolex-rigid-pvc-conduit-pipe-25-mm-3-m-pack-of-10", 6]] },
  { id: "ord-23954", createdAt: "2026-08-14T12:30:00+04:00", status: "delivered", address: addresses[1]!, projectId: "prj-2", payment: "credit",
    lines: [["ramco-supergrade-ppc-cement", 300], ["blue-metal-aggregate-20-mm", 25]] },
  { id: "ord-23870", createdAt: "2026-07-22T11:00:00+04:00", status: "delivered", address: addresses[2]!, projectId: "prj-3", payment: "card",
    lines: [["jaquar-florentine-prime-single-lever-basin-mixer", 2], ["cera-table-top-wash-basin-600-mm", 2], ["plumbing-water-heaters-project-series", 22]] },
  { id: "ord-23811", createdAt: "2026-07-03T15:20:00+04:00", status: "cancelled", address: addresses[0]!, payment: "cod",
    lines: [["mechanical-ahu-project-series", 1]] },
];

export const orders: Order[] = seeds.map((s) => {
  const lines = s.lines.map(([slug, quantity]) => {
    const p = P(slug);
    const tier = p.tieredPricing?.filter((t) => quantity >= t.minQty).sort((a, b) => a.pricePerUnit - b.pricePerUnit)[0];
    return {
      productId: p.id,
      slug: p.slug,
      name: p.name,
      image: p.images[0]!,
      unit: p.unit,
      quantity,
      unitPrice: tier ? Math.min(tier.pricePerUnit, p.price) : p.price,
      vatRate: p.vatRate,
    };
  });
  const total = round2(lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0));
  const vatTotal = round2(lines.reduce((sum, l) => sum + (l.unitPrice * l.quantity * l.vatRate) / (100 + l.vatRate), 0));
  const deliveryCharge = total > 2500 ? 0 : 35;
  const mrpTotal = lines.reduce((sum, l) => sum + (products.find((p) => p.id === l.productId)!.mrp * l.quantity), 0);
  const expected = new Date(new Date(s.createdAt).getTime() + 3 * 86_400_000).toISOString();
  const reached: OrderStatus = s.status === "cancelled" ? "placed" : s.status;
  const tl = timeline(s.createdAt, reached);
  if (s.status === "cancelled") tl.push({ status: "cancelled", label: "Cancelled by customer", date: new Date(new Date(s.createdAt).getTime() + 2 * 3_600_000).toISOString() });
  return {
    id: s.id,
    number: `BM${s.id.replace("ord-", "")}`,
    userId: "u-1001",
    projectId: s.projectId,
    createdAt: s.createdAt,
    status: s.status,
    lines,
    address: s.address,
    subtotal: round2(total - vatTotal),
    vatTotal,
    deliveryCharge,
    discount: round2(mrpTotal - total),
    total: round2(total + deliveryCharge),
    paymentMethod: s.payment,
    expectedDelivery: expected,
    timeline: tl,
    trn: "100234567800003",
  };
});

export const quotes: QuoteRequest[] = [
  {
    id: "q-1", number: "QT-5521", userId: "u-1001", projectName: "Muwaileh Residences — Block B", city: "Sharjah",
    createdAt: "2026-09-23T10:00:00+04:00", status: "quoted", quotedAmount: 125300, validTill: "2026-10-07",
    items: [{ name: "OPC 53 Cement", quantity: 2500, unit: "bag" }, { name: "Fe550D TMT (mixed dia.)", quantity: 32, unit: "tonne" }, { name: "M-Sand (Concrete)", quantity: 180, unit: "tonne" }],
    notes: "Phased delivery over 8 weeks. Price locked for cement; steel at market ±2%.",
  },
  {
    id: "q-2", number: "QT-5534", userId: "u-1001", projectName: "Al Barsha Villa — Finishing", city: "Dubai",
    createdAt: "2026-09-26T18:20:00+04:00", status: "under-review",
    items: [{ name: "Vitrified tiles 600×600", quantity: 180, unit: "box" }, { name: "Interior emulsion", quantity: 24, unit: "pack" }, { name: "UPVC windows", quantity: 240, unit: "sqft" }],
  },
  {
    id: "q-3", number: "QT-5410", userId: "u-1001", projectName: "Business Bay Office Fit-out", city: "Dubai",
    createdAt: "2026-06-11T09:10:00+04:00", status: "accepted", quotedAmount: 13750, validTill: "2026-06-25",
    items: [{ name: "Waterproofing — roof coating", quantity: 8, unit: "pack" }, { name: "Sanitaryware set", quantity: 2, unit: "set" }],
  },
  {
    id: "q-4", number: "QT-5302", userId: "u-1001", projectName: "Boundary wall — Al Quoz warehouse", city: "Dubai",
    createdAt: "2026-04-02T12:00:00+04:00", status: "expired", quotedAmount: 8200, validTill: "2026-04-16",
    items: [{ name: "Solid concrete blocks 6\"", quantity: 3000, unit: "piece" }],
  },
];

export const notifications: Notification[] = [
  { id: "n1", userId: "u-1001", kind: "order", title: "Order BM24077 is out for delivery", body: "Driver Imran (+971 55 xxx 4421) will reach Site B between 2–5 PM.", date: "2026-09-27T09:30:00+04:00", read: false, href: "/account/orders/ord-24077" },
  { id: "n2", userId: "u-1001", kind: "quote", title: "Quote QT-5521 is ready", body: "Your project quote of AED 125,300 is valid till 7 Oct.", date: "2026-09-24T15:10:00+04:00", read: false, href: "/account/quotes" },
  { id: "n3", userId: "u-1001", kind: "offer", title: "Steel prices dropped AED 0.10/kg", body: "Tata Tiscon and JSW Fe550D now at lower tier prices for 5 tonne+ orders.", date: "2026-09-21T08:00:00+04:00", read: true, href: "/category/civil" },
  { id: "n4", userId: "u-1001", kind: "account", title: "Credit limit increased", body: "Your Pay Later limit is now AED 22,000.", date: "2026-09-10T11:00:00+04:00", read: true, href: "/account/profile" },
];
