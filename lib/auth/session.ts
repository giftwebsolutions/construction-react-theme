import "server-only";
import { cookies } from "next/headers";
import type { AccountType, User } from "@/types";
import { users } from "@/lib/data/account";

/**
 * Mock session stored in an httpOnly cookie.
 * Replace with NextAuth or Laravel Sanctum: keep `getSessionUser()` as the single read API.
 * NOTE: the payload is not signed — fine for a demo, never for production.
 */
export const SESSION_COOKIE = "bm_session";

export interface SessionPayload {
  uid: string;
  name: string;
  email: string;
  phone: string;
  accountType: AccountType;
  company?: string;
  trn?: string;
}

export const encodeSession = (p: SessionPayload) => Buffer.from(JSON.stringify(p)).toString("base64url");

export function decodeSession(raw?: string): SessionPayload | null {
  if (!raw) return null;
  try {
    const p = JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as SessionPayload;
    return p?.uid ? p : null;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<User | null> {
  const store = await cookies();
  const payload = decodeSession(store.get(SESSION_COOKIE)?.value);
  if (!payload) return null;
  const known = users.find((u) => u.id === payload.uid);
  if (known) return known;
  return {
    id: payload.uid,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    accountType: payload.accountType,
    company: payload.company,
    trn: payload.trn,
    avatar: payload.name.slice(0, 2).toUpperCase(),
    memberSince: new Date().toISOString().slice(0, 10),
  };
}

export const sessionCookieOptions = (remember = true) => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  ...(remember ? { maxAge: 60 * 60 * 24 * 30 } : {}),
});

export function payloadFromUser(u: User): SessionPayload {
  return { uid: u.id, name: u.name, email: u.email, phone: u.phone, accountType: u.accountType, company: u.company, trn: u.trn };
}
