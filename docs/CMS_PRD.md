# CMS — Product Requirements Document (PRD)

**Project:** Content management system for `meenakshigirish.com`
**Site stack:** Vite + React 19 + TypeScript SPA on Vercel (serverless `/api/*.js`)
**Author:** Built with Claude Code for Meenakshi Girish
**Date:** 2026-07-19 · **Status:** Approved design, pending implementation
**Companion doc:** `CMS_TASK.md` (implementation breakdown)

---

## 1. Overview

Add a hidden, secure admin CMS that lets Meenakshi manage site content herself — no code edits, no Claude round-trips per photo. Two primary capabilities plus four "extras," all behind a single admin login:

- **Primary:** Gallery photo management (the Speaking-page DomeGallery) and Blog management (full CMS: draft/publish/edit/delete + public blog pages).
- **Extras:** Testimonials, Featured-In items, Book/Buy settings, Contact info & socials.

The public site gains a **Blog section** that stays hidden until the first blog is published, then appears like any normal page (nav + footer + hero).

## 2. Goals & non-goals

**Goals**
- Admin can add / edit / remove gallery photos, blog posts, testimonials, featured-in items, and edit book price / contact / socials — all from one on-brand dashboard.
- Blog listing + individual posts appear publicly with full SEO and match the site design.
- Security: credentials and write access cannot be obtained by inspecting or downloading the client bundle. All enforcement is server-side.
- Zero ongoing infra cost; no new databases to operate. Everything version-controlled in the existing GitHub repo.

**Non-goals (YAGNI)**
- No multi-user accounts, roles, or permissions. Single admin.
- No media library UI beyond per-field uploads.
- No content scheduling, A/B, comments, or AI authoring.
- No migration of historical content beyond seeding the current state.
- Not replacing GA4 / Vercel Analytics (both already present).

## 3. Key decisions (locked during planning)

| Decision | Choice | Why |
|---|---|---|
| Data + image storage | **Git as the database** | Free, version-controlled, no marketplace billing; edits trigger a Vercel rebuild (~1 min) — acceptable for occasional edits. |
| Blog body authoring | **TipTap WYSIWYG** | Familiar Word-like editing; toolbar offers H2/H3 (title field is the H1); HTML stored, sanitized on render. |
| Auth model | Server-side env credentials + signed `httpOnly` cookie | Anything client-side is bypassable; enforcement must be on the server. |
| Public blog visibility | Hidden until ≥1 published post | Per request; nav link auto-reveals on first publish. |
| Extras in scope | Testimonials, Featured-In, Book/Buy, Contact/Socials | Per request. |
| Form capture | Email only (no Sheet) | Per request; `/api/contact-message` already ships. |
| Analytics | Vercel Web Analytics + Speed Insights | Already shipped in this batch. |

## 4. Architecture (Git-as-backend)

```
Browser (admin)                         Vercel serverless               GitHub repo
─────────────────                       ──────────────────              ────────────────
/login  ──POST creds──▶  /api/admin-login  ──verify env hash──▶  set signed cookie
                                                                    (SESSION_SECRET HMAC)
/admin  (client guard)   /api/cms/*      ──verify cookie──▶   GitHub Contents API
   edit content   ──POST──▶              ──PUT file(s)──▶      src/content/*.json
                                               + commit           public/images/cms/*
                                                                          │
                                                                          ▼
                                                                  Vercel auto-rebuild
                                                                          │
                                                                          ▼
Public pages read `src/content/*.json` via build-time imports (static, SEO-friendly).
Admin editor reads live data via GET (GitHub raw) so it always shows latest committed state.
```

**Two read paths (important):**
- **Public pages** import the content JSON at build time (`import blogs from '../content/blogs.json'`). Fast, static, crawlable. A CMS save commits new JSON → Vercel rebuilds → the new build reflects it.
- **Admin editor** fetches live JSON from GitHub (via `GET /api/cms/content`) so it shows the truth even while a rebuild is in flight.

**Components inventory** (from codebase survey):
- Reuse: `PageHero`, `SectionHeader`, `FadeUp`, `AbstractDeco`, design tokens (`src/index.css` `@theme`), `useSEO`.
- Extend: `useSEO` (add `image`, `type`, `article` tags, JSON-LD). `BubbleMenu` (conditional Blog link). `SpeakingPage` (read gallery from JSON). `BuyPage` (book price from settings). `Footer`/`ContactPage` (socials/email from settings).
- New: `LoginPage`, `AdminPage` (+ section components), `BlogListPage`, `BlogPostPage`, serverless fns, content JSON seed.

## 5. Security model

**Threat model:** anyone can view/download the JS bundle; we assume that is fully known to an attacker. The only thing that must stop mutation is the server-side password. "Hidden URL" is a thin defense-in-depth layer, not the real control.

**Credentials — never in code/git/client:**
- Env vars: `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` (format `pbkdf2$<iterations>$<saltB64>$<hashB64>`), generated by a one-off local script (`scripts/hash-password.mjs`) using Node Web Crypto PBKDF2-SHA256. The plaintext password is stored nowhere.
- Login compares the username (constant-time) and re-derives PBKDF2 from the submitted password + stored salt/iterations, constant-time compares to the hash.

**Session:**
- On success, `/api/admin-login` sets cookie `cms_session` = `base64url(payload).base64url(hmac)` where payload = `{ iat, exp }`, exp = now + 8h, signed with `SESSION_SECRET` (HMAC-SHA256, Web Crypto).
- Cookie attributes: `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`, `Max-Age=28800`.
- `crypto.timingSafeEqual` for both the username and the HMAC verification.

**Enforcement:**
- Every `/api/cms/*` mutation verifies the cookie (valid HMAC + not expired) **and** checks `Origin`/`Referer` is same-origin (CSRF defense). Invalid → 401.
- The GitHub token (`GITHUB_TOKEN`, fine-grained PAT scoped to **only `aacharles111/MeenakshiGirish`**, permissions `Contents: Read & Write` + `Metadata: Read`) lives server-side and never reaches the browser.

**Brute-force / abuse:**
- Require a high-entropy password (generator provided; ≥ 20 chars).
- Per-failed-login delay (~400 ms) server-side to slow automated guessing.
- Recommend enabling **Vercel Firewall** with a rate-limit rule on `/api/admin-login` (e.g., ≤ 10 req/min/IP). Documented as a setup step.

**Audit:**
- Every CMS mutation writes a structured Vercel log line (`[cms] <resource> <action> by admin`) — no PII.
- Every change is a git commit on `master`, giving full history + one-click revert.

**Discovery surface:**
- `/login` and `/admin` are not linked anywhere in nav/footer.
- `public/robots.txt` adds `Disallow: /login` and `Disallow: /admin`.

## 6. Data model

All content lives as JSON under `src/content/` (committed). Uploaded images live under `public/images/cms/`.

### `src/content/blogs.json`
```ts
interface BlogsFile { blogs: Blog[] }
interface Blog {
  id: string;            // uuid
  slug: string;          // url-safe, unique; auto from title, editable
  title: string;         // page H1 + card title
  metaTitle: string;     // <title>, ≤60 chars
  metaDescription: string; // ≤160 chars
  excerpt: string;       // card summary, ≤200 chars
  banner: string;        // image URL (/images/cms/... or absolute)
  bannerAlt: string;
  body: string;          // TipTap HTML (sanitized on render)
  status: "draft" | "published";
  publishedAt: string;   // ISO8601
  updatedAt: string;     // ISO8601
  author: string;        // default "Meenakshi Girish"
}
```

### `src/content/gallery.json`
```ts
interface GalleryFile { images: { src: string; alt: string }[] }
```
(Seeded with the current 29 Speaking-page photos; replaces the hardcoded `mentoringImages` array.)

### `src/content/testimonials.json`
```ts
interface TestimonialsFile { testimonials: { id: string; quote: string; author: string; role: string }[] }
```
Single shared pool rendered by the Home, Speaking, and Book testimonial sections (replaces their currently-hardcoded arrays).

### `src/content/featured.json`
```ts
interface FeaturedFile { items: { id: string; label: string; url: string }[] }
```
Each item is a clickable label/logo in the Home "Featured In" strip.

### `src/content/site-settings.json`
```ts
interface SiteSettings {
  book: { priceInr: number; title: string; buyCtaLabel: string };
  contact: { email: string };
  socials: { label: string; url: string; icon: "linkedin" | "instagram" | "youtube" | "spotify" }[];
}
```
Flows into `BuyPage` (price/CTA), `Footer` + `ContactPage` (email + socials).

## 7. Admin experience

**`/login` (hidden):** on-brand card — username + password, "Show password" toggle, error state, loading state. On success → redirect `/admin`. If already authed → redirect `/admin`.

**`/admin` (hidden, protected):** brand-styled dashboard. Top bar: site name, "View site", "Log out". Left nav / tabs: **Blogs · Gallery · Testimonials · Featured In · Book & Buy · Contact & Socials.** Each section is a list + editor panel.

- **Save flow (all sections):** edit → **Save** → UI shows `Saving… → Committed ✓ → Building… → Live ✓`. If `VERCEL_TOKEN` is configured, poll the latest deployment status for the "Live" state; otherwise show `Committed — site rebuilds in ~1 min`. Errors surface inline with retry.
- **Validation:** client-side required fields + live preview where useful (blog banner, card preview). Server re-validates.
- **Destructive actions** (delete blog, remove photo) require a confirm dialog.

### Section behaviors
- **Blogs:** list (title, status badge, date) + editor drawer for the fields in §6. TipTap editor with toolbar (H2, H3, bold, italic, bullet/numbered lists, link, image). Slug auto-generated, editable; uniqueness enforced. **Save as Draft** / **Publish** / **Unpublish** / **Delete**. Live card preview.
- **Gallery:** grid of current photos with alt-text edit, replace-image, remove, reorder (drag), and **Add photos** (multi-upload → uploads to `public/images/cms/` → appended to `gallery.json`).
- **Testimonials:** list + add/edit/remove (quote, author, role).
- **Featured In:** list + add/edit/remove (label, URL).
- **Book & Buy:** price (₹), book title, buy CTA label.
- **Contact & Socials:** contact email; socials list (label, URL, icon).

## 8. Gallery management (DomeGallery)

The `DomeGallery` component is **data-driven**: it tiles whatever `images` array it receives around a 3D dome, cycling them to fill slots; clicking a tile enlarges the **full original photo** at its natural aspect ratio (object-fit contain) with a scrim/Esc-to-close. **The component is not modified.** Today `SpeakingPage` passes a hardcoded array; after this work it imports `gallery.json` instead. Adding/removing/reordering photos in the CMS → `gallery.json` → rebuild → dome updates. Alt text improves accessibility/SEO (the current array has none).

## 9. Blog system (public)

- **`/blog` (BlogListPage):** `PageHero` + responsive grid of published posts (card = banner image, title, excerpt, date). Sorted by `publishedAt` desc. If **0 published**: nav link hidden **and** the page renders a tasteful "Coming soon" hero (no broken page). Adding the first published blog auto-reveals the nav link on the next build.
- **`/blog/:slug` (BlogPostPage):** banner, title (H1), author + date, rendered body (sanitized HTML with brand typography — Playfair headings, prose spacing), and a **Back to all posts** link. Only `status: "published"` posts are reachable publicly; drafts and unknown slugs → `NotFoundPage`.
- **SEO:** extend `useSEO` to accept `image`, `type`, optional `publishedTime`/`author` and emit `og:image`, `og:type=article`, `article:author`, `article:published_time`, plus a `BlogPosting` JSON-LD block per post. Blog URLs are added to the sitemap at build time (a small Vite plugin or prebuild step reads `blogs.json` and emits entries into `public/sitemap.xml`).
- **Rendering safety:** blog `body` HTML is sanitized with DOMPurify before `dangerouslySetInnerHTML` (strip scripts, event handlers, iframes to foreign origins). TipTap only emits a safe subset anyway; sanitization is defense-in-depth.

## 10. Extras (how they wire in)
- **Testimonials:** Home `Testimonials` section (and Speaking/Book testimonial blocks) read `testimonials.json` instead of inline arrays.
- **Featured In:** Home `FeaturedIn` component reads `featured.json` (each item a clickable link).
- **Book & Buy:** `BuyPage` reads `priceInr` / `title` / `buyCtaLabel` from `site-settings.json` (replaces the `BOOK_PRICE_INR` constant and related literals); the order/verify endpoints already take the amount from the client, so server-side price validation is added (reject mismatches vs settings — defense against client tampering).
- **Contact & Socials:** `Footer` and `ContactPage` read `contact.email` and `socials` from `site-settings.json`.

## 11. API specification

All `/api/cms/*` are `POST`, require a valid `cms_session` cookie + same-origin, and commit to GitHub via `GITHUB_TOKEN`. Public reads happen via build-time imports (no endpoint needed).

| Endpoint | Body | Action |
|---|---|---|
| `POST /api/admin-login` | `{username, password}` | Verify → set `cms_session` cookie. |
| `POST /api/admin-logout` | — | Clear cookie. |
| `GET /api/admin-session` | — | `{ authed: boolean }` (client guard). |
| `GET /api/cms/content` | — | Returns latest `blogs/gallery/testimonials/featured/settings` from GitHub (admin editor source of truth). |
| `POST /api/cms/blogs` | `{blog}` | Upsert by `id` (create or update). |
| `POST /api/cms/blogs/delete` | `{id}` | Remove by id. |
| `POST /api/cms/gallery` | `{images: {src,alt}[]}` | Replace gallery list. |
| `POST /api/cms/testimonials` | `{testimonials: [...]}` | Replace list. |
| `POST /api/cms/featured` | `{items: [...]}` | Replace list. |
| `POST /api/cms/settings` | `{settings}` | Replace site settings (server validates price ≥ 1, email format, social URLs). |
| `POST /api/cms/upload` | `{filename, contentType, dataB64}` | Validate type (jpeg/png/webp) + size (≤2 MB); commit to `public/images/cms/<ts>-<slug>.<ext>`; return `{ url }`. |

GitHub writes use `PUT /repos/{owner}/{repo}/contents/{path}` with `{ message, content, sha (on update), branch }`. Repo/branch from env (`GITHUB_REPO`, `GITHUB_BRANCH`). All endpoints return JSON `{ ok: boolean, error?: string }` and log `[cms] <resource> <action>` on success; failures log a sanitized message. No PII in logs.

## 12. Environment variables (Vercel, Production)

| Var | Purpose | Example |
|---|---|---|
| `ADMIN_USERNAME` | Login username | (admin-chosen) |
| `ADMIN_PASSWORD_HASH` | `pbkdf2$iter$saltB64$hashB64` | output of `scripts/hash-password.mjs` |
| `SESSION_SECRET` | HMAC key for session cookie | (≥32 random bytes, base64) |
| `GITHUB_TOKEN` | Fine-grained PAT (contents:write, this repo only) | `github_pat_…` |
| `GITHUB_REPO` | `owner/repo` | `aacharles111/MeenakshiGirish` |
| `GITHUB_BRANCH` | Commit target | `master` |
| `VERCEL_TOKEN` *(optional)* | Poll deploy status in the admin UI | `vercel_…` (project:read scope) |

`RESEND_API_KEY`, `ORDER_FROM_EMAIL`, `ORDER_NOTIFY_EMAIL` already exist (used by order + contact emails).

## 13. SEO & sitemap
- `useSEO` extended (additive; existing pages unaffected).
- Blog posts: full per-post meta + JSON-LD `BlogPosting`.
- Sitemap: blog URLs injected at build time; canonical/og URLs already www-canonical.

## 14. Observability
- Vercel Web Analytics + Speed Insights (shipped) — enable "Web Analytics" in the dashboard.
- Vercel Runtime Logs already on; CMS writes structured `[cms]` lines.
- GA4 unchanged.

## 15. Rollout & testing
1. Seed content JSON from current state (29 photos, existing testimonials, current book price/contact/socials). Build passes.
2. Add the new pages/routes; verify `/blog` shows "Coming soon" with no blogs; nav has no Blog link.
3. Create a draft blog in the CMS → not public; publish → `/blog` + nav link appear; `/blog/:slug` renders with correct meta (view-source / devtools).
4. Gallery: add/remove a photo via CMS → rebuild → Speaking dome reflects it; clicking still enlarges full image.
5. Extras: change book price → BuyPage total + pay-button update; change a social → Footer/Contact update; add featured item → Home shows it.
6. Security tests: hit `/api/cms/*` with no cookie → 401; wrong password → 401 + delay; confirm the GitHub PAT scope is repo-only; confirm `robots.txt` disallows `/login` & `/admin`.
7. Verify the public bundle contains no secrets (grep build output for the password/secret — must be absent).

## 16. Risks, limits, operational notes
- **Rebuild-per-save (~1 min):** acceptable for occasional edits; mitigated by deploy-status UI.
- **Repo image growth:** uploads are constrained to ≤2 MB and recommended compressed; long-term could move images to Vercel Blob if volume grows (out of scope now).
- **PAT custody:** if `GITHUB_TOKEN` leaks, rotate at GitHub (fine-grained PATs are revocable/scopable). Token has no admin rights.
- **Single branch deploy:** each save commits to `master` and deploys production — intentional simplicity; treat each save as a publish.

## 17. Future (explicitly out of scope now)
Image storage to Vercel Blob, multi-admin, content scheduling, comments, full media library, moving blogs to MDX/pre-rendering for crawler guarantees.
