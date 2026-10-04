import assert from 'node:assert/strict';
import { randomBytes, randomUUID } from 'node:crypto';
import { sha256 } from '../supabase/functions/cadastro-curso/handler.ts';
import { createCheckoutHandler } from '../supabase/functions/checkout-curso/handler.ts';

const quote = (v) => v === null ? 'NULL' : typeof v === 'boolean' ? String(v) : `'${String(v).replaceAll("'", "''")}'`;
export async function checkoutDatabaseTests(t, { sql, scalar, createOffer, register }) {
  const signatures = {
    iniciar_checkout_curso: ['p_token_hash', 'p_idempotencia'],
    finalizar_checkout_curso: ['p_pagamento_id', 'p_resultado', 'p_checkout_id', 'p_url', 'p_expira_em'],
    limitar_cadastro_curso: ['p_chave', 'p_consulta'],
    consultar_cadastro_curso: ['p_token_hash'],
  };
  const rpc = async (name, params) => {
    assert.ok(Object.hasOwn(signatures, name));
    const expr = `public.${name}(${signatures[name].map((key) => quote(params[key] ?? null)).join(',')})`;
    const output = await sql(`SET ROLE service_role; SELECT ${name === 'finalizar_checkout_curso' ? expr : `to_jsonb(${expr})`};`);
    return output ? JSON.parse(output) : null;
  };
  const setup = async (turma) => {
    const id = await register(turma || (await createOffer()).turma);
    const token = randomBytes(32).toString('hex'), hash = await sha256(token);
    await sql(`INSERT INTO public.sessoes_cadastro(token_hash,requisicao_hash,inscricao_id) VALUES ('${hash}','${hash}','${id}');`);
    return { id, token, hash };
  };
  const start = (hash, key = randomUUID()) => rpc('iniciar_checkout_curso', { p_token_hash: hash, p_idempotencia: key });
  const finish = (a, result = 'criado') => rpc('finalizar_checkout_curso', {
    p_pagamento_id: a.pagamento_id, p_resultado: result,
    p_checkout_id: result === 'criado' ? `CHEC_${a.pagamento_id}` : null,
    p_url: result === 'criado' ? `https://pagamento.sandbox.pagbank.com.br/pagamento?code=${a.pagamento_id}` : null,
    p_expira_em: result === 'criado' ? a.expira_em : null,
  });

  await t.test('checkout HTTP concurrent clicks and new keys create one provider checkout and one reservation', async () => {
    const { id, token } = await setup();
    let externalCalls = 0;
    const handler = createCheckoutHandler({ origins: ['https://example.test'], enabled: true }, {
      rpc, createCheckout: async (a) => {
        externalCalls++;
        return { resultado: 'criado', id: `CHEC_${a.pagamento_id}`,
          url: `https://pagamento.sandbox.pagbank.com.br/pagamento?code=${a.pagamento_id}`, expira_em: a.expira_em };
      },
    });
    const send = () => handler(new Request('https://example.test/checkout', { method: 'POST',
      headers: { origin: 'https://example.test', 'content-type': 'application/json', 'x-registration-token': token },
      body: JSON.stringify({ idempotencia: randomUUID() }),
    }));
    const responses = await Promise.all(Array.from({ length: 5 }, send));
    assert.ok(responses.every((r) => [200, 202].includes(r.status)));
    assert.equal(externalCalls, 1);
    assert.equal((await send()).status, 200);
    assert.equal(externalCalls, 1);
    assert.equal(await scalar(`SELECT count(*) FROM public.pagamentos WHERE inscricao_id='${id}';`), 1);
    assert.equal(await sql(`SELECT etapa_funil FROM public.inscricoes WHERE id='${id}';`), 'checkout_iniciado');
    assert.equal(await sql(`SELECT status FROM public.pagamentos WHERE inscricao_id='${id}';`), 'pendente');
  });
  await t.test('unknown outcome holds capacity and prevents a second checkout even after expiration', async () => {
    const { turma } = await createOffer(1);
    const first = await setup(turma), second = await setup(turma);
    const a = await start(first.hash);
    await finish(a, 'resultado_desconhecido');
    await sql(`UPDATE public.reservas SET criada_em=now()-interval '2 hours',expira_em=now()-interval '1 hour' WHERE pagamento_id='${a.pagamento_id}';`);
    assert.equal((await start(first.hash)).acao, 'aguardar');
    await assert.rejects(start(second.hash), /vagas_esgotadas/);
    assert.equal(await sql(`SELECT etapa_funil FROM public.inscricoes WHERE id='${first.id}';`), 'lead_capturado');
    assert.equal(await sql(`SELECT estado FROM public.reservas WHERE pagamento_id='${a.pagamento_id}';`), 'conciliacao');
  });
  await t.test('crash after claim cannot issue a new external POST', async () => {
    const { hash } = await setup();
    assert.equal((await start(hash)).acao, 'criar');
    assert.equal((await start(hash)).acao, 'aguardar');
  });
  await t.test('definitive rejection releases reservation but preserves registration; new key can retry', async () => {
    const { id, hash } = await setup(), key = randomUUID();
    const a = await start(hash, key);
    await finish(a, 'falha_definitiva');
    assert.equal((await start(hash, key)).acao, 'falhou');
    const next = await start(hash);
    assert.equal(next.acao, 'criar');
    assert.notEqual(next.pagamento_id, a.pagamento_id);
    assert.equal(await sql(`SELECT etapa_funil FROM public.inscricoes WHERE id='${id}';`), 'lead_capturado');
    assert.equal(await sql(`SELECT estado FROM public.reservas WHERE pagamento_id='${a.pagamento_id}';`), 'liberada');
  });
  await t.test('capability expiry and unknown token cannot reserve; price changes require review', async () => {
    const { id, hash } = await setup();
    assert.equal(await start('f'.repeat(64)), null);
    await sql(`UPDATE public.turmas SET preco=650 WHERE id=(SELECT turma_id FROM public.inscricoes WHERE id='${id}');`);
    await assert.rejects(start(hash), /oferta_alterada/);
    await sql(`UPDATE public.sessoes_cadastro SET criada_em=now()-interval '2 days',expira_em=now()-interval '1 day' WHERE token_hash='${hash}';`);
    assert.equal(await start(hash), null);
    assert.equal(await scalar(`SELECT count(*) FROM public.pagamentos WHERE inscricao_id='${id}';`), 0);
  });
  await t.test('finalization replay cannot downgrade success or confirm enrollment', async () => {
    const { hash, id } = await setup();
    const a = await start(hash);
    await finish(a);
    await finish(a, 'resultado_desconhecido');
    await finish(a, 'falha_definitiva');
    assert.equal((await start(hash)).acao, 'reutilizar');
    assert.equal(await sql(`SELECT etapa_funil FROM public.inscricoes WHERE id='${id}';`), 'checkout_iniciado');
    assert.equal(await scalar(`SELECT count(*) FROM public.historico_inscricoes WHERE inscricao_id='${id}' AND etapa_nova='checkout_iniciado';`), 1);
  });
  await t.test('public database roles cannot call checkout routines', async () => {
    for (const role of ['anon', 'authenticated']) {
      await assert.rejects(sql(`SET ROLE ${role}; SELECT public.iniciar_checkout_curso(NULL,NULL);`), /permission denied/);
      await assert.rejects(sql(`SET ROLE ${role}; SELECT public.finalizar_checkout_curso(NULL,NULL);`), /permission denied/);
    }
  });
}
