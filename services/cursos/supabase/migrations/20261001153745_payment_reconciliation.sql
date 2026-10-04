BEGIN;
SET LOCAL lock_timeout='5s';
SET LOCAL statement_timeout='30s';

ALTER TABLE public.pagamentos ADD COLUMN proxima_conciliacao_em timestamptz NOT NULL DEFAULT now();
CREATE INDEX pagamentos_conciliacao ON public.pagamentos(proxima_conciliacao_em)
  WHERE estado_integracao<>'legado';
ALTER TABLE public.eventos_pagamento ADD COLUMN resumo jsonb;
ALTER TABLE public.comunicacoes ADD COLUMN chave_deduplicacao text UNIQUE;

-- Receives only a minimal normalized observation obtained by authenticated provider GET.
-- Browser requests have no EXECUTE permission. No raw customer data or signature is stored.
CREATE FUNCTION public.conciliar_pagamento_curso(p_observacao jsonb, p_chave text)
RETURNS text LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $$
DECLARE
  v_p public.pagamentos; v_i public.inscricoes; v_r public.reservas;
  v_turma uuid; v_id uuid; v_limite integer; v_ocupadas bigint; v_evento uuid;
  v_estado text := p_observacao->>'status';
  v_review boolean := false; v_motivo text := 'pagamento_conciliado';
BEGIN
  IF p_chave IS NULL OR p_chave !~ '^[a-f0-9]{64}$' OR p_observacao IS NULL OR
    v_estado IS NULL OR v_estado NOT IN ('PAID','WAITING','IN_ANALYSIS','DECLINED','CANCELED','EXPIRED','REVIEW','REFUNDED','CHECKOUT_ACTIVE') THEN
    RAISE EXCEPTION 'observacao_invalida';
  END IF;
  v_id := (p_observacao->>'pagamento_id')::uuid;
  SELECT i.turma_id INTO v_turma FROM public.pagamentos p JOIN public.inscricoes i ON i.id=p.inscricao_id WHERE p.id=v_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'tentativa_nao_localizada'; END IF;
  SELECT vagas_limite INTO v_limite FROM public.turmas WHERE id=v_turma FOR UPDATE;
  SELECT i.* INTO v_i FROM public.inscricoes i JOIN public.pagamentos p ON p.inscricao_id=i.id WHERE p.id=v_id FOR UPDATE OF i;
  SELECT * INTO v_p FROM public.pagamentos WHERE id=v_id FOR UPDATE;
  SELECT * INTO v_r FROM public.reservas WHERE pagamento_id=v_id FOR UPDATE;
  IF NOT FOUND OR v_p.estado_integracao='legado' OR v_p.envio_iniciado_em IS NULL THEN RAISE EXCEPTION 'tentativa_invalida'; END IF;
  UPDATE public.pagamentos SET ultima_conciliacao_em=clock_timestamp(),proxima_conciliacao_em=clock_timestamp()+interval '5 minutes' WHERE id=v_id;
  INSERT INTO public.eventos_pagamento(pagamento_id,status_reportado,chave_deduplicacao,provedor_objeto_id,resumo,processamento)
    VALUES(v_id,v_estado,p_chave,p_observacao->>'objeto_id',p_observacao,'recebido')
    ON CONFLICT(chave_deduplicacao) DO NOTHING RETURNING id INTO v_evento;
  IF v_evento IS NULL THEN RETURN 'duplicado'; END IF;

  IF v_i.revisao_legado OR v_estado='REVIEW' OR
    (v_p.pagbank_checkout_id IS NOT NULL AND p_observacao->>'checkout_id' IS NOT NULL
      AND v_p.pagbank_checkout_id<>p_observacao->>'checkout_id') OR
    (v_p.pagbank_pedido_id IS NOT NULL AND p_observacao->>'pedido_id' IS NOT NULL
      AND v_p.pagbank_pedido_id<>p_observacao->>'pedido_id') OR
    (v_p.pagbank_cobranca_id IS NOT NULL AND p_observacao->>'cobranca_id' IS NOT NULL
      AND v_p.pagbank_cobranca_id<>p_observacao->>'cobranca_id') THEN
    v_review:=true; v_motivo:='divergencia_financeira';
  END IF;
  IF v_estado IN ('PAID','WAITING','IN_ANALYSIS','DECLINED','CANCELED','REFUNDED') AND (
    p_observacao->>'pedido_id' IS NULL OR p_observacao->>'pedido_id' !~ '^ORDE_[A-Za-z0-9-]{1,100}$' OR
    p_observacao->>'cobranca_id' IS NULL OR p_observacao->>'cobranca_id' !~ '^CHAR_[A-Za-z0-9-]{1,100}$' OR
    (p_observacao->>'valor_centavos')::bigint IS DISTINCT FROM v_p.valor_centavos OR
    p_observacao->>'moeda' IS DISTINCT FROM 'BRL') THEN
    v_review:=true; v_motivo:='valor_ou_identidade_divergente';
  END IF;
  IF v_estado='PAID' AND ((p_observacao->>'pago_centavos')::bigint IS DISTINCT FROM v_p.valor_centavos
    OR (p_observacao->>'reembolsado_centavos')::bigint IS DISTINCT FROM 0) THEN
    v_review:=true; v_motivo:='valor_pago_divergente';
  END IF;
  -- Pending/declined notifications must never undo paid, refunded or review decisions.
  IF NOT v_review AND v_p.status IN ('pago','reembolsado','contestado') AND v_estado IN
    ('WAITING','IN_ANALYSIS','DECLINED','CANCELED','EXPIRED') THEN
    UPDATE public.eventos_pagamento SET processamento='processado',processado_em=clock_timestamp() WHERE id=v_evento;
    RETURN 'estado_preservado';
  END IF;
  IF NOT v_review THEN
    UPDATE public.pagamentos SET
      pagbank_checkout_id=coalesce(pagbank_checkout_id,p_observacao->>'checkout_id'),
      pagbank_pedido_id=coalesce(pagbank_pedido_id,p_observacao->>'pedido_id'),
      pagbank_cobranca_id=coalesce(pagbank_cobranca_id,p_observacao->>'cobranca_id')
      WHERE id=v_id;
  END IF;

  IF NOT v_review AND v_estado='PAID' THEN
    UPDATE public.pagamentos SET status='pago',atualizado_em=clock_timestamp() WHERE id=v_id AND status NOT IN ('reembolsado','contestado');
    IF v_i.etapa_funil IN ('revisao_necessaria','reembolsada','cancelada') OR v_p.status IN ('reembolsado','contestado')
      OR EXISTS(SELECT 1 FROM public.pagamentos WHERE inscricao_id=v_i.id AND id<>v_id AND status='pago')
      OR EXISTS(SELECT 1 FROM public.reservas WHERE inscricao_id=v_i.id AND id<>v_r.id AND estado IN ('ativa','conciliacao','confirmada')) THEN
      v_review:=true; v_motivo:='pagamento_requer_revisao';
    ELSE
      SELECT count(*) INTO v_ocupadas FROM public.inscricoes i WHERE i.turma_id=v_turma AND i.id<>v_i.id AND
        (i.etapa_funil='matricula_confirmada' OR i.reserva_expira_em>clock_timestamp()
          OR EXISTS(SELECT 1 FROM public.reservas r WHERE r.inscricao_id=i.id AND r.estado IN ('ativa','conciliacao','confirmada')));
      IF v_ocupadas>=v_limite THEN v_review:=true; v_motivo:='pagamento_tardio_sem_vaga';
      ELSE
        UPDATE public.reservas SET estado='confirmada',finalizada_em=clock_timestamp(),motivo='pagamento_conciliado' WHERE id=v_r.id;
        UPDATE public.inscricoes SET etapa_funil='matricula_confirmada',reserva_expira_em=NULL,motivo_etapa='pagamento_conciliado' WHERE id=v_i.id;
        INSERT INTO public.comunicacoes(inscricao_id,canal,tipo,chave_deduplicacao)
          VALUES(v_i.id,'email','matricula_confirmada','confirmacao:'||v_i.id)
          ON CONFLICT(chave_deduplicacao) DO NOTHING;
      END IF;
    END IF;
  ELSIF NOT v_review AND v_estado='REFUNDED' THEN
    IF (p_observacao->>'reembolsado_centavos')::bigint IS DISTINCT FROM v_p.valor_centavos THEN
      v_review:=true; v_motivo:='reembolso_parcial';
    ELSE
      UPDATE public.pagamentos SET status='reembolsado',atualizado_em=clock_timestamp() WHERE id=v_id;
      v_review:=true; v_motivo:='reembolso_requer_revisao';
    END IF;
  ELSIF NOT v_review AND v_estado='EXPIRED' THEN
    IF (p_observacao->>'sem_cobranca_pagavel')::boolean IS DISTINCT FROM true
      OR p_observacao->>'checkout_id' IS NULL OR v_r.expira_em>clock_timestamp() THEN
      v_review:=true; v_motivo:='expiracao_nao_comprovada';
    ELSIF v_i.etapa_funil NOT IN ('matricula_confirmada','revisao_necessaria','cancelada','reembolsada') THEN
      UPDATE public.reservas SET estado='liberada',finalizada_em=clock_timestamp(),motivo='checkout_expirado_conciliado' WHERE id=v_r.id;
      UPDATE public.inscricoes SET etapa_funil='checkout_abandonado',reserva_expira_em=NULL,motivo_etapa='checkout_expirado_conciliado' WHERE id=v_i.id;
    END IF;
  ELSIF NOT v_review AND v_estado IN ('WAITING','IN_ANALYSIS','DECLINED','CANCELED') THEN
    UPDATE public.pagamentos SET status=CASE v_estado WHEN 'IN_ANALYSIS' THEN 'em_analise' WHEN 'DECLINED' THEN 'recusado'
      WHEN 'CANCELED' THEN 'cancelado' ELSE 'pendente' END,atualizado_em=clock_timestamp() WHERE id=v_id;
    IF v_r.estado='liberada' THEN
      v_review:=true; v_motivo:='cobranca_apos_liberacao';
    ELSIF v_i.etapa_funil NOT IN ('matricula_confirmada','revisao_necessaria','cancelada','reembolsada') THEN
      UPDATE public.inscricoes SET etapa_funil=CASE WHEN v_estado='IN_ANALYSIS' THEN 'pagamento_em_analise' ELSE 'pagamento_pendente' END,
        motivo_etapa='aguardando_conciliacao' WHERE id=v_i.id;
      UPDATE public.reservas SET estado='conciliacao',finalizada_em=NULL,motivo='aguardando_conciliacao' WHERE id=v_r.id;
    END IF;
  END IF;
  IF v_review THEN
    UPDATE public.inscricoes SET etapa_funil='revisao_necessaria',motivo_etapa=v_motivo WHERE id=v_i.id;
    UPDATE public.pagamentos SET erro_codigo=v_motivo WHERE id=v_id;
    -- Keep any existing seat commitment until a human resolves the financial discrepancy.
    UPDATE public.reservas SET estado='conciliacao',finalizada_em=NULL,motivo=v_motivo
      WHERE id=v_r.id AND estado IN ('ativa','conciliacao','confirmada');
  END IF;
  UPDATE public.eventos_pagamento SET processamento=CASE WHEN v_review THEN 'revisao' ELSE 'processado' END,
    processado_em=clock_timestamp(),erro_codigo=CASE WHEN v_review THEN v_motivo END WHERE id=v_evento;
  RETURN CASE WHEN v_review THEN 'revisao' ELSE 'processado' END;
END;
$$;

-- Bounded worker lease. Unknown POST outcomes remain held and are surfaced for review.
CREATE FUNCTION public.preparar_conciliacao_cursos(p_inatividade_horas integer DEFAULT 24)
RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path='' AS $$
DECLARE v_jobs jsonb;
BEGIN
  IF p_inatividade_horas IS NULL OR p_inatividade_horas NOT BETWEEN 1 AND 720 THEN RAISE EXCEPTION 'prazo_invalido'; END IF;
  WITH candidatos AS (
    SELECT i.id FROM public.inscricoes i WHERE i.revisao_legado=false AND i.etapa_funil='lead_capturado'
      AND i.ultima_atividade_em<clock_timestamp()-make_interval(hours=>p_inatividade_horas)
      AND NOT EXISTS(SELECT 1 FROM public.pagamentos p WHERE p.inscricao_id=i.id)
      AND NOT EXISTS(SELECT 1 FROM public.reservas r WHERE r.inscricao_id=i.id)
    ORDER BY i.ultima_atividade_em LIMIT 100 FOR UPDATE OF i SKIP LOCKED
  ) UPDATE public.inscricoes SET etapa_funil='cadastro_sem_checkout',motivo_etapa='inatividade_sem_checkout'
    WHERE id IN (SELECT id FROM candidatos);
  WITH candidatos AS (
    SELECT p.id FROM public.pagamentos p WHERE p.estado_integracao<>'legado' AND p.envio_iniciado_em IS NOT NULL
      AND p.estado_integracao<>'falha_definitiva' AND p.proxima_conciliacao_em<=clock_timestamp()
    ORDER BY p.proxima_conciliacao_em LIMIT 10 FOR UPDATE SKIP LOCKED
  ), jobs AS (
    UPDATE public.pagamentos p SET proxima_conciliacao_em=clock_timestamp()+interval '5 minutes'
    WHERE p.id IN (SELECT id FROM candidatos)
    RETURNING p.id,p.pagbank_checkout_id,p.pagbank_pedido_id,p.envio_iniciado_em
  ) SELECT coalesce(jsonb_agg(to_jsonb(jobs)),'[]') INTO v_jobs FROM jobs;
  RETURN v_jobs;
END;
$$;
REVOKE ALL ON FUNCTION public.conciliar_pagamento_curso(jsonb,text),public.preparar_conciliacao_cursos(integer)
  FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.conciliar_pagamento_curso(jsonb,text),public.preparar_conciliacao_cursos(integer) TO service_role;
COMMIT;
