# Runbook de incidentes

## Objetivo

Restaurar o serviço com segurança, preservar evidências e evitar perda ou
exposição adicional de dados. Nunca cole tokens, payloads de leads ou dumps em
issues, chats ou logs públicos.

## Classificação

| Severidade | Exemplos | Resposta inicial |
|---|---|---|
| SEV-1 | vazamento de dados, site comprometido, perda de banco | imediata; interromper mudanças |
| SEV-2 | formulários indisponíveis, deploy quebrado, produção divergente | até 30 minutos |
| SEV-3 | falha parcial, regressão sem perda de dados | próximo período operacional |

## Primeiros 15 minutos

1. Declare o incidente, horário, responsável e severidade em canal restrito.
2. Pare deploys concorrentes; não apague logs nem reescreva branches.
3. Registre SHA esperado, SHA em `https://neuropsiedu.com.br/deploy.json`,
   execução do GitHub Actions e horário UTC.
4. Verifique GitHub Actions, Hostinger, Supabase Functions/Database e DNS.
5. Se houver suspeita de credencial exposta, revogue/rotacione primeiro e depois
   investigue; não espere a causa completa para conter o acesso.

## Diagnóstico rápido

```powershell
curl.exe -I https://neuropsiedu.com.br/
curl.exe https://neuropsiedu.com.br/deploy.json
curl.exe -I https://neuropsiedu.com.br/robots.txt
```

No GitHub, confira **Actions → CI**, **Deploy Hostinger** e **Deploy Supabase**.
No Supabase, confira status da função, logs sem payload pessoal, saúde do banco e
histórico de migrations. No Hostinger, confira deployment, arquivos e SSL.

## Rollback do frontend

1. Identifique o último SHA verde e funcional.
2. Execute **Deploy Hostinger → Run workflow** com esse SHA em `ref`.
3. Confirme o SHA em `deploy.json`.
4. Valide `/`, `/fnp/`, `/famaf/`, `/blog/`, `sitemap.xml` e `robots.txt`.
5. Registre a execução; não force-push na branch `deploy`.

## Rollback da Edge Function

1. Selecione o último SHA estável.
2. Execute **Deploy Supabase** no ambiente afetado com banco desmarcado e função
   marcada.
3. Aprove produção, se aplicável.
4. Confirme função `ACTIVE` e smoke test CORS verde.

## Incidente de banco

Migrations aplicadas são imutáveis. Para regressão de schema, crie uma migration
corretiva compatível. Para corrupção ou perda de dados:

1. interrompa gravações/deploys quando isso reduzir o dano;
2. preserve dump e evidências atuais em armazenamento restrito;
3. siga `docs/BACKUP_RECOVERY.md` e restaure primeiro em projeto descartável;
4. valide contagens, constraints, RLS, grants e amostras autorizadas;
5. só então planeje a restauração de produção com aprovação explícita.

## Incidente com leads ou credenciais

- Revogue tokens/secrets expostos e cadastre novos valores nos provedores.
- Verifique histórico Git e artefatos; remover apenas do último commit não basta.
- Restrinja acesso ao schema e confirme que `anon`/`authenticated` não leem leads.
- Preserve apenas metadados mínimos do incidente; não replique os dados afetados.
- Acione o responsável de negócio/privacidade para avaliar obrigações legais.

## Encerramento

Documente causa, impacto, linha do tempo, versão restaurada, evidências, dados
afetados e ações preventivas. Atualize este runbook se algum passo tiver falhado.
