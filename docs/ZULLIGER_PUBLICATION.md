# Publicação informativa do Zulliger

O build de produção dos workflows CI e Hostinger usa
`ZULLIGER_INFORMATION_ONLY=true`. As páginas públicas mostram "Inscrições em
breve", informações do curso e contato. A página de inscrição não renderiza
formulário demonstrativo, campos pessoais ou checkout. Cadastro e checkout de
teste permanecem desligados no build. A página do curso permite indexação;
inscrição e resultado permanecem com `noindex`.

O backend local de cursos não é publicado por esses workflows. O projeto de
Supabase dos cursos preserva o banco existente; habilitar cadastro e pagamentos
exige uma entrega posterior e configuração específica. As funções dos leads
institucionais continuam no fluxo anterior.

Para conferir o artefato de publicação, gerar `out/` com as mesmas variáveis
usadas pelo workflow e executar:

```text
npx playwright test --config playwright.release.config.ts
```

O teste usa Google Chrome e um servidor estático local na porta 3010. Verifica
aviso de abertura futura, navegação, ausência de coleta/pagamento, erros de
console, requisições locais malsucedidas, foco e larguras 1280/390/320.
Os testes de prévia e cadastro conectado continuam separados do artefato público.

As correções de segurança necessárias à publicação atualizaram Next.js e
eslint-config-next para 15.5.27, brace-expansion para 5.0.12 e sharp para 0.35.5;
o lockfile também recebeu a atualização corretiva de js-yaml via npm audit fix.

Após publicar, comparar o SHA em `deploy.json` com o commit promovido e verificar
as rotas `/curso-zulliger/`, `/curso-zulliger/inscricao/` e
`/curso-zulliger/resultado/`, além das rotas institucionais já monitoradas.
O rollback usa o workflow manual Hostinger com um SHA anterior; não altera o banco.
