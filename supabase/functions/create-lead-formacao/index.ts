import {
  createClient,
  type SupabaseClient,
} from "npm:@supabase/supabase-js@2";

const PRODUCTION_ORIGINS = new Set([
  "https://neuropsiedu.com.br",
  "https://www.neuropsiedu.com.br",
]);

const MAX_BODY_BYTES = 16 * 1024;
const TURNSTILE_TOKEN_MAX_LENGTH = 2048;
const RATE_LIMITS = {
  ip: { limit: 10, windowSeconds: 15 * 60 },
  email: { limit: 3, windowSeconds: 60 * 60 },
  phone: { limit: 3, windowSeconds: 60 * 60 },
} as const;

const FORMATIONS = {
  fanp: {
    name: "8ª Turma FANP",
    canonicalPage: "https://neuropsiedu.com.br/fnp",
    allowedPages: new Set([
      "https://neuropsiedu.com.br/fnp",
      "https://neuropsiedu.com.br/fnp/",
    ]),
    successMessage:
      "Recebemos seus dados! Nossa equipe entrará em contato pelo WhatsApp com as informações da 8ª Turma FANP.",
  },
  famaf: {
    name: "Formação em Avaliação Psicológica para Manuseio de Arma de Fogo",
    canonicalPage: "https://neuropsiedu.com.br/famaf",
    allowedPages: new Set([
      "https://neuropsiedu.com.br/famaf",
      "https://neuropsiedu.com.br/famaf/",
      "https://neuropsiedu.com.br/formacao-manuseio-arma",
      "https://neuropsiedu.com.br/formacao-manuseio-arma/",
    ]),
    successMessage:
      "Recebemos seus dados! Nossa equipe entrará em contato pelo WhatsApp com todas as informações da Formação em Avaliação Psicológica para Manuseio de Arma de Fogo.",
  },
} as const;

const WAITLIST = {
  type: "espera_pos",
  successMessage:
    "Recebemos seus dados! Você entrou na lista de espera da Pós-Graduação.",
} as const;

const validBrazilianDDDs = new Set([
  "11","12","13","14","15","16","17","18","19",
  "21","22","24","27","28",
  "31","32","33","34","35","37","38",
  "41","42","43","44","45","46",
  "47","48","49",
  "51","53","54","55",
  "61","62","63","64",
  "65","66","67","68","69",
  "71","73","74","75","77","79",
  "81","82","83","84","85","86","87","88","89",
  "91","92","93","94","95","96","97","98","99",
]);

type RateLimitScope = keyof typeof RATE_LIMITS;
type SupabaseAdmin = SupabaseClient;
type Formation = (typeof FORMATIONS)[keyof typeof FORMATIONS];

function configuredSet(name: string) {
  return new Set(
    (Deno.env.get(name) || "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  );
}

function allowedOrigins() {
  return new Set([
    ...PRODUCTION_ORIGINS,
    ...configuredSet("ALLOWED_ORIGINS"),
  ]);
}

function isAllowedOrigin(origin: string) {
  return Boolean(origin) && allowedOrigins().has(origin);
}

function securityHeaders() {
  return {
    "Cache-Control": "no-store",
    "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
  };
}

function corsHeaders(origin: string) {
  return {
    ...(isAllowedOrigin(origin)
      ? { "Access-Control-Allow-Origin": origin }
      : {}),
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "600",
    "Vary": "Origin",
  };
}

function jsonResponse(
  origin: string,
  body: unknown,
  status = 200,
  extraHeaders: Record<string, string> = {},
) {
  return Response.json(body, {
    status,
    headers: {
      ...securityHeaders(),
      ...corsHeaders(origin),
      ...extraHeaders,
    },
  });
}

function logSecurity(
  event: string,
  requestId: string,
  details: Record<string, unknown> = {},
) {
  console.log(JSON.stringify({ event, request_id: requestId, ...details }));
}

function normalizeText(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().replace(/\s+/g, " ");
  return trimmed.length > 0 ? trimmed : null;
}

function limitText(value: unknown, maxLength: number) {
  const normalized = normalizeText(value);
  if (!normalized) return null;
  return normalized.slice(0, maxLength);
}

function resolveFormation(
  formationValue: unknown,
  pageValue: unknown,
): Formation | null {
  const formation = normalizeText(formationValue);
  const page = normalizeText(pageValue);

  if (!formation || !page) return null;

  return Object.values(FORMATIONS).find((candidate) =>
    candidate.name === formation && candidate.allowedPages.has(page)
  ) || null;
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateFullName(value: string) {
  const normalized = value.trim().replace(/\s+/g, " ");
  const parts = normalized.split(" ");

  return normalized.length >= 6 &&
    parts.length >= 2 &&
    parts.every((part) => part.length >= 2);
}

function hasAllSameDigits(value: string) {
  return /^(\d)\1+$/.test(value);
}

function validateBrazilianWhatsapp(value: string) {
  const digits = onlyDigits(value);
  const blockedNumbers = new Set([
    "99999999999",
    "11111111111",
    "00000000000",
    "61999999999",
    "11999999999",
    "21999999999",
    "61900000000",
    "11900000000",
  ]);

  if (digits.length !== 11) return false;
  if (!validBrazilianDDDs.has(digits.slice(0, 2))) return false;
  if (digits[2] !== "9") return false;
  if (hasAllSameDigits(digits) || hasAllSameDigits(digits.slice(2))) {
    return false;
  }

  return !blockedNumbers.has(digits);
}

async function hmacSha256(value: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));

  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function getClientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for") || "";
  return forwarded.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip")?.trim() ||
    "";
}

async function readJsonBody(req: Request) {
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    throw new Response("unsupported_media_type", { status: 415 });
  }

  const declaredLength = Number(req.headers.get("content-length") || "0");
  if (declaredLength > MAX_BODY_BYTES) {
    throw new Response("payload_too_large", { status: 413 });
  }

  if (!req.body) throw new Response("invalid_json", { status: 400 });

  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new Response("payload_too_large", { status: 413 });
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    const parsed = JSON.parse(new TextDecoder().decode(bytes));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Body must be an object.");
    }
    return parsed as Record<string, unknown>;
  } catch {
    throw new Response("invalid_json", { status: 400 });
  }
}

async function registerRateLimit(
  supabaseAdmin: SupabaseAdmin,
  scope: RateLimitScope,
  keyHash: string,
) {
  const rule = RATE_LIMITS[scope];
  const now = new Date();
  const windowStart = new Date(
    now.getTime() - rule.windowSeconds * 1000,
  ).toISOString();
  const expiresAt = new Date(
    now.getTime() + rule.windowSeconds * 1000,
  ).toISOString();

  const { error: insertError } = await supabaseAdmin
    .schema("neuropsiedu")
    .from("lead_rate_limit_events")
    .insert({
      scope,
      key_hash: keyHash,
      expires_at: expiresAt,
    });

  if (insertError) {
    console.error(JSON.stringify({
      event: "rate_limit_insert_failed",
      scope,
      code: insertError.code,
    }));
    throw new Error(`rate_limit_insert_${scope}`);
  }

  const { count, error: countError } = await supabaseAdmin
    .schema("neuropsiedu")
    .from("lead_rate_limit_events")
    .select("id", { count: "exact", head: true })
    .eq("scope", scope)
    .eq("key_hash", keyHash)
    .gte("created_at", windowStart);

  if (countError || count === null) {
    console.error(JSON.stringify({
      event: "rate_limit_count_failed",
      scope,
      code: countError?.code || "missing_count",
    }));
    throw new Error(`rate_limit_count_${scope}`);
  }

  return {
    allowed: count <= rule.limit,
    retryAfter: rule.windowSeconds,
  };
}

async function cleanupExpiredRateLimits(supabaseAdmin: SupabaseAdmin) {
  if (crypto.getRandomValues(new Uint8Array(1))[0] > 12) return;

  const { error } = await supabaseAdmin
    .schema("neuropsiedu")
    .from("lead_rate_limit_events")
    .delete()
    .lt("expires_at", new Date().toISOString());

  if (error) {
    console.warn(JSON.stringify({ event: "rate_limit_cleanup_failed" }));
  }
}

async function validateTurnstile(
  token: string,
  remoteIp: string,
  requestId: string,
) {
  const secret = Deno.env.get("TURNSTILE_SECRET_KEY");
  if (!secret) throw new Error("turnstile_not_configured");

  if (!token || token.length > TURNSTILE_TOKEN_MAX_LENGTH) {
    return false;
  }

  const formData = new FormData();
  formData.set("secret", secret);
  formData.set("response", token);
  formData.set("idempotency_key", requestId);
  if (remoteIp) formData.set("remoteip", remoteIp);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
        signal: controller.signal,
      },
    );

    if (!response.ok) return false;

    const result = await response.json() as {
      action?: string;
      hostname?: string;
      metadata?: { result_with_testing_key?: boolean };
      success?: boolean;
    };

    if (!result.success) return false;

    const testMode = Deno.env.get("TURNSTILE_TEST_MODE") === "true";
    const officialAlwaysPassesSecret =
      "1x0000000000000000000000000000000AA";
    if (
      testMode && secret === officialAlwaysPassesSecret &&
      result.metadata?.result_with_testing_key === true
    ) {
      return true;
    }

    const expectedAction =
      Deno.env.get("TURNSTILE_EXPECTED_ACTION") || "lead_formacao";
    const allowedHostnames = configuredSet("TURNSTILE_ALLOWED_HOSTNAMES");

    return result.action === expectedAction &&
      allowedHostnames.size > 0 &&
      Boolean(result.hostname) &&
      allowedHostnames.has(result.hostname as string);
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

Deno.serve(async (req) => {
  const requestId = crypto.randomUUID();
  const origin = req.headers.get("origin") || "";

  if (req.method === "OPTIONS") {
    if (!isAllowedOrigin(origin)) {
      return jsonResponse(origin, { error: "Origem não autorizada." }, 403);
    }
    return new Response(null, {
      status: 204,
      headers: {
        ...securityHeaders(),
        ...corsHeaders(origin),
      },
    });
  }

  if (!isAllowedOrigin(origin)) {
    logSecurity("origin_rejected", requestId);
    return jsonResponse(origin, { error: "Origem não autorizada." }, 403);
  }

  if (req.method !== "POST") {
    return jsonResponse(
      origin,
      { error: "Método não permitido." },
      405,
      { "Allow": "POST, OPTIONS" },
    );
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const rateLimitSalt = Deno.env.get("RATE_LIMIT_SALT");

  if (!supabaseUrl || !serviceRoleKey || !rateLimitSalt) {
    console.error(JSON.stringify({
      event: "server_configuration_incomplete",
      request_id: requestId,
    }));
    return jsonResponse(
      origin,
      { error: "Serviço temporariamente indisponível." },
      503,
    );
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    const body = await readJsonBody(req);
    const clientIp = getClientIp(req);
    const ipHash = await hmacSha256(clientIp || "unknown", rateLimitSalt);

    await cleanupExpiredRateLimits(supabaseAdmin);

    const ipRateLimit = await registerRateLimit(
      supabaseAdmin,
      "ip",
      ipHash,
    );
    if (!ipRateLimit.allowed) {
      logSecurity("rate_limit_rejected", requestId, { scope: "ip" });
      return jsonResponse(
        origin,
        { error: "Muitas tentativas. Aguarde antes de tentar novamente." },
        429,
        { "Retry-After": String(ipRateLimit.retryAfter) },
      );
    }

    if (normalizeText(body.website)) {
      logSecurity("honeypot_rejected", requestId);
      return jsonResponse(origin, {
        success: true,
        message: "Recebemos seus dados.",
      });
    }

    const turnstileToken =
      typeof body.turnstile_token === "string" ? body.turnstile_token : "";
    const turnstileValid = await validateTurnstile(
      turnstileToken,
      clientIp,
      requestId,
    );

    if (!turnstileValid) {
      logSecurity("turnstile_rejected", requestId);
      return jsonResponse(
        origin,
        { error: "Verificação de segurança inválida ou expirada." },
        400,
      );
    }

    const nome = String(body.nome || "").trim().replace(/\s+/g, " ");
    const whatsapp = onlyDigits(String(body.whatsapp || ""));
    const email = String(body.email || "").trim().toLowerCase();
    const consentimentoContato = body.consentimento_contato === true;

    if (!validateFullName(nome)) {
      return jsonResponse(
        origin,
        { error: "Informe seu nome completo, com nome e sobrenome." },
        400,
      );
    }
    if (!validateBrazilianWhatsapp(whatsapp)) {
      return jsonResponse(
        origin,
        { error: "Informe um WhatsApp válido com DDD." },
        400,
      );
    }
    if (!email || email.length > 254 || !isValidEmail(email)) {
      return jsonResponse(origin, { error: "Informe um e-mail válido." }, 400);
    }
    if (!consentimentoContato) {
      return jsonResponse(
        origin,
        { error: "É necessário autorizar o contato da NeuroPsiEdu." },
        400,
      );
    }

    const leadType = normalizeText(body.lead_type);
    const isWaitlist = leadType === WAITLIST.type;
    const formation = isWaitlist
      ? null
      : resolveFormation(body.formacao_interesse, body.pagina_origem);

    if ((leadType && !isWaitlist) || (!isWaitlist && !formation)) {
      logSecurity("formation_rejected", requestId);
      return jsonResponse(
        origin,
        { error: "Formação ou página de origem inválida." },
        400,
      );
    }

    const emailHash = await hmacSha256(email, rateLimitSalt);
    const phoneHash = await hmacSha256(whatsapp, rateLimitSalt);
    const identifierLimits = await Promise.all([
      registerRateLimit(supabaseAdmin, "email", emailHash),
      registerRateLimit(supabaseAdmin, "phone", phoneHash),
    ]);

    const rejectedIdentifier = identifierLimits.find((result) =>
      !result.allowed
    );
    if (rejectedIdentifier) {
      logSecurity("rate_limit_rejected", requestId, {
        scope: "contact",
      });
      return jsonResponse(
        origin,
        { error: "Muitas tentativas. Aguarde antes de tentar novamente." },
        429,
        { "Retry-After": String(rejectedIdentifier.retryAfter) },
      );
    }

    const userAgent = req.headers.get("user-agent") || "";
    const insertResult = isWaitlist
      ? await supabaseAdmin
        .schema("neuropsiedu")
        .from("espera_pos")
        .insert({
          nome: nome.slice(0, 180),
          telefone: whatsapp,
          email,
          is_psicologo: body.is_psicologo === "não" ? "não" : "sim",
          origem: "pos-graduacao",
          consentimento_contato: consentimentoContato,
          status_lead: "novo",
        })
      : await supabaseAdmin
        .schema("neuropsiedu")
        .from("leads_formacoes")
        .insert({
          nome: nome.slice(0, 180),
          whatsapp,
          email,
          perfil: limitText(body.perfil, 120),
          crp_ou_instituicao: limitText(body.crp_ou_instituicao, 180),
          cidade_estado: limitText(body.cidade_estado, 180),
          interesse_principal: limitText(body.interesse_principal, 220),
          mensagem: limitText(body.mensagem, 1200),
          formacao_interesse: formation!.name,
          pagina_origem: formation!.canonicalPage,
          botao_origem: limitText(body.botao_origem, 180),
          consentimento_contato: consentimentoContato,
          status_lead: "novo",
          utm_source: limitText(body.utm_source, 120),
          utm_medium: limitText(body.utm_medium, 120),
          utm_campaign: limitText(body.utm_campaign, 180),
          utm_content: limitText(body.utm_content, 180),
          utm_term: limitText(body.utm_term, 180),
          user_agent: userAgent.slice(0, 500),
          ip_hash: ipHash,
        });

    const { error } = insertResult;

    if (error) {
      if (error.code === "23505") {
        logSecurity("lead_duplicate", requestId, {
          type: isWaitlist ? WAITLIST.type : "formacao",
        });
        return jsonResponse(origin, {
          success: true,
          message: isWaitlist
            ? WAITLIST.successMessage
            : formation!.successMessage,
        });
      }

      console.error(JSON.stringify({
        event: "lead_insert_failed",
        request_id: requestId,
        code: error.code,
      }));
      return jsonResponse(
        origin,
        { error: "Não foi possível registrar seu interesse agora." },
        500,
      );
    }

    logSecurity("lead_created", requestId, {
      type: isWaitlist ? WAITLIST.type : "formacao",
    });

    return jsonResponse(origin, {
      success: true,
      message: isWaitlist
        ? WAITLIST.successMessage
        : formation!.successMessage,
    });
  } catch (error) {
    if (error instanceof Response) {
      const publicMessages: Record<number, string> = {
        400: "JSON inválido.",
        413: "Corpo da requisição acima do limite permitido.",
        415: "Use Content-Type application/json.",
      };
      return jsonResponse(
        origin,
        { error: publicMessages[error.status] || "Requisição inválida." },
        error.status,
      );
    }

    console.error(JSON.stringify({
      event: "request_failed",
      request_id: requestId,
      reason: error instanceof Error ? error.message : "unknown",
    }));
    return jsonResponse(
      origin,
      { error: "Serviço temporariamente indisponível." },
      503,
    );
  }
});
