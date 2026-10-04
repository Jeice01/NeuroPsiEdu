import { type Rpc, sha256 } from '../cadastro-curso/handler.ts';
import { object } from '../checkout-curso/pagbank.ts';

export type Confirmation = { id: string; envio_token: string; email: string; curso: string; turma: string };
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const emailPattern = /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/;

export function confirmationMessage(job: Confirmation) {
  return {
    to: job.email,
    messageId: `<sandbox-confirmacao-${job.id}@neuropsiedu.com.br>`,
    subject: '[TESTE SANDBOX] Pagamento de teste confirmado — NeuroPsiEdu',
    text: `Pagamento de teste confirmado.\n\nCurso: ${job.curso}\nTurma: ${job.turma}\n\n` +
      'Este e-mail faz parte da homologação da NeuroPsiEdu. Nenhuma cobrança real, matrícula real, ' +
      'reserva no curso real ou certificado foi gerado.\n\n' +
      'Você pode consultar o resultado em https://neuropsiedu.com.br/curso-zulliger/teste/resultado/\n' +
      'Use a recuperação de acesso caso precise acessar novamente.\n\nEquipe NeuroPsiEdu',
  };
}

export function createConfirmationWorker(
  secret: string,
  sandbox: { turmaId: string; email: string },
  rpc: Rpc,
  send: (message: ReturnType<typeof confirmationMessage>) => Promise<void>,
) {
  if (
    secret.length < 32 || !uuid.test(sandbox.turmaId) || !emailPattern.test(sandbox.email) ||
    sandbox.email !== sandbox.email.trim().toLowerCase() || sandbox.email.length > 254
  ) {
    throw new Error('configuracao_invalida');
  }
  return async (request: Request) => {
    const headers = { 'Cache-Control': 'no-store' };
    if (request.method !== 'POST') return new Response(null, { status: 405, headers });
    const authorization = request.headers.get('authorization') || '';
    if (authorization.length > 1024 || await sha256(authorization) !== await sha256(`Bearer ${secret}`)) {
      return new Response(null, { status: 401, headers });
    }
    let accepted = 0;
    try {
      // One claim at a time bounds runtime and prevents an idle claimed batch from expiring.
      for (let index = 0; index < 3; index++) {
        const rows = await rpc('preparar_confirmacao_sandbox', {
          p_turma_id: sandbox.turmaId,
          p_email: sandbox.email,
        });
        if (!Array.isArray(rows) || rows.length > 1) throw new Error('fila_invalida');
        if (!rows.length) break;
        const value: unknown = rows[0];
        if (
          !object(value) || typeof value.id !== 'string' || !uuid.test(value.id) ||
          typeof value.envio_token !== 'string' || !uuid.test(value.envio_token) ||
          value.email !== sandbox.email || typeof value.curso !== 'string' ||
          typeof value.turma !== 'string' || value.curso.length > 500 || value.turma.length > 500
        ) {
          throw new Error('confirmacao_invalida');
        }
        const job: Confirmation = {
          id: value.id,
          envio_token: value.envio_token,
          email: sandbox.email,
          curso: value.curso,
          turma: value.turma,
        };
        try {
          await send(confirmationMessage(job));
        } catch {
          // SMTP errors can occur after delivery. Never automatically resend an uncertain message.
          await rpc('finalizar_confirmacao_sandbox', {
            p_id: job.id,
            p_token: job.envio_token,
            p_resultado: 'revisao',
          });
          throw new Error('envio_incerto');
        }
        if (
          await rpc('finalizar_confirmacao_sandbox', {
            p_id: job.id,
            p_token: job.envio_token,
            p_resultado: 'enviado',
          }) !== true
        ) throw new Error('confirmacao_nao_registrada');
        accepted++;
      }
      return Response.json({ aceitos_smtp: accepted }, { headers });
    } catch {
      return Response.json({ error: 'envio_confirmacao_indisponivel', aceitos_smtp: accepted }, {
        status: 503,
        headers,
      });
    }
  };
}
