import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";

/** Mock order placement. A real backend would re-price the cart server-side. */
export async function POST() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Please log in to place an order" }, { status: 401 });
  await new Promise((r) => setTimeout(r, 900));
  const number = `BM${Math.floor(24100 + Math.random() * 800)}`;
  return NextResponse.json({ ok: true, number });
}
