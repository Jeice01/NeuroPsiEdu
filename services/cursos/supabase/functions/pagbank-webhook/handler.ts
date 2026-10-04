import { type Rpc, sha256 } from '../cadastro-curso/handler.ts';
import { object } from '../checkout-curso/pagbank.ts';
import { objectId, type Observation } from './provider.ts';

export async function readRaw(request: Request): Promise<Uint8Array> {
  if (Number(request.headers.get('content-length')) > 65536) throw new Error('corpo_excessivo');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('corpo_ausente');
  const chunks: Uint8Array[] = [];
  let length = 0, expired = false;
  const timer = setTimeout(() => {
    expired = true;
    void reader.cancel().catch(() => {});
  }, 5000);
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 65536) {
        await reader.cancel();
        throw new Error('corpo_excessivo');
      }
      chunks.push(value);
    }
    if (expired) throw new Error('corpo_incompleto');
    const raw = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      raw.set(chunk, offset);
      offset += chunk.length;
    }
    return raw;
  } finally {
    clearTimeout(timer);
    reader.releaseLock();
  }
}

export async function persistObservation(rpc: Rpc, observation: Observation) {
  return rpc('conciliar_pagamento_curso', {
    p_observacao: observation,
    p_chave: await sha256(JSON.stringify(observation)),
  });
}
export function createWebhook(dependencies: {
  rpc: Rpc;
  signatureHeader?: 'x-payload-signature' | 'x-authenticity-token';
  authenticate: (raw: Uint8Array, header: string) => Promise<boolean>;
  observe: (id: string, reference?: string) => Promise<Observation>;
}) {
  return async (request: Request) => {
    const reply = (status: number, error?: string) =>
      Response.json(error ? { error } : { status: 'recebido' }, {
        status,
        headers: { 'Cache-Control': 'no-store' },
      });
    if (request.method !== 'POST') return reply(405, 'metodo_nao_permitido');
    if (new URL(request.url).search) return reply(400, 'url_invalida');
    if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') {
      return reply(415, 'tipo_invalido');
    }
    const signature = request.headers.get(dependencies.signatureHeader ?? 'x-payload-signature') || '';
    if (!signature) return reply(401, 'assinatura_invalida');
    let raw: Uint8Array;
    try {
      raw = await readRaw(request);
    } catch {
      return reply(400, 'corpo_invalido');
    }
    try {
      if (!await dependencies.authenticate(raw, signature)) return reply(401, 'assinatura_invalida');
      let data: unknown;
      try {
        data = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(raw));
      } catch {
        return reply(400, 'json_invalido');
      }
      if (
        !object(data) || typeof data.id !== 'string' || !objectId.test(data.id) ||
        typeof data.reference_id !== 'string'
      ) return reply(400, 'evento_invalido');
      const observation = await dependencies.observe(data.id, data.reference_id);
      await persistObservation(dependencies.rpc, observation);
      return reply(200);
    } catch {
      return reply(503, 'conciliacao_indisponivel');
    }
  };
}
