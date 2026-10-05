# Fila de interesse — Zulliger

O cadastro de interesse é separado de matrícula, checkout e reserva. Não cria
participante financeiro, inscrição ou pagamento, nem consome vagas. A entrada
no grupo é voluntária: a tela oferece o convite após salvar o cadastro e apenas
quando a pessoa marcou a opção. Não há adição automática de contatos ao WhatsApp.

## Banco e destino

- Projeto de cursos: `ydmvbssgiffqrmwigkae`.
- Tabela: `public.interesses_curso`.
- Consulta para relatórios: `public.lista_interesses_curso`.
- Planilha indicada pela usuária: https://docs.google.com/spreadsheets/d/1P9YoYFxWhwj3IwDB4E1aRDcpUKI3kDu-kZ2nNwAzWkQ/edit.
- Convite informado pela usuária: https://chat.whatsapp.com/GX3998AXL59KQkrFNt6xPQ.

A tabela e a consulta não são acessíveis às roles `anon` ou `authenticated`.
A captura ocorre pela Edge Function `interesse-curso`, com validação de origem,
Turnstile com ação `interesse_curso`, limites de tentativas e corpo limitado.
Email e turma deduplicam cadastros. Reenvios não sobrescrevem dados, perfil,
dúvida ou permissões existentes; alterações/exclusões exigem atendimento pela
equipe. A resposta não revela se um email já estava cadastrado.

## Campos para a automação da planilha

| Campo | Conteúdo |
|---|---|
| `id` | Chave permanente para atualizar uma linha sem duplicá-la |
| `numero` | Número crescente; não é posição nem prioridade garantida na fila |
| `turma_id`, `turma` | Identificação da turma; filtrar a turma real do Zulliger |
| `criado_em` | Data/hora do cadastro em UTC; apresentar no horário de Brasília |
| `nome`, `email`, `telefone` | Contatos; telefone inclui código do país |
| `perfil` | `psicologo` ou `estudante` |
| `pergunta` | Dúvida ou tema opcional |
| `aceita_contato` | Autorização para contato específico sobre a capacitação |
| `aceita_grupo` | Opção pelo convite; não comprova entrada no WhatsApp |
| `privacidade_versao` | Versão do aviso exibido no formulário |
| `matricula_confirmada` | Resultado financeiro derivado, nunca editado pela planilha |

`matricula_confirmada` só é verdadeiro quando o mesmo email e a mesma turma
têm inscrição `matricula_confirmada`, sem revisão legada, pagamento `pago` e
reserva `confirmada` vinculada a esse pagamento. A conciliação existente continua
sendo a autoridade; esta entrega não libera pagamentos reais. Outra turma,
inclusive Sandbox, não pode confirmar matrícula desse interessado.

## Integração recomendada

A usuária pretende criar a automação. Usar o conector Supabase/Postgres em um
ambiente servidor confiável e ler a consulta acima, filtrando `turma_id`. Guardar
credenciais no cofre da ferramenta; nunca no navegador ou em células da planilha.

Atualizar ou inserir linhas pela chave `id`. Atualizar também registros já
exportados para refletir matrícula, reembolso e revisão; copiar apenas novos IDs
não atualiza o status financeiro. Para uma lista pequena, reconciliar todos os
registros da turma em páginas de até 100 linhas, a cada 5 a 15 minutos. Para maior
volume, usar paginação e checkpoints sem depender de uma única leitura ilimitada.

Gravar campos livres como texto/RAW, sem interpretar nomes e perguntas iniciados
por `=`, `+`, `-` ou `@` como fórmulas. Não enviar dados reais para uma planilha
pública. Compartilhar somente com a equipe autorizada; ao instrutor, preferir
perfil, pergunta e situação da matrícula, omitindo telefone/email quando não
necessários. A planilha não altera pagamentos, consentimentos ou o banco.

## Configuração e publicação

1. Conferir a turma real, obter backup privado e validar as migrations no banco
   isolado. A migration é aditiva e não altera tabelas financeiras existentes.
2. Aplicar a migration `zulliger_interest_list` ao projeto de cursos.
3. Definir `CURSOS_INTERESSE_TURMA_ID` com a turma real no servidor. Reutilizar
   `CURSOS_ALLOWED_ORIGINS`, `CURSOS_RATE_SECRET` e `CURSOS_TURNSTILE_SECRET`.
   Não retirar as restrições Sandbox de `cadastro-curso`.
4. Publicar apenas `interesse-curso`; ela usa os adaptadores compartilhados, mas
   não altera as versões remotas de cadastro, checkout ou conciliação.
5. Habilitar `NEXT_PUBLIC_CURSOS_INTERESSE_ENABLED=true` e configurar a site key
   pública no build. Manter `ZULLIGER_INFORMATION_ONLY=true` e vendas reais
   desabilitadas. Sem a configuração, a página informativa continua disponível.
6. Validar Chrome e publicar o frontend pelo fluxo CI/Hostinger.
7. Configurar a automação da planilha com acesso restrito e testar com dados
   fictícios. Limpar apenas os fixtures identificados, mantendo registros reais.

Aviso do formulário: `interesse-zulliger-20261005`. Contato para retirada de
autorização e exclusão: `contato@neuropsiedu.com.br`. O formulário não dispara
email, mensagens ou convites automaticamente; o convite fica na tela.

## Verificação

```text
node --test services/cursos/tests/interest.test.mjs tests/cursos-interest.test.mjs
node --test services/cursos/tests/database.test.mjs
npx deno check services/cursos/supabase/functions/interesse-curso/index.ts
npx playwright test --config playwright.interest.config.ts
```

Chrome usa respostas sintéticas nos testes automatizados. Conferir separadamente
a implantação remota, sem cadastrar terceiros ou atribuir pagamentos manualmente.
Rollback: desabilitar a captura no build e preservar a tabela de interessados;
não apagar tabelas ou dados para reverter a página.
