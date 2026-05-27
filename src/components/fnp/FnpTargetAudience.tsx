"use client";

import { motion, Variants } from "framer-motion";
import { Check } from "lucide-react";

export function FnpTargetAudience() {
  const targets = [
    {
      title: "Psicólogos Clínicos",
      description: "Que desejam expandir sua atuação, dominar novos instrumentos avaliativos e atrair demandas de alto valor para o consultório.",
    },
    {
      title: "Recém-Formados em Psicologia",
      description: "Que buscam ingressar na prática clínica com segurança, garantindo o conhecimento científico e metodológicos necessários.",
    },
    {
      title: "Neuropsicólogos em Início de Carreira",
      description: "Que embora possuam formação teórica, buscam mais segurança prática na condução dos casos e estruturação de laudos.",
    },
    {
      title: "Estudantes nos Últimos Semestres",
      description: "Que querem construir um diferencial competitivo robusto no mercado antes mesmo de obter o diploma.",
    },
    {
      title: "Psicólogos Escolares e Institucionais",
      description: "Interessados em aprimorar o olhar para transtornos de neurodesenvolvimento e atuar de forma articulada com a clínica.",
    },
  ];

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 85, damping: 14 },
    },
  };

  return (
    <section className="relative py-24 bg-[#fdfdfd] text-[#1c4568] overflow-hidden">
      
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-slate-100 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-50 rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Público-Alvo</span>
          <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-neuro-blue leading-tight">
            Para quem é esta Formação?
          </h2>
          <p className="text-slate-600 font-light text-base sm:text-lg">
            <strong>Uma formação para profissionais que desejam compreender como o funcionamento neuropsicológico influencia o comportamento humano e aplicar esse conhecimento para tornar sua prática clínica, neuropsicológica, avaliativa ou psicoterapêutica mais precisa, integrada e efetiva.</strong>
          </p>
        </div>

        {/* Grid layout (1 column on mobile, 2 on tablet/md, 3 on desktop/lg) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center"
        >
          {targets.map((target, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className={`bg-white border border-slate-100 p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(28,69,104,0.06)] hover:border-slate-200 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between ${
                idx === 4 ? "md:col-span-2 lg:col-span-1 max-w-md mx-auto md:max-w-none w-full" : ""
              }`}
            >
              <div className="space-y-4">
                {/* Icon wrapper */}
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5 text-neuro-orange" />
                </div>
                
                {/* Text content */}
                <div className="space-y-2">
                  <h3 className="font-display font-bold text-lg text-neuro-blue">
                    {target.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed font-light">
                    {target.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
