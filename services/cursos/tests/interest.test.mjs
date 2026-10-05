import assert from 'node:assert/strict';
import { test } from 'node:test';
import { randomUUID } from 'node:crypto';
import { createInterestHandler, GROUP_INVITE, INTEREST_PRIVACY_VERSION } from '../supabase/functions/interesse-curso/handler.ts';
import { createChallengeVerifier } from '../supabase/functions/cadastro-curso/adapters.ts';

const origin = 'https://neuropsiedu.com.br';
const config = { origins: [origin], turmaId: randomUUID(), rateSecret: 'synthetic-interest-secret-over-32-characters' };
const input = (patch = {}) => ({ nome: 'Pessoa Sintética', email: 'SYNTHETIC@example.test ', telefone: '+5561999990000',
  perfil: 'estudante', pergunta: 'Como funciona a aplicação?', aceita_contato: true, aceita_grupo: false,
  turnstile_token: 'synthetic-challenge', website: '', ...patch });
const request = (body = input(), options = {}) => new Request('https://example.test/interest', {
  method: 'POST', headers: { origin, 'content-type': 'application/json' }, body: JSON.stringify(body), ...options,
});

test('interest saves in the configured cohort and only returns the invite after persistence and opt-in', async () => {
  const saved = [];
  const handler = createInterestHandler(config, { verifyChallenge: async (token, hostname) => {
    assert.equal(hostname, 'neuropsiedu.com.br'); assert.equal(token, 'synthetic-challenge'); return true;
  }, rpc: async (name, params) => {
    if (name === 'limitar_cadastro_curso') { assert.ok(!params.p_chave.includes('synthetic@')); return true; }
    assert.equal(name, 'salvar_interesse_curso'); saved.push(params);
  } });
  const without = await handler(request());
  assert.equal(without.status, 202);
  assert.deepEqual(await without.json(), { status: 'interesse_recebido' });
  const withGroup = await handler(request(input({ aceita_grupo: true })));
  assert.deepEqual(await withGroup.json(), { status: 'interesse_recebido', grupo_url: GROUP_INVITE });
  assert.equal(saved[0].p_email, 'synthetic@example.test');
  assert.equal(saved[0].p_turma_id, config.turmaId);
  assert.equal(saved[0].p_privacidade_versao, INTEREST_PRIVACY_VERSION);
  assert.equal(saved[0].p_aceita_grupo, false);
});

test('invalid data, forged cohort, missing consent and honeypot do not reach the database', async () => {
  const unexpected = async () => { throw new Error('must not be called'); };
  const handler = createInterestHandler(config, { rpc: unexpected, verifyChallenge: unexpected });
  for (const patch of [{ nome: 'a' }, { email: 'a@' }, { telefone: '61999990000' }, { perfil: 'outro' },
    { aceita_contato: false }, { aceita_grupo: 'true' }, { website: 'bot' }, { turma_id: randomUUID() },
    { pergunta: 'a'.repeat(1001) }, { turnstile_token: '' }]) {
    assert.equal((await handler(request(input(patch)))).status, 400);
  }
  assert.equal((await handler(request(input(), { headers: { origin: 'https://other.test' } }))).status, 403);
  assert.equal((await handler(new Request('https://example.test', { method: 'GET', headers: { origin } }))).status, 405);
  assert.equal((await handler(new Request('https://example.test', { method: 'OPTIONS', headers: { origin } }))).status, 204);
});

test('rate limit, invalid captcha and failed write never return an invitation or success', async () => {
  let writes = 0;
  for (const stage of ['rate', 'captcha', 'save']) {
    const handler = createInterestHandler(config, { verifyChallenge: async () => stage !== 'captcha',
      rpc: async name => { if (name === 'limitar_cadastro_curso') return stage !== 'rate'; writes++; throw new Error('private diagnostic'); } });
    const response = await handler(request(input({ aceita_grupo: true })));
    assert.equal(response.status, { rate: 429, captcha: 400, save: 503 }[stage]);
    const body = await response.text(); assert.ok(!body.includes('chat.whatsapp.com')); assert.ok(!body.includes('private'));
  }
  assert.equal(writes, 1);
});

test('interest action is isolated from registration CAPTCHA tokens', async () => {
  const transport = action => async () => Response.json({ success: true, hostname: 'neuropsiedu.com.br', action });
  assert.equal(await createChallengeVerifier('synthetic', transport('cadastro_curso'), 'interesse_curso')('token', 'neuropsiedu.com.br'), false);
  assert.equal(await createChallengeVerifier('synthetic', transport('interesse_curso'), 'interesse_curso')('token', 'neuropsiedu.com.br'), true);
});
