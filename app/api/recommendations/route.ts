import { NextResponse, type NextRequest } from "next/server";
import { getRecommendations } from "@/lib/data";
import { toCards } from "@/lib/data/card";

export async function GET(req: NextRequest) {
  const ids = (req.nextUrl.searchParams.get("ids") ?? "").split(",").filter(Boolean);
  return NextResponse.json({ cards: toCards(await getRecommendations(ids, 12)) });
}
