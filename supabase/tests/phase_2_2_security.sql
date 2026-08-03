do $$
declare
  target_table text;
begin
  foreach target_table in array array[
    'leads_formacoes',
    'espera_pos',
    'lead_rate_limit_events'
  ]
  loop
    if has_table_privilege(
      'anon',
      format('neuropsiedu.%I', target_table),
      'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER'
    ) then
      raise exception 'anon still has privileges on %', target_table;
    end if;

    if has_table_privilege(
      'authenticated',
      format('neuropsiedu.%I', target_table),
      'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER'
    ) then
      raise exception 'authenticated still has privileges on %', target_table;
    end if;
  end loop;

  if has_schema_privilege('anon', 'neuropsiedu', 'USAGE') then
    raise exception 'anon still has schema usage';
  end if;

  if has_schema_privilege('authenticated', 'neuropsiedu', 'USAGE') then
    raise exception 'authenticated still has schema usage';
  end if;

  if not has_schema_privilege('service_role', 'neuropsiedu', 'USAGE') then
    raise exception 'service_role lacks schema usage';
  end if;

  if not has_table_privilege(
    'service_role',
    'neuropsiedu.leads_formacoes',
    'INSERT'
  ) or has_table_privilege(
    'service_role',
    'neuropsiedu.leads_formacoes',
    'SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER'
  ) then
    raise exception 'unexpected service_role grants on leads_formacoes';
  end if;

  if not has_table_privilege(
    'service_role',
    'neuropsiedu.espera_pos',
    'INSERT'
  ) or has_table_privilege(
    'service_role',
    'neuropsiedu.espera_pos',
    'SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER'
  ) then
    raise exception 'unexpected service_role grants on espera_pos';
  end if;

  if not has_table_privilege(
    'service_role',
    'neuropsiedu.lead_rate_limit_events',
    'SELECT,INSERT,DELETE'
  ) or has_table_privilege(
    'service_role',
    'neuropsiedu.lead_rate_limit_events',
    'UPDATE,TRUNCATE,REFERENCES,TRIGGER'
  ) then
    raise exception 'unexpected service_role grants on rate limits';
  end if;

  if exists (
    select 1
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'neuropsiedu'
      and c.relkind in ('r', 'p')
      and (not c.relrowsecurity or not c.relforcerowsecurity)
  ) then
    raise exception 'a neuropsiedu table lacks forced RLS';
  end if;

  if exists (
    select 1
    from pg_policies
    where schemaname = 'neuropsiedu'
  ) then
    raise exception 'neuropsiedu unexpectedly exposes an RLS policy';
  end if;

  if exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'neuropsiedu'
      and p.prosecdef
  ) then
    raise exception 'security definer function found in neuropsiedu';
  end if;
end
$$;
