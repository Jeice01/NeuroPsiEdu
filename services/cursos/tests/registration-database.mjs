import assert from 'node:assert/strict';
import { randomBytes, randomUUID } from 'node:crypto';
import { ApiError, createHandler, sha256 } from '../supabase/functions/cadastro-curso/handler.ts';

const capability = () => randomBytes(32).toString('hex');
const config = { origins: ['https://example.test'], termsVersion: 'test-v1',
  privacyVersion: 'privacy-test-v1', rateSecret: 'synthetic-rate-key-for-local-tests-only' };
const quote = (value) => typeof value === 'boolean' ? String(value) : `'${String(value).replaceAll("'", "''")}'`;
const signatures = {
  limitar_cadastro_curso: ['p_chave', 'p_consulta'],
  consultar_cadastro_curso: ['p_token_hash'],
  recuperar_cadastro_curso: ['p_email', 'p_turma_id', 'p_token_hash'],
  cadastrar_inscricao_curso: ['p_turma_id', 'p_nome', 'p_email', 'p_telefone', 'p_aceita_termos',
    'p_aceita_imagem', 'p_aceita_marketing', 'p_termo_versao', 'p_privacidade_versao', 'p_token_hash', 'p_requisicao_hash'],
};

export async function registrationDatabaseTests(t, { sql, scalar, createOffer }) {
  // Same HTTP handler as production; only transport and external CAPTCHA are substituted.
  const rpc = async (name, params) => {
    assert.ok(Object.hasOwn(signatures, name));
    const args = signatures[name].map((key) => quote(params[key])).join(',');
    try {
      const expression = `public.${name}(${args})`;
      const output = await sql(`SET ROLE service_role; SELECT ${['cadastrar_inscricao_curso', 'recuperar_cadastro_curso'].includes(name) ? expression : `to_jsonb(${expression})`};`);
      return output ? JSON.parse(output) : null;
    } catch (error) {
      if (/reenvio_divergente/.test(error.message)) throw new ApiError(409, 'reenvio_divergente');
      if (/oferta_indisponivel/.test(error.message)) throw new ApiError(409, 'oferta_indisponivel');
      throw error;
    }
  };
  const handler = createHandler(config, { rpc, verifyChallenge: async () => true,
    recovery: { requestCode: async () => {}, verifyCode: async (email, code) => {
      if (code !== '123456') throw new ApiError(401, 'codigo_invalido');
      return email;
    } } });
  const data = (turma, email = `${randomUUID()}@example.test`) => ({ turma_id: turma,
    nome: 'Pessoa de Teste', email, telefone: '+5561999990000', aceita_termos: true,
    aceita_imagem: false, aceita_marketing: false, termo_versao: config.termsVersion,
    aviso_privacidade_versao: config.privacyVersion, turnstile_token: 'synthetic-local-test' });
  const send = (body, token, method = 'POST') => handler(new Request('https://example.test/cadastro-curso', {
    method, headers: { origin: config.origins[0], 'content-type': 'application/json', 'x-registration-token': token },
    ...(method === 'POST' ? { body: JSON.stringify(body) } : {}),
  }));
  const get = (token) => send(null, token, 'GET');
  const idFor = (email) => sql(`SELECT i.id FROM public.inscricoes i JOIN public.participantes p ON p.id=i.participante_id WHERE p.email=${quote(email)};`);

  await t.test('HTTP registration atomically saves normalized identity, consents and price without reserving', async () => {
    const { turma } = await createOffer();
    const body = data(turma);
    const token = capability();
    assert.equal((await send({ ...body, email: ` ${body.email.toUpperCase()} ` }, token)).status, 202);
    const id = await idFor(body.email);
    assert.match(id, /^[a-f0-9-]{36}$/);
    assert.equal(await scalar(`SELECT valor_cobrado FROM public.inscricoes WHERE id='${id}';`), 600);
    assert.deepEqual(await scalar(`SELECT jsonb_build_array(aceita_termos,aceita_imagem,aceita_marketing)
      FROM public.aceites_autorizacoes WHERE inscricao_id='${id}';`), [true, false, false]);
    assert.equal(await scalar(`SELECT count(*) FROM public.pagamentos WHERE inscricao_id='${id}';`), 0);
    assert.equal(await scalar(`SELECT count(*) FROM public.reservas WHERE inscricao_id='${id}';`), 0);
    const status = await get(token);
    assert.equal(status.status, 200);
    assert.equal((await status.json()).etapa_funil, 'lead_capturado');
    assert.equal(await sql(`SELECT token_hash FROM public.sessoes_cadastro WHERE inscricao_id='${id}';`), await sha256(token));
  });
  await t.test('concurrent exact HTTP retries save one participant, consent, history and session', async () => {
    const { turma } = await createOffer();
    const body = data(turma), token = capability();
    const results = await Promise.all(Array.from({ length: 4 }, () => send(body, token)));
    assert.ok(results.every((result) => result.status === 202));
    const id = await idFor(body.email);
    for (const table of ['aceites_autorizacoes', 'historico_inscricoes', 'sessoes_cadastro']) {
      assert.equal(await scalar(`SELECT count(*) FROM public.${table} WHERE inscricao_id='${id}';`), 1);
    }
    assert.equal((await send({ ...body, nome: 'Dados divergentes' }, token)).status, 409);
  });
  await t.test('different capabilities racing for one email cannot acquire the same registration', async () => {
    const { turma } = await createOffer();
    const body = data(turma), tokens = [capability(), capability()];
    const results = await Promise.all(tokens.map((token) => send(body, token)));
    assert.ok(results.every((result) => result.status === 202));
    const statuses = await Promise.all(tokens.map(async (token) => (await get(token)).status));
    assert.deepEqual(statuses.sort(), [200, 404]);
    assert.equal(await scalar(`SELECT count(*) FROM public.participantes WHERE email=${quote(body.email)};`), 1);
  });
  await t.test('email knowledge and case variants cannot change or access legacy data', async () => {
    const body = data('b43bce5c-7764-42a1-b361-5134c7b0370a', ' LEGADO1@EXAMPLE.TEST ');
    const token = capability();
    const before = await sql(`SELECT to_jsonb(p) FROM public.participantes p WHERE email='legado1@example.test';`);
    assert.equal((await send(body, token)).status, 202);
    assert.equal((await get(token)).status, 404);
    assert.equal(await sql(`SELECT to_jsonb(p) FROM public.participantes p WHERE email='legado1@example.test';`), before);
    assert.equal(await sql(`SELECT etapa_funil FROM public.inscricoes WHERE id='20000000-0000-4000-8000-000000000001';`), 'matricula_confirmada');
  });
  await t.test('replay never downgrades a confirmed registration and expired capability cannot read it', async () => {
    const { turma } = await createOffer();
    const body = data(turma), token = capability();
    await send(body, token);
    const id = await idFor(body.email);
    await sql(`UPDATE public.inscricoes SET etapa_funil='matricula_confirmada' WHERE id='${id}';`);
    assert.equal((await send(body, token)).status, 202);
    assert.equal((await (await get(token)).json()).etapa_funil, 'matricula_confirmada');
    await sql(`UPDATE public.sessoes_cadastro SET criada_em=now()-interval '2 days',expira_em=now()-interval '1 day' WHERE inscricao_id='${id}';`);
    assert.equal((await get(token)).status, 404);
    await send(body, token);
    assert.equal((await get(token)).status, 404, 'Replay must not renew authorization');
  });
  await t.test('failure writing consent rolls back participant, registration, history and capability', async () => {
    const { turma } = await createOffer();
    const body = data(turma), token = capability();
    await sql(`CREATE FUNCTION public.fail_test_consent() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic failure'; END $$;
      CREATE TRIGGER fail_test_consent BEFORE INSERT ON public.aceites_autorizacoes FOR EACH ROW EXECUTE FUNCTION public.fail_test_consent();`);
    try {
      assert.equal((await send(body, token)).status, 503);
      assert.equal(await scalar(`SELECT count(*) FROM public.participantes WHERE email=${quote(body.email)};`), 0);
      assert.equal(await scalar(`SELECT count(*) FROM public.inscricoes WHERE turma_id='${turma}';`), 0);
      assert.equal((await get(token)).status, 404);
    } finally { await sql('DROP TRIGGER fail_test_consent ON public.aceites_autorizacoes; DROP FUNCTION public.fail_test_consent();'); }
  });
  await t.test('shared database rate limits hold under concurrent requests and expire', async () => {
    const key = capability();
    const results = await Promise.all(Array.from({ length: 8 }, () => rpc('limitar_cadastro_curso', { p_chave: key, p_consulta: false })));
    assert.equal(results.filter(Boolean).length, 5);
    await sql(`UPDATE public.limites_cadastro SET inicio=now()-interval '16 minutes' WHERE chave='cadastro:${key}';`);
    assert.equal(await rpc('limitar_cadastro_curso', { p_chave: key, p_consulta: false }), true);
  });
  await t.test('new RPCs and hashed capabilities are inaccessible to public roles', async () => {
    for (const role of ['anon', 'authenticated']) {
      for (const query of ['SELECT * FROM public.sessoes_cadastro;', 'SELECT * FROM public.limites_cadastro;',
        "SELECT public.consultar_cadastro_curso('missing');", `SELECT public.limitar_cadastro_curso('${capability()}',false);`,
        'SELECT public.cadastrar_inscricao_curso(NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL);']) {
        await assert.rejects(sql(`SET ROLE ${role}; ${query}`), /permission denied/);
      }
    }
  });
  await t.test('inactive offer rejects new registrations without partial identity', async () => {
    const { turma } = await createOffer();
    const body = data(turma);
    await sql(`UPDATE public.turmas SET ativo=false WHERE id='${turma}';`);
    assert.equal((await send(body, capability())).status, 409);
    assert.equal(await scalar(`SELECT count(*) FROM public.participantes WHERE email=${quote(body.email)};`), 0);
    assert.equal((await send({ ...body, email: 'legado1@example.test' }, capability())).status, 409,
      'Inactive offers must behave the same for known and unknown identities');
  });
  await t.test('verified recovery rotates authorization without changing registration, price or stage', async () => {
    const { turma } = await createOffer();
    const body = data(turma), oldToken = capability(), newToken = capability();
    await send(body, oldToken);
    const id = await idFor(body.email);
    const before = await sql(`SELECT to_jsonb(i) FROM public.inscricoes i WHERE id='${id}';`);
    const recovery = { action: 'validar_codigo', email: body.email, turma_id: turma,
      codigo: '000000', turnstile_token: 'synthetic' };
    assert.equal((await send(recovery, newToken)).status, 401);
    assert.equal((await get(oldToken)).status, 200);
    assert.equal((await get(newToken)).status, 404);
    assert.equal((await send({ ...recovery, codigo: '123456' }, newToken)).status, 202);
    assert.equal((await get(newToken)).status, 200);
    assert.equal((await get(oldToken)).status, 404);
    assert.equal(await sql(`SELECT to_jsonb(i) FROM public.inscricoes i WHERE id='${id}';`), before);
    for (const role of ['anon', 'authenticated']) {
      await assert.rejects(sql(`SET ROLE ${role}; SELECT public.recuperar_cadastro_curso(NULL,NULL,NULL);`), /permission denied/);
    }
  });
  await t.test('recovery refuses ambiguous legacy emails and never creates a missing registration', async () => {
    const { turma } = await createOffer();
    const unknown = capability();
    await rpc('recuperar_cadastro_curso', { p_email: 'missing@example.test', p_turma_id: turma, p_token_hash: await sha256(unknown) });
    assert.equal((await get(unknown)).status, 404);
    const body = data(turma), firstToken = capability(), newToken = capability();
    await send(body, firstToken);
    await sql(`INSERT INTO public.participantes(nome,email) VALUES ('Colisão sintética',${quote(body.email.toUpperCase())});`);
    await rpc('recuperar_cadastro_curso', { p_email: body.email, p_turma_id: turma, p_token_hash: await sha256(newToken) });
    assert.equal((await get(newToken)).status, 404);
    assert.equal((await get(firstToken)).status, 200);
  });
  await t.test('recovered legacy registration remains under review without changing its historical stage', async () => {
    const token = capability();
    await rpc('recuperar_cadastro_curso', { p_email: 'legado1@example.test',
      p_turma_id: 'b43bce5c-7764-42a1-b361-5134c7b0370a', p_token_hash: await sha256(token) });
    assert.equal((await (await get(token)).json()).etapa_funil, 'revisao_necessaria');
    assert.equal(await sql("SELECT etapa_funil FROM public.inscricoes WHERE id='20000000-0000-4000-8000-000000000001';"), 'matricula_confirmada');
  });
}
