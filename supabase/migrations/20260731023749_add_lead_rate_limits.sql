create table if not exists neuropsiedu.lead_rate_limit_events (
  id bigint generated always as identity primary key,
  scope text not null
    check (scope in ('ip', 'email', 'phone')),
  key_hash text not null
    check (char_length(key_hash) = 64),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  constraint lead_rate_limit_events_expiry_check
    check (expires_at > created_at)
);

comment on table neuropsiedu.lead_rate_limit_events is
  'Contadores efêmeros de abuso. Armazena somente hashes HMAC, nunca IP, e-mail ou telefone em texto puro.';

create index if not exists lead_rate_limit_events_lookup_idx
  on neuropsiedu.lead_rate_limit_events (scope, key_hash, created_at desc);

create index if not exists lead_rate_limit_events_expiry_idx
  on neuropsiedu.lead_rate_limit_events (expires_at);

alter table neuropsiedu.lead_rate_limit_events enable row level security;
alter table neuropsiedu.lead_rate_limit_events force row level security;

revoke all on table neuropsiedu.lead_rate_limit_events
  from public, anon, authenticated;

revoke all on sequence neuropsiedu.lead_rate_limit_events_id_seq
  from public, anon, authenticated;

grant select, insert, delete on table neuropsiedu.lead_rate_limit_events
  to service_role;

grant usage, select on sequence neuropsiedu.lead_rate_limit_events_id_seq
  to service_role;
