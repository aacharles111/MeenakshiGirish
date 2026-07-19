import { test } from 'node:test'; import assert from 'node:assert';
import { _b64Roundtrip } from '../../api/_github.js';
test('base64 round-trip preserves unicode', () => {
  assert.equal(_b64Roundtrip('Meenakshi — ₹549 ✦'), 'Meenakshi — ₹549 ✦');
});
