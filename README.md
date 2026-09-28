# BuildMart — Construction Materials E-commerce Template

Next.js 16 (App Router, SSR) · TypeScript · Tailwind CSS v4 · Swiper · Zustand · React Hook Form + Zod.
Mobile-first storefront for cement, steel, bricks, sand, tiles, paints, plumbing, electrical and more.

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npm start
```

**Demo login:** `demo@buildmart.ae` / `Build@123` — or OTP login with `0501234567`, code `123456`.
**Coupons:** `BUILD5`, `FIRST25`, `SITE50`.

## Pages (all under `app/(shop)`)
Home · Categories · Category landing + listing · All products · Search · Brands · Brand · Product detail ·
Cart · Checkout (protected) · Order success · Login / Register / Verify OTP / Forgot / Reset ·
Account (overview, orders, order tracking, addresses, projects, quotes, wishlist, profile, security, notifications) ·
Calculators (cement, bricks, tiles, paint, steel, sand) · Bulk enquiry (BOQ upload) · Compare · Wishlist ·
Blog + article · About · Contact · FAQ · Shipping · Returns · Privacy · Terms · sitemap.xml · robots.txt

## Key features
- **Filters that work**: sub-category, brand (searchable), price slider, dynamic attribute facets, rating,
  delivery type, certifications, discount, stock — all in the URL (shareable, SSR). Desktop sidebar,
  mobile bottom-sheet filter & sort, active chips, pagination + mobile "Load more".
- **Home**: Swiper hero, category grid, alternating Swiper rows / full product grids, 3 ad banners,
  brand marquee, recently viewed, recommendations, calculators, testimonials, blog, newsletter.
- **Product page**: gallery with zoom + fullscreen pinch-zoom, variant chips/swatches (URL-synced),
  VAT incl/excl toggle, bulk tier table, qty with total & weight, delivery-area check, inline
  calculator, bundle "bought together", reviews with write-review modal, Q&A, JSON-LD.
- **Cart & checkout**: grouped by parcel/truck delivery, coupons, CVAT/SVAT vs IVAT breakup,
  5-step checkout (address with unloading notes, date/slot, TRN billing, payment, review).

## Structure
- `components/ui` primitives · `layout` header/mega menu/drawer/bottom nav/footer/mini-cart ·
  `home` · `product` · `listing` · `cart` · `checkout` · `account` · `auth` · `extras`
- `lib/data` — typed mock catalogue (133 products, 16 categories, 48 brands) and async getters.
  **Backend seam:** replace function bodies in `lib/data/index.ts` with API calls returning the same types.
- `lib/auth/session.ts` + `proxy.ts` — mock httpOnly-cookie session (swap for NextAuth / Sanctum).
- `store/` Zustand (cart, wishlist, compare, recently viewed) persisted to localStorage.
- `public/images` — Creative Commons stock photos (CC BY / CC0 / Public Domain), credited at `/image-credits` (data in `lib/data/credits.ts`). Replace with your own product photography at the same paths.
