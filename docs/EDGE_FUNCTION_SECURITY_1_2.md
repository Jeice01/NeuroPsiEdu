# Fase 1.2 — Proteção da Edge Function

**Data:** 31/07/2026

**Branch:** `security/lead-form-protection`

**Projeto Supabase:** `avfzuudrjnglqrkyxwkz`

## Estado

A implementação, a migration, o frontend e a Edge Function estão implantados
em produção. Os segredos foram configurados no Supabase e a chave pública foi
injetada somente no build publicado na Hostinger.

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
| Build de produção com a site key | aprovado; 16 páginas |
| Frontend Hostinger | publicado em `public_html` |
| Widget FNP no domínio real | verificação concluída com “Sucesso!” |
| Widget FAMAF no domínio real | carregado |
| Edge Function de produção | publicada |
| POST sem CAPTCHA em produção | 400 |
| POST com CAPTCHA inválido em produção | 400 |
| POST válido integrado | lead registrado e confirmação exibida |
| Limpeza do teste integrado | lead sintético removido pelo ID exato |

Os testes de navegador usaram as chaves fictícias oficiais do Cloudflare. Elas
não foram gravadas em arquivos locais nem serão usadas em produção. Referência:
<https://developers.cloudflare.com/turnstile/troubleshooting/testing/>.

Durante o teste integrado foi criada uma única lead sintética com domínio
reservado `example.test`. O registro foi confirmado no banco e removido em
seguida pelo UUID exato.

## Ativação em produção

1. Build estático gerado com `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
2. Conteúdo publicado na raiz de `public_html`, com substituição dos arquivos
   existentes protegida pelo backup concluído na Fase 0.4.
3. Turnstile validado no domínio real antes da atualização do backend.
4. Edge Function `create-lead-formacao` publicada no projeto
   `avfzuudrjnglqrkyxwkz`.
5. CORS, métodos, JSON, limite de corpo, CAPTCHA ausente, CAPTCHA inválido e
   POST legítimo validados contra produção.

O limite repetido não foi provocado até HTTP 429 em produção para não bloquear
temporariamente o IP legítimo usado na validação. Esse cenário permanece como
teste controlado pendente no roadmap.

## Advisors

Os advisors apontaram alertas preexistentes em objetos do schema `public`,
incluindo funções `security definer`, `search_path`, listagem do bucket
`avatars` e otimizações de políticas RLS. Nenhum alerta foi atribuído à tabela
`neuropsiedu.lead_rate_limit_events`. Os alertas legados devem ser tratados em
uma fase de segurança do banco, sem ampliar o escopo deste deploy.

O frontend foi ativado primeiro e validado; em seguida a Edge Function foi
publicada. Essa ordem evitou indisponibilidade, pois a versão anterior aceitava
os campos adicionais enquanto a nova versão exige CAPTCHA válido.
