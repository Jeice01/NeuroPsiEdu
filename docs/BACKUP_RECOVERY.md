# Backup e recuperação — NeuroPsiEdu

Atualizado em: 30/07/2026

Responsável pela execução: operação assistida por Codex
Escopo: Supabase e Hostinger

## Regra de armazenamento

Backups com dados reais ficam em `backups/`, diretório ignorado pelo Git.
Eles não devem ser anexados a issues, commits, pull requests ou serviços sem
controle de acesso. A documentação versionada contém somente metadados,
procedimentos e informações públicas.

## Estado verificado

### Supabase

Foram identificados dois projetos distintos:

| Project ref | Papel observado | Acesso em 30/07/2026 |
|---|---|---|
| `avfzuudrjnglqrkyxwkz` | Edge Function usada pelos formulários publicados | CLI autenticada e projeto vinculado |
| `lgmfuswfvlnagthmrhjw` | Projeto histórico `neuropsiedu-projeto` | Acesso pelo Dashboard |

O repositório está localmente vinculado a `avfzuudrjnglqrkyxwkz`. A CLI foi
autenticada novamente com a conta autorizada e validou o projeto
`projetoorbis`, ativo, na região `sa-east-1`, com PostgreSQL `17.6.1.121`.

O projeto histórico está no plano Free. O Dashboard informou que esse plano
não inclui backups agendados. As tabelas públicas visíveis no inventário
inicial foram:

- `documents`;
- `leads`;
- `message_history`;
- `n8n_chat_histories`;
- `tab_pos`.

O Dashboard sinalizou `n8n_chat_histories` como irrestrita. Essa constatação é
um risco a revisar na fase de segurança; não foi feita alteração de RLS durante
o backup.

Foram gerados os seguintes dumps lógicos:

| Artefato | Bytes | SHA-256 |
|---|---:|---|
| `schema.sql` | 76.484 | `2E5051BCAB1A33695863530D1B01BF554645428EA6754FE0534B912CCA31CC92` |
| `roles.sql` | 297 | `25873CEC56A2CC6514E204F420231777F85C03DA818CAA7090CDCDFA89776ECD` |
| `data.sql` | 398.148 | `6AA913E6004EFB88EA498BCF50B52E22AECA0FA78091560810BD90437DC6E645` |
| `app-data.sql` | 364.241 | `6314DCD33A78C3CEC1CD75A8194E604527E3E79A03E21AF88B18F3DEDCDC8554` |

O schema contém 22 tabelas, 15 funções, 18 triggers e 77 políticas. O dump de
dados contém 51 seções `COPY`. Nenhum dos três arquivos contém marcadores de
credenciais de conexão conhecidos.

O dump completo contém dados dos schemas gerenciados `auth` e `storage`. Um
dump adicional, `app-data.sql`, contém somente `public` e `neuropsiedu`, com
22 seções `COPY`, para restauração independente dos dados da aplicação.

Uma cópia local, datada, da implementação versionada da Edge Function
`create-lead-formacao` permanece em:

`backups/2026-07-30/supabase/edge-functions/create-lead-formacao/`

A versão publicada também foi baixada para o diretório isolado
`backups/2026-07-30/supabase/remote-export/`. O `index.ts` remoto possui o
mesmo SHA-256 da versão do repositório:
`592879DBA46606E4D921019B5F1E99490DF1A26A7A1064492F38DCEA7C50B274`.

### Hostinger

O hPanel confirmou:

- site: `neuropsiedu.com.br`;
- diretório publicado: `public_html`;
- último backup automático: `30/07/2026 09:09`;
- periodicidade informada: diária;
- próximo backup informado: `31/07/2026`.

A cópia automática está disponível no fluxo **Arquivos > Backups > Restaurar e
baixar**. O hPanel também informa que arquivos de plugins de backup, cache e
exports de banco podem ser excluídos dos backups.

A primeira transferência foi interrompida após 6 MiB e rejeitada. Uma nova
transferência foi concluída e preservada em:

`backups/2026-07-30/hostinger/u754689460.20260730120946.tar.gz`

| Verificação | Resultado |
|---|---|
| Tamanho | 60.588.306 bytes |
| SHA-256 | `9948E62E7070206DF10A9D1BC624E4A79BC77055DE6137D2288F8F70A1C11141` |
| Entradas no tar | 3.147 |
| Extração de teste | Sucesso |
| Arquivos extraídos | 2.527 |
| Bytes extraídos | 67.848.367 |
| Diretórios `public_html` | 2 |
| `index.html` sob `public_html` | 27 |

O diretório temporário usado na extração foi removido. O arquivo original em
Downloads foi mantido, e a cópia em `backups/` possui hash idêntico.

## DNS observado publicamente

Consulta realizada em 30/07/2026. O TTL deve ser consultado novamente antes de
uma mudança, pois é variável.

| Nome | Tipo | Valor observado |
|---|---|---|
| `neuropsiedu.com.br` | A | `77.37.42.149`, `147.79.105.64` |
| `neuropsiedu.com.br` | AAAA | `2a02:4780:2e:8479:6045:c98e:e710:79b`, `2a02:4780:2f:d693:8f41:ff04:64ec:d668` |
| `neuropsiedu.com.br` | MX | prioridade 1, `SMTP.GOOGLE.COM` |
| `neuropsiedu.com.br` | NS | `ns1.dns-parking.com`, `ns2.dns-parking.com` |
| `neuropsiedu.com.br` | TXT | verificação pública do Google presente |
| `www.neuropsiedu.com.br` | CNAME | `www.neuropsiedu.com.br.cdn.hstgr.net` |
| `academia.neuropsiedu.com.br` | A | `185.158.133.1` |

O inventário consolidado está em `docs/DNS_INVENTORY.md`. Ele registra as
configurações publicadas relevantes para recuperação. Anotações
administrativas e histórico interno do hPanel não fazem parte do DNS
autoritativo e devem ser capturados antes de uma futura mudança de zona.

## Procedimento de backup do Supabase

Pré-requisitos:

1. autenticar a CLI oficial com um token pessoal de uma conta que tenha acesso
   ao projeto correto;
2. confirmar o project ref;
3. obter a senha atual do banco sem salvá-la no shell history ou no
   repositório;
4. garantir que Docker esteja ativo, pois `supabase db dump` executa
   `pg_dump` em contêiner;
5. criar um diretório datado dentro de `backups/`.

Descobrir as opções na versão instalada antes da execução:

```powershell
npx --yes supabase db dump --help
npx --yes supabase functions download --help
```

Para o projeto correto, gerar separadamente:

```powershell
npx --yes supabase db dump --linked --file backups/AAAA-MM-DD/supabase/schema.sql
npx --yes supabase db dump --linked --role-only --file backups/AAAA-MM-DD/supabase/roles.sql
npx --yes supabase db dump --linked --data-only --use-copy --file backups/AAAA-MM-DD/supabase/data.sql
npx --yes supabase functions download --project-ref PROJECT_REF --use-api
```

O arquivo de dados pode conter informações pessoais e exige armazenamento
restrito. Antes de criar uma amostra para desenvolvimento, substituir ou
remover nomes, e-mails, telefones, conteúdos clínicos, tokens e identificadores
que permitam reidentificação.

O dump padrão da CLI exclui schemas gerenciados pelo Supabase, entre eles
`auth` e `storage`. Os objetos reais do Storage também não fazem parte do
backup do banco e precisam de exportação separada.

## Procedimento de restauração do Supabase

Nunca restaurar diretamente sobre produção para validar um backup.

1. criar ou selecionar um projeto Supabase descartável;
2. registrar a versão do PostgreSQL do destino;
3. aplicar `roles.sql`, quando aplicável;
4. antes do schema, revogar privilégios padrão de tabelas para `anon` e
   `authenticated` se for necessário preservar grants específicos;
5. aplicar `schema.sql`;
6. aplicar `data.sql` somente no ambiente isolado e autorizado;
7. publicar as Edge Functions e configurar secrets pelo Dashboard/CLI;
8. restaurar objetos do Storage separadamente;
9. comparar contagens e inventário de tabelas, índices, extensões, views,
   funções, triggers, grants e políticas RLS;
10. executar testes de leitura como `anon` e `authenticated`, além de confirmar
    que tabelas sem política permanecem inacessíveis.

Não registrar senhas, tokens ou chaves nos relatórios de teste.

## Procedimento de recuperação da Hostinger

### Restauração pelo hPanel

1. abrir **Sites > neuropsiedu.com.br > Arquivos > Backups**;
2. escolher **Restaurar e baixar**;
3. selecionar **Backup de arquivos** e a data desejada;
4. usar **Mostrar arquivos** para conferir o conteúdo antes da restauração;
5. programar janela de manutenção;
6. restaurar primeiro em um subdomínio ou diretório de teste, quando possível;
7. validar páginas, assets, formulários, HTTPS e redirects;
8. somente então restaurar `public_html`.

### Restauração manual

1. baixar e validar o arquivo de backup;
2. calcular SHA-256 e registrar tamanho e data;
3. extrair em diretório local isolado para testar a legibilidade;
4. guardar uma cópia do `public_html` existente antes de substituir arquivos;
5. enviar o conteúdo validado para um diretório temporário;
6. comparar o diretório temporário com o destino;
7. promover o diretório durante uma janela controlada;
8. limpar caches e executar smoke tests.

DNS não deve ser alterado como parte de uma restauração de arquivos, salvo se
houver um plano de mudança separado e revisado.

## Validações obrigatórias

Para cada artefato concluído, registrar:

- origem e horário;
- responsável;
- nome, tamanho e SHA-256;
- resultado da abertura ou extração em ambiente isolado;
- versão do PostgreSQL ou formato do arquivo;
- resultado da restauração de teste;
- divergências encontradas.

## Resultado da restauração isolada

Teste executado em 30/07/2026 com banco Supabase local no Docker.

1. A tentativa transacional com `data.sql` foi revertida integralmente porque
   a versão local mais recente da tabela gerenciada
   `auth.audit_log_entries` não possui a coluna `ip_address` presente no dump.
2. Foi gerado `app-data.sql`, restrito aos schemas `public` e `neuropsiedu`.
3. `roles.sql`, `schema.sql` e `app-data.sql` foram aplicados em transação
   única, com `ON_ERROR_STOP` e triggers desabilitados durante a carga.
4. A restauração terminou com sucesso.

Objetos confirmados no destino isolado:

| Verificação | Resultado |
|---|---:|
| Tabelas | 22 |
| Funções | 15 |
| Triggers de usuário | 18 |
| Políticas RLS | 77 |
| Extensões esperadas | 6 |
| Registros em `neuropsiedu.leads_formacoes` | 2 |

Tempo observado após o banco local ficar disponível: menos de 1 minuto para a
aplicação e validação dos três arquivos. A preparação inicial das imagens
Docker levou aproximadamente 5 minutos.

O resultado demonstra restauração dos schemas da aplicação. Ele não comprova
restauração independente de Auth e Storage, que exigem versões gerenciadas
compatíveis ou o fluxo de restauração do próprio Supabase.

## Pendências que bloqueiam a conclusão da fase

- validar separadamente a estratégia de migração dos schemas gerenciados
  `auth` e `storage`, caso uma migração integral seja necessária.
