import { type Rpc, sha256 } from '../cadastro-curso/handler.ts';
import { object } from '../checkout-curso/pagbank.ts';
import { persistObservation } from '../pagbank-webhook/handler.ts';
import { type Observation } from '../pagbank-webhook/provider.ts';

export function createReconciler(
  secret: string,
  rpc: Rpc,
  observe: (id: string, reference?: string) => Promise<Observation>,
  inactivityHours = 24,
) {
  if (
    secret.length < 32 || !Number.isInteger(inactivityHours) || inactivityHours < 1 || inactivityHours > 720
  ) throw new Error('configuracao_invalida');
  return async (request: Request) => {
    const headers = { 'Cache-Control': 'no-store' };
    if (request.method !== 'POST') return new Response(null, { status: 405, headers });
    const authorization = request.headers.get('authorization') || '';
    if (authorization.length > 1024 || await sha256(authorization) !== await sha256(`Bearer ${secret}`)) {
      return new Response(null, { status: 401, headers });
    }
    try {
      const jobs = await rpc('preparar_conciliacao_cursos', { p_inatividade_horas: inactivityHours });
      if (!Array.isArray(jobs) || jobs.length > 10) throw new Error('jobs_invalidos');
      let processed = 0, failures = 0;
      for (const job of jobs) {
        try {
          if (!object(job) || typeof job.id !== 'string') throw new Error('job_invalido');
          const id = job.pagbank_pedido_id || job.pagbank_checkout_id;
          if (typeof id === 'string') {
            await persistObservation(rpc, await observe(id, job.id));
            processed++;
          } else if (
            typeof job.envio_iniciado_em === 'string' &&
            Date.parse(job.envio_iniciado_em) < Date.now() - 1200000
          ) {
            await persistObservation(rpc, { pagamento_id: job.id, objeto_id: job.id, status: 'REVIEW' });
            processed++;
          }
        } catch {
          failures++;
        }
      }
      return Response.json({ processados: processed, falhas: failures }, {
        status: failures ? 503 : 200,
        headers,
      });
    } catch {
      return Response.json({ error: 'conciliacao_indisponivel' }, { status: 503, headers });
    }
  };
}
