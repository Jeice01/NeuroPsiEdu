import { createHash, createPublicKey, timingSafeEqual, verify } from 'node:crypto';
import { Buffer } from 'node:buffer';
import { object } from '../checkout-curso/pagbank.ts';

export const objectId = /^(CHEC|ORDE)_[A-Za-z0-9-]{1,100}$/;
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
export type Observation = {
  pagamento_id: string;
  objeto_id: string;
  status: string;
  checkout_id?: string;
  pedido_id?: string;
  cobranca_id?: string;
  valor_centavos?: number;
  moeda?: string;
  pago_centavos?: number;
  reembolsado_centavos?: number;
  sem_cobranca_pagavel?: boolean;
};
export function verifySignature(raw: Uint8Array, header: string, publicKey: string): boolean {
  if (!header || header.length > 2048) return false;
  try {
    const key = createPublicKey({ key: Buffer.from(publicKey, 'base64'), format: 'der', type: 'spki' });
    if (key.asymmetricKeyType !== 'ec') return false;
    return header.split(',').slice(0, 5).some((part) => {
      const signature = part.trim();
      return /^[A-Za-z0-9+/]+={0,2}$/.test(signature) &&
        verify('sha256', raw, key, Buffer.from(signature, 'base64'));
    });
  } catch {
    return false;
  }
}

export function normalizeOrder(value: unknown, expectedId: string, expectedReference?: string): Observation {
  if (
    !object(value) || value.id !== expectedId || typeof value.reference_id !== 'string' ||
    !uuid.test(value.reference_id) || (expectedReference && value.reference_id !== expectedReference)
  ) throw new Error('pedido_invalido');
  const base = { pagamento_id: value.reference_id, objeto_id: expectedId, pedido_id: expectedId };
  if (!Array.isArray(value.charges) || value.charges.length !== 1 || !object(value.charges[0])) {
    return { ...base, status: 'REVIEW' };
  }
  const charge = value.charges[0];
  if (
    typeof charge.id !== 'string' || !/^CHAR_[A-Za-z0-9-]{1,100}$/.test(charge.id) ||
    !object(charge.amount) ||
    typeof charge.amount.value !== 'number' || !Number.isSafeInteger(charge.amount.value) ||
    charge.amount.value <= 0 ||
    charge.amount.currency !== 'BRL' || typeof charge.status !== 'string'
  ) return { ...base, status: 'REVIEW' };
  const summary = object(charge.amount.summary) ? charge.amount.summary : {};
  const paid = typeof summary.paid === 'number' && Number.isSafeInteger(summary.paid) ? summary.paid : -1;
  const refunded = typeof summary.refunded === 'number' && Number.isSafeInteger(summary.refunded)
    ? summary.refunded
    : -1;
  const status = refunded > 0
    ? 'REFUNDED'
    : ['PAID', 'WAITING', 'IN_ANALYSIS', 'DECLINED', 'CANCELED'].includes(charge.status)
    ? charge.status
    : 'REVIEW';
  return {
    ...base,
    status,
    cobranca_id: charge.id,
    valor_centavos: charge.amount.value,
    moeda: 'BRL',
    pago_centavos: paid,
    reembolsado_centavos: refunded,
  };
}

export function createProvider(token: string, transport: typeof fetch = fetch, signatureMode = 'ecdsa') {
  if (!token.trim()) throw new Error('token_sandbox_ausente');
  if (!['ecdsa', 'legacy-sha256'].includes(signatureMode)) throw new Error('modo_assinatura_invalido');
  let cachedKey = '', fetchedAt = 0;
  async function get(path: string): Promise<unknown> {
    const response = await transport(`https://sandbox.api.pagseguro.com${path}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      redirect: 'error',
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error('consulta_pagbank_indisponivel');
    return response.json();
  }
  return {
    signatureHeader: signatureMode === 'legacy-sha256'
      ? 'x-authenticity-token' as const
      : 'x-payload-signature' as const,
    async authenticate(raw: Uint8Array, signature: string) {
      // Sandbox Order notifications still use the documented shared-secret signature.
      // Mode is server-selected; never fall back after an invalid ECDSA signature.
      if (signatureMode === 'legacy-sha256') {
        if (!/^[a-f0-9]{64}$/i.test(signature)) return false;
        const expected = createHash('sha256').update(token, 'utf8').update('-').update(raw).digest();
        return timingSafeEqual(expected, Buffer.from(signature, 'hex'));
      }
      if (!signature || signature.length > 2048) return false;
      if (cachedKey && Date.now() - fetchedAt < 3600000 && verifySignature(raw, signature, cachedKey)) {
        return true;
      }
      if (cachedKey && Date.now() - fetchedAt < 60000) return false;
      const value = await get('/public-keys/webhook');
      if (!object(value) || typeof value.public_key !== 'string') throw new Error('chave_invalida');
      cachedKey = value.public_key;
      fetchedAt = Date.now();
      return verifySignature(raw, signature, cachedKey);
    },
    async observe(id: string, expectedReference?: string): Promise<Observation> {
      if (!objectId.test(id)) throw new Error('identificador_invalido');
      const isOrder = id.startsWith('ORDE_');
      const value = await get(`/${isOrder ? 'orders' : 'checkouts'}/${encodeURIComponent(id)}`);
      if (isOrder) return normalizeOrder(value, id, expectedReference);
      if (
        !object(value) || value.id !== id || typeof value.reference_id !== 'string' ||
        !uuid.test(value.reference_id) ||
        (expectedReference && value.reference_id !== expectedReference)
      ) throw new Error('checkout_invalido');
      if (Array.isArray(value.orders) && value.orders.length > 0) {
        if (
          value.orders.length !== 1 || !object(value.orders[0]) ||
          typeof value.orders[0].id !== 'string' || !/^ORDE_[A-Za-z0-9-]{1,100}$/.test(value.orders[0].id)
        ) {
          return { pagamento_id: value.reference_id, objeto_id: id, checkout_id: id, status: 'REVIEW' };
        }
        const orderId = value.orders[0].id;
        const order = await get(`/orders/${encodeURIComponent(orderId)}`);
        return { ...normalizeOrder(order, orderId, value.reference_id), checkout_id: id };
      }
      // An empty or missing collection never proves that no payable charge exists.
      return {
        pagamento_id: value.reference_id,
        objeto_id: id,
        checkout_id: id,
        status: value.status === 'ACTIVE' ? 'CHECKOUT_ACTIVE' : 'REVIEW',
      };
    },
  };
}
