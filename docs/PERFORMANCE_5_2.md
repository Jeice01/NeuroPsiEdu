# Fase 5.2 — Performance

## Linha de base

Medição móvel Lighthouse 13.0.1 em produção antes das alterações:

| Indicador | Antes |
|---|---:|
| Performance | 41 |
| FCP | 3,4 s |
| LCP | 9,4 s |
| TBT | 1.230 ms |
| CLS | 0 |
| Speed Index | 5,3 s |
| Transferência total | 754 KiB |

O relatório bruto foi mantido fora do repositório porque contém detalhes voláteis
da execução.

## Resultado em produção

Medição móvel realizada depois do merge da PR #14 e do deploy do commit
`75d51513ca6cc8a0fc826129a8a538e221479d04`, usando a mesma versão e
configuração do Lighthouse:

| Indicador | Antes | Depois | Variação |
|---|---:|---:|---:|
| Performance | 41 | 57 | +16 pontos |
| FCP | 3,4 s | 3,0 s | -0,4 s |
| LCP | 9,4 s | 3,9 s | -5,5 s |
| TBT | 1.230 ms | 1.110 ms | -120 ms |
| CLS | 0 | 0 | mantido |
| Speed Index | 5,3 s | 4,7 s | -0,6 s |
| Transferência total | 754 KiB | 703 KiB | -51 KiB |

Os scores de Acessibilidade (87), Boas Práticas (73) e SEO (100) foram
mantidos. A meta desta fase, melhorar as métricas em relação à linha de base,
foi atingida.

## Alterações

- imagens raster pesadas substituídas por WebP responsivo em três larguras;
- `srcset`, `sizes`, dimensões intrínsecas e prioridade de carregamento definidos;
- imagens abaixo da dobra usam lazy loading e renderização diferida;
- fontes Inter e Outfit latinas auto-hospedadas em WOFF2;
- Google Tag Manager adiado até o evento de carregamento;
- Framer Motion removido da navegação e do botão global de WhatsApp;
- orçamento de tamanho automatizado na CI.

## Tamanhos

| Indicador | Antes | Depois local |
|---|---:|---:|
| Diretório `public` | 14,2 MB | 1,09 MB |
| Favicon público | 2,27 MB | 14,5 KB |
| JavaScript compartilhado | 178 kB | 136 kB |
| Primeira carga do blog | 169 kB | 125 kB |
| Primeira carga da home | 188 kB | 188 kB |

## Verificação

```powershell
npm run build
npm run test:performance
```

O teste falha se `public` ultrapassar 5 MB, se o favicon ultrapassar 100 KB, se
fontes Google externas ou imagens legadas voltarem ao código, ou se uma imagem
não declarar largura e altura.
