-- Read-only preflight. Zero rows means captured columns and constraints match.
-- Compare grants, RLS, functions and defaults separately with remote-schema.json.
WITH expected_columns(table_name, column_name, udt_name, is_nullable, column_default) AS (
  VALUES ('aceites_autorizacoes', 'id', 'uuid', 'NO', 'gen_random_uuid()'),
    ('aceites_autorizacoes', 'inscricao_id', 'uuid', 'NO', NULL),
    ('aceites_autorizacoes', 'termo_versao', 'text', 'NO', NULL),
    ('aceites_autorizacoes', 'aceita_marketing', 'bool', 'YES', 'false'),
    ('aceites_autorizacoes', 'aceita_imagem', 'bool', 'YES', 'false'),
    ('aceites_autorizacoes', 'data_aceite', 'timestamptz', 'YES', 'now()'),
    ('comunicacoes', 'id', 'uuid', 'NO', 'gen_random_uuid()'),
    ('comunicacoes', 'inscricao_id', 'uuid', 'NO', NULL),
    ('comunicacoes', 'canal', 'text', 'NO', NULL),
    ('comunicacoes', 'tipo', 'text', 'NO', NULL),
    ('comunicacoes', 'status', 'text', 'YES', '''pendente''::text'),
    ('comunicacoes', 'tentativas', 'int4', 'YES', '0'),
    ('comunicacoes', 'erro_log', 'text', 'YES', NULL),
    ('comunicacoes', 'criado_em', 'timestamptz', 'YES', 'now()'),
    ('comunicacoes', 'atualizado_em', 'timestamptz', 'YES', 'now()'),
    ('cursos', 'id', 'uuid', 'NO', 'gen_random_uuid()'),
    ('cursos', 'nome', 'text', 'NO', NULL),
    ('cursos', 'descricao', 'text', 'YES', NULL),
    ('cursos', 'ativo', 'bool', 'YES', 'true'),
    ('eventos_pagamento', 'id', 'uuid', 'NO', 'gen_random_uuid()'),
    ('eventos_pagamento', 'pagamento_id', 'uuid', 'NO', NULL),
    ('eventos_pagamento', 'status_reportado', 'text', 'NO', NULL),
    ('eventos_pagamento', 'x_authenticity_token', 'text', 'YES', NULL),
    ('eventos_pagamento', 'processado_em', 'timestamptz', 'YES', 'now()'),
    ('inscricoes', 'id', 'uuid', 'NO', 'gen_random_uuid()'),
    ('inscricoes', 'participante_id', 'uuid', 'NO', NULL),
    ('inscricoes', 'turma_id', 'uuid', 'NO', NULL),
    ('inscricoes', 'etapa_funil', 'text', 'YES', '''lead_capturado''::text'),
    ('inscricoes', 'valor_cobrado', 'numeric', 'NO', NULL),
    ('inscricoes', 'reserva_expira_em', 'timestamptz', 'YES', NULL),
    ('inscricoes', 'criada_em', 'timestamptz', 'YES', 'now()'),
    ('pagamentos', 'id', 'uuid', 'NO', 'gen_random_uuid()'),
    ('pagamentos', 'inscricao_id', 'uuid', 'NO', NULL),
    ('pagamentos', 'pagbank_pedido_id', 'text', 'YES', NULL),
    ('pagamentos', 'status', 'text', 'YES', '''pendente''::text'),
    ('pagamentos', 'criado_em', 'timestamptz', 'YES', 'now()'),
    ('pagamentos', 'atualizado_em', 'timestamptz', 'YES', 'now()'),
    ('participantes', 'id', 'uuid', 'NO', 'gen_random_uuid()'),
    ('participantes', 'nome', 'text', 'NO', NULL),
    ('participantes', 'email', 'text', 'NO', NULL),
    ('participantes', 'telefone', 'text', 'YES', NULL),
    ('participantes', 'criado_em', 'timestamptz', 'YES', 'now()'),
    ('turmas', 'id', 'uuid', 'NO', 'gen_random_uuid()'),
    ('turmas', 'curso_id', 'uuid', 'NO', NULL),
    ('turmas', 'nome', 'text', 'NO', NULL),
    ('turmas', 'preco', 'numeric', 'NO', NULL),
    ('turmas', 'vagas_limite', 'int4', 'NO', NULL),
    ('turmas', 'local', 'text', 'YES', NULL),
    ('turmas', 'orientacoes', 'text', 'YES', NULL),
    ('turmas', 'data_abertura', 'timestamptz', 'YES', NULL),
    ('turmas', 'ativo', 'bool', 'YES', 'true'),
    ('turmas', 'criado_em', 'timestamptz', 'YES', 'now()')
), actual_columns AS (
  SELECT table_name::text, column_name::text, udt_name::text, is_nullable::text, column_default::text
  FROM information_schema.columns WHERE table_schema = 'public'
), expected_constraints(table_name, constraint_name, definition) AS (
  VALUES ('aceites_autorizacoes', 'aceites_autorizacoes_inscricao_id_fkey', 'FOREIGN KEY (inscricao_id) REFERENCES inscricoes(id)'),
    ('aceites_autorizacoes', 'aceites_autorizacoes_pkey', 'PRIMARY KEY (id)'),
    ('comunicacoes', 'comunicacoes_inscricao_id_fkey', 'FOREIGN KEY (inscricao_id) REFERENCES inscricoes(id)'),
    ('comunicacoes', 'comunicacoes_pkey', 'PRIMARY KEY (id)'),
    ('cursos', 'cursos_pkey', 'PRIMARY KEY (id)'),
    ('eventos_pagamento', 'eventos_pagamento_pagamento_id_fkey', 'FOREIGN KEY (pagamento_id) REFERENCES pagamentos(id)'),
    ('eventos_pagamento', 'eventos_pagamento_pkey', 'PRIMARY KEY (id)'),
    ('inscricoes', 'inscricoes_participante_id_fkey', 'FOREIGN KEY (participante_id) REFERENCES participantes(id)'),
    ('inscricoes', 'inscricoes_pkey', 'PRIMARY KEY (id)'),
    ('inscricoes', 'inscricoes_turma_id_fkey', 'FOREIGN KEY (turma_id) REFERENCES turmas(id)'),
    ('inscricoes', 'unica_inscricao_turma', 'UNIQUE (participante_id, turma_id)'),
    ('pagamentos', 'pagamentos_inscricao_id_fkey', 'FOREIGN KEY (inscricao_id) REFERENCES inscricoes(id)'),
    ('pagamentos', 'pagamentos_pkey', 'PRIMARY KEY (id)'),
    ('participantes', 'participantes_email_key', 'UNIQUE (email)'),
    ('participantes', 'participantes_pkey', 'PRIMARY KEY (id)'),
    ('turmas', 'turmas_curso_id_fkey', 'FOREIGN KEY (curso_id) REFERENCES cursos(id)'),
    ('turmas', 'turmas_pkey', 'PRIMARY KEY (id)')
), actual_constraints AS (
  SELECT c.conrelid::regclass::text AS table_name, c.conname::text AS constraint_name,
    pg_get_constraintdef(c.oid) AS definition
  FROM pg_constraint c JOIN pg_namespace n ON n.oid=c.connamespace WHERE n.nspname='public'
)
SELECT 'column' AS kind, coalesce(e.table_name,a.table_name) AS table_name,
  coalesce(e.column_name,a.column_name) AS object_name,
  to_jsonb(e) AS expected, to_jsonb(a) AS actual
FROM expected_columns e FULL OUTER JOIN actual_columns a USING (table_name,column_name)
WHERE to_jsonb(e) IS DISTINCT FROM to_jsonb(a)
UNION ALL
SELECT 'constraint',coalesce(e.table_name,a.table_name),coalesce(e.constraint_name,a.constraint_name),
  to_jsonb(e),to_jsonb(a)
FROM expected_constraints e FULL OUTER JOIN actual_constraints a USING (table_name,constraint_name)
WHERE to_jsonb(e) IS DISTINCT FROM to_jsonb(a);
