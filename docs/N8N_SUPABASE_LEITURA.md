# API nativa do Supabase para o n8n

Consulta publicada e testada com a conta técnica em 5 de outubro de 2026.

Base: `https://ydmvbssgiffqrmwigkae.supabase.co`.

Endereço inicial: `/rest/v1/automacao_interesses_curso`.

O endpoint retorna todos os 14 campos da consulta `lista_interesses_curso`,
incluindo contatos, pergunta, autorizações e `matricula_confirmada`. É leitura
de interessados de todas as turmas; o n8n pode filtrar uma turma específica.
Essa conta não acessa diretamente tabelas de interessados ou financeiras.
Não são usadas credenciais administrativas do Supabase no n8n.

## Conectar no n8n

1. Criar uma credencial **Custom Auth**, chamada **Supabase — login n8n**.
   Colar nela o conteúdo do arquivo privado local
   `services/cursos/.env.n8n-credential.local`. O JSON contém o cabeçalho
   `apikey` e os campos de autenticação no corpo. Não colar a senha no fluxo.
   Esse arquivo é ignorado pelo Git e não é publicado no site.
2. Adicionar um nó **HTTP Request**, chamado **Login Supabase**:
   - Método: `POST`.
   - URL: `https://ydmvbssgiffqrmwigkae.supabase.co/auth/v1/token?grant_type=password`.
   - Authentication: **Generic Credential Type → Custom Auth**.
   - Credencial: **Supabase — login n8n**.
   - Send Body: ligado, conteúdo JSON, corpo `{}`. A credencial acrescenta email e senha.
   - Resposta JSON; timeout de 15 segundos; manter validação TLS.
3. Criar uma segunda credencial **Header Auth**, chamada **Supabase — chave pública**:
   nome do cabeçalho `apikey`; valor igual ao campo `headers.apikey` do arquivo
   privado. Essa chave é pública; quem concede leitura é a identidade do login.
4. Adicionar outro **HTTP Request**, chamado **Ler interessados**:
   - Método: `GET`.
   - URL: `https://ydmvbssgiffqrmwigkae.supabase.co/rest/v1/automacao_interesses_curso`.
   - Credencial: **Supabase — chave pública**.
   - Cabeçalho adicional `Authorization`, com expressão
     `={{ 'Bearer ' + $('Login Supabase').first().json.access_token }}`.
   - Parâmetros: `select=*`, `order=numero.asc`, `limit=100`, `offset=0`.
   - Resposta JSON e timeout de 15 segundos. Manter erros HTTP visíveis.

O login é feito a cada execução, evitando guardar um access token fixo que expira.
Não registrar ou compartilhar a saída de login; desabilitar o armazenamento das
execuções de produção bem-sucedidas e aplicar retenção curta às execuções com erro.
Não inserir email, senha, access token ou refresh token na planilha.

## Escolher os dados e buscar todos os registros

- Todos os campos: `select=*`.
- Apenas alguns: `select=id,nome,email,telefone,perfil,pergunta,matricula_confirmada`.
- Só uma turma: `turma_id=eq.b43bce5c-7764-42a1-b361-5134c7b0370a`.
- Só estudantes: `perfil=eq.estudante`.

Paginação do nó: **Update a Parameter in Each Request**. Atualizar o parâmetro
de consulta `offset` com `={{ $pageCount * 100 }}`; manter `limit=100` e
`order=numero.asc`. Encerrar quando o corpo retornar menos de 100 registros:
`={{ $response.body.length < 100 }}`. Paginar imediatamente após o login, com
timeout e um limite de páginas compatível com o volume; para execuções longas,
renovar o login antes de o token expirar.

Depois da consulta, usar **Edit Fields** para escolher as colunas e o nó
**Google Sheets → Append or Update Row**, procurando pelo campo `id`.
Reconsultar todos os registros a cada ciclo para atualizar matrícula e reembolso;
buscar apenas novos números não atualiza a situação financeira de linhas antigas.
Gravar texto como RAW, sem interpretar perguntas e nomes como fórmulas. A planilha
deve ficar restrita à equipe antes de receber dados reais.

## Permissões e manutenção

A identidade está em `auth.users`; sua permissão é administrada pela equipe na
tabela privada `automacao_privada.permissoes`. A conta não consegue editar essa
tabela. A função privada de consulta verifica `auth.uid()` e a permissão a cada
requisição, sem usar metadados editáveis pelo usuário. A função precisa de execução
privilegiada para reunir o status financeiro, mas entrega somente a consulta fixa
aprovada. As tabelas originais e suas permissões permanecem privadas.

Para revogar imediatamente, um administrador define `ativo=false` na linha da
identidade com recurso `interesses_curso`. Isso bloqueia também tokens existentes.
Para trocar senha, usar Supabase Auth Admin; atualizar a credencial do n8n.
O email da conta técnica termina em `@automation.invalid`: é um identificador
interno sem caixa postal, criado sem envio de mensagens. Recuperação é administrativa.

Novas fontes de dados devem ser liberadas por migrações de consultas e permissões
específicas nesta mesma API nativa. Não é necessário criar novas Edge Functions.
Nunca liberar automaticamente todas as tabelas nem usar `service_role` no n8n.

## Validação

- Validação transacional da migração: leitura autorizada, acesso sem permissão,
  acesso anônimo, escrita, tabelas internas e revogação. Transação desfeita.
- API remota real: login, retorno dos 14 campos do cadastro existente, seleção de
  três campos, rejeição de acesso anônimo e rejeição às tabelas internas.
- Teste isolado disponível: `node --test services/cursos/tests/n8n-api.test.mjs`.
  Docker não disponibilizou o engine nesta sessão; executar esse teste no CI.
- Não houve teste dentro de uma instância do n8n; os passos acima seguem sua
  documentação de HTTP Request e Custom Auth.

Referências: https://supabase.com/docs/guides/api/securing-your-api e
https://docs.n8n.io/integrations/builtin/credentials/httprequest/.
