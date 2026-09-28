import { NextResponse } from "next/server";
import { otpRequestSchema, otpVerifySchema } from "@/lib/validations";
import { getUserByPhone } from "@/lib/data";
import { SESSION_COOKIE, encodeSession, payloadFromUser, sessionCookieOptions } from "@/lib/auth/session";

/** Demo OTP is always 123456. */
const DEMO_OTP = "123456";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (body.action === "send") {
    const p = otpRequestSchema.safeParse(body);
    if (!p.success) return NextResponse.json({ error: "Enter a valid UAE mobile number" }, { status: 422 });
    await new Promise((r) => setTimeout(r, 400));
    return NextResponse.json({ ok: true, maskedPhone: `+971 •• ••• ${p.data.phone.slice(-4)}` });
  }
  const p = otpVerifySchema.safeParse(body);
  if (!p.success || p.data.otp !== DEMO_OTP) return NextResponse.json({ error: "Incorrect code. Please try again." }, { status: 401 });
  const user = await getUserByPhone(p.data.phone);
  const res = NextResponse.json({ ok: true });
  // Existing user: sign in. New number (e.g. just registered): session is already set by register.
  if (user) res.cookies.set(SESSION_COOKIE, encodeSession(payloadFromUser(user)), sessionCookieOptions());
  return res;
}
