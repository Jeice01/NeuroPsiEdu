import Link from "next/link";
import { PaymentResult } from "@/components/zulliger/PaymentResult";
import { registrationConfig } from "@/lib/cursos/config";
import { createPageMetadata } from "@/lib/seo";
import { ArrowLeft } from "lucide-react";
import { zulligerCourse as course } from "@/data/zulliger";
import "../zulliger.css";
import "../inscricao/inscricao.css";
export const metadata = createPageMetadata({ title: "Acompanhe sua inscrição em Zulliger", description: "Consulte a situação da sua inscrição.", path: "/curso-zulliger/resultado/", noIndex: true });
export default function ResultPage() {
  return <div className="z-page z-registration-page">
    <a className="z-skip" href="#conteudo">Pular para o conteúdo</a>
    <header className="z-header"><div className="z-container z-nav">
      <Link href="/" aria-label="NeuroPsiEdu — início"><img src="/images/logo-vertical-300.webp" width="150" height="73" alt="NeuroPsiEdu" className="z-logo" /></Link>
      <Link href="/curso-zulliger/" className="z-text-link z-registration-back"><ArrowLeft size={18} aria-hidden="true" /> Voltar ao curso</Link>
    </div></header>
    <main id="conteudo" tabIndex={-1} className="z-container z-registration-main z-result-main">
      <div className="z-registration-heading"><p className="z-eyebrow">CAPACITAÇÃO NEUROPSIEDU</p><h1>Acompanhe sua inscrição</h1><p>{course.subtitle} — {course.title}</p></div>
      <PaymentResult config={process.env.ZULLIGER_INFORMATION_ONLY === "true" ? null : registrationConfig()} />
    </main>
    <footer className="z-footer"><div className="z-container"><p>NeuroPsiEdu</p><a href="mailto:contato@neuropsiedu.com.br">contato@neuropsiedu.com.br</a><small>© 2026 NeuroPsiEdu · CNPJ 34.800.411/0001-83</small></div></footer>
  </div>;
}
