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
da execução. A medição final deve usar a mesma versão e configuração depois do
deploy desta fase.

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
