// Vercel Serverless Function — CMS session check (used by the admin UI to
// decide whether to show the login screen or the editor).
//
// GET /api/admin-session
//   200 { authed: <bool> }
//   405 { ok: false, error: 'Method not allowed' }   (non-GET)
//
// A malformed `cms_session` cookie (e.g. bad URI escape) can make
// readSessionCookie throw via decodeURIComponent; we treat that the same as
// "no valid session" and return { authed:false } — never a 500.

import { readSessionCookie } from './_cmsAuth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }
  let payload = null;
  try {
    payload = await readSessionCookie(req);
  } catch {
    payload = null;
  }
  res.status(200).json({ authed: !!payload });
}
