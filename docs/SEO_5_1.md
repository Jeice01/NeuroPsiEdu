# Fase 5.1 — SEO técnico

## URL canônica da formação FAMAF

A URL oficial é:

`https://neuropsiedu.com.br/formacao-manuseio-arma/`

As rotas históricas `/famaf/` e `/formacao-manuseio/` recebem redirecionamento
HTTP `301` pelo Apache/Hostinger. A regra não substitui a query string; por isso,
parâmetros `utm_*`, `gclid` e outros identificadores da URL original são mantidos.

Como defesa adicional, os HTMLs legados possuem `noindex, follow` e canonical para
a URL oficial caso sejam servidos em um ambiente que ignore `.htaccess`.

## Metadados

- `metadataBase` aponta para `https://neuropsiedu.com.br`;
- home, blog, formações e artigos possuem canonical individual;
- Open Graph e Twitter Cards utilizam URLs absolutas;
- cada artigo usa título, resumo, autor e imagem próprios;
- as URLs duplicadas não aparecem no sitemap.

## Descoberta e indexação

- `/sitemap.xml` contém as páginas canônicas e todos os artigos;
- `/robots.txt` permite rastreamento e referencia o sitemap;
- o JSON-LD global descreve a clínica e o website em um grafo Schema.org.

## Verificação

Após gerar o artefato, execute:

```powershell
npm run build
npm run test:seo
```

O verificador inspeciona os arquivos efetivamente publicados em `out`, incluindo
canonical, Open Graph, Twitter Cards, aliases, sitemap, robots, JSON-LD e
`.htaccess`. A CI executa essa verificação depois do build.
