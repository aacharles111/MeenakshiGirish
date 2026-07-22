// Vercel Serverless Function — CMS read endpoint (admin-only).
//
// GET /api/cms-content
//   returns: { ok:true, blogs, gallery, testimonials, featured, settings }
//
// Reads all 5 content files from GitHub in parallel. Any file that does not
// yet exist (null) is mapped to its empty default shape so the admin UI always
// gets a well-formed object. Auth is enforced via requireAdmin (401/403 on
// missing/bad session or CSRF). GitHub failures surface as a generic 500 —
// internal errors are never leaked to the client.

import { requireAdmin } from './_cmsAuth.js';
import { readJson } from './_github.js';
import { ValidationError } from './_cmsContent.js';

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

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
  try {
    await requireAdmin(req);
    const [blogs, gallery, testimonials, featured, settings] = await Promise.all([
      readJson(PATHS.blogs),
      readJson(PATHS.gallery),
      readJson(PATHS.testimonials),
      readJson(PATHS.featured),
      readJson(PATHS.settings),
    ]);
    res.status(200).json({
      ok: true,
      blogs: blogs ?? DEFAULTS.blogs,
      gallery: gallery ?? DEFAULTS.gallery,
      testimonials: testimonials ?? DEFAULTS.testimonials,
      featured: featured ?? DEFAULTS.featured,
      settings: settings ?? DEFAULTS.settings,
    });
  } catch (e) {
    if (e instanceof ValidationError) {
      return res.status(400).json({ ok: false, error: e.message });
    }
    // Auth errors (requireAdmin) carry {status, body}.
    if (e?.status) return res.status(e.status).json(e.body);
    console.error('[cms] content read error:', e?.message || 'unknown');
    res.status(500).json({ ok: false, error: 'Could not load content. Please try again.' });
  }
}
