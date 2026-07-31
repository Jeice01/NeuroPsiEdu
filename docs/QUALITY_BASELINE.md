# Linha de base de qualidade

**Projeto:** NeuroPsiEdu

**Data da coleta:** 30/07/2026

**Branch:** `chore/project-baseline`

**Runtime:** Node.js `24.18.1` e npm `11.16.0`

Este documento registra o estado inicial do projeto antes das fases de
correção e evolução. As próximas medições devem usar o mesmo runtime, os mesmos
comandos e, para o Lighthouse, condições equivalentes.

## Resumo

| Indicador | Resultado |
|---|---:|
| ESLint | aprovado, 0 erros e 10 avisos |
| Build de produção | aprovado, 16 páginas estáticas geradas |
| Vulnerabilidades npm | 5 de severidade alta |
| Diretório `public` | 14.199.494 bytes (13,54 MiB) |
| Export estático `out` | 17.003.082 bytes (16,22 MiB) |
| JavaScript inicial da home | 246 kB |
| JavaScript inicial da FNP | 189 kB |
| JavaScript inicial da FAMAF | 183 kB |

## Lint

Comando:

```powershell
npx --yes --package node@24.18.1 node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run lint
```

Resultado: aprovado com 0 erros e 10 avisos.

- `FnpHero.tsx`: `orbitVariants` e `reverseOrbitVariants` não utilizados.
- `Footer.tsx`: `Activity`, `Network`, `Sparkles`, `LineChart` e `motion` não
  utilizados.
- `AboutSection.tsx`: `CheckCircle2` não utilizado.
- `InfoBar.tsx`: dependência `itemControls` ausente no `useEffect`.
- `ServicesSection.tsx`: `Users` não utilizado.

## Build

O primeiro build encontrou a cópia de uma Edge Function dentro de `backups/` e
tentou analisar a importação Deno `npm:@supabase/supabase-js@2`. O diretório de
backups foi incluído no `exclude` do `tsconfig.json`, pois não faz parte do
código-fonte compilável da aplicação.

Após o ajuste, o build de produção foi aprovado e gerou 16 páginas estáticas. O
Next.js também apresentou o aviso de que `metadataBase` não está configurado e
usou `http://localhost:3000` como fallback.

Arquivos HTML exportados:

- `index.html`
- `404.html` e `404/index.html`
- `blog/index.html`
- seis páginas de artigos em `blog/*/index.html`
- `famaf/index.html`
- `fnp/index.html`
- `formacao-manuseio/index.html`
- `formacao-manuseio-arma/index.html`

Foram gerados 27 arquivos de chunks. Os maiores arquivos brutos foram:

| Arquivo | Tamanho |
|---|---:|
| `386141497fe8b80e.js` | 305.900 bytes |
| `b3af76135d0b6d6b.js` | 293.321 bytes |
| `15d7348493c374ea.js` | 187.528 bytes |
| `ef9fd40bfe177182.js` | 130.846 bytes |
| `0ad07b02b235db93.css` | 128.935 bytes |
| `a6dad97d9634a72d.js` | 112.594 bytes |

## Auditoria de dependências

O `npm audit` encontrou cinco vulnerabilidades de severidade alta, relacionadas
a:

- `brace-expansion`
- `js-yaml`
- `next`
- `postcss`
- `sharp`

A correção automática com `--force` alteraria o Next.js além da versão exata
declarada atualmente. As atualizações serão tratadas de forma controlada na
Fase 1, com novo lint, build e testes.

## Lighthouse e acessibilidade

Auditoria executada contra o export estático servido localmente em
`http://127.0.0.1:4173`, em ambiente headless.

| Página | Performance | Acessibilidade | Boas práticas | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|---:|---:|
| Home | 35 | 82 | 73 | 100 | 11.923 ms | 0 | 1.692 ms |
| FNP | 30 | 95 | 73 | 100 | 16.668 ms | 0 | 1.758 ms |
| FAMAF | 34 | 96 | 73 | 100 | 11.049 ms | 0 | 2.105 ms |

Falhas de acessibilidade apontadas:

- Home: nome de botão, contraste de cor, título de iframe, ordem de cabeçalhos
  e nome de link.
- FNP: contraste de cor e ordem de cabeçalhos.
- FAMAF: contraste de cor.

Os relatórios JSON estão preservados localmente em
`backups/2026-07-30/quality/lighthouse/` e não são versionados. O Lighthouse
registrou erro de limpeza de pasta temporária no Windows após gerar os
relatórios; os três arquivos JSON foram gerados e lidos com sucesso.

Pontuações de performance variam conforme máquina e carga. Comparações futuras
devem usar o mesmo runtime, export estático local e configuração headless.

## Smoke test dos formulários

Testes manuais executados no navegador interno, contra o export local:

| Fluxo | Página carregou | Modal abriu | Campos exibidos | Validação vazia |
|---|---:|---:|---:|---:|
| Formação FNP | sim | sim | sim | aprovada |
| Formação para manuseio de arma | sim | sim | sim | aprovada |

Em ambos os fluxos, o envio vazio exibiu mensagens para nome, WhatsApp, e-mail
e autorização de contato. Nenhum dado válido foi preenchido e nenhuma lead foi
enviada ao endpoint de produção do Supabase.

## Pendências encaminhadas

- Corrigir as cinco vulnerabilidades altas na Fase 1.
- Remover os dez avisos de lint.
- Configurar `metadataBase`.
- Corrigir os problemas de acessibilidade identificados.
- Investigar o JavaScript compartilhado e o custo de execução que afetam LCP e
  TBT.
