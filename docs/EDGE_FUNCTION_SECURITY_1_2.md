# Fase 1.2 — Proteção da Edge Function

**Data:** 30/07/2026

**Branch:** `security/lead-form-protection`

**Projeto Supabase:** `avfzuudrjnglqrkyxwkz`

## Estado

A implementação local está concluída e validada. A aplicação no banco, a
configuração dos segredos e o deploy da Edge Function estão pendentes para
evitar interromper os formulários de produção antes da criação das chaves
Turnstile.

Também foi identificado que o histórico remoto contém cinco migrations que não
existem no diretório local. Por segurança, não foi executado `migration repair`
nem `db push`. O histórico deve ser reconciliado antes da aplicação da nova
migration.

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

Os testes de navegador usaram as chaves fictícias oficiais do Cloudflare. Elas
não foram gravadas em arquivos locais nem serão usadas em produção. Referência:
<https://developers.cloudflare.com/turnstile/troubleshooting/testing/>.

Nenhuma lead foi enviada ao Supabase durante os testes.

## Pendências externas para ativação

1. Criar um widget Turnstile do tipo gerenciado para:
   - `neuropsiedu.com.br`;
   - `www.neuropsiedu.com.br`.
2. Configurar `NEXT_PUBLIC_TURNSTILE_SITE_KEY` no build da Hostinger.
3. Criar um valor aleatório exclusivo, com pelo menos 32 bytes, para
   `RATE_LIMIT_SALT`.
4. Configurar nos segredos da Edge Function:
   - `TURNSTILE_SECRET_KEY`;
   - `TURNSTILE_EXPECTED_ACTION=lead_formacao`;
   - `TURNSTILE_ALLOWED_HOSTNAMES=neuropsiedu.com.br,www.neuropsiedu.com.br`;
   - `RATE_LIMIT_SALT`.
5. Reconciliar o histórico local e remoto de migrations sem apagar histórico.
6. Aplicar a migration `20260731023749_add_lead_rate_limits.sql`.
7. Executar os advisors do Supabase.
8. Fazer deploy da Edge Function.
9. Publicar o frontend com a site key.
10. Executar os testes integrados de POST, CAPTCHA, repetição e banco.

O frontend e a Edge Function devem ser ativados na mesma janela de deploy. A
Edge Function falha fechada quando os segredos não estão configurados.
