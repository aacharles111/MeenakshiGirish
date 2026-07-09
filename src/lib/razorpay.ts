// Razorpay Standard Checkout client helper.
// KEY_SECRET never lives here — only the public KEY_ID (VITE_-prefixed).
// checkout.js is loaded on demand (only when a payment is initiated).

const KEY_ID = (import.meta as unknown as { env?: Record<string, string> }).env
  ?.VITE_RAZORPAY_KEY_ID;

export interface RazorpaySuccess {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: 'payment.failed', handler: (resp: { error?: { description?: string } }) => void) => void;
}

interface RazorpayOptions {
  key: string;
  order_id: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  prefill?: { name?: string; email?: string };
  theme?: { color?: string };
  handler: (response: RazorpaySuccess) => void;
  modal?: { ondismiss?: () => void };
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

let scriptPromise: Promise<void> | null = null;
function loadCheckoutScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('Browser only'));
  if (window.Razorpay) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error('Could not load the Razorpay checkout. Check your connection.'));
    };
    document.body.appendChild(s);
  });
  return scriptPromise;
}

/** Create an order on the server. `amount` is in paise (>= 100). */
export async function createOrder(params: {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}): Promise<{ id: string; amount: number; currency: string }> {
  const res = await fetch('/api/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || `Could not create order (${res.status}).`);
  return data;
}

/** Verify a payment signature on the server. */
export async function verifyPayment(data: RazorpaySuccess): Promise<{ verified: boolean }> {
  const res = await fetch('/api/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json().catch(() => ({ verified: false }));
}

/** Open the Razorpay checkout modal. Resolves with the payment details on success. */
export async function checkout(opts: {
  orderId: string;
  amount: number; // paise
  name: string;            // business/merchant name shown in the modal header
  description?: string;
  prefillName?: string;    // customer name (prefilled in the modal)
  email?: string;          // customer email (prefilled in the modal)
}): Promise<RazorpaySuccess> {
  if (!KEY_ID) {
    throw new Error('Razorpay is not configured (missing VITE_RAZORPAY_KEY_ID).');
  }
  await loadCheckoutScript();
  const Rzp = window.Razorpay;
  if (!Rzp) throw new Error('Razorpay checkout failed to initialise.');

  return new Promise<RazorpaySuccess>((resolve, reject) => {
    const rzp = new Rzp({
      key: KEY_ID,
      order_id: opts.orderId,
      amount: opts.amount,
      currency: 'INR',
      name: opts.name,
      description: opts.description,
      prefill: {
        ...(opts.prefillName ? { name: opts.prefillName } : {}),
        ...(opts.email ? { email: opts.email } : {}),
      },
      theme: { color: '#0f6e66' },
      handler: (response) => resolve(response),
      modal: { ondismiss: () => reject(new Error('cancelled')) },
    });
    rzp.on('payment.failed', (resp) =>
      reject(new Error(resp?.error?.description || 'Payment failed. Please try again.')),
    );
    rzp.open();
  });
}
