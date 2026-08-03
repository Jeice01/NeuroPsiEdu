# Inventário DNS — NeuroPsiEdu

Data da coleta: 30/07/2026

Domínio principal: `neuropsiedu.com.br`

Origem da validação: consultas DNS públicas aos registros autoritativos. TTLs
devem ser consultados novamente imediatamente antes de qualquer mudança.

## Registros relevantes

| Nome | Tipo | Valor | TTL observado |
|---|---|---|---:|
| `neuropsiedu.com.br` | A | `77.37.42.149` | 60 |
| `neuropsiedu.com.br` | A | `147.79.105.64` | 60 |
| `neuropsiedu.com.br` | AAAA | `2a02:4780:2e:8479:6045:c98e:e710:79b` | 60 |
| `neuropsiedu.com.br` | AAAA | `2a02:4780:2f:d693:8f41:ff04:64ec:d668` | 60 |
| `neuropsiedu.com.br` | MX | prioridade 1, `SMTP.GOOGLE.COM` | 14.400 |
| `neuropsiedu.com.br` | NS | `ns1.dns-parking.com` | 86.400 |
| `neuropsiedu.com.br` | NS | `ns2.dns-parking.com` | 86.400 |
| `neuropsiedu.com.br` | TXT | verificação pública do Google | 14.400 |
| `www.neuropsiedu.com.br` | CNAME | `www.neuropsiedu.com.br.cdn.hstgr.net` | 300 |
| `academia.neuropsiedu.com.br` | A | `185.158.133.1` | 300 |

O conteúdo completo do TXT de verificação permanece no relatório operacional
local. Como ele é público, não é uma credencial, mas não precisa ser repetido
em todos os documentos.

## Dependências identificadas

- O apex e `www` dependem da infraestrutura/CDN da Hostinger.
- O recebimento de e-mail depende do MX do Google.
- A área do aluno usa infraestrutura distinta em
  `academia.neuropsiedu.com.br`.
- A autoridade DNS está delegada aos nameservers `dns-parking.com`.

## Recuperação

Antes de alterar DNS:

1. consultar novamente os registros e TTLs;
2. exportar ou capturar o estado atual no hPanel;
3. reduzir TTL com antecedência quando a mudança exigir troca rápida;
4. alterar um conjunto de registros por vez;
5. validar resolução nos servidores autoritativos e em resolvedores públicos;
6. manter os valores anteriores até o fim da janela de observação.

Uma restauração de arquivos da Hostinger não exige alteração DNS enquanto o
domínio, o plano e o diretório publicado permanecerem os mesmos.
