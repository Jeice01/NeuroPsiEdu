"use client";

import { useRef, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Users, GraduationCap, CheckCircle2, Calendar, BookOpen } from "lucide-react";

const cards = [
  {
    title: "Quero Atendimento Neuropsicológico",
    description: "Avaliação completa, diagnóstico preciso e acompanhamento especializado para todas as idades.",
    icon: Users,
    color: "blue",
    list: [
      "Avaliação Infantil, Adulto e Idoso",
      "Diagnóstico Neuropsicológico",
      "Acompanhamento Personalizado",
      "Atendimento Online e Presencial"
    ],
    buttonText: "Agendar Consulta",
    buttonIcon: Calendar,
    href: "https://wa.me/5561982088284?text=Quero%20uma%20avalia%C3%A7%C3%A3o%2C%20pode%20me%20ajudar%3F"
  },
  {
    title: "Quero Me Capacitar",
    description: "Formação profissional de excelência com base científica e aplicação prática clínica.",
    icon: GraduationCap,
    color: "orange",
    list: [
      "Cursos e Especializações",
      "Neuropsicologia na Prática",
      "Formação com Certificação",
      "Mentoria com Especialistas"
    ],
    buttonText: "Conhecer Formação",
    buttonIcon: BookOpen,
    href: "https://wa.me/5561982088284?text=Quero%20saber%20mais%20sobre%20os%20cursos%2C%20pode%20me%20ajudar%3F"
  }
];

export function CtaCards() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const ctrl0 = useAnimation();
  const ctrl1 = useAnimation();
  const cardControls = [ctrl0, ctrl1];

  useEffect(() => {
    if (isInView) {
      ctrl0.set({ opacity: 0, y: 30 });
      ctrl0.start({ opacity: 1, y: 0, transition: { duration: 0.6 } });

      ctrl1.set({ opacity: 0, y: 30 });
      ctrl1.start({ opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.2 } });
    }
  }, [isInView, ctrl0, ctrl1]);

  return (
    <section className="py-20 px-6 bg-[#fdfdfd]">
      <div
        ref={containerRef}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            animate={cardControls[idx]}
            className={`group relative overflow-hidden rounded-3xl p-8 md:p-12 border border-slate-100 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.06)] transition-all duration-500`}
          >
            {/* Color Accent Bar */}
            <div className={`absolute top-0 left-0 w-full h-1.5 ${card.color === 'blue' ? 'bg-neuro-blue' : 'bg-neuro-orange'}`} />

            <div className="flex flex-col h-full">
              <div className="flex items-center gap-6 mb-8">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${card.color === 'blue' ? 'bg-neuro-blue/5 text-neuro-blue' : 'bg-neuro-orange/5 text-neuro-orange'}`}>
                  <card.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-neuro-blue leading-tight">
                  {card.title}
                </h3>
              </div>

              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                {card.description}
              </p>

              <ul className="space-y-4 mb-12">
                {card.list.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600 font-medium">
                    <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${card.color === 'blue' ? 'text-neuro-blue' : 'text-neuro-orange'}`} />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <a
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-[15px] transition-all duration-300 hover:scale-[1.02] ${
                    card.color === 'blue'
                    ? 'bg-neuro-blue text-white shadow-[0_10px_25px_-5px_rgba(28,69,104,0.3)]'
                    : 'bg-neuro-orange text-white shadow-[0_10px_25px_-5px_rgba(242,140,40,0.3)]'
                  }`}
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
        ))}
      </div>
    </section>
  );
}
