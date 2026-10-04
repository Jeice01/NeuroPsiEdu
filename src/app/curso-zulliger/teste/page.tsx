import { RegistrationForm } from "@/components/zulliger/RegistrationForm";
import { registrationConfig } from "@/lib/cursos/config";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({ title: "Teste de inscrição em Zulliger", description: "Ambiente de homologação, sem inscrição ou cobrança real.", path: "/curso-zulliger/teste/", noIndex: true });

export default function SandboxPage() {
  const config = registrationConfig(true);
  return <>
    <div className="z-registration-heading"><h1>Teste de cadastro e pagamento</h1>
      <p>Use nome e telefone fictícios e somente o e-mail de teste autorizado pela equipe. Não use cartão, CPF ou dados reais de pagamento.</p>
      <p>O valor de R$ 600,00 é simulado. Este teste não reserva vagas, não confirma matrícula no curso real e não gera certificado.</p>
    </div>
    {config ? <RegistrationForm config={config} /> : <section className="z-form-card"><h2>Testes indisponíveis</h2><p>A equipe ainda não habilitou esta etapa.</p></section>}
  </>;
}
