import { NextResponse, type NextRequest } from "next/server";
import { getProducts } from "@/lib/data";
import { toCards } from "@/lib/data/card";
import { parseProductQuery } from "@/lib/data/query";

/** Same query contract as listing pages — powers mobile "Load more". */
export async function GET(req: NextRequest) {
  const sp: Record<string, string | string[]> = {};
  for (const key of new Set(req.nextUrl.searchParams.keys())) {
    const all = req.nextUrl.searchParams.getAll(key);
    sp[key] = all.length > 1 ? all : all[0]!;
  }
  const result = await getProducts(parseProductQuery(sp));
  return NextResponse.json({ cards: toCards(result.items), page: result.page, totalPages: result.totalPages });
}
