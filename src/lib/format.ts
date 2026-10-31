/** Date/time helpers shared by the storefront and dashboard. */

export function formatDate(value: Date | string, locale = "en-GB"): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date);
}

export function formatDateTime(value: Date | string, locale = "en-GB"): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function timeAgo(value: Date | string, locale = "en-GB"): string {
  const date = typeof value === "string" ? new Date(value) : value;
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["second", 60],
    ["minute", 60],
    ["hour", 24],
    ["day", 7],
    ["week", 4.35],
    ["month", 12],
  ];
  let amount = seconds;
  for (const [unit, size] of units) {
    if (Math.abs(amount) < size) {
      return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
        -Math.round(amount),
        unit
      );
    }
    amount = amount / size;
  }
  return formatDate(date, locale);
}

/** Compact list: ["A","B","C"] → "A, B & C" */
export function listJoin(items: string[], locale = "en"): string {
  return new Intl.ListFormat(locale, { style: "long", type: "conjunction" }).format(items);
}
