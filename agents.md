# PROMPT: Build "BuildMart" — Construction Materials E-commerce (Next.js + Tailwind, SSR)

You are a **senior full-stack engineer and senior UI/UX designer**. Build a production-grade, mobile-first e-commerce website for **construction materials and products** using **Next.js (App Router) + TypeScript + Tailwind CSS**, with **server-side rendering**. Think like a product designer shipping for contractors, builders, architects, and homeowners in India — fast, clear, trustworthy, and easy on a phone at a site.

Work in phases (listed at the end). After each phase, stop, summarize what was built, and list files created.

---

## 1. Tech Stack & Rules

- **Next.js 15+ App Router**, TypeScript (strict), React Server Components by default.
- **SSR**: product listing, category, product detail, search, and home pages render on the server (`async` server components; `export const dynamic = "force-dynamic"` or `revalidate` where appropriate). Use `generateMetadata` for SEO on every page.
- **Tailwind CSS v4** (or v3 with `tailwind.config.ts`) — design tokens via CSS variables.
- **Client components only where needed** (`"use client"`): cart, filters, sliders, mega menu interactions, forms, recently viewed.
- **State**: Zustand for cart / wishlist / compare / recently viewed (persisted to localStorage).
- **Forms**: React Hook Form + Zod validation.
- **Icons**: `lucide-react`. **Slider**: `embla-carousel-react`. **Images**: `next/image` with blur placeholders.
- **Fonts**: `next/font` — "Inter" for UI, "Manrope" or "Plus Jakarta Sans" for headings.
- **Data**: build a typed **mock data layer** in `/lib/data` with async functions (`getProducts`, `getProductBySlug`, `getCategories`, etc.) that simulate API calls, so a real backend (Laravel / REST) can be swapped in later without touching UI.
- **Auth**: mock auth with httpOnly cookie session via Route Handlers + `middleware.ts` protecting `/account/*` and `/checkout`. Structure it so NextAuth or a Laravel Sanctum API can replace it.
- Currency: **INR (₹)**, Indian number formatting (`en-IN`), GST-inclusive/exclusive display, 6-digit pincode.
- Accessibility: WCAG AA contrast, keyboard navigable mega menu, focus rings, aria labels, `prefers-reduced-motion`.
- Performance: Lighthouse 90+ mobile, skeleton loaders via `loading.tsx`, `error.tsx` and `not-found.tsx` per route group.

---

## 2. Design System

**Brand feel:** solid, industrial, trustworthy, modern. Clean white surfaces, strong dark-blue structure, one warm accent for actions.

```css
--primary-900: #0A1F44;   /* header, footer, hero overlays */
--primary-800: #0F2C5C;   /* PRIMARY brand dark blue */
--primary-700: #16397A;
--primary-600: #1E4A9A;   /* hover */
--primary-100: #E6EDF8;
--primary-50:  #F3F6FC;
--accent-500:  #F59E0B;   /* construction amber — CTAs like "Add to Cart", badges */
--accent-600:  #D97706;
--success: #16A34A; --warning: #EAB308; --danger: #DC2626;
--neutral-900: #0F172A; --neutral-600: #475569; --neutral-200: #E2E8F0; --neutral-50: #F8FAFC;
```

- Radius: `rounded-xl` cards, `rounded-lg` inputs/buttons. Soft shadows (`shadow-sm` → `shadow-lg` on hover).
- Spacing: 8px grid. Container `max-w-7xl`, 16px side gutter on mobile.
- Type scale: 12 / 14 / 16 / 18 / 24 / 32 / 40 / 48.
- Build reusable UI primitives in `/components/ui`: Button (primary, accent, outline, ghost, sizes, loading), Input, Select, Checkbox, Radio, Badge, Rating, Price, QuantityStepper, Tabs, Accordion, Modal, Drawer, Tooltip, Breadcrumb, Pagination, Skeleton, EmptyState, Toast.
- Support dark mode tokens (optional toggle), but design light mode first.

---

## 3. Product Domain Model (Construction-Specific)

Create strong TypeScript types in `/types`. Products must support **material-type-specific attributes**, **variants**, **units of measure**, and **bulk/tiered pricing**.

```ts
type Unit = "bag" | "kg" | "tonne" | "piece" | "sqft" | "sqm" | "cft" | "cum" | "litre" | "metre" | "rft" | "box" | "set" | "load";

interface Product {
  id: string; slug: string; name: string; sku: string;
  brandId: string; categoryId: string; subCategoryId: string;
  materialType: MaterialType;
  images: string[]; shortDescription: string; description: string;
  unit: Unit; minOrderQty: number; stepQty: number;
  price: number; mrp: number; gstRate: 5 | 12 | 18 | 28;
  tieredPricing?: { minQty: number; pricePerUnit: number }[];  // bulk discounts
  variants?: Variant[];                    // e.g. size, grade, colour, thickness
  attributes: Record<string, string | number | string[]>; // type-specific (below)
  specifications: { label: string; value: string }[];
  certifications?: string[];               // ISI, BIS, ISO, IS codes
  stock: number; leadTimeDays: number; deliveryType: "parcel" | "truck" | "both";
  weightKg?: number; rating: number; reviewCount: number;
  tags: string[]; isNew?: boolean; isFeatured?: boolean; isBestSeller?: boolean;
  documents?: { label: string; url: string }[]; // datasheets, test certificates
}
```

### Categories, material types and their attributes (seed realistic mock data — at least 8 products per top category, 120+ total, 25+ brands)

| Category | Sub-categories | Key attributes (filterable) |
|---|---|---|
| **Cement & Concrete** | OPC 43, OPC 53, PPC, PSC, White Cement, Ready-Mix Concrete, Dry Mortar | grade, type, bag weight (50kg), setting time, compressive strength (MPa), IS code, RMC grade (M20/M25/M30) |
| **Steel & TMT** | TMT Bars, Binding Wire, Structural Steel (angles, channels, I-beams), MS Pipes, Mesh | diameter (8–32mm), grade (Fe500, Fe500D, Fe550D), length (12m), weight/metre, corrosion-resistant (yes/no), bundle size |
| **Bricks & Blocks** | Red Clay Bricks, Fly Ash Bricks, AAC Blocks, Solid/Hollow Concrete Blocks, Paver Blocks | size (L×W×H mm), density, compressive strength, water absorption %, pieces per pallet |
| **Sand & Aggregates** | River Sand, M-Sand, P-Sand, 20mm/40mm Jelly (Aggregate), Gravel, Stone Dust | particle size, source, silt content %, unit (cft/tonne/load), truck load size |
| **Tiles & Flooring** | Vitrified, Ceramic, Porcelain, Wall Tiles, Granite, Marble, Kota Stone, Wooden Flooring, Vinyl/SPC | size (600×600 etc.), finish (glossy/matt/rustic), thickness, colour, application (floor/wall/outdoor), coverage per box (sqft), anti-skid (R-rating) |
| **Paints & Coatings** | Interior Emulsion, Exterior Emulsion, Primer, Enamel, Wood Finish, Putty, Texture | finish (matt/satin/gloss), pack size (1/4/10/20 L), coverage (sqft/L), coats, washable, VOC level, colour family |
| **Waterproofing & Chemicals** | Roof Coatings, Membranes, Admixtures, Tile Adhesive, Grout, Sealants, Epoxy | application area, pack size, coverage, cure time, base (acrylic/PU/cementitious) |
| **Plumbing & Pipes** | CPVC, UPVC, PVC, GI, HDPE Pipes, Fittings, Valves, Water Tanks | material, diameter (mm/inch), pressure class (SDR/kg-cm²), length, tank capacity (L), layers |
| **Electrical** | Wires & Cables, Switches & Sockets, MCBs/DBs, Conduits, Lighting, Fans | wire gauge (sq mm), core, voltage, current rating (A), fire-retardant (FR/FRLS/HFFR), coil length (90m), colour |
| **Sanitaryware & Bath** | WC, Wash Basins, Faucets, Showers, Kitchen Sinks, Accessories | mounting (wall/floor), trap type (S/P), flush type, material, finish (chrome/matt black), dimensions |
| **Wood, Plywood & Boards** | Plywood (MR/BWR/BWP/Marine), Block Board, MDF, HDHMR, Laminates, Veneers, Doors | grade, thickness (6–25mm), size (8×4 ft), core wood, IS code, finish |
| **Doors, Windows & Glass** | Flush Doors, UPVC/Aluminium Windows, Glass, Hardware | material, size, glass type (toughened/laminated), thickness, frame colour |
| **Roofing & Sheets** | Metal Roofing, Polycarbonate, Cement Sheets, Roof Tiles, Insulation | material, thickness (mm), length, profile, colour, coating (GI/GL/colour-coated) |
| **Hardware & Fasteners** | Hinges, Locks, Handles, Screws, Anchors, Nails, Channels | material (SS 304/brass/MS), size, finish, pack quantity |
| **Tools & Equipment** | Power Tools, Hand Tools, Measuring, Mixers, Scaffolding (rent/buy) | power (W), voltage, battery, brand, warranty |
| **Safety Gear** | Helmets, Shoes, Gloves, Harnesses, Jackets | size, standard (IS/EN), material, colour |

Filters must be **generated dynamically from the attributes of the products in the current category** (facets with counts), not hard-coded.

---

## 4. Global Layout

### Header (sticky, collapses on scroll)
- **Top bar** (desktop only, dark blue-900): delivery pincode selector ("Deliver to 612001 ▾"), "Bulk / Project Enquiry", "Track Order", helpline number, language (English/தமிழ்) placeholder.
- **Main bar**: logo, **large search** with category dropdown, autocomplete suggestions (products, categories, brands, recent searches), icons: wishlist, compare, account (dropdown), cart with count badge + mini-cart drawer.
- **Mega menu bar** (desktop): "All Categories" button + top categories. On hover/focus opens a **full-width mega panel**:
  - Left column: category list with icons (hover switches the panel).
  - Middle: 3–4 columns of sub-categories with links.
  - Right: featured brand logos + a promo banner card ("Bulk TMT prices – Get Quote").
  - Keyboard accessible, 150ms hover intent delay, closes on Esc/outside click.
- **Mobile**: hamburger opens a **left drawer** with drill-down (accordion or slide-in levels) category navigation; search bar sits below the logo row; **bottom tab bar** (Home, Categories, Search, Cart, Account).

### Footer
Dark blue-900. Newsletter signup, category links, company links, help (shipping, returns, GST invoice, bulk orders), payment icons, app badges, social icons, address, trust badges (Genuine Products, GST Invoice, Secure Payments, Site Delivery).

---

## 5. Home Page (SSR) — sections in order

1. **Hero Slider** — full-width, auto-play with pause on hover, dots + arrows, swipe on mobile. 4 slides with headline, sub-text, CTA, dark-blue gradient overlay on imagery. Aspect ratio 16:6 desktop, 4:5 mobile (separate mobile images).
2. **Trust strip** — 4 icons: Genuine Brands · GST Invoice · Doorstep/Site Delivery · Bulk Discounts.
3. **Shop by Category** — grid of category tiles with icon/image + product count (horizontal scroll on mobile, 8-grid desktop).
4. **New Arrivals** — product carousel with "New" badges.
5. **Featured Products** — tabbed (All / Cement / Steel / Tiles / Paints) product grid.
6. **Promo banner pair** — e.g. "Bulk order? Get project pricing" + "Material Calculator".
7. **Category-based product rows** — 3–4 rows, each: category title, sub-category chips, "View all →", product carousel (e.g. Cement & Concrete, Steel & TMT, Tiles & Flooring, Plumbing).
8. **Shop by Brand** — logo grid/marquee, grayscale → colour on hover.
9. **Recently Viewed** — client component reading from store; hidden if empty.
10. **Recommended for You** — based on recently viewed categories (mock logic), fallback to best sellers.
11. **Material Calculators teaser** — cards: Cement, Bricks, Tiles, Paint, Steel.
12. **Testimonials** — carousel with avatar, name, role (Contractor / Architect / Homeowner), city, rating, quote.
13. **Blog / Build Guides** — 3 latest posts: cover, category, title, excerpt, read time.
14. **Newsletter / App download** band.

### Product Card (reusable, critical)
Image (hover shows 2nd image), badges (New / -12% / Best Seller / ISI), wishlist + compare icon buttons, brand name, 2-line title, key attribute chips (e.g. "Fe500D · 12mm"), rating, price per unit ("₹ 405 /bag"), MRP strike-through, "incl. GST" note, tiered price hint ("₹ 390/bag for 100+"), quantity stepper + **Add to Cart** (accent). Skeleton variant. Grid and list variants.

---

## 6. Pages to Build (App Router structure)

```
app/
  (shop)/
    page.tsx                         → Home
    categories/page.tsx              → All categories (with sub-category lists)
    category/[slug]/page.tsx         → Category landing (banner, sub-cats, top brands, best sellers) + listing
    products/page.tsx                → All products listing (search results reuse this)
    product/[slug]/page.tsx          → Product detail
    brands/page.tsx, brand/[slug]/page.tsx
    search/page.tsx
    compare/page.tsx
    wishlist/page.tsx
    cart/page.tsx
    checkout/page.tsx                → protected
    checkout/success/page.tsx
    calculators/[type]/page.tsx      → cement, bricks, tiles, paint, steel, sand
    bulk-enquiry/page.tsx            → project quote request form (BOQ upload)
    blog/page.tsx, blog/[slug]/page.tsx
    about, contact, faq, shipping-policy, return-policy, privacy, terms
  (auth)/
    login/page.tsx                   → email/phone + password, "Login with OTP" tab
    register/page.tsx                → account type: Individual / Contractor / Business (GSTIN)
    verify-otp/page.tsx
    forgot-password/page.tsx, reset-password/page.tsx
  account/                           → protected dashboard with sidebar layout
    page.tsx                         → overview: stats, recent orders, quick actions
    orders/page.tsx, orders/[id]/page.tsx  → timeline tracking, invoice download, reorder
    addresses/page.tsx               → multiple site addresses (label: Home / Site A / Office)
    projects/page.tsx                → group orders by construction project
    quotes/page.tsx                  → bulk quote requests & status
    wishlist/page.tsx
    profile/page.tsx                 → personal info, GSTIN, business details
    security/page.tsx                → password, sessions
    notifications/page.tsx
  api/ (route handlers for mock auth, cart sync, search suggestions)
  not-found.tsx, error.tsx, loading.tsx
```

### Product Listing (Category / Search) — SSR with URL-driven state
- All filters, sort, page, and view mode live in **searchParams** so pages are shareable and SSR-rendered.
- Desktop: left sticky filter sidebar. Mobile: "Filter" + "Sort" sticky bar → full-screen bottom sheet with Apply/Clear.
- Filters: sub-category, brand (searchable checkbox list), price range slider, dynamic attribute facets, rating, availability, delivery type, certifications, discount.
- Active filter chips row with "Clear all". Result count. Sort: Relevance, Price ↑↓, Newest, Rating, Popularity.
- Grid/List toggle, pagination (plus "Load more" on mobile). Empty state with suggestions.

### Product Detail Page
- Breadcrumb. Image gallery: thumbnails, zoom on hover (desktop), swipe + pinch (mobile), fullscreen lightbox.
- Title, brand link, SKU, rating summary, certification badges.
- **Variant selectors** (chips for size/grade/thickness, colour swatches) — URL updates.
- Price block: price per unit, MRP, savings %, GST toggle (incl./excl.), **tiered bulk pricing table**.
- **Quantity with unit** respecting min order + step; show total and **total weight**.
- **Pincode delivery checker**: ETA, delivery type (parcel / truck), delivery charge.
- **Inline material calculator** where relevant (e.g. tiles: enter area → boxes needed incl. 10% wastage; paint: area → litres; cement: sqft → bags).
- Add to Cart (accent), Buy Now, Wishlist, Compare, Share, "Request Bulk Quote".
- Offer/Highlights list, seller/warehouse info.
- Tabs/Accordion: Description, Specifications (table), Documents (datasheet/test certificate downloads), Delivery & Returns, Reviews (breakdown bars, filter by stars, write-review modal), Q&A.
- Frequently bought together (e.g. Cement + Sand + Aggregate bundle), Similar products, Recently viewed.
- **Mobile**: sticky bottom bar with price + Add to Cart.
- JSON-LD `Product` schema, OG tags.

### Cart
- Line items: image, name, variant, unit price, quantity stepper, line total, remove, move to wishlist.
- Group items by **delivery type** (parcel vs. truck delivery) with separate delivery estimates.
- Coupon input, GST breakup (CGST/SGST or IGST), delivery charges, total savings, grand total.
- "Save for later", empty cart state, recommendations. Mini-cart drawer mirrors this.

### Checkout (multi-step, one-page accordion on mobile)
1. **Delivery address** — saved addresses or new (site address, landmark, unloading notes, floor/crane access).
2. **Delivery schedule** — date + time-slot picker; option for split delivery.
3. **Billing & GST** — "Use GSTIN for business invoice" with GSTIN validation.
4. **Payment** — UPI, Cards, Net Banking, Cash on Delivery, Credit/Pay Later for verified contractors (UI only).
5. **Review & place order** — sticky order summary on desktop.
- Success page: order ID, summary, expected delivery, download invoice, continue shopping.

### Auth pages
Split layout: left dark-blue brand panel with imagery + value props, right form card (full-width form on mobile). Password show/hide, strength meter, OTP 6-box input with auto-advance & resend timer, social login placeholders, inline Zod errors, loading states.

### User Dashboard
Sidebar nav (desktop) / horizontal scroll tabs (mobile). Overview cards (orders, pending deliveries, active quotes, wishlist), recent orders table, order detail with status timeline (Placed → Confirmed → Dispatched → Out for delivery → Delivered), reorder button, invoice download.

---

## 7. UX Details That Matter

- Mobile-first breakpoints: 360 / 640 / 768 / 1024 / 1280.
- Touch targets ≥ 44px. Bottom sheets instead of modals on mobile.
- Toast feedback on add to cart / wishlist; fly-to-cart micro-interaction.
- Skeletons for every async section; optimistic cart updates.
- Unit clarity everywhere: price is always shown with its unit (`/bag`, `/tonne`, `/sqft`, `/box`).
- Recently viewed stored client-side (max 12).
- Sticky "Back to top" on long pages.
- Empty, error, and 404 states designed, not default.
- SEO: `sitemap.ts`, `robots.ts`, canonical URLs, breadcrumb JSON-LD.

---

## 8. Folder Structure

```
/app            routes (above)
/components
  /ui           primitives
  /layout       Header, TopBar, MegaMenu, MobileDrawer, BottomNav, Footer, SearchBar, MiniCart
  /home         HeroSlider, CategoryGrid, ProductCarousel, BrandStrip, Testimonials, BlogSection, …
  /product      ProductCard, Gallery, VariantSelector, PriceBlock, TierTable, PincodeChecker, Calculator, Reviews
  /listing      FilterSidebar, FilterSheet, ActiveFilters, SortSelect, Pagination
  /cart /checkout /account /auth
/lib
  /data         mock data + async getters (products, categories, brands, blogs, testimonials, users, orders)
  /utils        formatINR, calcGST, tierPrice, unit conversions, calculators
  /validations  zod schemas
/store          zustand stores (cart, wishlist, compare, recent)
/types
/public/images  placeholder images (use https://placehold.co or Unsplash construction images)
```

---

## 9. Build Phases

1. **Setup**: Next.js + TS + Tailwind, tokens, fonts, UI primitives, types, mock data (all categories/attributes above).
2. **Layout**: header, top bar, mega menu, search with suggestions, mobile drawer, bottom nav, footer, mini-cart.
3. **Home page**: all 14 sections + product card.
4. **Listing**: category landing, products listing, dynamic facets, search, brands.
5. **Product detail**: gallery, variants, tier pricing, pincode check, calculator, reviews, related.
6. **Cart & checkout** with GST logic and success page.
7. **Auth**: login, OTP, register, forgot/reset, middleware protection.
8. **Account dashboard**: all sub-pages.
9. **Extras**: calculators, bulk enquiry, compare, wishlist, blog, static pages.
10. **Polish**: accessibility pass, loading/error states, SEO, Lighthouse fixes.

Write clean, well-typed, componentized code. No placeholder "TODO" UI — every page must look finished with realistic mock data. Start with Phase 1.
