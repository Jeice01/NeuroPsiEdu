# Homologação integrada Zulliger

Data: 04/10/2026. O curso real e suas inscrições permanecem fechados no site.
O teste usa `/curso-zulliger/teste/`, fora dos menus e do sitemap, com `noindex`.
Isso reduz descoberta, mas não é controle de acesso; a restrição efetiva é feita
no backend por turma e e-mail autorizados, além de Turnstile e token de acesso.

Turma Sandbox: `1349d08b-4fc6-4b1f-a485-2e691f716ab2`.
Curso Sandbox: `53977dc0-4f17-43a2-b796-82be0726614d`.
Nenhuma inscrição da turma real é modificada ou usada como fixture.

## Configuração

No servidor, `CURSOS_SANDBOX_TURMA_ID` e `CURSOS_SANDBOX_TEST_EMAIL` restringem
cadastro e recuperação. O retorno do checkout é
`https://neuropsiedu.com.br/curso-zulliger/teste/resultado/`.
As versões de condições e privacidade são `sandbox-20261003`, exclusivas do teste.
As condições estão em `/curso-zulliger/teste/condicoes/`; não são os documentos
de contratação do curso real. O envio de códigos utiliza o SMTP de homologação.

Na CI, as variáveis GitHub `CURSOS_SANDBOX_TURMA_ID` e
`CURSOS_TURNSTILE_SITE_KEY` contêm apenas configuração pública. Os demais
parâmetros públicos são explícitos no passo de build. As inscrições oficiais
continuam com `NEXT_PUBLIC_CURSOS_ENABLED=false` e
`ZULLIGER_INFORMATION_ONLY=true`; somente a rota de teste usa a configuração
Sandbox. Deploy automático consome o artefato aprovado pela CI. O fluxo manual
continua gerando um site sem formulário Sandbox habilitado.

A sessão e a chave de tentativa financeira de teste usam namespace separado
no navegador. Encerrar o acesso de teste não encerra a sessão do curso real.
No Sandbox não são solicitadas autorizações de imagem ou marketing, e o
servidor também rejeita essas opções.

## Encerramento e promoção

Ao encerrar os testes, desabilitar `NEXT_PUBLIC_CURSOS_SANDBOX_ENABLED` na CI,
publicar novamente e inativar somente a turma Sandbox. Preservar o histórico
até revisão e exclusão controlada da finalidade de homologação.

Não habilitar vendas reais só trocando o token PagBank. Primeiro validar a
jornada, assinatura real de webhook, entrega de comunicações, termos de
contratação, privacidade e recuperação/backups. O código de pagamento atual
aceita exclusivamente o host Sandbox. A fila de comunicações ainda não possui
worker de envio. O cron consulta pagamentos com credencial do servidor.

## Segurança conhecida

As tabelas têm RLS e grants de cliente revogados; ausência de policies abertas
é intencional. O advisor ainda aponta os grants da função gerenciada
`rls_auto_enable()` e proteção de senhas vazadas desativada; esses pontos exigem
revisão separada antes da liberação real. Não foram enfraquecidas permissões
para executar esta homologação.

Referências: [advisor de funções privilegiadas](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable)
e [proteção de senhas](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).
