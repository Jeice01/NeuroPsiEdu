# Rastreamento do site

Em 04/10/2026, por solicitação do responsável, o Cookiebot foi retirado do site.
Também foram retirados o carregamento do Google Tag Manager e seu iframe sem
JavaScript. As tags de analytics e marketing desse contêiner ficam desativadas.

Essa mudança não remove cookies já existentes nos navegadores dos visitantes.
Não afeta os mecanismos essenciais de cadastro, recuperação de acesso,
proteção Turnstile ou pagamento Sandbox.

Antes de reintroduzir analytics ou marketing, definir uma solução de
consentimento válida e revisar as tags do contêiner. Não inserir o GTM
incondicionalmente no layout.

O teste do artefato em Google Chrome verifica navegação nas páginas inicial,
curso, inscrição e resultado, ausência de requisições de rastreamento,
erros de execução e falhas de rede.
