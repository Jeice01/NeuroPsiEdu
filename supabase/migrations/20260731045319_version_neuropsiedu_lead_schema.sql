-- Fase 2.1: schema de leads reproduzível.
--
-- Esta migration é intencionalmente compatível com a tabela
-- neuropsiedu.leads_formacoes que já existe em produção. Ela não concede
-- acesso aos papéis públicos; a revisão completa de grants, RLS e Data API
-- pertence à Fase 2.2.

create schema if not exists neuropsiedu;

create table if not exists neuropsiedu.leads_formacoes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  whatsapp text not null,
  email text not null,
  perfil text,
  crp_ou_instituicao text,
  cidade_estado text,
  interesse_principal text,
  mensagem text,
  formacao_interesse text not null,
  pagina_origem text,
  botao_origem text,
  consentimento_contato boolean not null,
  status_lead text not null default 'novo',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  user_agent text,
  ip_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- A aplicação sempre envia consentimento explícito. Remover o default antigo
-- evita que novos registros sejam gravados sem uma decisão consciente.
alter table neuropsiedu.leads_formacoes
  alter column consentimento_contato drop default;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'leads_formacoes_nome_length_check'
      and conrelid = 'neuropsiedu.leads_formacoes'::regclass
  ) then
    alter table neuropsiedu.leads_formacoes
      add constraint leads_formacoes_nome_length_check
      check (char_length(nome) between 6 and 180);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'leads_formacoes_whatsapp_format_check'
      and conrelid = 'neuropsiedu.leads_formacoes'::regclass
  ) then
    alter table neuropsiedu.leads_formacoes
      add constraint leads_formacoes_whatsapp_format_check
      check (whatsapp ~ '^[0-9]{11}$');
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'leads_formacoes_email_format_check'
      and conrelid = 'neuropsiedu.leads_formacoes'::regclass
  ) then
    alter table neuropsiedu.leads_formacoes
      add constraint leads_formacoes_email_format_check
      check (
        char_length(email) <= 254
        and email = lower(email)
        and email ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
      );
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'leads_formacoes_optional_lengths_check'
      and conrelid = 'neuropsiedu.leads_formacoes'::regclass
  ) then
    alter table neuropsiedu.leads_formacoes
      add constraint leads_formacoes_optional_lengths_check
      check (
        char_length(coalesce(perfil, '')) <= 120
        and char_length(coalesce(crp_ou_instituicao, '')) <= 180
        and char_length(coalesce(cidade_estado, '')) <= 180
        and char_length(coalesce(interesse_principal, '')) <= 220
        and char_length(coalesce(mensagem, '')) <= 1200
        and char_length(coalesce(botao_origem, '')) <= 180
        and char_length(coalesce(utm_source, '')) <= 120
        and char_length(coalesce(utm_medium, '')) <= 120
        and char_length(coalesce(utm_campaign, '')) <= 180
        and char_length(coalesce(utm_content, '')) <= 180
        and char_length(coalesce(utm_term, '')) <= 180
        and char_length(coalesce(user_agent, '')) <= 500
      );
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'leads_formacoes_formation_check'
      and conrelid = 'neuropsiedu.leads_formacoes'::regclass
  ) then
    alter table neuropsiedu.leads_formacoes
      add constraint leads_formacoes_formation_check
      check (
        formacao_interesse in (
          '8ª Turma FANP',
          'Formação em Avaliação Psicológica para Manuseio de Arma de Fogo'
        )
      );
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'leads_formacoes_origin_check'
      and conrelid = 'neuropsiedu.leads_formacoes'::regclass
  ) then
    alter table neuropsiedu.leads_formacoes
      add constraint leads_formacoes_origin_check
      check (
        pagina_origem in (
          'https://neuropsiedu.com.br/fnp',
          'https://neuropsiedu.com.br/famaf'
        )
      );
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'leads_formacoes_consent_check'
      and conrelid = 'neuropsiedu.leads_formacoes'::regclass
  ) then
    alter table neuropsiedu.leads_formacoes
      add constraint leads_formacoes_consent_check
      check (consentimento_contato is true);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'leads_formacoes_status_check'
      and conrelid = 'neuropsiedu.leads_formacoes'::regclass
  ) then
    alter table neuropsiedu.leads_formacoes
      add constraint leads_formacoes_status_check
      check (
        status_lead in (
          'novo',
          'em_contato',
          'qualificado',
          'convertido',
          'descartado'
        )
      );
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'leads_formacoes_ip_hash_check'
      and conrelid = 'neuropsiedu.leads_formacoes'::regclass
  ) then
    alter table neuropsiedu.leads_formacoes
      add constraint leads_formacoes_ip_hash_check
      check (ip_hash is null or char_length(ip_hash) = 64);
  end if;
end
$$;

create index if not exists idx_leads_formacoes_created_at
  on neuropsiedu.leads_formacoes (created_at desc);

create index if not exists idx_leads_formacoes_email
  on neuropsiedu.leads_formacoes (email);

create index if not exists idx_leads_formacoes_whatsapp
  on neuropsiedu.leads_formacoes (whatsapp);

create index if not exists idx_leads_formacoes_status
  on neuropsiedu.leads_formacoes (status_lead);

create index if not exists idx_leads_formacoes_formation_created_at
  on neuropsiedu.leads_formacoes (formacao_interesse, created_at desc);

-- Um mesmo contato pode se inscrever novamente depois que o lead deixa de
-- estar em estado "novo", mas não pode gerar dois leads ativos idênticos.
create unique index if not exists leads_formacoes_active_email_formation_uidx
  on neuropsiedu.leads_formacoes (lower(email), formacao_interesse)
  where status_lead = 'novo';

create or replace function neuropsiedu.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_leads_formacoes_updated_at
  on neuropsiedu.leads_formacoes;

create trigger trg_leads_formacoes_updated_at
before update on neuropsiedu.leads_formacoes
for each row
execute function neuropsiedu.set_updated_at();

alter table neuropsiedu.leads_formacoes enable row level security;

comment on table neuropsiedu.leads_formacoes is
  'Leads captados pelas formações NeuroPsiEdu; contém dados pessoais.';

create table if not exists neuropsiedu.espera_pos (
  id uuid primary key default gen_random_uuid(),
  nome text not null
    check (char_length(nome) between 2 and 180),
  telefone text not null
    check (char_length(regexp_replace(telefone, '[^0-9]', '', 'g')) between 10 and 11),
  email text not null
    check (
      char_length(email) <= 254
      and email = lower(email)
      and email ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
    ),
  is_psicologo text not null
    check (is_psicologo in ('sim', 'não')),
  origem text not null default 'pos-graduacao'
    check (origem = 'pos-graduacao'),
  consentimento_contato boolean not null
    check (consentimento_contato is true),
  status_lead text not null default 'novo'
    check (
      status_lead in (
        'novo',
        'em_contato',
        'qualificado',
        'convertido',
        'descartado'
      )
    ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_espera_pos_created_at
  on neuropsiedu.espera_pos (created_at desc);

create index if not exists idx_espera_pos_status
  on neuropsiedu.espera_pos (status_lead);

create unique index if not exists espera_pos_active_email_uidx
  on neuropsiedu.espera_pos (lower(email))
  where status_lead = 'novo';

drop trigger if exists trg_espera_pos_updated_at
  on neuropsiedu.espera_pos;

create trigger trg_espera_pos_updated_at
before update on neuropsiedu.espera_pos
for each row
execute function neuropsiedu.set_updated_at();

alter table neuropsiedu.espera_pos enable row level security;

comment on table neuropsiedu.espera_pos is
  'Lista de espera da pós-graduação; contém dados pessoais.';

-- Privilégio mínimo necessário para as Edge Functions. A Fase 2.2 revisará
-- explicitamente todos os grants e políticas do schema.
grant usage on schema neuropsiedu to service_role;
grant select, insert, update on table neuropsiedu.leads_formacoes
  to service_role;
grant select, insert, update on table neuropsiedu.espera_pos
  to service_role;
