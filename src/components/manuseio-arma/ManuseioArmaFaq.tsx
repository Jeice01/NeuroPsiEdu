"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

export function ManuseioArmaFaq() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "A formação é presencial?",
      answer:
        "Sim. A formação será presencial em Brasília/DF, no ConnectTower, Sala 1129, em Águas Claras.",
    },
    {
      question: "Qual é a carga horária?",
      answer:
        "A formação possui certificado de 138 horas, incluindo 120 horas de supervisão individual.",
    },
    {
      question: "Quem pode participar?",
      answer:
        "A formação é destinada a psicólogos, estudantes de Psicologia e profissionais da área que desejam ampliar sua atuação com responsabilidade técnica.",
    },
    {
      question: "A supervisão é individual?",
      answer:
        "Sim. O principal diferencial da formação é a supervisão individualizada, com acompanhamento de 12 protocolos, sendo 6 de Palográfico e 6 de Pfister.",
    },
    {
      question: "Quais instrumentos serão abordados?",
      answer:
        "Serão abordados legislação e normativas, credenciamento, Palográfico, Pfister, IFP, BPA, BETA III, TEPIC-M-2, FDT, BDEFS e integração dos resultados.",
    },
    {
      question: "A turma tem limite de vagas?",
      answer:
        "Sim. A turma é limitada a 10 participantes para garantir acompanhamento próximo e supervisão individualizada.",
    },
    {
      question: "Qual é o investimento?",
      answer:
        "O investimento da formação é de R$ 1.997. Os 3 primeiros inscritos terão condição especial de R$ 1.697.",
    },
    {
      question: "Como funciona o processo de matrícula?",
      answer:
        "Após preencher o formulário, a equipe da NeuroPsiEdu entra em contato pelo WhatsApp para orientar sobre contrato, pagamento via PIX, confirmação de matrícula e onboarding.",
    },
  ];

  return (
    <section
      id="faq"
      className="relative py-24 bg-[#fdfdfd] text-[#1c4568] overflow-hidden border-t border-slate-100"
    >
      <div className="absolute top-1/3 left-0 w-[320px] h-[320px] bg-blue-50 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-[420px] h-[420px] bg-orange-50 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <span className="inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
            <HelpCircle className="w-4 h-4 text-neuro-orange" />
            Dúvidas Frequentes
          </span>

          <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-neuro-blue leading-tight">
            Perguntas frequentes sobre a formação
          </h2>

          <p className="text-slate-600 font-light text-base sm:text-lg">
            Reunimos as principais informações para ajudar você a decidir com
            clareza e segurança.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;

            return (
              <div
                key={faq.question}
                className={`rounded-2xl border bg-white transition-all duration-300 ${
                  isOpen
                    ? "border-neuro-blue/20 shadow-[0_15px_40px_rgba(28,69,104,0.06)]"
                    : "border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:border-slate-200"
                }`}
              >
                <button
                  onClick={() => setActiveIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-display text-base sm:text-lg font-bold text-neuro-blue">
                    {faq.question}
                  </span>

                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-50 transition-transform duration-300 ${
                      isOpen
                        ? "rotate-180 bg-neuro-orange/10 text-neuro-orange"
                        : "text-slate-400"
                    }`}
                  >
                    <ChevronDown className="h-5 w-5" />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-slate-100 px-6 pb-6 pt-4">
                        <p className="text-sm leading-relaxed text-slate-600">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
