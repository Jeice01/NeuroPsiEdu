# Roadmap de Evolução — NeuroPsiEdu

Este documento é o controle operacional das melhorias do projeto NeuroPsiEdu.
As tarefas devem ser marcadas somente depois de implementadas **e testadas**.

## Como usar

Estados possíveis:

- `[ ]` Não iniciada
- `[x]` Concluída e validada
- `🔄` Em andamento
- `⛔` Bloqueada
- `⚠️` Concluída com pendência conhecida

Para cada entrega:

1. Implementar a alteração em uma branch própria.
2. Executar os testes indicados.
3. Registrar o resultado na seção **Registro de execuções e testes**.
4. Anexar o link do pull request ou o hash do commit.
5. Marcar a tarefa como concluída somente após atender aos critérios de aceite.

---

## Visão geral

| Fase | Tema | Prioridade | Situação |
|---|---|---:|---|
| 0 | Preparação e segurança operacional | P0 | 🔄 |
| 1 | Correções críticas de segurança | P0 | [ ] |
| 2 | Banco Supabase reproduzível e seguro | P0 | [ ] |
| 3 | CI/CD e deploy automatizado | P1 | [ ] |
| 4 | Testes automatizados | P1 | [ ] |
| 5 | SEO, performance e acessibilidade | P2 | [ ] |
| 6 | Refatoração e padronização | P2 | [ ] |
| 7 | Documentação e operação | P2 | [ ] |

---

# Fase 0 — Preparação e segurança operacional

**Objetivo:** garantir que todas as mudanças possam ser realizadas, auditadas e
revertidas com segurança.

**Branch sugerida:** `chore/project-baseline`

## 0.1 Repositório e linha de base

- [x] Confirmar que o projeto foi clonado com o diretório `.git`.
- [x] Confirmar o remote oficial `git@github.com:Jeice01/NeuroPsiEdu.git`.
- [x] Confirmar a branch padrão do repositório.
- [x] Registrar o commit atualmente publicado em produção.
- [x] Criar uma branch de trabalho a partir da versão validada.
- [x] Verificar se existem alterações locais que não estão no GitHub.
- [x] Registrar o estado inicial de `git status`.
- [x] Criar uma tag ou release de referência antes das alterações críticas.

### Linha de base identificada em 30/07/2026

- Repositório oficial: `Jeice01/NeuroPsiEdu`.
- Remote local: `https://github.com/Jeice01/NeuroPsiEdu.git`.
- URL SSH informada: `git@github.com:Jeice01/NeuroPsiEdu.git`.
- Branch padrão: `main`.
- HEAD remoto analisado: `ca122e1a2a39c96cf89cae6a983e7227586d0234`.
- Commit publicado na Hostinger:
  `a8d18c6848faf8bdcbe3eacef30dce11b59164b7`.
- Evidência da produção: o Git blob do HTML baixado de
  `https://neuropsiedu.com.br/` é
  `c1e441ecd6ce422ab7309d01ab35a219cffe394d`, idêntico ao
  `out/index.html` do commit `a8d18c`.
- Tag local de retorno: `production-baseline-2026-06-18`.
- Branch local de trabalho: `chore/project-baseline`.
- Tag remota publicada: `production-baseline-2026-06-18`.
- Branch remota publicada: `origin/chore/project-baseline`.
- O código-fonte local corresponde ao HEAD `ca122e1`.
- Diferenças reais encontradas: `ROADMAP.md` não versionado e artefatos em
  `out` regenerados durante a auditoria técnica.
- A autenticação foi configurada pelo GitHub CLI usando HTTPS. O SSH continua
  sem chave autorizada, mas não é necessário para as operações Git atuais.

### Critérios de aceite

- [x] O histórico Git está acessível localmente.
- [x] A versão de produção está associada a um commit conhecido.
- [x] Existe um ponto de retorno identificado.
- [x] Nenhum arquivo importante existe apenas na máquina local.

### Testes e evidências

- [x] Executar `git status`.
- [x] Executar `git remote -v`.
- [x] Executar `git branch --show-current`.
- [x] Executar `git log -5 --oneline`.
- [x] Comparar visualmente a versão local com o site publicado.

## 0.2 Versões do ambiente

- [x] Definir a versão oficial do Node.js.
- [x] Definir a versão oficial do npm.
- [x] Criar `.nvmrc` ou `.node-version`.
- [x] Adicionar `engines.node` ao `package.json`.
- [x] Adicionar `packageManager` ao `package.json`.
- [x] Documentar as versões no README.

### Decisão recomendada

- Node.js: `24.18.1` LTS.
- npm: `11.16.0`, versão distribuída com o Node.js `24.18.1`.
- Faixa declarada: Node.js `>=24.18.1 <25` e npm `>=11.16.0 <12`.
- Validação executada com distribuição portátil oficial, sem alterar a
  instalação global do Windows.

### Critérios de aceite

- [x] Uma nova instalação usa versões previsíveis.
- [x] O build local e o futuro build da CI possuem uma versão de Node.js
  explicitamente definida.

### Testes e evidências

- [x] Executar `node --version`.
- [x] Executar `npm --version`.
- [x] Executar `npm ci`.
- [x] Executar `npm run lint`.
- [x] Executar `npm run build`.

## 0.3 Inventário de configuração

- [x] Identificar todas as variáveis de ambiente utilizadas.
- [x] Criar `.env.example` sem valores secretos.
- [x] Confirmar onde estão armazenados os secrets de produção.
- [x] Registrar o ID do projeto Supabase sem registrar chaves privadas.
- [x] Registrar os domínios autorizados pela Edge Function.
- [x] Registrar os IDs públicos de GTM e Cookiebot.
- [x] Identificar integrações externas usadas pelo frontend.
- [x] Confirmar números, e-mails e links institucionais.

### Variáveis inicialmente identificadas

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- futura `NEXT_PUBLIC_LEADS_FUNCTION_URL`
- futura chave pública do CAPTCHA
- futuro secret privado do CAPTCHA

### Critérios de aceite

- [x] `.env.example` contém todas as variáveis necessárias.
- [x] Nenhum secret real está versionado.
- [x] Está claro quais variáveis pertencem ao frontend, à Edge Function e à CI.

### Testes e evidências

- [x] Pesquisar secrets e URLs com `rg`.
- [x] Verificar o histórico Git em busca de chaves expostas.
- [x] Confirmar que `.env*` continua ignorado pelo Git.

## 0.4 Backup e recuperação

- [x] Gerar backup lógico do banco Supabase.
- [x] Exportar o schema atual do banco.
- [ ] Registrar extensões PostgreSQL utilizadas.
- [ ] Registrar funções, triggers, views, grants e políticas RLS.
- [ ] Exportar uma amostra sanitizada da estrutura de dados.
- [x] Fazer backup local da implementação versionada da Edge Function.
- [x] Baixar e comparar a Edge Function atualmente publicada.
- [ ] Fazer backup dos arquivos atualmente publicados na Hostinger.
- [x] Confirmar a existência e a data do backup automático da Hostinger.
- [x] Registrar as configurações públicas relevantes de DNS.
- [ ] Exportar o inventário completo do Editor de Zona DNS.
- [x] Documentar o procedimento de restauração.
- [ ] Validar o backup em ambiente separado ou local.

### Critérios de aceite

- [ ] O backup possui data, origem e responsável.
- [ ] O arquivo pode ser lido e restaurado.
- [ ] A restauração não depende de conhecimento não documentado.
- [ ] Dados pessoais não são copiados para locais inseguros.

### Testes e evidências

- [ ] Validar a integridade dos arquivos de backup.
- [ ] Executar uma restauração de teste do schema.
- [ ] Confirmar tabelas, índices, funções e políticas restauradas.
- [ ] Registrar tempo e resultado da restauração.

### Andamento em 30/07/2026

- Documento operacional criado em `docs/BACKUP_RECOVERY.md`.
- Diretório local `backups/` protegido pelo `.gitignore`.
- Projeto Supabase usado pela Edge Function identificado, mas sem acesso na
  sessão autenticada inicialmente.
- CLI autenticada novamente e projeto correto vinculado.
- Dumps `schema.sql`, `roles.sql` e `data.sql` gerados, protegidos pelo
  `.gitignore` e verificados por SHA-256.
- Edge Function remota baixada; hash idêntico ao código versionado.
- Projeto Supabase histórico acessível, porém no plano Free e sem backups
  agendados.
- Backup automático da Hostinger confirmado para `30/07/2026 09:09`.
- Download da Hostinger preparado, mas a transferência local foi interrompida;
  o arquivo temporário de 6 MiB foi rejeitado como backup inválido.
- Nenhuma restauração foi executada em produção.

## 0.5 Linha de base de qualidade

- [ ] Registrar resultado inicial do lint.
- [ ] Registrar resultado inicial do build.
- [ ] Registrar vulnerabilidades iniciais do `npm audit`.
- [ ] Registrar tamanho inicial do diretório `public`.
- [ ] Registrar tamanho inicial do diretório `out`.
- [ ] Registrar tamanho inicial dos bundles principais.
- [ ] Registrar páginas geradas pelo build.
- [ ] Executar auditoria inicial do Lighthouse.
- [ ] Executar auditoria inicial de acessibilidade.
- [ ] Fazer smoke test manual dos formulários.

### Linha de base da análise de 30/07/2026

| Indicador | Resultado inicial |
|---|---:|
| Linhas em `src` | aproximadamente 7.363 |
| Tamanho de `public` | aproximadamente 13,54 MB |
| Tamanho do export `out` | aproximadamente 16,22 MB |
| ESLint | 0 erros e 10 avisos |
| Build | aprovado, 16 páginas estáticas |
| Vulnerabilidades npm | 5 altas |
| JavaScript inicial da home | aproximadamente 246 kB |
| JavaScript inicial da FNP | aproximadamente 189 kB |
| JavaScript inicial da FAMAF | aproximadamente 183 kB |

### Critérios de aceite

- [ ] Todos os resultados estão registrados com data.
- [ ] É possível comparar as métricas antes e depois das alterações.

---

# Fase 1 — Correções críticas de segurança

**Objetivo:** corrigir dependências vulneráveis e proteger os endpoints públicos
de captação de leads.

## 1.1 Atualização de dependências

**Branch sugerida:** `chore/runtime-and-dependencies`

- [ ] Atualizar Next.js de `15.5.18` para uma versão corrigida compatível.
- [ ] Atualizar `eslint-config-next` para a mesma versão.
- [ ] Executar `npm audit fix` sem `--force`.
- [ ] Revisar alterações transitivas no `package-lock.json`.
- [ ] Confirmar compatibilidade com React 19.
- [ ] Revisar os avisos atuais de `sharp`, `postcss`, `brace-expansion` e `js-yaml`.
- [ ] Confirmar se restaram vulnerabilidades aplicáveis à produção.
- [ ] Registrar vulnerabilidades aceitas, se houver, com justificativa e prazo.

### Critérios de aceite

- [ ] `npm ci` é executado com sucesso.
- [ ] `npm run lint` não apresenta erros.
- [ ] `npm run build` é executado com sucesso.
- [ ] Nenhuma vulnerabilidade alta aplicável permanece sem plano documentado.
- [ ] Todas as rotas estáticas continuam sendo geradas.

### Testes

- [ ] Home.
- [ ] Blog e artigos.
- [ ] Landing page FNP.
- [ ] Landing page FAMAF.
- [ ] Menu desktop.
- [ ] Menu mobile.
- [ ] Modais.
- [ ] Links para WhatsApp e Telegram.

## 1.2 Proteção da Edge Function

**Branch sugerida:** `security/lead-form-protection`

- [ ] Escolher Cloudflare Turnstile ou solução equivalente.
- [ ] Adicionar o widget aos formulários.
- [ ] Enviar o token junto com a requisição.
- [ ] Validar o token exclusivamente na Edge Function.
- [ ] Recusar token ausente, inválido, expirado ou reutilizado.
- [ ] Implementar rate limiting.
- [ ] Limitar requisições por hash de IP.
- [ ] Limitar tentativas repetidas por e-mail e telefone.
- [ ] Adicionar honeypot aos formulários.
- [ ] Limitar o tamanho máximo do corpo HTTP.
- [ ] Manter limites máximos por campo.
- [ ] Restringir origens permitidas.
- [ ] Remover curingas de preview em produção.
- [ ] Adicionar cabeçalhos de segurança apropriados.
- [ ] Padronizar logs sem registrar dados pessoais completos.
- [ ] Não expor erros internos do Supabase ao navegador.
- [ ] Retornar HTTP 429 em caso de rate limit.

### Critérios de aceite

- [ ] Requisição legítima é registrada.
- [ ] Requisição sem CAPTCHA válido é rejeitada.
- [ ] Bot ou script não consegue contornar a proteção apenas alterando `Origin`.
- [ ] Excesso de requisições recebe HTTP 429.
- [ ] Logs permitem investigar falhas sem expor PII desnecessária.
- [ ] A chave `service_role` não aparece no frontend nem nos logs.

### Testes

- [ ] POST válido.
- [ ] POST sem CAPTCHA.
- [ ] POST com CAPTCHA inválido.
- [ ] POST repetido além do limite.
- [ ] POST com corpo acima do limite.
- [ ] POST com JSON inválido.
- [ ] GET, PUT e DELETE.
- [ ] OPTIONS/CORS.
- [ ] Origem autorizada.
- [ ] Origem não autorizada.
- [ ] Falha simulada do banco.

## 1.3 Correções funcionais dos formulários

- [ ] Corrigir a mensagem fixa da “8ª Turma FANP”.
- [ ] Retornar mensagem apropriada para FNP.
- [ ] Retornar mensagem apropriada para FAMAF.
- [ ] Validar `formacao_interesse` no servidor.
- [ ] Usar lista permitida de formações e origens.
- [ ] Impedir que o cliente defina livremente `status_lead`.
- [ ] Padronizar o contrato de resposta da API.
- [ ] Padronizar mensagens de erro no frontend.
- [ ] Evitar alertas nativos do navegador.
- [ ] Confirmar eventos corretos no `dataLayer`.

### Critérios de aceite

- [ ] Cada formulário apresenta a mensagem correta.
- [ ] Valores não permitidos são rejeitados ou normalizados.
- [ ] O servidor controla campos administrativos.
- [ ] Erros de rede e servidor são apresentados de forma acessível.

---

# Fase 2 — Banco Supabase reproduzível e seguro

**Objetivo:** versionar a estrutura de dados e garantir acesso mínimo.

**Branch sugerida:** `database/version-schema-and-rls`

## 2.1 Migrations

- [ ] Criar migration do schema `neuropsiedu`.
- [ ] Criar migration da tabela `leads_formacoes`.
- [ ] Criar migration da tabela `espera_pos`.
- [ ] Decidir se `tab_pos` ainda é necessária.
- [ ] Criar migration de `tab_pos` ou removê-la.
- [ ] Versionar primary keys.
- [ ] Versionar valores padrão e timestamps.
- [ ] Versionar constraints de tamanho e formato.
- [ ] Versionar índices de consulta.
- [ ] Criar estratégia de deduplicação.
- [ ] Versionar functions, triggers e views utilizadas.
- [ ] Não fixar versões de extensões sem necessidade.

## 2.2 RLS, grants e Data API

- [ ] Identificar schemas expostos pela Data API.
- [ ] Habilitar RLS em todas as tabelas expostas.
- [ ] Revogar leitura pública dos leads.
- [ ] Revogar update e delete públicos.
- [ ] Revisar inserts feitos por `anon`.
- [ ] Substituir inserts diretos por Edge Function, se aprovado.
- [ ] Registrar grants de `anon`.
- [ ] Registrar grants de `authenticated`.
- [ ] Registrar privilégios da service role utilizados pela função.
- [ ] Revisar views com `security_invoker`.
- [ ] Manter funções `security definer` fora de schemas expostos.
- [ ] Executar os advisors de segurança e performance.

## 2.3 Tipos e validação

- [ ] Gerar tipos TypeScript do banco.
- [ ] Versionar os tipos gerados.
- [ ] Tipar os inserts da Edge Function.
- [ ] Tipar respostas e erros do Supabase.
- [ ] Validar migrations em banco local ou de staging.

### Critérios de aceite da fase

- [ ] Um projeto Supabase vazio pode ser recriado pelas migrations.
- [ ] Leads não podem ser lidos publicamente.
- [ ] O frontend não possui acesso administrativo.
- [ ] Os advisors não apresentam alerta crítico não documentado.
- [ ] O schema real corresponde ao schema versionado.

---

# Fase 3 — CI/CD e deploy automatizado

**Objetivo:** tornar build, validação e publicação reproduzíveis.

## 3.1 Integração contínua

**Branch sugerida:** `ci/quality-gates`

- [ ] Criar workflow para pull requests.
- [ ] Fixar a versão do Node.js.
- [ ] Executar `npm ci`.
- [ ] Executar lint.
- [ ] Executar verificação de tipos.
- [ ] Executar testes automatizados.
- [ ] Executar build de produção.
- [ ] Executar auditoria de dependências.
- [ ] Armazenar o diretório `out` como artefato.
- [ ] Configurar proteção da branch `main`.
- [ ] Exigir aprovação e checks verdes para merge.

## 3.2 Deploy do frontend

**Branch sugerida:** `ci/hostinger-deploy`

- [ ] Confirmar método suportado pela Hostinger.
- [ ] Criar secrets de SFTP/FTP no GitHub.
- [ ] Publicar somente o artefato aprovado.
- [ ] Evitar exposição de credenciais nos logs.
- [ ] Preservar versão anterior para rollback.
- [ ] Executar smoke test HTTP após o deploy.
- [ ] Registrar commit e data da versão publicada.
- [ ] Criar mecanismo de deploy manual emergencial.

## 3.3 Deploy do Supabase

- [ ] Criar ambiente de staging.
- [ ] Validar migrations antes da produção.
- [ ] Criar workflow de deploy da Edge Function.
- [ ] Exigir aprovação para alteração de banco em produção.
- [ ] Validar a função após a publicação.
- [ ] Documentar rollback de função e banco.

### Critérios de aceite da fase

- [ ] Todo pull request executa os checks.
- [ ] Merge inválido é bloqueado.
- [ ] O deploy não depende de upload manual.
- [ ] Cada versão publicada corresponde a um commit.
- [ ] Existe rollback testado.

---

# Fase 4 — Testes automatizados

**Objetivo:** proteger rotas, formulários e regras de negócio.

**Branch sugerida:** `test/lead-and-routes`

## 4.1 Testes unitários

- [ ] Validação de nome.
- [ ] Validação e normalização de e-mail.
- [ ] Validação de WhatsApp e DDD.
- [ ] Limites de texto.
- [ ] Captura de UTMs.
- [ ] Mapeamento de formação.
- [ ] Mensagens de sucesso por formação.
- [ ] Tratamento de erros.

## 4.2 Testes da Edge Function

- [ ] Método inválido.
- [ ] JSON inválido.
- [ ] Campos ausentes.
- [ ] Consentimento ausente.
- [ ] CAPTCHA inválido.
- [ ] Rate limiting.
- [ ] Duplicidade.
- [ ] Falha do banco.
- [ ] Resposta FANP.
- [ ] Resposta FAMAF.

## 4.3 Testes end-to-end

- [ ] Carregamento da home.
- [ ] Navegação do blog.
- [ ] Renderização de todos os artigos.
- [ ] Abertura e fechamento dos modais.
- [ ] Envio de lead FANP.
- [ ] Envio de lead FAMAF.
- [ ] Navegação por teclado.
- [ ] Menu mobile.
- [ ] Página 404.
- [ ] Links externos principais.

### Critérios de aceite da fase

- [ ] Testes são executados na CI.
- [ ] Falha de teste bloqueia o merge.
- [ ] Dados de teste são identificáveis e removíveis.
- [ ] Fluxos críticos possuem cobertura automatizada.

---

# Fase 5 — SEO, performance e acessibilidade

**Objetivo:** melhorar indexação, velocidade e experiência inclusiva.

## 5.1 SEO

**Branch sugerida:** `seo/canonical-metadata-sitemap`

- [ ] Escolher URL canônica da formação FAMAF.
- [ ] Redirecionar `/famaf`.
- [ ] Redirecionar `/formacao-manuseio`.
- [ ] Preservar UTMs nos redirecionamentos.
- [ ] Definir `metadataBase`.
- [ ] Definir canonical por página.
- [ ] Criar metadados por artigo.
- [ ] Criar Open Graph absoluto.
- [ ] Criar Twitter cards.
- [ ] Criar sitemap.
- [ ] Criar robots.
- [ ] Revisar dados estruturados.

## 5.2 Performance

**Branch sugerida:** `perf/image-optimization`

- [ ] Otimizar favicon.
- [ ] Converter imagens pesadas para WebP/AVIF.
- [ ] Criar dimensões responsivas.
- [ ] Definir largura e altura das imagens.
- [ ] Aplicar lazy loading quando apropriado.
- [ ] Revisar fontes externas.
- [ ] Reduzir JavaScript cliente.
- [ ] Medir bundle antes e depois.
- [ ] Executar Lighthouse antes e depois.

## 5.3 Acessibilidade

- [ ] Revisar contraste.
- [ ] Revisar ordem de foco.
- [ ] Implementar focus trap nos modais.
- [ ] Restaurar foco ao fechar modais.
- [ ] Associar erros aos campos.
- [ ] Adicionar regiões `aria-live`.
- [ ] Respeitar `prefers-reduced-motion`.
- [ ] Revisar textos alternativos.
- [ ] Executar axe.
- [ ] Testar somente com teclado.

### Metas iniciais

- [ ] Reduzir `public` para menos de 5 MB.
- [ ] Reduzir o favicon para menos de 100 KB.
- [ ] Não possuir URLs duplicadas indexáveis.
- [ ] Não possuir problema crítico no axe.
- [ ] Melhorar as métricas Lighthouse em relação à linha de base.

---

# Fase 6 — Refatoração e padronização

**Objetivo:** reduzir duplicação e facilitar a manutenção.

**Branch sugerida:** `refactor/frontend-components`

## 6.1 Formulários

- [ ] Criar validações compartilhadas.
- [ ] Criar hook compartilhado de envio.
- [ ] Criar cliente compartilhado da Edge Function.
- [ ] Criar componente de campos reutilizáveis.
- [ ] Centralizar captura de UTMs.
- [ ] Centralizar integração com `dataLayer`.
- [ ] Centralizar estados de carregamento, sucesso e erro.

## 6.2 Componentes

- [ ] Dividir `CoursesSection.tsx`.
- [ ] Dividir `FnpLeadModal.tsx`.
- [ ] Dividir `ManuseioArmaLeadModal.tsx`.
- [ ] Mover conteúdo estático para arquivos de dados.
- [ ] Reduzir componentes marcados com `"use client"`.
- [ ] Carregar modais sob demanda.
- [ ] Revisar uso do Framer Motion.

## 6.3 Limpeza

- [ ] Eliminar todos os avisos do lint.
- [ ] Corrigir dependência do hook em `InfoBar`.
- [ ] Remover imports não utilizados.
- [ ] Avaliar remoção de `LeadForm`.
- [ ] Avaliar remoção de `old_html`.
- [ ] Avaliar remoção do `index.html` legado.
- [ ] Decidir se `out` deve permanecer versionado.
- [ ] Renomear o pacote `temp-app`.
- [ ] Remover assets padrão não utilizados.

### Critérios de aceite da fase

- [ ] ESLint sem erros e sem avisos.
- [ ] Formulários utilizam regras compartilhadas.
- [ ] Componentes grandes foram divididos por responsabilidade.
- [ ] Bundle cliente foi reduzido ou não aumentou sem justificativa.

---

# Fase 7 — Documentação e operação

**Objetivo:** permitir manutenção, publicação e recuperação por outra pessoa.

**Branch sugerida:** `docs/development-and-operations`

- [ ] Substituir o README padrão.
- [ ] Documentar objetivo e arquitetura.
- [ ] Documentar estrutura de pastas.
- [ ] Documentar instalação local.
- [ ] Documentar variáveis de ambiente.
- [ ] Documentar Supabase local e remoto.
- [ ] Documentar migrations.
- [ ] Documentar testes.
- [ ] Documentar build.
- [ ] Documentar deploy Hostinger.
- [ ] Documentar deploy Supabase.
- [ ] Documentar rollback.
- [ ] Criar `CONTRIBUTING.md`.
- [ ] Criar template de pull request.
- [ ] Criar runbook de incidentes.
- [ ] Documentar política de retenção de leads.
- [ ] Documentar responsáveis técnicos e de negócio.

### Critérios de aceite da fase

- [ ] Uma nova pessoa consegue executar o projeto seguindo o README.
- [ ] Uma nova pessoa consegue publicar em staging.
- [ ] O rollback pode ser executado seguindo apenas o runbook.

---

# Checklist obrigatório por pull request

- [ ] O escopo do PR está descrito.
- [ ] Não há alteração não relacionada.
- [ ] Não há secrets ou dados pessoais versionados.
- [ ] `npm ci` foi executado.
- [ ] `npm run lint` foi executado.
- [ ] Os testes automatizados foram executados.
- [ ] `npm run build` foi executado.
- [ ] O resultado do `npm audit` foi revisado.
- [ ] Testes manuais relevantes foram executados.
- [ ] Evidências foram anexadas.
- [ ] O impacto de segurança foi analisado.
- [ ] O impacto no banco foi analisado.
- [ ] O impacto em SEO foi analisado.
- [ ] O impacto em acessibilidade foi analisado.
- [ ] O plano de rollback foi registrado.
- [ ] A documentação foi atualizada.

---

# Registro de execuções e testes

Adicione uma linha para cada execução relevante.

| Data | Fase/Tarefa | Ambiente | Execução ou teste | Resultado | Evidência | Responsável |
|---|---|---|---|---|---|---|
| 30/07/2026 | Linha de base | Local | `npm run lint` | Aprovado com 10 avisos | Saída do terminal | Codex |
| 30/07/2026 | Linha de base | Local | `npm run build` | Aprovado; 16 páginas estáticas | Saída do terminal | Codex |
| 30/07/2026 | Linha de base | Local | `npm audit` | 5 vulnerabilidades altas | Relatório npm | Codex |
| 30/07/2026 | Produção | Hostinger | HTTP `GET /` | Site acessível | `https://neuropsiedu.com.br` | Codex |
| 30/07/2026 | Fase 0.1 | Local/GitHub | Restaurar metadados Git e verificar histórico | Aprovado | HEAD remoto `ca122e1`; branch `main` | Codex |
| 30/07/2026 | Fase 0.1 | Produção/Git | Comparar hash do HTML publicado | Aprovado | Produção idêntica ao `out/index.html` de `a8d18c` | Codex |
| 30/07/2026 | Fase 0.1 | Local | Criar tag e branch de linha de base | Aprovado | Tag `production-baseline-2026-06-18`; branch `chore/project-baseline` | Codex |
| 30/07/2026 | Fase 0.1 | GitHub | Publicar branch e tag de linha de base | Aprovado | Branch em `caf0b5f`; tag aponta para `a8d18c` | Codex |
| 30/07/2026 | Fase 0.2 | Local | Node.js `24.18.1` e npm `11.16.0` | Aprovado | Distribuição portátil oficial | Codex |
| 30/07/2026 | Fase 0.2 | Local | `npm ci` | Aprovado | 335 pacotes instalados | Codex |
| 30/07/2026 | Fase 0.2 | Local | `npm run lint` | Aprovado com 10 avisos conhecidos | Saída do terminal | Codex |
| 30/07/2026 | Fase 0.2 | Local | `npm run build` | Aprovado; 16 páginas estáticas | Saída do terminal | Codex |
| 30/07/2026 | Fase 0.3 | Local/Git | Varredura de secrets no estado atual e histórico | Aprovado com observação | Somente chave pública `anon` em bundles históricos | Codex |
| 30/07/2026 | Fase 0.3 | Local | Inventário de variáveis e configurações públicas | Aprovado | `docs/CONFIGURATION.md` | Codex |
| 30/07/2026 | Fase 0.3 | Local | Validar regras de ignore para ambientes | Aprovado | Somente arquivos `.env.example` podem ser versionados | Codex |

---

# Registro de decisões técnicas

Use esta seção para decisões que afetem arquitetura, segurança ou operação.

| Data | Decisão | Motivo | Alternativas consideradas | Responsável |
|---|---|---|---|---|
| 30/07/2026 | Usar `a8d18c` como referência exata de produção | Hash do HTML da Hostinger coincide com o artefato desse commit | Usar o HEAD remoto ou somente a data `Last-Modified` | Codex |
| 30/07/2026 | Iniciar as melhorias a partir do HEAD `ca122e1` | É a versão mais recente do código-fonte e sucede a produção por um commit | Criar a branch diretamente do commit de produção | Codex |
| 30/07/2026 | Fixar Node.js `24.18.1` e npm `11.16.0` | Node 24 é LTS, possui suporte superior ao Node 22 e inclui essa versão do npm | Permanecer no Node 22 LTS ou usar Node 26 Current | Codex |
| 30/07/2026 | Manter nomes legacy das variáveis Supabase nesta fase | O código atual consome `ANON_KEY` e `SERVICE_ROLE_KEY`; renomear sem migrar o código quebraria os ambientes | Migrar agora para `sb_publishable_*` e `sb_secret_*` | Codex |
| 30/07/2026 | Não adicionar variáveis futuras ao `.env.example` ativo | Placeholders não consumidos sugerem configuração obrigatória inexistente | Incluir antecipadamente URL da função e CAPTCHA | Codex |

---

# Riscos e bloqueios

| Data | Risco ou bloqueio | Impacto | Ação necessária | Responsável | Situação |
|---|---|---|---|---|---|
| 30/07/2026 | Cópia local inicialmente sem metadados `.git` acessíveis | Falta de rastreabilidade e comparação local | Metadados restaurados a partir de clone HTTPS validado | Codex | Resolvido |
| 30/07/2026 | SSH do GitHub sem chave autorizada nesta máquina | Push via URL SSH não funciona | GitHub CLI autenticado e Git configurado para HTTPS | Codex | Resolvido por HTTPS |
| 30/07/2026 | `out` foi regenerado durante a auditoria | `git status` contém alterações de artefatos de build | Decidir na Fase 6 se `out` continuará versionado; não incluir alterações acidentais no commit | — | Aberto |
| 30/07/2026 | Edge Function pública sem CAPTCHA e rate limiting | Spam e inserções abusivas | Executar Fase 1.2 | — | Aberto |
| 30/07/2026 | Schema Supabase sem migrations versionadas | Banco não reproduzível | Executar Fase 2 | — | Aberto |
| 30/07/2026 | Deploy Hostinger aparentemente manual | Erros de publicação e rollback difícil | Executar Fase 3 | — | Aberto |
| 30/07/2026 | Cinco vulnerabilidades altas no npm | Risco de segurança e manutenção | Executar Fase 1.1 | — | Aberto |
| 30/07/2026 | Chave pública `anon` de projeto antigo presente em bundles do histórico | Projeto histórico permanece identificável e acessível conforme RLS | Confirmar desativação ou revisar RLS do project ref `lgmfuswfvlnagthmrhjw` | — | Aberto |

---

# Histórico de marcos

| Data | Marco | Commit/PR | Observações |
|---|---|---|---|
| 30/07/2026 | Auditoria técnica inicial concluída | — | Arquitetura, build, Supabase, segurança e deploy avaliados |
| 30/07/2026 | Documento de acompanhamento criado | — | Checklist inicial do roadmap |
| 30/07/2026 | Fase 0.1 concluída localmente | — | Produção identificada em `a8d18c`; tag e branch locais criadas |
| 30/07/2026 | Fase 0.2 concluída | — | Runtime fixado e validado com instalação limpa, lint e build |
| 30/07/2026 | Fase 0.3 concluída | — | Exemplos de ambiente, inventário e varredura de secrets concluídos |
