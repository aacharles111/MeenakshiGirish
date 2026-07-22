// Vercel Serverless Function — CMS image upload (admin-only).
//
// POST /api/cms-upload
//   body: { filename, contentType, dataB64 }
//   returns: { ok:true, url:'/images/cms/<basename>' }
//
// Strict validation:
//   - contentType ∈ {image/jpeg, image/png, image/webp}  → 400 otherwise
//   - decoded size ≤ 2 MiB                                → 400 otherwise
//   - filename slug matches ^[a-zA-Z0-9-]{1,60}$          → 400 otherwise
// The committed path is constructed from the slug + timestamp + ext derived
// from contentType; the raw `filename` is NEVER used directly in the path, so
// path traversal is impossible. Auth via requireAdmin; GitHub failures → 500.

import { requireAdmin } from './_cmsAuth.js';
import { writeFile } from './_github.js';
import { ValidationError } from './_cmsContent.js';
import { parseBody } from './_cmsUtil.js';

const MAX_BYTES = 2 * 1024 * 1024; // 2 MiB
const SLUG_RE = /^[a-zA-Z0-9-]{1,60}$/;
const EXT_BY_TYPE = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
  try {
    await requireAdmin(req);
    const input = parseBody(req);
    if (!input || typeof input !== 'object') {
      throw new ValidationError('Invalid request body');
    }
    const { contentType, dataB64, filename } = input;
    const ext = EXT_BY_TYPE[contentType];
    if (!ext) {
      throw new ValidationError('Image must be JPEG, PNG, or WebP');
    }
    if (typeof dataB64 !== 'string' || !dataB64) {
      throw new ValidationError('Image data is required');
    }
    let buf;
    try {
      buf = Buffer.from(dataB64, 'base64');
    } catch {
      throw new ValidationError('Image data is malformed');
    }
    if (buf.length > MAX_BYTES) {
      throw new ValidationError('Image must be 2 MB or smaller');
    }
    const slug = typeof filename === 'string' ? filename.trim() : '';
    if (!SLUG_RE.test(slug)) {
      throw new ValidationError('Filename must be 1–60 letters, digits, or hyphens');
    }

    const basename = `${Date.now()}-${slug}.${ext}`;
    const repoPath = `public/images/cms/${basename}`;
    await writeFile(repoPath, dataB64, '[cms] upload image');
    console.log('[cms] image uploaded');
    res.status(200).json({ ok: true, url: `/images/cms/${basename}` });
  } catch (e) {
    if (e instanceof ValidationError) {
      return res.status(400).json({ ok: false, error: e.message });
    }
    if (e?.status) {
      return res.status(e.status).json(e.body);
    }
    // GitHub/network failure — do not leak internals.
    console.error('[cms] upload error:', e?.message || 'unknown');
    res.status(500).json({ ok: false, error: 'Could not upload image. Please try again.' });
  }
}
