# Backend de cursos NeuroPsiEdu

Projeto exclusivo de cursos: `ydmvbssgiffqrmwigkae`. O diretório `supabase/` da
raiz pertence aos leads institucionais e não deve ser reutilizado para cursos.

## Estado em 04/10/2026

As seis migrations iniciais foram aplicadas sobre o banco existente, após
backup privado e ensaio de restauração. A sétima migration adiciona claims à
fila de confirmação. As cinco Edge Functions estão publicadas:
`cadastro-curso`, `checkout-curso`, `pagbank-webhook`, `conciliar-cursos` e `enviar-confirmacoes`.
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

O webhook registra `pagbank_webhook_auth` nos logs da função: `missing_signature`,
`invalid_signature_format`, `signature_mismatch`, `verification_error` ou
`verified`. O diagnóstico contém apenas o nome do cabeçalho esperado, presença
dos dois cabeçalhos e tamanho do corpo. Não contém assinaturas, tokens, corpo,
hashes, dados pessoais ou mensagens internas. Uma assinatura recusada continua
retornando 401 antes de consultas ao provedor ou escritas no banco.

Na raiz do repositório, com Node do projeto:

```powershell
node --test services/cursos/tests/registration.test.mjs services/cursos/tests/checkout.test.mjs services/cursos/tests/reconciliation.test.mjs services/cursos/tests/confirmation.test.mjs
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

A função `enviar-confirmacoes` processa exclusivamente confirmações da turma
Sandbox e do destinatário configurados em `CURSOS_SANDBOX_TURMA_ID` e
`CURSOS_SANDBOX_TEST_EMAIL`. Exige um Bearer privado independente,
`CURSOS_CONFIRMATION_SECRET` (mínimo 32 caracteres); não aceita destinatários do
corpo da requisição. A migração `confirmation_email_queue` deve preceder seu deploy.
Usa `CURSOS_SMTP_HOST=smtp.gmail.com`, `CURSOS_SMTP_PORT=465`, TLS obrigatório,
`CURSOS_SMTP_USER`, `CURSOS_SMTP_PASS` e `CURSOS_SMTP_ADMIN_EMAIL`; usuário e
remetente devem corresponder ao e-mail autorizado de teste. A configuração SMTP
do Auth para códigos de acesso é independente e não deve ser alterada.

Uma RPC privada seleciona apenas inscrições confirmadas, sem revisão legada,
pagamento pago e reserva confirmada. Claims usam lock e token por tentativa.
Um envio aceito pelo SMTP passa a `enviado`, o que não comprova chegada à caixa
de entrada. Falha SMTP ou claim com mais de cinco minutos passa a `revisao`,
`envio_incerto`, sem reenvio automático: SMTP não fornece idempotência garantida.
Falha de persistência após aceite SMTP também exige conferência manual. Não
registrar respostas SMTP, dados pessoais ou credenciais nos logs. O e-mail e seu
assunto identificam o Sandbox e não prometem matrícula ou certificado reais.
Não há envio financeiro habilitado para turmas reais. As páginas de teste estão
em `/curso-zulliger/teste/`; inscrições reais continuam fechadas.

O job `cursos-confirmacoes-sandbox` chama o worker a cada cinco minutos via
`pg_cron`/`pg_net`. A URL está no Vault como `cursos_project_url`; o Bearer privado
fica em `cursos_confirmation_secret`, sem credenciais no comando do job. Para
interromper envios, usar `SELECT cron.unschedule('cursos-confirmacoes-sandbox');`
e preservar a fila e os pagamentos. Verificar o resultado HTTP em
`net._http_response`: sucesso do job Cron comprova apenas o disparo da requisição.
Não resetar mensagens `enviado` ou `revisao` para `pendente` sem investigar.
