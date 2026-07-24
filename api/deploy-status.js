// Vercel Serverless Function — admin-only. Returns the latest PRODUCTION
// deployment state so the admin UI can show Building → Live after a CMS save.
//
// GET /api/deploy-status → { ok, state, createdAt? }
//   state is lowercased Vercel status: 'ready' | 'building' | 'queued' |
//   'initializing' | 'error' | 'canceled' | 'unknown'.
//   The admin UI treats 'ready'/'live'/'done' as live, 'error'/'failed' as
//   failed, and everything else as "keep polling".
//
// Requires VERCEL_TOKEN + VERCEL_PROJECT_ID (+ optional VERCEL_ORG_ID team id).
// Without those env vars, returns { state: 'unknown' } and the UI falls back to
// "Committed — site rebuilds in ~1 min". All failure paths degrade to
// { state: 'unknown' } (never a 500) so polling can't crash the dashboard.

import { requireAdmin } from './_cmsAuth.js';

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const ORG_ID = process.env.VERCEL_ORG_ID;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
  try {
    await requireAdmin(req);
  } catch (e) {
    return res.status(e?.status || 401).json(e?.body || { ok: false, error: 'Unauthorized' });
  }

  if (!VERCEL_TOKEN || !PROJECT_ID) {
    return res.status(200).json({ ok: true, state: 'unknown' });
  }

  try {
    let url = `https://api.vercel.com/v6/deployments?projectId=${encodeURIComponent(PROJECT_ID)}&limit=1&target=production`;
    if (ORG_ID) url += `&teamId=${encodeURIComponent(ORG_ID)}`;
    const r = await fetch(url, { headers: { Authorization: `Bearer ${VERCEL_TOKEN}` } });
    if (!r.ok) return res.status(200).json({ ok: true, state: 'unknown' });
    const data = await r.json();
    const dep = Array.isArray(data?.deployments) ? data.deployments[0] : null;
    if (!dep) return res.status(200).json({ ok: true, state: 'unknown' });
    const state = String(dep.state || '').toLowerCase();
    return res.status(200).json({ ok: true, state, createdAt: dep.createdAt });
  } catch (e) {
    console.error('[deploy-status] error:', e?.message || 'unknown');
    return res.status(200).json({ ok: true, state: 'unknown' });
  }
}
