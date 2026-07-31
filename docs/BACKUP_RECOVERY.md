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
| `avfzuudrjnglqrkyxwkz` | Edge Function usada pelos formulários publicados | Sem acesso na sessão autenticada |
| `lgmfuswfvlnagthmrhjw` | Projeto histórico `neuropsiedu-projeto` | Acesso pelo Dashboard |

O repositório está localmente vinculado a `avfzuudrjnglqrkyxwkz`. A sessão
autenticada no Dashboard pertence a outra organização e só apresentou o
projeto histórico. Portanto, o projeto histórico não deve ser tratado como
backup do backend atualmente chamado pelo site.

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

Uma cópia local, datada, da implementação versionada da Edge Function
`create-lead-formacao` foi criada em:

`backups/2026-07-30/supabase/edge-functions/create-lead-formacao/`

Essa cópia comprova o código versionado, mas ainda precisa ser comparada com a
função remota assim que o acesso ao projeto `avfzuudrjnglqrkyxwkz` estiver
disponível.

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

A preparação do download foi concluída no hPanel, mas a transferência local
foi interrompida após 6 MiB e deixou somente um arquivo temporário. Esse
arquivo não é um backup válido e não deve ser usado em restauração. O backup
remoto da Hostinger permanece disponível, mas a cópia externa ainda está
pendente.

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

O inventário definitivo ainda deve ser exportado do Editor de Zona DNS da
Hostinger, pois uma consulta pública não revela registros não publicados,
anotações administrativas nem histórico.

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

## Pendências que bloqueiam a conclusão da fase

- conceder à conta autenticada acesso ao Supabase
  `avfzuudrjnglqrkyxwkz`, ou autenticar outra conta autorizada;
- fornecer a senha atual do banco por meio seguro para o dump lógico;
- baixar novamente a cópia preparada da Hostinger até a conclusão;
- exportar o inventário completo do Editor de Zona DNS;
- executar a restauração de teste em ambiente separado.

