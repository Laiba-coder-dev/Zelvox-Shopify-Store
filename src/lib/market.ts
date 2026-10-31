import "server-only";
import { cookies } from "next/headers";
import { MARKETS, type Currency, type MarketCode } from "./site";
import type { Locale } from "@/locales";

export const MARKET_COOKIE = "mge_market";
export const CURRENCY_COOKIE = "mge_currency";
export const LOCALE_COOKIE = "mge_locale";

export type MarketSelection = {
  code: MarketCode;
  market: (typeof MARKETS)[MarketCode];
  currency: Currency;
  locale: Locale;
};

export function isMarket(value: string | undefined): value is MarketCode {
  return Boolean(value && value in MARKETS);
}

export function isCurrency(value: string | undefined): value is Currency {
  return value === "GBP" || value === "EUR" || value === "USD";
}

export function isLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "de";
}

/** Market + currency + locale preferences, read from cookies. */
export async function getMarketSelection(): Promise<MarketSelection> {
  const store = await cookies();
  const marketCode: MarketCode = isMarket(store.get(MARKET_COOKIE)?.value)
    ? (store.get(MARKET_COOKIE)?.value as MarketCode)
    : "UK";
  const market = MARKETS[marketCode];
  const currencyCookie = store.get(CURRENCY_COOKIE)?.value;
  const currency: Currency = isCurrency(currencyCookie) ? currencyCookie : market.currency;
  const localeCookie = store.get(LOCALE_COOKIE)?.value;
  const locale: Locale = isLocale(localeCookie) ? localeCookie : market.locale;
  return { code: marketCode, market, currency, locale };
}

/** Address label helpers — UK postcode vs German PLZ, etc. */
export function addressLabels(selection: MarketSelection) {
  const { postcodeLabel, postcodeExample, cityLabel } = selection.market;
  return { postcodeLabel, postcodeExample, cityLabel };
}
