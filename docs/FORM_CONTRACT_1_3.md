# Fase 1.3 — Contrato funcional dos formulários

**Data:** 31/07/2026

**Branch:** `security/lead-form-protection`

## Contrato aceito

| Código | Formação armazenada | Página canônica | Mensagem de sucesso |
|---|---|---|---|
| FANP | `8ª Turma FANP` | `https://neuropsiedu.com.br/fnp` | específica da 8ª Turma FANP |
| FAMAF | `Formação em Avaliação Psicológica para Manuseio de Arma de Fogo` | `https://neuropsiedu.com.br/famaf` | específica da formação para manuseio de arma |

A Edge Function exige uma combinação permitida de `formacao_interesse` e
`pagina_origem`. As rotas com e sem barra final são aceitas. A rota legada
`/formacao-manuseio-arma` permanece aceita durante a transição, mas o valor
armazenado é sempre a página canônica `/famaf`.

O cliente não escolhe a mensagem final, a página canônica nem
`status_lead`. O status administrativo continua sendo definido no servidor
como `novo`.

## Respostas

- Sucesso: `{ "success": true, "message": "..." }`.
- Erro: `{ "error": "..." }` com status HTTP apropriado.
- O frontend exige `success: true` antes de exibir confirmação.
- Erros da API são apresentados em uma região com `role="alert"` e
  `aria-live="assertive"`.
- Não há uso de `alert()` nativo.

## Analytics

Os dois formulários enviam um único evento `lead_formacao` após sucesso
confirmado. O evento inclui:

- formação;
- página canônica do frontend;
- perfil;
- interesse principal;
- botão de origem.

O evento duplicado e específico do formulário FAMAF foi removido.

## Validações locais

| Validação | Resultado |
|---|---|
| `deno check` | aprovado |
| ESLint | 0 erros; 10 avisos preexistentes |
| Build Next.js | aprovado; 16 páginas |
| Mensagem FANP | definida no servidor |
| Mensagem FAMAF | definida no servidor |
| Formação e origem fora da lista | rejeitadas pelo contrato |
| `status_lead` | definido somente no servidor |
| `dataLayer` | um evento por formulário |

## Publicação

O deploy deve manter a ordem usada na Fase 1.2:

1. gerar o frontend com a site key pública do Turnstile;
2. publicar e validar o frontend;
3. publicar a Edge Function;
4. testar uma combinação válida de cada formulário e uma combinação inválida.
