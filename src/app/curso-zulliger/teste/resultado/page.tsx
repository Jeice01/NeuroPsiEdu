import { PaymentResult } from "@/components/zulliger/PaymentResult";
import { registrationConfig } from "@/lib/cursos/config";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({ title: "Resultado do teste Zulliger", description: "Acompanhe somente uma inscrição de teste.", path: "/curso-zulliger/teste/resultado/", noIndex: true });

export default function SandboxResultPage() {
  return <><div className="z-registration-heading"><h1>Resultado do teste Sandbox</h1>
    <p>Nenhuma cobrança ou matrícula real é realizada neste ambiente.</p></div>
    <PaymentResult config={registrationConfig(true)} />
  </>;
}
