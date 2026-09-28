import { NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const parsed = newsletterSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email address" }, { status: 422 });
  return NextResponse.json({ ok: true });
}
