BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

-- Non-unique: preserve historical case/whitespace collisions for manual review.
CREATE INDEX participantes_email_normalizado ON public.participantes (lower(btrim(email)));
CREATE TABLE public.sessoes_cadastro (
  token_hash text PRIMARY KEY CHECK (token_hash ~ '^[a-f0-9]{64}$'),
  requisicao_hash text NOT NULL CHECK (requisicao_hash ~ '^[a-f0-9]{64}$'),
  inscricao_id uuid NOT NULL UNIQUE REFERENCES public.inscricoes(id),
  criada_em timestamptz NOT NULL DEFAULT now(),
  expira_em timestamptz NOT NULL DEFAULT now() + interval '24 hours',
  CHECK (expira_em > criada_em)
);
CREATE TABLE public.limites_cadastro (
  chave text PRIMARY KEY,
  inicio timestamptz NOT NULL,
  tentativas integer NOT NULL CHECK (tentativas > 0)
);
ALTER TABLE public.sessoes_cadastro ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.limites_cadastro ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.sessoes_cadastro, public.limites_cadastro FROM PUBLIC, anon, authenticated;
REVOKE ALL ON public.sessoes_cadastro, public.limites_cadastro FROM service_role;
GRANT SELECT, INSERT ON public.sessoes_cadastro TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.limites_cadastro TO service_role;

-- Shared counters survive restarts and multiple Edge Function instances.
-- HMAC keys avoid storing raw email addresses in the abuse-control table.
CREATE FUNCTION public.limitar_cadastro_curso(p_chave text, p_consulta boolean DEFAULT false)
RETURNS boolean LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  v_agora timestamptz := clock_timestamp();
  v_global integer;
  v_individual integer;
BEGIN
  IF p_chave IS NULL OR p_chave !~ '^[a-f0-9]{64}$' OR p_consulta IS NULL THEN
    RAISE EXCEPTION USING ERRCODE='22023', MESSAGE='parametros_invalidos';
  END IF;
  DELETE FROM public.limites_cadastro WHERE inicio < v_agora - interval '1 day';
  INSERT INTO public.limites_cadastro AS l VALUES ('global',v_agora,1)
  ON CONFLICT (chave) DO UPDATE SET
    inicio=CASE WHEN l.inicio <= v_agora - interval '1 minute' THEN v_agora ELSE l.inicio END,
    tentativas=CASE WHEN l.inicio <= v_agora - interval '1 minute' THEN 1 ELSE least(l.tentativas+1,301) END
  RETURNING tentativas INTO v_global;
  INSERT INTO public.limites_cadastro AS l VALUES
    ((CASE WHEN p_consulta THEN 'consulta:' ELSE 'cadastro:' END)||p_chave,v_agora,1)
  ON CONFLICT (chave) DO UPDATE SET
    inicio=CASE WHEN l.inicio <= v_agora - interval '15 minutes' THEN v_agora ELSE l.inicio END,
    tentativas=CASE WHEN l.inicio <= v_agora - interval '15 minutes' THEN 1 ELSE least(l.tentativas+1,61) END
  RETURNING tentativas INTO v_individual;
  RETURN v_global <= 300 AND v_individual <= CASE WHEN p_consulta THEN 60 ELSE 5 END;
END;
$$;

CREATE FUNCTION public.cadastrar_inscricao_curso(
  p_turma_id uuid, p_nome text, p_email text, p_telefone text,
  p_aceita_termos boolean, p_aceita_imagem boolean, p_aceita_marketing boolean,
  p_termo_versao text, p_privacidade_versao text, p_token_hash text, p_requisicao_hash text
)
RETURNS void LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  v_sessao public.sessoes_cadastro;
  v_turma public.turmas;
  v_participante uuid;
  v_inscricao uuid;
BEGIN
  IF p_turma_id IS NULL OR p_nome IS NULL OR char_length(btrim(p_nome)) NOT BETWEEN 2 AND 120
    OR p_email IS NULL OR char_length(p_email) > 254 OR p_email <> lower(btrim(p_email))
    OR p_email !~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
    OR p_telefone IS NULL OR p_telefone !~ '^\+[1-9][0-9]{9,14}$'
    OR p_aceita_termos IS DISTINCT FROM true OR p_aceita_imagem IS NULL OR p_aceita_marketing IS NULL
    OR p_termo_versao IS NULL OR char_length(btrim(p_termo_versao)) NOT BETWEEN 1 AND 80
    OR p_privacidade_versao IS NULL OR char_length(btrim(p_privacidade_versao)) NOT BETWEEN 1 AND 80
    OR p_token_hash IS NULL OR p_token_hash !~ '^[a-f0-9]{64}$'
    OR p_requisicao_hash IS NULL OR p_requisicao_hash !~ '^[a-f0-9]{64}$' THEN
    RAISE EXCEPTION USING ERRCODE='22023', MESSAGE='parametros_invalidos';
  END IF;
  -- Serialize retries using the same capability, then new identities by normalized email.
  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_token_hash, 21));
  SELECT * INTO v_sessao FROM public.sessoes_cadastro WHERE token_hash=p_token_hash;
  IF FOUND THEN
    IF v_sessao.requisicao_hash <> p_requisicao_hash THEN
      RAISE EXCEPTION USING ERRCODE='22023', MESSAGE='reenvio_divergente';
    END IF;
    RETURN; -- No stage, consent, personal data or expiry changes on replay.
  END IF;
  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_email, 22));
  SELECT * INTO v_turma FROM public.turmas WHERE id=p_turma_id FOR SHARE;
  IF NOT FOUND OR v_turma.ativo IS DISTINCT FROM true OR v_turma.preco <= 0
    OR v_turma.preco > 90071992547409.91
    OR v_turma.preco*100 <> trunc(v_turma.preco*100) OR NOT EXISTS
      (SELECT 1 FROM public.cursos WHERE id=v_turma.curso_id AND ativo=true) THEN
    RAISE EXCEPTION USING ERRCODE='22023', MESSAGE='oferta_indisponivel';
  END IF;
  -- Validate offer before identity lookup so invalid offers do not expose existing email addresses.
  -- Email knowledge alone never grants ownership, even for another class.
  IF EXISTS (SELECT 1 FROM public.participantes WHERE lower(btrim(email))=p_email) THEN
    RETURN;
  END IF;
  INSERT INTO public.participantes(nome,email,telefone)
    VALUES (btrim(p_nome),p_email,p_telefone) RETURNING id INTO v_participante;
  INSERT INTO public.inscricoes(participante_id,turma_id,valor_cobrado,etapa_funil,motivo_etapa)
    VALUES (v_participante,p_turma_id,v_turma.preco,'lead_capturado','cadastro_enviado')
    RETURNING id INTO v_inscricao;
  INSERT INTO public.aceites_autorizacoes(inscricao_id,termo_versao,aviso_privacidade_versao,
    aceita_termos,aceita_imagem,aceita_marketing)
    VALUES (v_inscricao,p_termo_versao,p_privacidade_versao,true,p_aceita_imagem,p_aceita_marketing);
  INSERT INTO public.sessoes_cadastro(token_hash,requisicao_hash,inscricao_id)
    VALUES (p_token_hash,p_requisicao_hash,v_inscricao);
END;
$$;

CREATE FUNCTION public.consultar_cadastro_curso(p_token_hash text)
RETURNS jsonb LANGUAGE sql STABLE SECURITY INVOKER SET search_path = '' AS $$
  SELECT jsonb_build_object('etapa_funil',i.etapa_funil,'valor_centavos',(i.valor_cobrado*100)::bigint,
    'moeda','BRL','sessao_expira_em',s.expira_em)
  FROM public.sessoes_cadastro s JOIN public.inscricoes i ON i.id=s.inscricao_id
  WHERE s.token_hash=p_token_hash AND s.expira_em>now();
$$;
REVOKE ALL ON FUNCTION public.limitar_cadastro_curso(text,boolean),
  public.cadastrar_inscricao_curso(uuid,text,text,text,boolean,boolean,boolean,text,text,text,text),
  public.consultar_cadastro_curso(text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.limitar_cadastro_curso(text,boolean),
  public.cadastrar_inscricao_curso(uuid,text,text,text,boolean,boolean,boolean,text,text,text,text),
  public.consultar_cadastro_curso(text) TO service_role;
COMMIT;
