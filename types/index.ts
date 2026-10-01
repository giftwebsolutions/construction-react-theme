/* ============================================================================
   BuildMart domain model
   These types are the contract between the UI and the data layer (lib/data).
   A real backend (Laravel / REST) should map its responses onto these shapes.
============================================================================ */

export type Unit =
  | "bag"
  | "kg"
  | "tonne"
  | "piece"
  | "sqft"
  | "sqm"
  | "cft"
  | "cum"
  | "litre"
  | "metre"
  | "rft"
  | "box"
  | "set"
  | "load"
  | "pack"
  | "coil";

export type MaterialType =
  | "cement"
  | "steel"
  | "bricks"
  | "aggregates"
  | "tiles"
  | "paint"
  | "waterproofing"
  | "plumbing"
  | "electrical"
  | "sanitary"
  | "wood"
  | "doors-windows"
  | "roofing"
  | "hardware"
  | "tools"
  | "safety";

export type VatRate = 0 | 5;
export type Emirate = "Dubai" | "Abu Dhabi" | "Sharjah" | "Ajman" | "Umm Al Quwain" | "Ras Al Khaimah" | "Fujairah";
export type DeliveryType = "parcel" | "truck" | "both";
export type AttributeValue = string | number | string[];

export interface TierPrice {
  minQty: number;
  pricePerUnit: number;
}

export interface VariantOption {
  value: string;
  label: string;
  /** Hex colour for swatch-style options */
  swatch?: string;
  /** Absolute price for this option (overrides base price) */
  price?: number;
  mrp?: number;
  sku?: string;
  stock?: number;
}

export interface Variant {
  /** Attribute key this variant drives, e.g. "diameter", "packSize" */
  key: string;
  label: string;
  display: "chip" | "swatch";
  options: VariantOption[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  sku: string;
  brandId: string;
  categoryId: string;
  subCategoryId: string;
  materialType: MaterialType;
  images: string[];
  shortDescription: string;
  description: string;
  unit: Unit;
  minOrderQty: number;
  stepQty: number;
  /** Price per unit, VAT inclusive */
  price: number;
  mrp: number;
  vatRate: VatRate;
  tieredPricing?: TierPrice[];
  variants?: Variant[];
  attributes: Record<string, AttributeValue>;
  specifications: { label: string; value: string }[];
  certifications?: string[];
  stock: number;
  leadTimeDays: number;
  deliveryType: DeliveryType;
  weightKg?: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  documents?: { label: string; url: string }[];
  highlights: string[];
  /** ISO date — used for "Newest" sort */
  createdAt: string;
  /** Units sold in last 90 days — used for "Popularity" sort */
  soldCount: number;
}

export interface SubCategory {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  materialType: MaterialType;
  /** lucide-react icon name, resolved by components/ui/CategoryIcon */
  icon: CategoryIconName;
  image: string;
  banner: string;
  description: string;
  subCategories: SubCategory[];
  /** Attribute keys that should be offered as filter facets, in display order */
  facetKeys: string[];
  /** Short label for key-attribute chips on product cards */
  cardAttributeKeys: string[];
  productCount?: number;
}

export type CategoryIconName =
  | "plane"
  | "fan"
  | "flame"
  | "factory"
  | "construction"
  | "brick-wall"
  | "mountain"
  | "grid"
  | "paint-roller"
  | "droplets"
  | "pipette"
  | "plug"
  | "shower-head"
  | "trees"
  | "door-open"
  | "house"
  | "hammer"
  | "drill"
  | "hard-hat";

export interface Brand {
  id: string;
  slug: string;
  name: string;
  /** Brand colour used for the wordmark logo */
  color: string;
  tagline: string;
  description: string;
  country: string;
  founded: number;
  categoryIds: string[];
  isFeatured?: boolean;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  role: CustomerRole;
  city: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  helpful: number;
}

export interface Question {
  id: string;
  productId: string;
  question: string;
  answer: string;
  askedBy: string;
  answeredBy: string;
  date: string;
}

export type CustomerRole = "Contractor" | "Architect" | "Homeowner" | "Builder" | "Engineer" | "Interior Designer";

export interface Testimonial {
  id: string;
  name: string;
  role: CustomerRole;
  company?: string;
  city: string;
  rating: number;
  quote: string;
  avatar: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  cover: string;
  author: string;
  authorRole: string;
  date: string;
  readMinutes: number;
  /** Paragraph blocks; headings start with "## " */
  body: string[];
  tags: string[];
}

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  image: string;
  mobileImage: string;
}

export interface Promo {
  id: string;
  title: string;
  subtitle: string;
  cta: { label: string; href: string };
  tone: "primary" | "accent";
}

/* ----------------------------- Listing / search ---------------------------- */

export type SortKey = "relevance" | "price-asc" | "price-desc" | "newest" | "rating" | "popularity";

export interface ProductQuery {
  q?: string;
  category?: string; // category slug
  sub?: string[]; // sub-category slugs
  brand?: string[]; // brand slugs
  minPrice?: number;
  maxPrice?: number;
  rating?: number; // minimum rating
  inStock?: boolean;
  delivery?: DeliveryType[];
  cert?: string[];
  discount?: number; // minimum discount %
  /** Dynamic attribute filters: key -> accepted values */
  attrs?: Record<string, string[]>;
  sort?: SortKey;
  page?: number;
  perPage?: number;
  tag?: "new" | "featured" | "bestseller";
}

export interface FacetOption {
  value: string;
  label: string;
  count: number;
}

export interface Facet {
  key: string;
  label: string;
  type: "checkbox" | "range";
  options: FacetOption[];
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface ProductListResult {
  items: Product[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  facets: Facet[];
  priceRange: PriceRange;
}

export interface SearchSuggestion {
  type: "product" | "category" | "brand";
  id: string;
  label: string;
  href: string;
  meta?: string;
  image?: string;
}

/* ------------------------------ Cart / orders ------------------------------ */

export interface CartItem {
  /** productId + variant selection */
  key: string;
  productId: string;
  slug: string;
  name: string;
  brandName: string;
  image: string;
  unit: Unit;
  quantity: number;
  minOrderQty: number;
  stepQty: number;
  /** Selected variant options, key -> value label */
  variant?: Record<string, string>;
  basePrice: number;
  mrp: number;
  vatRate: VatRate;
  tieredPricing?: TierPrice[];
  deliveryType: DeliveryType;
  weightKg?: number;
  leadTimeDays: number;
}

export type OrderStatus = "placed" | "confirmed" | "dispatched" | "out-for-delivery" | "delivered" | "cancelled";

export type PaymentMethod = "card" | "wallet" | "bnpl" | "bank-transfer" | "cod" | "credit";

export interface Address {
  id: string;
  label: string; // Home / Site A / Office
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  landmark?: string;
  /** Community / district, e.g. "Al Barsha" */
  area: string;
  emirate: Emirate;
  /** Optional P.O. Box — UAE has no postal codes */
  poBox?: string;
  unloadingNotes?: string;
  craneAccess?: boolean;
  floor?: number;
  isDefault?: boolean;
}

export interface OrderLine {
  productId: string;
  slug: string;
  name: string;
  image: string;
  unit: Unit;
  quantity: number;
  unitPrice: number;
  vatRate: VatRate;
  variant?: Record<string, string>;
}

export interface OrderEvent {
  status: OrderStatus;
  label: string;
  date: string | null;
  note?: string;
}

export interface Order {
  id: string;
  number: string;
  userId: string;
  projectId?: string;
  createdAt: string;
  status: OrderStatus;
  lines: OrderLine[];
  address: Address;
  subtotal: number;
  vatTotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  expectedDelivery: string;
  timeline: OrderEvent[];
  trn?: string;
}

export type QuoteStatus = "submitted" | "under-review" | "quoted" | "accepted" | "expired";

export interface QuoteRequest {
  id: string;
  number: string;
  userId: string;
  projectName: string;
  city: string;
  createdAt: string;
  status: QuoteStatus;
  items: { name: string; quantity: number; unit: Unit }[];
  quotedAmount?: number;
  validTill?: string;
  notes?: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  location: string;
  type: "Residential" | "Commercial" | "Renovation" | "Infrastructure";
  startDate: string;
  status: "planning" | "active" | "completed";
  budget: number;
}

export type AccountType = "individual" | "contractor" | "business";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  accountType: AccountType;
  company?: string;
  trn?: string;
  avatar: string;
  memberSince: string;
  creditLimit?: number;
  isVerifiedContractor?: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  kind: "order" | "quote" | "offer" | "account";
  href?: string;
}

export interface DeliveryEstimate {
  areaId: string;
  serviceable: boolean;
  area?: string;
  emirate?: Emirate;
  etaDays?: number;
  etaDate?: string;
  charge?: number;
  deliveryType?: DeliveryType;
  message: string;
}
