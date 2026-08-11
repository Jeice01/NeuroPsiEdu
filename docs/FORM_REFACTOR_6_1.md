# Fase 6.1 — Refatoração dos formulários

## Escopo

Os três fluxos ativos — FANP, FAMAF e lista de espera da pós-graduação — agora
compartilham a infraestrutura de envio sem alterar o contrato HTTP da Edge
Function `create-lead-formacao`.

## Componentes compartilhados

- `src/lib/lead-form.ts`: normalização, validação, UTMs e interpretação da API;
- `src/lib/lead-form-client.ts`: URL, chamada HTTP e evento de conversão;
- `src/hooks/useLeadSubmission.ts`: loading, erro, CAPTCHA, honeypot e reset;
- `src/components/forms/SharedFormFields.tsx`: campos auxiliares reutilizáveis.

Nenhuma credencial administrativa foi adicionada ao frontend. O cliente envia
somente dados públicos para a Edge Function, que continua responsável por
Turnstile, rate limiting, validação definitiva e persistência.

## Verificação

- TypeScript sem erros;
- 13 testes unitários/estruturais aprovados;
- build estático com 18 rotas;
- os três cenários Playwright de formulários foram executados até o fim; o
  processo local do servidor Next.js no Windows exigiu encerramento manual no
  teardown, comportamento já observado anteriormente e coberto novamente pela CI.
