import { NextResponse, type NextRequest } from "next/server";
import { checkDelivery } from "@/lib/data";

export async function GET(req: NextRequest) {
  const area = req.nextUrl.searchParams.get("area") ?? "";
  const productId = req.nextUrl.searchParams.get("productId") ?? undefined;
  return NextResponse.json(await checkDelivery(area, productId));
}
