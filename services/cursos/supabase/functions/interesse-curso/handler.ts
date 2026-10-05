import {
  ApiError,
  readBody,
  type Rpc,
  sha256,
} from "../cadastro-curso/handler.ts";

export const GROUP_INVITE = "https://chat.whatsapp.com/GX3998AXL59KQkrFNt6xPQ";
export const INTEREST_PRIVACY_VERSION = "interesse-zulliger-20261005";
type Config = { origins: string[]; turmaId: string; rateSecret: string };
type Dependencies = {
  rpc: Rpc;
  verifyChallenge: (token: string, hostname: string) => Promise<boolean>;
};

function object(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function createInterestHandler(
  config: Config,
  dependencies: Dependencies,
) {
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      .test(config.turmaId) ||
    config.rateSecret.length < 32 || !config.origins.length ||
    config.origins.some((origin) => {
      try {
        return new URL(origin).protocol !== "https:" ||
          new URL(origin).origin !== origin;
      } catch {
        return true;
      }
    })
  ) throw new Error("configuracao_invalida");

  return async (request: Request): Promise<Response> => {
    const origin = request.headers.get("origin") || "";
    const headers: Record<string, string> = {
      "Cache-Control": "no-store",
      Vary: "Origin",
      "X-Content-Type-Options": "nosniff",
    };
    const respond = (status: number, body: unknown) =>
      Response.json(body, { status, headers });
    if (!config.origins.includes(origin)) {
      return respond(403, { error: "origem_nao_permitida" });
    }
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "content-type";
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }
    if (request.method !== "POST") {
      return respond(405, { error: "metodo_nao_permitido" });
    }
    try {
      if (new URL(request.url).search) {
        throw new ApiError(400, "dados_invalidos");
      }
      const input = await readBody(request);
      const keys = [
        "nome",
        "email",
        "telefone",
        "perfil",
        "pergunta",
        "aceita_contato",
        "aceita_grupo",
        "turnstile_token",
        "website",
      ];
      if (
        !object(input) || Object.keys(input).some((key) => !keys.includes(key))
      ) throw new ApiError(400, "dados_invalidos");
      const nome = typeof input.nome === "string" ? input.nome.trim() : "";
      const email = typeof input.email === "string"
        ? input.email.trim().toLowerCase()
        : "";
      const telefone = typeof input.telefone === "string"
        ? input.telefone.trim()
        : "";
      const pergunta = typeof input.pergunta === "string"
        ? input.pergunta.trim()
        : "";
      if (
        nome.length < 2 || nome.length > 120 || email.length > 254 ||
        !/^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/.test(email) ||
        !/^\+[1-9][0-9]{9,14}$/.test(telefone) ||
        !["psicologo", "estudante"].includes(String(input.perfil)) ||
        typeof input.perfil !== "string" ||
        typeof input.pergunta !== "string" || pergunta.length > 1000 ||
        input.aceita_contato !== true ||
        typeof input.aceita_grupo !== "boolean" ||
        typeof input.turnstile_token !== "string" || !input.turnstile_token ||
        input.turnstile_token.length > 2048 ||
        typeof input.website !== "string" || input.website.length
      ) throw new ApiError(400, "dados_invalidos");
      const key = await sha256(`interesse:${config.rateSecret}:${email}`);
      if (
        await dependencies.rpc("limitar_cadastro_curso", { p_chave: key }) !==
          true
      ) throw new ApiError(429, "limite_de_tentativas");
      if (
        !await dependencies.verifyChallenge(
          input.turnstile_token,
          new URL(origin).hostname,
        )
      ) throw new ApiError(400, "verificacao_invalida");
      await dependencies.rpc("salvar_interesse_curso", {
        p_turma_id: config.turmaId,
        p_nome: nome,
        p_email: email,
        p_telefone: telefone,
        p_perfil: input.perfil,
        p_pergunta: pergunta,
        p_aceita_contato: true,
        p_aceita_grupo: input.aceita_grupo,
        p_privacidade_versao: INTEREST_PRIVACY_VERSION,
      });
      return respond(202, {
        status: "interesse_recebido",
        ...(input.aceita_grupo ? { grupo_url: GROUP_INVITE } : {}),
      });
    } catch (error) {
      if (error instanceof ApiError) {
        return respond(error.status, { error: error.code });
      }
      return respond(503, { error: "servico_indisponivel" });
    }
  };
}
