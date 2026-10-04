-- Synthetic data only, including rows in all eight legacy tables.
INSERT INTO public.cursos (id, nome) VALUES
  ('b0f8c0f9-8e0d-4408-ad03-48f632d574fc', 'Curso fictício para preservação');
INSERT INTO public.turmas (id, curso_id, nome, preco, vagas_limite) VALUES
  ('b43bce5c-7764-42a1-b361-5134c7b0370a', 'b0f8c0f9-8e0d-4408-ad03-48f632d574fc', 'Turma fictícia', 600, 15);
INSERT INTO public.participantes (id, nome, email) VALUES
  ('10000000-0000-4000-8000-000000000001', 'Pessoa fictícia 1', 'legado1@example.test'),
  ('10000000-0000-4000-8000-000000000002', 'Pessoa fictícia 2', 'legado2@example.test');
INSERT INTO public.inscricoes (id, participante_id, turma_id, etapa_funil, valor_cobrado, reserva_expira_em) VALUES
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001',
    'b43bce5c-7764-42a1-b361-5134c7b0370a', 'matricula_confirmada', 600, NULL),
  ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002',
    'b43bce5c-7764-42a1-b361-5134c7b0370a', 'lead_capturado', 600, '2026-01-01T12:00:00Z');
INSERT INTO public.pagamentos (id, inscricao_id, status) VALUES
  ('30000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000002', 'pendente');
INSERT INTO public.eventos_pagamento (pagamento_id, status_reportado) VALUES
  ('30000000-0000-4000-8000-000000000001', 'WAITING');
INSERT INTO public.aceites_autorizacoes (inscricao_id, termo_versao, aceita_marketing, aceita_imagem) VALUES
  ('20000000-0000-4000-8000-000000000002', 'versao-ficticia-legada', false, false);
INSERT INTO public.comunicacoes (inscricao_id, canal, tipo) VALUES
  ('20000000-0000-4000-8000-000000000002', 'email', 'teste');
