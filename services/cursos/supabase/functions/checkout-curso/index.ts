import { createRpc } from "../cadastro-curso/adapters.ts";
import { createCheckoutHandler } from "./handler.ts";
import { createPagBank } from "./pagbank.ts";

const required = (name: string) => {
  const value = Deno.env.get(name)?.trim();
  if (!value) throw new Error(`Configuracao obrigatoria ausente: ${name}`);
  return value;
};
// Sandbox only. Production needs webhook/reconciliation and explicit release configuration.
const enabled = Deno.env.get("CURSOS_CHECKOUT_SANDBOX_ENABLED") === "true";
Deno.serve(createCheckoutHandler({
  origins: required("CURSOS_ALLOWED_ORIGINS").split(",").map((origin) =>
    origin.trim()
  ),
  enabled,
}, {
  rpc: createRpc(
    required("SUPABASE_URL"),
    required("SUPABASE_SERVICE_ROLE_KEY"),
  ),
  createCheckout: enabled
    ? createPagBank({
      token: required("PAGBANK_SANDBOX_TOKEN"),
      returnUrl: required("CURSOS_CHECKOUT_RETURN_URL"),
      webhookUrl: required("CURSOS_PAGBANK_WEBHOOK_URL"),
    })
    : async () => {
      throw new Error("Checkout desabilitado");
    },
}));
