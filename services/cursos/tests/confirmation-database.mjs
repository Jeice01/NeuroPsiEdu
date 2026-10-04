import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { sha256 } from '../supabase/functions/cadastro-curso/handler.ts';

export async function confirmationDatabaseTests(t, { sql, scalar, createOffer, register }) {
  const setup = async (sandbox = true, paid = true) => {
    const { course, turma } = await createOffer();
    if (sandbox) await sql(`UPDATE public.cursos SET nome='SANDBOX Curso' WHERE id='${course}';
      UPDATE public.turmas SET nome='SANDBOX Turma' WHERE id='${turma}';`);
    const id = await register(turma);
    const email = await sql(`SELECT p.email FROM public.participantes p JOIN public.inscricoes i ON i.participante_id=p.id WHERE i.id='${id}';`);
    const key = randomUUID();
    const r = JSON.parse(await sql(`SET ROLE service_role; SELECT to_jsonb(public.reservar_vaga_curso('${id}','${key}'));`));
    await sql(`UPDATE public.pagamentos SET envio_iniciado_em=now(),pagbank_checkout_id='CHEC_${key}' WHERE id='${r.pagamento_id}';`);
    if (paid) {
      const observation = JSON.stringify({ pagamento_id: r.pagamento_id, objeto_id: `ORDE_${key}`, pedido_id: `ORDE_${key}`,
        cobranca_id: `CHAR_${key}`, status: 'PAID', valor_centavos: 60000, moeda: 'BRL', pago_centavos: 60000, reembolsado_centavos: 0 });
      await sql(`SET ROLE service_role; SELECT public.conciliar_pagamento_curso('${observation}'::jsonb,'${await sha256(observation)}');`);
    } else {
      await sql(`INSERT INTO public.comunicacoes(inscricao_id,canal,tipo,chave_deduplicacao)
        VALUES('${id}','email','matricula_confirmada','confirmacao:${id}');`);
    }
    return { id, turma, email };
  };
  const claim = a => sql(`SET ROLE service_role; SELECT coalesce(jsonb_agg(x),'[]'::jsonb) FROM public.preparar_confirmacao_sandbox('${a.turma}','${a.email}') x;`);
  await t.test('confirmation RPCs are private and require service role', async () => {
    for (const role of ['anon', 'authenticated']) {
      await assert.rejects(sql(`SET ROLE ${role}; SELECT * FROM public.preparar_confirmacao_sandbox('${randomUUID()}','test@example.test');`), /permission denied/);
      await assert.rejects(sql(`SET ROLE ${role}; SELECT public.finalizar_confirmacao_sandbox('${randomUUID()}','${randomUUID()}','enviado');`), /permission denied/);
    }
  });
  await t.test('concurrent claims send once; token binding and finalized state prevent repeats', async () => {
    const a = await setup();
    const results = (await Promise.all([claim(a), claim(a)])).map(JSON.parse);
    assert.equal(results.filter(x => x.length === 1).length, 1);
    const job = results.find(x => x.length)[0];
    assert.equal(await sql(`SET ROLE service_role; SELECT public.finalizar_confirmacao_sandbox('${job.id}','${randomUUID()}','enviado');`), 'f');
    assert.equal(await sql(`SET ROLE service_role; SELECT public.finalizar_confirmacao_sandbox('${job.id}','${job.envio_token}','enviado');`), 't');
    assert.equal(await sql(`SET ROLE service_role; SELECT public.finalizar_confirmacao_sandbox('${job.id}','${job.envio_token}','enviado');`), 'f');
    assert.deepEqual(JSON.parse(await claim(a)), []);
    assert.equal(await scalar(`SELECT tentativas FROM public.comunicacoes WHERE id='${job.id}';`), 1);
  });
  await t.test('real classes, unpaid rows and other recipients are not claimed', async () => {
    assert.deepEqual(JSON.parse(await claim(await setup(false))), []);
    assert.deepEqual(JSON.parse(await claim(await setup(true, false))), []);
    const a = await setup();
    assert.deepEqual(JSON.parse(await claim({ ...a, email: 'other@example.test' })), []);
    assert.equal(await sql(`SELECT status FROM public.comunicacoes WHERE inscricao_id='${a.id}';`), 'pendente');
  });
  await t.test('expired claims go to review and cannot be retried or finalized by stale workers', async () => {
    const a = await setup(); const [job] = JSON.parse(await claim(a));
    await sql(`UPDATE public.comunicacoes SET envio_iniciado_em=now()-interval '6 minutes' WHERE id='${job.id}';`);
    assert.deepEqual(JSON.parse(await claim(a)), []);
    assert.equal(await sql(`SELECT status||':'||erro_log FROM public.comunicacoes WHERE id='${job.id}';`), 'revisao:envio_incerto');
    assert.equal(await sql(`SET ROLE service_role; SELECT public.finalizar_confirmacao_sandbox('${job.id}','${job.envio_token}','enviado');`), 'f');
  });
}
