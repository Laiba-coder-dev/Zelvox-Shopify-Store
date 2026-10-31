import { NextResponse } from "next/server";
import { LOCALE_COOKIE, isLocaleValue } from "@/lib/i18n";
import { CURRENCY_COOKIE, MARKET_COOKIE, isCurrency, isMarket } from "@/lib/market";

const YEAR = 60 * 60 * 24 * 365;

/** Stores market / language / currency / cookie-consent preferences. */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  const set = (name: string, value: string) =>
    response.cookies.set(name, value, {
      path: "/",
      sameSite: "lax",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: YEAR,
    });

  const locale = typeof body.locale === "string" ? body.locale : undefined;
  const market = typeof body.market === "string" ? body.market : undefined;
  const currency = typeof body.currency === "string" ? body.currency : undefined;
  const consent =
    typeof body.cookieConsent === "string" ? body.cookieConsent : undefined;

  if (locale && !isLocaleValue(locale)) {
    return NextResponse.json({ error: "Unsupported locale" }, { status: 400 });
  }
  if (market && !isMarket(market)) {
    return NextResponse.json({ error: "Unsupported market" }, { status: 400 });
  }
  if (currency && !isCurrency(currency)) {
    return NextResponse.json({ error: "Unsupported currency" }, { status: 400 });
  }
  if (consent && consent !== "accepted" && consent !== "essential") {
    return NextResponse.json({ error: "Unsupported consent value" }, { status: 400 });
  }

  if (locale) set(LOCALE_COOKIE, locale);
  if (market) {
    set(MARKET_COOKIE, market);
    // Changing market also switches the default display currency unless the
    // visitor picked one explicitly in the same request.
    if (!currency) {
      set(CURRENCY_COOKIE, market === "DE" ? "EUR" : market === "UK" ? "GBP" : "USD");
    }
    if (market === "DE" && !locale) set(LOCALE_COOKIE, "de");
    if (market === "UK" && !locale && body.resetLocale === true) set(LOCALE_COOKIE, "en");
  }
  if (currency) set(CURRENCY_COOKIE, currency);
  if (consent) set("mge_cookie_consent", consent);

  return response;
}
