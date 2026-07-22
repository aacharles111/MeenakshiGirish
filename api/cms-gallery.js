// Vercel Serverless Function — CMS gallery replace (admin-only).
//
// POST /api/cms-gallery
//   body: { images: [{ src, alt }] }
//   returns: { ok:true }
//
// Full-list replace: validateGallery normalizes the whole payload, then the
// validated object is committed. Auth via requireAdmin; validation → 400;
// GitHub failures → generic 500.

import { requireAdmin } from './_cmsAuth.js';
import { writeJson } from './_github.js';
import { validateGallery } from './_cmsContent.js';
import { parseBody } from './_cmsUtil.js';

const PATH = 'src/content/gallery.json';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
  try {
    await requireAdmin(req);
    const next = validateGallery(parseBody(req));
    await writeJson(PATH, next, '[cms] update gallery');
    console.log('[cms] gallery saved');
    res.status(200).json({ ok: true });
  } catch (e) {
    if (e?.status) return res.status(e.status).json(e.body);
    const msg = e?.message || '';
    if (msg) {
      console.error('[cms] gallery error:', msg);
      return res.status(400).json({ ok: false, error: msg });
    }
    console.error('[cms] gallery unexpected error');
    res.status(500).json({ ok: false, error: 'Could not save. Please try again.' });
  }
}
