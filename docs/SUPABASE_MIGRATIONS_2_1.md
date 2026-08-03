# Fase 2.1 — Migrations do banco Supabase

Concluída em: 31/07/2026

Projeto vinculado: `avfzuudrjnglqrkyxwkz`

Branch: `database/version-schema-and-rls`

## Resultado

O schema de leads do NeuroPsiEdu passou a ser reproduzível por migrations. A
estrutura foi recriada do zero em Supabase local, testada e aplicada ao projeto
remoto.

Migration principal:

- `20260731045319_version_neuropsiedu_lead_schema.sql`.

Correção de dependência:

- `20260731023749_add_lead_rate_limits.sql` agora cria o schema
  `neuropsiedu` quando necessário, antes de criar a tabela de rate limiting.

## Estrutura versionada

### `neuropsiedu.leads_formacoes`

A migration reproduz a tabela existente sem apagar ou reescrever registros.
Foram versionados:

- chave primária UUID;
- valores padrão e timestamps com fuso horário;
- limites de tamanho alinhados à Edge Function;
- formato de e-mail, WhatsApp e hash de IP;
- formações e origens permitidas;
- consentimento explícito;
- estados administrativos permitidos;
- índices de e-mail, WhatsApp, status, formação e data;
- trigger de atualização de `updated_at`;
- deduplicação de leads ativos por e-mail e formação.

A deduplicação permite nova inscrição quando o lead anterior já não estiver no
estado `novo`.

### `neuropsiedu.espera_pos`

A tabela foi criada para representar a lista de espera usada pela home:

- chave primária UUID;
- dados básicos de contato e situação profissional;
- consentimento explícito;
- estado administrativo;
- timestamps;
- constraints de formato e tamanho;
- índices de status e data;
- deduplicação de e-mail enquanto o lead estiver em estado `novo`;
- trigger de atualização de `updated_at`.

O formulário atual da home ainda envia diretamente para `public.espera_pos`,
não informa consentimento e não utiliza a Edge Function. Por isso, a nova
tabela segura não será consumida pelo frontend até a revisão de acesso da
Fase 2.2. Esse comportamento evita abrir uma política pública apenas para
preservar um fluxo inseguro.

### Decisão sobre `tab_pos`

`tab_pos` não foi recriada.

A tabela pertence ao projeto Supabase histórico
`lgmfuswfvlnagthmrhjw`, não ao projeto atualmente vinculado. A única referência
no código está em `src/components/forms/LeadForm.tsx`, componente que não é
importado por nenhuma rota. A estrutura duplicaria os fluxos
`leads_formacoes`/`espera_pos` e manteria uma integração direta obsoleta.

A remoção física do componente legado pode ser feita na Fase 6.3, junto com a
limpeza geral, sem impacto sobre a migration.

## Segurança e compatibilidade

- RLS está habilitada nas duas tabelas de leads.
- A migration nova concede somente o acesso necessário a `service_role`.
- A função `set_updated_at` fixa `search_path` vazio.
- Nenhuma versão de extensão foi fixada.
- Nenhum objeto do schema gerenciado `realtime` foi alterado.
- Nenhum dado pessoal foi incluído no Git.

O projeto remoto já possuía grants amplos para `anon` e `authenticated` em
`leads_formacoes`. Eles não foram alterados nesta fase para manter a separação
de escopo. A revogação, a revisão das políticas RLS e a exposição pela Data API
são tarefas obrigatórias da Fase 2.2.

## Validações executadas

| Validação | Resultado |
|---|---|
| Histórico local versus remoto antes da mudança | Alinhado |
| Compatibilidade agregada dos 2 leads existentes | Nenhuma violação |
| `supabase db reset --local --no-seed` | Aprovado |
| Tabelas locais em `neuropsiedu` | 3 |
| Check constraints nas tabelas de leads | 16 |
| Triggers nas tabelas de leads | 2 |
| Insert válido em `leads_formacoes` | Aprovado |
| Rejeição de WhatsApp inválido | Aprovado |
| Deduplicação de lead ativo | Aprovado |
| Insert válido em `espera_pos` | Aprovado |
| Deduplicação da lista de espera | Aprovado |
| `supabase db lint --local --schema neuropsiedu` | Sem erros |
| `supabase db push --linked --dry-run` | Somente a migration nova |
| `supabase db push --linked` | Aprovado |
| Teste sintético remoto | Aprovado |
| `supabase db lint --linked --schema neuropsiedu` | Sem erros |
| Remoção dos dados sintéticos | Confirmada; 0 remanescentes |
| Histórico local versus remoto após o push | Alinhado |

O teste reproduzível está em `supabase/tests/phase_2_1_schema.sql` e remove os
próprios registros sintéticos ao final.

## Changelog considerado

O changelog oficial do Supabase foi revisado antes da implementação. Os itens
relevantes foram:

- versões explícitas de extensões estão sendo descontinuadas;
- novas tabelas não devem depender de exposição automática à Data API;
- o schema interno `realtime` está bloqueado contra alterações.

## Rollback

A migration adiciona constraints, índices e a tabela vazia `espera_pos`.
Reverter em produção exige uma migration compensatória, nunca edição manual do
histórico aplicado.

Em caso de incompatibilidade:

1. interromper novas publicações;
2. preservar `leads_formacoes` e seus dados;
3. remover apenas constraints ou índices causadores por migration
   compensatória;
4. remover `espera_pos` somente se continuar vazia e após confirmar que nenhum
   consumidor foi ativado;
5. executar novamente lint e testes.
