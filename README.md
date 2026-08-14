# NeuroPsiEdu

Site institucional e plataforma de captação de interessados da NeuroPsiEdu.
O frontend publica páginas estáticas para avaliações neuropsicológicas, blog e
formações FANP/FAMAF. Os formulários enviam leads para uma Edge Function do
Supabase, protegida por Cloudflare Turnstile, rate limiting, honeypot e CORS.

- Produção: <https://neuropsiedu.com.br>
- Repositório: <https://github.com/Jeice01/NeuroPsiEdu>
- Supabase de produção: projeto `avfzuudrjnglqrkyxwkz`

## Arquitetura

```text
Navegador
  ├─ páginas Next.js exportadas estaticamente
  ├─ Cloudflare Turnstile
  └─ POST /functions/v1/create-lead-formacao
                         │
                         ▼
                Supabase Edge Function
                  ├─ valida origem/CAPTCHA/dados
                  ├─ aplica rate limiting
                  └─ grava no schema neuropsiedu

GitHub main ── CI ── artefato out ── branch deploy ── Hostinger
       └──── Deploy Supabase manual ── staging ── aprovação ── production
```

O Next.js usa `output: "export"`: não existe servidor Node.js na Hostinger. A
saída estática é gerada em `out/`. O banco não é acessado diretamente pelo
navegador; a Edge Function é a única entrada ativa para os formulários.

## Tecnologias e requisitos

- Node.js `24.18.1` e npm `11.16.0`;
- Next.js `15.5`, React `19`, TypeScript e Tailwind CSS;
- Supabase CLI `2.111.0` no pipeline e Deno `2.5.6` para a Edge Function;
- Docker compatível para executar o Supabase local;
- Chromium do Playwright para testes E2E.

Confira as versões antes de instalar:

```powershell
node --version
npm --version
```

## Instalação local

```powershell
git clone https://github.com/Jeice01/NeuroPsiEdu.git
cd NeuroPsiEdu
Copy-Item .env.example .env.local
npm ci
npm run dev
```

Preencha `.env.local` com valores do ambiente de desenvolvimento. Abra
<http://localhost:3000>. Arquivos `.env*` reais são ignorados pelo Git.

### Variáveis do frontend

| Variável | Tipo | Uso |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | pública | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | pública | chave publishable/anon; nunca `service_role` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | pública | site key do widget Turnstile |

Toda variável `NEXT_PUBLIC_*` é incluída no navegador. Veja o inventário e as
regras de segurança em [docs/CONFIGURATION.md](docs/CONFIGURATION.md).

### Supabase local

Instale a CLI oficial e mantenha Docker ativo. Descubra as opções da versão
instalada antes de executar comandos:

```powershell
supabase --version
supabase --help
supabase start
supabase db reset
```

`db reset` recria o banco **local** e reaplica `supabase/migrations/`. Nunca use
`--linked` com comandos destrutivos para testar uma restauração. Para executar a
Edge Function local, copie `supabase/.env.example` para um arquivo ignorado e use:

```powershell
supabase functions serve create-lead-formacao --env-file supabase/.env.local
```

O stack local é somente para desenvolvimento e não deve ser exposto à internet.

## Estrutura do repositório

| Caminho | Responsabilidade |
|---|---|
| `src/app/` | rotas, layouts, metadados, sitemap e robots |
| `src/components/` | UI institucional, formações e formulários |
| `src/lib/`, `src/hooks/`, `src/data/` | regras compartilhadas, integrações e dados estáticos |
| `supabase/migrations/` | histórico SQL aplicado em ordem |
| `supabase/functions/` | Edge Functions e testes Deno |
| `tests/` | testes unitários e verificações de configuração |
| `e2e/` | cenários Playwright de navegação e formulários |
| `scripts/` | verificadores de SEO, performance e configuração |
| `.github/workflows/` | CI e deploys controlados |
| `docs/` | inventários, decisões, runbooks e evidências |
| `out/` | export estático gerado; não editar manualmente |

## Qualidade e testes

Antes de abrir um pull request:

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npm run test:seo
npm run test:performance
npm run test:e2e
npm run audit:ci
```

O E2E simula Turnstile e a API de leads: não cria dados reais. A CI repete lint,
tipos, testes Node/Deno/Playwright, auditoria, build, SEO e performance. Consulte
[CONTRIBUTING.md](CONTRIBUTING.md) para o fluxo de branches e PRs.

## Migrations e tipos do Supabase

1. Inicie o stack local e parta de `main` atualizada.
2. Crie a migration com `supabase migration new descricao`; não invente o nome.
3. Edite o SQL e valide com `supabase db reset`.
4. Execute lint do schema e testes da função.
5. Revise RLS, grants e exposição à Data API.
6. Gere/atualize tipos quando o schema consumido pelo código mudar.
7. Abra PR; não altere o banco remoto pelo Dashboard.

Comandos de referência:

```powershell
supabase migration new descricao_da_mudanca
supabase db reset
supabase db lint --local --schema neuropsiedu --level error --fail-on error
deno test --allow-env --node-modules-dir=auto supabase/functions/create-lead-formacao/index_test.ts
supabase migration list --local
```

Detalhes: [migrations](docs/SUPABASE_MIGRATIONS_2_1.md), [RLS e grants](docs/SUPABASE_SECURITY_2_2.md), [tipos](docs/SUPABASE_TYPES_2_3.md) e [deploy](docs/SUPABASE_DEPLOY_3_3.md).

## Deploy

### Frontend — Hostinger

O merge em `main` inicia a CI. Se ela passar, `Deploy Hostinger` baixa o mesmo
artefato aprovado, publica seu conteúdo na branch `deploy`, aciona o webhook da
Hostinger e valida `deploy.json` e as rotas públicas. Não envie arquivos
manualmente para `public_html` durante um deploy normal.

Deploy manual ou rollback: **Actions → Deploy Hostinger → Run workflow**, informe
um commit/tag/branch em `ref` e aguarde os smoke tests. Procedimento completo em
[docs/HOSTINGER_DEPLOY_3_2.md](docs/HOSTINGER_DEPLOY_3_2.md).

### Supabase — staging e produção

O deploy é manual em **Actions → Deploy Supabase**. Selecione `target`, o SHA
exato e se deseja publicar migrations e/ou a Edge Function. Sempre promova o
mesmo SHA primeiro em `staging` e depois em `production`; produção exige
aprovação do ambiente protegido.

O pipeline requer `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_REF` e, para banco,
`SUPABASE_DB_PASSWORD` nos ambientes GitHub. Secrets funcionais da Edge Function
ficam no Supabase, nunca no repositório. O staging disponível é do Supabase; não
há atualmente um domínio frontend de staging permanente.

## Rollback, incidentes e backups

- Frontend: republique um SHA estável no workflow `Deploy Hostinger`.
- Edge Function: execute `Deploy Supabase` com o SHA estável e apenas
  `deploy_function=true`.
- Banco: nunca apague migrations aplicadas; crie migration corretiva. Para perda
  de dados, interrompa deploys e restaure primeiro em ambiente descartável.

Siga [docs/INCIDENT_RUNBOOK.md](docs/INCIDENT_RUNBOOK.md) e
[docs/BACKUP_RECOVERY.md](docs/BACKUP_RECOVERY.md). Não anexe dumps com dados
pessoais a commits, PRs ou issues.

## Operação e governança

- [Política de retenção e tratamento de leads](docs/DATA_RETENTION.md)
- [Responsáveis e acessos](docs/RESPONSIBILITIES.md)
- [Runbook de incidentes](docs/INCIDENT_RUNBOOK.md)
- [Inventário DNS](docs/DNS_INVENTORY.md)
- [Roadmap e evidências](ROADMAP.md)

O e-mail público de contato é `contato@neuropsiedu.com.br`. Credenciais,
telefones pessoais, tokens e dumps nunca devem ser registrados na documentação.
