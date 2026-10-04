import Link from "next/link";
import { zulligerSupportLink } from "@/data/zulliger";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({ title: "Condições e privacidade do teste Zulliger", description: "Regras do ambiente Sandbox, destinado à homologação técnica.", path: "/curso-zulliger/teste/condicoes/", noIndex: true });

export default function SandboxConditionsPage() {
  return <article className="z-form-card">
    <h1>Condições e privacidade do teste</h1><p>Versão: sandbox-20261003. Organização: NeuroPsiEdu, CNPJ 34.800.411/0001-83.</p>
    <h2 id="termos">Condições do Sandbox</h2>
    <p>Esta página é destinada à homologação técnica pela equipe. O cadastro, a reserva na turma de teste e a confirmação de pagamento são simulações. Não há contratação, cobrança, vaga no curso real ou emissão de certificado.</p>
    <p>Informe nome e telefone fictícios. Use somente um e-mail de teste sob seu controle e autorizado pela equipe, para receber o código de acesso. No PagBank Sandbox, utilize exclusivamente os dados fictícios fornecidos para homologação; nunca dados de cartão ou documentos pessoais reais.</p>
    <p>O aceite registra que você conhece essas condições de teste. Não substitui os termos de contratação do curso real. Não são solicitadas autorizações de imagem, voz ou marketing nesta etapa.</p>
    <h2 id="privacidade">Privacidade durante a homologação</h2>
    <p>O sistema armazena os campos informados, o aceite e sua versão, os horários, a situação da inscrição de teste, as tentativas de pagamento Sandbox e o histórico técnico. O e-mail de teste é utilizado para validar a recuperação de acesso; não é utilizado para marketing.</p>
    <p>Supabase hospeda o banco e a autenticação em us-east-1, nos Estados Unidos. Cloudflare Turnstile verifica a navegação e pode processar o endereço IP e sinais do navegador para prevenção de abuso. O PagBank processa o pagamento simulado em seu Sandbox. Os códigos são enviados pelo SMTP Gmail da conta de teste. Esses fornecedores podem processar dados fora do Brasil.</p>
    <p>Não carregamos Cookiebot, Google Tag Manager ou as tags de analytics e marketing desse contêiner. Os registros de teste permanecem durante a homologação e sua revisão técnica, e sua exclusão deve ser feita pela equipe ao encerrar essa finalidade. O histórico financeiro simulado não constitui comprovante de pagamento real.</p>
    <p>Para solicitar acesso, correção ou exclusão dos dados de teste, <a href={zulligerSupportLink} target="_blank" rel="noopener noreferrer">fale com a NeuroPsiEdu pelo WhatsApp</a>. Não envie senhas, códigos de acesso ou dados de cartão.</p>
    <p><Link href="/curso-zulliger/teste/">Voltar ao teste</Link></p>
  </article>;
}
