# Responsabilidades e acessos

## Matriz operacional

| Papel | Responsabilidade | Conta/canal atual |
|---|---|---|
| Proprietária do repositório e aprovadora | PRs, ambientes protegidos e releases | GitHub `Jeice01` |
| Responsável de negócio/privacidade | finalidade dos leads, retenção e solicitações | `contato@neuropsiedu.com.br` |
| Operação técnica | CI, Hostinger, Supabase, DNS, backup e incidentes | execução assistida; registrar pessoa responsável por ocorrência |
| Atendimento comercial | uso dos leads conforme finalidade autorizada | acesso nominal definido pelo negócio |

Não existe atualmente outro colaborador permanente no repositório. A proprietária
deve cadastrar um substituto operacional com acesso mínimo e recuperação de conta
antes de férias, desligamento ou indisponibilidade prolongada.

## Provedores sob responsabilidade

- GitHub: repositório, Actions, environments e secrets.
- Hostinger: domínio, DNS, SSL, Git deployment, webhook e backups.
- Supabase: projetos staging/produção, banco, Edge Functions e secrets.
- Cloudflare Turnstile: widget, site key pública e secret privado.
- Google/Cookiebot/GTM: consentimento, métricas e configurações públicas.

## Revisão de acesso

Trimestralmente e após qualquer mudança de pessoa:

1. revisar membros e sessões dos provedores;
2. remover acessos sem finalidade;
3. confirmar MFA e métodos de recuperação;
4. revisar expiração de tokens do GitHub/Supabase;
5. testar acesso ao backup e ao processo de rollback sem restaurar produção;
6. registrar data, responsável e pendências em local restrito.

Secrets nunca devem ser copiados para este documento. Registre apenas o nome do
secret, ambiente, proprietário e data de rotação no gerenciador apropriado.
