// Shared serverless helpers (server-only).

// Returns the parsed JSON body of a Vercel serverless `req`. Vercel may hand us
// either an already-parsed object (when Content-Type: application/json) or a raw
// JSON string. Invalid JSON / missing body -> null (caller decides how to react).
export function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch { return null; }
  }
  return null;
}
