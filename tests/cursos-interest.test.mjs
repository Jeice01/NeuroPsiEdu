import assert from 'node:assert/strict';
import { test } from 'node:test';
import { normalizeInterestPhone, validGroupInvite } from '../src/lib/cursos/interest.ts';

test('interest accepts Brazilian DDD or explicit international numbers and rejects malformed input', () => {
  assert.equal(normalizeInterestPhone('(61) 99999-0000'), '+5561999990000');
  assert.equal(normalizeInterestPhone('+55 61 99999-0000'), '+5561999990000');
  assert.equal(normalizeInterestPhone('+1 202 555 0123'), '+12025550123');
  for (const value of ['9999', 'email@example.test', '+0 1234567890', '61phone999990000']) assert.equal(normalizeInterestPhone(value), null);
});

test('only the authorized group invitation is accepted from the server', () => {
  assert.equal(validGroupInvite('https://chat.whatsapp.com/GX3998AXL59KQkrFNt6xPQ'), true);
  for (const value of [null, 'javascript:alert(1)', 'https://other.test', 'https://chat.whatsapp.com/other']) assert.equal(validGroupInvite(value), false);
});
