import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { test } from 'node:test';
import { createConfirmationWorker, confirmationMessage } from '../supabase/functions/enviar-confirmacoes/handler.ts';

const secret = 'synthetic-worker-secret-longer-than-32';
const sandbox = { turmaId: randomUUID(), email: 'sandbox@example.test' };
const job = () => ({ id: randomUUID(), envio_token: randomUUID(), email: sandbox.email, curso: 'SANDBOX Curso', turma: 'SANDBOX Turma' });
const request = (authorization = `Bearer ${secret}`, method = 'POST') => new Request('https://example.test/worker', {
  method, headers: { authorization },
});

test('confirmation worker authorizes before accessing jobs or SMTP', async () => {
  const unexpected = async () => { throw new Error('must not be called'); };
  const handler = createConfirmationWorker(secret, sandbox, unexpected, unexpected);
  assert.equal((await handler(request('', 'GET'))).status, 405);
  assert.equal((await handler(request('Bearer invalid'))).status, 401);
  assert.equal((await handler(request('a'.repeat(1025)))).status, 401);
  assert.throws(() => createConfirmationWorker('short', sandbox, unexpected, unexpected));
});

test('claims scoped jobs, sends explicit sandbox notice, finalizes and does not resend empty queue', async () => {
  const value = job(); let claimed = false; let sent = 0; let finished = 0;
  const handler = createConfirmationWorker(secret, sandbox, async (name, params) => {
    if (name === 'preparar_confirmacao_sandbox') {
      assert.deepEqual(params, { p_turma_id: sandbox.turmaId, p_email: sandbox.email });
      if (claimed) return [];
      claimed = true; return [value];
    }
    assert.equal(name, 'finalizar_confirmacao_sandbox');
    assert.deepEqual(params, { p_id: value.id, p_token: value.envio_token, p_resultado: 'enviado' });
    finished++; return true;
  }, async (message) => {
    sent++; assert.equal(message.to, sandbox.email);
    assert.match(message.subject, /TESTE SANDBOX/);
    assert.match(message.text, /Nenhuma cobrança real/);
    assert.ok(!message.text.includes(value.envio_token));
  });
  assert.deepEqual(await (await handler(request())).json(), { aceitos_smtp: 1 });
  assert.deepEqual(await (await handler(request())).json(), { aceitos_smtp: 0 });
  assert.equal(sent, 1); assert.equal(finished, 1);
  assert.equal(confirmationMessage(value).messageId, confirmationMessage(value).messageId);
});

test('never sends a job to another recipient and redacts internal failures', async () => {
  let sent = 0;
  const handler = createConfirmationWorker(secret, sandbox, async () => [{ ...job(), email: 'other@example.test' }],
    async () => { sent++; });
  const result = await handler(request());
  assert.equal(result.status, 503); assert.equal(sent, 0);
  assert.ok(!(await result.text()).includes('other@'));
});

test('SMTP ambiguity is quarantined; no automatic retry or sensitive error disclosure', async () => {
  const value = job(); const finished = [];
  const handler = createConfirmationWorker(secret, sandbox, async (name, params) => {
    if (name === 'preparar_confirmacao_sandbox') return [value];
    finished.push(params); return true;
  }, async () => { throw new Error('private SMTP diagnostic'); });
  const result = await handler(request());
  assert.equal(result.status, 503);
  assert.equal(finished.length, 1); assert.equal(finished[0].p_resultado, 'revisao');
  assert.ok(!(await result.text()).includes('private'));
});

test('SMTP acceptance followed by database failure never claims another job', async () => {
  let claims = 0; let sent = 0;
  const handler = createConfirmationWorker(secret, sandbox, async (name) => {
    if (name === 'preparar_confirmacao_sandbox') { claims++; return [job()]; }
    throw new Error('database down');
  }, async () => { sent++; });
  assert.equal((await handler(request())).status, 503);
  assert.equal(claims, 1); assert.equal(sent, 1);
});
