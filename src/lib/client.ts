/** Browser-side helpers: preference cookies and the quote basket. */

export type BasketItem = {
  id: string;
  slug: string;
  name: string;
  sku: string;
};

const BASKET_KEY = "mge:basket";
export const BASKET_EVENT = "mge:basket";

export type Preferences = {
  locale?: "en" | "de";
  market?: "UK" | "DE" | "OTHER";
  currency?: "GBP" | "EUR" | "USD";
  cookieConsent?: "accepted" | "essential";
};

export async function setPreferences(prefs: Preferences): Promise<boolean> {
  try {
    const res = await fetch("/api/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prefs),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function readBasket(): BasketItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(BASKET_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is BasketItem =>
        Boolean(item) && typeof item.id === "string" && typeof item.name === "string"
    );
  } catch {
    return [];
  }
}

export function writeBasket(items: BasketItem[]): void {
  window.localStorage.setItem(BASKET_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(BASKET_EVENT, { detail: items }));
}

export function addToBasket(item: BasketItem): { added: boolean } {
  const items = readBasket();
  if (items.some((existing) => existing.id === item.id)) return { added: false };
  writeBasket([...items, item]);
  return { added: true };
}

export function removeFromBasket(id: string): void {
  writeBasket(readBasket().filter((item) => item.id !== id));
}

export function clearBasket(): void {
  writeBasket([]);
}
