import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RegistrationPreview } from "@/components/zulliger/RegistrationPreview";
import { RegistrationForm } from "@/components/zulliger/RegistrationForm";
import { registrationConfig } from "@/lib/cursos/config";
import { zulligerCourse as course, zulligerSupportLink } from "@/data/zulliger";
import { createPageMetadata } from "@/lib/seo";
import "../zulliger.css";
import "./inscricao.css";

export const metadata = createPageMetadata({
  title: "Inscrição na capacitação em Zulliger",
  description: "Confira o resumo da capacitação em Zulliger e conheça o formulário demonstrativo de inscrição da NeuroPsiEdu.",
  path: "/curso-zulliger/inscricao/",
  noIndex: true,
});

export default function ZulligerRegistrationPage() {
  const informationOnly = process.env.ZULLIGER_INFORMATION_ONLY === "true";
  const config = informationOnly ? null : registrationConfig();
  return (
    <div className="z-page z-registration-page">
      <a className="z-skip" href="#conteudo">Pular para o conteúdo</a>
      <div className="z-preview-bar">{informationOnly ? "INSCRIÇÕES EM BREVE" : config ? "CADASTRO ONLINE" : "PRÉVIA PARA REVISÃO"} <span>{config?.checkoutEndpoint ? "· Pagamento em ambiente de testes" : "· Checkout online ainda não disponível"}</span></div>
      <header className="z-header">
        <div className="z-container z-nav">
          <Link href="/" aria-label="NeuroPsiEdu — início"><img src="/images/logo-vertical-300.webp" width="150" height="73" alt="NeuroPsiEdu" className="z-logo" /></Link>
          <Link href="/curso-zulliger/" className="z-text-link z-registration-back"><ArrowLeft size={18} aria-hidden="true" /> Voltar aos detalhes do curso</Link>
        </div>
      </header>
      <main id="conteudo" tabIndex={-1} className="z-container z-registration-main">
        <div className="z-registration-heading">
          <p className="z-eyebrow">CAPACITAÇÃO NEUROPSIEDU</p>
          <h1>Sua inscrição em Zulliger</h1>
          <p>{informationOnly ? "Confira as informações do curso. As inscrições online ainda não estão abertas." : config ? "Confira as informações do curso e preencha seu cadastro." : "Confira as informações do curso e experimente o preenchimento com dados fictícios."}</p>
        </div>
        <div className="z-registration-grid">
          <aside className="z-registration-summary" aria-labelledby="course-summary-title">
            <p className="z-eyebrow">RESUMO DO CURSO</p>
            <h2 id="course-summary-title">{course.subtitle}</h2>
            <p className="z-registration-subtitle">{course.title} · com {course.teacher}</p>
            <dl>
              <div><dt>Quantidade</dt><dd>1 inscrição · 1 participante</dd></div>
              <div><dt>Abertura online</dt><dd>6 de novembro de 2026, às 20h30</dd></div>
              <div><dt>Encontros presenciais</dt><dd>7 e 8 de novembro de 2026, das 8h às 18h</dd></div>
              <div><dt>Local</dt><dd>{course.address}</dd></div>
              <div><dt>Certificado</dt><dd>{course.certificateHours} horas, com frequência mínima de {course.minimumAttendancePercent}%. Emissão em até {course.certificateDeadlineDays} dias após o término do curso.</dd></div>
              <div><dt>Turma</dt><dd>Até {course.capacity} participantes</dd></div>
            </dl>
            <p className="z-small">Horários de Brasília. A distribuição das 24 horas será detalhada no programa final.</p>
            <div className="z-registration-price">
              <span>Investimento</span>
              <strong>{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(course.priceCents / 100)}</strong>
              <p>Em até {course.maximumInstallments}x no cartão, com juros por conta do comprador.</p>
            </div>
            <p className="z-small">Inscrição individual. Para outra pessoa, preencha um novo cadastro com os dados dela.</p>
            <p className="z-small">{config?.checkoutEndpoint ? "O pagamento será aberto no ambiente de testes do PagBank." : "O pagamento pelo PagBank ainda não está disponível."} {informationOnly ? "As reservas serão disponibilizadas após a abertura das inscrições." : config ? "Salvar o cadastro não reserva vagas." : "Esta prévia não reserva vagas."}</p>
            <a href={zulligerSupportLink} target="_blank" rel="noopener noreferrer" className="z-text-link">Tirar dúvidas pelo WhatsApp <span aria-hidden="true">↗</span></a>
          </aside>
          {informationOnly ? <section className="z-form-card" aria-labelledby="registration-title">
            <p className="z-eyebrow">CAPACITAÇÃO NEUROPSIEDU</p>
            <h2 id="registration-title">Inscrições em breve</h2>
            <p>Estamos preparando a abertura das inscrições online. Neste momento, não há cadastro, reserva de vaga ou cobrança por esta página.</p>
            <p>Para tirar dúvidas sobre a capacitação, fale com a nossa equipe.</p>
            <a href={zulligerSupportLink} target="_blank" rel="noopener noreferrer" className="z-button">Falar com a NeuroPsiEdu <span aria-hidden="true">↗</span></a>
          </section> : config ? <RegistrationForm config={config} /> : <RegistrationPreview />}
        </div>
      </main>
      <footer className="z-footer"><div className="z-container"><p>NeuroPsiEdu</p><a href="mailto:contato@neuropsiedu.com.br">contato@neuropsiedu.com.br</a><small>© 2026 NeuroPsiEdu · CNPJ 34.800.411/0001-83</small></div></footer>
    </div>
  );
}
