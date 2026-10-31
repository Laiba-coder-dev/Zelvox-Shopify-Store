import { en, type Dict } from "./en";
import { de } from "./de";

export type { Dict };
export type Locale = "en" | "de";

export const LOCALES: Array<{ code: Locale; label: string; short: string }> = [
  { code: "en", label: "English", short: "EN" },
  { code: "de", label: "Deutsch", short: "DE" },
];

const dictionaries: Record<Locale, Dict> = { en, de };

export function getDict(locale: Locale): Dict {
  return dictionaries[locale] ?? en;
}

export function isLocaleValue(value: string | undefined): value is Locale {
  return value === "en" || value === "de";
}

/** Replace `{token}` placeholders in a dictionary string. */
export function t(
  template: string,
  vars?: Record<string, string | number>
): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in vars ? String(vars[key]) : match
  );
}
