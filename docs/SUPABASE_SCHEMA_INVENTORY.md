# Inventário sanitizado do schema Supabase

Data da coleta inicial: 30/07/2026

Atualizado após a Fase 2.1 em: 31/07/2026

Origem: projeto `avfzuudrjnglqrkyxwkz` (`projetoorbis`)

Este documento contém somente nomes e contagens estruturais. Nenhum registro,
nome de pessoa, e-mail, telefone, conteúdo clínico, token ou chave foi
incluído.

## Resumo

| Objeto | Quantidade |
|---|---:|
| Schemas de aplicação exportados | 2 |
| Tabelas | 24 |
| Funções | 15 |
| Triggers de usuário | 19 |
| Views | 0 |
| Políticas RLS | 77 |
| Extensões declaradas | 6 |

Os comandos completos de constraints, índices, grants, privilégios padrão e
políticas estão preservados no `schema.sql` protegido e não versionado.

## Schemas e tabelas

### `neuropsiedu`

- `espera_pos`
- `lead_rate_limit_events`
- `leads_formacoes`

### `public`

- `comment_mentions`
- `comments`
- `notifications`
- `plans`
- `pmbok_standard_tasks`
- `profiles`
- `project_closure`
- `project_costs`
- `project_lessons_learned`
- `project_members`
- `project_pmbok_checklist`
- `project_pmbok_metrics`
- `projects`
- `subtasks`
- `tap`
- `tap_ai_sessions`
- `task_attachments`
- `tasks`
- `time_entries`
- `user_roles`
- `user_subscriptions`

## Funções

### `neuropsiedu`

- `set_updated_at`

### `public`

- `calculate_task_progress`
- `check_invite_limit`
- `check_project_limit`
- `check_task_limit`
- `get_available_collaborators`
- `handle_new_user`
- `handle_new_user_subscription`
- `has_any_role`
- `has_role`
- `is_project_member`
- `notify_mentioned_users`
- `update_parent_task_status`
- `update_subtask_timestamps`
- `update_updated_at_column`

## Triggers

- `trg_leads_formacoes_updated_at`
- `trg_espera_pos_updated_at`
- `trigger_notify_mentions`
- `update_comments_updated_at`
- `update_notifications_updated_at`
- `update_parent_task_on_subtask_change`
- `update_plans_updated_at`
- `update_profiles_updated_at`
- `update_project_closure_updated_at`
- `update_project_costs_updated_at`
- `update_project_pmbok_checklist_updated_at`
- `update_project_pmbok_metrics_updated_at`
- `update_projects_updated_at`
- `update_subtask_status_timestamps`
- `update_subtasks_updated_at`
- `update_tap_updated_at`
- `update_tasks_updated_at`
- `update_time_entries_updated_at`
- `update_user_subscriptions_updated_at`

## Extensões declaradas

- `pg_cron`
- `pg_net`
- `pg_stat_statements`
- `pgcrypto`
- `supabase_vault`
- `uuid-ossp`

## Views

O dump não contém views nos schemas exportados.

## RLS e grants

O dump contém 77 políticas RLS e comandos explícitos de `GRANT`, `REVOKE` e
privilégios padrão. A restauração isolada recriou as 77 políticas.

A revisão semântica do schema `neuropsiedu` foi concluída na Fase 2.2. As três
tabelas usam RLS forçado, `anon` e `authenticated` não possuem acesso ao schema
ou às tabelas e a `service_role` recebeu somente os privilégios exigidos pela
Edge Function. O resultado e os alertas do schema `public` compartilhado estão
em [`SUPABASE_SECURITY_2_2.md`](SUPABASE_SECURITY_2_2.md).

## Amostra sanitizada

A amostra sanitizada é este inventário estrutural. Ela permite compreender os
objetos e preparar testes sem copiar dados pessoais. Para desenvolvimento,
novos registros devem ser sintéticos e usar domínios reservados, por exemplo
`example.test`, nunca valores derivados do `data.sql`.
