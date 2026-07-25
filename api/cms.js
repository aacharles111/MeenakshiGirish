// Vercel Serverless Function — CMS catch-all router (admin-only).
//
// ONE top-level function serves every CMS content op (avoids Vercel's
// per-deployment serverless-function cap AND the nested-dynamic-route quirk
// that let the SPA's catch-all rewrite swallow /api/cms/<action>). The action
// is selected by the `?action=` query param:
//
//   GET  /api/cms?action=content       → { ok, blogs, gallery, testimonials, featured, settings }
//   POST /api/cms?action=blogs         { <blog> }            upsert by id
//   POST /api/cms?action=delete-blog   { id }                idempotent delete
//   POST /api/cms?action=gallery       { images:[...] }
//   POST /api/cms?action=testimonials  { testimonials:[...] }
//   POST /api/cms?action=featured      { items:[...] }
//   POST /api/cms?action=settings      { book, contact, socials }
//   POST /api/cms?action=upload        { filename, contentType, dataB64 } → { ok, url }
//
// Auth: requireAdmin on every action (401/403 on missing/bad session or CSRF).
// Errors: ValidationError → 400 + message; auth {status,body} → that status;
// anything else (GitHub down, etc.) → generic 500 with the real detail only in
// server logs. No internals leak to the client.

import { requireAdmin } from './_cmsAuth.js';
import { readJson, writeJson, writeFile } from './_github.js';
import {
  validateBlog,
  validateGallery,
  validateTestimonials,
  validateFeatured,
  validateSettings,
  ValidationError,
} from './_cmsContent.js';
import { parseBody } from './_cmsUtil.js';

const PATHS = {
  blogs: 'src/content/blogs.json',
  gallery: 'src/content/gallery.json',
  testimonials: 'src/content/testimonials.json',
  featured: 'src/content/featured.json',
  settings: 'src/content/site-settings.json',
};

const DEFAULTS = {
  blogs: { blogs: [] },
  gallery: { images: [] },
  testimonials: { testimonials: [] },
  featured: { items: [] },
  settings: { book: {}, contact: {}, socials: [] },
};

const KNOWN = new Set([
  'content', 'blogs', 'delete-blog', 'gallery',
  'testimonials', 'featured', 'settings', 'upload',
]);

const GENERIC_500 = {
  content: 'Could not load content. Please try again.',
  upload: 'Could not upload image. Please try again.',
  'delete-blog': 'Could not delete. Please try again.',
};

// Upload validation.
const MAX_BYTES = 2 * 1024 * 1024; // 2 MiB
const SLUG_RE = /^[a-zA-Z0-9-]{1,60}$/;
const EXT_BY_TYPE = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export default async function handler(req, res) {
  const action = req.query?.action || '';
  try {
    await requireAdmin(req);
    if (!KNOWN.has(action)) {
      return res.status(404).json({ ok: false, error: 'Not found' });
    }
    if (req.method !== (action === 'content' ? 'GET' : 'POST')) {
      return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }

    switch (action) {
      case 'content': {
        const [blogs, gallery, testimonials, featured, settings] = await Promise.all([
          readJson(PATHS.blogs),
          readJson(PATHS.gallery),
          readJson(PATHS.testimonials),
          readJson(PATHS.featured),
          readJson(PATHS.settings),
        ]);
        return res.status(200).json({
          ok: true,
          blogs: blogs ?? DEFAULTS.blogs,
          gallery: gallery ?? DEFAULTS.gallery,
          testimonials: testimonials ?? DEFAULTS.testimonials,
          featured: featured ?? DEFAULTS.featured,
          settings: settings ?? DEFAULTS.settings,
        });
      }

      case 'blogs': {
        const input = parseBody(req);
        const current = (await readJson(PATHS.blogs)) ?? { blogs: [] };
        const list = Array.isArray(current.blogs) ? current.blogs : [];
        const next = validateBlog(input, list);
        const idx = list.findIndex((b) => b && b.id === next.id);
        const nextList = idx >= 0 ? list.map((b, i) => (i === idx ? next : b)) : [...list, next];
        await writeJson(PATHS.blogs, { blogs: nextList }, '[cms] save blog');
        console.log('[cms] blog saved');
        return res.status(200).json({ ok: true });
      }

      case 'delete-blog': {
        const input = parseBody(req);
        const id = input && typeof input.id === 'string' ? input.id.trim() : '';
        if (!id) return res.status(400).json({ ok: false, error: 'Blog id is required' });
        const current = (await readJson(PATHS.blogs)) ?? { blogs: [] };
        const list = Array.isArray(current.blogs) ? current.blogs : [];
        const nextList = list.filter((b) => b && b.id !== id);
        if (nextList.length === list.length) {
          console.log('[cms] blog delete: id not found (no-op)');
        } else {
          await writeJson(PATHS.blogs, { blogs: nextList }, '[cms] delete blog');
          console.log('[cms] blog deleted');
        }
        return res.status(200).json({ ok: true });
      }

      case 'gallery': {
        await writeJson(PATHS.gallery, validateGallery(parseBody(req)), '[cms] update gallery');
        console.log('[cms] gallery saved');
        return res.status(200).json({ ok: true });
      }

      case 'testimonials': {
        await writeJson(PATHS.testimonials, validateTestimonials(parseBody(req)), '[cms] update testimonials');
        console.log('[cms] testimonials saved');
        return res.status(200).json({ ok: true });
      }

      case 'featured': {
        await writeJson(PATHS.featured, validateFeatured(parseBody(req)), '[cms] update featured');
        console.log('[cms] featured saved');
        return res.status(200).json({ ok: true });
      }

      case 'settings': {
        await writeJson(PATHS.settings, validateSettings(parseBody(req)), '[cms] update settings');
        console.log('[cms] settings saved');
        return res.status(200).json({ ok: true });
      }

      case 'upload': {
        const input = parseBody(req);
        if (!input || typeof input !== 'object') throw new ValidationError('Invalid request body');
        const { contentType, dataB64, filename } = input;
        const ext = EXT_BY_TYPE[contentType];
        if (!ext) throw new ValidationError('Image must be JPEG, PNG, or WebP');
        if (typeof dataB64 !== 'string' || !dataB64) throw new ValidationError('Image data is required');
        let buf;
        try {
          buf = Buffer.from(dataB64, 'base64');
        } catch {
          throw new ValidationError('Image data is malformed');
        }
        if (buf.length > MAX_BYTES) throw new ValidationError('Image must be 2 MB or smaller');
        const slug = typeof filename === 'string' ? filename.trim() : '';
        if (!SLUG_RE.test(slug)) throw new ValidationError('Filename must be 1–60 letters, digits, or hyphens');
        const basename = `${Date.now()}-${slug}.${ext}`;
        await writeFile(`public/images/cms/${basename}`, dataB64, '[cms] upload image');
        console.log('[cms] image uploaded');
        return res.status(200).json({ ok: true, url: `/images/cms/${basename}` });
      }

      default:
        return res.status(404).json({ ok: false, error: 'Not found' });
    }
  } catch (e) {
    if (e instanceof ValidationError) {
      return res.status(400).json({ ok: false, error: e.message });
    }
    if (e?.status) {
      return res.status(e.status).json(e.body);
    }
    console.error('[cms] error:', e?.message || 'unknown');
    return res.status(500).json({
      ok: false,
      error: GENERIC_500[action] || 'Could not save. Please try again.',
    });
  }
}
