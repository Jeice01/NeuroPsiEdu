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
| 1 | Correções críticas de segurança | P0 | [x] |
| 2 | Banco Supabase reproduzível e seguro | P0 | 🔄 |
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
- [x] Registrar extensões PostgreSQL utilizadas.
- [x] Registrar funções, triggers, views, grants e políticas RLS.
- [x] Exportar uma amostra sanitizada da estrutura de dados.
- [x] Fazer backup local da implementação versionada da Edge Function.
- [x] Baixar e comparar a Edge Function atualmente publicada.
- [x] Fazer backup dos arquivos atualmente publicados na Hostinger.
- [x] Confirmar a existência e a data do backup automático da Hostinger.
- [x] Registrar as configurações públicas relevantes de DNS.
- [x] Consolidar o inventário DNS relevante para recuperação.
- [x] Documentar o procedimento de restauração.
- [x] Validar os schemas da aplicação em ambiente local isolado.

### Critérios de aceite

- [x] O backup possui data, origem e responsável.
- [x] Os arquivos dos schemas da aplicação podem ser lidos e restaurados.
- [x] A restauração dos schemas da aplicação está documentada.
- [x] Dados pessoais permanecem somente no diretório local ignorado pelo Git.

### Testes e evidências

- [x] Validar a integridade dos arquivos de backup.
- [x] Executar uma restauração de teste do schema.
- [x] Confirmar tabelas, índices, funções e políticas restauradas.
- [x] Registrar tempo e resultado da restauração.

### Andamento em 30/07/2026

- Documento operacional criado em `docs/BACKUP_RECOVERY.md`.
- Diretório local `backups/` protegido pelo `.gitignore`.
- Projeto Supabase usado pela Edge Function identificado, mas sem acesso na
  sessão autenticada inicialmente.
- CLI autenticada novamente e projeto correto vinculado.
- Dumps `schema.sql`, `roles.sql` e `data.sql` gerados, protegidos pelo
  `.gitignore` e verificados por SHA-256.
- Edge Function remota baixada; hash idêntico ao código versionado.
- Inventário sanitizado criado em `docs/SUPABASE_SCHEMA_INVENTORY.md`.
- Restauração local concluída para `roles.sql`, `schema.sql` e
  `app-data.sql`.
- O dump completo de Auth/Storage apresentou incompatibilidade de versão
  documentada; a transação de teste foi revertida sem restauração parcial.
- Backup da Hostinger baixado, copiado para o diretório protegido, validado por
  SHA-256 e extraído com sucesso em ambiente temporário.
- Inventário DNS consolidado em `docs/DNS_INVENTORY.md`.
- Fase 0.4 concluída em 30/07/2026.
- Projeto Supabase histórico acessível, porém no plano Free e sem backups
  agendados.
- Backup automático da Hostinger confirmado para `30/07/2026 09:09`.
- Download da Hostinger preparado, mas a transferência local foi interrompida;
  o arquivo temporário de 6 MiB foi rejeitado como backup inválido.
- Nenhuma restauração foi executada em produção.

## 0.5 Linha de base de qualidade

- [x] Registrar resultado inicial do lint.
- [x] Registrar resultado inicial do build.
- [x] Registrar vulnerabilidades iniciais do `npm audit`.
- [x] Registrar tamanho inicial do diretório `public`.
- [x] Registrar tamanho inicial do diretório `out`.
- [x] Registrar tamanho inicial dos bundles principais.
- [x] Registrar páginas geradas pelo build.
- [x] Executar auditoria inicial do Lighthouse.
- [x] Executar auditoria inicial de acessibilidade.
- [x] Fazer smoke test manual dos formulários.

Evidências e método de comparação:
[`docs/QUALITY_BASELINE.md`](docs/QUALITY_BASELINE.md).

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

- [x] Todos os resultados estão registrados com data.
- [x] É possível comparar as métricas antes e depois das alterações.

---

# Fase 1 — Correções críticas de segurança

**Objetivo:** corrigir dependências vulneráveis e proteger os endpoints públicos
de captação de leads.

## 1.1 Atualização de dependências

**Branch sugerida:** `chore/runtime-and-dependencies`

- [x] Atualizar Next.js de `15.5.18` para uma versão corrigida compatível.
- [x] Atualizar `eslint-config-next` para a mesma versão.
- [x] Executar `npm audit fix` sem `--force`.
- [x] Revisar alterações transitivas no `package-lock.json`.
- [x] Confirmar compatibilidade com React 19.
- [x] Revisar os avisos atuais de `sharp`, `postcss`, `brace-expansion` e `js-yaml`.
- [x] Confirmar se restaram vulnerabilidades aplicáveis à produção.
- [x] Registrar vulnerabilidades aceitas, se houver, com justificativa e prazo.

Resultado e evidências:
[`docs/DEPENDENCY_UPDATE_1_1.md`](docs/DEPENDENCY_UPDATE_1_1.md).

### Critérios de aceite

- [x] `npm ci` é executado com sucesso.
- [x] `npm run lint` não apresenta erros.
- [x] `npm run build` é executado com sucesso.
- [x] Nenhuma vulnerabilidade alta aplicável permanece sem plano documentado.
- [x] Todas as rotas estáticas continuam sendo geradas.

### Testes

- [x] Home.
- [x] Blog e artigos.
- [x] Landing page FNP.
- [x] Landing page FAMAF.
- [x] Menu desktop.
- [x] Menu mobile.
- [x] Modais.
- [x] Links para WhatsApp e Telegram.

## 1.2 Proteção da Edge Function

**Branch sugerida:** `security/lead-form-protection`

- [x] Escolher Cloudflare Turnstile ou solução equivalente.
- [x] Adicionar o widget aos formulários.
- [x] Enviar o token junto com a requisição.
- [x] Validar o token exclusivamente na Edge Function.
- [x] Recusar token ausente, inválido, expirado ou reutilizado.
- [x] Implementar rate limiting.
- [x] Limitar requisições por hash de IP.
- [x] Limitar tentativas repetidas por e-mail e telefone.
- [x] Adicionar honeypot aos formulários.
- [x] Limitar o tamanho máximo do corpo HTTP.
- [x] Manter limites máximos por campo.
- [x] Restringir origens permitidas.
- [x] Remover curingas de preview em produção.
- [x] Adicionar cabeçalhos de segurança apropriados.
- [x] Padronizar logs sem registrar dados pessoais completos.
- [x] Não expor erros internos do Supabase ao navegador.
- [x] Retornar HTTP 429 em caso de rate limit.

Implementação, evidências e pendências de ativação:
[`docs/EDGE_FUNCTION_SECURITY_1_2.md`](docs/EDGE_FUNCTION_SECURITY_1_2.md).

### Critérios de aceite

- [x] Requisição legítima é registrada.
- [x] Requisição sem CAPTCHA válido é rejeitada.
- [x] Bot ou script não consegue contornar a proteção apenas alterando `Origin`.
- [ ] Excesso de requisições recebe HTTP 429.
- [x] Logs permitem investigar falhas sem expor PII desnecessária.
- [x] A chave `service_role` não aparece no frontend nem nos logs.

### Testes

- [x] POST válido.
- [x] POST sem CAPTCHA.
- [x] POST com CAPTCHA inválido.
- [ ] POST repetido além do limite.
- [x] POST com corpo acima do limite.
- [x] POST com JSON inválido.
- [x] GET, PUT e DELETE.
- [x] OPTIONS/CORS.
- [x] Origem autorizada.
- [x] Origem não autorizada.
- [x] Falha simulada do banco.

## 1.3 Correções funcionais dos formulários

- [x] Corrigir a mensagem fixa da “8ª Turma FANP”.
- [x] Retornar mensagem apropriada para FNP.
- [x] Retornar mensagem apropriada para FAMAF.
- [x] Validar `formacao_interesse` no servidor.
- [x] Usar lista permitida de formações e origens.
- [x] Impedir que o cliente defina livremente `status_lead`.
- [x] Padronizar o contrato de resposta da API.
- [x] Padronizar mensagens de erro no frontend.
- [x] Evitar alertas nativos do navegador.
- [x] Confirmar eventos corretos no `dataLayer`.

### Critérios de aceite

- [x] Cada formulário apresenta a mensagem correta.
- [x] Valores não permitidos são rejeitados ou normalizados.
- [x] O servidor controla campos administrativos.
- [x] Erros de rede e servidor são apresentados de forma acessível.

Implementação e evidências:
[`docs/FORM_CONTRACT_1_3.md`](docs/FORM_CONTRACT_1_3.md).

---

# Fase 2 — Banco Supabase reproduzível e seguro

**Objetivo:** versionar a estrutura de dados e garantir acesso mínimo.

**Branch sugerida:** `database/version-schema-and-rls`

## 2.1 Migrations

- [x] Criar migration do schema `neuropsiedu`.
- [x] Criar migration da tabela `leads_formacoes`.
- [x] Criar migration da tabela `espera_pos`.
- [x] Decidir se `tab_pos` ainda é necessária.
- [x] Criar migration de `tab_pos` ou removê-la.
- [x] Versionar primary keys.
- [x] Versionar valores padrão e timestamps.
- [x] Versionar constraints de tamanho e formato.
- [x] Versionar índices de consulta.
- [x] Criar estratégia de deduplicação.
- [x] Versionar functions, triggers e views utilizadas.
- [x] Não fixar versões de extensões sem necessidade.

Implementação, decisões e evidências:
[`docs/SUPABASE_MIGRATIONS_2_1.md`](docs/SUPABASE_MIGRATIONS_2_1.md).

## 2.2 RLS, grants e Data API

- [x] Identificar schemas expostos pela Data API.
- [x] Habilitar RLS em todas as tabelas expostas do schema `neuropsiedu`.
- [x] Revogar leitura pública dos leads.
- [x] Revogar update e delete públicos.
- [x] Revisar inserts feitos por `anon`.
- [x] Substituir inserts diretos por Edge Function.
- [x] Registrar grants de `anon`.
- [x] Registrar grants de `authenticated`.
- [x] Registrar privilégios da service role utilizados pela função.
- [x] Revisar views com `security_invoker` (nenhuma nos schemas auditados).
- [x] Manter funções `security definer` fora do schema `neuropsiedu`.
- [x] Executar os advisors de segurança e performance.

Implementação, matriz de privilégios, testes e alertas compartilhados:
[`docs/SUPABASE_SECURITY_2_2.md`](docs/SUPABASE_SECURITY_2_2.md).

## 2.3 Tipos e validação

- [x] Gerar tipos TypeScript do banco.
- [x] Versionar os tipos gerados.
- [x] Tipar os inserts da Edge Function.
- [x] Tipar respostas e erros do Supabase.
- [x] Validar migrations em banco local ou de staging.

### Critérios de aceite da fase

- [x] Um projeto Supabase vazio pode ser recriado pelas migrations.
- [x] Leads não podem ser lidos publicamente.
- [x] O frontend não possui acesso administrativo.
- [x] Os advisors não apresentam alerta crítico não documentado.
- [x] O schema real corresponde ao schema versionado.

Geração, integração dos tipos, correção de drift e evidências:
[`docs/SUPABASE_TYPES_2_3.md`](docs/SUPABASE_TYPES_2_3.md).

---

# Fase 3 — CI/CD e deploy automatizado

**Objetivo:** tornar build, validação e publicação reproduzíveis.

## 3.1 Integração contínua

**Branch sugerida:** `ci/quality-gates`

- [x] Criar workflow para pull requests.
- [x] Fixar a versão do Node.js.
- [x] Executar `npm ci`.
- [x] Executar lint.
- [x] Executar verificação de tipos.
- [x] Executar testes automatizados.
- [x] Executar build de produção.
- [x] Executar auditoria de dependências.
- [x] Armazenar o diretório `out` como artefato.
- [x] Configurar proteção da branch `main`.
- [x] Exigir pull request e checks verdes para merge.

Implementação e operação do workflow:
[`docs/CI_3_1.md`](docs/CI_3_1.md).

## 3.2 Deploy do frontend

**Branch sugerida:** `ci/hostinger-deploy`

- [x] Confirmar método suportado pela Hostinger.
- [x] Criar secret do webhook de Git da Hostinger no GitHub.
- [x] Publicar somente o artefato aprovado.
- [x] Evitar exposição de credenciais nos logs.
- [x] Preservar versão anterior para rollback.
- [x] Executar smoke test HTTP após o deploy.
- [x] Registrar commit e data da versão publicada.
- [x] Criar mecanismo de deploy manual emergencial.

Arquitetura, operação e rollback:
[`docs/HOSTINGER_DEPLOY_3_2.md`](docs/HOSTINGER_DEPLOY_3_2.md).

## 3.3 Deploy do Supabase

- [x] Criar ambiente de staging.
- [x] Validar migrations antes da produção.
- [x] Criar workflow de deploy da Edge Function.
- [x] Exigir aprovação para alteração de banco em produção.
- [x] Validar a função após a publicação.
- [x] Documentar rollback de função e banco.

Pipeline, promoção e rollback:
[`docs/SUPABASE_DEPLOY_3_3.md`](docs/SUPABASE_DEPLOY_3_3.md).

### Critérios de aceite da fase

- [x] Todo pull request executa os checks.
- [x] Merge inválido é bloqueado.
- [x] O deploy não depende de upload manual.
- [x] Cada versão publicada corresponde a um commit.
- [x] Existe rollback testado.

---

# Fase 4 — Testes automatizados

**Objetivo:** proteger rotas, formulários e regras de negócio.

**Branch sugerida:** `test/lead-and-routes`

## 4.1 Testes unitários

- [x] Validação de nome.
- [x] Validação e normalização de e-mail.
- [x] Validação de WhatsApp e DDD.
- [x] Limites de texto.
- [x] Captura de UTMs.
- [x] Mapeamento de formação.
- [x] Mensagens de sucesso por formação.
- [x] Tratamento de erros.

## 4.2 Testes da Edge Function

- [x] Método inválido.
- [x] JSON inválido.
- [x] Campos ausentes.
- [x] Consentimento ausente.
- [x] CAPTCHA inválido.
- [x] Rate limiting.
- [x] Duplicidade.
- [x] Falha do banco.
- [x] Resposta FANP.
- [x] Resposta FAMAF.

## 4.3 Testes end-to-end

- [x] Carregamento da home.
- [x] Navegação do blog.
- [x] Renderização de todos os artigos.
- [x] Abertura e fechamento dos modais.
- [x] Envio de lead FANP.
- [x] Envio de lead FAMAF.
- [x] Navegação por teclado.
- [x] Menu mobile.
- [x] Página 404.
- [x] Links externos principais.

### Critérios de aceite da fase

- [x] Testes são executados na CI.
- [x] Falha de teste bloqueia o merge.
- [x] Dados de teste são identificáveis e removíveis.
- [x] Fluxos críticos possuem cobertura automatizada.

---

# Fase 5 — SEO, performance e acessibilidade

**Objetivo:** melhorar indexação, velocidade e experiência inclusiva.

## 5.1 SEO

**Branch sugerida:** `seo/canonical-metadata-sitemap`

- [x] Escolher URL canônica da formação FAMAF.
- [x] Redirecionar `/famaf`.
- [x] Redirecionar `/formacao-manuseio`.
- [x] Preservar UTMs nos redirecionamentos.
- [x] Definir `metadataBase`.
- [x] Definir canonical por página.
- [x] Criar metadados por artigo.
- [x] Criar Open Graph absoluto.
- [x] Criar Twitter cards.
- [x] Criar sitemap.
- [x] Criar robots.
- [x] Revisar dados estruturados.

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
| 31/07/2026 | Fase 2.1 | Local | Recriar banco com `supabase db reset --local --no-seed` | Aprovado | Todas as migrations aplicadas do zero | Codex |
| 31/07/2026 | Fase 2.1 | Local | Testar constraints, deduplicação e triggers | Aprovado | `supabase/tests/phase_2_1_schema.sql` | Codex |
| 31/07/2026 | Fase 2.1 | Supabase | Aplicar e validar migration remota | Aprovado | Migration `20260731045319`; lint sem erros | Codex |
| 01/08/2026 | Fase 2.2 | Local | Reset, teste de RLS/grants, lint e advisor | Aprovado | `supabase/tests/phase_2_2_security.sql`; advisor sem alertas | Codex |
| 01/08/2026 | Fase 2.2 | Local | Integração da lista de espera e bloqueio da Data API anônima | Aprovado | Edge HTTP 200; `SELECT`/`INSERT` anônimos HTTP 401; dados sintéticos removidos | Codex |
| 01/08/2026 | Fase 2.2 | Supabase | Aplicar migration, publicar Edge Function e validar privilégios | Aprovado com alertas compartilhados | Migration `20260801134914`; lint sem erros | Codex |
| 01/08/2026 | Fase 2.2 | Local | `npm run lint` e build de produção | Aprovado com 10 avisos conhecidos | 16 páginas estáticas; site key Turnstile presente no artefato | Codex |
| 01/08/2026 | Fase 2.2 | Hostinger/Produção | Publicar frontend, limpar cache e testar o fluxo ponta a ponta | Aprovado | Turnstile concluído; interface exibiu `Dados enviados!`; registro confirmado no Supabase | Codex |
| 03/08/2026 | Fase 2.2 | Supabase | Remover o dado sintético do teste de produção e consultar novamente | Aprovado | 1 registro removido; contagem final igual a 0 | Codex |
| 03/08/2026 | Fase 2.3 | Local | Recriar banco, executar scripts SQL, lint, advisors e `deno check` | Aprovado com avisos compartilhados | Migrations completas; schema `neuropsiedu` sem erros; tipagem Deno válida | Codex |
| 03/08/2026 | Fase 2.3 | Supabase | Corrigir drift, gerar tipos e publicar Edge Function tipada | Aprovado | Migration `20260803130532`; leitura anônima bloqueada; preflight HTTP 204 | Codex |
| 03/08/2026 | Fase 3.1 | Local | Executar `npm ci`, lint, typecheck, testes, audit e build | Aprovado com 10 avisos conhecidos | 3 testes; 0 vulnerabilidades; 16 páginas estáticas | Codex |
| 03/08/2026 | Fase 3.1 | GitHub Actions | Executar `quality-gates` no PR #1 | Aprovado em 1m13s | Run `30818771680`; job `91703055444` | Codex |
| 03/08/2026 | Fase 3.1 | GitHub | Proteger a `main` para o fluxo individual | Aprovado | `quality-gates`, PR obrigatório, 0 aprovações, branch atualizada e conversas resolvidas | Codex |
| 04/08/2026 | Fase 4.1 | Local | Testes unitários, typecheck, lint e build estático | Aprovado com 10 avisos conhecidos | 12 testes aprovados; 16 páginas estáticas | Codex |
| 04/08/2026 | Fase 4.2 | Local | Typecheck e testes isolados da Edge Function | Aprovado | 10 cenários Deno; nenhum serviço externo ou dado real | Codex |
| 04/08/2026 | Fase 4.3 | Local | Playwright Chromium: navegação e formulários | Aprovado | 7 cenários E2E; API de leads e Turnstile simulados, sem dados reais | Codex |
| 04/08/2026 | Fase 5.1 | Local | Build e inspeção automatizada do artefato SEO | Aprovado | Canonicals, redirects, sitemap, robots, social cards e JSON-LD verificados em `out` | Codex |

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
| 31/07/2026 | Não recriar `tab_pos` no projeto atual | A tabela pertence ao projeto histórico e o único componente que a usa não é importado | Migrar `tab_pos` ou manter duas estruturas de captação | Codex |
| 31/07/2026 | Deduplicar somente leads em estado `novo` | Evita spam duplicado sem bloquear uma nova inscrição futura | Unicidade permanente por e-mail ou nenhuma deduplicação | Codex |
| 01/08/2026 | Bloquear totalmente `anon` e `authenticated` no schema `neuropsiedu` | Dados pessoais de leads não devem ser acessíveis pela Data API | Criar políticas públicas de insert ou manter insert direto | Codex |
| 01/08/2026 | Conceder privilégios mínimos à `service_role` por tabela | Limita o impacto da chave privilegiada usada pela Edge Function | Manter `ALL` no schema ou usar grants amplos | Codex |

---

# Riscos e bloqueios

| Data | Risco ou bloqueio | Impacto | Ação necessária | Responsável | Situação |
|---|---|---|---|---|---|
| 30/07/2026 | Cópia local inicialmente sem metadados `.git` acessíveis | Falta de rastreabilidade e comparação local | Metadados restaurados a partir de clone HTTPS validado | Codex | Resolvido |
| 30/07/2026 | SSH do GitHub sem chave autorizada nesta máquina | Push via URL SSH não funciona | GitHub CLI autenticado e Git configurado para HTTPS | Codex | Resolvido por HTTPS |
| 30/07/2026 | `out` foi regenerado durante a auditoria | `git status` contém alterações de artefatos de build | Decidir na Fase 6 se `out` continuará versionado; não incluir alterações acidentais no commit | — | Aberto |
| 30/07/2026 | Edge Function pública sem CAPTCHA e rate limiting | Spam e inserções abusivas | Fase 1.2 implantada e validada em produção em 31/07/2026 | Codex | Resolvido |
| 30/07/2026 | Schema Supabase sem migrations versionadas | Banco não reproduzível | Executar Fase 2 | — | Aberto |
| 30/07/2026 | Deploy Hostinger aparentemente manual | Erros de publicação e rollback difícil | Executar Fase 3 | — | Aberto |
| 30/07/2026 | Cinco vulnerabilidades altas no npm | Risco de segurança e manutenção | Executar Fase 1.1 | — | Aberto |
| 30/07/2026 | Chave pública `anon` de projeto antigo presente em bundles do histórico | Projeto histórico permanece identificável e acessível conforme RLS | Confirmar desativação ou revisar RLS do project ref `lgmfuswfvlnagthmrhjw` | — | Aberto |
| 31/07/2026 | Formulário da lista de espera usa insert direto em `public.espera_pos` | Fluxo incompatível com o modelo seguro | Frontend migrado para a Edge Function, publicado e aprovado em produção | Codex | Resolvido |
| 01/08/2026 | Advisor remoto aponta itens do aplicativo compartilhado em `public` | Revogação ampla pode interromper o ProjectOrbis | Auditar bucket `avatars`, funções `security definer` e proteção de senhas em fase própria | — | Aberto e documentado |
| 01/08/2026 | Chrome sem permissão de acesso a arquivos locais | Upload e teste de produção do frontend da Fase 2.2 não puderam ser concluídos | Extensão reinstalada, permissão ativada e upload concluído | Usuário/Codex | Resolvido |
| 03/08/2026 | Proteção de branch indisponível no repositório privado no plano anterior | Não era possível exigir aprovação e `quality-gates` antes do merge | Repositório tornado público e proteção da `main` aplicada | Usuário/Codex | Resolvido |

---

# Histórico de marcos

| Data | Marco | Commit/PR | Observações |
|---|---|---|---|
| 31/07/2026 | Fase 2.1 concluída | `database/version-schema-and-rls` | Schema de leads reproduzível, validado localmente e aplicado ao Supabase |
| 03/08/2026 | Fase 2.2 concluída em produção | `database/version-schema-and-rls` | RLS, grants, Edge Function, frontend Hostinger e fluxo ponta a ponta validados; dado sintético removido |
| 03/08/2026 | Fase 2.3 concluída | `database/version-schema-and-rls` | Tipos do banco versionados, Edge Function tipada e schema local/remoto alinhado |
| 03/08/2026 | Fase 3.1 concluída | PR `#1` | `quality-gates` aprovado e proteção obrigatória da `main` configurada |
| 31/07/2026 | Fase 1.3 ativada em produção | `security/lead-form-protection` | Mensagens FANP/FAMAF, origens canônicas e eventos de conversão padronizados |
| 31/07/2026 | Fase 1.2 implantada em produção | `security/lead-form-protection` | Turnstile ativo em FNP/FAMAF, Edge Function protegida e POST integrado aprovado |
| 30/07/2026 | Auditoria técnica inicial concluída | — | Arquitetura, build, Supabase, segurança e deploy avaliados |
| 30/07/2026 | Documento de acompanhamento criado | — | Checklist inicial do roadmap |
| 30/07/2026 | Fase 0.1 concluída localmente | — | Produção identificada em `a8d18c`; tag e branch locais criadas |
| 30/07/2026 | Fase 0.2 concluída | — | Runtime fixado e validado com instalação limpa, lint e build |
| 30/07/2026 | Fase 0.3 concluída | — | Exemplos de ambiente, inventário e varredura de secrets concluídos |
