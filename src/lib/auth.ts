import "server-only";
import { cookies } from "next/headers";
import { db } from "./db";
import { hashPassword, verifyPassword } from "./password";
import {
  SESSION_COOKIE,
  signSession,
  verifySession,
  type SessionPayload,
} from "./session";

export { hashPassword, verifyPassword };

/* -------------------------------------------------------------------------- */
/* Sessions                                                                    */
/* -------------------------------------------------------------------------- */

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const payload = await verifySession(token);
  if (!payload) return null;
  // Server-side revocation check: the session row must still exist.
  const row = await db.session.findUnique({ where: { id: payload.sid } });
  if (!row || row.expiresAt < new Date()) return null;
  const user = await db.adminUser.findUnique({ where: { id: payload.sub } });
  if (!user || !user.active) return null;
  return payload;
}

export async function requireSession(
  role?: SessionPayload["role"]
): Promise<SessionPayload | null> {
  const session = await getSession();
  if (!session) return null;
  if (role === "admin" && session.role !== "admin") return null;
  return session;
}

const ROLE_RANK = { viewer: 1, manager: 2, admin: 3 } as const;

export function hasRole(
  session: SessionPayload | null,
  min: SessionPayload["role"]
): boolean {
  if (!session) return false;
  return ROLE_RANK[session.role] >= ROLE_RANK[min];
}

/* -------------------------------------------------------------------------- */
/* Login / logout                                                              */
/* -------------------------------------------------------------------------- */

/** Naive per-identifier throttle: 8 failed attempts per 15 minutes. */
const attempts = new Map<string, { count: number; resetAt: number }>();

function throttleKey(identifier: string, ip: string) {
  return `${identifier}|${ip}`;
}

export function registerFailedAttempt(key: string): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + 15 * 60_000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 8;
}

export function clearAttempts(key: string): void {
  attempts.delete(key);
}

export async function login(
  email: string,
  password: string
): Promise<{ ok: boolean; error?: string }> {
  const user = await db.adminUser.findUnique({
    where: { email: email.toLowerCase().trim() },
  });
  if (!user || !user.active) return { ok: false, error: "Invalid e-mail or password." };
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return { ok: false, error: "Invalid e-mail or password." };

  const session = await db.session.create({
    data: {
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60_000),
    },
  });
  const token = await signSession({
    sub: user.id,
    sid: session.id,
    email: user.email,
    name: user.name,
    role: (user.role as SessionPayload["role"]) ?? "viewer",
  });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  await db.adminUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });
  return { ok: true };
}

export async function logout(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const payload = await verifySession(token);
  if (payload) {
    await db.session.deleteMany({ where: { id: payload.sid } }).catch(() => undefined);
  }
  store.delete(SESSION_COOKIE);
}
