import { createClient } from "npm:@supabase/supabase-js@2";

const allowedOrigins = [
  "https://neuropsiedu.com.br",
  "https://www.neuropsiedu.com.br",
  "http://localhost:5173",
  "http://localhost:3000",
];

const validBrazilianDDDs = [
  "11","12","13","14","15","16","17","18","19",
  "21","22","24",
  "27","28",
  "31","32","33","34","35","37","38",
  "41","42","43","44","45","46",
  "47","48","49",
  "51","53","54","55",
  "61","62","64",
  "63",
  "65","66",
  "67",
  "68",
  "69",
  "71","73","74","75","77",
  "79",
  "81","87",
  "82",
  "83",
  "84",
  "85","88",
  "86","89",
  "91","93","94",
  "92","97",
  "95",
  "96",
  "98","99",
];

function getCorsHeaders(req: Request) {
  const origin = req.headers.get("origin") || "";
  const isCodespacesPreview =
    origin.endsWith(".app.github.dev") ||
    origin.endsWith(".githubpreview.dev");

  const allowedOrigin =
    allowedOrigins.includes(origin) || isCodespacesPreview
      ? origin
      : "https://neuropsiedu.com.br";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

function jsonResponse(req: Request, body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...getCorsHeaders(req),
      "Content-Type": "application/json",
    },
  });
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
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

function validateFullName(value: string) {
  const normalized = value.trim().replace(/\s+/g, " ");
  const parts = normalized.split(" ");

  if (normalized.length < 6) return false;
  if (parts.length < 2) return false;

  return parts.every((part) => part.length >= 2);
}

function hasAllSameDigits(value: string) {
  return /^(\d)\1+$/.test(value);
}

function validateBrazilianWhatsapp(value: string) {
  const digits = onlyDigits(value);

  if (digits.length !== 11) return false;

  const ddd = digits.slice(0, 2);
  const mobileNumber = digits.slice(2);
  const firstMobileDigit = digits[2];

  if (!validBrazilianDDDs.includes(ddd)) return false;
  if (firstMobileDigit !== "9") return false;

  if (hasAllSameDigits(digits)) return false;
  if (hasAllSameDigits(mobileNumber)) return false;

  const blockedNumbers = [
    "99999999999",
    "11111111111",
    "00000000000",
    "61999999999",
    "11999999999",
    "21999999999",
    "61900000000",
    "11900000000",
  ];

  if (blockedNumbers.includes(digits)) return false;

  return true;
}

async function sha256(value: string) {
  const data = new TextEncoder().encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: getCorsHeaders(req),
    });
  }

  if (req.method !== "POST") {
    return jsonResponse(req, { error: "Método não permitido." }, 405);
  }

  try {
    const body = await req.json();

    const nome = String(body.nome || "").trim().replace(/\s+/g, " ");
    const whatsapp = onlyDigits(String(body.whatsapp || ""));
    const email = String(body.email || "").trim().toLowerCase();
    const consentimentoContato = Boolean(body.consentimento_contato);

    if (!validateFullName(nome)) {
      return jsonResponse(
        req,
        { error: "Informe seu nome completo, com nome e sobrenome." },
        400,
      );
    }

    if (!validateBrazilianWhatsapp(whatsapp)) {
      return jsonResponse(
        req,
        { error: "Informe um WhatsApp válido com DDD. Exemplo: (61) 99999-9999." },
        400,
      );
    }

    if (!email || !isValidEmail(email)) {
      return jsonResponse(req, { error: "Informe um e-mail válido." }, 400);
    }

    if (!consentimentoContato) {
      return jsonResponse(
        req,
        { error: "É necessário autorizar o contato da NeuroPsiEdu." },
        400,
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Variáveis de ambiente do Supabase não configuradas.");
      return jsonResponse(
        req,
        { error: "Configuração do servidor incompleta." },
        500,
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      db: {
        schema: "neuropsiedu",
      },
    });

    const forwardedFor = req.headers.get("x-forwarded-for") || "";
    const ip = forwardedFor.split(",")[0]?.trim() || "";
    const userAgent = req.headers.get("user-agent") || "";

    const ipHash = ip ? await sha256(ip) : null;

    const { error } = await supabaseAdmin.from("leads_formacoes").insert({
      nome: nome.slice(0, 180),
      whatsapp,
      email,

      perfil: limitText(body.perfil, 120),
      crp_ou_instituicao: limitText(body.crp_ou_instituicao, 180),
      cidade_estado: limitText(body.cidade_estado, 180),
      interesse_principal: limitText(body.interesse_principal, 220),
      mensagem: limitText(body.mensagem, 1200),

      formacao_interesse:
        limitText(body.formacao_interesse, 180) || "8ª Turma FANP",

      pagina_origem:
        limitText(body.pagina_origem, 300) ||
        "https://neuropsiedu.com.br/fnp",

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

    if (error) {
      console.error("Erro ao inserir lead:", error);

      return jsonResponse(
        req,
        { error: "Não foi possível registrar seu interesse agora." },
        500,
      );
    }

    return jsonResponse(req, {
      success: true,
      message:
        "Recebemos seus dados! Nossa equipe entrará em contato pelo WhatsApp com as informações da 8ª Turma FANP.",
    });
  } catch (error) {
    console.error("Erro inesperado:", error);

    return jsonResponse(
      req,
      { error: "Erro inesperado ao enviar o formulário." },
      500,
    );
  }
});
