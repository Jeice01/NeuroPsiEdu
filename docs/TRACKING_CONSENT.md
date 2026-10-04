# Consentimento para rastreamento

O contêiner compartilhado GTM-54TNTKLF inclui tags de estatísticas e marketing.
O site só o carrega quando o Cookiebot informa consentimento nas duas categorias.
Sem configuração válida ou com consentimento parcial, nenhum script desse
contêiner é carregado. O iframe de rastreamento sem JavaScript foi removido.

Após revogação, a página recarrega para interromper tags que já estavam executando.
A remoção de cookies classificados continua sob responsabilidade do Cookiebot.

No painel Cookiebot, autorizar `neuropsiedu.com.br` e `www.neuropsiedu.com.br` no
grupo `bb101498-b476-4898-bc7d-7917299af0af`. A configuração do domínio é externa
ao repositório; a proteção no código não substitui o funcionamento do banner.

API utilizada: https://www.cookiebot.com/en/developer/

Validação: testes unitários de ausência, recusa, consentimento parcial e anterior;
teste do artefato em Google Chrome com aceite e revogação. O teste simula o
provedor para verificar a aplicação, sem depender de alterações no painel.
