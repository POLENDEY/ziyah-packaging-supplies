import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const PREFIX = "scrypt$";

/** Hash a password for storage. Format: scrypt$saltHex$hashHex */
export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `${PREFIX}${salt.toString("hex")}$${hash.toString("hex")}`;
}

export function isHashedPassword(stored: string): boolean {
  return stored.startsWith(PREFIX);
}

/**
 * Verify a password against a stored value.
 * Supports legacy plaintext rows so existing admins can still sign in.
 */
export function verifyPassword(password: string, stored: string): boolean {
  if (!stored) return false;
  if (!isHashedPassword(stored)) {
    const a = Buffer.from(password);
    const b = Buffer.from(stored);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  }
  const parts = stored.split("$");
  if (parts.length !== 3) return false;
  const salt = Buffer.from(parts[1], "hex");
  const expected = Buffer.from(parts[2], "hex");
  const actual = scryptSync(password, salt, expected.length);
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}
