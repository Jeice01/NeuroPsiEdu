export const TURMA_ID = "b43bce5c-7764-42a1-b361-5134c7b0370a";
const STORAGE_KEY = "neuropsiedu.cursos.continuacao.v1";
const CHECKOUT_KEY = "neuropsiedu.cursos.checkout.v1";
const scopedKey = (key: string, turmaId?: string) => turmaId ? `${key}.${turmaId}` : key;
export type RegistrationStatus = { etapa_funil: string; valor_centavos: number; moeda: "BRL"; sessao_expira_em: string };
export class RegistrationError extends Error {
  status: number;
  constructor(status: number, code: string) { super(code); this.status = status; }
}
export function continuationToken(turmaId?: string): string {
  try {
    const existing = sessionStorage.getItem(scopedKey(STORAGE_KEY, turmaId));
    if (existing && /^[a-f0-9]{64}$/.test(existing)) return existing;
  } catch { /* Browsers may block storage; the caller retains an in-memory copy. */ }
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) => byte.toString(16).padStart(2, "0")).join("");
  try { sessionStorage.setItem(scopedKey(STORAGE_KEY, turmaId), token); } catch { /* Recovery remains available after navigation. */ }
  return token;
}
export function existingContinuation(turmaId?: string): string | null {
  try { const value = sessionStorage.getItem(scopedKey(STORAGE_KEY, turmaId)); return value && /^[a-f0-9]{64}$/.test(value) ? value : null; }
  catch { return null; }
}
export function clearContinuation(turmaId?: string) {
  try { sessionStorage.removeItem(scopedKey(STORAGE_KEY, turmaId)); sessionStorage.removeItem(scopedKey(CHECKOUT_KEY, turmaId)); } catch { /* Storage may be disabled. */ }
}
export function checkoutAttemptKey(turmaId?: string): string {
  try { const key = sessionStorage.getItem(scopedKey(CHECKOUT_KEY, turmaId)); if (key && /^[a-f0-9-]{36}$/.test(key)) return key; } catch { /* In-memory fallback. */ }
  const key = crypto.randomUUID();
  try { sessionStorage.setItem(scopedKey(CHECKOUT_KEY, turmaId), key); } catch { /* Server also prevents duplicate attempts. */ }
  return key;
}
export function resetCheckoutAttempt(turmaId?: string) {
  try { sessionStorage.removeItem(scopedKey(CHECKOUT_KEY, turmaId)); } catch { /* Storage may be unavailable. */ }
}
export async function checkoutRequest(endpoint: string, token: string, key: string): Promise<string | null> {
  const response = await fetch(endpoint, { method: "POST", credentials: "omit", cache: "no-store", redirect: "error",
    signal: AbortSignal.timeout(20000), headers: { "Content-Type": "application/json", "X-Registration-Token": token },
    body: JSON.stringify({ idempotencia: key }) });
  const data: unknown = await response.json();
  if (!response.ok) throw new RegistrationError(response.status,
    data && typeof data === "object" && "error" in data && typeof data.error === "string" ? data.error : "servico_indisponivel");
  if (data && typeof data === "object" && "status" in data) {
    if (response.status === 202 && data.status === "conciliacao_pendente") return null;
    if (response.status === 200 && data.status === "checkout_iniciado" && "url" in data && typeof data.url === "string"
      && "expira_em" in data && typeof data.expira_em === "string" && Date.parse(data.expira_em) > Date.now()) {
      const url = new URL(data.url);
      if (url.protocol === "https:" && url.host === "pagamento.sandbox.pagbank.com.br" && url.pathname === "/pagamento"
        && !url.username && !url.password && !url.hash && url.searchParams.get("code")) return url.href;
    }
  }
  throw new Error("Resposta de pagamento inválida");
}
export async function registrationRequest(endpoint: string, token: string, body?: Record<string, unknown>): Promise<RegistrationStatus | null> {
  const response = await fetch(endpoint, {
    method: body ? "POST" : "GET", credentials: "omit", cache: "no-store", redirect: "error",
    headers: { "Content-Type": "application/json", "X-Registration-Token": token },
    ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(15000),
  });
  const data: unknown = await response.json();
  if (!response.ok) throw new RegistrationError(response.status,
    typeof data === "object" && data && "error" in data && typeof data.error === "string" ? data.error : "servico_indisponivel");
  if (body) {
    if (response.status !== 202 || !data || typeof data !== "object" || !("status" in data) || data.status !== "solicitacao_recebida") throw new Error("Resposta inválida");
    return null;
  }
  if (!data || typeof data !== "object" || !("etapa_funil" in data) || typeof data.etapa_funil !== "string"
    || !("valor_centavos" in data) || typeof data.valor_centavos !== "number" || !Number.isSafeInteger(data.valor_centavos)
    || data.valor_centavos <= 0 || !("moeda" in data) || data.moeda !== "BRL"
    || !("sessao_expira_em" in data) || typeof data.sessao_expira_em !== "string"
    || !Number.isFinite(Date.parse(data.sessao_expira_em)) || Date.parse(data.sessao_expira_em) <= Date.now()) throw new Error("Resposta inválida");
  return { etapa_funil: data.etapa_funil, valor_centavos: data.valor_centavos, moeda: data.moeda, sessao_expira_em: data.sessao_expira_em };
}
