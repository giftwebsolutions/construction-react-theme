import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations";
import { getUserByEmail, getUserByPhone } from "@/lib/data";
import { DEMO_PASSWORD } from "@/lib/data/account";
import { SESSION_COOKIE, encodeSession, payloadFromUser, sessionCookieOptions } from "@/lib/auth/session";

export async function POST(req: Request) {
  const parsed = loginSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Check your details and try again" }, { status: 422 });
  const { identifier, password, remember } = parsed.data;
  const user = identifier.includes("@") ? await getUserByEmail(identifier) : await getUserByPhone(identifier);
  await new Promise((r) => setTimeout(r, 400));
  if (!user || password !== DEMO_PASSWORD) {
    return NextResponse.json({ error: "Incorrect email/mobile or password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true, name: user.name });
  res.cookies.set(SESSION_COOKIE, encodeSession(payloadFromUser(user)), sessionCookieOptions(remember ?? true));
  return res;
}
