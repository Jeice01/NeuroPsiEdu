import {
  ApiError,
  readBody,
  type Rpc,
  sha256,
} from "../cadastro-curso/handler.ts";
import {
  type Attempt,
  type CheckoutResult,
  object,
  sandboxPaymentUrl,
} from "./pagbank.ts";

const uuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function validAttempt(
  value: Record<string, unknown>,
): value is Record<string, unknown> & Attempt {
  return ["pagamento_id", "inscricao_id", "turma_id"].every((key) =>
    typeof value[key] === "string" && uuid.test(value[key])
  ) &&
    typeof value.nome === "string" && value.nome.trim().length > 0 &&
    value.nome.length <= 100 &&
    typeof value.valor_centavos === "number" &&
    Number.isSafeInteger(value.valor_centavos) &&
    value.valor_centavos > 0 && value.valor_centavos <= 999999900 &&
    typeof value.expira_em === "string" &&
    Date.parse(value.expira_em) > Date.now();
}

export function createCheckoutHandler(
  config: { origins: string[]; enabled: boolean },
  dependencies: {
    rpc: Rpc;
    createCheckout: (attempt: Attempt) => Promise<CheckoutResult>;
  },
) {
  if (
    !config.origins.length ||
    config.origins.some((origin) => new URL(origin).origin !== origin)
  ) {
    throw new Error("Origens de checkout invalidas");
  }
  return async (request: Request): Promise<Response> => {
    const origin = request.headers.get("origin") || "";
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      Vary: "Origin",
      "X-Content-Type-Options": "nosniff",
    };
    const respond = (status: number, body: unknown) =>
      new Response(JSON.stringify(body), { status, headers });
    if (!config.origins.includes(origin)) {
      return respond(403, { error: "origem_nao_permitida" });
    }
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] =
      "content-type, apikey, x-registration-token";
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }
    if (request.method !== "POST") {
      return respond(405, { error: "metodo_nao_permitido" });
    }
    if (!config.enabled) {
      return respond(503, { error: "checkout_desabilitado" });
    }
    try {
      if (new URL(request.url).search) {
        throw new ApiError(400, "parametros_na_url_nao_permitidos");
      }
      const token = request.headers.get("x-registration-token") || "";
      if (!/^[a-f0-9]{64}$/.test(token)) {
        throw new ApiError(401, "autorizacao_invalida");
      }
      const input = await readBody(request);
      if (
        !object(input) || Object.keys(input).length !== 1 ||
        typeof input.idempotencia !== "string" || !uuid.test(input.idempotencia)
      ) {
        throw new ApiError(400, "dados_invalidos");
      }
      const tokenHash = await sha256(token);
      if (
        await dependencies.rpc("limitar_cadastro_curso", {
          p_chave: tokenHash,
          p_consulta: true,
        }) !== true
      ) {
        headers["Retry-After"] = "900";
        throw new ApiError(429, "limite_de_tentativas");
      }
      const attempt = await dependencies.rpc("iniciar_checkout_curso", {
        p_token_hash: tokenHash,
        p_idempotencia: input.idempotencia,
      });
      if (attempt === null) throw new ApiError(401, "autorizacao_invalida");
      if (!object(attempt)) throw new ApiError(503, "servico_indisponivel");
      const pending = () => respond(202, { status: "conciliacao_pendente" });
      const ready = (url: unknown, expires: unknown) => {
        if (
          !sandboxPaymentUrl(url) || typeof expires !== "string" ||
          !(Date.parse(expires) > Date.now())
        ) {
          return pending();
        }
        return respond(200, {
          status: "checkout_iniciado",
          url,
          expira_em: expires,
        });
      };
      if (attempt.acao === "reutilizar") {
        return ready(attempt.url, attempt.expira_em);
      }
      if (attempt.acao === "aguardar") return pending();
      if (attempt.acao === "falhou") {
        throw new ApiError(409, "nova_tentativa_necessaria");
      }
      if (attempt.acao !== "criar" || !validAttempt(attempt)) {
        throw new ApiError(503, "servico_indisponivel");
      }
      let result: CheckoutResult;
      try {
        result = await dependencies.createCheckout(attempt);
      } catch {
        result = { resultado: "resultado_desconhecido" };
      }
      // No link is disclosed before database persistence succeeds.
      await dependencies.rpc("finalizar_checkout_curso", {
        p_pagamento_id: attempt.pagamento_id,
        p_resultado: result.resultado,
        p_checkout_id: result.resultado === "criado" ? result.id : null,
        p_url: result.resultado === "criado" ? result.url : null,
        p_expira_em: result.resultado === "criado" ? result.expira_em : null,
      });
      if (result.resultado === "falha_definitiva") {
        throw new ApiError(502, "pagamento_indisponivel");
      }
      if (result.resultado !== "criado") return pending();
      // A webhook or recovery may have completed/changed access while creation was in flight.
      const current = await dependencies.rpc("consultar_cadastro_curso", { p_token_hash: tokenHash });
      if (!object(current) || current.etapa_funil !== "checkout_iniciado") return pending();
      return ready(result.url, result.expira_em);
    } catch (error) {
      if (error instanceof ApiError) {
        return respond(error.status, { error: error.code });
      }
      return respond(503, { error: "servico_indisponivel" });
    }
  };
}
