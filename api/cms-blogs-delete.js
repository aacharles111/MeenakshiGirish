// Vercel Serverless Function — CMS blog delete (admin-only).
//
// POST /api/cms-blogs-delete
//   body: { id }
//   returns: { ok:true }
//
// Idempotent: deleting an id that isn't present still returns {ok:true}
// (logged). Auth via requireAdmin; GitHub failures → generic 500.

import { requireAdmin } from './_cmsAuth.js';
import { readJson, writeJson } from './_github.js';
import { parseBody } from './_cmsUtil.js';

const PATH = 'src/content/blogs.json';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
  try {
    await requireAdmin(req);
    const input = parseBody(req);
    const id = input && typeof input.id === 'string' ? input.id.trim() : '';
    if (!id) return res.status(400).json({ ok: false, error: 'Blog id is required' });

    const current = (await readJson(PATH)) ?? { blogs: [] };
    const currentBlogs = Array.isArray(current.blogs) ? current.blogs : [];
    const nextBlogs = currentBlogs.filter((b) => b && b.id !== id);

    if (nextBlogs.length === currentBlogs.length) {
      console.log('[cms] blog delete: id not found (no-op)');
    } else {
      await writeJson(PATH, { blogs: nextBlogs }, '[cms] delete blog');
      console.log('[cms] blog deleted');
    }
    res.status(200).json({ ok: true });
  } catch (e) {
    if (e?.status) return res.status(e.status).json(e.body);
    const msg = e?.message || '';
    if (msg) {
      console.error('[cms] blog delete error:', msg);
      return res.status(400).json({ ok: false, error: msg });
    }
    console.error('[cms] blog delete unexpected error');
    res.status(500).json({ ok: false, error: 'Could not delete. Please try again.' });
  }
}
