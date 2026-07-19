// api/_github.js — thin GitHub Contents API wrapper (server-only).
const TOKEN = process.env.GITHUB_TOKEN;
const REPO = process.env.GITHUB_REPO;             // owner/repo
const BRANCH = process.env.GITHUB_BRANCH || 'master';
const API = 'https://api.github.com';

export const _b64Roundtrip = (s) => Buffer.from(Buffer.from(s, 'utf8').toString('base64'), 'base64').toString('utf8');

function authHeaders(json = true) {
  const h = { Authorization: `Bearer ${TOKEN}`, 'X-GitHub-Api-Version': '2022-11-28' };
  if (json) h.Accept = 'application/vnd.github+json';
  return h;
}

export function isConfigured() { return !!(TOKEN && REPO); }

export async function getCurrentUser() {
  const res = await fetch(`${API}/user`, { headers: authHeaders() });
  return res.ok ? res.json() : null; // for env smoke checks
}

// Returns {content, sha} or null.
export async function getFile(path) {
  const url = `${API}/repos/${REPO}/contents/${path}?ref=${BRANCH}`;
  const res = await fetch(url, { headers: authHeaders() });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`github get ${path} → ${res.status}`);
  const data = await res.json();
  return { sha: data.sha, content: data.content }; // content is base64
}

export async function readJson(path) {
  const f = await getFile(path);
  if (!f) return null;
  try { return JSON.parse(Buffer.from(f.content, 'base64').toString('utf8')); } catch { return null; }
}

export async function writeFile(path, contentB64, message) {
  const existing = await getFile(path);
  const body = { message, content: contentB64, branch: BRANCH };
  if (existing?.sha) body.sha = existing.sha;
  const res = await fetch(`${API}/repos/${REPO}/contents/${path}`, {
    method: 'PUT', headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`github put ${path} → ${res.status}: ${data?.message || ''}`);
  return { ok: true, sha: data?.content?.sha };
}

export async function writeJson(path, obj, message) {
  const b64 = Buffer.from(JSON.stringify(obj, null, 2), 'utf8').toString('base64');
  return writeFile(path, b64, message);
}
