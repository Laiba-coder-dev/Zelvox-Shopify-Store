import { db } from "./db";

/**
 * Key/value settings store. Every value is JSON-encoded so the admin dashboard
 * can persist structured content (copy blocks, credentials, market info) and
 * the storefront reads it back with the correct type.
 */

const cache = new Map<string, unknown>();

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  if (cache.has(key)) return cache.get(key) as T;
  const row = await db.setting.findUnique({ where: { key } });
  if (!row) return fallback;
  let value: unknown;
  try {
    value = JSON.parse(row.value);
  } catch {
    value = row.value;
  }
  cache.set(key, value);
  return value as T;
}

export async function getSettings<T extends Record<string, unknown>>(
  defaults: T
): Promise<T> {
  const keys = Object.keys(defaults);
  const rows = await db.setting.findMany({ where: { key: { in: keys } } });
  const found = new Map(rows.map((r) => [r.key, r.value]));
  const out = {} as Record<string, unknown>;
  for (const [key, fallback] of Object.entries(defaults)) {
    const raw = found.get(key);
    if (typeof raw === "string") {
      try {
        out[key] = JSON.parse(raw);
        cache.set(key, out[key]);
      } catch {
        out[key] = raw;
      }
    } else {
      out[key] = fallback;
    }
  }
  return out as T;
}

export async function setSetting(key: string, value: unknown): Promise<void> {
  const encoded = JSON.stringify(value);
  await db.setting.upsert({
    where: { key },
    update: { value: encoded },
    create: { key, value: encoded },
  });
  cache.set(key, value);
}

export async function setSettings(
  entries: Record<string, unknown>
): Promise<void> {
  await Promise.all(
    Object.entries(entries).map(([key, value]) => setSetting(key, value))
  );
}

export function clearSettingsCache(): void {
  cache.clear();
}
