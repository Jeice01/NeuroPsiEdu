export type Attempt = {
  pagamento_id: string;
  inscricao_id: string;
  turma_id: string;
  nome: string;
  valor_centavos: number;
  expira_em: string;
};
export type CheckoutResult =
  | { resultado: "criado"; id: string; url: string; expira_em: string }
  | { resultado: "falha_definitiva" | "resultado_desconhecido" };

export function object(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function sandboxPaymentUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 2048) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      url.host === "pagamento.sandbox.pagbank.com.br" &&
      url.pathname === "/pagamento" && !url.username && !url.password &&
      !url.hash &&
      Boolean(url.searchParams.get("code")) && !/\s/.test(value);
  } catch {
    return false;
  }
}

type Config = { token: string; returnUrl: string; webhookUrl: string };
export function createPagBank(config: Config, transport: typeof fetch = fetch) {
  const secureUrl = (value: string, max: number) => {
    const url = new URL(value);
    if (
      url.protocol !== "https:" || url.username || url.password || url.hash ||
      url.search || value.length > max
    ) {
      throw new Error("URL PagBank invalida");
    }
  };
  secureUrl(config.returnUrl, 255);
  secureUrl(config.webhookUrl, 100);
  if (!config.token.trim()) throw new Error("Token sandbox ausente");
  return async (attempt: Attempt): Promise<CheckoutResult> => {
    try {
      const response = await transport(
        "https://sandbox.api.pagseguro.com/checkouts",
        {
          method: "POST",
          redirect: "error",
          signal: AbortSignal.timeout(10000),
          headers: {
            Authorization: `Bearer ${config.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // One reference per financial attempt; the database preserves its registration relationship.
            reference_id: attempt.pagamento_id,
            expiration_date: attempt.expira_em,
            customer_modifiable: true,
            items: [{
              reference_id: attempt.turma_id,
              name: attempt.nome,
              description:
                `Inscrição individual para 1 participante. Curso: ${attempt.nome}. Realização: NeuroPsiEdu.`,
              image_url:
                "https://neuropsiedu.com.br/images/logo-vertical-600.webp",
              quantity: 1,
              unit_amount: attempt.valor_centavos,
            }],
            payment_methods: [{ type: "PIX" }, { type: "CREDIT_CARD" }],
            payment_methods_configs: [{
              type: "CREDIT_CARD",
              config_options: [
                { option: "INSTALLMENTS_LIMIT", value: "10" },
              ],
            }],
            redirect_url: config.returnUrl,
            return_url: config.returnUrl,
            notification_urls: [config.webhookUrl],
            payment_notification_urls: [config.webhookUrl],
          }),
        },
      );
      if ([400, 401, 403, 422].includes(response.status)) {
        return { resultado: "falha_definitiva" };
      }
      if (!response.ok) return { resultado: "resultado_desconhecido" };
      const body: unknown = await response.json();
      if (
        !object(body) || typeof body.id !== "string" ||
        !/^CHEC_[A-Za-z0-9-]{1,100}$/.test(body.id) ||
        body.reference_id !== attempt.pagamento_id ||
        body.status !== "ACTIVE" ||
        typeof body.expiration_date !== "string" ||
        !Number.isFinite(Date.parse(body.expiration_date)) ||
        Date.parse(body.expiration_date) > Date.parse(attempt.expira_em) ||
        Date.parse(body.expiration_date) <= Date.now() ||
        !Array.isArray(body.links)
      ) {
        return { resultado: "resultado_desconhecido" };
      }
      const payLinks = body.links.filter((link: unknown) =>
        object(link) && link.rel === "PAY"
      );
      const pay: unknown = payLinks[0];
      if (
        payLinks.length !== 1 || !object(pay) || pay.method !== "GET" ||
        !sandboxPaymentUrl(pay.href)
      ) {
        return { resultado: "resultado_desconhecido" };
      }
      return {
        resultado: "criado",
        id: body.id,
        url: pay.href,
        expira_em: body.expiration_date,
      };
    } catch {
      // A timeout or malformed success may have created a checkout. Never blindly retry.
      return { resultado: "resultado_desconhecido" };
    }
  };
}
