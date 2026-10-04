import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { test } from 'node:test';
import { ApiError, createHandler, sha256 } from '../supabase/functions/cadastro-curso/handler.ts';
import { createChallengeVerifier, createRpc } from '../supabase/functions/cadastro-curso/adapters.ts';

export const config = { origins: ['https://example.test'], termsVersion: 'teste-v1',
  privacyVersion: 'privacidade-teste-v1', rateSecret: 'test-only-rate-secret-not-a-real-key' };
export const token = () => randomBytes(32).toString('hex');
export const payload = (overrides = {}) => ({ turma_id: 'b43bce5c-7764-42a1-b361-5134c7b0370a',
  nome: 'Pessoa Sintética', email: 'synthetic@example.test', telefone: '+55 (61) 99999-0000',
  aceita_termos: true, aceita_imagem: false, aceita_marketing: false,
  termo_versao: config.termsVersion, aviso_privacidade_versao: config.privacyVersion,
  turnstile_token: 'synthetic-challenge', ...overrides });
export const request = (data, capability = token(), method = 'POST', extra = {}) => new Request(
  'https://example.test/functions/v1/cadastro-curso', { method,
    headers: { origin: 'https://example.test', 'content-type': 'application/json',
      'x-registration-token': capability, ...extra }, ...(method === 'POST' ? { body: JSON.stringify(data) } : {}) });

test('Sandbox denies other identities, real cohorts and optional permissions before sending or saving', async () => {
  const turmaId = '1349d08b-4fc6-4b1f-a485-2e691f716ab2';
  const sandboxConfig = { ...config, sandbox: { turmaId, email: 'synthetic@example.test' } };
  const dependencies = {
    rpc: async () => { assert.fail('Denied tests must not touch the database'); },
    verifyChallenge: async () => { assert.fail('Denied tests must not reach the verifier'); },
    recovery: { requestCode: async () => { assert.fail('Must not send mail'); }, verifyCode: async () => { assert.fail('Must not verify mail'); } },
  };
  const handler = createHandler(sandboxConfig, dependencies);
  for (const input of [payload(), payload({ turma_id: turmaId, email: 'other@example.test' }),
    { action: 'solicitar_codigo', turma_id: turmaId, email: 'other@example.test', turnstile_token: 'synthetic' }]) {
    assert.equal((await handler(request(input))).status, 403);
  }
  assert.equal((await handler(request(payload({ turma_id: turmaId, aceita_marketing: true })))).status, 400);
  assert.equal((await handler(request(payload({ turma_id: turmaId, aceita_imagem: true })))).status, 400);
  let saved = false, sent = false;
  const eligible = createHandler(sandboxConfig, {
    rpc: async name => { if (name === 'cadastrar_inscricao_curso') saved = true; return true; },
    verifyChallenge: async () => true,
    recovery: { requestCode: async () => { sent = true; }, verifyCode: async () => 'synthetic@example.test' },
  });
  assert.equal((await eligible(request(payload({ turma_id: turmaId })))).status, 202);
  assert.equal(saved, true);
  assert.equal((await eligible(request({ action: 'solicitar_codigo', turma_id: turmaId, email: 'synthetic@example.test', turnstile_token: 'synthetic' }))).status, 202);
  assert.equal(sent, true);

});

test('registration HTTP validation rejects malformed input before any dependency call', async () => {
  const handler = createHandler(config, { rpc: async () => { assert.fail('Database must not be called'); },
    verifyChallenge: async () => { assert.fail('Challenge must not be called'); } });
  for (const input of [null, [], payload({ aceita_termos: false }), payload({ aceita_imagem: 'false' }),
    payload({ email: 'invalid' }), payload({ telefone: '61999990000' }), payload({ turma_id: '../bad' }),
    payload({ valor_cobrado: 1 }), payload({ nome: 'X' }), payload({ turnstile_token: '' })]) {
    assert.equal((await handler(request(input))).status, 400);
  }
  assert.equal((await handler(request(payload({ termo_versao: 'old' })))).status, 409);
  assert.equal((await handler(request(payload(), 'short'))).status, 401);
  assert.equal((await handler(request(payload(), token(), 'POST', { origin: 'https://evil.test' }))).status, 403);
  assert.equal((await handler(request(payload(), token(), 'POST', { origin: '' }))).status, 403);
  assert.equal((await handler(request(payload(), token(), 'POST', { 'content-type': 'text/plain' }))).status, 415);
  assert.equal((await handler(request(payload({ nome: 'a'.repeat(9000) })))).status, 413);
  assert.equal((await handler(request(null, token(), 'DELETE'))).status, 405);
  assert.equal((await handler(request(null, token(), 'OPTIONS'))).status, 204);
});

test('normalizes inputs, hashes capability, excludes captcha from idempotency and returns no PII', async () => {
  const calls = [];
  const handler = createHandler(config, { rpc: async (name, params) => { calls.push([name, params]); return true; },
    verifyChallenge: async () => true });
  const capability = token();
  const first = await handler(request(payload({ email: ' SYNTHETIC@EXAMPLE.TEST ' }), capability));
  assert.equal(first.status, 202);
  assert.deepEqual(await first.json(), { status: 'solicitacao_recebida' });
  assert.equal(first.headers.get('cache-control'), 'no-store');
  const saved = calls[1][1];
  assert.equal(saved.p_email, 'synthetic@example.test');
  assert.equal(saved.p_telefone, '+5561999990000');
  assert.equal(saved.p_token_hash, await sha256(capability));
  assert.equal(saved.p_aceita_marketing, false);
  assert.equal(saved.p_aceita_imagem, false);
  await handler(request(payload({ turnstile_token: 'fresh-challenge' }), capability));
  assert.equal(calls[3][1].p_requisicao_hash, saved.p_requisicao_hash);
  assert.doesNotMatch(JSON.stringify(calls), new RegExp(capability));
});

test('fails closed for rate limiting, captcha, database outage and unexpected status response', async () => {
  let saved = false;
  const rpc = async (name) => { if (name.startsWith('cadastrar')) saved = true; return true; };
  const limited = createHandler(config, { rpc: async () => false, verifyChallenge: async () => true });
  const response = await limited(request(payload()));
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('retry-after'), '900');
  const denied = createHandler(config, { rpc, verifyChallenge: async () => false });
  assert.equal((await denied(request(payload()))).status, 400);
  assert.equal(saved, false);
  const outage = createHandler(config, { rpc: async () => { throw new Error('sensitive detail'); },
    verifyChallenge: async () => true });
  const failure = await outage(request(payload()));
  assert.equal(failure.status, 503);
  assert.doesNotMatch(await failure.text(), /sensitive/);
  const corrupt = createHandler(config, { rpc, verifyChallenge: async () => true });
  assert.equal((await corrupt(request(null, token(), 'GET'))).status, 503);
});

test('production adapters enforce project, timeout, challenge hostname and action', async () => {
  assert.throws(() => createRpc('https://another.supabase.co', 'synthetic'), /Projeto/);
  assert.throws(() => createChallengeVerifier(''), /Turnstile/);
  for (const body of [null, { success: true }, { success: false, hostname: 'example.test', action: 'cadastro_curso' },
    { success: true, hostname: 'evil.test', action: 'cadastro_curso' },
    { success: true, hostname: 'example.test', action: 'another_form' }]) {
    const verifier = createChallengeVerifier('synthetic', async () => Response.json(body));
    assert.equal(await verifier('synthetic', 'example.test'), false);
  }
  const verifier = createChallengeVerifier('synthetic', async (url, init) => {
    assert.equal(url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
    assert.ok(init.signal instanceof AbortSignal);
    assert.equal(init.redirect, 'error');
    return Response.json({ success: true, hostname: 'example.test', action: 'cadastro_curso' });
  });
  assert.equal(await verifier('synthetic', 'example.test'), true);
  const rpc = createRpc('https://ydmvbssgiffqrmwigkae.supabase.co', 'synthetic', async (_url, init) => {
    assert.ok(init.signal instanceof AbortSignal);
    return Response.json({ message: 'sensitive internals' }, { status: 500 });
  });
  await assert.rejects(rpc('cadastrar_inscricao_curso', {}), /servico_indisponivel/);
  await assert.rejects(rpc('arbitrary_function', {}), /RPC nao permitida/);
});

test('recovery requires challenge, valid OTP and matching verified email before privileged binding', async () => {
  const calls = [];
  const data = { action: 'validar_codigo', email: 'person@example.test', turma_id: payload().turma_id,
    codigo: '01234567', turnstile_token: 'synthetic' };
  for (const verifyCode of [async () => { throw new ApiError(401, 'codigo_invalido'); }, async () => 'other@example.test']) {
    const handler = createHandler(config, { rpc: async (name) => { calls.push(name); return true; },
      verifyChallenge: async () => true, recovery: { requestCode: async () => {}, verifyCode } });
    assert.equal((await handler(request(data))).status, 401);
  }
  assert.ok(!calls.includes('recuperar_cadastro_curso'));
  let sent = false;
  const handler = createHandler(config, { rpc: async () => true, verifyChallenge: async () => true,
    recovery: { requestCode: async () => { sent = true; }, verifyCode: async () => data.email } });
  assert.equal((await handler(request({ ...data, action: 'solicitar_codigo' }))).status, 202);
  assert.equal(sent, true);
  calls.length = 0;
  const strict = createHandler(config, {
    rpc: async (name) => { calls.push(name); return true; },
    verifyChallenge: async () => true,
    recovery: { requestCode: async () => {}, verifyCode: async (email, code) => {
      assert.equal(code, '01234567');
      return email;
    } },
  });
  for (const codigo of ['123456', '1234567', '123456789', 'abcdefgh', '0123 4567']) {
    assert.equal((await strict(request({ ...data, codigo }))).status, 400);
  }
  assert.deepEqual(calls, []);
  assert.equal((await strict(request(data))).status, 202);
  assert.ok(calls.includes('recuperar_cadastro_curso'));
  const disabled = createHandler(config, { rpc: async () => { assert.fail('Must fail closed'); }, verifyChallenge: async () => true });
  assert.equal((await disabled(request(data))).status, 503);
});
