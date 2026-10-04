BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

ALTER TABLE public.pagamentos
  ADD COLUMN checkout_url text,
  ADD COLUMN envio_iniciado_em timestamptz;

-- Claims exactly one external POST. A crash after the claim requires reconciliation,
-- not another POST: Checkout's endpoint does not document an idempotency header.
CREATE FUNCTION public.iniciar_checkout_curso(p_token_hash text, p_idempotencia uuid)
RETURNS jsonb LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  v_id uuid;
  v_turma_id uuid;
  v_i public.inscricoes;
  v_p public.pagamentos;
  v_r public.reservas;
  v_preco numeric;
  v_nome text;
BEGIN
  IF p_token_hash IS NULL OR p_token_hash !~ '^[a-f0-9]{64}$' OR p_idempotencia IS NULL THEN
    RAISE EXCEPTION USING ERRCODE='22023', MESSAGE='parametros_invalidos';
  END IF;
  SELECT i.id,i.turma_id INTO v_id,v_turma_id FROM public.sessoes_cadastro s
    JOIN public.inscricoes i ON i.id=s.inscricao_id
    WHERE s.token_hash=p_token_hash AND s.expira_em>clock_timestamp();
  IF NOT FOUND THEN RETURN NULL; END IF;
  SELECT preco INTO v_preco FROM public.turmas WHERE id=v_turma_id FOR UPDATE;
  SELECT * INTO v_i FROM public.inscricoes WHERE id=v_id FOR UPDATE;
  -- Recheck after acquiring locks: recovery may have rotated the capability.
  PERFORM 1 FROM public.sessoes_cadastro WHERE token_hash=p_token_hash
    AND inscricao_id=v_id AND expira_em>clock_timestamp() FOR SHARE;
  IF NOT FOUND THEN RETURN NULL; END IF;
  IF v_i.revisao_legado OR v_i.etapa_funil NOT IN
    ('lead_capturado','cadastro_sem_checkout','checkout_abandonado','expirado','checkout_iniciado') THEN
    RAISE EXCEPTION USING ERRCODE='23514', MESSAGE='checkout_indisponivel';
  END IF;
  -- A new browser key must reuse an unresolved attempt belonging to this registration.
  SELECT p.* INTO v_p FROM public.pagamentos p JOIN public.reservas r ON r.pagamento_id=p.id
    WHERE p.inscricao_id=v_id AND r.estado IN ('ativa','conciliacao') FOR UPDATE OF p;
  IF NOT FOUND THEN
    IF v_preco IS DISTINCT FROM v_i.valor_cobrado OR v_preco<=0 OR v_preco*100>999999900 THEN
      RAISE EXCEPTION USING ERRCODE='23514', MESSAGE='oferta_alterada';
    END IF;
    v_r := public.reservar_vaga_curso(v_id,p_idempotencia);
    SELECT * INTO v_p FROM public.pagamentos WHERE id=v_r.pagamento_id FOR UPDATE;
  ELSE
    SELECT * INTO v_r FROM public.reservas WHERE pagamento_id=v_p.id;
  END IF;
  IF v_p.estado_integracao='falha_definitiva' THEN
    RETURN jsonb_build_object('acao','falhou');
  END IF;
  IF v_r.estado<>'ativa' OR v_r.expira_em<=clock_timestamp() OR v_p.status<>'pendente' THEN
    RETURN jsonb_build_object('acao','aguardar');
  END IF;
  IF v_p.estado_integracao='criado' THEN
    RETURN jsonb_build_object('acao','reutilizar','url',v_p.checkout_url,'expira_em',v_p.expira_em);
  END IF;
  IF v_p.envio_iniciado_em IS NOT NULL OR v_p.estado_integracao<>'criando' THEN
    RETURN jsonb_build_object('acao','aguardar');
  END IF;
  UPDATE public.pagamentos SET envio_iniciado_em=clock_timestamp() WHERE id=v_p.id;
  SELECT left(c.nome,100) INTO v_nome FROM public.cursos c JOIN public.turmas t ON t.curso_id=c.id
    WHERE t.id=v_turma_id;
  RETURN jsonb_build_object('acao','criar','pagamento_id',v_p.id,'inscricao_id',v_id,
    'turma_id',v_turma_id,'nome',v_nome,'valor_centavos',v_p.valor_centavos,'expira_em',v_r.expira_em);
END;
$$;

CREATE FUNCTION public.finalizar_checkout_curso(
  p_pagamento_id uuid, p_resultado text, p_checkout_id text DEFAULT NULL,
  p_url text DEFAULT NULL, p_expira_em timestamptz DEFAULT NULL
)
RETURNS void LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  v_p public.pagamentos;
  v_r public.reservas;
  v_turma uuid;
  v_inscricao uuid;
BEGIN
  IF p_resultado IS NULL OR p_resultado NOT IN ('criado','resultado_desconhecido','falha_definitiva') THEN
    RAISE EXCEPTION USING ERRCODE='22023', MESSAGE='parametros_invalidos';
  END IF;
  SELECT turma_id,inscricao_id INTO v_turma,v_inscricao FROM public.reservas WHERE pagamento_id=p_pagamento_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'tentativa_inexistente'; END IF;
  PERFORM 1 FROM public.turmas WHERE id=v_turma FOR UPDATE;
  PERFORM 1 FROM public.inscricoes WHERE id=v_inscricao FOR UPDATE;
  SELECT * INTO v_p FROM public.pagamentos WHERE id=p_pagamento_id FOR UPDATE;
  SELECT * INTO v_r FROM public.reservas WHERE pagamento_id=p_pagamento_id FOR UPDATE;
  IF v_p.envio_iniciado_em IS NULL THEN RAISE EXCEPTION 'tentativa_nao_iniciada'; END IF;
  -- Replays or future webhook updates must not be downgraded by the creation response.
  IF v_p.estado_integracao IN ('criado','falha_definitiva') OR v_p.status<>'pendente'
    OR v_r.estado NOT IN ('ativa','conciliacao') THEN RETURN; END IF;
  IF p_resultado='criado' THEN
    IF p_checkout_id IS NULL OR p_checkout_id !~ '^CHEC_[A-Za-z0-9-]{1,100}$'
      OR p_url IS NULL OR p_url !~ '^https://pagamento[.]sandbox[.]pagbank[.]com[.]br/pagamento[?][^[:space:]#]+$'
      OR char_length(p_url)>2048 OR p_expira_em IS NULL
      OR p_expira_em>v_r.expira_em OR p_expira_em<=clock_timestamp() THEN
      RAISE EXCEPTION USING ERRCODE='22023', MESSAGE='checkout_invalido';
    END IF;
    UPDATE public.pagamentos SET estado_integracao='criado',pagbank_checkout_id=p_checkout_id,
      checkout_url=p_url,expira_em=p_expira_em,erro_codigo=NULL WHERE id=p_pagamento_id;
    UPDATE public.reservas SET estado='ativa',expira_em=p_expira_em,motivo=NULL WHERE id=v_r.id;
    UPDATE public.inscricoes SET etapa_funil='checkout_iniciado',motivo_etapa='checkout_disponibilizado',
      ultima_atividade_em=clock_timestamp(),reserva_expira_em=p_expira_em
      WHERE id=v_inscricao AND etapa_funil IN ('lead_capturado','cadastro_sem_checkout','checkout_abandonado','expirado','checkout_iniciado');
  ELSIF p_resultado='falha_definitiva' AND v_p.estado_integracao='criando' THEN
    UPDATE public.pagamentos SET estado_integracao=p_resultado,erro_codigo='criacao_rejeitada' WHERE id=p_pagamento_id;
    UPDATE public.reservas SET estado='liberada',finalizada_em=clock_timestamp(),motivo='criacao_rejeitada' WHERE id=v_r.id;
  ELSE
    UPDATE public.pagamentos SET estado_integracao='resultado_desconhecido',erro_codigo='conciliacao_pendente' WHERE id=p_pagamento_id;
    UPDATE public.reservas SET estado='conciliacao',motivo='resultado_desconhecido' WHERE id=v_r.id;
  END IF;
END;
$$;
REVOKE ALL ON FUNCTION public.iniciar_checkout_curso(text,uuid),
  public.finalizar_checkout_curso(uuid,text,text,text,timestamptz) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.iniciar_checkout_curso(text,uuid),
  public.finalizar_checkout_curso(uuid,text,text,text,timestamptz) TO service_role;
COMMIT;
