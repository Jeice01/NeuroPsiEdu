import assert from "node:assert/strict";
import { createHandler } from "./index.ts";

const ORIGIN = "https://neuropsiedu.com.br";
const FANP = {
  nome: "Maria Silva",
  whatsapp: "61987654321",
  email: "maria@example.com",
  consentimento_contato: true,
  turnstile_token: "valid-token",
  formacao_interesse: "8ª Turma FANP",
  pagina_origem: "https://neuropsiedu.com.br/fnp",
};
const FAMAF = {
  ...FANP,
  formacao_interesse:
    "Formação em Avaliação Psicológica para Manuseio de Arma de Fogo",
  pagina_origem: "https://neuropsiedu.com.br/famaf",
};

Deno.env.set("SUPABASE_URL", "https://test.supabase.co");
Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", "test-service-role");
Deno.env.set("RATE_LIMIT_SALT", "test-rate-limit-salt");

type InsertRecord = { table: string; payload: Record<string, unknown> };

function createClientMock(
  inserts: InsertRecord[],
  insertError: { code: string } | null = null,
) {
  return {
    schema: () => ({
      from: (table: string) => ({
        insert: async (payload: Record<string, unknown>) => {
          inserts.push({ table, payload });
          return { error: insertError };
        },
      }),
    }),
  };
}

function createTestHandler(options: {
  captchaValid?: boolean;
  insertError?: { code: string } | null;
  rateLimit?: (scope: string) => { allowed: boolean; retryAfter: number };
} = {}) {
  const inserts: InsertRecord[] = [];
  const handler = createHandler({
    createAdminClient: () =>
      createClientMock(inserts, options.insertError) as never,
    cleanupExpiredRateLimits: async () => {},
    validateTurnstile: async () => options.captchaValid ?? true,
    registerRateLimit: async (_client, scope) =>
      options.rateLimit?.(scope) ?? { allowed: true, retryAfter: 60 },
  });
  return { handler, inserts };
}

function request(
  body: unknown,
  method = "POST",
  contentType = "application/json",
) {
  return new Request(
    "https://test.supabase.co/functions/v1/create-lead-formacao",
    {
      method,
      headers: {
        origin: ORIGIN,
        "content-type": contentType,
        "x-forwarded-for": "203.0.113.10",
      },
      body: method === "GET"
        ? undefined
        : typeof body === "string"
        ? body
        : JSON.stringify(body),
    },
  );
}

async function responseBody(response: Response) {
  return await response.json() as Record<string, unknown>;
}

Deno.test("rejeita método inválido", async () => {
  const { handler } = createTestHandler();
  const response = await handler(request(null, "GET"));
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "POST, OPTIONS");
});

Deno.test("rejeita JSON inválido", async () => {
  const { handler } = createTestHandler();
  const response = await handler(request("{"));
  assert.equal(response.status, 400);
  assert.deepEqual(await responseBody(response), { error: "JSON inválido." });
});

Deno.test("rejeita campos obrigatórios ausentes", async () => {
  const { handler } = createTestHandler();
  const response = await handler(request({ turnstile_token: "valid-token" }));
  assert.equal(response.status, 400);
  assert.match(String((await responseBody(response)).error), /nome completo/i);
});

Deno.test("rejeita consentimento ausente", async () => {
  const { handler } = createTestHandler();
  const response = await handler(
    request({ ...FANP, consentimento_contato: false }),
  );
  assert.equal(response.status, 400);
  assert.match(
    String((await responseBody(response)).error),
    /autorizar o contato/i,
  );
});

Deno.test("rejeita CAPTCHA inválido", async () => {
  const { handler } = createTestHandler({ captchaValid: false });
  const response = await handler(request(FANP));
  assert.equal(response.status, 400);
  assert.match(
    String((await responseBody(response)).error),
    /segurança inválida/i,
  );
});

Deno.test("aplica rate limiting antes do CAPTCHA e do banco", async () => {
  const { handler, inserts } = createTestHandler({
    rateLimit: (scope) => ({ allowed: scope !== "ip", retryAfter: 900 }),
  });
  const response = await handler(request(FANP));
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("retry-after"), "900");
  assert.equal(inserts.length, 0);
});

Deno.test("trata duplicidade como sucesso idempotente", async () => {
  const { handler } = createTestHandler({ insertError: { code: "23505" } });
  const response = await handler(request(FANP));
  const body = await responseBody(response);
  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.match(String(body.message), /8ª Turma FANP/);
});

Deno.test("oculta falha interna do banco", async () => {
  const { handler } = createTestHandler({ insertError: { code: "XX000" } });
  const response = await handler(request(FANP));
  assert.equal(response.status, 500);
  assert.deepEqual(await responseBody(response), {
    error: "Não foi possível registrar seu interesse agora.",
  });
});

Deno.test("cria lead FANP com resposta e mapeamento corretos", async () => {
  const { handler, inserts } = createTestHandler();
  const response = await handler(request(FANP));
  const body = await responseBody(response);
  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.match(String(body.message), /8ª Turma FANP/);
  assert.equal(inserts[0].table, "leads_formacoes");
  assert.equal(inserts[0].payload.formacao_interesse, FANP.formacao_interesse);
  assert.equal(inserts[0].payload.pagina_origem, FANP.pagina_origem);
});

Deno.test("cria lead FAMAF com resposta e mapeamento corretos", async () => {
  const { handler, inserts } = createTestHandler();
  const response = await handler(request(FAMAF));
  const body = await responseBody(response);
  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.match(String(body.message), /Manuseio de Arma de Fogo/);
  assert.equal(inserts[0].table, "leads_formacoes");
  assert.equal(inserts[0].payload.formacao_interesse, FAMAF.formacao_interesse);
  assert.equal(inserts[0].payload.pagina_origem, FAMAF.pagina_origem);
});
