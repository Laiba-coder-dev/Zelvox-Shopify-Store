import { scrypt, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Password hashing with Node's built-in scrypt — no external dependency.
 * Stored format: `scrypt$N$r$p$salt$hash`
 */

const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const KEY_LEN = 64;

export function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(16).toString("hex");
    scrypt(
      password,
      salt,
      KEY_LEN,
      { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P },
      (err, derived) => {
        if (err) reject(err);
        else
          resolve(
            `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt}$${derived.toString("hex")}`
          );
      }
    );
  });
}

export function verifyPassword(password: string, stored: string): Promise<boolean> {
  return new Promise((resolve) => {
    const parts = stored.split("$");
    if (parts.length !== 6 || parts[0] !== "scrypt") return resolve(false);
    const [, n, r, p, salt, hash] = parts;
    let expected: Buffer;
    try {
      expected = Buffer.from(hash, "hex");
    } catch {
      return resolve(false);
    }
    if (expected.length === 0) return resolve(false);
    scrypt(password, salt, expected.length, { N: Number(n), r: Number(r), p: Number(p) }, (err, derived) => {
      if (err || !derived) return resolve(false);
      resolve(
        expected.length === derived.length && timingSafeEqual(expected, derived)
      );
    });
  });
}
