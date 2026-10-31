/**
 * Stateless session envelope: `base64url(payload).hmac-sha256`.
 * Uses Web Crypto only, so it can run in the Edge middleware as well as in
 * Node route handlers and server components.
 */

const enc = new TextEncoder();

export type SessionPayload = {
  /** user id */
  sub: string;
  /** database session id (revocation support) */
  sid: string;
  email: string;
  name: string;
  role: "admin" | "manager" | "viewer";
  /** unix seconds */
  exp: number;
};

export const SESSION_COOKIE = "mge_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function base64url(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlDecode(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded.padEnd(padded.length + ((4 - (padded.length % 4)) % 4), "="));
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET must be set to a long random value.");
    }
    return "dev-only-insecure-session-secret";
  }
  return s;
}

async function key(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function hmac(payload: string): Promise<string> {
  const sig = await crypto.subtle.sign("HMAC", await key(), enc.encode(payload));
  return base64url(new Uint8Array(sig));
}

export async function signSession(
  data: Omit<SessionPayload, "exp">
): Promise<string> {
  const payload: SessionPayload = {
    ...data,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const body = base64url(enc.encode(JSON.stringify(payload)));
  return `${body}.${await hmac(body)}`;
}

export async function verifySession(
  token: string | undefined | null
): Promise<SessionPayload | null> {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  try {
    const expected = await hmac(body);
    const a = base64urlDecode(sig);
    const b = base64urlDecode(expected);
    if (a.length !== b.length) return null;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
    if (diff !== 0) return null;
    const payload = JSON.parse(
      new TextDecoder().decode(base64urlDecode(body))
    ) as SessionPayload;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (!payload.sub || !payload.sid || !payload.email) return null;
    return payload;
  } catch {
    return null;
  }
}
