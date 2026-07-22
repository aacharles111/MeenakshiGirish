// Vercel Serverless Function — CMS blog upsert (admin-only).
//
// POST /api/cms-blogs
//   body: blog object (validated by validateBlog)
//   returns: { ok:true }
//
// Reads the current blogs list so validateBlog can enforce slug uniqueness
// across all other blogs, then replaces the blog whose id matches or appends
// if new. Auth via requireAdmin; validation errors → 400; GitHub failures →
// generic 500 (no internals leaked).

import { requireAdmin } from './_cmsAuth.js';
import { readJson, writeJson } from './_github.js';
import { validateBlog, ValidationError } from './_cmsContent.js';
import { parseBody } from './_cmsUtil.js';

const PATH = 'src/content/blogs.json';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
  try {
    await requireAdmin(req);
    const input = parseBody(req);
    const current = (await readJson(PATH)) ?? { blogs: [] };
    const currentBlogs = Array.isArray(current.blogs) ? current.blogs : [];
    const next = validateBlog(input, currentBlogs);
    const idx = currentBlogs.findIndex((b) => b && b.id === next.id);
    const nextBlogs = idx >= 0
      ? currentBlogs.map((b, i) => (i === idx ? next : b))
      : [...currentBlogs, next];
    await writeJson(PATH, { blogs: nextBlogs }, '[cms] save blog');
    console.log('[cms] blog saved');
    res.status(200).json({ ok: true });
  } catch (e) {
    if (e instanceof ValidationError) {
      return res.status(400).json({ ok: false, error: e.message });
    }
    if (e?.status) {
      return res.status(e.status).json(e.body);
    }
    console.error('[cms] blog error:', e?.message || 'unknown');
    res.status(500).json({ ok: false, error: 'Could not save. Please try again.' });
  }
}
