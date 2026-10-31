import "server-only";
import { getSetting, setSetting } from "./settings";
import type { Currency } from "./site";

/**
 * Indicative FX conversion.
 *
 * Live rates are fetched from the keyless open.er-api.com feed (base GBP) and
 * cached for six hours; on failure the last known rates are used, then a static
 * fallback. Every price produced from these rates is labelled "indicative" on
 * the storefront — only quotations confirm actual prices.
 */

const API_URL = "https://open.er-api.com/v6/latest/GBP";
const TTL_MS = 6 * 60 * 60 * 1000;

const FALLBACK: Record<Currency, number> = { GBP: 1, EUR: 1.17, USD: 1.27 };

type FxCache = {
  rates: Record<string, number>;
  fetchedAt: number;
  source: "live" | "cache" | "fallback";
};

export type Fx = {
  rates: Record<Currency, number>;
  fetchedAt: number;
  source: "live" | "cache" | "fallback";
};

export async function getFx(): Promise<Fx> {
  const cached = await getSetting<FxCache | null>("fx:GBP", null);
  const fresh =
    cached && Date.now() - cached.fetchedAt < TTL_MS && cached.source !== "fallback";

  if (fresh && cached) {
    return {
      rates: normalize(cached.rates),
      fetchedAt: cached.fetchedAt,
      source: cached.source,
    };
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(API_URL, { signal: controller.signal, cache: "no-store" });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { rates?: Record<string, number> };
    if (!data.rates) throw new Error("Malformed rates payload");
    const entry: FxCache = {
      rates: { GBP: 1, ...data.rates },
      fetchedAt: Date.now(),
      source: "live",
    };
    await setSetting("fx:GBP", entry);
    return { rates: normalize(entry.rates), fetchedAt: entry.fetchedAt, source: "live" };
  } catch {
    if (cached) {
      return {
        rates: normalize(cached.rates),
        fetchedAt: cached.fetchedAt,
        source: "cache",
      };
    }
    return { rates: FALLBACK, fetchedAt: 0, source: "fallback" };
  }
}

function normalize(rates: Record<string, number>): Record<Currency, number> {
  return {
    GBP: rates.GBP ?? FALLBACK.GBP,
    EUR: rates.EUR ?? FALLBACK.EUR,
    USD: rates.USD ?? FALLBACK.USD,
  };
}

/** Convert between currencies using GBP-based rates. */
export function convert(
  amount: number,
  from: Currency,
  to: Currency,
  fx: Fx
): number {
  if (from === to) return amount;
  const inGbp = amount / fx.rates[from];
  return inGbp * fx.rates[to];
}

export function formatMoney(
  amount: number,
  currency: Currency,
  locale: string = "en-GB"
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function formatRateTimestamp(fetchedAt: number, locale = "en-GB"): string {
  if (!fetchedAt) return "static fallback rate";
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(fetchedAt));
}
