// Vercel Serverless Function — creates a Razorpay order (server-side only).
// Razorpay Standard Checkout requires the order to be created from the server
// using KEY_SECRET; this never touches the frontend.
//
// POST /api/create-order
//   body: { amount: number (paise, >= 100), currency?: string, receipt?: string,
//           notes?: { copies: string, ... } }
//   returns: { id, amount, currency, status }
//
// Server-side price validation: the submitted `amount` MUST equal
// `bookPriceInr * copies * 100`, where `copies` is taken from notes.copies
// (sent by BuyPage). Any mismatch is rejected with 400 BEFORE the Razorpay
// order is created — so a tampered client cannot lock in a cheaper order.

import { bookPriceInr } from './_runtimeConfig.js';

const KEY_ID = process.env.RAZORPAY_KEY_ID;
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
  if (!KEY_ID || !KEY_SECRET) {
    res.status(500).json({ error: 'Razorpay keys not configured on the server.' });
    return;
  }

  const body = parseBody(req);
  if (!body) {
    res.status(400).json({ error: 'Invalid request body.' });
    return;
  }

  const amount = Number(body.amount);
  const currency = body.currency || 'INR';
  if (!Number.isFinite(amount) || amount < 100) {
    res.status(400).json({ error: 'Amount must be a number of at least 100 paise (₹1).' });
    return;
  }

  // ── Price validation (security) ──────────────────────────────────────────
  // Copies is sent by BuyPage as notes.copies (string). Cap at 100 to keep
  // the multiplication sane even if a tampered request claims 1e9 copies.
  const copiesRaw = body.notes?.copies ?? body.copies;
  const copies = Number(copiesRaw);
  if (!Number.isInteger(copies) || copies < 1 || copies > 100) {
    console.log('[order] amount mismatch (invalid copies)');
    res.status(400).json({ ok: false, error: 'Invalid order amount.' });
    return;
  }
  const expectedAmount = bookPriceInr * copies * 100;
  if (amount !== expectedAmount) {
    // No PII in the log — just the fact of a mismatch.
    console.log('[order] amount mismatch');
    res.status(400).json({ ok: false, error: 'Invalid order amount.' });
    return;
  }

  const receipt = body.receipt || `rcpt_${Date.now()}`;
  const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64');

  try {
    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        receipt,
        payment_capture: 1, // auto-capture on payment
        notes: body.notes || {},
      }),
    });

    const data = await rzpRes.json();

    if (!rzpRes.ok) {
      // 401 = bad/missing key, else treat as upstream error
      const status = rzpRes.status === 401 ? 401 : 500;
      res.status(status).json({
        error: data?.error?.description || 'Razorpay order creation failed.',
      });
      return;
    }

    res.status(200).json({ id: data.id, amount: data.amount, currency: data.currency });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reach Razorpay. Please try again.' });
  }
}
