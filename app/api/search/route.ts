import { NextResponse, type NextRequest } from "next/server";
import { getSearchSuggestions } from "@/lib/data";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const cat = req.nextUrl.searchParams.get("category") ?? undefined;
  const suggestions = await getSearchSuggestions(q, cat || undefined);
  return NextResponse.json({ suggestions });
}
