# Contribuindo com o NeuroPsiEdu

## Fluxo de trabalho

1. Atualize `main` e crie uma branch curta e descritiva.
2. Faça uma mudança por responsabilidade; migrations e remoções massivas devem
   ter PR próprio.
3. Nunca edite `out/` manualmente nem inclua `.env`, dumps ou dados pessoais.
4. Execute as verificações locais relevantes.
5. Abra o PR usando o template e aguarde `quality-gates` verde.
6. Faça deploy do Supabase primeiro em staging quando houver mudança de banco ou
   Edge Function. O frontend é publicado automaticamente após merge em `main`.

## Convenções

- Componentes React: `PascalCase.tsx`.
- Hooks: prefixo `use`.
- Migration: sempre criada por `supabase migration new descricao`.
- Commits: verbo no infinitivo ou tipo convencional, com escopo objetivo.
- Conteúdo público em português; nomes técnicos e código em inglês quando já
  forem o padrão do módulo.

## Verificações mínimas

```powershell
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run test:seo
npm run test:performance
npm run test:e2e
npm run audit:ci
```

Para mudanças Supabase:

```powershell
supabase db reset
supabase db lint --local --schema neuropsiedu --level error --fail-on error
deno check --node-modules-dir=auto supabase/functions/create-lead-formacao/index.ts
deno test --allow-env --node-modules-dir=auto supabase/functions/create-lead-formacao/index_test.ts
```

## Segurança e privacidade

- Use somente placeholders nos `.env.example`.
- Nunca exponha `service_role`, `sb_secret_*`, senha do banco, Turnstile secret ou
  webhook da Hostinger.
- Não use dados reais em testes. Use domínios reservados e remova leads sintéticos
  criados em testes integrados.
- Toda tabela exposta deve ter RLS, grants mínimos e políticas revisadas.
- Alterações destrutivas exigem backup atual e ensaio de restauração em staging.

## Revisão e merge

O PR precisa explicar escopo, impacto, testes, banco, segurança, SEO e rollback.
O autor não deve ignorar falhas de CI. Em produção, use merge rastreável; não
reescreva `main` ou `deploy`.
