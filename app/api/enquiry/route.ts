import { NextResponse } from "next/server";

/** Accepts bulk-enquiry and contact submissions (multipart or JSON). Mock: returns a reference number. */
export async function POST() {
  await new Promise((r) => setTimeout(r, 600));
  return NextResponse.json({ ok: true, reference: `QT-${Math.floor(5600 + Math.random() * 400)}` });
}
