# Fase 3.2 — Deploy automatizado do frontend na Hostinger

## Arquitetura

O domínio `neuropsiedu.com.br` usa o recurso Git da Hostinger, configurado com:

- repositório `git@github.com:Jeice01/NeuroPsiEdu.git`;
- branch de publicação `deploy`;
- diretório de instalação `/`, correspondente ao conteúdo de `public_html`.

O workflow `Deploy Hostinger` é iniciado somente depois de uma execução bem-sucedida
da CI na `main`. Ele baixa o artefato estático aprovado pela própria execução da CI,
publica somente seu conteúdo na raiz da branch `deploy` e chama o webhook de
implantação automática da Hostinger com um evento `push` compatível com o GitHub.

O webhook está armazenado no GitHub Actions como o secret
`HOSTINGER_DEPLOY_WEBHOOK`. Seu valor nunca deve ser inserido no repositório ou
impresso nos logs. Não são necessárias credenciais FTP/SFTP.

## Rastreabilidade e validação

Cada publicação cria `deploy.json` na raiz do site com:

- SHA do commit de origem;
- data e hora UTC da geração;
- identificador da execução do GitHub Actions.

Depois de acionar a Hostinger, o workflow espera esse arquivo aparecer em produção
com o SHA esperado. Em seguida, executa testes HTTP nas rotas `/`, `/fnp/`, `/famaf/`
e `/blog/`. Falha no webhook, na confirmação da versão ou nos testes deixa a
execução vermelha.

## Deploy manual e rollback

Em **Actions > Deploy Hostinger > Run workflow**, informe em `ref` um commit, uma
tag ou uma branch. O workflow recompila essa versão, publica um novo commit na
branch `deploy` e repete toda a verificação de produção.

Para rollback:

1. localize em uma execução anterior o SHA exibido em `deploy.json` ou no commit
   `deploy: <SHA>` da branch `deploy`;
2. execute manualmente `Deploy Hostinger` usando esse SHA no campo `ref`;
3. aguarde a confirmação da versão e os smoke tests verdes.

A branch `deploy` mantém o histórico dos artefatos publicados, e o rollback cria
uma nova versão auditável sem reescrever esse histórico.
