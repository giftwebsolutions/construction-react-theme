import { NextResponse, type NextRequest } from "next/server";
import { brandOf, getProductsByIds } from "@/lib/data";
import { toCards } from "@/lib/data/card";

/** GET /api/products?ids=prd-001,prd-002 — cards for wishlist, compare, recently viewed. */
export async function GET(req: NextRequest) {
  const ids = (req.nextUrl.searchParams.get("ids") ?? "").split(",").filter(Boolean).slice(0, 48);
  const full = req.nextUrl.searchParams.get("full") === "1";
  const products = await getProductsByIds(ids);
  return NextResponse.json(full ? { products, brands: Object.fromEntries(products.map((p) => [p.brandId, brandOf(p).name])) } : { cards: toCards(products) });
}
