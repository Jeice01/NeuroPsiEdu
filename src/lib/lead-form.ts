export const FORMATIONS = {
  fanp: {
    name: "8ª Turma FANP",
    page: "https://neuropsiedu.com.br/fnp",
    successMessage:
      "Recebemos seus dados! Nossa equipe entrará em contato pelo WhatsApp com as informações da 8ª Turma FANP.",
  },
  famaf: {
    name: "Formação em Avaliação Psicológica para Manuseio de Arma de Fogo",
    page: "https://neuropsiedu.com.br/formacao-manuseio-arma/",
    successMessage:
      "Recebemos seus dados! Nossa equipe entrará em contato pelo WhatsApp com todas as informações da Formação em Avaliação Psicológica para Manuseio de Arma de Fogo.",
  },
} as const;

const VALID_DDDS = new Set([
  "11","12","13","14","15","16","17","18","19","21","22","24",
  "27","28","31","32","33","34","35","37","38","41","42","43","44",
  "45","46","47","48","49","51","53","54","55","61","62","63","64",
  "65","66","67","68","69","71","73","74","75","77","79","81","82",
  "83","84","85","86","87","88","89","91","92","93","94","95","96",
  "97","98","99",
]);

const BLOCKED_NUMBERS = new Set([
  "99999999999", "11111111111", "00000000000", "61999999999",
  "11999999999", "21999999999", "61900000000", "11900000000",
]);

export function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function limitText(value: string, maxLength: number): string | null {
  const normalized = normalizeText(value);
  return normalized ? normalized.slice(0, maxLength) : null;
}

export function validateFullName(value: string): boolean {
  const normalized = normalizeText(value);
  const parts = normalized.split(" ");
  return normalized.length >= 6 && parts.length >= 2 &&
    parts.every((part) => part.length >= 2);
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function validateEmail(value: string): boolean {
  const email = normalizeEmail(value);
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function validateBrazilianWhatsapp(value: string): boolean {
  const digits = onlyDigits(value);
  if (digits.length !== 11 || !VALID_DDDS.has(digits.slice(0, 2))) return false;
  if (digits[2] !== "9" || /^(\d)\1+$/.test(digits)) return false;
  if (/^(\d)\1+$/.test(digits.slice(2))) return false;
  return !BLOCKED_NUMBERS.has(digits);
}

export function formatWhatsapp(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function captureUtms(search: string) {
  const params = new URLSearchParams(search);
  return {
    utm_source: limitText(params.get("utm_source") ?? "", 120) ?? "",
    utm_medium: limitText(params.get("utm_medium") ?? "", 120) ?? "",
    utm_campaign: limitText(params.get("utm_campaign") ?? "", 180) ?? "",
    utm_content: limitText(params.get("utm_content") ?? "", 180) ?? "",
    utm_term: limitText(params.get("utm_term") ?? "", 180) ?? "",
  };
}

export function parseLeadResponse(
  responseOk: boolean,
  data: unknown,
  fallbackSuccessMessage: string,
): { ok: true; message: string } | { ok: false; message: string } {
  const body = data && typeof data === "object"
    ? data as { success?: unknown; message?: unknown; error?: unknown }
    : {};
  if (!responseOk) {
    return {
      ok: false,
      message: typeof body.error === "string" && body.error.trim()
        ? body.error
        : "Não foi possível enviar. Por favor, tente novamente.",
    };
  }
  if (body.success !== true) {
    return { ok: false, message: "A resposta do servidor não confirmou o envio." };
  }
  return {
    ok: true,
    message: typeof body.message === "string" && body.message.trim()
      ? body.message
      : fallbackSuccessMessage,
  };
}
