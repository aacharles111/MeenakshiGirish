// Vercel Serverless Function — CMS featured replace (admin-only).
//
// POST /api/cms-featured
//   body: { items: [{ id?, label, url }] }
//   returns: { ok:true }
//
// Full-list replace: validateFeatured normalizes the whole payload, then the
// validated object is committed. Auth via requireAdmin; validation → 400;
// GitHub failures → generic 500.

import { requireAdmin } from './_cmsAuth.js';
import { writeJson } from './_github.js';
import { validateFeatured } from './_cmsContent.js';
import { parseBody } from './_cmsUtil.js';

const PATH = 'src/content/featured.json';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
  try {
    await requireAdmin(req);
    const next = validateFeatured(parseBody(req));
    await writeJson(PATH, next, '[cms] update featured');
    console.log('[cms] featured saved');
    res.status(200).json({ ok: true });
  } catch (e) {
    if (e?.status) return res.status(e.status).json(e.body);
    const msg = e?.message || '';
    if (msg) {
      console.error('[cms] featured error:', msg);
      return res.status(400).json({ ok: false, error: msg });
    }
    console.error('[cms] featured unexpected error');
    res.status(500).json({ ok: false, error: 'Could not save. Please try again.' });
  }
}
