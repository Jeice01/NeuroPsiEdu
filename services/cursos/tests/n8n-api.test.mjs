import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { test } from 'node:test';

const root = new URL('../', import.meta.url);
function command(args, input = '') {
  return new Promise((resolve, reject) => {
    const child = spawn('docker', args, { windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] });
    let output = ''; let errors = '';
    const timer = setTimeout(() => child.kill(), 120000);
    child.stdout.on('data', (v) => { output += v; });
    child.stderr.on('data', (v) => { errors += v; });
    child.on('error', (error) => { clearTimeout(timer); reject(error); });
    child.stdin.on('error', () => {});
    child.on('close', (code) => {
      clearTimeout(timer);
      if (code !== 0) reject(new Error(errors || output)); else resolve(output.trim());
    });
    child.stdin.end(input);
  });
}

test('n8n native API authorizes only approved identities and never permits writes', { timeout: 180000 }, async (t) => {
  const container = await command(['run', '--detach', '--rm', '--label', 'neuropsiedu.n8n-test=true',
    '-e', 'POSTGRES_HOST_AUTH_METHOD=trust', '-e', 'POSTGRES_DB=cursos_test_n8n', 'postgres:17.6-bookworm']);
  assert.match(container, /^[a-f0-9]{64}$/);
  const sql = (query) => command(['exec', '-i', container, 'psql', '-X', '-qAt', '-v', 'ON_ERROR_STOP=1',
    '-U', 'postgres', '-d', 'cursos_test_n8n'], query);
  try {
    let ready = false;
    for (let i = 0; i < 30; i++) { try { await sql('SELECT 1;'); ready = true; break; } catch { await delay(500); } }
    assert.equal(ready, true);
    await sql(`CREATE ROLE anon NOLOGIN; CREATE ROLE authenticated NOLOGIN;
      CREATE ROLE service_role NOLOGIN BYPASSRLS;
      GRANT USAGE ON SCHEMA public TO anon,authenticated,service_role;
      CREATE SCHEMA auth; CREATE TABLE auth.users(id uuid PRIMARY KEY);
      CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$
        SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
      GRANT USAGE ON SCHEMA auth TO authenticated;
      CREATE FUNCTION public.rls_auto_enable() RETURNS event_trigger LANGUAGE plpgsql AS $$ BEGIN NULL; END $$;`);
    const migrations = (await readdir(new URL('supabase/migrations/', root))).filter((f) => f.endsWith('.sql')).sort();
    const sources = await Promise.all(migrations.map((f) => readFile(new URL(`supabase/migrations/${f}`, root), 'utf8')));
    await sql(await readFile(new URL('baseline/schema.sql', root), 'utf8') + '\n' +
      await readFile(new URL('tests/legacy-fixture.sql', root), 'utf8') + '\n' + sources.join('\n'));
    const user = randomUUID(); const other = randomUUID();
    await sql(`INSERT INTO auth.users VALUES('${user}'),('${other}');
      INSERT INTO automacao_privada.permissoes(usuario_id,recurso) VALUES('${user}','interesses_curso');
      SET ROLE service_role;
      SELECT public.salvar_interesse_curso('b43bce5c-7764-42a1-b361-5134c7b0370a',
      'Pessoa fictícia','n8n@example.test','+5561999990000','estudante','Pergunta',true,false,'v1');`);
    const identity = (id) => `SET ROLE authenticated; SET request.jwt.claim.sub='${id}';`;
    await t.test('anonymous and ordinary authenticated users cannot read exports', async () => {
      await assert.rejects(sql('SET ROLE anon; SELECT * FROM public.automacao_interesses_curso;'), /permission denied/);
      await assert.rejects(sql(identity(other) + 'SELECT * FROM public.automacao_interesses_curso;'), /automacao_nao_autorizada/);
      await assert.rejects(sql("SET ROLE authenticated; SET request.jwt.claim.sub=''; SELECT * FROM public.automacao_interesses_curso;"), /automacao_nao_autorizada/);
    });
    await t.test('approved identity reads all export fields and can filter', async () => {
      const row = JSON.parse(await sql(identity(user) + 'SELECT row_to_json(x) FROM public.automacao_interesses_curso x;'));
      assert.equal(row.email, 'n8n@example.test'); assert.equal(row.matricula_confirmada, false);
      assert.equal(Object.keys(row).length, 14);
      assert.equal(await sql(identity(user) + "SELECT nome FROM public.automacao_interesses_curso WHERE perfil='estudante' ORDER BY numero LIMIT 100;"), 'Pessoa fictícia');
    });
    await t.test('no raw table access, writes, permission changes or financial operations', async () => {
      for (const query of ['SELECT * FROM public.interesses_curso;', 'SELECT * FROM public.pagamentos;',
        'SELECT * FROM automacao_privada.permissoes;', 'DELETE FROM public.automacao_interesses_curso;',
        "UPDATE public.automacao_interesses_curso SET nome='alterado';",
        'UPDATE automacao_privada.permissoes SET ativo=true;']) {
        await assert.rejects(sql(identity(user) + query), /permission denied|cannot (update|delete from) view/);
      }
    });
    await t.test('revocation immediately denies an existing identity', async () => {
      await sql(`UPDATE automacao_privada.permissoes SET ativo=false WHERE usuario_id='${user}';`);
      await assert.rejects(sql(identity(user) + 'SELECT * FROM public.automacao_interesses_curso;'), /automacao_nao_autorizada/);
    });
  } finally {
    assert.equal(await command(['inspect', '--format', '{{index .Config.Labels "neuropsiedu.n8n-test"}}', container]), 'true');
    await command(['rm', '-f', container]);
  }
});
