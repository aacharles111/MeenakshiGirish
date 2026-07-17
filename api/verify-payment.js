// Vercel Serverless Function — verifies a Razorpay payment signature (server-side),
// and on success: (1) emails the buyer their confirmation, (2) emails the merchant
// a "new order" notification, (3) appends the order to a Google Sheet for fulfilment.
// All three are best-effort and gated on a single
// idempotency flag so a retried request can't double-send or double-log.
//
// POST /api/verify-payment
//   body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
//   returns: { verified: boolean, emailSent?: boolean, logged?: boolean }
//
// Signature = HMAC-SHA256(razorpay_order_id + "|" + razorpay_payment_id, KEY_SECRET), hex.
// The payment is confirmed ONLY if signatures match. Email/Sheet failures are
// swallowed — they never affect the verified payment result.

import crypto from 'node:crypto';
import { Resend } from 'resend';
import { buildOrderEmail, buildMerchantEmail } from './_emailTemplate.js';

const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.ORDER_FROM_EMAIL || 'Meenakshi Girish <meenakshigirish31@gmail.com>';
const NOTIFY_EMAIL = process.env.ORDER_NOTIFY_EMAIL || ''; // merchant "new order" recipient (you)
const SHEET_URL = process.env.GOOGLE_SHEET_URL || '';
const SHEET_SECRET = process.env.SHEET_SECRET || '';

function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return null; }
  }
  return null;
}

function authHeader() {
  return 'Basic ' + Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString('base64');
}

async function fetchOrder(orderId) {
  const res = await fetch(`https://api.razorpay.com/v1/orders/${orderId}`, {
    headers: { Authorization: authHeader() },
  });
  if (!res.ok) return null;
  return res.json();
}

async function markConfirmationSent(orderId, existingNotes) {
  try {
    await fetch(`https://api.razorpay.com/v1/orders/${orderId}`, {
      method: 'PATCH',
      headers: { Authorization: authHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: { ...(existingNotes || {}), confirmation_sent: '1' } }),
    });
  } catch {
    /* non-fatal — worst case a retry could re-send */
  }
}

async function sendBuyerEmail(order, notes) {
  if (!RESEND_API_KEY) return { ok: false, reason: 'resend-not-configured' };
  // Validate the recipient server-side: one well-formed address, no whitespace
  // or newlines (header-injection defence-in-depth — the value is buyer-controlled
  // via order notes). The client only strips <>; enforce a real format here.
  const email = String(notes.email || '').trim();
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, reason: 'invalid-email' };
  }
  const totalInr = Math.round((order.amount_paid ?? order.amount ?? 0) / 100);
  const { subject, html } = buildOrderEmail({
    buyerName: notes.name,
    email,
    phone: notes.phone,
    copies: notes.copies,
    totalInr,
    orderId: order.id,
    address1: notes.address1,
    address2: notes.address2,
    city: notes.city,
    state: notes.state,
    pin: notes.pin,
    country: notes.country,
  });
  const sendOpts = { from: FROM_EMAIL, to: email, subject, html };
  if (NOTIFY_EMAIL) sendOpts.reply_to = NOTIFY_EMAIL; // buyer replies land in your inbox
  const { error } = await new Resend(RESEND_API_KEY).emails.send(sendOpts);
  if (error) return { ok: false, reason: 'resend-error', detail: String(error.message || error) };
  return { ok: true };
}

// Dedicated "new order" notification to the merchant (replaces BCC, which Gmail
// often silently drops to Promotions/Spam). A separate To: is more reliable and
// gives a clear "New order" subject.
async function sendMerchantNotification(order, paymentId, notes) {
  if (!RESEND_API_KEY) return { ok: false, reason: 'resend-not-configured' };
  if (!NOTIFY_EMAIL) return { ok: false, reason: 'notify-not-configured' };
  const to = String(NOTIFY_EMAIL).trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) return { ok: false, reason: 'notify-invalid' };
  const totalInr = Math.round((order.amount_paid ?? order.amount ?? 0) / 100);
  const { subject, html } = buildMerchantEmail({
    buyerName: notes.name,
    email: notes.email,
    phone: notes.phone,
    copies: notes.copies,
    totalInr,
    orderId: order.id,
    paymentId,
    address1: notes.address1,
    address2: notes.address2,
    city: notes.city,
    state: notes.state,
    pin: notes.pin,
    country: notes.country,
  });
  const { error } = await new Resend(RESEND_API_KEY).emails.send({ from: FROM_EMAIL, to, subject, html });
  if (error) return { ok: false, reason: 'resend-error', detail: String(error.message || error) };
  return { ok: true };
}

async function logOrderToSheet(order, paymentId, notes) {
  if (!SHEET_URL) return { ok: false, reason: 'sheet-not-configured' };
  const totalInr = Math.round((order.amount_paid ?? order.amount ?? 0) / 100);
  const payload = {
    secret: SHEET_SECRET,
    timestamp: new Date().toISOString(),
    orderId: order.id || '',
    paymentId: paymentId || '',
    amountInr: totalInr,
    status: 'paid',
    name: notes.name || '',
    email: notes.email || '',
    phone: notes.phone || '',
    copies: notes.copies || '',
    address1: notes.address1 || '',
    address2: notes.address2 || '',
    city: notes.city || '',
    state: notes.state || '',
    pin: notes.pin || '',
    country: notes.country || '',
  };
  const res = await fetch(SHEET_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) return { ok: false, reason: 'sheet-http-' + res.status };
  return { ok: true };
}

// Runs both side-effects (email + sheet). Idempotent via the order's
// confirmation_sent note: first call does the work and stamps the flag;
// retried calls skip. Returns what it managed to do.
async function afterPaymentSuccess(orderId, paymentId) {
  if (!RESEND_API_KEY && !SHEET_URL) return { emailSent: false, logged: false };
  if (!KEY_ID || !KEY_SECRET) return { emailSent: false, logged: false };

  const order = await fetchOrder(orderId);
  if (!order) return { emailSent: false, logged: false };

  const notes = order.notes || {};
  if (notes.confirmation_sent === '1') {
    return { emailSent: false, logged: false }; // already processed
  }

  let emailRes = { ok: false, reason: 'exception' };
  let merchantRes = { ok: false, reason: 'exception' };
  let sheetRes = { ok: false, reason: 'exception' };
  try { emailRes = await sendBuyerEmail(order, notes); } catch (e) { emailRes = { ok: false, reason: 'exception', detail: String(e) }; }
  try { merchantRes = await sendMerchantNotification(order, paymentId, notes); } catch (e) { merchantRes = { ok: false, reason: 'exception', detail: String(e) }; }
  try { sheetRes = await logOrderToSheet(order, paymentId, notes); } catch (e) { sheetRes = { ok: false, reason: 'exception', detail: String(e) }; }

  // Structured log so Vercel Runtime Logs show exactly which step ran and which (if any) failed.
  const allOk = emailRes.ok && merchantRes.ok && sheetRes.ok;
  const line = `[order] ${orderId} verified=1 email=${emailRes.ok ? 'ok' : 'FAIL:' + emailRes.reason}` +
    ` merchant=${merchantRes.ok ? 'ok' : 'FAIL:' + merchantRes.reason}` +
    ` sheet=${sheetRes.ok ? 'ok' : 'FAIL:' + sheetRes.reason}` +
    (emailRes.detail ? ` | emailDetail=${emailRes.detail}` : '') +
    (merchantRes.detail ? ` | merchantDetail=${merchantRes.detail}` : '') +
    (sheetRes.detail ? ` | sheetDetail=${sheetRes.detail}` : '');
  if (allOk) console.log(line);
  else console.error(line);

  await markConfirmationSent(orderId, notes); // stamp idempotency flag (best-effort)
  return { emailSent: emailRes.ok, merchantNotified: merchantRes.ok, logged: sheetRes.ok };
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
    res.status(400).json({ verified: false, error: 'Signature mismatch.' });
    return;
  }

  // Payment is genuine — fire the side-effects. Best-effort: any failure
  // is swallowed so it can never affect the verified payment result.
  let emailSent = false;
  let merchantNotified = false;
  let logged = false;
  try {
    const result = await afterPaymentSuccess(orderId, paymentId);
    emailSent = !!result.emailSent;
    merchantNotified = !!result.merchantNotified;
    logged = !!result.logged;
  } catch {
    /* keep verified true regardless */
  }

  res.status(200).json({ verified: true, emailSent, merchantNotified, logged });
}
