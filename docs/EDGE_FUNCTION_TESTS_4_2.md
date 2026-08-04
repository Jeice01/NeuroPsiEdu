# Fase 4.2 — Testes da Edge Function

## Estratégia

O handler HTTP de `create-lead-formacao` é criado por `createHandler`. Em produção,
ele recebe as implementações reais do cliente Supabase, Turnstile, rate limiting e
limpeza. Nos testes, somente essas fronteiras são substituídas por mocks.

O corpo do handler, as validações, o mapeamento de formações, os códigos HTTP, os
cabeçalhos e a construção do registro persistido continuam sendo o código real.
Assim, os testes não acessam a rede, não consomem CAPTCHA e não criam leads.

## Cenários cobertos

- método HTTP inválido;
- JSON inválido;
- campos obrigatórios ausentes;
- consentimento ausente;
- CAPTCHA inválido;
- rate limiting por IP;
- duplicidade idempotente;
- falha interna do banco sem vazamento de detalhes;
- resposta e persistência FANP;
- resposta e persistência FAMAF.

## Execução

```powershell
npx --yes deno@2.5.6 check --node-modules-dir=auto `
  supabase/functions/create-lead-formacao/index.ts

npx --yes deno@2.5.6 test --allow-env --node-modules-dir=auto `
  supabase/functions/create-lead-formacao/index_test.ts
```

A CI e o workflow de deploy controlado executam os testes com Deno `2.5.6`. Uma
falha impede o merge e também impede a publicação da função.
