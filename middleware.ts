import { NextResponse } from "next/server";
import { geolocation } from "@vercel/functions";
import type { NextRequest } from "next/server";

const BOT_RE = /bot|crawler|spider|google|bing|yandex|baidu|duckduck|slurp/i;

export function middleware(request: NextRequest) {
  if (request.cookies.has("NEXT_LOCALE")) return NextResponse.next();
  const ua = request.headers.get("user-agent") ?? "";
  if (BOT_RE.test(ua)) return NextResponse.next();
  const geo = geolocation(request);
  const locale = geo?.country === "KR" ? "ko" : "en";
  const response = NextResponse.next();
  response.cookies.set("NEXT_LOCALE", locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
    sameSite: "lax",
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next|api|favicon\\.ico|.*\\..*).*)" ],
};
