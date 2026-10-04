BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

-- Only the backend can rotate capabilities after Supabase Auth verifies the email.
GRANT UPDATE ON public.sessoes_cadastro TO service_role;
CREATE FUNCTION public.recuperar_cadastro_curso(p_email text, p_turma_id uuid, p_token_hash text)
RETURNS void LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  v_participante uuid;
  v_inscricao uuid;
BEGIN
  IF p_email IS NULL OR p_email <> lower(btrim(p_email)) OR p_turma_id IS NULL
     OR p_token_hash IS NULL OR p_token_hash !~ '^[a-f0-9]{64}$' THEN
    RAISE EXCEPTION USING ERRCODE='22023', MESSAGE='parametros_invalidos';
  END IF;
  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_token_hash,21));
  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_email,22));
  -- Do not guess ownership when legacy normalized emails collide.
  IF (SELECT count(*) FROM public.participantes WHERE lower(btrim(email))=p_email) <> 1 THEN RETURN; END IF;
  SELECT id INTO v_participante FROM public.participantes WHERE lower(btrim(email))=p_email;
  SELECT id INTO v_inscricao FROM public.inscricoes
    WHERE participante_id=v_participante AND turma_id=p_turma_id FOR UPDATE;
  IF NOT FOUND THEN RETURN; END IF;
  IF EXISTS (SELECT 1 FROM public.sessoes_cadastro WHERE token_hash=p_token_hash AND inscricao_id<>v_inscricao) THEN
    RAISE EXCEPTION USING ERRCODE='22023', MESSAGE='autorizacao_invalida';
  END IF;
  INSERT INTO public.sessoes_cadastro(token_hash,requisicao_hash,inscricao_id)
    VALUES (p_token_hash,p_token_hash,v_inscricao)
  ON CONFLICT(inscricao_id) DO UPDATE SET token_hash=excluded.token_hash,
    requisicao_hash=excluded.requisicao_hash,criada_em=now(),expira_em=now()+interval '24 hours';
END;
$$;
REVOKE ALL ON FUNCTION public.recuperar_cadastro_curso(text,uuid,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.recuperar_cadastro_curso(text,uuid,text) TO service_role;
-- Historical stages are preserved, but unreviewed records must not imply verified payment in the UI.
CREATE OR REPLACE FUNCTION public.consultar_cadastro_curso(p_token_hash text)
RETURNS jsonb LANGUAGE sql STABLE SECURITY INVOKER SET search_path = '' AS $$
  SELECT jsonb_build_object('etapa_funil',CASE WHEN i.revisao_legado THEN 'revisao_necessaria' ELSE i.etapa_funil END,
    'valor_centavos',(i.valor_cobrado*100)::bigint,'moeda','BRL','sessao_expira_em',s.expira_em)
  FROM public.sessoes_cadastro s JOIN public.inscricoes i ON i.id=s.inscricao_id
  WHERE s.token_hash=p_token_hash AND s.expira_em>now();
$$;
COMMIT;
