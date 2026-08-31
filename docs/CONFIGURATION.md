# Inventário de configuração — NeuroPsiEdu

Atualizado em: 14/08/2026

Este documento descreve configurações públicas, variáveis de ambiente e
segredos usados pelo projeto. Valores secretos reais não devem ser incluídos
neste arquivo, em `.env.example`, em logs, issues ou pull requests.

## Ambientes

| Ambiente | Frontend | Backend de leads | Configuração esperada |
|---|---|---|---|
| Local | Next.js | Supabase remoto ou local | `.env.local` e secrets locais da Edge Function |
| Staging | Sem domínio permanente | Supabase `heriktuywhaqjodrqyoq` | Deploy manual pelo ambiente GitHub `supabase-staging` |
| Produção | Hostinger | Supabase Edge Functions | Variáveis de build e secrets gerenciados pelos provedores |

## Variáveis consumidas atualmente

| Variável | Escopo | Exposição | Obrigatória | Origem |
|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Next.js | Pública | Sim para chamada da Edge Function | Dashboard Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Next.js | Pública | Sim para chamada da Edge Function | Chave publishable ou anon do Supabase |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Next.js | Pública | Sim | Widget Cloudflare Turnstile |
| `SUPABASE_URL` | Edge Function | Servidor | Sim | Fornecida automaticamente pelo Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Edge Function | Secreta | Sim | Fornecida automaticamente pelo Supabase |
| `TURNSTILE_SECRET_KEY` | Edge Function | Secreta | Sim | Cloudflare Turnstile |
| `TURNSTILE_EXPECTED_ACTION` | Edge Function | Servidor | Sim | Configuração do formulário |
| `TURNSTILE_ALLOWED_HOSTNAMES` | Edge Function | Servidor | Sim | Domínios públicos autorizados |
| `RATE_LIMIT_SALT` | Edge Function | Secreta | Sim | Valor aleatório exclusivo do ambiente |
| `ALLOWED_ORIGINS` | Edge Function | Servidor | Opcional | Origens locais adicionais |

### Observações de segurança

- Toda variável `NEXT_PUBLIC_*` é enviada ao navegador.
- A chave publishable ou legacy `anon` não é um segredo de autorização.
  Grants e Row Level Security devem proteger os dados acessíveis por ela.
- `SUPABASE_SERVICE_ROLE_KEY` ignora RLS e nunca pode aparecer no frontend.
- Novos projetos devem preferir chaves `sb_publishable_*` no cliente e
  `sb_secret_*` em backends controlados. O código atual ainda usa nomes legacy.
- A migração de nomes e tipos de chave será tratada junto da consolidação dos
  formulários e da revisão de RLS.

## Configurações públicas codificadas no fonte

| Configuração | Valor atual | Local principal |
|---|---|---|
| Projeto Supabase da Edge Function | `avfzuudrjnglqrkyxwkz` | Modais FNP e FAMAF |
| Edge Function | `/functions/v1/create-lead-formacao` | Modais FNP e FAMAF |
| Site canônico | `https://neuropsiedu.com.br` | Layout e Edge Function |
| Domínio alternativo | `https://www.neuropsiedu.com.br` | CORS da Edge Function |
| GTM | `GTM-54TNTKLF` | `src/app/layout.tsx` |
| Cookiebot | `bb101498-b476-4898-bc7d-7917299af0af` | `src/app/layout.tsx` |
| WhatsApp | `+55 61 99643-6007` | Componentes institucionais e comerciais |
| E-mail | `contato@neuropsiedu.com.br` | Rodapés |
| Telegram | `https://t.me/neuropsiedu` | `src/lib/links.ts` |
| Instagram | `academiadaneuropsicologia` | Rodapé institucional |
| Área do aluno | `https://academia.neuropsiedu.com.br/` | Navegação |

Esses valores são públicos, mas estão espalhados pelo código. A centralização
em um módulo de configuração tipado deve ser realizada em uma fase posterior,
evitando converter desnecessariamente todos eles em variáveis de ambiente.

## URLs locais autorizadas

A Edge Function aceita atualmente:

- `http://localhost:3000`
- `http://localhost:5173`

O uso de `localhost:5173` parece ser legado de Vite e deve ser confirmado antes
de ser removido. Previews genéricos `*.app.github.dev` e
`*.githubpreview.dev` também são aceitos atualmente; essa permissão será
revisada na Fase 1.2.

## Arquivos de configuração

| Arquivo | Finalidade | Pode conter valores reais? |
|---|---|---|
| `.env.example` | Modelo do frontend | Não |
| `.env.local` | Valores locais do frontend | Sim; nunca versionar |
| `supabase/.env.example` | Modelo da Edge Function local | Não |
| Arquivo local de secrets da função | Valores locais da função | Sim; nunca versionar |
| `supabase/config.toml` | Configuração versionada da função | Não deve conter secrets |

## Configuração local

1. Copie `.env.example` para `.env.local`.
2. Preencha a URL e a chave publishable/anon do ambiente correto.
3. Não utilize `service_role` no frontend, mesmo em desenvolvimento.
4. Para a Edge Function local, use um arquivo não versionado baseado em
   `supabase/.env.example`.
5. Configure secrets de produção pelo painel ou CLI do Supabase, nunca por
   commit.

## Resultado da varredura de secrets

A verificação de 30/07/2026 cobriu o estado atual e todo o histórico Git.

- Nenhum arquivo `.env`, PEM, chave privada ou credencial foi encontrado entre
  os arquivos rastreados.
- Nenhuma assinatura `sb_secret_*` foi encontrada.
- Nenhuma URL `postgres://` ou `postgresql://` foi encontrada.
- Nenhuma chave `service_role` foi encontrada em bundles ou código.
- Bundles antigos do diretório `out` contêm um JWT Supabase público com
  `role=anon`, associado ao project ref histórico `lgmfuswfvlnagthmrhjw`.

A presença de uma chave `anon` em bundle público é esperada para aplicações
web, mas o projeto antigo deve permanecer protegido por RLS ou ser desativado
caso não seja mais utilizado.

## Integração ativa dos formulários

Os formulários usam a URL pública do projeto para chamar
`/functions/v1/create-lead-formacao`. A site key do Turnstile é enviada ao
navegador; secret, salt e acesso administrativo permanecem somente na Edge
Function. Não existe atualmente a variável `NEXT_PUBLIC_LEADS_FUNCTION_URL`.

## Checklist para novas configurações

- Definir se o valor é público ou secreto.
- Evitar `NEXT_PUBLIC_` para qualquer credencial privilegiada.
- Adicionar somente placeholders aos arquivos `.env.example`.
- Atualizar este inventário.
- Atualizar o ambiente de staging e produção.
- Verificar logs e artefatos de build.
- Executar varredura de secrets antes do commit.
