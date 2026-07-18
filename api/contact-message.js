// Vercel Serverless Function — emails Meenakshi a contact or work-sample
// request submitted from the public site, via Resend.
//
// POST /api/contact-message
//   body: { type?: 'contact'|'work-sample', name, email, subject?, message?,
//           company?, industry?, website? }
//   returns: { ok: boolean, error?: string }
//
// `website` is a honeypot — if a bot fills it, we pretend success and drop.
// Submitter's email is validated server-side and used as reply_to so Meenakshi
// can hit Reply. No data is stored (email-only, per spec).

import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.ORDER_FROM_EMAIL || 'Meenakshi Girish <meenakshigirish31@gmail.com>';
const NOTIFY_EMAIL = process.env.ORDER_NOTIFY_EMAIL || 'meenakshigirish31@gmail.com';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return null; }
  }
  return null;
}
function clean(v, max) { return String(v ?? '').replace(/[<>]/g, '').trim().slice(0, max); }
function escapeHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function row(label, value) {
  const v = value ? escapeHtml(value) : '<span style="color:#9A8F80">—</span>';
  return `<tr><td style="padding:12px 16px;font-size:14px;color:#6B6258;border-bottom:1px solid #ECE3D2;width:34%;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:12px 16px;font-size:14px;color:#2A2622;border-bottom:1px solid #ECE3D2;white-space:pre-wrap;">${v}</td></tr>`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ ok: false, error: 'Method not allowed' }); return; }
  if (!RESEND_API_KEY || !NOTIFY_EMAIL) { res.status(500).json({ ok: false, error: 'Email not configured on the server.' }); return; }

  const body = parseBody(req);
  if (!body) { res.status(400).json({ ok: false, error: 'Invalid request body.' }); return; }

  // Honeypot — silently accept and drop bots.
  if (body.website && String(body.website).trim()) { res.status(200).json({ ok: true }); return; }

  const type = body.type === 'work-sample' ? 'work-sample' : 'contact';
  const name = clean(body.name, 100);
  const email = clean(body.email, 254);
  if (!name) { res.status(400).json({ ok: false, error: 'Your name is required.' }); return; }
  if (!EMAIL_RE.test(email)) { res.status(400).json({ ok: false, error: 'A valid email address is required.' }); return; }

  let subject;
  let rows = row('Name', name) + row('Email', email);

  if (type === 'work-sample') {
    const company = clean(body.company, 120);
    const industry = clean(body.industry, 160);
    if (!company) { res.status(400).json({ ok: false, error: 'Company / organization is required.' }); return; }
    subject = `[Website] Work sample request — ${name}${company ? ` (${company})` : ''}`;
    rows += row('Company', company) + row('Industry / content type', industry);
  } else {
    const topic = clean(body.subject, 60);
    const message = clean(body.message, 4000);
    if (!message) { res.status(400).json({ ok: false, error: 'A message is required.' }); return; }
    subject = `[Website] ${topic || 'New message'} — from ${name}`;
    rows += row('Topic', topic) + row('Message', message);
  }

  const heading = type === 'work-sample' ? 'Work sample request' : 'New contact message';
  const html = `<!doctype html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#F4EEE3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#2A2622;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4EEE3;padding:32px 16px;"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(40,30,15,0.06);">
<tr><td style="background-color:#0F6E66;padding:22px 32px;"><div style="font-family:Georgia,'Times New Roman',serif;font-size:20px;color:#FFFFFF;font-weight:bold;">${escapeHtml(heading)}</div></td></tr>
<tr><td style="padding:20px 28px 28px 28px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ECE3D2;border-radius:12px;overflow:hidden;">${rows}</table>
<p style="margin:16px 0 0 0;font-size:12px;color:#9A8F80;">Reply to this email to respond directly to ${escapeHtml(name)}.</p>
</td></tr>
</table>
</td></tr></table></body></html>`;

  try {
    const { error } = await new Resend(RESEND_API_KEY).emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      reply_to: email,
      subject,
      html,
    });
    if (error) {
      console.error(`[contact] resend error type=${type}: ${error?.message || error?.name || 'unknown'}`);
      res.status(500).json({ ok: false, error: 'Something went wrong sending your message. Please try again later.' });
      return;
    }
    console.log(`[contact] ${type} message sent`);
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(`[contact] exception type=${type}: ${e?.message || 'unknown'}`);
    res.status(500).json({ ok: false, error: 'Could not send your message right now. Please email meenakshigirish31@gmail.com directly.' });
  }
}
