# Fase 2.3 — Tipos e validação

Data da execução: 03/08/2026
Projeto: `avfzuudrjnglqrkyxwkz`

## Resultado

Os tipos TypeScript do schema `neuropsiedu` foram gerados pela CLI Supabase e
versionados em `supabase/functions/_shared/database.types.ts`. A Edge Function
`create-lead-formacao` usa o tipo `Database` no cliente administrativo, nos
payloads de insert das tabelas `espera_pos` e `leads_formacoes` e no tratamento
de erros PostgREST. As respostas HTTP possuem um contrato explícito de sucesso
ou erro.

## Comando de regeneração

Com o projeto vinculado e a CLI autenticada:

```powershell
supabase gen types --linked --lang typescript --schema neuropsiedu
```

O resultado deve substituir
`supabase/functions/_shared/database.types.ts`. Depois da geração, execute
`deno check` na função antes do deploy.

## Drift corrigido

A comparação dos tipos revelou que o banco remoto ainda mantinha o default
legado `8ª Turma FANP` na coluna obrigatória
`neuropsiedu.leads_formacoes.formacao_interesse`. Como a aplicação atende mais
de uma formação e sempre envia esse campo, o default poderia classificar um
insert incompleto incorretamente.

A migration
`20260803130532_remove_legacy_lead_formation_default.sql` removeu esse default
sem alterar dados ou nulabilidade. Ela foi validada localmente e aplicada ao
projeto remoto. A diferença restante entre os tipos gerados local e remotamente
é apenas o metadado interno `PostgrestVersion: "14.5"` do ambiente hospedado.

## Evidências

- Banco local recriado do zero por todas as migrations: aprovado.
- Scripts `phase_2_1_schema.sql` e `phase_2_2_security.sql`: aprovados.
- `supabase db lint --schema neuropsiedu`: sem erros.
- Advisors: nenhum erro crítico; avisos preexistentes no schema compartilhado
  `public` permanecem documentados fora deste escopo.
- `deno check index.ts`: aprovado.
- Migration remota `20260803130532`: aplicada.
- Default legado no remoto: removido.
- Leitura de leads por `anon`: bloqueada.
- Edge Function tipada: publicada.
- Preflight de produção: HTTP 204 com origem canônica autorizada.

## Segurança

O frontend continua usando somente credenciais públicas. A `service_role`
permanece restrita à Edge Function e não foi incluída nos tipos, bundles ou
variáveis públicas. A geração de tipos descreve o schema, mas não concede
privilégios nem contorna RLS.
