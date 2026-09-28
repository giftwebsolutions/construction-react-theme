import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/session";

export async function GET() {
  const user = await getSessionUser();
  return NextResponse.json({ user: user ? { name: user.name, email: user.email, accountType: user.accountType } : null });
}
