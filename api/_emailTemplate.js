// HTML template for the post-purchase order-confirmation email.
//
// Pure (no I/O, no external deps) so it can be imported by the
// /api/verify-payment serverless function AND by local preview tooling,
// guaranteeing the preview matches what buyers actually receive.

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * @param {{
 *   buyerName?: string,
 *   email?: string,
 *   phone?: string,
 *   copies?: number|string,
 *   totalInr?: number|string,
 *   orderId?: string,
 *   address1?: string, address2?: string,
 *   city?: string, state?: string, pin?: string, country?: string
 * }} data
 * @returns {{ subject: string, html: string }}
 */
export function buildOrderEmail(data = {}) {
  const { buyerName, email, phone, copies, totalInr, orderId,
    address1, address2, city, state, pin, country } = data;

  const fullName = buyerName ? escapeHtml(buyerName) : '';
  const firstName = buyerName
    ? escapeHtml(String(buyerName).trim().split(/\s+/)[0])
    : 'there';

  const numCopies = Number(copies);
  const safeCopies = Number.isFinite(numCopies) && numCopies > 0 ? numCopies : 1;
  const plural = safeCopies > 1 ? 'copies' : 'copy';

  const numTotal = Number(totalInr);
  const safeTotal = Number.isFinite(numTotal) && numTotal > 0 ? numTotal : 549;

  const safeOrderId = orderId ? escapeHtml(orderId) : '';
  const phoneClean = phone ? escapeHtml(phone) : '';
  const emailClean = email ? escapeHtml(email) : '';

  // Compose the shipping address lines (drop any that are empty).
  const cityState = [city, state].filter(Boolean).join(', ');
  const cityStatePin = [cityState, pin].filter(Boolean).join(' ');
  const addressLines = [address1, address2, cityStatePin, country]
    .filter(Boolean)
    .map(escapeHtml);

  const subject = 'Order Confirmed — The Freelancer’s Mindset 📖';

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#F4EEE3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#2A2622;">
<!-- preheader (hidden preview text) -->
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#F4EEE3;">Your order of The Freelancer's Mindset is confirmed — we'll ship it shortly. ✦</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4EEE3;padding:32px 16px;">
<tr><td align="center">

<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(40,30,15,0.06);">

<!-- Brand / banner -->
<tr>
<td style="background-color:#0F6E66;padding:30px 36px;text-align:center;">
<div style="font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:14px;letter-spacing:0.16em;text-transform:uppercase;color:#EAF4F2;">✦ Meenakshi Girish</div>
<div style="font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.2;color:#FFFFFF;margin-top:10px;font-weight:bold;">Order Confirmed</div>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:36px 36px 8px 36px;">
<p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;color:#2A2622;">Hi ${firstName},</p>
<p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;color:#2A2622;">Thank you so much for your order! 💛 Your ${plural} of <em style="font-family:Georgia,'Times New Roman',serif;">The Freelancer&rsquo;s Mindset</em> ${safeCopies > 1 ? 'are' : 'is'} confirmed and getting ready to head your way.</p>
</td>
</tr>

<!-- Order summary -->
<tr>
<td style="padding:8px 36px 4px 36px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ECE3D2;border-radius:12px;overflow:hidden;">
<tr><td style="padding:14px 18px;font-size:14px;color:#6B6258;border-bottom:1px solid #ECE3D2;">Book</td><td align="right" style="padding:14px 18px;font-size:14px;color:#2A2622;border-bottom:1px solid #ECE3D2;font-family:Georgia,'Times New Roman',serif;"><em>The Freelancer&rsquo;s Mindset</em></td></tr>
<tr><td style="padding:14px 18px;font-size:14px;color:#6B6258;border-bottom:1px solid #ECE3D2;">Copies</td><td align="right" style="padding:14px 18px;font-size:14px;color:#2A2622;border-bottom:1px solid #ECE3D2;font-weight:600;">${safeCopies}</td></tr>
<tr><td style="padding:14px 18px;font-size:14px;color:#6B6258;${safeOrderId ? 'border-bottom:1px solid #ECE3D2;' : ''}">Total paid</td><td align="right" style="padding:14px 18px;font-size:14px;color:#2A2622;${safeOrderId ? 'border-bottom:1px solid #ECE3D2;' : ''}font-weight:600;">&#8377;${safeTotal}</td></tr>
${safeOrderId ? `<tr><td style="padding:14px 18px;font-size:14px;color:#6B6258;">Order ref</td><td align="right" style="padding:14px 18px;font-size:14px;color:#2A2622;font-family:monospace;">${safeOrderId}</td></tr>` : ''}
</table>
</td>
</tr>

<!-- Shipping details -->
<tr>
<td style="padding:20px 36px 4px 36px;">
<p style="margin:0 0 10px 0;font-size:12px;font-weight:700;color:#6B6258;text-transform:uppercase;letter-spacing:0.1em;">Shipping to (please double-check)</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FBF7EF;border:1px solid #ECE3D2;border-radius:12px;">
<tr><td style="padding:16px 18px;">
${fullName ? `<div style="font-size:15px;font-weight:700;color:#2A2622;margin-bottom:4px;">${fullName}</div>` : ''}
${phoneClean ? `<div style="font-size:14px;line-height:1.5;color:#2A2622;">&#9742; ${phoneClean}</div>` : ''}
${addressLines.map((l) => `<div style="font-size:14px;line-height:1.5;color:#2A2622;">${l}</div>`).join('')}
${emailClean ? `<div style="font-size:13px;line-height:1.5;color:#6B6258;margin-top:8px;">&#9993; ${emailClean}</div>` : ''}
</td></tr>
</table>
</td>
</tr>

<!-- Shipping callout -->
<tr>
<td style="padding:20px 36px 8px 36px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#EAF4F2;border-radius:12px;">
<tr><td style="padding:18px 20px;">
<div style="font-size:14px;font-weight:700;color:#0B544E;margin-bottom:6px;">📦 What happens next</div>
<p style="margin:0;font-size:14px;line-height:1.6;color:#1f4f4a;">We&rsquo;ll ship your book shortly. You&rsquo;ll receive a <strong>tracking ID / link</strong> by email as soon as it&rsquo;s on its way — so you can follow it right to your door.</p>
</td></tr>
</table>
</td>
</tr>

<!-- Closing -->
<tr>
<td style="padding:24px 36px 36px 36px;">
<p style="margin:0 0 4px 0;font-size:16px;line-height:1.6;color:#2A2622;">Happy reading, and thank you for supporting my work!</p>
<p style="margin:0;font-size:16px;line-height:1.6;font-family:Georgia,'Times New Roman',serif;font-style:italic;color:#2A2622;">Warmly,<br>Meenakshi Girish</p>
<p style="margin:14px 0 0 0;"><a href="https://www.meenakshigirish.com" style="font-size:13px;color:#0F6E66;text-decoration:none;">meenakshigirish.com</a></p>
</td>
</tr>

</table>

<!-- Footer -->
<p style="max-width:600px;width:100%;margin:18px auto 0 auto;font-size:12px;line-height:1.5;color:#9A8F80;text-align:center;">You&rsquo;re receiving this email because you placed an order at meenakshigirish.com. Questions? Just reply to this email.</p>

</td></tr>
</table>
</body>
</html>`;

  return { subject, html };
}
