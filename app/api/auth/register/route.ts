import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validations";
import { getUserByEmail } from "@/lib/data";
import { SESSION_COOKIE, encodeSession, sessionCookieOptions } from "@/lib/auth/session";

export async function POST(req: Request) {
  const parsed = registerSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid details" }, { status: 422 });
  const d = parsed.data;
  if (await getUserByEmail(d.email)) return NextResponse.json({ error: "An account with this email already exists. Please log in." }, { status: 409 });
  await new Promise((r) => setTimeout(r, 500));
  const res = NextResponse.json({ ok: true, phone: d.phone });
  res.cookies.set(
    SESSION_COOKIE,
    encodeSession({ uid: `u-${Date.now()}`, name: d.name, email: d.email, phone: d.phone, accountType: d.accountType, company: d.company, trn: d.trn }),
    sessionCookieOptions(),
  );
  return res;
}
