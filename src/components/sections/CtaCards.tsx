"use client";

import { useRef, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Users, GraduationCap, CheckCircle2, Calendar, BookOpen, ShieldCheck } from "lucide-react";

const cards = [
  {
    title: "Quero Agendar Minha Avaliação",
    description: "Avaliação neuropsicológica especializada com diagnóstico preciso, escuta qualificada e acompanhamento personalizado em todas as fases da vida.",
    icon: Users,
    color: "blue",
    list: [
      "Avaliação Infantil, Adulto e Idoso",
      "Diagnóstico Neuropsicológico Especializado",
      "Acompanhamento Individualizado",
      "Atendimento Online e Presencial"
    ],
    buttonText: "Agendar Consulta",
    buttonIcon: Calendar,
    href: "https://wa.me/5561996436007?text=Quero%20uma%20avalia%C3%A7%C3%A3o%2C%20pode%20me%20ajudar%3F"
  },
  {
    title: "Quero Me Capacitar",
    description: "Formação para psicólogos que desejam atuar com mais segurança clínica, excelência técnica e aprofundamento em neuropsicologia.",
    icon: GraduationCap,
    color: "orange",
    list: [
      "Formação em Neuropsicologia na Prática",
      "Cursos com Aplicação Clínica Real",
      "Certificação e Atualização Profissional",
      "Acompanhamento com Especialistas"
    ],
    buttonText: "Conhecer Formação",
    buttonIcon: BookOpen,
    href: "/fnp"
  },
  {
    title: "Quero Supervisão Clínica",
    description: "Supervisão especializada para psicólogos que desejam fortalecer análise clínica, raciocínio diagnóstico e condução de casos em Avaliação Neuropsicológica.",
    icon: ShieldCheck,
    color: "teal",
    list: [
      "Discussão clínica de casos",
      "Construção de raciocínio diferencial",
      "Supervisão em laudos neuropsicológicos",
      "Apoio técnico especializado"
    ],
    buttonText: "Quero conhecer a supervisão",
    buttonIcon: ShieldCheck,
    href: "https://wa.me/5561996436007?text=Olá,%20quero%20conhecer%20a%20Supervisão%20Clínica%20da%20NeuroPsiEdu"
  }
];

const colorMap = {
  blue:  { bar: "bg-neuro-blue",   icon: "bg-neuro-blue/5 text-neuro-blue",     check: "text-neuro-blue",   btn: "bg-neuro-blue text-white shadow-[0_10px_25px_-5px_rgba(28,69,104,0.3)]" },
  orange:{ bar: "bg-neuro-orange", icon: "bg-neuro-orange/5 text-neuro-orange", check: "text-neuro-orange", btn: "bg-neuro-orange text-white shadow-[0_10px_25px_-5px_rgba(242,140,40,0.3)]" },
  teal:  { bar: "bg-teal-600",     icon: "bg-teal-50 text-teal-600",            check: "text-teal-600",     btn: "bg-teal-600 text-white shadow-[0_10px_25px_-5px_rgba(13,148,136,0.3)]" },
};

export function CtaCards() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const ctrl0 = useAnimation();
  const ctrl1 = useAnimation();
  const ctrl2 = useAnimation();
  const cardControls = [ctrl0, ctrl1, ctrl2];

  useEffect(() => {
    if (isInView) {
      cardControls.forEach((ctrl, i) => {
        ctrl.set({ opacity: 0, y: 30 });
        ctrl.start({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.15 } });
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView]);

  return (
    <section className="py-10 xs:py-14 sm:py-20 px-4 xs:px-6 bg-[#fdfdfd]">
      <div
        ref={containerRef}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {cards.map((card, idx) => {
          const c = colorMap[card.color as keyof typeof colorMap];
          return (
            <motion.div
              key={idx}
              animate={cardControls[idx]}
              className="group relative overflow-hidden rounded-3xl p-5 xs:p-8 md:p-10 border border-slate-100 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.06)] transition-all duration-500 md:last:col-span-2 lg:last:col-span-1"
            >
              {/* Color Accent Bar */}
              <div className={`absolute top-0 left-0 w-full h-1.5 ${c.bar}`} />

              <div className="flex flex-col h-full">
                <div className="flex items-center gap-5 mb-8">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${c.icon}`}>
                    <card.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-neuro-blue leading-tight">
                    {card.title}
                  </h3>
                </div>

                <p className="text-slate-500 text-base mb-8 leading-relaxed text-center">
                  {card.description}
                </p>

                <ul className="space-y-4 mb-10">
                  {card.list.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-600 font-medium">
                      <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${c.check}`} />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-[15px] transition-all duration-300 hover:scale-[1.02] ${c.btn}`}
                  >
                    <card.buttonIcon className="w-5 h-5" />
                    {card.buttonText}
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </a>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
