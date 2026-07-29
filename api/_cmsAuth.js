// api/_cmsAuth.js — server-only auth helpers (Web Crypto, no deps).
import { webcrypto } from 'node:crypto';
const subtle = webcrypto.subtle;
const enc = new TextEncoder();
const COOKIE = 'cms_session';
const MAX_AGE = 8 * 3600; // 8h

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const SESSION_SECRET = process.env.SESSION_SECRET || '';
function secretConfigured() {
  return typeof SESSION_SECRET === 'string' && SESSION_SECRET.length >= 32;
}

const b2b64 = (u8) => Buffer.from(u8).toString('base64');
const b642u8 = (b64) => new Uint8Array(Buffer.from(b64, 'base64'));

export async function hashPassword(password, iterations = 150000) {
  const salt = webcrypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(password, salt, iterations);
  return `pbkdf2$${iterations}$${b2b64(salt)}$${b2b64(hash)}`;
}
async function derive(password, salt, iterations) {
  const key = await subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await subtle.deriveBits({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, key, 256);
  return new Uint8Array(bits);
}
export async function verifyPassword(password, stored) {
  const parts = String(stored || '').split('$');
  if (parts[0] !== 'pbkdf2' || parts.length !== 4) return false;
  const iterations = Number(parts[1]);
  if (!Number.isFinite(iterations)) return false;
  const salt = b642u8(parts[2]); const expected = b642u8(parts[3]);
  const got = await derive(password, salt, iterations);
  if (got.length !== expected.length) return false;
  let diff = 0; for (let i = 0; i < got.length; i++) diff |= got[i] ^ expected[i];
  return diff === 0;
}

export async function signSession(payload) {
  if (!secretConfigured()) throw new Error('SESSION_SECRET not configured (must be >= 32 chars)');
  const key = await subtle.importKey('raw', enc.encode(SESSION_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = await subtle.sign('HMAC', key, enc.encode(body));
  return `${body}.${Buffer.from(sig).toString('base64url')}`;
}
export async function verifySession(token) {
  if (!secretConfigured()) return null;
  if (!token || !token.includes('.')) return null;
  const [body, sig] = token.split('.');
  const key = await subtle.importKey('raw', enc.encode(SESSION_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
  const ok = await subtle.verify('HMAC', key, Buffer.from(sig, 'base64url'), enc.encode(body));
  if (!ok) return null;
  try {
    const p = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (typeof p.exp !== 'number' || Date.now() > p.exp) return null;
    return p;
  } catch { return null; }
}

export async function checkCredentials(username, password) {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD_HASH) return false;
  const userOk = constantTimeEq(username, ADMIN_USERNAME);
  const passOk = await verifyPassword(password, ADMIN_PASSWORD_HASH);
  return userOk && passOk;
}
function constantTimeEq(a, b) {
  const sa = String(a), sb = String(b);
  if (sa.length !== sb.length) return false;
  let d = 0; for (let i = 0; i < sa.length; i++) d |= sa.charCodeAt(i) ^ sb.charCodeAt(i);
  return d === 0;
}

export async function issueSessionCookie(res) {
  // Session cookie: no Max-Age/Expires, so the browser drops it when it closes
  // (closing the browser = logged out). The signed token still carries an `exp`
  // (MAX_AGE) as a server-side backstop, so a copied cookie is useless past that.
  const token = await signSession({ iat: Date.now(), exp: Date.now() + MAX_AGE * 1000 });
  res.setHeader('Set-Cookie', `${COOKIE}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/`);
}
export function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`);
}
function readCookie(req, name) {
  const header = req.headers?.cookie || '';
  const match = header.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}
export async function readSessionCookie(req) {
  const token = readCookie(req, COOKIE);
  return token ? verifySession(token) : null;
}
export function csrfOk(req) {
  const origin = req.headers?.origin || '';
  const host = req.headers?.host || '';
  if (!origin || !host) return true; // same-origin requests often omit Origin
  try { return new URL(origin).host === host; } catch { return false; }
}
// Throws a {status, body} shape the caller returns; verifies session + CSRF.
export async function requireAdmin(req) {
  if (!csrfOk(req)) throw { status: 403, body: { ok: false, error: 'Forbidden' } };
  const payload = await readSessionCookie(req);
  if (!payload) throw { status: 401, body: { ok: false, error: 'Unauthorized' } };
  return payload;
}
