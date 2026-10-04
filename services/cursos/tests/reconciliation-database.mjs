import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { sha256 } from '../supabase/functions/cadastro-curso/handler.ts';
const quote = v => `'${String(v).replaceAll("'","''")}'`;
export async function reconciliationDatabaseTests(t,{ sql, scalar, createOffer, register }) {
  const setup=async (turma) => {
    const id=await register(turma || (await createOffer()).turma), key=randomUUID();
    const r=JSON.parse(await sql(`SET ROLE service_role; SELECT to_jsonb(public.reservar_vaga_curso('${id}','${key}'));`));
    await sql(`UPDATE public.pagamentos SET envio_iniciado_em=now(),pagbank_checkout_id='CHEC_${r.pagamento_id}' WHERE id='${r.pagamento_id}';`);
    return { id,r, observation:{ pagamento_id:r.pagamento_id,objeto_id:`ORDE_${key}`,pedido_id:`ORDE_${key}`,cobranca_id:`CHAR_${key}`,status:'PAID',valor_centavos:60000,moeda:'BRL',pago_centavos:60000,reembolsado_centavos:0 } };
  };
  const reconcile=async observation => {
    const body=JSON.stringify(observation), hash=await sha256(body);
    return sql(`SET ROLE service_role; SELECT public.conciliar_pagamento_curso(${quote(body)}::jsonb,'${hash}');`);
  };
  await t.test('paid webhook before checkout response confirms once and queues a single notification',async () => {
    const a=await setup();
    const results=await Promise.all(Array.from({length:4},()=>reconcile(a.observation)));
    assert.equal(results.filter(x=>x==='processado').length,1);
    assert.equal(await sql(`SELECT etapa_funil FROM public.inscricoes WHERE id='${a.id}';`),'matricula_confirmada');
    assert.equal(await scalar(`SELECT count(*) FROM public.comunicacoes WHERE inscricao_id='${a.id}';`),1);
    assert.equal(await sql(`SELECT estado FROM public.reservas WHERE id='${a.r.id}';`),'confirmada');
    await sql(`SELECT public.finalizar_checkout_curso('${a.r.pagamento_id}','resultado_desconhecido');`);
    await reconcile({...a.observation,status:'WAITING',pago_centavos:0});
    assert.equal(await sql(`SELECT status FROM public.pagamentos WHERE id='${a.r.pagamento_id}';`),'pago');
    assert.equal(await scalar(`SELECT to_jsonb(reserva_expira_em IS NULL) FROM public.inscricoes WHERE id='${a.id}';`),true);
  });
  await t.test('wrong value goes to review without marking payment paid or releasing capacity',async () => {
    const a=await setup(); await reconcile({...a.observation,valor_centavos:1,pago_centavos:1});
    assert.equal(await sql(`SELECT etapa_funil FROM public.inscricoes WHERE id='${a.id}';`),'revisao_necessaria');
    assert.equal(await sql(`SELECT status FROM public.pagamentos WHERE id='${a.r.pagamento_id}';`),'pendente');
    assert.equal(await sql(`SELECT estado FROM public.reservas WHERE id='${a.r.id}';`),'conciliacao');
  });
  await t.test('late paid without capacity is retained as paid but never enrolls beyond capacity',async () => {
    const {turma}=await createOffer(1), a=await setup(turma);
    await sql(`UPDATE public.reservas SET estado='liberada',finalizada_em=now(),criada_em=now()-interval '2 hours',expira_em=now()-interval '1 hour' WHERE id='${a.r.id}';`);
    const b=await setup(turma); await reconcile(b.observation); await reconcile(a.observation);
    assert.equal(await sql(`SELECT etapa_funil FROM public.inscricoes WHERE id='${a.id}';`),'revisao_necessaria');
    assert.equal(await sql(`SELECT status FROM public.pagamentos WHERE id='${a.r.pagamento_id}';`),'pago');
    assert.equal(await scalar(`SELECT count(*) FROM public.inscricoes WHERE turma_id='${turma}' AND etapa_funil='matricula_confirmada';`),1);
  });
  await t.test('late paid with remaining capacity can confirm; subsequent refund requires review',async () => {
    const a=await setup();
    await sql(`UPDATE public.reservas SET estado='liberada',finalizada_em=now() WHERE id='${a.r.id}';`);
    await reconcile(a.observation);
    assert.equal(await sql(`SELECT etapa_funil FROM public.inscricoes WHERE id='${a.id}';`),'matricula_confirmada');
    await reconcile({...a.observation,status:'REFUNDED',reembolsado_centavos:60000});
    assert.equal(await sql(`SELECT etapa_funil FROM public.inscricoes WHERE id='${a.id}';`),'revisao_necessaria');
    assert.equal(await sql(`SELECT status FROM public.pagamentos WHERE id='${a.r.pagamento_id}';`),'reembolsado');
    assert.equal(await sql(`SELECT estado FROM public.reservas WHERE id='${a.r.id}';`),'conciliacao');
  });
  await t.test('expiry without financial proof cannot become abandonment; proved closure can release',async () => {
    const a=await setup();
    await sql(`UPDATE public.reservas SET criada_em=now()-interval '2 hours',expira_em=now()-interval '1 hour' WHERE id='${a.r.id}';`);
    await reconcile({pagamento_id:a.r.pagamento_id,objeto_id:`CHEC_${a.r.pagamento_id}`,checkout_id:`CHEC_${a.r.pagamento_id}`,status:'EXPIRED'});
    assert.equal(await sql(`SELECT etapa_funil FROM public.inscricoes WHERE id='${a.id}';`),'revisao_necessaria');
    const b=await setup();
    await sql(`UPDATE public.reservas SET criada_em=now()-interval '2 hours',expira_em=now()-interval '1 hour' WHERE id='${b.r.id}';`);
    await reconcile({pagamento_id:b.r.pagamento_id,objeto_id:`CHEC_${b.r.pagamento_id}`,checkout_id:`CHEC_${b.r.pagamento_id}`,status:'EXPIRED',sem_cobranca_pagavel:true});
    assert.equal(await sql(`SELECT etapa_funil FROM public.inscricoes WHERE id='${b.id}';`),'checkout_abandonado');
    assert.equal(await sql(`SELECT estado FROM public.reservas WHERE id='${b.r.id}';`),'liberada');
  });
  await t.test('inactivity classifies only registrations without any checkout attempt, and worker claims are bounded',async () => {
    const {turma}=await createOffer(), id=await register(turma), a=await setup(turma);
    await sql(`UPDATE public.inscricoes SET ultima_atividade_em=now()-interval '2 days' WHERE id IN ('${id}','${a.id}');`);
    const jobs=JSON.parse(await sql(`SET ROLE service_role; SELECT public.preparar_conciliacao_cursos(24);`));
    assert.ok(jobs.length<=10);
    assert.equal(await sql(`SELECT etapa_funil FROM public.inscricoes WHERE id='${id}';`),'cadastro_sem_checkout');
    assert.equal(await sql(`SELECT etapa_funil FROM public.inscricoes WHERE id='${a.id}';`),'lead_capturado');
    for(const role of ['anon','authenticated']) {
      await assert.rejects(sql(`SET ROLE ${role}; SELECT public.preparar_conciliacao_cursos(24);`),/permission denied/);
      await assert.rejects(sql(`SET ROLE ${role}; SELECT public.conciliar_pagamento_curso('{}',NULL);`),/permission denied/);
    }
  });
}
