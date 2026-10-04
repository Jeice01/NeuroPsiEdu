import { createRpc } from '../cadastro-curso/adapters.ts';
import { createProvider } from './provider.ts';
import { createWebhook } from './handler.ts';
const required = (name: string) => {
  const value = Deno.env.get(name)?.trim();
  if (!value) throw new Error(`Configuracao ausente: ${name}`);
  return value;
};
Deno.serve(
  createWebhook({
    diagnostic: (entry) => console.info(JSON.stringify(entry)),
    rpc: createRpc(required('SUPABASE_URL'), required('SUPABASE_SERVICE_ROLE_KEY')),
    ...createProvider(
      required('PAGBANK_SANDBOX_TOKEN'),
      fetch,
      Deno.env.get('PAGBANK_WEBHOOK_SIGNATURE_MODE') ?? 'ecdsa',
    ),
  }),
);
