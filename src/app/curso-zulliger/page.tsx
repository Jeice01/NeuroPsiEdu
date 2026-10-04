import Link from "next/link";
import { ArrowRight, Award, BookOpen, CalendarDays, MessageCircle, MapPin, Monitor, ShieldCheck, Users } from "lucide-react";
import { RegistrationLink } from "@/components/zulliger/RegistrationLink";
import { zulligerCourse as course, zulligerFaq, zulligerLearning, zulligerSchedule, zulligerSupportLink } from "@/data/zulliger";
import { createPageMetadata } from "@/lib/seo";
import "./zulliger.css";

export const metadata = createPageMetadata({
  title: "Capacitação em Zulliger — Z-Teste Coletivo e Individual",
  description: "Capacitação com Willian Santana, abertura online em 6 de novembro e encontros presenciais em 7 e 8 de novembro de 2026, em Águas Claras. Certificado de 24 horas.",
  path: "/curso-zulliger/",
  noIndex: process.env.ZULLIGER_INFORMATION_ONLY !== "true",
});

export default function ZulligerPage() {
  return (
    <div className="z-page" id="topo">
      <a className="z-skip" href="#conteudo">Pular para o conteúdo</a>
      <div className="z-preview-bar">{process.env.ZULLIGER_INFORMATION_ONLY === "true" ? "INSCRIÇÕES EM BREVE" : "PRÉVIA PARA REVISÃO"} <span>· Checkout online ainda não disponível</span></div>
      <header className="z-header">
        <div className="z-container z-nav">
          <Link href="/" aria-label="NeuroPsiEdu — início"><img src="/images/logo-vertical-300.webp" width="150" height="73" alt="NeuroPsiEdu" className="z-logo" /></Link>
          <nav aria-label="Navegação do curso"><a href="#sobre">O Zulliger</a><a href="#aprendizado">O curso</a><a href="#agenda">Agenda</a><a href="#duvidas">Dúvidas</a></nav>
          <RegistrationLink className="z-nav-cta" />
        </div>
      </header>

      <main id="conteudo" tabIndex={-1}>
        <section className="z-hero">
          <div className="z-container z-hero-grid">
            <div>
              <p className="z-capacity-badge"><Users size={22} aria-hidden="true" /><span><strong>Turma VIP — apenas {course.capacity} participantes</strong><span>Prática supervisionada pelo professor</span></span></p>
              <p className="z-course-label"><span className="z-dot" /> Capacitação presencial com abertura online</p>
              <h1>Ganhe segurança<br />na aplicação<br />do Zulliger.</h1>
              <p className="z-hero-subtitle">Z-Teste Coletivo e Individual</p>
              <p className="z-hero-description">Aprenda a aplicar, corrigir e interpretar o Z-Teste com prática supervisionada, organizando os resultados para fundamentar suas conclusões na avaliação psicológica.</p>
              <div className="z-hero-meta"><span><CalendarDays size={18} aria-hidden="true" /> 6, 7 e 8 de novembro de 2026</span><span><MapPin size={18} aria-hidden="true" /> Águas Claras, Brasília</span></div>
              <div className="z-hero-actions"><RegistrationLink className="z-button" /></div>
              <p className="z-hero-footnote">Para psicólogos e estudantes de Psicologia</p>
            </div>
            <figure className="z-hero-visual">
              <div className="z-book-stage"><div className="z-book-caption"><BookOpen size={18} aria-hidden="true" /><span>Da fundamentação à prática</span></div><img className="z-main-book" src="/images/zulliger/z-teste-coletivo-individual.jpg" alt="Capa de Z-Teste Coletivo e Individual — Técnica de Zulliger, de Cícero E. Vaz e João C. Alchieri" width="800" height="1044" fetchPriority="high" /><div className="z-book-seal"><Award size={24} aria-hidden="true" /><span><strong>24 horas</strong>de capacitação</span></div></div>
              <figcaption>Publicação de referência da técnica. Imagem ilustrativa; não representa material incluído na inscrição.</figcaption>
            </figure>
          </div>
        </section>

        <div className="z-facts"><div className="z-container z-facts-grid">
          <div><Award aria-hidden="true" /><p><strong>{course.certificateHours} horas</strong><span>no certificado</span></p></div>
          <div><Users aria-hidden="true" /><p><strong>Turma de até {course.capacity}</strong><span>participantes</span></p></div>
          <div><CalendarDays aria-hidden="true" /><p><strong>Online + presencial</strong><span>uma formação integrada</span></p></div>
          <div><ShieldCheck aria-hidden="true" /><p><strong>{course.minimumAttendancePercent}% de frequência</strong><span>mínimo para certificação</span></p></div>
        </div></div>

        <section id="sobre" className="z-section z-container z-about">
          <div><p className="z-eyebrow">Entenda o instrumento</p><h2>Três manchas.<br />Um universo de respostas.</h2><p className="z-about-intro">O Teste de Zulliger utiliza respostas a três manchas de tinta para investigar aspectos da personalidade, do funcionamento emocional e dos processos psicológicos.</p><p>A interpretação exige fundamentação técnica e integração com outras informações da avaliação. É esse percurso, da aplicação ao raciocínio clínico, que orienta a capacitação.</p><a href="#aprendizado" className="z-text-link">Conheça o percurso de aprendizagem <ArrowRight size={16} aria-hidden="true" /></a></div>
          <div className="z-perspectives"><div><span>Personalidade</span><p>Compreender características e modos de funcionamento da pessoa.</p></div><div><span>Funcionamento emocional</span><p>Investigar aspectos afetivos e a maneira de lidar com as experiências.</p></div><div><span>Processos psicológicos</span><p>Explorar a organização do pensamento e a construção de respostas.</p></div></div>
        </section>

        <section id="diferenciais" className="z-section z-container z-differences">
          <div className="z-section-heading"><div><p className="z-eyebrow">Praticidade com fundamentação</p><h2>Por que escolher<br />o Z-Teste?</h2></div><p>Conheça os recursos que podem tornar o instrumento uma escolha útil para sua rotina de avaliação da personalidade.</p></div>
          <div className="z-benefits-grid">
            <article><BookOpen aria-hidden="true" /><h3>Uma aplicação mais compacta</h3><p>O Zulliger utiliza três pranchas; o Rorschach, dez. Essa estrutura reduz o conjunto de estímulos a administrar. A duração depende do procedimento e das respostas da pessoa.</p></article>
            <article><Users aria-hidden="true" /><h3>Individual ou coletivo</h3><p>O Z-Teste oferece as duas modalidades, com procedimentos próprios. A aplicação coletiva permite avaliar um grupo na mesma sessão, quando adequada à demanda.</p></article>
            <article><Monitor aria-hidden="true" /><h3>Mais agilidade na apuração</h3><p>A correção informatizada disponibilizada pela editora ajuda a organizar os resultados. No curso, você trabalhará correção manual e informatizada, além da interpretação e integração dos dados.</p></article>
            <article><ShieldCheck aria-hidden="true" /><h3>Estudos de validade e precisão</h3><p>O Zulliger conta com pesquisas sobre suas propriedades psicométricas. As evidências são específicas para sistemas, populações e indicadores; a escolha considera a demanda e as normas aplicáveis.</p></article>
          </div>
          <div className="z-choice-note"><h3>Z-Teste ou Rorschach: qual escolher?</h3><p>Considere o objetivo da avaliação, o público, a modalidade de aplicação e sua formação no sistema utilizado. O Z-Teste combina um conjunto menor de pranchas com a possibilidade de aplicação coletiva. Ele amplia seu repertório; não substitui automaticamente o Rorschach ou outros instrumentos.</p></div>
        </section>

        <section id="aprendizado" className="z-section z-container">
          <div className="z-section-heading"><div><p className="z-eyebrow">Seu percurso no curso</p><h2>Aprender a técnica.<br />Construir uma interpretação.</h2></div><p>Uma sequência que conecta fundamentos, procedimentos e integração dos resultados, com conteúdo teórico e atividades práticas.</p></div>
          <div className="z-learning-grid">{zulligerLearning.map((item) => <article className="z-learning-card" key={item.number}><span className="z-number">{item.number}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
          <div className="z-audience"><Users aria-hidden="true" /><div><h3>Para psicólogos e estudantes de Psicologia</h3><p>A formação amplia o estudo da técnica. O uso profissional de testes psicológicos permanece sujeito aos requisitos legais e às orientações dos órgãos competentes.</p></div></div>
        </section>

        <section className="z-library"><div className="z-container z-library-grid">
          <figure className="z-secondary-book"><img src="/images/zulliger/z-sc-manual.png" alt="Capa do manual Z-SC — Teste de Zulliger no Sistema Compreensivo" width="850" height="1200" loading="lazy" /><figcaption>Z-SC · Sistema Compreensivo</figcaption></figure>
          <div><p className="z-eyebrow">Conhecimento com contexto</p><h2>Uma técnica.<br />Diferentes sistemas de estudo.</h2><p>O Zulliger possui publicações e sistemas de aplicação e interpretação distintos. O manual Z-SC apresenta o Sistema Compreensivo; a capa em destaque no início é do Z-Teste Coletivo e Individual.</p><p>Esta capacitação é anunciada como <strong>Z-Teste Coletivo e Individual — Técnica de Zulliger</strong>. A bibliografia e os materiais necessários serão detalhados no programa final.</p><p className="z-small">As capas ajudam a identificar as publicações. A exibição não significa que os livros estejam incluídos no valor do curso.</p></div>
        </div></section>

        <section className="z-supervision z-section z-container" aria-labelledby="supervision-title">
          <div><p className="z-eyebrow">Turma reduzida, acompanhamento próximo</p><h2 id="supervision-title">Espaço para praticar.<br />Tempo para tirar dúvidas.</h2></div>
          <div><p>Limitamos a turma a {course.capacity} participantes para que o professor acompanhe sua tabulação de perto e ajude a esclarecer dúvidas durante a prática supervisionada.</p><p>Você participa ativamente de cada etapa: da aplicação à organização dos dados e ao raciocínio clínico, construindo mais segurança para sua atuação.</p></div>
        </section>

        <section id="agenda" className="z-agenda"><div className="z-container z-section">
          <p className="z-eyebrow">Organize sua participação</p><h2>Nos encontramos<br />em novembro.</h2>
          <div className="z-agenda-grid"><div>{zulligerSchedule.map((item) => <article className="z-schedule-row" key={item.day}><div className="z-date"><strong>{item.day}</strong><span>{item.month} / 2026</span></div><div><p className="z-eyebrow">{item.format}</p><h3>{item.title}</h3><strong>{item.time}</strong><p>{item.description}</p></div></article>)}<p className="z-small">Horários de Brasília. A distribuição das 24 horas entre encontros e atividades será detalhada no programa final.</p></div>
          <aside className="z-location"><MapPin size={28} aria-hidden="true" /><p className="z-eyebrow">Encontros presenciais</p><h3>NeuroPsiEdu<br />Águas Claras</h3><address>{course.address}</address><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(course.address)}`} target="_blank" rel="noopener noreferrer">Ver localização no mapa <span aria-hidden="true">↗</span></a><div className="z-online-note"><Monitor size={20} aria-hidden="true" /><p>A abertura em 6 de novembro será online, às 20h30.</p></div></aside></div>
        </div></section>

        <section id="professor" className="z-section z-container z-teacher">
          <img className="z-teacher-photo" src="/images/zulliger/willian.webp" alt="Willian Santana, professor da capacitação em Zulliger" width="640" height="1422" loading="lazy" />
          <div><p className="z-eyebrow">Quem conduz a capacitação</p><h2>{course.teacher}</h2><p className="z-teacher-experience">Mais de 10 anos de prática</p><p className="z-teacher-role">Psicólogo e neuropsicólogo · {course.teacherRegistration}</p><p>Especialista em Terapia Cognitivo-Comportamental e Neuropsicologia, com formação em avaliações psicológicas, avaliações neuropsicológicas e psicodiagnóstico.</p><RegistrationLink className="z-button" label="Quero aprender com o Willian" /></div>
        </section>

        <section id="inscricao" className="z-enrollment"><div className="z-container z-section z-enrollment-grid">
          <div className="z-offer">
            <p className="z-eyebrow">Uma formação que conecta teoria e prática</p>
            <h2>Veja tudo o que faz parte<br />da sua capacitação.</h2>
            <ul className="z-inclusions">
              <li><Monitor size={22} aria-hidden="true" /><div><strong>Abertura online</strong><span>Comece o percurso em 6 de novembro, às 20h30.</span></div></li>
              <li><CalendarDays size={22} aria-hidden="true" /><div><strong>Dois dias presenciais</strong><span>Encontros em 7 e 8 de novembro, em Águas Claras.</span></div></li>
              <li><Users size={22} aria-hidden="true" /><div><strong>Prática supervisionada em turma reduzida</strong><span>Aprenda com o professor em uma turma de até {course.capacity} participantes.</span></div></li>
              <li><Award size={22} aria-hidden="true" /><div><strong>Certificado de {course.certificateHours} horas</strong><span>Emissão em até {course.certificateDeadlineDays} dias após o término do curso, mediante frequência mínima de {course.minimumAttendancePercent}%.</span></div></li>
            </ul>
            <p className="z-value-summary">Fundamentação, encontros presenciais e prática supervisionada reunidos em uma única capacitação.</p>
            <p className="z-investment-label">Tudo isso por um investimento de</p>
            <p className="z-price"><span>R$</span> {course.priceCents / 100}<span>,00</span></p>
            <p className="z-installments" aria-describedby="installment-note">Em até <strong>{course.maximumInstallments}x no cartão</strong><sup>*</sup></p>
            <p id="installment-note" className="z-installment-note">* Com juros por conta do comprador.</p>
            <p className="z-support">Tem alguma dúvida sobre o conteúdo ou formato da capacitação? <a href={zulligerSupportLink} target="_blank" rel="noopener noreferrer"><MessageCircle size={21} aria-hidden="true" /><span>Fale com nossa equipe no WhatsApp</span></a></p>
            <div className="z-waitlist"><Users size={21} aria-hidden="true" /><p><strong>Uma turma de até 15 participantes.</strong><br />{process.env.ZULLIGER_INFORMATION_ONLY === "true" ? "A disponibilidade de vagas será informada na abertura das inscrições." : "Após o preenchimento, a versão final terá lista de espera sem cobrança."}</p></div>
          </div>
          <div className="z-enrollment-contact">
            <div className="z-contact-card">
              <p className="z-eyebrow">Sua próxima etapa</p>
              <h3>Aprenda na prática.<br />Faça parte desta turma.</h3>
              <p className="z-contact-limit">As inscrições serão encerradas quando a turma atingir {course.capacity} participantes. Dê o próximo passo e faça parte desta turma.</p>
              <RegistrationLink className="z-button z-button-full" />
              <p className="z-small">{process.env.ZULLIGER_INFORMATION_ONLY === "true" ? "As inscrições online ainda não estão abertas. Consulte as informações ou fale com nossa equipe." : "Você seguirá para a página de inscrição. Nesta prévia, o formulário é demonstrativo."}</p>
            </div>
          </div>
        </div></section>

        <section className="z-section z-container z-faq" id="duvidas"><div><p className="z-eyebrow">Antes de participar</p><h2>Decida com<br />tranquilidade.</h2><p className="z-small">Veja as principais informações sobre o curso e a inscrição.</p></div><div>{zulligerFaq.map((item) => <details key={item.question}><summary><span>{item.question}</span><span className="z-faq-symbol" aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div></section>


      </main>
      <footer className="z-footer"><div className="z-container"><img src="/images/logo-vertical-300.webp" width="150" height="73" alt="NeuroPsiEdu" /><p>Conhecimento que aproxima<br />a teoria da prática.</p><a href="mailto:contato@neuropsiedu.com.br">Fale com a NeuroPsiEdu <ArrowRight size={16} aria-hidden="true" /></a><small>© 2026 NeuroPsiEdu · CNPJ 34.800.411/0001-83</small><a href="#topo">Voltar ao topo ↑</a></div></footer>
    </div>
  );
}
