import assert from 'node:assert/strict';
import { createHash, generateKeyPairSync, sign, randomUUID } from 'node:crypto';
import { test } from 'node:test';
import { createProvider, normalizeOrder, verifySignature } from '../supabase/functions/pagbank-webhook/provider.ts';
import { createWebhook } from '../supabase/functions/pagbank-webhook/handler.ts';
import { createReconciler } from '../supabase/functions/conciliar-cursos/handler.ts';
const pair = generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
const key = pair.publicKey.export({ type: 'spki', format: 'der' }).toString('base64');
const id = `ORDE_${randomUUID()}`, reference = randomUUID();
const order = () => ({ id, reference_id: reference, charges: [{ id: 'CHAR_test', status: 'PAID',
  amount: { value: 60000, currency: 'BRL', summary: { paid: 60000, refunded: 0 } } }] });

test('legacy protocol is explicit, verifies original bytes and rejects invalid signatures before dependencies', async () => {
  const token = 'synthetic-secret';
  const raw = `{ "id":"${id}", "reference_id":"${reference}" }`;
  const signature = createHash('sha256').update(`${token}-${raw}`).digest('hex');
  const provider = createProvider(token, async () => { throw Error('unexpected network'); }, 'legacy-sha256');
  assert.equal(provider.signatureHeader, 'x-authenticity-token');
  assert.equal(await provider.authenticate(Buffer.from(raw), signature), true);
  assert.equal(await provider.authenticate(Buffer.from(raw + ' '), signature), false);
  assert.equal(await provider.authenticate(Buffer.from(raw), '0'.repeat(64)), false);
  assert.equal(await provider.authenticate(Buffer.from(raw), ''), false);
  assert.equal(await provider.authenticate(Buffer.from(raw), 'a'.repeat(63)), false);
  assert.equal(await createProvider('wrong', fetch, 'legacy-sha256').authenticate(Buffer.from(raw), signature), false);
  assert.throws(() => createProvider(token, fetch, 'unknown'));
  assert.equal(createProvider(token).signatureHeader, 'x-payload-signature');
  let reads = 0, writes = 0;
  const handler = createWebhook({ ...provider,
    observe: async (objectId, ref) => { reads++; assert.equal(objectId, id); assert.equal(ref, reference); return normalizeOrder(order(), id); },
    rpc: async () => { writes++; return 'processado'; },
  });
  const request = (header, value, body = raw) => new Request('https://example.test/webhook', {
    method: 'POST', headers: { 'content-type': 'application/json', [header]: value }, body,
  });
  assert.equal((await handler(request('x-payload-signature', signature))).status, 401);
  assert.equal((await handler(request('x-authenticity-token', signature, raw + ' '))).status, 401);
  assert.equal(reads, 0); assert.equal(writes, 0);
  assert.equal((await handler(request('x-authenticity-token', signature))).status, 200);
  assert.equal(reads, 1); assert.equal(writes, 1);
  const strict = createWebhook({ ...provider, signatureHeader: 'x-payload-signature',
    authenticate: async () => false, rpc: async () => { throw Error('unexpected write'); } });
  const both = request('x-payload-signature', 'invalid');
  both.headers.set('x-authenticity-token', signature);
  assert.equal((await strict(both)).status, 401);
});
test('webhook auth diagnostics distinguish missing, malformed and mismatched signatures without secrets or writes', async () => {
  const records = [];
  let authCalls = 0;
  const raw = '{"email":"private@example.test","token":"private-body-value"}';
  const handler = createWebhook({ signatureHeader: 'x-authenticity-token',
    diagnostic: entry => records.push(entry),
    authenticate: async () => { authCalls++; return false; },
    observe: async () => { assert.fail('No provider reads before authentication'); },
    rpc: async () => { assert.fail('No database writes before authentication'); },
  });
  for (const [signature, reason] of [[null, 'missing_signature'], ['private-signature', 'invalid_signature_format'], ['a'.repeat(64), 'signature_mismatch']]) {
    const headers = { 'content-type': 'application/json', 'x-payload-signature': 'private-alternate-header' };
    if (signature) headers['x-authenticity-token'] = signature;
    const response = await handler(new Request('https://example.test/webhook', { method: 'POST', headers, body: raw }));
    assert.equal(response.status, 401);
    assert.deepEqual(await response.json(), { error: 'assinatura_invalida' });
    assert.equal(records.at(-1).result, reason);
    assert.equal(records.at(-1).authenticity_header_present, Boolean(signature));
    assert.equal(records.at(-1).payload_signature_header_present, true);
  }
  assert.equal(authCalls, 2);
  assert.deepEqual(records[0], { event: 'pagbank_webhook_auth', result: 'missing_signature',
    expected_header: 'x-authenticity-token', authenticity_header_present: false, payload_signature_header_present: true });
  assert.equal(records[2].body_bytes, Buffer.byteLength(raw));
  for (const entry of records) {
    assert.deepEqual(Object.keys(entry).sort(), ['event', 'result', 'expected_header', 'authenticity_header_present', 'payload_signature_header_present', ...(entry.body_bytes !== undefined ? ['body_bytes'] : [])].sort());
  }
  assert.ok(!JSON.stringify(records).includes('private'));
  assert.ok(!JSON.stringify(records).includes('a'.repeat(64)));
});

test('webhook diagnostics report verifier outages and cannot change processing when logging fails', async () => {
  const records = [];
  const request = () => new Request('https://example.test/webhook', { method: 'POST',
    headers: { 'content-type': 'application/json', 'x-payload-signature': 'private-signature' },
    body: JSON.stringify({ id, reference_id: reference }),
  });
  const unavailable = createWebhook({ diagnostic: entry => records.push(entry),
    authenticate: async () => { throw Error('private-provider-details'); },
    observe: async () => { assert.fail('No reads'); }, rpc: async () => { assert.fail('No writes'); },
  });
  assert.equal((await unavailable(request())).status, 503);
  assert.equal(records[0].result, 'verification_error');
  assert.ok(!JSON.stringify(records).includes('private'));
  let writes = 0;
  const valid = createWebhook({ diagnostic: () => { throw Error('logging unavailable'); },
    authenticate: async () => true, observe: async () => normalizeOrder(order(), id),
    rpc: async () => { writes++; return 'processado'; },
  });
  assert.equal((await valid(request())).status, 200);
  assert.equal(writes, 1);
});

test('ECDSA verifies raw bytes and multiple signatures; altered bytes and missing signature fail', () => {
  const raw = Buffer.from('{ "id": "teste" }');
  const signature = sign('sha256', raw, pair.privateKey).toString('base64');
  assert.equal(verifySignature(raw, `invalid,${signature}`, key), true);
  assert.equal(verifySignature(Buffer.from('{"id":"teste"}'), signature, key), false);
  assert.equal(verifySignature(raw, '', key), false);
  assert.equal(verifySignature(raw, signature, 'invalid'), false);
});
test('webhook authenticates before JSON and consults provider before mutation', async () => {
  let calls = 0;
  const handler = createWebhook({ authenticate: async (raw, header) => verifySignature(raw, header, key),
    observe: async (objectId, ref) => { calls++; assert.equal(objectId,id); assert.equal(ref,reference); return normalizeOrder(order(), id); },
    rpc: async (name, params) => { calls++; assert.equal(name,'conciliar_pagamento_curso'); assert.equal(params.p_observacao.status,'PAID'); return 'processado'; } });
  const raw = JSON.stringify({ id, reference_id: reference, charges: [{ status: 'DECLINED' }] });
  const request = (signature) => new Request('https://example.test/webhook', { method: 'POST', headers: { 'content-type': 'application/json', 'x-payload-signature': signature }, body: raw });
  assert.equal((await handler(request('invalid'))).status,401); assert.equal(calls,0);
  assert.equal((await handler(request(sign('sha256', Buffer.from(raw), pair.privateKey).toString('base64')))).status,200);
  assert.equal(calls,2);
});
test('normalization refuses wrong reference and flags multiple charges, unknown states and partial refunds', () => {
  assert.throws(() => normalizeOrder(order(),id,randomUUID()));
  const data=order(); data.charges.push(data.charges[0]);
  assert.equal(normalizeOrder(data,id).status,'REVIEW');
  const refund=order(); refund.charges[0].amount.summary.refunded=100;
  assert.equal(normalizeOrder(refund,id).status,'REFUNDED');
  const unknown=order(); unknown.charges[0].status='CHARGEBACK';
  assert.equal(normalizeOrder(unknown,id).status,'REVIEW');
});

test('buyer interest preserves gross evidence while comparing only the fully paid principal', () => {
  const value = order();
  const charge = value.charges[0];
  charge.amount = { value: 66426, currency: 'BRL', summary: { total: 66426, paid: 66426, refunded: 0, incremented: 0 },
    fees: { buyer: { interest: { total: 6426, installments: 5 } } } };
  charge.payment_method = { type: 'CREDIT_CARD', installments: 5 };
  const observed = normalizeOrder(value, id, reference);
  assert.equal(observed.status, 'PAID');
  assert.equal(observed.valor_centavos, 60000);
  assert.equal(observed.pago_centavos, 60000);
  assert.equal(observed.valor_bruto_centavos, 66426);
  assert.equal(observed.pago_bruto_centavos, 66426);
  assert.equal(observed.juros_comprador_centavos, 6426);
  for (const mutate of [
    c => { c.amount.fees.buyer.interest.total = -1; },
    c => { c.amount.fees.buyer.interest.total = '6426'; },
    c => { c.amount.fees.buyer.interest.total = 6426.5; },
    c => { c.amount.fees.buyer.interest.total = 66426; },
    c => { c.amount.fees.buyer.interest.installments = 6; },
    c => { c.payment_method.installments = 11; },
    c => { c.payment_method.type = 'PIX'; },
    c => { c.amount.summary.paid = 66425; },
    c => { c.amount.summary.total = 60000; },
    c => { c.amount.summary.refunded = 100; },
    c => { c.amount.summary.refunded = 60000; },
    c => { c.amount.summary.refunded = 66426; },
    c => { c.amount.summary.incremented = 1; },
    c => { c.amount.fees.buyer.other = 10; },
  ]) {
    const invalid = structuredClone(value);
    mutate(invalid.charges[0]);
    assert.equal(normalizeOrder(invalid, id).status, 'REVIEW');
  }
  const missing = structuredClone(value);
  delete missing.charges[0].amount.fees;
  assert.equal(normalizeOrder(missing, id).valor_centavos, 66426);
  assert.equal(normalizeOrder(order(), id).valor_centavos, 60000);
});
test('provider uses own account and fixed host, caches webhook key and does not trust expiration alone', async () => {
  let keyCalls=0;
  const provider=createProvider('synthetic-token',async (url, options) => {
    assert.equal(options.headers.Authorization,'Bearer synthetic-token'); assert.equal(options.redirect,'error');
    if (url === 'https://sandbox.api.pagseguro.com/public-keys/webhook') { keyCalls++; return Response.json({ public_key:key }); }
    assert.equal(url,'https://sandbox.api.pagseguro.com/checkouts/CHEC_test');
    return Response.json({ id:'CHEC_test', reference_id:reference, status:'EXPIRED' });
  });
  const raw=Buffer.from('{}'), signature=sign('sha256',raw,pair.privateKey).toString('base64');
  assert.equal(await provider.authenticate(raw,signature),true); assert.equal(await provider.authenticate(raw,signature),true); assert.equal(keyCalls,1);
  assert.equal((await provider.observe('CHEC_test',reference)).status,'REVIEW');
  await assert.rejects(provider.observe('https://evil.test/token'));
});
test('worker requires secret and isolates failures; unknown creation becomes review without duplicate POST', async () => {
  const secret='synthetic-worker-secret-minimum-32-characters'; let writes=0;
  const handler=createReconciler(secret,async (name, params) => {
    if (name==='preparar_conciliacao_cursos') return [{ id:reference, envio_iniciado_em:'2020-01-01T00:00:00Z' }];
    writes++; assert.equal(params.p_observacao.status,'REVIEW'); return 'revisao';
  },async () => { throw new Error('should not call provider'); });
  assert.equal((await handler(new Request('https://example.test/worker',{method:'POST'}))).status,401);
  assert.equal(writes,0);
  assert.equal((await handler(new Request('https://example.test/worker',{method:'POST',headers:{authorization:`Bearer ${secret}`}}))).status,200);
  assert.equal(writes,1);
});

test('checkout reconciliation consults its associated order and preserves reference and amount checks', async () => {
  const requests = [];
  let orders = [{ id }], mismatch = false;
  const provider = createProvider('synthetic-token', async (url) => {
    requests.push(url);
    if (url.endsWith('/checkouts/CHEC_test')) return Response.json({ id:'CHEC_test', reference_id:reference, status:'ACTIVE', orders });
    assert.equal(url, `https://sandbox.api.pagseguro.com/orders/${id}`);
    return Response.json({ ...order(), reference_id: mismatch ? randomUUID() : reference });
  });
  const observed = await provider.observe('CHEC_test', reference);
  assert.equal(observed.status, 'PAID'); assert.equal(observed.checkout_id, 'CHEC_test');
  assert.equal(observed.pedido_id, id); assert.equal(observed.pago_centavos, 60000);
  mismatch = true;
  await assert.rejects(provider.observe('CHEC_test', reference));
  orders = [{ id }, { id }]; requests.length = 0;
  assert.equal((await provider.observe('CHEC_test', reference)).status, 'REVIEW');
  assert.equal(requests.length, 1);
  orders = [{ id: 'https://evil.test/order' }];
  assert.equal((await provider.observe('CHEC_test', reference)).status, 'REVIEW');
});
