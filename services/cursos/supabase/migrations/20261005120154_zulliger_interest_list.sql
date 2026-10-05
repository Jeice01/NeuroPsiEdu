BEGIN;

CREATE TABLE public.interesses_curso (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  numero bigint GENERATED ALWAYS AS IDENTITY UNIQUE,
  turma_id uuid NOT NULL REFERENCES public.turmas(id) ON DELETE RESTRICT,
  nome text NOT NULL CHECK (char_length(btrim(nome)) BETWEEN 2 AND 120),
  email text NOT NULL CHECK (email = lower(btrim(email)) AND char_length(email) <= 254
    AND email ~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'),
  telefone text NOT NULL CHECK (telefone ~ '^\+[1-9][0-9]{9,14}$'),
  perfil text NOT NULL CHECK (perfil IN ('psicologo','estudante')),
  pergunta text NOT NULL DEFAULT '' CHECK (char_length(pergunta) <= 1000),
  aceita_contato boolean NOT NULL CHECK (aceita_contato),
  aceita_grupo boolean NOT NULL DEFAULT false,
  privacidade_versao text NOT NULL CHECK (char_length(privacidade_versao) BETWEEN 1 AND 80),
  criado_em timestamptz NOT NULL DEFAULT clock_timestamp(),
  UNIQUE (turma_id,email)
);
ALTER TABLE public.interesses_curso ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.interesses_curso FROM PUBLIC,anon,authenticated;
GRANT SELECT,INSERT ON public.interesses_curso TO service_role;
GRANT USAGE,SELECT ON SEQUENCE public.interesses_curso_numero_seq TO service_role;

CREATE FUNCTION public.salvar_interesse_curso(
  p_turma_id uuid,p_nome text,p_email text,p_telefone text,p_perfil text,
  p_pergunta text,p_aceita_contato boolean,p_aceita_grupo boolean,p_privacidade_versao text
) RETURNS void LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.turmas t JOIN public.cursos c ON c.id=t.curso_id
    WHERE t.id=p_turma_id AND t.ativo AND c.ativo) THEN
    RAISE EXCEPTION USING ERRCODE='22023',MESSAGE='oferta_indisponivel';
  END IF;
  -- Repeated submissions never change another person's data or permissions.
  INSERT INTO public.interesses_curso(turma_id,nome,email,telefone,perfil,pergunta,
    aceita_contato,aceita_grupo,privacidade_versao)
  VALUES(p_turma_id,btrim(p_nome),p_email,p_telefone,p_perfil,p_pergunta,
    p_aceita_contato,p_aceita_grupo,p_privacidade_versao)
  ON CONFLICT(turma_id,email) DO NOTHING;
END;
$$;
REVOKE ALL ON FUNCTION public.salvar_interesse_curso(uuid,text,text,text,text,text,boolean,boolean,text)
  FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.salvar_interesse_curso(uuid,text,text,text,text,text,boolean,boolean,text)
  TO service_role;

-- Only trusted server-side automation can read personal data. A paid Sandbox
-- registration in another cohort can never confirm a real interest record.
CREATE VIEW public.lista_interesses_curso WITH (security_invoker=true) AS
SELECT l.id,l.numero,l.turma_id,t.nome AS turma,l.criado_em,l.nome,l.email,l.telefone,
  l.perfil,l.pergunta,l.aceita_contato,l.aceita_grupo,l.privacidade_versao,
  EXISTS(SELECT 1 FROM public.participantes p JOIN public.inscricoes i ON i.participante_id=p.id
    JOIN public.pagamentos pg ON pg.inscricao_id=i.id
    JOIN public.reservas r ON r.inscricao_id=i.id AND r.pagamento_id=pg.id
    WHERE lower(btrim(p.email))=l.email AND i.turma_id=l.turma_id
      AND i.etapa_funil='matricula_confirmada' AND NOT i.revisao_legado
      AND pg.status='pago' AND r.estado='confirmada') AS matricula_confirmada
FROM public.interesses_curso l JOIN public.turmas t ON t.id=l.turma_id;
REVOKE ALL ON public.lista_interesses_curso FROM PUBLIC,anon,authenticated;
GRANT SELECT ON public.lista_interesses_curso TO service_role;

COMMIT;
