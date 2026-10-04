import { createRpc } from '../cadastro-curso/adapters.ts';
import { createProvider } from '../pagbank-webhook/provider.ts';
import { createReconciler } from './handler.ts';
const required = (name: string) => {
  const value = Deno.env.get(name)?.trim();
  if (!value) throw new Error(`Configuracao ausente: ${name}`);
  return value;
};
Deno.serve(
  createReconciler(
    required('CURSOS_RECONCILIATION_SECRET'),
    createRpc(required('SUPABASE_URL'), required('SUPABASE_SERVICE_ROLE_KEY')),
    createProvider(required('PAGBANK_SANDBOX_TOKEN')).observe,
    Number(Deno.env.get('CURSOS_INACTIVITY_HOURS') || '24'),
  ),
);
