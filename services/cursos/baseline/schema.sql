-- Captured schema only; no production rows. For isolated test databases ONLY.
DO $$ BEGIN
  IF current_database() NOT LIKE 'cursos_test_%' THEN
    RAISE EXCEPTION 'Baseline restricted to cursos_test_* databases';
  END IF;
END $$;
SET search_path = public, pg_catalog;

CREATE TABLE public."aceites_autorizacoes" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "inscricao_id" uuid NOT NULL,
  "termo_versao" text NOT NULL,
  "aceita_marketing" boolean DEFAULT false,
  "aceita_imagem" boolean DEFAULT false,
  "data_aceite" timestamp with time zone DEFAULT now()
);

CREATE TABLE public."comunicacoes" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "inscricao_id" uuid NOT NULL,
  "canal" text NOT NULL,
  "tipo" text NOT NULL,
  "status" text DEFAULT 'pendente'::text,
  "tentativas" integer DEFAULT 0,
  "erro_log" text,
  "criado_em" timestamp with time zone DEFAULT now(),
  "atualizado_em" timestamp with time zone DEFAULT now()
);

CREATE TABLE public."cursos" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "nome" text NOT NULL,
  "descricao" text,
  "ativo" boolean DEFAULT true
);

CREATE TABLE public."eventos_pagamento" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "pagamento_id" uuid NOT NULL,
  "status_reportado" text NOT NULL,
  "x_authenticity_token" text,
  "processado_em" timestamp with time zone DEFAULT now()
);

CREATE TABLE public."inscricoes" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "participante_id" uuid NOT NULL,
  "turma_id" uuid NOT NULL,
  "etapa_funil" text DEFAULT 'lead_capturado'::text,
  "valor_cobrado" numeric NOT NULL,
  "reserva_expira_em" timestamp with time zone,
  "criada_em" timestamp with time zone DEFAULT now()
);

CREATE TABLE public."pagamentos" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "inscricao_id" uuid NOT NULL,
  "pagbank_pedido_id" text,
  "status" text DEFAULT 'pendente'::text,
  "criado_em" timestamp with time zone DEFAULT now(),
  "atualizado_em" timestamp with time zone DEFAULT now()
);

CREATE TABLE public."participantes" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "nome" text NOT NULL,
  "email" text NOT NULL,
  "telefone" text,
  "criado_em" timestamp with time zone DEFAULT now()
);

CREATE TABLE public."turmas" (
  "id" uuid DEFAULT gen_random_uuid() NOT NULL,
  "curso_id" uuid NOT NULL,
  "nome" text NOT NULL,
  "preco" numeric NOT NULL,
  "vagas_limite" integer NOT NULL,
  "local" text,
  "orientacoes" text,
  "data_abertura" timestamp with time zone,
  "ativo" boolean DEFAULT true,
  "criado_em" timestamp with time zone DEFAULT now()
);

ALTER TABLE public."aceites_autorizacoes" ADD CONSTRAINT "aceites_autorizacoes_pkey" PRIMARY KEY (id);
ALTER TABLE public."comunicacoes" ADD CONSTRAINT "comunicacoes_pkey" PRIMARY KEY (id);
ALTER TABLE public."cursos" ADD CONSTRAINT "cursos_pkey" PRIMARY KEY (id);
ALTER TABLE public."eventos_pagamento" ADD CONSTRAINT "eventos_pagamento_pkey" PRIMARY KEY (id);
ALTER TABLE public."inscricoes" ADD CONSTRAINT "inscricoes_pkey" PRIMARY KEY (id);
ALTER TABLE public."inscricoes" ADD CONSTRAINT "unica_inscricao_turma" UNIQUE (participante_id, turma_id);
ALTER TABLE public."pagamentos" ADD CONSTRAINT "pagamentos_pkey" PRIMARY KEY (id);
ALTER TABLE public."participantes" ADD CONSTRAINT "participantes_email_key" UNIQUE (email);
ALTER TABLE public."participantes" ADD CONSTRAINT "participantes_pkey" PRIMARY KEY (id);
ALTER TABLE public."turmas" ADD CONSTRAINT "turmas_pkey" PRIMARY KEY (id);
ALTER TABLE public."aceites_autorizacoes" ADD CONSTRAINT "aceites_autorizacoes_inscricao_id_fkey" FOREIGN KEY (inscricao_id) REFERENCES inscricoes(id);
ALTER TABLE public."comunicacoes" ADD CONSTRAINT "comunicacoes_inscricao_id_fkey" FOREIGN KEY (inscricao_id) REFERENCES inscricoes(id);
ALTER TABLE public."eventos_pagamento" ADD CONSTRAINT "eventos_pagamento_pagamento_id_fkey" FOREIGN KEY (pagamento_id) REFERENCES pagamentos(id);
ALTER TABLE public."inscricoes" ADD CONSTRAINT "inscricoes_participante_id_fkey" FOREIGN KEY (participante_id) REFERENCES participantes(id);
ALTER TABLE public."inscricoes" ADD CONSTRAINT "inscricoes_turma_id_fkey" FOREIGN KEY (turma_id) REFERENCES turmas(id);
ALTER TABLE public."pagamentos" ADD CONSTRAINT "pagamentos_inscricao_id_fkey" FOREIGN KEY (inscricao_id) REFERENCES inscricoes(id);
ALTER TABLE public."turmas" ADD CONSTRAINT "turmas_curso_id_fkey" FOREIGN KEY (curso_id) REFERENCES cursos(id);
ALTER TABLE public."inscricoes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."pagamentos" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."cursos" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."turmas" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."participantes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."aceites_autorizacoes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."eventos_pagamento" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."comunicacoes" ENABLE ROW LEVEL SECURITY;
GRANT DELETE ON public."aceites_autorizacoes" TO "anon";
GRANT INSERT ON public."aceites_autorizacoes" TO "anon";
GRANT REFERENCES ON public."aceites_autorizacoes" TO "anon";
GRANT SELECT ON public."aceites_autorizacoes" TO "anon";
GRANT TRIGGER ON public."aceites_autorizacoes" TO "anon";
GRANT TRUNCATE ON public."aceites_autorizacoes" TO "anon";
GRANT UPDATE ON public."aceites_autorizacoes" TO "anon";
GRANT DELETE ON public."aceites_autorizacoes" TO "authenticated";
GRANT INSERT ON public."aceites_autorizacoes" TO "authenticated";
GRANT REFERENCES ON public."aceites_autorizacoes" TO "authenticated";
GRANT SELECT ON public."aceites_autorizacoes" TO "authenticated";
GRANT TRIGGER ON public."aceites_autorizacoes" TO "authenticated";
GRANT TRUNCATE ON public."aceites_autorizacoes" TO "authenticated";
GRANT UPDATE ON public."aceites_autorizacoes" TO "authenticated";
GRANT DELETE ON public."aceites_autorizacoes" TO "service_role";
GRANT INSERT ON public."aceites_autorizacoes" TO "service_role";
GRANT REFERENCES ON public."aceites_autorizacoes" TO "service_role";
GRANT SELECT ON public."aceites_autorizacoes" TO "service_role";
GRANT TRIGGER ON public."aceites_autorizacoes" TO "service_role";
GRANT TRUNCATE ON public."aceites_autorizacoes" TO "service_role";
GRANT UPDATE ON public."aceites_autorizacoes" TO "service_role";
GRANT DELETE ON public."comunicacoes" TO "anon";
GRANT INSERT ON public."comunicacoes" TO "anon";
GRANT REFERENCES ON public."comunicacoes" TO "anon";
GRANT SELECT ON public."comunicacoes" TO "anon";
GRANT TRIGGER ON public."comunicacoes" TO "anon";
GRANT TRUNCATE ON public."comunicacoes" TO "anon";
GRANT UPDATE ON public."comunicacoes" TO "anon";
GRANT DELETE ON public."comunicacoes" TO "authenticated";
GRANT INSERT ON public."comunicacoes" TO "authenticated";
GRANT REFERENCES ON public."comunicacoes" TO "authenticated";
GRANT SELECT ON public."comunicacoes" TO "authenticated";
GRANT TRIGGER ON public."comunicacoes" TO "authenticated";
GRANT TRUNCATE ON public."comunicacoes" TO "authenticated";
GRANT UPDATE ON public."comunicacoes" TO "authenticated";
GRANT DELETE ON public."comunicacoes" TO "service_role";
GRANT INSERT ON public."comunicacoes" TO "service_role";
GRANT REFERENCES ON public."comunicacoes" TO "service_role";
GRANT SELECT ON public."comunicacoes" TO "service_role";
GRANT TRIGGER ON public."comunicacoes" TO "service_role";
GRANT TRUNCATE ON public."comunicacoes" TO "service_role";
GRANT UPDATE ON public."comunicacoes" TO "service_role";
GRANT DELETE ON public."cursos" TO "anon";
GRANT INSERT ON public."cursos" TO "anon";
GRANT REFERENCES ON public."cursos" TO "anon";
GRANT SELECT ON public."cursos" TO "anon";
GRANT TRIGGER ON public."cursos" TO "anon";
GRANT TRUNCATE ON public."cursos" TO "anon";
GRANT UPDATE ON public."cursos" TO "anon";
GRANT DELETE ON public."cursos" TO "authenticated";
GRANT INSERT ON public."cursos" TO "authenticated";
GRANT REFERENCES ON public."cursos" TO "authenticated";
GRANT SELECT ON public."cursos" TO "authenticated";
GRANT TRIGGER ON public."cursos" TO "authenticated";
GRANT TRUNCATE ON public."cursos" TO "authenticated";
GRANT UPDATE ON public."cursos" TO "authenticated";
GRANT DELETE ON public."cursos" TO "service_role";
GRANT INSERT ON public."cursos" TO "service_role";
GRANT REFERENCES ON public."cursos" TO "service_role";
GRANT SELECT ON public."cursos" TO "service_role";
GRANT TRIGGER ON public."cursos" TO "service_role";
GRANT TRUNCATE ON public."cursos" TO "service_role";
GRANT UPDATE ON public."cursos" TO "service_role";
GRANT DELETE ON public."eventos_pagamento" TO "anon";
GRANT INSERT ON public."eventos_pagamento" TO "anon";
GRANT REFERENCES ON public."eventos_pagamento" TO "anon";
GRANT SELECT ON public."eventos_pagamento" TO "anon";
GRANT TRIGGER ON public."eventos_pagamento" TO "anon";
GRANT TRUNCATE ON public."eventos_pagamento" TO "anon";
GRANT UPDATE ON public."eventos_pagamento" TO "anon";
GRANT DELETE ON public."eventos_pagamento" TO "authenticated";
GRANT INSERT ON public."eventos_pagamento" TO "authenticated";
GRANT REFERENCES ON public."eventos_pagamento" TO "authenticated";
GRANT SELECT ON public."eventos_pagamento" TO "authenticated";
GRANT TRIGGER ON public."eventos_pagamento" TO "authenticated";
GRANT TRUNCATE ON public."eventos_pagamento" TO "authenticated";
GRANT UPDATE ON public."eventos_pagamento" TO "authenticated";
GRANT DELETE ON public."eventos_pagamento" TO "service_role";
GRANT INSERT ON public."eventos_pagamento" TO "service_role";
GRANT REFERENCES ON public."eventos_pagamento" TO "service_role";
GRANT SELECT ON public."eventos_pagamento" TO "service_role";
GRANT TRIGGER ON public."eventos_pagamento" TO "service_role";
GRANT TRUNCATE ON public."eventos_pagamento" TO "service_role";
GRANT UPDATE ON public."eventos_pagamento" TO "service_role";
GRANT DELETE ON public."inscricoes" TO "anon";
GRANT INSERT ON public."inscricoes" TO "anon";
GRANT REFERENCES ON public."inscricoes" TO "anon";
GRANT SELECT ON public."inscricoes" TO "anon";
GRANT TRIGGER ON public."inscricoes" TO "anon";
GRANT TRUNCATE ON public."inscricoes" TO "anon";
GRANT UPDATE ON public."inscricoes" TO "anon";
GRANT DELETE ON public."inscricoes" TO "authenticated";
GRANT INSERT ON public."inscricoes" TO "authenticated";
GRANT REFERENCES ON public."inscricoes" TO "authenticated";
GRANT SELECT ON public."inscricoes" TO "authenticated";
GRANT TRIGGER ON public."inscricoes" TO "authenticated";
GRANT TRUNCATE ON public."inscricoes" TO "authenticated";
GRANT UPDATE ON public."inscricoes" TO "authenticated";
GRANT DELETE ON public."inscricoes" TO "service_role";
GRANT INSERT ON public."inscricoes" TO "service_role";
GRANT REFERENCES ON public."inscricoes" TO "service_role";
GRANT SELECT ON public."inscricoes" TO "service_role";
GRANT TRIGGER ON public."inscricoes" TO "service_role";
GRANT TRUNCATE ON public."inscricoes" TO "service_role";
GRANT UPDATE ON public."inscricoes" TO "service_role";
GRANT DELETE ON public."pagamentos" TO "anon";
GRANT INSERT ON public."pagamentos" TO "anon";
GRANT REFERENCES ON public."pagamentos" TO "anon";
GRANT SELECT ON public."pagamentos" TO "anon";
GRANT TRIGGER ON public."pagamentos" TO "anon";
GRANT TRUNCATE ON public."pagamentos" TO "anon";
GRANT UPDATE ON public."pagamentos" TO "anon";
GRANT DELETE ON public."pagamentos" TO "authenticated";
GRANT INSERT ON public."pagamentos" TO "authenticated";
GRANT REFERENCES ON public."pagamentos" TO "authenticated";
GRANT SELECT ON public."pagamentos" TO "authenticated";
GRANT TRIGGER ON public."pagamentos" TO "authenticated";
GRANT TRUNCATE ON public."pagamentos" TO "authenticated";
GRANT UPDATE ON public."pagamentos" TO "authenticated";
GRANT DELETE ON public."pagamentos" TO "service_role";
GRANT INSERT ON public."pagamentos" TO "service_role";
GRANT REFERENCES ON public."pagamentos" TO "service_role";
GRANT SELECT ON public."pagamentos" TO "service_role";
GRANT TRIGGER ON public."pagamentos" TO "service_role";
GRANT TRUNCATE ON public."pagamentos" TO "service_role";
GRANT UPDATE ON public."pagamentos" TO "service_role";
GRANT DELETE ON public."participantes" TO "anon";
GRANT INSERT ON public."participantes" TO "anon";
GRANT REFERENCES ON public."participantes" TO "anon";
GRANT SELECT ON public."participantes" TO "anon";
GRANT TRIGGER ON public."participantes" TO "anon";
GRANT TRUNCATE ON public."participantes" TO "anon";
GRANT UPDATE ON public."participantes" TO "anon";
GRANT DELETE ON public."participantes" TO "authenticated";
GRANT INSERT ON public."participantes" TO "authenticated";
GRANT REFERENCES ON public."participantes" TO "authenticated";
GRANT SELECT ON public."participantes" TO "authenticated";
GRANT TRIGGER ON public."participantes" TO "authenticated";
GRANT TRUNCATE ON public."participantes" TO "authenticated";
GRANT UPDATE ON public."participantes" TO "authenticated";
GRANT DELETE ON public."participantes" TO "service_role";
GRANT INSERT ON public."participantes" TO "service_role";
GRANT REFERENCES ON public."participantes" TO "service_role";
GRANT SELECT ON public."participantes" TO "service_role";
GRANT TRIGGER ON public."participantes" TO "service_role";
GRANT TRUNCATE ON public."participantes" TO "service_role";
GRANT UPDATE ON public."participantes" TO "service_role";
GRANT DELETE ON public."turmas" TO "anon";
GRANT INSERT ON public."turmas" TO "anon";
GRANT REFERENCES ON public."turmas" TO "anon";
GRANT SELECT ON public."turmas" TO "anon";
GRANT TRIGGER ON public."turmas" TO "anon";
GRANT TRUNCATE ON public."turmas" TO "anon";
GRANT UPDATE ON public."turmas" TO "anon";
GRANT DELETE ON public."turmas" TO "authenticated";
GRANT INSERT ON public."turmas" TO "authenticated";
GRANT REFERENCES ON public."turmas" TO "authenticated";
GRANT SELECT ON public."turmas" TO "authenticated";
GRANT TRIGGER ON public."turmas" TO "authenticated";
GRANT TRUNCATE ON public."turmas" TO "authenticated";
GRANT UPDATE ON public."turmas" TO "authenticated";
GRANT DELETE ON public."turmas" TO "service_role";
GRANT INSERT ON public."turmas" TO "service_role";
GRANT REFERENCES ON public."turmas" TO "service_role";
GRANT SELECT ON public."turmas" TO "service_role";
GRANT TRIGGER ON public."turmas" TO "service_role";
GRANT TRUNCATE ON public."turmas" TO "service_role";
GRANT UPDATE ON public."turmas" TO "service_role";
