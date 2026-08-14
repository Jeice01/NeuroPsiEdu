# Política operacional de leads e retenção

## Escopo e finalidade

Os formulários FANP e FAMAF coletam dados para responder ao pedido de informações
e conduzir matrícula/atendimento. Os dados incluem nome, WhatsApp, e-mail, perfil,
localidade, interesse, mensagem, UTMs, origem, consentimento e metadados técnicos
minimizados para segurança/rate limiting.

Não utilizar esses registros para finalidade incompatível sem nova avaliação e
base adequada. Não armazenar informações clínicas, documentos ou dados sensíveis
nos campos livres do formulário.

## Acesso

- O navegador não possui leitura dos leads.
- `anon` e `authenticated` não devem ler, alterar ou apagar as tabelas.
- A Edge Function usa acesso administrativo apenas para inserir leads e administrar
  contadores temporários.
- Acesso humano deve ser nominal, mínimo, revisado e revogado ao deixar a função.

## Retenção

O prazo jurídico/comercial definitivo deve ser aprovado pelo responsável de
negócio e privacidade antes de automatizar exclusões. Até essa aprovação:

1. revisar trimestralmente leads sem atividade e necessidade de conservação;
2. excluir ou anonimizar registros que não tenham finalidade ativa nem obrigação
   de conservação documentada;
3. manter eventos de rate limiting somente pelo prazo técnico definido no banco;
4. registrar a decisão e a quantidade afetada, sem exportar os dados pessoais;
5. nunca manter backups indefinidamente por conveniência.

Esta política operacional não substitui aconselhamento jurídico. O prazo não deve
ser inventado pelo desenvolvimento: deve considerar finalidade, consentimento,
contratos, defesa de direitos e obrigações aplicáveis.

## Solicitações do titular

Pedidos recebidos em `contato@neuropsiedu.com.br` devem ser autenticados de forma
proporcional antes de localizar, corrigir, exportar ou excluir dados. Registre
somente protocolo, decisão, responsável e data; evite copiar o conteúdo completo
do lead para ferramentas externas.

## Exclusão e backups

- Execute exclusões com filtro explícito e prévia conferência de contagem.
- Prefira operação transacional e auditável.
- Backups não devem ser alterados seletivamente; limite acesso e retenção, e deixe
  o dado expirar conforme a política de backup.
- Se um backup for restaurado, reaplique exclusões pendentes antes de reabrir o
  serviço quando tecnicamente possível.

## Revisão

Revisar esta política ao alterar campos, finalidade, fornecedores, integrações,
base legal ou fluxo comercial, e no mínimo uma vez por ano.
