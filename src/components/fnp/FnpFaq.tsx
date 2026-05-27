"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export function FnpFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "Para quem é indicada a Formação em Avaliação Clínica e Neuropsicológica?",
      a: "A formação é indicada principalmente para psicólogos e estudantes de Psicologia em fase final de graduação que desejam desenvolver ou fortalecer sua atuação em Avaliação Clínica e Neuropsicológica.\n\nEla também é indicada para profissionais que já atendem em clínica, escola, instituições ou contextos de saúde e desejam construir mais segurança para avaliar diferentes demandas, interpretar dados, levantar hipóteses clínicas e elaborar laudos com maior consistência técnica.",
    },
    {
      q: "Preciso já ter experiência com Avaliação Neuropsicológica para participar?",
      a: "Não. Você não precisa dominar tudo ao entrar.\n\nA formação foi pensada para conduzir o aluno de forma progressiva, ajudando a construir segurança, método, raciocínio clínico e organização prática para atuar com Avaliação Clínica e Neuropsicológica.\n\nAo longo dos módulos, você será conduzido por temas fundamentais da prática avaliativa, passando por quadros do neurodesenvolvimento, dificuldades de aprendizagem, avaliação da pessoa idosa, personalidade, dinâmica emocional e escrita de laudos.",
    },
    {
      q: "Já fiz outros cursos e ainda me sinto insegura. Essa formação é diferente?",
      a: "Sim. Muitas vezes, a insegurança não vem da falta de cursos, mas da forma fragmentada como os conteúdos são aprendidos.\n\nA proposta da NeuroPsiEdu é integrar teoria, prática clínica, raciocínio diferencial, instrumentos, hipóteses diagnósticas, interpretação de dados e elaboração de laudos.\n\nA formação não se limita a apresentar testes ou conceitos isolados. Ela organiza uma jornada para que o profissional aprenda a pensar a avaliação de forma mais estruturada, clínica e fundamentada.",
    },
    {
      q: "O investimento está caro?",
      a: "O investimento deve ser analisado como uma decisão de qualificação profissional.\n\nA Avaliação Neuropsicológica é uma área de demanda crescente, especialmente em contextos clínicos, educacionais, médicos e institucionais. Ao se preparar com mais profundidade, o profissional amplia sua segurança, sua capacidade técnica e sua possibilidade de oferecer um serviço mais qualificado.\n\nAlém disso, considerando o valor médio de uma avaliação neuropsicológica no mercado, o profissional pode recuperar o investimento da formação com poucas avaliações realizadas, dependendo da sua realidade de atuação.",
    },
    {
      q: "Qual é a diferença entre fazer a formação completa e comprar apenas módulos avulsos?",
      a: "A formação completa oferece uma jornada estruturada, progressiva e integrada.\n\nIsso significa que os módulos não são pensados como conteúdos soltos. Eles se conectam para construir uma visão ampla da Avaliação Clínica e Neuropsicológica, passando por diferentes públicos, quadros clínicos, hipóteses diagnósticas, instrumentos e raciocínio para elaboração de laudos.\n\nJá os módulos avulsos são indicados para quem deseja estudar apenas um tema específico, de forma isolada.\n\nPara quem deseja desenvolver uma atuação mais consistente na área, a formação completa oferece mais profundidade, mais continuidade e melhor custo por módulo.",
    },
    {
      q: "Quais temas serão estudados na formação?",
      a: "A 8ª Turma é composta por 7 módulos:\n\n1º Módulo — DI e Altas Habilidades/Superdotação · 27 e 28 de junho de 2026\n2º Módulo — TDAH · 25 e 26 de julho de 2026\n3º Módulo — TEA · 05 e 06 de junho e 29 e 30 de agosto de 2026\n4º Módulo — Transtornos Específicos de Aprendizagem · 11 e 12 de julho de 2026\n5º Módulo — Avaliação Neuropsicológica da Pessoa Idosa · 08 e 09 de agosto de 2026\n6º Módulo — Personalidade e Dinâmica das Emoções · 12 e 13 de setembro de 2026\n7º Módulo — Escrita de Laudos e Raciocínio Clínico · 17 e 18 de outubro de 2026",
    },
    {
      q: "As aulas são online ou presenciais?",
      a: "As aulas da 8ª Turma são presenciais.\n\nO formato presencial favorece a troca direta com a professora, a discussão de dúvidas, o aprofundamento técnico e a conexão com situações reais da prática clínica.\n\nEsse contato também contribui para que o aluno desenvolva mais segurança ao discutir casos, compreender hipóteses e organizar o raciocínio clínico.",
    },
    {
      q: "E se eu não puder participar de algum módulo na data marcada?",
      a: "Caso você não consiga participar de algum módulo, terá acesso ao material conceitual da aula e poderá concluir o módulo perdido em uma próxima turma, quando ele for ofertado novamente.\n\nDessa forma, você mantém a possibilidade de completar sua jornada formativa e não perde a continuidade da formação.",
    },
    {
      q: "Vou aprender quais testes usar em cada avaliação?",
      a: "A formação aborda instrumentos, recursos, formulários, inventários e possibilidades de avaliação, mas sempre dentro de uma lógica clínica.\n\nO objetivo não é apenas listar testes, mas ensinar o aluno a compreender por que avaliar, o que investigar, como levantar hipóteses, como interpretar os dados e como conectar os resultados à demanda clínica.\n\nA escolha de instrumentos deve sempre considerar o caso, a hipótese, a faixa etária, a finalidade da avaliação e as normas profissionais vigentes.",
    },
    {
      q: "A formação ensina a fazer diagnóstico?",
      a: "A formação ensina o profissional a construir um raciocínio clínico mais estruturado para compreender hipóteses, sinais, sintomas, prejuízos funcionais, diagnósticos diferenciais e comorbidades.\n\nO foco é ajudar o aluno a compreender como a Avaliação Clínica e Neuropsicológica contribui para o processo diagnóstico, sempre respeitando os limites éticos, técnicos e profissionais da atuação psicológica.",
    },
    {
      q: "Vou aprender a elaborar laudos neuropsicológicos?",
      a: "Sim. A formação conta com um módulo específico sobre Escrita de Laudos Neuropsicológicos e Raciocínio Clínico.\n\nNesse módulo, serão trabalhadas etapas da elaboração do laudo, organização dos resultados, escrita técnica, resposta à demanda, interpretação dos dados, uso de gráficos e tabelas e construção de conclusões mais claras e fundamentadas.\n\nO laudo será tratado como resultado de todo o processo avaliativo, e não apenas como um documento final.",
    },
    {
      q: "A formação aborda diferentes públicos?",
      a: "Sim. A formação contempla diferentes públicos e demandas clínicas.\n\nAo longo dos módulos, o aluno terá contato com temas relacionados à avaliação de crianças, adolescentes, adultos e idosos, incluindo quadros do neurodesenvolvimento, dificuldades de aprendizagem, funcionamento cognitivo, personalidade, emoções e envelhecimento.\n\nEssa diversidade ajuda o profissional a desenvolver uma visão mais ampla e organizada da Avaliação Clínica e Neuropsicológica.",
    },
    {
      q: "A formação serve para quem quer começar a atuar com Avaliação Neuropsicológica?",
      a: "Sim. A formação é indicada para quem deseja iniciar ou estruturar melhor sua atuação.\n\nO percurso foi pensado para ajudar o profissional a sair da insegurança e construir uma base mais sólida, com método, sequência, análise clínica e raciocínio aplicado.\n\nEla é especialmente útil para quem deseja deixar de depender de conteúdos soltos e começar a organizar sua prática com mais clareza.",
    },
    {
      q: "A formação também serve para quem já atende?",
      a: "Sim. Profissionais que já atendem podem usar a formação para aprofundar sua prática, revisar critérios clínicos, fortalecer o raciocínio diferencial, ampliar repertório de avaliação e melhorar a qualidade dos laudos.\n\nMesmo quem já atua pode se beneficiar de uma jornada integrada, principalmente quando sente dificuldade em conectar entrevista, instrumentos, hipóteses, interpretação dos resultados e escrita final do documento.",
    },
    {
      q: "Vou receber certificado?",
      a: "Sim. Os participantes recebem certificado conforme os critérios definidos pela NeuroPsiEdu.\n\nO certificado pode contribuir para comprovação de formação complementar, melhoria curricular e fortalecimento da trajetória profissional.",
    },
    {
      q: "O certificado é reconhecido pelo MEC?",
      a: "A formação se enquadra na modalidade de curso livre. Cursos livres não dependem de autorização prévia ou reconhecimento do MEC para funcionamento.\n\nO certificado comprova a participação na formação e pode ser utilizado como formação complementar, conforme os critérios das instituições ou contextos em que for apresentado.",
    },
    {
      q: "A formação oferece material de apoio?",
      a: "Sim. A formação prevê materiais conceituais e recursos de apoio relacionados aos módulos.\n\nEsses materiais ajudam o aluno a acompanhar os conteúdos, revisar conceitos importantes e organizar melhor o aprendizado ao longo da jornada.",
    },
    {
      q: "O que eu ganho ao fazer a formação completa?",
      a: "Ao fazer a formação completa, você desenvolve uma visão mais organizada, profunda e integrada da Avaliação Clínica e Neuropsicológica.\n\nVocê passa a compreender melhor: como estruturar o processo avaliativo; como levantar hipóteses clínicas; como pensar diagnósticos diferenciais; como analisar diferentes quadros e públicos; como conectar instrumentos, entrevistas e dados clínicos; como interpretar resultados; como escrever laudos com mais clareza e segurança.\n\nA formação completa oferece uma base mais consistente para quem deseja atuar com mais segurança e qualidade técnica.",
    },
    {
      q: "A formação ajuda a aumentar minha rentabilidade profissional?",
      a: "A formação pode contribuir diretamente para o fortalecimento da sua atuação profissional.\n\nAo se qualificar para realizar avaliações clínicas e neuropsicológicas com mais segurança, o profissional pode ampliar suas possibilidades de atendimento, melhorar a qualidade do serviço oferecido e atender uma demanda crescente do mercado.\n\nA qualificação técnica também contribui para posicionamento profissional, autoridade clínica e valorização do serviço.",
    },
    {
      q: "Por que escolher a NeuroPsiEdu?",
      a: "A NeuroPsiEdu propõe uma formação com foco em prática clínica, raciocínio técnico e aplicação real da Avaliação Neuropsicológica.\n\nA formação não foi construída para entregar conteúdos soltos, mas para conduzir o aluno por uma jornada de aprendizado estruturada, com temas fundamentais para quem deseja atuar com mais segurança, profundidade e responsabilidade na área.\n\nA proposta é formar profissionais que saibam pensar a avaliação, interpretar dados e construir respostas clínicas mais consistentes.",
    },
  ];

  return (
    <section id="faq" className="relative py-24 bg-[#fdfdfd] text-[#1c4568] overflow-hidden">
      
      {/* Decorative background glow */}
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-slate-50 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Dúvidas Frequentes</span>
          <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-neuro-blue leading-tight">
            Perguntas Respondidas
          </h2>
          <p className="text-slate-600 font-light text-base sm:text-lg">
            Tem dúvidas sobre o funcionamento da formação? Separamos as respostas mais comuns para você.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`bg-white border rounded-2xl transition-all duration-300 ${
                  isOpen 
                    ? "border-slate-300/80 shadow-[0_10px_30px_rgba(28,69,104,0.04)]" 
                    : "border-slate-100 hover:border-slate-200"
                }`}
              >
                {/* Trigger button */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 cursor-pointer"
                >
                  <span className="font-display font-bold text-sm sm:text-base text-neuro-blue leading-snug">
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${
                    isOpen ? "bg-neuro-orange/10 text-neuro-orange" : "bg-slate-50 text-slate-400"
                  }`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {/* Dropdown panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed font-light border-t border-slate-100/60">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Still have questions */}
        <div className="mt-12 text-center glass-light border border-slate-100 p-8 rounded-2xl max-w-2xl mx-auto space-y-4">
          <div className="space-y-2">
            <h4 className="font-display font-bold text-base text-neuro-blue">Ainda está em dúvida se essa formação é para você?</h4>
            <p className="text-slate-600 text-sm font-light leading-relaxed">
              Se você deseja atuar com Avaliação Clínica e Neuropsicológica com mais segurança, clareza e método, a 8ª Turma da NeuroPsiEdu foi pensada para conduzir sua evolução profissional de forma estruturada.
            </p>
            <p className="text-slate-600 text-sm font-light leading-relaxed">
              Mais do que aprender conteúdos isolados, você terá acesso a uma jornada formativa completa para desenvolver raciocínio clínico, compreender diferentes quadros, organizar hipóteses, interpretar dados e construir laudos com mais consistência técnica.
            </p>
            <p className="text-slate-700 text-sm font-semibold leading-relaxed">
              A decisão de investir na sua formação também é uma decisão de fortalecer a qualidade do serviço que você entrega.
            </p>
          </div>
          <a
            href="https://wa.me/5561982088284?text=Olá,%20tenho%20dúvidas%20sobre%20a%20Formação%20em%20Avaliação%20Neuropsicológica%20"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors items-center gap-1.5"
          >
            Falar com suporte
          </a>
        </div>

      </div>
    </section>
  );
}
