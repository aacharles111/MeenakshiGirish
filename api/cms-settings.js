// Vercel Serverless Function — CMS site settings replace (admin-only).
//
// POST /api/cms-settings
//   body: { book:{priceInr,title,buyCtaLabel}, contact:{email}, socials:[...] }
//   returns: { ok:true }
//
// validateSettings normalizes the whole payload, then the validated object is
// committed. Auth via requireAdmin; validation → 400; GitHub failures →
// generic 500.

import { requireAdmin } from './_cmsAuth.js';
import { writeJson } from './_github.js';
import { validateSettings } from './_cmsContent.js';
import { parseBody } from './_cmsUtil.js';

const PATH = 'src/content/site-settings.json';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
  try {
    await requireAdmin(req);
    const next = validateSettings(parseBody(req));
    await writeJson(PATH, next, '[cms] update settings');
    console.log('[cms] settings saved');
    res.status(200).json({ ok: true });
  } catch (e) {
    if (e?.status) return res.status(e.status).json(e.body);
    const msg = e?.message || '';
    if (msg) {
      console.error('[cms] settings error:', msg);
      return res.status(400).json({ ok: false, error: msg });
    }
    console.error('[cms] settings unexpected error');
    res.status(500).json({ ok: false, error: 'Could not save. Please try again.' });
  }
}
