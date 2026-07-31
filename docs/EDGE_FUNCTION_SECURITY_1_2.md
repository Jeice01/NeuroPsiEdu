# Fase 1.2 — Proteção da Edge Function

**Data:** 31/07/2026

**Branch:** `security/lead-form-protection`

**Projeto Supabase:** `avfzuudrjnglqrkyxwkz`

## Estado

A implementação local está concluída e validada. Os segredos foram configurados
e a migration foi aplicada no Supabase. O deploy da Edge Function permanece
pendente para entrar na mesma janela do frontend com a site key pública.

O histórico remoto continha cinco migrations ausentes localmente. Elas foram
recuperadas com `supabase migration fetch`, sem alterar ou reparar o histórico.
Depois da reconciliação, o dry-run indicou somente a nova migration.

## Arquitetura implementada

### Cloudflare Turnstile

- Widget explícito compartilhado pelos formulários FNP e FAMAF.
- Chave pública lida de `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
- Ação fixa `lead_formacao`.
- Token enviado como `turnstile_token`.
- Validação obrigatória na Edge Function pelo endpoint Siteverify.
- Verificação de `action` e `hostname`.
- Timeout de oito segundos e falha fechada.
- Token reiniciado após erro de envio.

O Turnstile exige validação no servidor; tokens duram cinco minutos e são de
uso único. Referência:
<https://developers.cloudflare.com/turnstile/get-started/server-side-validation/>.

### Rate limiting

Limites implementados:

| Escopo | Limite | Janela |
|---|---:|---:|
| IP | 10 tentativas | 15 minutos |
| E-mail | 3 tentativas | 60 minutos |
| Telefone | 3 tentativas | 60 minutos |

IP, e-mail e telefone são transformados em HMAC-SHA-256 com
`RATE_LIMIT_SALT`. A tabela de controle armazena somente o hash, o escopo e os
horários do evento. Ela não armazena IP, e-mail ou telefone em texto puro.

A migration cria:

- chave primária `bigint identity`;
- constraints de escopo, tamanho do hash e expiração;
- índice composto para contagem por escopo, hash e data;
- índice para limpeza por expiração;
- RLS habilitado e forçado;
- privilégios revogados de `public`, `anon` e `authenticated`;
- acesso mínimo para `service_role`.

### Proteções HTTP

- Apenas `POST` e `OPTIONS`.
- Origens de produção explícitas.
- Origens locais somente pela variável `ALLOWED_ORIGINS`.
- Previews genéricos do GitHub removidos.
- Payload máximo de 16 KiB, inclusive quando `Content-Length` não é enviado.
- `Content-Type` obrigatório como `application/json`.
- Honeypot `website`.
- Limites máximos por campo mantidos.
- Status administrativo `status_lead` definido somente no servidor.
- Respostas internas normalizadas, sem detalhes do banco.
- HTTP 429 com `Retry-After`.
- `Cache-Control: no-store`.
- `Content-Security-Policy: default-src 'none'`.
- `Referrer-Policy: no-referrer`.
- `X-Content-Type-Options: nosniff`.
- `X-Frame-Options: DENY`.

### Logs

Os logs contêm somente:

- tipo do evento;
- UUID da requisição;
- escopo genérico do bloqueio;
- código técnico do banco quando necessário.

Nome, e-mail, telefone, mensagem, IP e hashes completos não são registrados em
logs.

## Validações concluídas

| Teste | Resultado |
|---|---|
| `deno check` da Edge Function | aprovado |
| `npm run lint` | 0 erros; 10 avisos preexistentes |
| `npm run build` | aprovado; 16 páginas |
| OPTIONS com origem autorizada | 204 |
| OPTIONS com origem não autorizada | 403 |
| GET | 405 |
| JSON inválido | 400 |
| Payload acima de 16 KiB | 413 |
| Widget FNP com chave oficial de teste | carregado |
| Widget FAMAF com chave oficial de teste | carregado |
| Honeypot fora da navegação por teclado | confirmado |
| Segredos Turnstile no Supabase | quatro nomes confirmados |
| Histórico de migrations | local e remoto reconciliados |
| Dry-run da migration | somente a migration de rate limiting |
| Migration remota | aplicada |
| Tabela remota | RLS habilitado e forçado; três índices |
| Advisors Supabase | executados; sem alerta novo para a tabela |

Os testes de navegador usaram as chaves fictícias oficiais do Cloudflare. Elas
não foram gravadas em arquivos locais nem serão usadas em produção. Referência:
<https://developers.cloudflare.com/turnstile/troubleshooting/testing/>.

Nenhuma lead foi enviada ao Supabase durante os testes.

## Pendências externas para ativação

1. Configurar `NEXT_PUBLIC_TURNSTILE_SITE_KEY` no build da Hostinger.
2. Fazer deploy da Edge Function.
3. Publicar o frontend com a site key na mesma janela.
4. Executar os testes integrados de POST, CAPTCHA, repetição e banco.

## Advisors

Os advisors apontaram alertas preexistentes em objetos do schema `public`,
incluindo funções `security definer`, `search_path`, listagem do bucket
`avatars` e otimizações de políticas RLS. Nenhum alerta foi atribuído à tabela
`neuropsiedu.lead_rate_limit_events`. Os alertas legados devem ser tratados em
uma fase de segurança do banco, sem ampliar o escopo deste deploy.

O frontend e a Edge Function devem ser ativados na mesma janela de deploy. A
Edge Function falha fechada quando os segredos não estão configurados.
