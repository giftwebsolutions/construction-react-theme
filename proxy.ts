import { NextResponse, type NextRequest } from "next/server";

/** Optimistic auth gate for protected areas (the pages re-check the session server-side). */
export function proxy(request: NextRequest) {
  if (!request.cookies.get("bm_session")?.value) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/account/:path*", "/checkout/:path*"] };
