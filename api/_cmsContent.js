// api/_cmsContent.js — server-only CMS content validators (no deps).
//
// Underscore prefix = NOT a public endpoint. Imported by /api/cms/* write
// endpoints (Task 7) to normalize and validate incoming JSON BEFORE it is
// committed to GitHub. This module is the input-trust boundary: anything that
// passes here gets committed to the repo and rendered publicly, so every field
// gets a type check + length cap, dangerous markup is stripped at save time
// (with render-time DOMPurify as a second layer in Task 13), and unique slugs
// are enforced.
//
// Each validator either returns a clean plain object matching the TS interface
// in src/lib/contentTypes.ts, or throws Error('<human message>') — messages are
// short, human-readable, and never echo large user input back.

// Strip angle brackets (blocks tag injection in plain-text fields), trim, cap.
export function clean(v, max) {
  return String(v ?? '').replace(/[<>]/g, '').trim().slice(0, max);
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Accept http(s):// URLs OR the literal "#" (featured items may have no URL yet).
// Inherently rejects javascript:, data:, etc. — only http/https pass.
// Quotes are excluded so a URL can never break out of an href/src attribute.
export const URL_RE = /^(https?:\/\/[^\s<>"']+|#)$/;

// URL-safe slug: lowercase letters, digits, hyphens.
export const SLUG_RE = /^[a-z0-9-]+$/;

// Cap URLs well below any abuse-the-string limit.
const MAX_URL = 2048;

// Validator error: thrown by every validate* function below (and by the
// requireClean helper). Carries a human-readable message that the CMS write
// endpoints surface to the admin as HTTP 400. Distinct from plain Error so
// the endpoint catch can tell validator failures (→ 400 + message) apart
// from GitHub/infra failures (plain Error → generic 500, no internals).
export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Returns the validated URL string, or null if invalid. Trims first and
// strips any stray angle brackets via clean() so they cannot be used to
// bypass the charset test.
function cleanUrl(v) {
  const s = typeof v === 'string' ? clean(v, MAX_URL) : '';
  return URL_RE.test(s) ? s : null;
}

// Keeps an existing non-empty string id (capped), else generates a fresh uuid.
function uid(input) {
  if (input && typeof input.id === 'string' && input.id.trim()) {
    return input.id.trim().slice(0, 100);
  }
  return crypto.randomUUID();
}

// Throws if value is missing/empty after cleaning; returns the cleaned value.
function requireClean(v, max, label) {
  const c = clean(v, max);
  if (!c) throw new ValidationError(`${label} is required`);
  return c;
}

// ── Blog ───────────────────────────────────────────────────────────────────

// ISO 8601 datetime, e.g. 2026-07-20T12:34:56.789Z or 2026-07-20T12:34:56+05:30.
// new Date().toISOString() output always matches this.
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/;

// DEFENSE-IN-DEPTH body sanitizer for the save boundary. Strips obvious XSS
// vectors (dangerous tag blocks, on* event handlers, javascript:/vbscript:
// URLs) so dangerous markup is never committed to the repo. The AUTHORITATIVE
// sanitizer is render-time DOMPurify (Task 13) — this regex pass is a
// second layer and is intentionally zero-dependency.
// DEFENSE-IN-DEPTH only. The authoritative sanitizer is render-time DOMPurify (applied before
// dangerouslySetInnerHTML in the blog post renderer). This regex best-effort-strips common XSS
// vectors at the save boundary; it is NOT a complete HTML sanitizer.
function sanitizeBodyHtml(html) {
  return String(html ?? '')
    // drop dangerous tag BLOCKS (tag + their content): script, iframe, object, embed, style, form, svg, math
    .replace(/<(script|iframe|object|embed|style|form|svg|math)\b[\s\S]*?<\/\1\s*>/gi, '')
    // drop any remaining standalone/void dangerous tags (open OR close, with attrs)
    .replace(/<\/?(script|iframe|object|embed|style|form|svg|math|link|meta|base)\b[^>]*>/gi, '')
    // strip inline event-handler attributes (leading whitespace incl. tab/newline)
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)?/gi, '')
    // neutralize javascript:/vbscript: URLs inside href="..." or src="..." (tolerates whitespace obfuscation like "java\tscript:")
    .replace(/(href|src)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, (whole, attr, val) => {
      const compact = String(val).replace(/\s+/g, '').toLowerCase();
      return /javascript:|vbscript:/.test(compact) ? '' : whole;
    })
    .slice(0, 50000);
}

export function validateBlog(input, existingBlogs = []) {
  if (!input || typeof input !== 'object') throw new ValidationError('Blog body is required');

  const title = requireClean(input.title, 200, 'Title');

  const slug = clean(input.slug, 80);
  if (!slug) throw new ValidationError('Slug is required');
  if (!SLUG_RE.test(slug)) throw new ValidationError('Slug must be lowercase letters, digits, and hyphens only');

  if (input.status !== 'draft' && input.status !== 'published') {
    throw new ValidationError('Status must be "draft" or "published"');
  }
  const status = input.status;

  // Body: defense-in-depth XSS strip at save time (see sanitizeBodyHtml).
  // Render-time DOMPurify is the authoritative sanitizer.
  const body = sanitizeBodyHtml(input.body);
  if (!body.trim()) throw new ValidationError('Body is required');

  const metaTitle = clean(input.metaTitle, 60);
  const metaDescription = clean(input.metaDescription, 160);
  const excerpt = clean(input.excerpt, 200);
  const banner = clean(input.banner, 500);
  const bannerAlt = clean(input.bannerAlt, 300);
  const author = clean(input.author, 120) || 'Meenakshi Girish';

  const id = uid(input);

  // Uniqueness: same slug + different id = clash.
  const clash = Array.isArray(existingBlogs)
    ? existingBlogs.find((b) => b && b.slug === slug && b.id !== id)
    : null;
  if (clash) throw new ValidationError('Slug already in use');

  const now = new Date().toISOString();
  const publishedAt = typeof input.publishedAt === 'string' && input.publishedAt.trim()
    ? input.publishedAt.trim()
    : (status === 'published' ? now : '');
  if (publishedAt && !ISO_DATE_RE.test(publishedAt)) {
    throw new ValidationError('publishedAt must be a valid ISO 8601 datetime');
  }

  return {
    id,
    slug,
    title,
    metaTitle,
    metaDescription,
    excerpt,
    banner,
    bannerAlt,
    body,
    status,
    publishedAt,
    updatedAt: now,
    author,
  };
}

// ── Gallery ────────────────────────────────────────────────────────────────
export function validateGallery(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('Gallery body is required');
  const arr = Array.isArray(input.images) ? input.images : [];
  if (arr.length > 500) throw new ValidationError('Gallery cannot exceed 500 images');
  const images = arr.map((img, i) => {
    if (!img || typeof img !== 'object') throw new ValidationError(`Image ${i + 1} is invalid`);
    const src = clean(img.src, 500);
    if (!src) throw new ValidationError(`Image ${i + 1} is missing a src`);
    const alt = clean(img.alt, 300);
    return { src, alt };
  });
  return { images };
}

// ── Testimonials ───────────────────────────────────────────────────────────
export function validateTestimonials(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('Testimonials body is required');
  const arr = Array.isArray(input.testimonials) ? input.testimonials : [];
  if (arr.length > 200) throw new ValidationError('Testimonials cannot exceed 200 entries');
  const testimonials = arr.map((t, i) => {
    if (!t || typeof t !== 'object') throw new ValidationError(`Testimonial ${i + 1} is invalid`);
    const id = uid(t);
    const quote = requireClean(t.quote, 1000, `Testimonial ${i + 1} quote`);
    const author = requireClean(t.author, 120, `Testimonial ${i + 1} author`);
    const role = clean(t.role, 160);
    return { id, quote, author, role };
  });
  return { testimonials };
}

// ── Featured ───────────────────────────────────────────────────────────────
export function validateFeatured(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('Featured body is required');
  const arr = Array.isArray(input.items) ? input.items : [];
  if (arr.length > 100) throw new ValidationError('Featured items cannot exceed 100 entries');
  const items = arr.map((it, i) => {
    if (!it || typeof it !== 'object') throw new ValidationError(`Featured item ${i + 1} is invalid`);
    const id = uid(it);
    const label = requireClean(it.label, 160, `Featured item ${i + 1} label`);
    const url = cleanUrl(it.url);
    if (url === null) throw new ValidationError(`Featured item ${i + 1} has an invalid URL`);
    return { id, label, url };
  });
  return { items };
}

// ── Site settings ──────────────────────────────────────────────────────────
const SOCIAL_ICONS = new Set(['linkedin', 'instagram', 'youtube', 'spotify']);

export function validateSettings(input) {
  if (!input || typeof input !== 'object') throw new ValidationError('Settings body is required');

  const book = (input.book && typeof input.book === 'object') ? input.book : {};
  // Reject non-number prices (booleans, strings, etc.) up front so true/'499'
  // cannot sneak through Number() coercion. Integer + ≥1 enforced below.
  if (typeof book.priceInr !== 'number') {
    throw new ValidationError('Price must be a number');
  }
  const priceRaw = book.priceInr;
  if (!Number.isFinite(priceRaw) || !Number.isInteger(priceRaw) || priceRaw < 1) {
    throw new ValidationError('Price must be at least ₹1');
  }
  const bookTitle = requireClean(book.title, 200, 'Book title');
  const buyCtaLabel = requireClean(book.buyCtaLabel, 60, 'Buy CTA label');

  const contact = (input.contact && typeof input.contact === 'object') ? input.contact : {};
  const email = clean(contact.email, 320);
  if (!EMAIL_RE.test(email)) throw new ValidationError('Contact email is invalid');

  const socialsArr = Array.isArray(input.socials) ? input.socials : [];
  if (socialsArr.length > 20) throw new ValidationError('Socials cannot exceed 20 entries');
  const socials = socialsArr.map((s, i) => {
    if (!s || typeof s !== 'object') throw new ValidationError(`Social ${i + 1} is invalid`);
    const label = requireClean(s.label, 60, `Social ${i + 1} label`);
    const url = cleanUrl(s.url);
    if (url === null) throw new ValidationError(`Social ${i + 1} has an invalid URL`);
    const icon = typeof s.icon === 'string' ? s.icon : '';
    if (!SOCIAL_ICONS.has(icon)) throw new ValidationError(`Social ${i + 1} has an invalid icon`);
    return { label, url, icon };
  });

  return {
    book: { priceInr: priceRaw, title: bookTitle, buyCtaLabel },
    contact: { email },
    socials,
  };
}
