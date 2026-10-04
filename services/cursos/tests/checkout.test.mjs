import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { test } from 'node:test';
import { createPagBank } from '../supabase/functions/checkout-curso/pagbank.ts';
import { createCheckoutHandler } from '../supabase/functions/checkout-curso/handler.ts';

const attempt = () => ({ pagamento_id: randomUUID(), inscricao_id: randomUUID(), turma_id: randomUUID(),
  nome: 'Curso sintético', valor_centavos: 60000, expira_em: new Date(Date.now() + 1200000).toISOString() });
const config = { token: 'synthetic-sandbox-token', returnUrl: 'https://example.test/resultado/', webhookUrl: 'https://example.test/webhook' };
const payUrl = 'https://pagamento.sandbox.pagbank.com.br/pagamento?code=synthetic';
const body = (a) => ({ id: `CHEC_${randomUUID()}`, reference_id: a.pagamento_id,
  status: 'ACTIVE', expiration_date: a.expira_em, links: [{ rel: 'PAY', href: payUrl, method: 'GET' }] });

test('sandbox adapter sends server price, unique attempt reference and independent notifications', async () => {
  const a = attempt();
  const provider = createPagBank(config, async (url, options) => {
    assert.equal(url, 'https://sandbox.api.pagseguro.com/checkouts');
    assert.equal(options.redirect, 'error');
    assert.equal(options.headers.Authorization, `Bearer ${config.token}`);
    assert.equal(options.headers['x-idempotency-key'], undefined);
    const payload = JSON.parse(options.body);
    assert.equal(payload.reference_id, a.pagamento_id);
    assert.equal(payload.items[0].unit_amount, 60000);
    assert.equal(payload.items.length, 1);
    assert.equal(payload.items[0].quantity, 1);
    assert.equal(payload.items[0].name, a.nome);
    assert.equal(payload.items[0].description, `Inscrição individual para 1 participante. Curso: ${a.nome}. Realização: NeuroPsiEdu.`);
    assert.equal(payload.items[0].image_url, 'https://neuropsiedu.com.br/images/logo-vertical-600.webp');
    assert.equal(payload.expiration_date, a.expira_em);
    assert.deepEqual(payload.payment_methods_configs, [{ type: 'CREDIT_CARD', config_options: [{ option: 'INSTALLMENTS_LIMIT', value: '10' }] }]);
    assert.deepEqual(payload.notification_urls, [config.webhookUrl]);
    assert.deepEqual(payload.payment_notification_urls, [config.webhookUrl]);
    assert.equal(payload.customer, undefined, 'No personal data copied unnecessarily');
    return Response.json(body(a));
  });
  assert.equal((await provider(a)).resultado, 'criado');
});

test('timeouts, ambiguous HTTP failures and untrusted checkout links never count as rejection', async () => {
  const a = attempt();
  for (const status of [408, 409, 429, 500, 502, 503]) {
    assert.equal((await createPagBank(config, async () => new Response('', { status }))(a)).resultado, 'resultado_desconhecido');
  }
  const invalid = [
    { reference_id: randomUUID() }, { status: 'INACTIVE' }, { id: 'ORDE_wrong-object' },
    { expiration_date: new Date(Date.now() + 7200000).toISOString() }, { expiration_date: 'invalid' },
    ...['https://evil.test/pagamento?code=x', 'https://pagamento.pagbank.com.br/pagamento?code=x',
      'https://user@pagamento.sandbox.pagbank.com.br/pagamento?code=x', 'javascript:alert(1)'].map((href) => ({ links: [{ rel: 'PAY', method: 'GET', href }] })),
  ];
  for (const change of invalid) {
    assert.equal((await createPagBank(config, async () => Response.json({ ...body(a), ...change }))(a)).resultado, 'resultado_desconhecido');
  }
  assert.equal((await createPagBank(config, async () => { throw new Error('timeout'); })(a)).resultado, 'resultado_desconhecido');
});

test('explicit provider rejection is distinct from abandonment', async () => {
  for (const status of [400, 401, 403, 422]) {
    assert.equal((await createPagBank(config, async () => new Response('', { status }))(attempt())).resultado, 'falha_definitiva');
  }
});

function request(payload = { idempotencia: randomUUID() }, overrides = {}) {
  return new Request('https://example.test/checkout', { method: 'POST',
    headers: { origin: 'https://example.test', 'content-type': 'application/json', 'x-registration-token': 'a'.repeat(64) },
    body: JSON.stringify(payload), ...overrides });
}

test('checkout requires capability, approved origin, bounded JSON and server-owned amount', async () => {
  let calls = 0;
  const handler = createCheckoutHandler({ origins: ['https://example.test'], enabled: true }, {
    rpc: async () => { calls++; return null; }, createCheckout: async () => { throw new Error('must not call'); },
  });
  assert.equal((await handler(request({}, { headers: { origin: 'https://evil.test' } }))).status, 403);
  assert.equal((await handler(request({}, { headers: { origin: 'https://example.test' } }))).status, 401);
  assert.equal((await handler(request({ idempotencia: randomUUID(), valor_centavos: 1 }))).status, 400);
  assert.equal((await handler(request({ idempotencia: randomUUID(), quantity: 2 }))).status, 400);
  assert.equal((await handler(request({ idempotencia: randomUUID(), items: [{ quantity: 2 }] }))).status, 400);
  assert.equal((await handler(request({ idempotencia: 'x'.repeat(9000) }))).status, 413);
  assert.equal(calls, 0);
});

test('disabled checkout performs no database or provider call', async () => {
  const fail = async () => { throw new Error('must not call'); };
  const handler = createCheckoutHandler({ origins: ['https://example.test'], enabled: false }, { rpc: fail, createCheckout: fail });
  assert.equal((await handler(request())).status, 503);
});

test('provider link is withheld when persistence fails; retries await reconciliation', async () => {
  const a = attempt();
  const handler = createCheckoutHandler({ origins: ['https://example.test'], enabled: true }, {
    rpc: async (name) => {
      if (name === 'limitar_cadastro_curso') return true;
      if (name === 'iniciar_checkout_curso') return { acao: 'criar', ...a };
      throw new Error('database timeout');
    }, createCheckout: async () => ({ resultado: 'criado', id: 'CHEC_test', url: payUrl, expira_em: a.expira_em }),
  });
  const response = await handler(request());
  assert.equal(response.status, 503);
  assert.equal((await response.text()).includes(payUrl), false);
});
