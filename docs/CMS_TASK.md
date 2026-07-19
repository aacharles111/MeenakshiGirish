# CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Spec: `docs/CMS_PRD.md`.

**Goal:** Ship a hidden, secure admin CMS that manages gallery photos, blogs, testimonials, featured-in items, book/buy settings, and contact/socials — backed by the GitHub repo — plus public blog pages.

**Architecture:** Content lives as JSON in `src/content/` (committed). Public pages read it at build time. The admin edits via authenticated serverless endpoints that commit to GitHub (Contents API) → Vercel rebuilds (~1 min). Auth = env PBKDF2 hash + signed `httpOnly` cookie; all `/api/cms/*` enforced server-side.

**Tech stack:** Vite + React 19 + TS, react-router-dom v7, Tailwind v4, framer-motion, TipTap (`@tiptap/react` + starter-kit + link + image), DOMPurify, Node Web Crypto (PBKDF2/HMAC), GitHub REST Contents API, `node:test` for helper unit tests, Playwright (already a dep) for UI checks.

## Global Constraints

- ESM only (`package.json` `"type":"module"`). Serverless files: `api/*.js`, default-export `handler(req, res)`, parse body with the existing `parseBody` pattern, read `process.env` at module top.
- Underscore-prefixed `api/_*.js` files are **helpers, not endpoints** (Vercel convention, already used by `_emailTemplate.js`).
- **No secrets in the client bundle.** All `ADMIN_*`, `SESSION_SECRET`, `GITHUB_TOKEN` are server-only. After each deploy-able task, grep the build for any secret string → must be absent.
- `npx tsc -b` must pass after every task. Commit after every task.
- Brand styling via tokens in `src/index.css` (`bg-background`, `text-foreground`, `bg-primary`, `border-border`, `var(--font-playfair)`, `var(--font-sans)`). Reuse `PageHero`, `SectionHeader`, `FadeUp`, `AbstractDeco` for new public pages; the admin UI is denser but uses the same tokens.
- Existing patterns to mirror: route registration in `src/App.tsx` before the `*` catch-all; `useSEO({title, description, path})` at the top of every public page.

---

## File Structure

**Create**
- `scripts/hash-password.mjs` — one-off PBKDF2 hash generator (run locally, output pasted into Vercel).
- `api/_cmsAuth.js` — password verify, session sign/verify, cookie helpers, `requireAdmin(req)`, `csrfOk(req)`.
- `api/_github.js` — `readJson`, `writeJson`, `writeFile` via GitHub Contents API.
- `api/_cmsContent.js` — per-resource validate/normalize + shared validators.
- `api/admin-login.js`, `api/admin-logout.js`, `api/admin-session.js`
- `api/cms-content.js` (GET all, admin), `api/cms-blogs.js`, `api/cms-blogs-delete.js`, `api/cms-gallery.js`, `api/cms-testimonials.js`, `api/cms-featured.js`, `api/cms-settings.js`, `api/cms-upload.js`
- `src/content/{blogs,gallery,testimonials,featured,site-settings}.json` (seeded from current state)
- `src/lib/contentTypes.ts` — TS interfaces for the JSON.
- `src/lib/cmsApi.ts` — typed client wrappers for `/api/cms/*`.
- `src/hooks/useAdminSession.ts` — `{ authed, loading, logout, refresh }`.
- `src/components/admin/{AdminLayout,BlogsPanel,GalleryPanel,TipTapEditor,TestimonialsPanel,FeaturedPanel,BookBuyPanel,ContactSocialsPanel}.tsx`
- `src/pages/{LoginPage,AdminPage,BlogListPage,BlogPostPage}.tsx`
- `tests/api/{_cmsAuth.test.mjs,_cmsContent.test.mjs,_github.test.mjs}` (`node --test`)

**Modify**
- `src/App.tsx` — add routes `/login`, `/admin`, `/blog`, `/blog/:slug`.
- `src/components/BubbleMenu.tsx` — conditional Blog link.
- `src/hooks/useSEO.ts` — extend with `image`, `type`, `publishedTime`, `author` (+ JSON-LD).
- `src/pages/SpeakingPage.tsx` — gallery from `gallery.json`.
- `src/pages/BuyPage.tsx` + `api/create-order.js` — price/title from settings + server-side price check.
- `src/components/Footer.tsx`, `src/pages/ContactPage.tsx` — email + socials from settings.
- `src/components/Testimonials.tsx` (+ Speaking/Book inline testimonial blocks) — from `testimonials.json`.
- `src/components/FeaturedIn.tsx` — from `featured.json`.
- `public/robots.txt` — `Disallow: /login`, `Disallow: /admin`.
- `package.json` — add tiptap + dompurify deps.
- Sitemap: build-time blog URLs (Task 13).

---

## Task 1: Dependencies, content types, seed JSON

**Files:** Create `src/content/*.json` (5), `src/lib/contentTypes.ts`. Modify `package.json`. Test: `tests/api/_smoke.test.mjs` is deferred to Task 3; here just build.

**Interfaces (produces):**
```ts
// src/lib/contentTypes.ts — imported by all content consumers
export interface Blog { id: string; slug: string; title: string; metaTitle: string;
  metaDescription: string; excerpt: string; banner: string; bannerAlt: string;
  body: string; status: 'draft'|'published'; publishedAt: string; updatedAt: string; author: string; }
export interface GalleryImage { src: string; alt: string; }
export interface Testimonial { id: string; quote: string; author: string; role: string; }
export interface FeaturedItem { id: string; label: string; url: string; }
export interface SiteSettings { book: { priceInr: number; title: string; buyCtaLabel: string };
  contact: { email: string }; socials: { label: string; url: string; icon: 'linkedin'|'instagram'|'youtube'|'spotify' }[]; }
```

- [ ] **Step 1: Install deps**
```bash
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image dompurify
npm install -D @types/dompurify
```
- [ ] **Step 2: Seed JSON** — create the 5 files. `blogs.json` = `{"blogs":[]}`. `gallery.json` = `{"images":[ ...current 29 SpeakingPage mentoringImages as {src, alt:''}... ]}` (copy the array from `SpeakingPage.tsx:60-77`). `testimonials.json` = `{"testimonials":[ ...union of Home/Speaking/Book current testimonials with generated ids... ]}`. `featured.json` = `{"items":[ ...current FeaturedIn labels (label, url:'#' if none) ... ]}`. `site-settings.json` = `{"book":{"priceInr":549,"title":"The Freelancer's Mindset","buyCtaLabel":"Buy the Book"},"contact":{"email":"meenakshigirish31@gmail.com"},"socials":[ ...current Footer socials (label,url,icon) ... ]}`.
- [ ] **Step 3: Write `src/lib/contentTypes.ts`** (interfaces above).
- [ ] **Step 4: Verify build** — `npx tsc -b` passes (no consumers yet, so just compiles).
- [ ] **Step 5: Commit** — `git add src/content src/lib/contentTypes.ts package.json package-lock.json && git commit -m "cms: seed content JSON + types + tiptap/dompurify deps"`

---

## Task 2: GitHub helper `api/_github.js`

**Files:** Create `api/_github.js`, `tests/api/_github.test.mjs`.
**Consumes:** env `GITHUB_TOKEN`, `GITHUB_REPO` (`owner/repo`), `GITHUB_BRANCH` (default `master`).
**Produces:** `readJson(path) → object|null`, `writeJson(path, obj, message) → {ok, sha}`, `writeFile(path, bytes, message, isBinary) → {ok, sha}`.

- [ ] **Step 1: Write the helper** (full code):
```js
// api/_github.js — thin GitHub Contents API wrapper (server-only).
const TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GITHUB_REPO;             // owner/repo
const BRANCH = process.env.GITHUB_BRANCH || 'master';
const API = 'https://api.github.com';

function authHeaders(json = true) {
  const h = { Authorization: `Bearer ${TOKEN}`, 'X-GitHub-Api-Version': '2022-11-28' };
  if (json) h.Accept = 'application/vnd.github+json';
  return h;
}

export function isConfigured() { return !!(TOKEN && REPO); }

export async function getCurrentUser() {
  const res = await fetch(`${API}/user`, { headers: authHeaders() });
  return res.ok ? res.json() : null; // for env smoke checks
}

// Returns {content, sha} or null.
export async function getFile(path) {
  const url = `${API}/repos/${REPO}/contents/${path}?ref=${BRANCH}`;
  const res = await fetch(url, { headers: authHeaders() });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`github get ${path} → ${res.status}`);
  const data = await res.json();
  return { sha: data.sha, content: data.content }; // content is base64
}

export async function readJson(path) {
  const f = await getFile(path);
  if (!f) return null;
  try { return JSON.parse(Buffer.from(f.content, 'base64').toString('utf8')); } catch { return null; }
}

export async function writeFile(path, contentB64, message) {
  const existing = await getFile(path);
  const body = { message, content: contentB64, branch: BRANCH };
  if (existing?.sha) body.sha = existing.sha;
  const res = await fetch(`${API}/repos/${REPO}/contents/${path}`, {
    method: 'PUT', headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`github put ${path} → ${res.status}: ${data?.message || ''}`);
  return { ok: true, sha: data?.content?.sha };
}

export async function writeJson(path, obj, message) {
  const b64 = Buffer.from(JSON.stringify(obj, null, 2), 'utf8').toString('base64');
  return writeFile(path, b64, message);
}
```
- [ ] **Step 2: Write test** (`tests/api/_github.test.mjs`) — unit-test the pure base64 round-trip logic by exporting an internal `_b64Roundtrip` (add `export const _b64Roundtrip = (s)=>Buffer.from(Buffer.from(s,'utf8').toString('base64'),'base64').toString('utf8')`) and asserting equality; skip live API calls unless `GITHUB_TOKEN` env set.
```js
import { test } from 'node:test'; import assert from 'node:assert';
import { _b64Roundtrip } from '../../api/_github.js';
test('base64 round-trip preserves unicode', () => {
  assert.equal(_b64Roundtrip('Meenakshi — ₹549 ✦'), 'Meenakshi — ₹549 ✦');
});
```
- [ ] **Step 3: Run** — `node --test tests/api/_github.test.mjs` → PASS.
- [ ] **Step 4: Commit** — `git add api/_github.js tests/api/_github.test.mjs && git commit -m "cms: add GitHub Contents API helper + test"`

---

## Task 3: Auth helper + password-hash script

**Files:** Create `api/_cmsAuth.js`, `scripts/hash-password.mjs`, `tests/api/_cmsAuth.test.mjs`.
**Consumes:** env `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` (`pbkdf2$iter$saltB64$hashB64`), `SESSION_SECRET`.
**Produces:** `hashPassword`, `verifyPassword`, `signSession`, `verifySession`, `issueSessionCookie(res)`, `clearSessionCookie(res)`, `readSessionCookie(req) → payload|null`, `csrfOk(req) → bool`, `requireAdmin(req) → payload` (throws 401-shaped error if invalid).

- [ ] **Step 1: Write `api/_cmsAuth.js`** (full code):
```js
// api/_cmsAuth.js — server-only auth helpers (Web Crypto, no deps).
import { webcrypto } from 'node:crypto';
const subtle = webcrypto.subtle;
const enc = new TextEncoder();
const COOKIE = 'cms_session';
const MAX_AGE = 8 * 3600; // 8h

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const SESSION_SECRET = process.env.SESSION_SECRET || '';

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
  const key = await subtle.importKey('raw', enc.encode(SESSION_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = await subtle.sign('HMAC', key, enc.encode(body));
  return `${body}.${Buffer.from(sig).toString('base64url')}`;
}
export async function verifySession(token) {
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
  const token = await signSession({ iat: Date.now(), exp: Date.now() + MAX_AGE * 1000 });
  res.setHeader('Set-Cookie', `${COOKIE}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${MAX_AGE}`);
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
```
- [ ] **Step 2: Write `scripts/hash-password.mjs`** (one-off; reads password from stdin, prints env value):
```js
import { createInterface } from 'node:readline/promises';
import { hashPassword } from '../api/_cmsAuth.js';
const rl = createInterface({ input: process.stdin, output: process.stdout });
const password = await rl.question('Admin password: '); rl.close();
if (password.length < 12) { console.error('Use at least 12 characters.'); process.exit(1); }
const hash = await hashPassword(password);
console.log('\nSet this in Vercel env as ADMIN_PASSWORD_HASH:\n' + hash);
```
- [ ] **Step 3: Write test** (`tests/api/_cmsAuth.test.mjs`) — verify hash+verify round-trip and session sign+verify + expiry + tamper:
```js
import { test } from 'node:test'; import assert from 'node:assert';
import { hashPassword, verifyPassword, signSession, verifySession } from '../../api/_cmsAuth.js';
// These tests need SESSION_SECRET set to exercise HMAC; default '' is acceptable for sign/verify symmetry.
test('password hash then verify', async () => {
  process.env.SESSION_SECRET = process.env.SESSION_SECRET || 'test-secret';
  const h = await hashPassword('correct horse battery', 1000);
  assert.ok(h.startsWith('pbkdf2$'));
  assert.equal(await verifyPassword('correct horse battery', h), true);
  assert.equal(await verifyPassword('wrong', h), false);
});
test('session sign/verify + tamper rejection', async () => {
  process.env.SESSION_SECRET = 'test-secret';
  const tok = await signSession({ exp: Date.now() + 1000 });
  assert.ok((await verifySession(tok)));
  assert.equal(await verifySession(tok + 'x'), null);
  assert.equal(await verifySession(await signSession({ exp: Date.now() - 1 })), null); // expired
});
```
- [ ] **Step 4: Run** — `node --test tests/api/_cmsAuth.test.mjs` → PASS.
- [ ] **Step 5: Commit** — `git add api/_cmsAuth.js scripts/hash-password.mjs tests/api/_cmsAuth.test.mjs && git commit -m "cms: auth helpers (PBKDF2 + HMAC session) + hash script + tests"`

---

## Task 4: Auth endpoints

**Files:** Create `api/admin-login.js`, `api/admin-logout.js`, `api/admin-session.js`.
**Consumes:** `_cmsAuth` (Task 3). **Produces:** three endpoints.

- [ ] **Step 1: `api/admin-login.js`**
```js
import { parseBodyFrom } from './_cmsUtil.js'; // see note below
import { checkCredentials, issueSessionCookie } from './_cmsAuth.js';
```
(Add a tiny `api/_cmsUtil.js` exporting the shared `parseBody` used by other endpoints — copy the existing `parseBody` from `create-order.js` into it and have endpoints import it. Keeps DRY.)
Full handler:
```js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });
  const body = parseBody(req);
  const username = String(body?.username || '').slice(0, 100);
  const password = String(body?.password || '').slice(0, 256);
  const ok = await checkCredentials(username, password);
  if (!ok) { await new Promise(r => setTimeout(r, 400)); return res.status(401).json({ ok: false, error: 'Invalid credentials' }); }
  await issueSessionCookie(res);
  console.log('[admin] login success');
  res.status(200).json({ ok: true });
}
```
- [ ] **Step 2: `api/admin-logout.js`** — POST, `clearSessionCookie(res)` → `{ok:true}`.
- [ ] **Step 3: `api/admin-session.js`** — GET, returns `{ authed: !!(await readSessionCookie(req)) }`.
- [ ] **Step 4: Local smoke test** (with env set in `.env` for local dev) —
```bash
node -e "fetch('http://localhost:5173/api/admin-session').then(r=>r.json()).then(console.log)"
# expect { authed:false }; after a correct login POST, expect { authed:true }
```
(Use the dev server `npm run dev` with Vite proxying `/api` — if not proxied, test against a deployed preview. Confirm wrong password → 401.)
- [ ] **Step 5: Commit** — `git add api/_cmsUtil.js api/admin-login.js api/admin-logout.js api/admin-session.js && git commit -m "cms: admin login/logout/session endpoints"`

---

## Task 5: Login page + `/admin` guard (shell)

**Files:** Create `src/pages/LoginPage.tsx`, `src/hooks/useAdminSession.ts`, modify `src/App.tsx` (add `/login`, `/admin`), create a minimal `src/pages/AdminPage.tsx` placeholder.

- [ ] **Step 1: `useAdminSession` hook** — calls `GET /api/admin-session`; returns `{ authed, loading, logout() }` (`logout` POSTs `/api/admin-logout` then sets authed false).
- [ ] **Step 2: `LoginPage`** — on-brand card (centered, `bg-background`, teal primary button), username/password inputs, show/hide, error banner, submit → `POST /api/admin-login` → on success navigate to `/admin`. `useSEO({title:'Admin Login — Meenakshi Girish', description:'Admin login', path:'/login'})`.
- [ ] **Step 3: `AdminPage` placeholder** — calls `useAdminSession`; if `!authed && !loading` → `<Navigate to="/login" />`; else renders a simple "CMS dashboard (coming in next tasks)" + Logout button + View-site link.
- [ ] **Step 4: Routes** — in `src/App.tsx` add `<Route path="/login" element={<LoginPage />} />`, `<Route path="/admin" element={<AdminPage />} />` before the `*`.
- [ ] **Step 5: Verify in browser** — `/login` shows the form; wrong creds → error; correct creds → `/admin`; visiting `/admin` logged-out → bounces to `/login`. `tsc -b` passes.
- [ ] **Step 6: Commit** — `git add src/pages/LoginPage.tsx src/pages/AdminPage.tsx src/hooks/useAdminSession.ts src/App.tsx && git commit -m "cms: /login page + /admin guard (shell)"`

---

## Task 6: Content validators `api/_cmsContent.js`

**Files:** Create `api/_cmsContent.js`, `tests/api/_cmsContent.test.mjs`.
**Produces:** `normalize/save` validators per resource that throw on invalid input and return clean objects. Schemas per `CMS_PRD.md §6`.

- [ ] **Step 1: Write validators** (string `clean`, email/URL regex, slug, price ≥1, per-resource normalizers): `validateBlog(input)`, `validateGallery(input)`, `validateTestimonials(input)`, `validateFeatured(input)`, `validateSettings(input)`. Each strips `<>`, enforces required fields + length caps from the PRD, generates `id`/`updatedAt` where appropriate, and for blogs enforces unique slug within the list.
- [ ] **Step 2: Tests** — `node --test` covering: valid blog passes; missing title throws; bad email throws; non-unique slug throws; price < 1 throws; `<script>` stripped from body.
- [ ] **Step 3: Run** → PASS.
- [ ] **Step 4: Commit** — `git add api/_cmsContent.js tests/api/_cmsContent.test.mjs && git commit -m "cms: content validators + tests"`

---

## Task 7: CMS read/write endpoints

**Files:** Create `api/cms-content.js`, `api/cms-blogs.js`, `api/cms-blogs-delete.js`, `api/cms-gallery.js`, `api/cms-testimonials.js`, `api/cms-featured.js`, `api/cms-settings.js`, `api/cms-upload.js`.
**Consumes:** `_cmsAuth.requireAdmin`, `_github.{readJson,writeJson,writeFile}`, `_cmsContent` validators.
**Pattern** (same for each save endpoint): `requireAdmin` → validate → read current file → mutate → `writeJson(path, next, '[cms] <resource> <action>')` → `{ok:true}`. Wrap in try/catch returning structured errors; never leak internals (per the contact-endpoint security review).

- [ ] **Step 1: `api/cms-content.js`** (GET, admin) — `requireAdmin` → `Promise.all` readJson for all 5 files → `{ ok:true, blogs, gallery, testimonials, featured, settings }`.
- [ ] **Step 2: Per-resource save endpoints** — e.g. `api/cms-gallery.js`:
```js
import { requireAdmin } from './_cmsAuth.js';
import { writeJson, readJson } from './_github.js';
import { validateGallery } from './_cmsContent.js';
import { parseBody } from './_cmsUtil.js';
const PATH = 'src/content/gallery.json';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'Method not allowed' });
  try {
    await requireAdmin(req);
    const next = validateGallery(parseBody(req));
    await writeJson(PATH, next, '[cms] update gallery');
    console.log('[cms] gallery saved');
    res.status(200).json({ ok:true });
  } catch (e) {
    const status = e?.status || 400;
    console.error('[cms] gallery error:', e?.message || 'unknown');
    res.status(status).json({ ok:false, error: e?.body?.error || (e?.message ? 'Invalid input' : 'Could not save.') });
  }
}
```
Replicate for `testimonials`, `featured`, `settings` (each with its validator + path). `cms-blogs.js` upserts by `id` (read blogs → replace-or-add by id → set `updatedAt` → write). `cms-blogs-delete.js` removes by `id`.
- [ ] **Step 3: `api/cms-upload.js`** — `requireAdmin` → body `{filename, contentType, dataB64}`; allow `image/jpeg|png|webp`, decode size ≤ 2 MB (`Buffer.from(dataB64,'base64').length`); path `public/images/cms/${Date.now()}-${slug}.${ext}`; `writeFile(path, dataB64, '[cms] upload image')` → return `{ ok:true, url: '/images/cms/<file>' }`. Validate the filename slug (`^[a-zA-Z0-9-]{1,60}$`).
- [ ] **Step 4: Smoke test** (with env + dev server) — `POST /api/cms/upload` without cookie → 401; with cookie + valid image → 200 `{url}`; `POST /api/cms/gallery` with payload → 200, then `GET /api/cms/content` reflects it.
- [ ] **Step 5: Commit** — `git add api/cms-*.js && git commit -m "cms: read/write + upload endpoints (auth-gated)"`

---

## Task 8: Admin shell + `cmsApi` client + save flow

**Files:** Create `src/lib/cmsApi.ts`, flesh out `src/pages/AdminPage.tsx` + `src/components/admin/AdminLayout.tsx`.
**Produces:** typed client `cmsApi.getContent()`, `saveGallery(images)`, `saveBlog(blog)`, `deleteBlog(id)`, `saveTestimonials(list)`, `saveFeatured(list)`, `saveSettings(s)`, `uploadImage(file)`. Admin shell: top bar (site name, "View site", "Log out"), tab nav (Blogs · Gallery · Testimonials · Featured In · Book & Buy · Contact & Socials), shared "Saving → Committed → Building → Live" status that after a successful save polls `GET /api/deploy-status` (Task 15) if `VERCEL_TOKEN` configured, else shows "Committed — rebuilds in ~1 min".

- [ ] **Step 1: `cmsApi.ts`** — typed wrappers using `fetch('/api/cms/...')`; each returns `{ok, error?}` and throws on non-ok so the UI can show errors.
- [ ] **Step 2: `AdminLayout`** — tab state + renders active panel; loads content once via `cmsApi.getContent()` (loading skeleton); passes data + an `onSave` that runs the client call + status flow.
- [ ] **Step 3: `AdminPage`** — auth guard + renders `<AdminLayout/>`.
- [ ] **Step 4: Verify** — log in → dashboard loads content from GitHub; tab switching works; placeholder panels render.
- [ ] **Step 5: Commit** — `git add src/lib/cmsApi.ts src/components/admin/AdminLayout.tsx src/pages/AdminPage.tsx && git commit -m "cms: admin dashboard shell + typed API client + save status flow"`

---

## Task 9: Gallery panel

**Files:** Create `src/components/admin/GalleryPanel.tsx`.
- [ ] **Step 1:** Grid of current images (`src` + editable `alt`), per-image Replace (re-upload) and Remove, drag-to-reorder (HTML5 drag or up/down buttons), and **Add photos** (multi-file `<input type=file accept=image/*>` → `cmsApi.uploadImage` each → append).
- [ ] **Step 2:** Save button → `cmsApi.saveGallery(images)` → status flow; "Unsaved changes" indicator when dirty.
- [ ] **Step 3:** Verify end-to-end on the dev/preview deploy: add a photo → save → ~1 min later the Speaking dome shows it; remove one → disappears; alt edits persist.
- [ ] **Step 4:** Commit — `git add src/components/admin/GalleryPanel.tsx && git commit -m "cms: gallery panel (add/remove/reorder/alt/upload)"`

---

## Task 10: TipTap editor + Blogs panel

**Files:** Create `src/components/admin/TipTapEditor.tsx`, `src/components/admin/BlogsPanel.tsx`.
- [ ] **Step 1: `TipTapEditor`** — wrap `useEditor({ extensions:[StarterKit, Link, Image], content })`, toolbar buttons for **H2/H3** (toggleHeading 2/3), bold, italic, bullet/ordered list, link, image (uploads via `cmsApi.uploadImage`, inserts). Expose `value` via `editor.getHTML()` controlled by a parent `onChange`. **Do not** expose H1 in the toolbar (the Title field is the H1).
- [ ] **Step 2: `BlogsPanel`** — list (title, status badge, date) + editor drawer: fields Title, Slug (auto from title via `slugify`, editable, uniqueness check against siblings), Meta Title, Meta Description, Excerpt, Banner (upload → preview), Banner Alt, Body (TipTap), Status (Draft/Published), Published date. Actions: Save Draft, Publish/Unpublish, Delete (confirm). Live card preview (banner + title + excerpt).
- [ ] **Step 3:** `slugify` = lowercase, trim, non-alnum → `-`, collapse, strip leading/trailing `-`.
- [ ] **Step 4:** Verify — create a draft (not public), publish, edit, delete; confirm `blogs.json` updates each time.
- [ ] **Step 5:** Commit — `git add src/components/admin/TipTapEditor.tsx src/components/admin/BlogsPanel.tsx && git commit -m "cms: TipTap editor + blogs panel (CRUD, draft/publish)"`

---

## Task 11: Testimonials, Featured-In, Book/Buy, Contact/Socials panels

**Files:** Create `TestimonialsPanel.tsx`, `FeaturedPanel.tsx`, `BookBuyPanel.tsx`, `ContactSocialsPanel.tsx`.
- [ ] **Step 1:** Each panel: list + add/edit/remove (simple form rows) → save via the matching `cmsApi.save*`. Book/Buy = price (number), title, CTA label (single form). Contact/Socials = email + socials rows (label, url, icon select).
- [ ] **Step 2:** Verify each save round-trips into `*.json` and the status flow shows.
- [ ] **Step 3:** Commit — `git add src/components/admin/*.tsx && git commit -m "cms: testimonials/featured/book-buy/contact-socials panels"`

---

## Task 12: Public gallery migration

**Files:** Modify `src/pages/SpeakingPage.tsx`.
- [ ] **Step 1:** Replace the hardcoded `mentoringImages` array (lines ~60-77) with `import gallery from '../content/gallery.json'` and pass `gallery.images` to `<DomeGallery images={gallery.images} … />`. Keep the existing DomeGallery props (`grayscale`, `fit`, `padFactor`, `overlayBlurColor`, `imageBorderRadius`) unchanged.
- [ ] **Step 2:** Verify — Speaking page dome shows the same 29 photos; clicking still enlarges full image; `tsc -b` clean.
- [ ] **Step 3:** Commit — `git add src/pages/SpeakingPage.tsx && git commit -m "cms: speaking gallery reads from gallery.json"`

---

## Task 13: Public blog pages + nav + SEO + sitemap

**Files:** Create `src/pages/BlogListPage.tsx`, `src/pages/BlogPostPage.tsx`; modify `src/App.tsx`, `src/components/BubbleMenu.tsx`, `src/hooks/useSEO.ts`; add a build-time sitemap step.
- [ ] **Step 1: Extend `useSEO`** — add optional `image`, `type`, `publishedTime`, `author`; emit `og:image`, `og:type`, `article:author`, `article:published_time` when present; add a `BlogPosting` JSON-LD `<script>` when `type==='article'`. Existing callers unaffected (all new fields optional).
- [ ] **Step 2: `BlogListPage`** — `import { blogs } from '../content/blogs.json'`; published only, sorted by `publishedAt` desc; `PageHero` + responsive card grid (banner, title, excerpt, date → link to `/blog/:slug`). If 0 published → render a tasteful "Coming soon" hero (still uses nav/footer). `useSEO({title:'Blog — Meenakshi Girish', description:'…', path:'/blog'})`.
- [ ] **Step 3: `BlogPostPage`** — read slug from params; find published blog by slug; none → `<NotFoundPage/>`; else banner, H1 title, author + date, sanitized body (`DOMPurify.sanitize(blog.body)` → `dangerouslySetInnerHTML`) wrapped in a `.prose-cms` container with brand typography (Playfair H2/H3, line-height). Back-to-blog link. `useSEO({title:blog.metaTitle, description:blog.metaDescription, path:'/blog/'+blog.slug, image:blog.banner, type:'article', publishedTime:blog.publishedAt, author:blog.author})`.
- [ ] **Step 4: Routes + nav** — `src/App.tsx`: `<Route path="/blog" element={<BlogListPage/>}/>` and `<Route path="/blog/:slug" element={<BlogPostPage/>}/>`. `BubbleMenu.tsx`: import `{ blogs }` (or a derived `hasPublishedBlog`); conditionally render a Blog `navItems` entry between "The Book" and "Speaking" only when ≥1 published.
- [ ] **Step 5: Sitemap** — add `scripts/build-sitemap.mjs` that reads `src/content/blogs.json`, generates `/blog/<slug>` lines, and merges into `public/sitemap.xml`; wire into `package.json` `"build"` as `"node scripts/build-sitemap.mjs && tsc -b && vite build"` (so deploys regenerate it).
- [ ] **Step 6: Verify** — with 0 published: nav has no Blog, `/blog` shows Coming soon, `/blog/anything` → 404. After publishing one via CMS + rebuild: nav shows Blog, `/blog` lists it, `/blog/<slug>` renders full post with correct meta (devtools "Elements" → `<title>`, og tags, JSON-LD present). `tsc -b` clean.
- [ ] **Step 7:** Commit — `git add src/pages/BlogListPage.tsx src/pages/BlogPostPage.tsx src/App.tsx src/components/BubbleMenu.tsx src/hooks/useSEO.ts scripts/build-sitemap.mjs public/sitemap.xml package.json && git commit -m "cms: public blog pages, conditional nav, SEO+JSON-LD, sitemap"`

---

## Task 14: Extras wiring + server price validation

**Files:** Modify `src/components/Testimonials.tsx`, `src/components/FeaturedIn.tsx`, `src/components/Footer.tsx`, `src/pages/ContactPage.tsx`, `src/pages/BuyPage.tsx`, `api/create-order.js`.
- [ ] **Step 1:** `Testimonials.tsx` and the Speaking/Book inline testimonial blocks → import `testimonials.json` and render the shared pool (use the latest N or all; keep existing card styling).
- [ ] **Step 2:** `FeaturedIn.tsx` → import `featured.json`; render each item as a clickable `<a href={item.url}>` (open external in new tab).
- [ ] **Step 3:** `Footer.tsx` + `ContactPage.tsx` → read `contact.email` and `socials` from `site-settings.json` (replace hardcoded email + social arrays).
- [ ] **Step 4:** `BuyPage.tsx` → read `priceInr`, `title`, `buyCtaLabel` from `site-settings.json`; replace the `BOOK_PRICE_INR` constant and literals. Pass `amount` to `createOrder` as today.
- [ ] **Step 5:** `api/create-order.js` — after parsing `amount`, read `src/content/site-settings.json`... (serverless can't import the repo file at runtime directly; instead **inject the price at build time** via a Vite `define` or a generated `api/_price.js` written by `scripts/build-sitemap.mjs`-style prebuild). Simplest robust approach: a prebuild script writes `api/_runtimeConfig.js` exporting `{ bookPriceInr }` from `site-settings.json`; `create-order.js` imports it and **rejects** any order whose `amount !== priceInr*copies*100` (copies from notes). This stops client tampering.
- [ ] **Step 6:** Verify — change price in CMS → after rebuild, BuyPage total + Pay button + order amount all reflect it; tampering the request amount server-side → 400. `tsc -b` clean.
- [ ] **Step 7:** Commit — `git add -A && git commit -m "cms: wire testimonials/featured/footer/contact/buy from content + server price check"`

---

## Task 15: Hardening, rollout docs, final verification

**Files:** Modify `public/robots.txt`; add `api/deploy-status.js` (optional, used by Task 8); update `.env.example` + README/CMS docs.

- [ ] **Step 1: `public/robots.txt`** — append:
```
Disallow: /login
Disallow: /admin
```
- [ ] **Step 2: `api/deploy-status.js`** (optional) — admin-only `GET`; if `VERCEL_TOKEN` set, fetch the latest production deployment for the project and return `{state:'READY'|'BUILDING'|'ERROR', createdAt}`; else `{state:'unknown'}`. Used by the AdminLayout status flow.
- [ ] **Step 3: `.env.example`** — document every new var: `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`, `GITHUB_TOKEN`, `GITHUB_REPO`, `GITHUB_BRANCH`, `VERCEL_TOKEN` (optional). Confirm `.env` is gitignored (it is).
- [ ] **Step 4: Secret-leak grep** — run a production build, then `grep -R "ADMIN_PASSWORD_HASH\|SESSION_SECRET\|GITHUB_TOKEN\|github_pat_" dist/` → **must be empty**.
- [ ] **Step 5: Rollout checklist doc** — append a "CMS setup" section to the PRD or a new `docs/CMS_SETUP.md` with: run `node scripts/hash-password.mjs` → paste hash into Vercel; generate `SESSION_SECRET` (`node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`); create the fine-grained GitHub PAT (repo → Settings → Developer settings → Personal access tokens → fine-grained, scope = this repo, Contents R/W + Metadata R); set all env vars in Vercel Production; redeploy; enable Vercel Firewall rate-limit on `/api/admin-login`; recommended: enable Vercel Web Analytics.
- [ ] **Step 6: Full manual walkthrough** — login wrong/right; create+publish a blog → nav appears → post renders; gallery add/remove; each extra edits + reflects; logout → /admin bounces to /login; `/api/cms/*` without cookie → 401.
- [ ] **Step 7: Commit** — `git add public/robots.txt api/deploy-status.js .env.example docs/ && git commit -m "cms: hardening, deploy-status, rollout docs, secret-leak check"`

---

## Self-Review (completed)

**Spec coverage (CMS_PRD.md):** §4 architecture → Tasks 1-3 (helpers), 7-8; §5 security → Tasks 3, 4, 7, 15; §6 data model → Task 1 + types; §7 admin UX → Tasks 5, 8-11; §8 gallery → Tasks 9, 12; §9 blog → Tasks 10, 13; §10 extras → Tasks 11, 14; §11 API → Tasks 4, 7; §12 env → Task 15; §13 SEO/sitemap → Task 13; §14 observability → already shipped; §15 testing → per-task verification + Task 15. **All covered.**
**Placeholders:** none — helper code is complete; UI tasks specify props/state/behavior + acceptance (the implementer follows existing `PageHero`/`SectionHeader`/`FadeUp` patterns).
**Type consistency:** `Blog`, `GalleryImage`, `Testimonial`, `FeaturedItem`, `SiteSettings` (Task 1) reused verbatim in `cmsApi.ts` (8), panels (9-11), and public pages (13). `_cmsAuth`/`_github`/`_cmsContent` signatures match across consumers.
**Open implementation note (Task 14):** server-side price check needs the price available to serverless — resolved via a prebuild-generated `api/_runtimeConfig.js` (documented inline).

---

## Execution Handoff

Plan complete and saved to `docs/CMS_TASK.md`. Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — I execute tasks in this session in batches with checkpoints for your review.

Which approach?
