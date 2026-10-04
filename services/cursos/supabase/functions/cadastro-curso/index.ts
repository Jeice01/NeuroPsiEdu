import { createHandler } from './handler.ts';
import { createChallengeVerifier, createRpc } from './adapters.ts';
import { createRecovery } from './recovery.ts';

const required = (name: string): string => {
  const value = Deno.env.get(name)?.trim();
  if (!value) throw new Error(`Configuracao obrigatoria ausente: ${name}`);
  return value;
};

Deno.serve(createHandler({
  origins: required('CURSOS_ALLOWED_ORIGINS').split(',').map((origin) => origin.trim()),
  termsVersion: required('CURSOS_TERMS_VERSION'),
  privacyVersion: required('CURSOS_PRIVACY_VERSION'),
  rateSecret: required('CURSOS_RATE_SECRET'),
  sandbox: Deno.env.get('CURSOS_SANDBOX_TURMA_ID') || Deno.env.get('CURSOS_SANDBOX_TEST_EMAIL')
    ? { turmaId: required('CURSOS_SANDBOX_TURMA_ID'), email: required('CURSOS_SANDBOX_TEST_EMAIL') }
    : undefined,
}, {
  rpc: createRpc(required('SUPABASE_URL'), required('SUPABASE_SERVICE_ROLE_KEY')),
  verifyChallenge: createChallengeVerifier(required('CURSOS_TURNSTILE_SECRET')),
  recovery: Deno.env.get('CURSOS_RECOVERY_ENABLED') === 'true'
    ? createRecovery(required('SUPABASE_URL'), required('SUPABASE_ANON_KEY'))
    : undefined,
}));
