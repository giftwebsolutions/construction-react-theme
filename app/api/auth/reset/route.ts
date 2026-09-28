import { NextResponse } from "next/server";
import { resetPasswordSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const p = resetPasswordSchema.safeParse(await req.json().catch(() => ({})));
  if (!p.success) return NextResponse.json({ error: p.error.issues[0]?.message ?? "Invalid password" }, { status: 422 });
  await new Promise((r) => setTimeout(r, 500));
  return NextResponse.json({ ok: true });
}
