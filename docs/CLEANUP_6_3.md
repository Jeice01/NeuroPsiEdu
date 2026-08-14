# Fase 6.3 — Limpeza

Data da avaliação: 13/08/2026.

## Resultado

- O ESLint passou sem erros e sem avisos após a remoção de imports, variáveis e
  configurações de animação sem uso.
- A dependência do efeito em `InfoBar` foi corrigida sem criar uma coleção nova
  como dependência a cada renderização.
- O pacote foi renomeado de `temp-app` para `neuropsiedu` no manifesto e no
  lockfile.
- Os cinco SVGs padrão do scaffold do Next.js foram removidos porque não há
  referência a eles no aplicativo.

## Arquivos legados

As buscas no código ativo não encontraram imports ou referências de execução a
`src/components/forms/LeadForm.tsx`, `old_html/` ou ao `index.html` da raiz.
Esses itens podem ser removidos tecnicamente, mas o diretório de trabalho
principal possui alterações locais nesses arquivos. Para preservar esse
trabalho, a remoção deve ocorrer em um PR separado depois que essas alterações
forem reconciliadas ou arquivadas.

## Diretório `out`

O diretório `out` não deve permanecer versionado na branch `main`:

- o CI executa o build e publica `out` como artefato temporário;
- o deploy automático baixa esse artefato aprovado;
- o deploy manual também executa um build novo;
- a branch `deploy` já mantém a cópia exata publicada na Hostinger.

A retirada de `out` do índice do Git deve ser feita em um PR próprio, adicionando
`/out/` ao `.gitignore`. Essa separação evita misturar a limpeza de código com
uma alteração massiva de artefatos e protege as mudanças locais existentes.
