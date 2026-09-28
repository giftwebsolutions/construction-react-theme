import { NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const p = forgotPasswordSchema.safeParse(await req.json().catch(() => ({})));
  if (!p.success) return NextResponse.json({ error: "Enter a valid email or mobile number" }, { status: 422 });
  await new Promise((r) => setTimeout(r, 500));
  // Always succeed to avoid account enumeration.
  return NextResponse.json({ ok: true });
}
