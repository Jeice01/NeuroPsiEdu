# Backend de cursos NeuroPsiEdu

Projeto exclusivo de cursos: `ydmvbssgiffqrmwigkae`. O diretório `supabase/` da
raiz pertence aos leads institucionais e não deve ser reutilizado para cursos.

## Estado em 04/10/2026

As seis migrations incrementais foram aplicadas sobre o banco existente, após
backup privado e ensaio de restauração. As quatro Edge Functions estão publicadas:
`cadastro-curso`, `checkout-curso`, `pagbank-webhook` e `conciliar-cursos`.
A conciliação agendada executa a cada cinco minutos. O pagamento utiliza somente
PagBank Sandbox; não há liberação de vendas reais.

Na conciliação, os juros comprovados por `charges.amount.fees.buyer.interest`
são separados do principal do curso. O total bruto deve estar integralmente pago,
sem reembolso ou acréscimo; principal, total bruto e juros permanecem no resumo
do evento. Não deduzir taxas do vendedor. Taxas inválidas, excesso sem juros
comprovados e reembolsos de cobranças com juros seguem para revisão. Referência,
moeda, preço do servidor, capacidade e deduplicação continuam obrigatórios.

A homologação integrada usa um curso e uma turma novos, identificados como
Sandbox, sem ocupar vagas da turma real. `CURSOS_SANDBOX_TURMA_ID` e
`CURSOS_SANDBOX_TEST_EMAIL`, definidos juntos no servidor, restringem novos
cadastros e recuperação ao teste autorizado. Autorizações de imagem e marketing
são recusadas nessa configuração. O desafio Turnstile real continua obrigatório.

O navegador recebe apenas configuração pública. Tokens administrativos, senha
do banco, chave secreta Turnstile, token PagBank e senha SMTP devem permanecer
no arquivo ignorado `.env.deploy.local` e nos serviços correspondentes.
Não enviar credenciais pelo chat nem publicar backups.

A recuperação exige códigos de oito dígitos, inclusive zeros iniciais. Manter
`mailer_otp_length=8` no Auth hospedado e `otp_length=8` no ambiente local,
em concordância com o formulário e a validação da função. Os templates de
confirmação e magic link devem usar `{{ .Token }}`. Solicitar um novo código
invalida o anterior; não registrar códigos, hashes de OTP ou sessões nos logs.

## Testes

Na raiz do repositório, com Node do projeto:

```powershell
node --test services/cursos/tests/registration.test.mjs services/cursos/tests/checkout.test.mjs services/cursos/tests/reconciliation.test.mjs
npx deno@2.5.6 test --allow-env services/cursos/supabase/functions/cadastro-curso/recovery_test.ts
node --test services/cursos/tests/database.test.mjs
```

O último comando exige Docker Desktop Linux. Cria um PostgreSQL 17.6 exclusivo,
sem rede, portas ou volumes compartilhados. Aplica o baseline, dados fictícios e
as migrations, verificando preservação do legado, permissões, idempotência,
concorrência, recuperação, checkout e conciliação. Remove apenas o container
identificado por sua label de teste. Nunca executa testes no banco remoto.

## Arquivos e operação

`baseline/remote-schema.json` contém metadados, sem linhas de participantes.
`baseline/schema.sql` é exclusivo do banco de teste e não é migration remota.
As migrations dependem da estrutura original; não iniciar um banco vazio como
se fossem um baseline completo. `supabase/config.toml` identifica o ambiente
local separado e não autoriza reset do banco remoto.

Não usar `db reset`, `migration repair`, `--prune` ou scripts legados no banco
remoto. Mudanças futuras exigem backup, revisão e migração incremental. Preservar
a revisão dos registros legados; nunca inferir pagamento ou consentimento antigo.

As tabelas privadas têm RLS e acesso de cliente revogado; as funções públicas
validam suas próprias autorizações. Não criar policies abertas para silenciar
avisos. O webhook exige o protocolo de assinatura explicitamente configurado,
sem fallback. A assinatura real observada no Sandbox ainda requer homologação;
a conciliação por consulta autenticada não dispensa essa revisão.

A fila de comunicações financeiras é registrada, mas seu envio não está
implementado. O SMTP de homologação envia códigos de acesso, não comprova o envio
de confirmação de matrícula. As páginas e as condições públicas de teste estão
em `/curso-zulliger/teste/`; inscrições reais continuam fechadas.
