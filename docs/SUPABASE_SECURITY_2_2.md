# Fase 2.2 — RLS, grants e Data API

Data da execução: 01/08/2026
Projeto: `avfzuudrjnglqrkyxwkz`

## Resultado

O schema `neuropsiedu` permanece exposto à Data API para uso exclusivo da Edge
Function, mas não concede acesso a `anon` nem a `authenticated`. As três tabelas
possuem RLS habilitado e forçado, sem políticas públicas. A captação da lista de
espera deixou de inserir diretamente pelo navegador e passou a usar a função
`create-lead-formacao`, que concentra CAPTCHA, validação, rate limiting e acesso
com `service_role`.

## Superfície revisada

- Schemas expostos: `public`, `graphql_public` e `neuropsiedu`.
- Tabelas protegidas: `leads_formacoes`, `espera_pos` e
  `lead_rate_limit_events`.
- Views em `public` e `neuropsiedu`: nenhuma.
- Funções `security definer` no schema `neuropsiedu`: nenhuma.
- Políticas RLS no schema `neuropsiedu`: nenhuma; a ausência é intencional,
  pois todo acesso do cliente foi revogado.

## Matriz de privilégios do schema `neuropsiedu`

| Papel | Schema | Leads | Espera da pós | Rate limit |
|---|---|---|---|---|
| `anon` | nenhum | nenhum | nenhum | nenhum |
| `authenticated` | nenhum | nenhum | nenhum | nenhum |
| `service_role` | `USAGE` | `INSERT` | `INSERT` | `SELECT`, `INSERT`, `DELETE` |

A `service_role` também possui `USAGE, SELECT` somente na sequence da tabela de
rate limit e `EXECUTE` somente em `neuropsiedu.set_updated_at()`. Privilégios
padrão foram revogados para impedir que tabelas, sequences ou funções futuras
sejam expostas automaticamente.

## Implementação

- Migration: `20260801134914_secure_neuropsiedu_rls_and_grants.sql`.
- Teste declarativo: `supabase/tests/phase_2_2_security.sql`.
- A configuração local declara explicitamente os schemas expostos pela Data API.
- A Edge Function aceita `lead_type: "espera_pos"`, normaliza os dados e trata
  duplicidade como sucesso idempotente.
- O formulário da home usa Turnstile, honeypot, consentimento obrigatório e a
  Edge Function; nenhuma chave administrativa é enviada ao frontend.

## Evidências

- Reset completo do banco local por todas as migrations: aprovado.
- Teste de grants e RLS local e remoto: aprovado.
- `supabase db lint --schema neuropsiedu`: sem erros.
- Advisor de segurança local: sem alertas.
- Integração local da lista de espera: HTTP 200; registro sintético criado e
  removido.
- Data API anônima local: `SELECT` e `INSERT` recusados com HTTP 401.
- Migration aplicada no projeto remoto e Edge Function publicada.
- `npm run lint`: aprovado com 10 avisos preexistentes.
- `npm run build`: aprovado; 16 páginas estáticas.
- Frontend publicado na Hostinger e cache de produção limpo.
- Fluxo ponta a ponta em produção aprovado com Turnstile e resposta de sucesso da
  Edge Function.
- Registro sintético confirmado no Supabase e removido após o teste; contagem
  final igual a zero.

## Alertas remotos fora do schema NeuroPsiEdu

O advisor remoto ainda aponta itens preexistentes do aplicativo compartilhado
no schema `public`: bucket público `avatars`, funções `security definer`
executáveis por papéis públicos e proteção contra senhas vazadas desativada.
Eles não invalidam os testes do schema `neuropsiedu`, mas exigem análise de
impacto própria antes de qualquer revogação para não interromper o outro
aplicativo.

## Operação e rollback

Reverter grants ou RLS requer uma migration nova; a migration já aplicada não
deve ser editada. Em incidente, desative temporariamente a Edge Function ou o
formulário e investigue antes de restaurar privilégios públicos. Nunca conceda
leitura de leads a `anon` ou `authenticated`.

## Publicação e teste em produção

O artefato foi recompilado com a site key pública de produção do Turnstile,
enviado à Hostinger, extraído em `public_html` com sobrescrita e publicado após
a limpeza do cache. O formulário atualizado foi validado no domínio de produção
com honeypot, consentimento obrigatório e Turnstile ativo.

O envio ponta a ponta exibiu a confirmação `Dados enviados!` e criou somente o
registro sintético identificado pelo e-mail
`fase-2-2-prod-20260801-2131@example.test`. A presença de um registro foi
confirmada diretamente no projeto Supabase e, após a validação, o registro foi
excluído. Uma consulta independente confirmou contagem final igual a zero em
03/08/2026.
