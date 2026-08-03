do $$
declare
  first_lead_id uuid;
  first_waitlist_id uuid;
begin
  insert into neuropsiedu.leads_formacoes (
    nome,
    whatsapp,
    email,
    formacao_interesse,
    pagina_origem,
    consentimento_contato
  )
  values (
    'Pessoa Teste',
    '61999999999',
    'fase-2-1@example.test',
    '8ª Turma FANP',
    'https://neuropsiedu.com.br/fnp',
    true
  )
  returning id into first_lead_id;

  if first_lead_id is null then
    raise exception 'valid lead insert did not return an id';
  end if;

  begin
    insert into neuropsiedu.leads_formacoes (
      nome,
      whatsapp,
      email,
      formacao_interesse,
      pagina_origem,
      consentimento_contato
    )
    values (
      'Pessoa Teste Duplicada',
      '61988888888',
      'fase-2-1@example.test',
      '8ª Turma FANP',
      'https://neuropsiedu.com.br/fnp',
      true
    );
    raise exception 'active lead deduplication was not enforced';
  exception
    when unique_violation then
      null;
  end;

  begin
    insert into neuropsiedu.leads_formacoes (
      nome,
      whatsapp,
      email,
      formacao_interesse,
      pagina_origem,
      consentimento_contato
    )
    values (
      'Pessoa Teste',
      'telefone-invalido',
      'fase-2-1-invalid@example.test',
      '8ª Turma FANP',
      'https://neuropsiedu.com.br/fnp',
      true
    );
    raise exception 'invalid WhatsApp was accepted';
  exception
    when check_violation then
      null;
  end;

  insert into neuropsiedu.espera_pos (
    nome,
    telefone,
    email,
    is_psicologo,
    consentimento_contato
  )
  values (
    'Pessoa Teste',
    '(61) 99999-9999',
    'espera-fase-2-1@example.test',
    'sim',
    true
  )
  returning id into first_waitlist_id;

  if first_waitlist_id is null then
    raise exception 'valid waitlist insert did not return an id';
  end if;

  begin
    insert into neuropsiedu.espera_pos (
      nome,
      telefone,
      email,
      is_psicologo,
      consentimento_contato
    )
    values (
      'Pessoa Teste Duplicada',
      '(61) 98888-8888',
      'espera-fase-2-1@example.test',
      'sim',
      true
    );
    raise exception 'active waitlist deduplication was not enforced';
  exception
    when unique_violation then
      null;
  end;

  delete from neuropsiedu.leads_formacoes
  where email in (
    'fase-2-1@example.test',
    'fase-2-1-invalid@example.test'
  );

  delete from neuropsiedu.espera_pos
  where email = 'espera-fase-2-1@example.test';
end
$$;
