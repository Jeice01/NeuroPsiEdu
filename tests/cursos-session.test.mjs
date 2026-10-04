import assert from 'node:assert/strict';
import test from 'node:test';
import { continuationToken, existingContinuation, clearContinuation, checkoutAttemptKey } from '../src/lib/cursos/client.ts';
import { registrationConfig } from '../src/lib/cursos/config.ts';

test('Sandbox sessions and checkout retries cannot replace the real course session', () => {
  const previous = globalThis.sessionStorage;
  const store = new Map();
  globalThis.sessionStorage = { getItem: key => store.get(key), setItem: (key, value) => store.set(key, value), removeItem: key => store.delete(key) };
  try {
    const real = continuationToken(), sandbox = continuationToken('test-cohort');
    const realCheckout = checkoutAttemptKey(), sandboxCheckout = checkoutAttemptKey('test-cohort');
    assert.notEqual(real, sandbox);
    assert.notEqual(realCheckout, sandboxCheckout);
    assert.equal(existingContinuation('test-cohort'), sandbox);
    clearContinuation('test-cohort');
    assert.equal(existingContinuation('test-cohort'), null);
    assert.equal(existingContinuation(), real);
    assert.equal(checkoutAttemptKey(), realCheckout);
  } finally { if (previous === undefined) delete globalThis.sessionStorage; else globalThis.sessionStorage = previous; }
});

test('Sandbox configuration rejects real cohorts, malformed cohorts and untrusted document links', () => {
  const values = {
    NEXT_PUBLIC_CURSOS_ENABLED: 'false', NEXT_PUBLIC_CURSOS_SANDBOX_ENABLED: 'true',
    NEXT_PUBLIC_CURSOS_SANDBOX_TURMA_ID: '1349d08b-4fc6-4b1f-a485-2e691f716ab2',
    NEXT_PUBLIC_CURSOS_FUNCTION_URL: 'https://ydmvbssgiffqrmwigkae.supabase.co/functions/v1/cadastro-curso',
    NEXT_PUBLIC_CURSOS_TURNSTILE_SITE_KEY: 'synthetic', NEXT_PUBLIC_CURSOS_TERMS_VERSION: 'sandbox-test',
    NEXT_PUBLIC_CURSOS_PRIVACY_VERSION: 'sandbox-test', NEXT_PUBLIC_CURSOS_RECOVERY_ENABLED: 'true',
    NEXT_PUBLIC_CURSOS_TERMS_URL: 'https://neuropsiedu.com.br/curso-zulliger/teste/condicoes/#termos',
    NEXT_PUBLIC_CURSOS_PRIVACY_URL: 'https://neuropsiedu.com.br/curso-zulliger/teste/condicoes/#privacidade',
  };
  const previous = Object.fromEntries(Object.keys(values).map(key => [key, process.env[key]]));
  try {
    Object.assign(process.env, values);
    assert.equal(registrationConfig(), null);
    const config = registrationConfig(true);
    assert.equal(config.sandbox, true);
    assert.equal(config.registrationPath, '/curso-zulliger/teste/');
    assert.match(config.checkoutEndpoint, /checkout-curso$/);
    for (const cohort of ['invalid', 'B43BCE5C-7764-42A1-B361-5134C7B0370A']) {
      process.env.NEXT_PUBLIC_CURSOS_SANDBOX_TURMA_ID = cohort;
      assert.equal(registrationConfig(true), null);
    }
    process.env.NEXT_PUBLIC_CURSOS_SANDBOX_TURMA_ID = values.NEXT_PUBLIC_CURSOS_SANDBOX_TURMA_ID;
    process.env.NEXT_PUBLIC_CURSOS_TERMS_URL = 'https://userinfo@neuropsiedu.com.br/';
    assert.equal(registrationConfig(true), null);
  } finally { for (const [key, value] of Object.entries(previous)) { if (value === undefined) delete process.env[key]; else process.env[key] = value; } }
});
