// Vercel Serverless Function — CMS admin login.
//
// POST /api/admin-login
//   body: { username: string, password: string }
//   200 { ok: true }                      on success (sets cms_session cookie)
//   401 { ok: false, error: 'Invalid credentials' }
//   500 { ok: false, error: 'Server error during login.' }
//   405 { ok: false, error: 'Method not allowed' }   (non-POST)
//
// Security:
// - Inputs length-capped (no unbounded buffers).
// - Failed login waits ~400ms before responding to slow brute-force attempts.
// - No PII in logs (event-only: '[admin] login success' / '[admin] login error').
// - Generic client-facing errors; cookie/secret failures never leak internals.

import { parseBody } from './_cmsUtil.js';
import { checkCredentials, issueSessionCookie } from './_cmsAuth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const body = parseBody(req);
  const username = String(body?.username || '').slice(0, 100);
  const password = String(body?.password || '').slice(0, 256);

  const ok = await checkCredentials(username, password);
  if (!ok) {
    // Constant-ish delay to blunt brute-force timing and uniform error channel.
    await new Promise((r) => setTimeout(r, 400));
    res.status(401).json({ ok: false, error: 'Invalid credentials' });
    return;
  }

  try {
    await issueSessionCookie(res);
    console.log('[admin] login success');
    res.status(200).json({ ok: true });
  } catch (e) {
    // signSession/issueSessionCookie can throw if SESSION_SECRET is misconfigured
    // or cookie signing fails — surface a generic 500, never internals.
    console.log('[admin] login error');
    res.status(500).json({ ok: false, error: 'Server error during login.' });
  }
}
