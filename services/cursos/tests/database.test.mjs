import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { test } from 'node:test';
import { registrationDatabaseTests } from './registration-database.mjs';
import { checkoutDatabaseTests } from './checkout-database.mjs';
import { reconciliationDatabaseTests } from './reconciliation-database.mjs';
import { confirmationDatabaseTests } from './confirmation-database.mjs';

const root = new URL('../', import.meta.url);
const image = 'postgres:17.6-bookworm';
const db = 'cursos_test_suite';
const containerName = `neuropsiedu-cursos-test-${randomUUID()}`;
let containerId;

function command(args, input = '', timeout = 120_000) {
  return new Promise((resolve, reject) => {
    const child = spawn('docker', args, { windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => child.kill(), timeout);
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('error', (error) => { clearTimeout(timer); reject(error); });
    child.stdin.on('error', () => { /* Process exit is reported below. */ });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (code !== 0) reject(new Error(`docker ${args[0]} failed (${code}): ${stderr || stdout}`));
      else resolve(stdout.trim());
    });
    child.stdin.end(input);
  });
}

function sql(query) {
  assert.match(containerId, /^[a-f0-9]{64}$/);
  return command(['exec', '-i', containerId, 'psql', '-X', '-qAt', '-v', 'ON_ERROR_STOP=1',
    '-U', 'postgres', '-d', db], query);
}

async function scalar(query) { return JSON.parse(await sql(query)); }
async function rejectsSql(query, message) { await assert.rejects(sql(query), message); }
function reserve(id, key = randomUUID()) {
  return sql(`SET ROLE service_role;
    SELECT to_jsonb(r) FROM public.reservar_vaga_curso('${id}', '${key}') r;`);
}

async function createOffer(capacity = 15) {
  const course = randomUUID();
  const turma = randomUUID();
  await sql(`INSERT INTO public.cursos(id,nome) VALUES ('${course}','Curso sintético');
    INSERT INTO public.turmas(id,curso_id,nome,preco,vagas_limite)
    VALUES ('${turma}','${course}','Turma sintética',600,${capacity});`);
  return { course, turma };
}

async function register(turma, { consent = true, stage = 'lead_capturado' } = {}) {
  const person = randomUUID();
  const id = randomUUID();
  await sql(`SET ROLE service_role;
    INSERT INTO public.participantes(id,nome,email) VALUES ('${person}','Pessoa sintética','${person}@example.test');
    INSERT INTO public.inscricoes(id,participante_id,turma_id,valor_cobrado,etapa_funil)
    VALUES ('${id}','${person}','${turma}',600,'${stage}');
    ${consent ? `INSERT INTO public.aceites_autorizacoes
      (inscricao_id,termo_versao,aceita_termos,aviso_privacidade_versao)
      VALUES ('${id}','teste-v1',true,'privacidade-teste-v1');` : ''}`);
  return id;
}

test('incremental courses schema on an isolated PostgreSQL 17', { timeout: 600_000 }, async (t) => {
  // No database URL is accepted; no ports, mounts or network are provided to the container.
  const contexts = JSON.parse(await command(['context', 'inspect']));
  const endpoint = contexts[0]?.Endpoints?.docker?.Host || '';
  assert.match(endpoint, /^(npipe:\/\/|unix:\/\/)/, 'Only a local Docker context is permitted');
  if (process.env.DOCKER_HOST) {
    assert.match(process.env.DOCKER_HOST, /^(npipe:\/\/|unix:\/\/)/, 'Only a local Docker host is permitted');
  }
  try {
    containerId = await command(['run', '--detach', '--rm', '--network', 'none',
      '--name', containerName, '--label', 'neuropsiedu.cursos-test=true',
      '-e', 'POSTGRES_HOST_AUTH_METHOD=trust', '-e', `POSTGRES_DB=${db}`, image]);
    assert.match(containerId, /^[a-f0-9]{64}$/);
    let ready = false;
    for (let attempt = 0; attempt < 30; attempt++) {
      try { await sql('SELECT 1;'); ready = true; break; }
      catch { await delay(500); }
    }
    assert.equal(ready, true, 'Disposable PostgreSQL did not become ready');
    await sql(`CREATE ROLE anon NOLOGIN; CREATE ROLE authenticated NOLOGIN;
      CREATE ROLE service_role NOLOGIN BYPASSRLS; GRANT USAGE ON SCHEMA public TO anon,authenticated,service_role;`);
    await sql(await readFile(new URL('baseline/schema.sql', root), 'utf8'));
    await sql(await readFile(new URL('tests/legacy-fixture.sql', root), 'utf8'));
    const snapshot = JSON.parse(await readFile(new URL('baseline/remote-schema.json', root), 'utf8'));
    const tables = [...new Set(snapshot.columns.map((c) => c.table_name))];
    const legacyQueries = tables.map((table) => {
      const names = snapshot.columns.filter((c) => c.table_name === table).map((c) => `"${c.column_name}"`).join(',');
      return `SELECT coalesce(jsonb_agg(to_jsonb(s) ORDER BY s.id),'[]') FROM (SELECT ${names} FROM public."${table}") s;`;
    });
    const before = await Promise.all(legacyQueries.map(scalar));
    const migrations = (await readdir(new URL('supabase/migrations/', root))).filter((f) => f.endsWith('.sql')).sort();
    assert.equal(migrations.length, 7);
    await t.test('preflight matches captured schema before any incremental migration', async () => {
      assert.equal(await sql(await readFile(new URL('baseline/preflight.sql', root), 'utf8')), '');
    });
    await t.test('incompatible legacy state aborts migration without partial schema changes', async () => {
      await sql(`UPDATE public.inscricoes SET etapa_funil='estado_legado_desconhecido'
        WHERE id='20000000-0000-4000-8000-000000000002';`);
      await rejectsSql(await readFile(new URL(`supabase/migrations/${migrations[0]}`, root), 'utf8'), /check constraint/);
      assert.equal(await scalar(`SELECT count(*) FROM information_schema.columns WHERE table_schema='public'
        AND table_name='inscricoes' AND column_name='revisao_legado';`), 0);
      await sql(`UPDATE public.inscricoes SET etapa_funil='lead_capturado'
        WHERE id='20000000-0000-4000-8000-000000000002';`);
    });
    for (const file of migrations) await sql(await readFile(new URL(`supabase/migrations/${file}`, root), 'utf8'));

    await t.test('preserves every legacy column, ID and relationship in all eight tables', async () => {
      assert.deepEqual(await Promise.all(legacyQueries.map(scalar)), before);
      assert.equal(await scalar('SELECT count(*) FROM public.inscricoes WHERE revisao_legado;'), 2);
      assert.equal(await scalar('SELECT count(*) FROM public.historico_inscricoes;'), 0);
      assert.equal(await scalar('SELECT count(*) FROM public.aceites_autorizacoes WHERE aceita_termos IS NOT NULL;'), 0);
    });
    await t.test('blocks public and authenticated table access and privileged RPC execution', async () => {
      for (const role of ['anon', 'authenticated']) {
        await rejectsSql(`SET ROLE ${role}; SELECT * FROM public.participantes;`, /permission denied/);
        await rejectsSql(`SET ROLE ${role}; SELECT public.reservar_vaga_curso(gen_random_uuid(),gen_random_uuid());`, /permission denied/);
      }
      assert.equal(await scalar(`SELECT count(*) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
        WHERE n.nspname='public' AND c.relkind='r' AND NOT c.relrowsecurity;`), 0);
      await rejectsSql('SET ROLE service_role; DELETE FROM public.historico_inscricoes;', /permission denied/);
    });
    await t.test('does not downgrade a confirmed legacy registration or silently reuse it', async () => {
      await rejectsSql(`UPDATE public.inscricoes SET etapa_funil='lead_capturado'
        WHERE id='20000000-0000-4000-8000-000000000001';`, /matricula_nao_pode_regredir/);
      await assert.rejects(reserve('20000000-0000-4000-8000-000000000002'), /inscricao_legada_requer_revisao/);
    });
    await t.test('saving a registration alone does not reserve capacity or create a payment', async () => {
      const { turma } = await createOffer();
      const id = await register(turma);
      assert.equal(await scalar(`SELECT count(*) FROM public.reservas WHERE inscricao_id='${id}';`), 0);
      assert.equal(await scalar(`SELECT count(*) FROM public.pagamentos WHERE inscricao_id='${id}';`), 0);
      assert.equal(await scalar(`SELECT count(*) FROM public.historico_inscricoes WHERE inscricao_id='${id}';`), 1);
    });
    await t.test('retains legacy uniqueness for email and participant/class', async () => {
      await rejectsSql(`INSERT INTO public.participantes(nome,email) VALUES ('Duplicado','legado1@example.test');`, /unique constraint/);
      await rejectsSql(`INSERT INTO public.inscricoes(participante_id,turma_id,valor_cobrado)
        VALUES ('10000000-0000-4000-8000-000000000001','b43bce5c-7764-42a1-b361-5134c7b0370a',600);`, /unique constraint/);
    });
    await t.test('reserves once on repeated idempotency key, with a 20 minute lifetime and price snapshot', async () => {
      const { turma } = await createOffer();
      const id = await register(turma);
      const key = randomUUID();
      const first = JSON.parse(await reserve(id, key));
      const second = JSON.parse(await reserve(id, key));
      assert.equal(first.id, second.id);
      assert.equal(new Date(first.expira_em) - new Date(first.criada_em), 20 * 60 * 1000);
      assert.equal(await scalar(`SELECT count(*) FROM public.pagamentos WHERE inscricao_id='${id}';`), 1);
      assert.equal(await scalar(`SELECT valor_centavos FROM public.pagamentos WHERE id='${first.pagamento_id}';`), 60000);
      assert.equal(await sql(`SELECT etapa_funil FROM public.inscricoes WHERE id='${id}';`), 'lead_capturado');
      await assert.rejects(reserve(id), /reserva_existente_requer_conciliacao/);
      const other = await register(turma);
      await assert.rejects(reserve(other, key), /idempotencia_outra_inscricao/);
    });
    await t.test('requires explicit consent and an active offer', async () => {
      const { turma } = await createOffer();
      const id = await register(turma, { consent: false });
      await assert.rejects(reserve(id), /aceite_obrigatorio/);
      const valid = await register(turma);
      await sql(`UPDATE public.turmas SET ativo=false WHERE id='${turma}';`);
      await assert.rejects(reserve(valid), /oferta_inativa/);
    });
    await t.test('16 concurrent buyers obtain at most 15 reservations', async () => {
      const { turma } = await createOffer(15);
      const ids = await Promise.all(Array.from({ length: 16 }, () => register(turma)));
      const results = await Promise.allSettled(ids.map((id) => reserve(id)));
      assert.equal(results.filter((r) => r.status === 'fulfilled').length, 15);
      const failures = results.filter((r) => r.status === 'rejected');
      assert.equal(failures.length, 1);
      assert.match(failures[0].reason.message, /vagas_esgotadas/);
      assert.equal(await scalar(`SELECT count(*) FROM public.reservas WHERE turma_id='${turma}';`), 15);
      assert.equal(await scalar(`SELECT count(*) FROM public.pagamentos p JOIN public.inscricoes i ON i.id=p.inscricao_id
        WHERE i.turma_id='${turma}';`), 15, 'Rejected attempt must not leave a payment');
    });
    await t.test('concurrent retries of the same registration create one payment', async () => {
      const { turma } = await createOffer();
      const id = await register(turma);
      const key = randomUUID();
      const results = await Promise.all(Array.from({ length: 5 }, () => reserve(id, key)));
      assert.equal(new Set(results.map((r) => JSON.parse(r).id)).size, 1);
    });
    await t.test('confirmed legacy capacity is counted even without financial evidence', async () => {
      const turma = 'b43bce5c-7764-42a1-b361-5134c7b0370a';
      await sql(`UPDATE public.turmas SET vagas_limite=1 WHERE id='${turma}';`);
      const id = await register(turma);
      await assert.rejects(reserve(id), /vagas_esgotadas/);
    });
    await t.test('legacy reservations with a future deadline also consume capacity', async () => {
      const turma = 'b43bce5c-7764-42a1-b361-5134c7b0370a';
      await sql(`UPDATE public.turmas SET vagas_limite=2 WHERE id='${turma}';
        UPDATE public.inscricoes SET reserva_expira_em=now()+interval '10 minutes'
        WHERE id='20000000-0000-4000-8000-000000000002';`);
      const id = await register(turma);
      await assert.rejects(reserve(id), /vagas_esgotadas/);
    });
    await t.test('does not free an expired unresolved attempt or mistake it for abandonment', async () => {
      const { turma } = await createOffer(1);
      const first = await register(turma);
      const reservation = JSON.parse(await reserve(first));
      await sql(`UPDATE public.reservas SET criada_em=now()-interval '40 minutes',
        expira_em=now()-interval '20 minutes' WHERE id='${reservation.id}';`);
      const second = await register(turma);
      await assert.rejects(reserve(second), /vagas_esgotadas/);
      await assert.rejects(reserve(first), /reserva_existente_requer_conciliacao/);
    });
    await t.test('keeps history when an abandoned registration starts a new reconciled attempt', async () => {
      const { turma } = await createOffer();
      const id = await register(turma);
      const first = JSON.parse(await reserve(id));
      // Simulate a trusted reconciliation outcome; the payment integration is a later phase.
      await sql(`BEGIN; SELECT id FROM public.turmas WHERE id='${turma}' FOR UPDATE;
        UPDATE public.reservas SET estado='liberada',finalizada_em=now(),motivo='teste_conciliado' WHERE id='${first.id}';
        UPDATE public.inscricoes SET etapa_funil='checkout_abandonado',motivo_etapa='teste_conciliado' WHERE id='${id}'; COMMIT;`);
      const next = JSON.parse(await reserve(id));
      assert.notEqual(first.id, next.id);
      assert.equal(await scalar(`SELECT count(*) FROM public.pagamentos WHERE inscricao_id='${id}';`), 2);
      assert.equal(await scalar(`SELECT count(*) FROM public.historico_inscricoes WHERE inscricao_id='${id}' AND etapa_nova='checkout_abandonado';`), 1);
    });
    await t.test('deduplicates events without blocking different states of the same order', async () => {
      await rejectsSql(`INSERT INTO public.eventos_pagamento(status_reportado) VALUES ('PAID');`, /check constraint/);
      await sql(`INSERT INTO public.eventos_pagamento(chave_deduplicacao,provedor_objeto_id,status_reportado,processamento)
        VALUES ('test-order-WAITING','ORDE_TEST','WAITING','aguardando_correlacao'),
        ('test-order-PAID','ORDE_TEST','PAID','aguardando_correlacao');`);
      await rejectsSql(`INSERT INTO public.eventos_pagamento(chave_deduplicacao,status_reportado)
        VALUES ('test-order-PAID','PAID');`, /unique constraint/);
      await rejectsSql(`UPDATE public.eventos_pagamento SET processamento='processado'
        WHERE chave_deduplicacao='test-order-PAID';`, /check constraint/);
    });
    await t.test('prevents reservations tied to another registration payment or class', async () => {
      const { turma } = await createOffer();
      const a = await register(turma);
      const b = await register(turma);
      await rejectsSql(`INSERT INTO public.pagamentos(inscricao_id) VALUES ('${a}');`, /check constraint/);
      const r = JSON.parse(await reserve(a));
      await rejectsSql(`UPDATE public.reservas SET inscricao_id='${b}' WHERE id='${r.id}';`, /foreign key constraint/);
      const other = await createOffer();
      await rejectsSql(`UPDATE public.reservas SET turma_id='${other.turma}' WHERE id='${r.id}';`, /foreign key constraint/);
    });
    await registrationDatabaseTests(t, { sql, scalar, createOffer });
    await checkoutDatabaseTests(t, { sql, scalar, createOffer, register });
    await reconciliationDatabaseTests(t, { sql, scalar, createOffer, register });
    await confirmationDatabaseTests(t, { sql, scalar, createOffer, register });
  } finally {
    if (containerId && /^[a-f0-9]{64}$/.test(containerId)) {
      const label = await command(['inspect', '--format', '{{index .Config.Labels "neuropsiedu.cursos-test"}}', containerId]);
      assert.equal(label, 'true', 'Refuse to clean up an unrelated container');
      await command(['rm', '--force', containerId]);
    }
  }
});
