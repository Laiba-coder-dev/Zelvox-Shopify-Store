import "server-only";
import { cookies } from "next/headers";
import { isLocaleValue, type Locale } from "@/locales";

/**
 * Server-side locale access (cookie driven). Pure dictionary helpers live in
 * `@/locales` so client components never import this module.
 */
export { LOCALES, getDict, isLocaleValue, t } from "@/locales";
export type { Dict, Locale } from "@/locales";

export const LOCALE_COOKIE = "mge_locale";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocaleValue(value) ? value : "en";
}
