# Fase 3.3 — Deploy controlado do Supabase

## Estado inicial verificado

Em 2026-08-03, a CLI Supabase `2.111.0` confirmou que o projeto de produção
`avfzuudrjnglqrkyxwkz` está saudável e que as nove migrations versionadas estão
registradas no remoto. O comando `supabase db push --linked --dry-run` não encontrou
alterações pendentes. A função `create-lead-formacao` está ativa, sem verificação JWT
do gateway, conforme a validação própria de origem, CAPTCHA e rate limiting.

O projeto `orbis-terapia` não é staging da NeuroPsiEdu e não deve ser usado por este
pipeline. Não existe preview branch Supabase configurada no projeto de produção.

## Pipeline

O workflow `Deploy Supabase` é exclusivamente manual e exige:

- ambiente de destino: `staging` ou `production`;
- commit, tag ou branch exata a publicar;
- seleção independente de migrations e da Edge Function.

Antes de liberar o ambiente, o workflow restaura todas as migrations em um Postgres
isolado, executa o linter do schema e verifica os tipos da função com Deno. O job de
deploy só começa se essa validação terminar verde.

Os ambientes `supabase-staging` e `supabase-production` do GitHub devem possuir
secrets com os mesmos nomes:

| Secret | Finalidade |
|---|---|
| `SUPABASE_ACCESS_TOKEN` | Token pessoal usado pela CLI |
| `SUPABASE_PROJECT_REF` | Referência do projeto daquele ambiente |
| `SUPABASE_DB_PASSWORD` | Senha do Postgres daquele ambiente |

O ambiente `supabase-production` deve exigir aprovação manual. Ele é separado do
ambiente usado pelo frontend para não interromper o deploy automático da Hostinger.
Nenhuma `service_role` é
armazenada no GitHub: os secrets funcionais continuam gerenciados exclusivamente no
Supabase.

## Ordem de promoção

1. Execute o workflow para `staging` usando o SHA candidato.
2. Confirme migrations, função e smoke test verdes.
3. Execute novamente com o mesmo SHA para `production`.
4. Aprove o job protegido de produção no GitHub.
5. Registre o resumo da execução como evidência da versão publicada.

## Rollback

### Edge Function

Execute novamente o workflow com `deploy_database=false`,
`deploy_function=true` e o SHA da versão estável anterior. Isso gera uma nova versão
da função com origem rastreável, sem alterar o banco.

### Banco de dados

Migrations aplicadas não são revertidas apagando arquivos ou alterando a tabela de
histórico. Crie uma migration corretiva e promova-a pela mesma sequência. Para perda
de dados ou alteração irreversível, interrompa o pipeline e siga a restauração do
backup documentada em `docs/BACKUP_RECOVERY.md`.

Antes de migrations destrutivas, produza backup atual e ensaie a restauração em
staging. Mudanças destrutivas devem ser divididas em expansão, migração de dados e
remoção posterior para permitir rollback seguro da aplicação.

## Smoke test

Após o deploy, o workflow confirma que a função está `ACTIVE` e envia `OPTIONS` com
a origem de produção. O aceite exige HTTP `204` e o cabeçalho CORS exato. Esse teste
não cria leads nem consome tokens do Turnstile.
