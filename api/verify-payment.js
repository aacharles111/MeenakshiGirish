// Vercel Serverless Function — verifies a Razorpay payment signature (server-side).
//
// POST /api/verify-payment
//   body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
//   returns: { verified: boolean }
//
// Signature = HMAC-SHA256(razorpay_order_id + "|" + razorpay_payment_id, KEY_SECRET), hex.
// Returns success ONLY if signatures match. Never trust the client otherwise.

import crypto from 'node:crypto';

const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return null; }
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  if (!KEY_SECRET) {
    res.status(500).json({ error: 'Razorpay keys not configured on the server.' });
    return;
  }

  const body = parseBody(req);
  const orderId = body?.razorpay_order_id;
  const paymentId = body?.razorpay_payment_id;
  const signature = body?.razorpay_signature;

  if (!orderId || !paymentId || !signature) {
    res.status(400).json({ verified: false, error: 'Missing payment fields.' });
    return;
  }

  const expected = crypto
    .createHmac('sha256', KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  // Constant-time compare; lengths may differ on a malformed/forged signature.
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature));
  let verified = false;
  try {
    verified = a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    verified = false;
  }

  if (!verified) {
    // Do NOT mark as paid.
    res.status(400).json({ verified: false, error: 'Signature mismatch.' });
    return;
  }

  res.status(200).json({ verified: true });
}
