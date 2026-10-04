import nodemailer from 'npm:nodemailer@10.0.14';
import { createRpc } from '../cadastro-curso/adapters.ts';
import { createConfirmationWorker } from './handler.ts';

function required(name: string) {
  const value = Deno.env.get(name)?.trim();
  if (!value) throw new Error(`Configuracao ausente: ${name}`);
  return value;
}

const user = required('CURSOS_SMTP_USER');
// Homologation uses the existing Gmail account with implicit TLS; never permit arbitrary relay hosts.
if (
  required('CURSOS_SMTP_HOST') !== 'smtp.gmail.com' || required('CURSOS_SMTP_PORT') !== '465' ||
  user !== required('CURSOS_SANDBOX_TEST_EMAIL') || user !== required('CURSOS_SMTP_ADMIN_EMAIL')
) {
  throw new Error('configuracao_smtp_invalida');
}
const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: { user, pass: required('CURSOS_SMTP_PASS') },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
  logger: false,
  debug: false,
  disableFileAccess: true,
  disableUrlAccess: true,
});
Deno.serve(createConfirmationWorker(
  required('CURSOS_CONFIRMATION_SECRET'),
  { turmaId: required('CURSOS_SANDBOX_TURMA_ID'), email: required('CURSOS_SANDBOX_TEST_EMAIL') },
  createRpc(required('SUPABASE_URL'), required('SUPABASE_SERVICE_ROLE_KEY')),
  async (message) => {
    const result = await transport.sendMail({
      ...message,
      from: { name: 'NeuroPsiEdu — Sandbox', address: user },
    });
    if (
      !Array.isArray(result.accepted) || result.accepted.length !== 1 || result.accepted[0] !== message.to ||
      !Array.isArray(result.rejected) || result.rejected.length
    ) throw new Error('smtp_nao_aceitou');
  },
));
