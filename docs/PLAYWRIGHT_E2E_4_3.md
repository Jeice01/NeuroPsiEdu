# Fase 4.3 — Testes end-to-end com Playwright

## Escopo automatizado

Os testes usam Playwright com Chromium e iniciam o Next.js localmente em
`http://127.0.0.1:3000`. A suíte cobre:

- carregamento da página inicial e navegação até o blog;
- abertura de todos os artigos publicados;
- resposta e conteúdo da página 404;
- menu mobile e atributos seguros dos links externos;
- abertura e fechamento dos modais FANP;
- envio dos formulários FANP e FAMAF;
- fechamento do modal com a tecla `Escape`.

## Isolamento dos formulários

O Turnstile e a Edge Function `create-lead-formacao` são simulados dentro do
navegador. O teste verifica a formação e o token enviados, mas não acessa o
Supabase, não resolve CAPTCHA e não grava leads. Os dados fictícios usam o nome
`Maria Silva` e o domínio reservado `example.com`.

## Execução local

Na primeira utilização, instale o navegador:

```powershell
npx playwright install chromium
```

Execute a suíte completa:

```powershell
npm run test:e2e
```

Para abrir o relatório HTML da última execução:

```powershell
npm run test:e2e:report
```

## Integração contínua

O workflow de CI instala o Chromium e executa `npm run test:e2e` antes do audit e
do build. Qualquer falha encerra o job com erro e bloqueia o merge quando o
`quality-gates` está configurado como verificação obrigatória da branch.
