import assert from 'node:assert/strict';

export async function interestDatabaseTests(t, { sql, scalar, createOffer, register, reserve }) {
  const { turma } = await createOffer();
  const capture = (email, group = false, name = 'Pessoa Sintética') => sql(`SET ROLE service_role;
    SELECT public.salvar_interesse_curso('${turma}','${name}','${email}','+5561999990000',
    'estudante','Aplicação',true,${group},'interesse-zulliger-20261005');`);
  await t.test('interest is private, deduplicated and does not create enrollment or consume capacity', async () => {
    const before = await scalar('SELECT count(*) FROM public.inscricoes;');
    await capture('interest@example.test');
    await capture('interest@example.test', true, 'Nome alterado');
    assert.equal(await scalar(`SELECT count(*) FROM public.interesses_curso WHERE turma_id='${turma}';`), 1);
    assert.equal(await scalar(`SELECT to_json(aceita_grupo) FROM public.interesses_curso WHERE turma_id='${turma}';`), false);
    assert.equal(await scalar(`SELECT to_json(nome) FROM public.interesses_curso WHERE turma_id='${turma}';`), 'Pessoa Sintética');
    assert.equal(await scalar('SELECT count(*) FROM public.inscricoes;'), before);
    for (const role of ['anon', 'authenticated']) {
      await assert.rejects(sql(`SET ROLE ${role}; SELECT * FROM public.interesses_curso;`), /permission denied/);
      await assert.rejects(sql(`SET ROLE ${role}; SELECT * FROM public.lista_interesses_curso;`), /permission denied/);
      await assert.rejects(sql(`SET ROLE ${role}; SELECT public.salvar_interesse_curso('${turma}',
        'Pessoa','denied@example.test','+5561999990000','estudante','',true,false,'v1');`), /permission denied/);
    }
    await assert.rejects(sql(`SET ROLE service_role; SELECT public.salvar_interesse_curso('${turma}',
      'Pessoa','invalid@example.test','+5561999990000','estudante','',false,false,'v1');`), /check constraint/);
  });
  await t.test('export confirms only paid registrations with confirmed reservation in the same cohort', async () => {
    const id = await register(turma);
    const reservation = JSON.parse(await reserve(id));
    const email = await scalar(`SELECT to_json(p.email) FROM public.participantes p JOIN public.inscricoes i
      ON i.participante_id=p.id WHERE i.id='${id}';`);
    await capture(email);
    const confirmed = () => scalar(`SET ROLE service_role; SELECT to_json(matricula_confirmada)
      FROM public.lista_interesses_curso WHERE turma_id='${turma}' AND email='${email}';`);
    assert.equal(await confirmed(), false);
    await sql(`UPDATE public.pagamentos SET status='pago' WHERE id='${reservation.pagamento_id}';`);
    assert.equal(await confirmed(), false);
    await sql(`UPDATE public.reservas SET estado='confirmada',finalizada_em=clock_timestamp(),motivo='fixture_pago' WHERE id='${reservation.id}';
      UPDATE public.inscricoes SET etapa_funil='matricula_confirmada' WHERE id='${id}';`);
    assert.equal(await confirmed(), true);
    const other = await createOffer();
    await sql(`SET ROLE service_role; SELECT public.salvar_interesse_curso('${other.turma}',
      'Pessoa','${email}','+5561999990000','estudante','',true,false,'v1');`);
    assert.equal(await scalar(`SELECT to_json(matricula_confirmada) FROM public.lista_interesses_curso
      WHERE turma_id='${other.turma}' AND email='${email}';`), false);
    await sql(`UPDATE public.inscricoes SET etapa_funil='reembolsada' WHERE id='${id}';`);
    assert.equal(await confirmed(), false);
  });
}
