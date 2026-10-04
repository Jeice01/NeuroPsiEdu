BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='30s';

ALTER TABLE public.comunicacoes ADD COLUMN envio_token uuid;
ALTER TABLE public.comunicacoes ADD COLUMN envio_iniciado_em timestamptz;
ALTER TABLE public.comunicacoes ADD COLUMN enviado_em timestamptz;
CREATE INDEX comunicacoes_confirmacao_pendente ON public.comunicacoes(criado_em,id)
  WHERE status='pendente' AND canal='email' AND tipo='matricula_confirmada';

-- Only the private worker may claim jobs. Existing communications and legacy rows are preserved.
CREATE FUNCTION public.preparar_confirmacao_sandbox(p_turma_id uuid,p_email text)
RETURNS TABLE(id uuid,envio_token uuid,email text,curso text,turma text)
LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $$
DECLARE v_id uuid;
BEGIN
  IF p_turma_id IS NULL OR p_email IS NULL OR p_email<>lower(btrim(p_email))
    OR char_length(p_email)>254 OR p_email !~ '^[^[:space:]@<>]+@[^[:space:]@<>]+[.][^[:space:]@<>]+$' THEN
    RAISE EXCEPTION 'configuracao_invalida';
  END IF;
  -- A crash after SMTP acceptance is ambiguous: quarantine instead of automatically duplicating delivery.
  UPDATE public.comunicacoes m SET status='revisao',erro_log='envio_incerto',atualizado_em=clock_timestamp()
    FROM public.inscricoes i JOIN public.participantes p ON p.id=i.participante_id
    JOIN public.turmas t ON t.id=i.turma_id JOIN public.cursos c ON c.id=t.curso_id
    WHERE m.inscricao_id=i.id AND i.turma_id=p_turma_id AND lower(btrim(p.email))=p_email
      AND t.nome LIKE 'SANDBOX%' AND c.nome LIKE 'SANDBOX%'
      AND m.canal='email' AND m.tipo='matricula_confirmada' AND m.status='enviando'
      AND m.envio_iniciado_em<clock_timestamp()-interval '5 minutes';

  SELECT m.id INTO v_id FROM public.comunicacoes m
    JOIN public.inscricoes i ON i.id=m.inscricao_id
    JOIN public.participantes p ON p.id=i.participante_id
    JOIN public.turmas t ON t.id=i.turma_id JOIN public.cursos c ON c.id=t.curso_id
    WHERE m.status='pendente' AND coalesce(m.tentativas,0)=0
      AND m.canal='email' AND m.tipo='matricula_confirmada'
      AND m.chave_deduplicacao='confirmacao:'||i.id
      AND i.turma_id=p_turma_id AND lower(btrim(p.email))=p_email
      AND t.nome LIKE 'SANDBOX%' AND c.nome LIKE 'SANDBOX%'
      AND NOT i.revisao_legado AND i.etapa_funil='matricula_confirmada'
      AND EXISTS(SELECT 1 FROM public.pagamentos pg JOIN public.reservas r ON r.pagamento_id=pg.id
        WHERE pg.inscricao_id=i.id AND pg.status='pago' AND pg.estado_integracao<>'legado'
          AND r.inscricao_id=i.id AND r.estado='confirmada')
    ORDER BY m.criado_em,m.id LIMIT 1 FOR UPDATE OF m SKIP LOCKED;
  IF v_id IS NULL THEN RETURN; END IF;
  UPDATE public.comunicacoes m SET status='enviando',tentativas=coalesce(m.tentativas,0)+1,
    envio_token=gen_random_uuid(),envio_iniciado_em=clock_timestamp(),atualizado_em=clock_timestamp(),erro_log=NULL
    WHERE m.id=v_id;
  RETURN QUERY SELECT m.id,m.envio_token,p.email,c.nome,t.nome FROM public.comunicacoes m
    JOIN public.inscricoes i ON i.id=m.inscricao_id JOIN public.participantes p ON p.id=i.participante_id
    JOIN public.turmas t ON t.id=i.turma_id JOIN public.cursos c ON c.id=t.curso_id WHERE m.id=v_id;
END;
$$;

CREATE FUNCTION public.finalizar_confirmacao_sandbox(p_id uuid,p_token uuid,p_resultado text)
RETURNS boolean LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $$
DECLARE v_count integer;
BEGIN
  IF p_id IS NULL OR p_token IS NULL OR p_resultado IS NULL OR p_resultado NOT IN ('enviado','revisao') THEN
    RAISE EXCEPTION 'resultado_invalido';
  END IF;
  UPDATE public.comunicacoes m SET status=p_resultado,atualizado_em=clock_timestamp(),
    enviado_em=CASE WHEN p_resultado='enviado' THEN clock_timestamp() ELSE NULL END,
    erro_log=CASE WHEN p_resultado='revisao' THEN 'envio_incerto' ELSE NULL END
    WHERE m.id=p_id AND m.envio_token=p_token AND m.status='enviando';
  GET DIAGNOSTICS v_count=ROW_COUNT;
  RETURN v_count=1;
END;
$$;

REVOKE ALL ON FUNCTION public.preparar_confirmacao_sandbox(uuid,text),
  public.finalizar_confirmacao_sandbox(uuid,uuid,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.preparar_confirmacao_sandbox(uuid,text),
  public.finalizar_confirmacao_sandbox(uuid,uuid,text) TO service_role;
COMMIT;
