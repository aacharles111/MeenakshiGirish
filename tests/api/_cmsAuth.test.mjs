import { test } from 'node:test';
import assert from 'node:assert';

process.env.SESSION_SECRET = process.env.SESSION_SECRET || 'test-secret-must-be-at-least-32-chars-long';
const { hashPassword, verifyPassword, signSession, verifySession } = await import('../../api/_cmsAuth.js');

test('password hash then verify', async () => {
  const h = await hashPassword('correct horse battery', 1000);
  assert.ok(h.startsWith('pbkdf2$'));
  assert.equal(await verifyPassword('correct horse battery', h), true);
  assert.equal(await verifyPassword('wrong', h), false);
});

test('session sign/verify + tamper rejection', async () => {
  const tok = await signSession({ exp: Date.now() + 1000 });
  assert.ok((await verifySession(tok)));
  assert.equal(await verifySession(tok + 'x'), null);
  assert.equal(await verifySession(await signSession({ exp: Date.now() - 1 })), null); // expired
});
