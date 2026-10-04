export type Rpc = (name: string, parameters: Record<string, unknown>) => Promise<unknown>;
export type Config = {
  origins: string[];
  termsVersion: string;
  privacyVersion: string;
  rateSecret: string;
  sandbox?: { turmaId: string; email: string };
};
export type Dependencies = {
  rpc: Rpc;
  verifyChallenge: (token: string, hostname: string) => Promise<boolean>;
  recovery?: {
    requestCode: (email: string) => Promise<void>;
    verifyCode: (email: string, code: string) => Promise<string>;
  };
};

const MAX_BODY_BYTES = 8192;
const TOKEN_PATTERN = /^[a-f0-9]{64}$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const encoder = new TextEncoder();

export class ApiError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string) {
    super(code);
    this.status = status;
    this.code = code;
  }
}

function object(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hex(value: ArrayBuffer): string {
  return Array.from(new Uint8Array(value), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function sha256(value: string): Promise<string> {
  return hex(await crypto.subtle.digest('SHA-256', encoder.encode(value)));
}

async function keyedHash(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return hex(await crypto.subtle.sign('HMAC', key, encoder.encode(value)));
}

export async function readBody(request: Request): Promise<unknown> {
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') {
    throw new ApiError(415, 'tipo_de_conteudo_invalido');
  }
  if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) {
    throw new ApiError(413, 'corpo_muito_grande');
  }
  const reader = request.body?.getReader();
  if (!reader) throw new ApiError(400, 'dados_invalidos');
  const chunks: Uint8Array[] = [];
  let length = 0;
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    void reader.cancel().catch(() => {});
  }, 5000);
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new ApiError(413, 'corpo_muito_grande');
      }
      chunks.push(value);
    }
    if (timedOut) throw new ApiError(408, 'tempo_de_envio_esgotado');
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    try {
      return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    } catch {
      throw new ApiError(400, 'json_invalido');
    }
  } finally {
    clearTimeout(timeout);
    reader.releaseLock();
  }
}

function validate(value: unknown, config: Config) {
  if (!object(value)) throw new ApiError(400, 'dados_invalidos');
  const allowed = [
    'turma_id',
    'nome',
    'email',
    'telefone',
    'aceita_termos',
    'aceita_imagem',
    'aceita_marketing',
    'termo_versao',
    'aviso_privacidade_versao',
    'turnstile_token',
  ];
  if (Object.keys(value).some((key) => !allowed.includes(key))) throw new ApiError(400, 'campos_invalidos');
  const nome = typeof value.nome === 'string' ? value.nome.trim().replace(/\s+/g, ' ') : '';
  const email = typeof value.email === 'string' ? value.email.trim().toLowerCase() : '';
  const telefone = typeof value.telefone === 'string' ? value.telefone.replace(/[ ()-]/g, '') : '';
  if (
    nome.length < 2 || nome.length > 120 || /[\p{Cc}\p{Cf}]/u.test(nome) ||
    email.length > 254 ||
    !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/
      .test(email) ||
    !/^\+[1-9][0-9]{9,14}$/.test(telefone) ||
    typeof value.turma_id !== 'string' || !UUID_PATTERN.test(value.turma_id) ||
    value.aceita_termos !== true || typeof value.aceita_imagem !== 'boolean' ||
    typeof value.aceita_marketing !== 'boolean'
  ) throw new ApiError(400, 'dados_invalidos');
  if (
    value.termo_versao !== config.termsVersion || value.aviso_privacidade_versao !== config.privacyVersion
  ) {
    throw new ApiError(409, 'termos_desatualizados');
  }
  if (
    typeof value.turnstile_token !== 'string' || !value.turnstile_token.trim() ||
    value.turnstile_token.length > 2048
  ) throw new ApiError(400, 'verificacao_obrigatoria');
  return {
    data: {
      p_turma_id: value.turma_id.toLowerCase(),
      p_nome: nome,
      p_email: email,
      p_telefone: telefone,
      p_aceita_termos: true,
      p_aceita_imagem: value.aceita_imagem,
      p_aceita_marketing: value.aceita_marketing,
      p_termo_versao: config.termsVersion,
      p_privacidade_versao: config.privacyVersion,
    },
    challenge: value.turnstile_token,
  };
}

export function createHandler(config: Config, dependencies: Dependencies) {
  if (
    config.sandbox && (!UUID_PATTERN.test(config.sandbox.turmaId) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.sandbox.email) ||
      config.sandbox.email !== config.sandbox.email.trim().toLowerCase())
  ) {
    throw new Error('Configuracao Sandbox invalida');
  }
  if (
    !config.origins.length || config.origins.some((origin) => {
      try {
        const url = new URL(origin);
        return url.origin !== origin || url.protocol !== 'https:';
      } catch {
        return true;
      }
    }) || !config.termsVersion.trim() || config.termsVersion.length > 80 ||
    !config.privacyVersion.trim() || config.privacyVersion.length > 80 || config.rateSecret.length < 32
  ) {
    throw new Error('Configuracao de cadastro incompleta');
  }
  return async (request: Request): Promise<Response> => {
    const origin = request.headers.get('origin') || '';
    const headers: Record<string, string> = {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'Vary': 'Origin',
      'X-Content-Type-Options': 'nosniff',
    };
    const respond = (status: number, body: unknown) =>
      new Response(JSON.stringify(body), { status, headers });
    if (!config.origins.includes(origin)) return respond(403, { error: 'origem_nao_permitida' });
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'content-type, apikey, x-registration-token';
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
    if (!['POST', 'GET'].includes(request.method)) {
      headers.Allow = 'POST, GET, OPTIONS';
      return respond(405, { error: 'metodo_nao_permitido' });
    }
    try {
      // Never accept continuation capabilities in a URL, where access logs could retain them.
      if (new URL(request.url).search) throw new ApiError(400, 'parametros_na_url_nao_permitidos');
      const token = request.headers.get('x-registration-token') || '';
      if (!TOKEN_PATTERN.test(token)) throw new ApiError(401, 'autorizacao_invalida');
      const tokenHash = await sha256(token);
      if (request.method === 'GET') {
        const allowed = await dependencies.rpc('limitar_cadastro_curso', {
          p_chave: tokenHash,
          p_consulta: true,
        });
        if (allowed !== true) throw new ApiError(429, 'limite_de_tentativas');
        const result = await dependencies.rpc('consultar_cadastro_curso', { p_token_hash: tokenHash });
        if (result === null) throw new ApiError(404, 'continuacao_indisponivel');
        const stages = [
          'lead_capturado',
          'cadastro_sem_checkout',
          'checkout_iniciado',
          'pagamento_pendente',
          'pagamento_em_analise',
          'matricula_confirmada',
          'checkout_abandonado',
          'lista_espera',
          'revisao_necessaria',
          'cancelada',
          'reembolsada',
          'expirado',
          'alerta_overbooking',
        ];
        if (
          !object(result) || typeof result.etapa_funil !== 'string' || !stages.includes(result.etapa_funil) ||
          typeof result.valor_centavos !== 'number' || !Number.isSafeInteger(result.valor_centavos) ||
          result.valor_centavos <= 0 || result.moeda !== 'BRL' ||
          typeof result.sessao_expira_em !== 'string' || !Number.isFinite(Date.parse(result.sessao_expira_em))
        ) {
          throw new ApiError(503, 'servico_indisponivel');
        }
        return respond(200, {
          etapa_funil: result.etapa_funil,
          valor_centavos: result.valor_centavos,
          moeda: result.moeda,
          sessao_expira_em: result.sessao_expira_em,
        });
      }
      const input = await readBody(request);
      if (config.sandbox) {
        if (
          !object(input) || typeof input.email !== 'string' ||
          input.email.trim().toLowerCase() !== config.sandbox.email ||
          typeof input.turma_id !== 'string' ||
          input.turma_id.toLowerCase() !== config.sandbox.turmaId.toLowerCase()
        ) {
          throw new ApiError(403, 'teste_nao_permitido');
        }
        if (input.aceita_imagem === true || input.aceita_marketing === true) {
          throw new ApiError(400, 'autorizacao_opcional_indisponivel');
        }
      }
      if (object(input) && (input.action === 'solicitar_codigo' || input.action === 'validar_codigo')) {
        if (!dependencies.recovery) throw new ApiError(503, 'recuperacao_indisponivel');
        const allowedKeys = ['action', 'email', 'turma_id', 'codigo', 'turnstile_token'];
        const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
        if (
          Object.keys(input).some((key) => !allowedKeys.includes(key)) || email.length > 254 ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
          typeof input.turma_id !== 'string' || !UUID_PATTERN.test(input.turma_id) ||
          typeof input.turnstile_token !== 'string' || !input.turnstile_token.trim() ||
          input.turnstile_token.length > 2048 ||
          (input.action === 'validar_codigo' &&
            (typeof input.codigo !== 'string' || !/^\d{8}$/.test(input.codigo)))
        ) {
          throw new ApiError(400, 'dados_invalidos');
        }
        const key = await keyedHash(`${input.action}:${email}`, config.rateSecret);
        if (await dependencies.rpc('limitar_cadastro_curso', { p_chave: key, p_consulta: false }) !== true) {
          throw new ApiError(429, 'limite_de_tentativas');
        }
        if (!await dependencies.verifyChallenge(input.turnstile_token, new URL(origin).hostname)) {
          throw new ApiError(400, 'verificacao_invalida');
        }
        if (input.action === 'solicitar_codigo') {
          await dependencies.recovery.requestCode(email);
        } else {
          const verifiedEmail = await dependencies.recovery.verifyCode(email, String(input.codigo));
          if (verifiedEmail.trim().toLowerCase() !== email) throw new ApiError(401, 'codigo_invalido');
          await dependencies.rpc('recuperar_cadastro_curso', {
            p_email: email,
            p_turma_id: input.turma_id,
            p_token_hash: tokenHash,
          });
        }
        return respond(202, { status: 'solicitacao_recebida' });
      }
      const { data, challenge } = validate(input, config);
      const key = await keyedHash(data.p_email, config.rateSecret);
      const allowed = await dependencies.rpc('limitar_cadastro_curso', { p_chave: key, p_consulta: false });
      if (allowed !== true) throw new ApiError(429, 'limite_de_tentativas');
      if (!await dependencies.verifyChallenge(challenge, new URL(origin).hostname)) {
        throw new ApiError(400, 'verificacao_invalida');
      }
      await dependencies.rpc('cadastrar_inscricao_curso', {
        ...data,
        p_token_hash: tokenHash,
        p_requisicao_hash: await sha256(JSON.stringify(data)),
      });
      // Same receipt for a new identity, an exact retry or an unverified existing identity.
      // Only authenticated GET confirms a saved registration; no existing data is disclosed here.
      return respond(202, { status: 'solicitacao_recebida' });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 429) headers['Retry-After'] = '900';
        return respond(error.status, { error: error.code });
      }
      return respond(503, { error: 'servico_indisponivel' });
    }
  };
}
