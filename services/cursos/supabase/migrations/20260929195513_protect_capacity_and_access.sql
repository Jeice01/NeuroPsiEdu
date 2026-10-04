BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';

ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.historico_inscricoes ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.participantes, public.cursos, public.turmas, public.inscricoes,
  public.pagamentos, public.eventos_pagamento, public.aceites_autorizacoes,
  public.comunicacoes, public.reservas, public.historico_inscricoes
  FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.participantes, public.cursos, public.turmas,
  public.inscricoes, public.pagamentos, public.eventos_pagamento,
  public.aceites_autorizacoes, public.comunicacoes, public.reservas TO service_role;
GRANT SELECT, INSERT ON public.historico_inscricoes TO service_role;
REVOKE DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.participantes, public.cursos,
  public.turmas, public.inscricoes, public.pagamentos, public.eventos_pagamento,
  public.aceites_autorizacoes, public.comunicacoes, public.reservas FROM service_role;
REVOKE UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER
  ON public.historico_inscricoes FROM service_role;

-- Public clients use backend responses, not direct table reads.
CREATE FUNCTION public.registrar_transicao_inscricao()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF NEW.id IS DISTINCT FROM OLD.id
       OR NEW.participante_id IS DISTINCT FROM OLD.participante_id
       OR NEW.turma_id IS DISTINCT FROM OLD.turma_id THEN
      RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'inscricao_identidade_imutavel';
    END IF;
    IF OLD.etapa_funil = 'matricula_confirmada'
       AND (NEW.etapa_funil IS NULL OR NEW.etapa_funil NOT IN
          ('matricula_confirmada', 'cancelada', 'reembolsada', 'revisao_necessaria')) THEN
      RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'matricula_nao_pode_regredir';
    END IF;
    IF NEW.etapa_funil IS NOT DISTINCT FROM OLD.etapa_funil THEN RETURN NEW; END IF;
  END IF;
  INSERT INTO public.historico_inscricoes (inscricao_id, etapa_anterior, etapa_nova, motivo)
    VALUES (NEW.id, CASE WHEN TG_OP = 'UPDATE' THEN OLD.etapa_funil END,
      NEW.etapa_funil, NEW.motivo_etapa);
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.registrar_transicao_inscricao() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.registrar_transicao_inscricao() TO service_role;
CREATE TRIGGER inscricoes_historico AFTER INSERT OR UPDATE ON public.inscricoes
  FOR EACH ROW EXECUTE FUNCTION public.registrar_transicao_inscricao();

-- Only the trusted backend may call this; HTTP authorization must precede the RPC.
-- Future confirmation/release routines must also lock turma before inscricao.
CREATE FUNCTION public.reservar_vaga_curso(p_inscricao_id uuid, p_idempotencia uuid)
RETURNS public.reservas LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  v_turma_id uuid;
  v_turma public.turmas;
  v_inscricao public.inscricoes;
  v_pagamento public.pagamentos;
  v_reserva public.reservas;
  v_ocupadas bigint;
  v_agora timestamptz;
BEGIN
  IF p_inscricao_id IS NULL OR p_idempotencia IS NULL THEN
    RAISE EXCEPTION USING ERRCODE = '22023', MESSAGE = 'parametros_obrigatorios';
  END IF;
  SELECT turma_id INTO v_turma_id FROM public.inscricoes WHERE id = p_inscricao_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = 'P0002', MESSAGE = 'inscricao_nao_encontrada';
  END IF;
  SELECT * INTO v_turma FROM public.turmas WHERE id = v_turma_id FOR UPDATE;
  SELECT * INTO v_inscricao FROM public.inscricoes WHERE id = p_inscricao_id FOR UPDATE;
  v_agora := clock_timestamp();

  SELECT * INTO v_pagamento FROM public.pagamentos WHERE idempotencia = p_idempotencia;
  IF FOUND THEN
    IF v_pagamento.inscricao_id <> p_inscricao_id THEN
      RAISE EXCEPTION USING ERRCODE = '23505', MESSAGE = 'idempotencia_outra_inscricao';
    END IF;
    SELECT * INTO v_reserva FROM public.reservas WHERE pagamento_id = v_pagamento.id;
    IF NOT FOUND THEN
      RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'tentativa_sem_reserva';
    END IF;
    RETURN v_reserva;
  END IF;
  IF v_inscricao.revisao_legado THEN
    RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'inscricao_legada_requer_revisao';
  END IF;
  IF v_inscricao.etapa_funil IS NULL OR v_inscricao.etapa_funil NOT IN
      ('lead_capturado', 'cadastro_sem_checkout', 'checkout_abandonado', 'expirado') THEN
    RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'etapa_nao_permite_reserva';
  END IF;
  IF v_turma.ativo IS DISTINCT FROM true OR NOT EXISTS
      (SELECT 1 FROM public.cursos WHERE id = v_turma.curso_id AND ativo = true) THEN
    RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'oferta_inativa';
  END IF;
  IF v_turma.vagas_limite <= 0 OR v_inscricao.valor_cobrado <= 0
      OR v_inscricao.valor_cobrado * 100 <> trunc(v_inscricao.valor_cobrado * 100) THEN
    RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'oferta_invalida';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM public.aceites_autorizacoes
      WHERE inscricao_id = p_inscricao_id AND aceita_termos = true
        AND btrim(termo_versao) <> '' AND btrim(aviso_privacidade_versao) <> '') THEN
    RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'aceite_obrigatorio';
  END IF;
  IF EXISTS (SELECT 1 FROM public.reservas WHERE inscricao_id = p_inscricao_id
      AND estado IN ('ativa', 'conciliacao')) THEN
    RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = 'reserva_existente_requer_conciliacao';
  END IF;
  -- Conservative until reconciliation: unresolved expired attempts hold capacity.
  SELECT count(*) INTO v_ocupadas FROM public.inscricoes i
    WHERE i.turma_id = v_turma_id AND (
      i.etapa_funil = 'matricula_confirmada'
      OR i.reserva_expira_em > v_agora
      OR EXISTS (SELECT 1 FROM public.reservas r WHERE r.inscricao_id = i.id
        AND r.estado IN ('ativa', 'conciliacao'))
    );
  IF v_ocupadas >= v_turma.vagas_limite THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'vagas_esgotadas';
  END IF;
  INSERT INTO public.pagamentos (inscricao_id, idempotencia, valor_centavos, moeda, estado_integracao)
    VALUES (p_inscricao_id, p_idempotencia, (v_inscricao.valor_cobrado * 100)::bigint, 'BRL', 'criando')
    RETURNING * INTO v_pagamento;
  INSERT INTO public.reservas (inscricao_id, turma_id, pagamento_id, criada_em, expira_em)
    VALUES (p_inscricao_id, v_turma_id, v_pagamento.id, v_agora, v_agora + interval '20 minutes')
    RETURNING * INTO v_reserva;
  -- A reservation does not yet prove that a checkout link was created.
  UPDATE public.inscricoes SET ultima_atividade_em = v_agora WHERE id = p_inscricao_id;
  RETURN v_reserva;
END;
$$;
REVOKE ALL ON FUNCTION public.reservar_vaga_curso(uuid, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reservar_vaga_curso(uuid, uuid) TO service_role;
COMMIT;
