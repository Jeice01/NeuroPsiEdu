-- Fase 2.2: o schema neuropsiedu é acessado exclusivamente por backend.
-- O frontend público chama Edge Functions e não recebe acesso SQL direto.

alter table neuropsiedu.leads_formacoes enable row level security;
alter table neuropsiedu.leads_formacoes force row level security;

alter table neuropsiedu.espera_pos enable row level security;
alter table neuropsiedu.espera_pos force row level security;

alter table neuropsiedu.lead_rate_limit_events enable row level security;
alter table neuropsiedu.lead_rate_limit_events force row level security;

-- Remove acesso direto, inclusive grants antigos criados pelo Dashboard.
revoke all on schema neuropsiedu from public, anon, authenticated;

revoke all on all tables in schema neuropsiedu
  from public, anon, authenticated;

revoke all on all sequences in schema neuropsiedu
  from public, anon, authenticated;

revoke all on all functions in schema neuropsiedu
  from public, anon, authenticated;

-- Impede que objetos futuros voltem a receber privilégios públicos por padrão.
alter default privileges for role postgres in schema neuropsiedu
  revoke all on tables from public, anon, authenticated;

alter default privileges for role postgres in schema neuropsiedu
  revoke all on sequences from public, anon, authenticated;

alter default privileges for role postgres in schema neuropsiedu
  revoke all on functions from public, anon, authenticated;

-- A Edge Function precisa somente inserir leads e administrar contadores
-- efêmeros de rate limiting. Leitura, update e delete de leads permanecem
-- reservados aos papéis administrativos do banco.
revoke all on schema neuropsiedu from service_role;
grant usage on schema neuropsiedu to service_role;

revoke all on all tables in schema neuropsiedu from service_role;
revoke all on all sequences in schema neuropsiedu from service_role;
revoke all on all functions in schema neuropsiedu from service_role;

grant insert on table neuropsiedu.leads_formacoes to service_role;
grant insert on table neuropsiedu.espera_pos to service_role;

grant select, insert, delete
  on table neuropsiedu.lead_rate_limit_events
  to service_role;

grant usage, select
  on sequence neuropsiedu.lead_rate_limit_events_id_seq
  to service_role;

-- Função de trigger não é exposta como RPC para clientes públicos.
grant execute on function neuropsiedu.set_updated_at() to service_role;

-- Corrige o único alerta de search_path mutável retornado pelo advisor. A
-- função usa apenas NOW() e os campos de NEW, portanto não depende de schema.
alter function public.update_updated_at_column() set search_path = '';
