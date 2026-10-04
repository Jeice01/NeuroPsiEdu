import { ApiError, type Rpc } from './handler.ts';

export function createRpc(url: string, serviceKey: string, transport: typeof fetch = fetch): Rpc {
  // This module belongs exclusively to the courses project; never use institutional lead credentials.
  if (url !== 'https://ydmvbssgiffqrmwigkae.supabase.co' || !serviceKey) {
    throw new Error('Projeto de cursos ou credencial invalida');
  }
  const names = new Set([
    'limitar_cadastro_curso',
    'cadastrar_inscricao_curso',
    'consultar_cadastro_curso',
    'recuperar_cadastro_curso',
    'iniciar_checkout_curso',
    'finalizar_checkout_curso',
    'conciliar_pagamento_curso',
    'preparar_conciliacao_cursos',
    'preparar_confirmacao_sandbox',
    'finalizar_confirmacao_sandbox',
  ]);
  return async (name, parameters) => {
    if (!names.has(name)) throw new Error('RPC nao permitida');
    const response = await transport(`${url}/rest/v1/rpc/${name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify(parameters),
      signal: AbortSignal.timeout(8000),
      redirect: 'error',
    });
    if (!response.ok) {
      const body: unknown = await response.json().catch(() => null);
      if (body && typeof body === 'object' && 'message' in body) {
        if (body.message === 'reenvio_divergente') throw new ApiError(409, 'reenvio_divergente');
        if (body.message === 'oferta_indisponivel') throw new ApiError(409, 'oferta_indisponivel');
        if (
          typeof body.message === 'string' &&
          [
            'vagas_esgotadas',
            'checkout_indisponivel',
            'oferta_alterada',
            'oferta_inativa',
            'aceite_obrigatorio',
            'etapa_nao_permite_reserva',
            'idempotencia_outra_inscricao',
          ].includes(body.message)
        ) {
          throw new ApiError(409, body.message);
        }
      }
      throw new ApiError(503, 'servico_indisponivel');
    }
    return response.status === 204 ? null : response.json();
  };
}

export function createChallengeVerifier(secret: string, transport: typeof fetch = fetch) {
  if (!secret) throw new Error('Turnstile nao configurado');
  return async (token: string, hostname: string): Promise<boolean> => {
    const response = await transport('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, response: token }),
      signal: AbortSignal.timeout(5000),
      redirect: 'error',
    });
    if (!response.ok) throw new ApiError(503, 'servico_indisponivel');
    const body: unknown = await response.json();
    return typeof body === 'object' && body !== null && 'success' in body && body.success === true &&
      'hostname' in body && body.hostname === hostname && 'action' in body &&
      body.action === 'cadastro_curso';
  };
}
