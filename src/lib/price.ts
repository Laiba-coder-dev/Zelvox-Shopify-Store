import "server-only";
import { convert, formatMoney, formatRateTimestamp, type Fx } from "./rates";
import type { Currency } from "./site";

export type PriceDisplay =
  | { show: false }
  | {
      show: true;
      /** Amount in the visitor's display currency. */
      amount: number;
      text: string;
      displayCurrency: Currency;
      baseCurrency: Currency;
      baseAmount: number;
      unit?: string;
      converted: boolean;
      rateNote: string;
    };

/**
 * B2B pricing is negotiated per order. Products only show a price when the
 * administrator published one, and any cross-currency figure is explicitly
 * labelled as an indicative conversion of the published price.
 */
export function describePrice(
  product: {
    pricePublished: boolean;
    priceAmount: number | null;
    priceCurrency: string;
    priceUnit: string | null;
  },
  displayCurrency: Currency,
  fx: Fx,
  locale: string
): PriceDisplay {
  if (!product.pricePublished || product.priceAmount === null) return { show: false };
  const baseCurrency = (["GBP", "EUR", "USD"].includes(product.priceCurrency)
    ? product.priceCurrency
    : "GBP") as Currency;
  const amount = convert(product.priceAmount, baseCurrency, displayCurrency, fx);
  const converted = baseCurrency !== displayCurrency;
  return {
    show: true,
    amount,
    text: formatMoney(amount, displayCurrency, locale),
    displayCurrency,
    baseCurrency,
    baseAmount: product.priceAmount,
    unit: product.priceUnit ?? undefined,
    converted,
    rateNote: converted
      ? `Indicative conversion from ${baseCurrency} · rate of ${formatRateTimestamp(
          fx.fetchedAt,
          locale
        )}`
      : `Published price · confirmed in your quotation`,
  };
}
