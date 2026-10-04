-- Incremental migration: retain existing tables, IDs and original column values.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

ALTER TABLE public.inscricoes
  ADD COLUMN revisao_legado boolean NOT NULL DEFAULT true,
  ADD COLUMN ultima_atividade_em timestamptz,
  ADD COLUMN motivo_etapa text;
ALTER TABLE public.inscricoes ALTER COLUMN revisao_legado SET DEFAULT false;
ALTER TABLE public.inscricoes ALTER COLUMN ultima_atividade_em SET DEFAULT now();
ALTER TABLE public.inscricoes ADD CONSTRAINT inscricoes_id_turma_key UNIQUE (id, turma_id);
ALTER TABLE public.inscricoes ADD CONSTRAINT inscricoes_etapa_check CHECK (
  etapa_funil IN ('lead_capturado', 'cadastro_sem_checkout', 'checkout_iniciado',
    'pagamento_pendente', 'pagamento_em_analise', 'matricula_confirmada',
    'checkout_abandonado', 'lista_espera', 'revisao_necessaria',
    'cancelada', 'reembolsada', 'expirado', 'alerta_overbooking')
) NOT VALID;
ALTER TABLE public.inscricoes VALIDATE CONSTRAINT inscricoes_etapa_check;

ALTER TABLE public.pagamentos
  ADD COLUMN idempotencia uuid,
  ADD COLUMN pagbank_checkout_id text,
  ADD COLUMN pagbank_cobranca_id text,
  ADD COLUMN valor_centavos bigint CHECK (valor_centavos > 0),
  ADD COLUMN moeda text CHECK (moeda = 'BRL'),
  ADD COLUMN estado_integracao text NOT NULL DEFAULT 'legado',
  ADD COLUMN expira_em timestamptz,
  ADD COLUMN ultima_conciliacao_em timestamptz,
  ADD COLUMN erro_codigo text,
  ADD CONSTRAINT pagamentos_id_inscricao_key UNIQUE (id, inscricao_id),
  ADD CONSTRAINT pagamentos_idempotencia_key UNIQUE (idempotencia),
  ADD CONSTRAINT pagamentos_checkout_key UNIQUE (pagbank_checkout_id),
  ADD CONSTRAINT pagamentos_cobranca_key UNIQUE (pagbank_cobranca_id),
  ADD CONSTRAINT pagamentos_integracao_check CHECK (
    estado_integracao IN ('legado', 'criando', 'criado', 'resultado_desconhecido', 'falha_definitiva')
  ),
  ADD CONSTRAINT pagamentos_nova_tentativa_completa CHECK (
    estado_integracao = 'legado' OR
      (idempotencia IS NOT NULL AND valor_centavos IS NOT NULL AND moeda IS NOT NULL)
  );
ALTER TABLE public.pagamentos ALTER COLUMN estado_integracao SET DEFAULT 'criando';
ALTER TABLE public.pagamentos ADD CONSTRAINT pagamentos_status_check CHECK (
  status IN ('pendente', 'em_analise', 'pago', 'recusado', 'cancelado', 'reembolsado', 'contestado')
) NOT VALID;
ALTER TABLE public.pagamentos VALIDATE CONSTRAINT pagamentos_status_check;

CREATE TABLE public.reservas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inscricao_id uuid NOT NULL,
  turma_id uuid NOT NULL,
  pagamento_id uuid NOT NULL UNIQUE,
  estado text NOT NULL DEFAULT 'ativa'
    CHECK (estado IN ('ativa', 'conciliacao', 'liberada', 'confirmada')),
  criada_em timestamptz NOT NULL DEFAULT now(),
  expira_em timestamptz NOT NULL,
  finalizada_em timestamptz,
  motivo text,
  FOREIGN KEY (inscricao_id, turma_id) REFERENCES public.inscricoes (id, turma_id),
  FOREIGN KEY (pagamento_id, inscricao_id) REFERENCES public.pagamentos (id, inscricao_id),
  CHECK (expira_em > criada_em),
  CHECK ((estado IN ('ativa', 'conciliacao') AND finalizada_em IS NULL)
      OR (estado IN ('liberada', 'confirmada') AND finalizada_em IS NOT NULL))
);
CREATE UNIQUE INDEX reservas_uma_aberta_por_inscricao ON public.reservas (inscricao_id)
  WHERE estado IN ('ativa', 'conciliacao');
CREATE INDEX reservas_ocupacao ON public.reservas (turma_id, estado, expira_em);

CREATE TABLE public.historico_inscricoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inscricao_id uuid NOT NULL REFERENCES public.inscricoes (id),
  etapa_anterior text,
  etapa_nova text,
  motivo text,
  registrado_em timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX historico_inscricoes_consulta ON public.historico_inscricoes (inscricao_id, registrado_em);

-- Historical events retain their values; new events may await payment correlation.
ALTER TABLE public.eventos_pagamento ALTER COLUMN pagamento_id DROP NOT NULL;
ALTER TABLE public.eventos_pagamento ALTER COLUMN processado_em DROP DEFAULT;
ALTER TABLE public.eventos_pagamento
  ADD COLUMN chave_deduplicacao text UNIQUE,
  ADD COLUMN provedor_evento_id text,
  ADD COLUMN provedor_objeto_id text,
  ADD COLUMN recebido_em timestamptz,
  ADD COLUMN processamento text NOT NULL DEFAULT 'legado',
  ADD COLUMN erro_codigo text,
  ADD CONSTRAINT eventos_processamento_check CHECK (
    processamento IN ('legado', 'recebido', 'aguardando_correlacao', 'processado', 'revisao')
  ),
  ADD CONSTRAINT eventos_processado_correlacionado CHECK (
    processamento <> 'processado' OR (pagamento_id IS NOT NULL AND processado_em IS NOT NULL)
  ),
  ADD CONSTRAINT eventos_novos_com_deduplicacao CHECK (
    processamento = 'legado' OR
      (chave_deduplicacao IS NOT NULL AND btrim(chave_deduplicacao) <> '')
  );
ALTER TABLE public.eventos_pagamento ALTER COLUMN recebido_em SET DEFAULT now();
ALTER TABLE public.eventos_pagamento ALTER COLUMN processamento SET DEFAULT 'recebido';

-- NULL on historical rows means unknown: migration must never infer consent.
ALTER TABLE public.aceites_autorizacoes
  ADD COLUMN aceita_termos boolean,
  ADD COLUMN aviso_privacidade_versao text;

CREATE INDEX inscricoes_turma_etapa_reserva
  ON public.inscricoes (turma_id, etapa_funil, reserva_expira_em);
CREATE INDEX inscricoes_funil_atividade ON public.inscricoes (etapa_funil, ultima_atividade_em);
CREATE INDEX pagamentos_inscricao ON public.pagamentos (inscricao_id);
CREATE INDEX pagamentos_pedido ON public.pagamentos (pagbank_pedido_id);
CREATE INDEX eventos_pagamento_correlacao ON public.eventos_pagamento (pagamento_id);
CREATE INDEX eventos_pagamento_pendentes ON public.eventos_pagamento (processamento, recebido_em)
  WHERE processamento IN ('recebido', 'aguardando_correlacao');
CREATE INDEX aceites_inscricao ON public.aceites_autorizacoes (inscricao_id);

COMMENT ON COLUMN public.inscricoes.revisao_legado IS
  'Existing registrations require review; migration does not infer payment or consent.';
COMMENT ON COLUMN public.eventos_pagamento.chave_deduplicacao IS
  'Stable event key validated by the backend. An order ID alone is not an event key.';
COMMENT ON COLUMN public.eventos_pagamento.x_authenticity_token IS
  'Legacy column retained. New integrations must not persist authentication secrets.';
COMMIT;
