import Link from "next/link";
import {
  ArrowRight,
  Baby,
  Brain,
  BriefcaseBusiness,
  Check,
  ClipboardCheck,
  FileText,
  GraduationCap,
  HeartHandshake,
  Lightbulb,
  MapPin,
  MessageCircle,
  Microscope,
  Puzzle,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
  UsersRound,
} from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import {
  AvaliacaoPageView,
  AvaliacaoWhatsappLink,
} from "@/components/avaliacao-neuropsicologica/AvaliacaoAnalytics";
import {
  AVALIACAO_FAQS,
  AVALIACAO_WHATSAPP_URL,
} from "@/data/avaliacao-neuropsicologica";

const audiences = [
  {
    icon: Baby,
    title: "Crianças e adolescentes",
    text: "Quando há dúvidas sobre desenvolvimento, aprendizagem, atenção, comportamento, emoções ou desempenho escolar.",
  },
  {
    icon: UserRound,
    title: "Adultos",
    text: "Para investigar dificuldades cognitivas, emocionais ou funcionais que afetam estudos, trabalho, relações e rotina.",
  },
  {
    icon: UsersRound,
    title: "Idosos",
    text: "Diante de mudanças percebidas na memória, na autonomia ou em outras funções cognitivas ao longo do envelhecimento.",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Contato e entrevista inicial",
    text: "A demanda, a história e as principais dúvidas são acolhidas para orientar o planejamento.",
  },
  {
    number: "02",
    title: "Planejamento individualizado",
    text: "As etapas e os recursos são definidos de acordo com a idade e as necessidades de cada pessoa.",
  },
  {
    number: "03",
    title: "Encontros de avaliação",
    text: "Entrevistas, observações e instrumentos clínicos ajudam a reunir informações sobre o funcionamento atual.",
  },
  {
    number: "04",
    title: "Análise integrada",
    text: "Os dados são interpretados em conjunto com a história e o contexto, sem reduzir a pessoa a um resultado isolado.",
  },
  {
    number: "05",
    title: "Devolutiva e orientações",
    text: "Os achados são explicados com clareza e podem direcionar estratégias, encaminhamentos e próximos cuidados.",
  },
];

const domains = [
  { icon: Target, title: "Atenção" },
  { icon: Brain, title: "Memória" },
  { icon: Puzzle, title: "Funções executivas" },
  { icon: Lightbulb, title: "Raciocínio e cognição" },
  { icon: GraduationCap, title: "Aprendizagem" },
  { icon: BriefcaseBusiness, title: "Funcionalidade cotidiana" },
  { icon: HeartHandshake, title: "Aspectos emocionais" },
  { icon: UsersRound, title: "Comportamento e habilidades sociais" },
];

const trustPoints = [
  "Processo planejado para cada pessoa e cada demanda",
  "Leitura integrada de cognição, comportamento e emoções",
  "Comunicação clara durante as etapas e na devolutiva",
  "Orientações que consideram família, escola, trabalho e cuidado clínico",
];

const ctaClassName =
  "inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl bg-neuro-orange px-6 py-3.5 text-center text-sm font-black uppercase tracking-wider text-white shadow-[0_14px_35px_-12px_rgba(242,140,40,0.8)] transition hover:-translate-y-0.5 hover:bg-neuro-orange-light focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neuro-orange/30";

export function AvaliacaoNeuropsicologicaPage() {
  return (
    <div className="min-h-screen bg-white text-slate-700">
      <AvaliacaoPageView />
      <Navbar />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-[#f7fbff] via-white to-[#f5fbfa] pb-16 pt-32 sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40">
          <div className="pointer-events-none absolute -right-32 top-8 h-96 w-96 rounded-full bg-neuro-cyan/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-36 bottom-0 h-80 w-80 rounded-full bg-neuro-orange/10 blur-3xl" />
          <div className="container relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[1.08fr_.92fr] lg:gap-16">
            <div>
              <nav aria-label="Breadcrumb" className="mb-7 text-sm font-semibold text-slate-500">
                <ol className="flex flex-wrap items-center gap-2">
                  <li><Link href="/" className="hover:text-neuro-blue">Início</Link></li>
                  <li aria-hidden="true">/</li>
                  <li aria-current="page" className="text-neuro-blue">Avaliação Neuropsicológica</li>
                </ol>
              </nav>

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-neuro-blue/10 bg-white/80 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-neuro-blue shadow-sm">
                <Microscope className="h-4 w-4" aria-hidden="true" />
                Atendimento especializado em Brasília
              </div>

              <h1 className="max-w-3xl text-4xl font-black leading-[1.08] text-neuro-blue xs:text-5xl md:text-6xl">
                Avaliação Neuropsicológica
                <span className="mt-2 block text-[#42b6a5]">para compreender e orientar</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
                Um processo clínico individualizado para investigar o funcionamento cognitivo, comportamental e emocional em diferentes fases da vida.
              </p>

              <div className="mt-9 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
                <AvaliacaoWhatsappLink
                  href={AVALIACAO_WHATSAPP_URL}
                  origin="hero"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={ctaClassName}
                >
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  Conversar pelo WhatsApp
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </AvaliacaoWhatsappLink>
                <a
                  href="#como-funciona"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-neuro-blue/15 bg-white px-6 py-3.5 text-sm font-bold text-neuro-blue transition hover:border-neuro-blue/30 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neuro-blue/15"
                >
                  Entender como funciona
                </a>
              </div>

              <p className="mt-5 flex items-start gap-2 text-sm leading-relaxed text-slate-500">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#42b6a5]" aria-hidden="true" />
                O primeiro contato serve para acolher sua dúvida e orientar se este serviço faz sentido para o caso.
              </p>
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -inset-4 rotate-2 rounded-[2.5rem] bg-gradient-to-br from-neuro-blue/10 to-[#42b6a5]/20" />
              <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white p-3 shadow-[0_30px_70px_-25px_rgba(28,69,104,0.35)]">
                <picture>
                  <source media="(max-width: 639px)" srcSet="/images/brain-640.webp" />
                  <img
                    src="/images/brain-960.webp"
                    width={960}
                    height={960}
                    alt="Ilustração de um cérebro representando a avaliação das funções cognitivas"
                    fetchPriority="high"
                    decoding="async"
                    className="aspect-square w-full rounded-[1.45rem] object-cover"
                  />
                </picture>
              </div>
              <div className="absolute -bottom-5 left-4 right-4 rounded-2xl border border-slate-100 bg-white/95 p-4 shadow-xl backdrop-blur sm:left-10 sm:right-10">
                <p className="text-center text-sm font-bold leading-relaxed text-neuro-blue">
                  Infância, adolescência, vida adulta e envelhecimento
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20" aria-labelledby="entenda-title">
          <div className="container mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-neuro-orange">Entenda o serviço</p>
              <h2 id="entenda-title" className="text-3xl font-black leading-tight text-neuro-blue sm:text-4xl">
                Quando dúvidas sobre cognição e comportamento pedem uma investigação cuidadosa
              </h2>
            </div>
            <div className="space-y-5 text-lg leading-relaxed text-slate-600">
              <p>
                A avaliação neuropsicológica ajuda a compreender como diferentes funções mentais se relacionam com a aprendizagem, o trabalho, as relações e a autonomia no dia a dia.
              </p>
              <p>
                Ela não se resume à aplicação de testes. A história, o contexto, as observações e os resultados são analisados em conjunto para construir uma compreensão responsável e útil para os próximos passos.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16 sm:py-24" aria-labelledby="publicos-title">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-neuro-orange">Para quem é indicada</p>
              <h2 id="publicos-title" className="text-3xl font-black text-neuro-blue sm:text-4xl">Um olhar adequado a cada fase da vida</h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">A indicação parte das dúvidas e dos impactos percebidos, não de rótulos prévios.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {audiences.map(({ icon: Icon, title, text }) => (
                <article key={title} className="rounded-3xl border border-slate-100 bg-white p-7 shadow-[0_18px_45px_-25px_rgba(28,69,104,0.25)]">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-neuro-blue/5 text-neuro-blue">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-black text-neuro-blue">{title}</h3>
                  <p className="mt-4 leading-relaxed text-slate-600">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="como-funciona" className="scroll-mt-24 py-16 sm:py-24" aria-labelledby="processo-title">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="max-w-3xl">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-neuro-orange">Como funciona</p>
              <h2 id="processo-title" className="text-3xl font-black text-neuro-blue sm:text-4xl">Um processo construído etapa por etapa</h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-600">O percurso é adaptado à demanda. De forma geral, ele inclui os momentos abaixo.</p>
            </div>
            <ol className="mt-12 grid gap-5 lg:grid-cols-5">
              {processSteps.map((step) => (
                <li key={step.number} className="relative rounded-3xl border border-neuro-blue/10 bg-white p-6 shadow-sm">
                  <span className="text-sm font-black tracking-widest text-neuro-orange">{step.number}</span>
                  <h3 className="mt-4 text-lg font-black leading-snug text-neuro-blue">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-neuro-blue py-16 text-white sm:py-24" aria-labelledby="dominios-title">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-neuro-orange-light">O que pode ser investigado</p>
              <h2 id="dominios-title" className="text-3xl font-black sm:text-4xl">Domínios avaliados conforme a necessidade</h2>
              <p className="mt-5 text-lg leading-relaxed text-blue-100/80">Nem todas as áreas são avaliadas da mesma forma em todos os casos. O planejamento responde à pergunta clínica apresentada.</p>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
              {domains.map(({ icon: Icon, title }) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center backdrop-blur-sm">
                  <Icon className="mx-auto h-7 w-7 text-neuro-orange-light" aria-hidden="true" />
                  <h3 className="mt-4 text-sm font-bold leading-snug sm:text-base">{title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24" aria-labelledby="confianca-title">
          <div className="container mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-neuro-orange">Cuidado e confiança</p>
              <h2 id="confianca-title" className="text-3xl font-black leading-tight text-neuro-blue sm:text-4xl">Resultados precisam fazer sentido para a vida real</h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-600">Mais do que apresentar dados, a avaliação busca transformar informações em compreensão e orientações aplicáveis ao contexto de cada pessoa.</p>
              <ul className="mt-8 space-y-4">
                {trustPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3 leading-relaxed text-slate-700">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#42b6a5]/10 text-[#278b7c]">
                      <Check className="h-4 w-4" aria-hidden="true" />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[2rem] bg-slate-50 p-7 sm:p-10">
              <ClipboardCheck className="h-10 w-10 text-neuro-orange" aria-hidden="true" />
              <h3 className="mt-6 text-2xl font-black text-neuro-blue">Devolutiva clara e orientadora</h3>
              <p className="mt-4 text-lg leading-relaxed text-slate-600">Ao final, os resultados são explicados em linguagem compreensível, destacando potencialidades, dificuldades e caminhos que podem apoiar o cuidado.</p>
              <div className="mt-7 flex items-start gap-4 rounded-2xl border border-neuro-blue/10 bg-white p-5">
                <FileText className="mt-1 h-6 w-6 shrink-0 text-neuro-blue" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-slate-600">O documento decorrente da avaliação e as recomendações dependem da análise clínica e da finalidade de cada caso.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f6fbfa] py-16 sm:py-24" aria-labelledby="profissional-title">
          <div className="container mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-[.82fr_1.18fr]">
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -inset-4 -rotate-2 rounded-[2rem] bg-neuro-orange/10" />
              <picture className="relative block overflow-hidden rounded-[1.75rem] bg-white shadow-2xl">
                <source media="(max-width: 639px)" srcSet="/images/marilia-480.webp" />
                <img
                  src="/images/marilia-800.webp"
                  width={800}
                  height={1001}
                  loading="lazy"
                  decoding="async"
                  alt="Dra. Marília Karine, especialista em Neuropsicologia"
                  className="aspect-[4/5] w-full object-cover object-top"
                />
              </picture>
            </div>
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-neuro-orange">Profissional responsável</p>
              <h2 id="profissional-title" className="text-3xl font-black text-neuro-blue sm:text-4xl">Dra. Marília Karine</h2>
              <p className="mt-3 text-lg font-bold text-[#278b7c]">Especialista em Neuropsicologia</p>
              <div className="mt-7 space-y-5 text-lg leading-relaxed text-slate-600">
                <p>A Dra. Marília Karine atua com avaliação neuropsicológica e dedica seu trabalho à compreensão cuidadosa das necessidades de cada paciente.</p>
                <p>Na NeuroPsiEdu, a prática clínica se une ao compromisso com conhecimento técnico e comunicação humanizada para orientar pacientes, famílias e redes de cuidado.</p>
              </div>
              <div className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-white px-5 py-4 text-sm font-bold text-neuro-blue shadow-sm">
                <Sparkles className="h-5 w-5 text-neuro-orange" aria-hidden="true" />
                Atendimento individualizado e especializado
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24" aria-labelledby="local-title">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-neuro-blue to-neuro-blue-dark p-7 text-white shadow-2xl sm:p-10 lg:p-14">
              <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <MapPin className="h-9 w-9 text-neuro-orange-light" aria-hidden="true" />
                  <h2 id="local-title" className="mt-5 text-3xl font-black sm:text-4xl">Atendimento em Águas Claras, Brasília</h2>
                  <address className="mt-5 max-w-2xl text-lg not-italic leading-relaxed text-blue-100/85">
                    Ed. Conect Towers — QS 1, Bloco D<br />11º andar, sala 1129 — Águas Claras, Brasília — DF
                  </address>
                </div>
                <a
                  href="https://maps.app.goo.gl/QMxDcdBXVTqtWstG7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20"
                >
                  Ver no mapa
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-16 sm:py-24" aria-labelledby="faq-title">
          <div className="container mx-auto max-w-4xl px-6">
            <div className="text-center">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-neuro-orange">Perguntas frequentes</p>
              <h2 id="faq-title" className="text-3xl font-black text-neuro-blue sm:text-4xl">Dúvidas sobre a avaliação</h2>
            </div>
            <div className="mt-10 space-y-4">
              {AVALIACAO_FAQS.map((item) => (
                <details key={item.question} className="group rounded-2xl border border-slate-200 bg-white p-5 open:border-neuro-blue/20 open:shadow-sm sm:p-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-bold text-neuro-blue focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neuro-blue/10">
                    {item.question}
                    <span className="text-2xl font-light text-neuro-orange transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="mt-4 pr-8 leading-relaxed text-slate-600">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#0a1e30] py-16 text-white sm:py-24" aria-labelledby="cta-final-title">
          <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-neuro-blue-light/20 blur-3xl" />
          <div className="container relative mx-auto max-w-4xl px-6 text-center">
            <MessageCircle className="mx-auto h-10 w-10 text-neuro-orange-light" aria-hidden="true" />
            <h2 id="cta-final-title" className="mt-6 text-3xl font-black leading-tight sm:text-4xl md:text-5xl">Quer entender se a avaliação é indicada para o seu caso?</h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-blue-100/75">Converse com a equipe da NeuroPsiEdu. Vamos acolher sua dúvida e orientar o primeiro passo, sem compromisso de diagnóstico pelo WhatsApp.</p>
            <AvaliacaoWhatsappLink
              href={AVALIACAO_WHATSAPP_URL}
              origin="cta_final"
              target="_blank"
              rel="noopener noreferrer"
              className={`${ctaClassName} mt-9 w-full sm:w-auto`}
            >
              Falar com a NeuroPsiEdu
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </AvaliacaoWhatsappLink>
          </div>
        </section>
      </main>

      <Footer
        whatsappHref="https://wa.me/5561996436007"
        whatsappLabel="(61) 99643-6007"
      />
    </div>
  );
}
