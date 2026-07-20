import { test } from 'node:test';
import assert from 'node:assert';
import { parseBody } from '../../api/_cmsUtil.js';

test('parseBody: returns object body as-is', () => {
  const body = { username: 'meena', password: 'hunter2' };
  const req = { body };
  assert.equal(parseBody(req), body);
});

test('parseBody: parses a JSON string body', () => {
  const req = { body: JSON.stringify({ a: 1, b: 'two' }) };
  assert.deepEqual(parseBody(req), { a: 1, b: 'two' });
});

test('parseBody: invalid JSON string returns null', () => {
  const req = { body: '{ not json' };
  assert.equal(parseBody(req), null);
});

test('parseBody: undefined body returns null', () => {
  const req = {};
  assert.equal(parseBody(req), null);
});

test('parseBody: empty string body returns null', () => {
  const req = { body: '' };
  assert.equal(parseBody(req), null);
});

test('parseBody: null body returns null', () => {
  const req = { body: null };
  assert.equal(parseBody(req), null);
});
