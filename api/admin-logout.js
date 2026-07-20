// Vercel Serverless Function — CMS admin logout.
//
// POST /api/admin-logout
//   200 { ok: true }    (clears the cms_session cookie)
//   405 { ok: false, error: 'Method not allowed' }   (non-POST)

import { clearSessionCookie } from './_cmsAuth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }
  clearSessionCookie(res);
  res.status(200).json({ ok: true });
}
