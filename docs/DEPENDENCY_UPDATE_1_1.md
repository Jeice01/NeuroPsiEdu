# Fase 1.1 — Atualização de dependências

**Data:** 30/07/2026

**Branch:** `chore/runtime-and-dependencies`

**Runtime de validação:** Node.js `24.18.1` e npm `11.16.0`

## Alterações

- Next.js atualizado de `15.5.18` para `15.5.22`.
- `eslint-config-next` atualizado de `15.5.18` para `15.5.22`.
- React e React DOM mantidos em `19.1.0`.
- `npm audit fix` executado sem `--force`.
- Overrides adicionados para dependências transitivas ainda vulneráveis:
  - `brace-expansion` `5.0.9`;
  - `postcss` `8.5.25`;
  - `sharp` `0.35.3`.

O `npm audit fix` não conseguiu resolver sozinho os últimos avisos e sugeriu
alterações incompatíveis, incluindo downgrade para Next.js 9.3.3. Essa sugestão
não foi aplicada. Os overrides substituem somente as versões vulneráveis e
foram validados pelo lint, build e testes funcionais.

## Auditoria

| Indicador | Antes | Depois |
|---|---:|---:|
| Vulnerabilidades críticas | 0 | 0 |
| Vulnerabilidades altas | 5 | 0 |
| Vulnerabilidades moderadas | 0 | 0 |
| Total | 5 | 0 |

Não restaram vulnerabilidades aceitas ou pendentes nesta fase.

Árvore validada:

- `next@15.5.22`
- `eslint-config-next@15.5.22`
- `react@19.1.0`
- `react-dom@19.1.0`
- `brace-expansion@5.0.9`
- `postcss@8.5.25`
- `sharp@0.35.3`

## Validação técnica

| Verificação | Resultado |
|---|---|
| `npm ci` | aprovado |
| `npm audit` | aprovado, 0 vulnerabilidades |
| `npm run lint` | aprovado, 0 erros e 10 avisos conhecidos |
| `npm run build` | aprovado |
| Páginas estáticas | 16 de 16 geradas |
| JavaScript inicial da home | 246 kB |
| JavaScript inicial da FNP | 189 kB |
| JavaScript inicial da FAMAF | 183 kB |

O npm informou que o script de pós-instalação opcional de
`unrs-resolver@1.11.1` não está previamente aprovado pela política
`allow-scripts`. A instalação, o lint e o build foram concluídos sem depender
desse script.

Os dez avisos de lint já existiam na linha de base e não foram ampliados pela
atualização. O aviso de `metadataBase` e a observação de filesystem lento
também permanecem.

## Testes funcionais

Testes realizados no export estático local:

- Home carregada com navegação desktop.
- Blog carregado com seis artigos listados.
- Artigo individual aberto e conteúdo principal renderizado.
- Landing page FNP carregada.
- Landing page FAMAF carregada.
- Menu mobile aberto em viewport de 390 × 844.
- Modal FNP aberto com formulário completo.
- Modal FAMAF aberto com formulário completo.
- Links para WhatsApp e Telegram encontrados com destinos válidos.

Nenhum formulário foi enviado e nenhum dado foi transmitido ao Supabase ou a
outro serviço externo durante os testes.
