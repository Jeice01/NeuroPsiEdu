"use client";

import { motion, Variants } from "framer-motion";
import {
  AlertTriangle,
  ClipboardCheck,
  FileSearch,
  HelpCircle,
  Scale,
  ShieldAlert,
} from "lucide-react";

export function ManuseioArmaProblem() {
  const pains = [
    {
      icon: <HelpCircle className="w-6 h-6 text-neuro-orange" />,
      title: "Insegurança sobre por onde começar",
      description:
        "Muitos psicólogos desejam atuar na área, mas ficam em dúvida sobre os requisitos técnicos, o fluxo da avaliação e os cuidados necessários antes de iniciar.",
    },
    {
      icon: <ClipboardCheck className="w-6 h-6 text-neuro-orange" />,
      title: "Dúvidas sobre instrumentos",
      description:
        "A escolha, aplicação e interpretação dos testes exigem domínio técnico. Sem método, o profissional pode se sentir inseguro diante dos protocolos.",
    },
    {
      icon: <Scale className="w-6 h-6 text-neuro-orange" />,
      title: "Legislação e normativas",
      description:
        "Atuar nessa área exige atenção às normas, critérios e responsabilidades éticas envolvidas na avaliação psicológica para manuseio de arma de fogo.",
    },
    {
      icon: <FileSearch className="w-6 h-6 text-neuro-orange" />,
      title: "Interpretação dos resultados",
      description:
        "O desafio não está apenas em aplicar instrumentos, mas em integrar dados, analisar indicadores e sustentar tecnicamente a conclusão avaliativa.",
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-neuro-orange" />,
      title: "Medo de cometer erros técnicos",
      description:
        "Por envolver uma finalidade sensível, muitos profissionais sentem receio de falhar na análise, no registro das informações ou na tomada de decisão.",
    },
    {
      icon: <AlertTriangle className="w-6 h-6 text-neuro-orange" />,
      title: "Credenciamento e atuação profissional",
      description:
        "Além da formação técnica, é comum haver dúvidas sobre credenciamento, exigências práticas e caminhos para ampliar a atuação com responsabilidade.",
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
      transition: { type: "spring", stiffness: 80, damping: 12 },
    },
  };

  return (
    <section
      id="problema"
      className="relative py-24 bg-gradient-to-b from-slate-950 via-[#0a1e30] to-slate-950 text-white overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-neuro-blue/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            O Desafio Profissional
          </span>

          <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-white leading-tight">
            Você quer atuar com avaliações para manuseio de arma de fogo, mas
            ainda sente insegurança técnica?
          </h2>

          <p className="text-slate-400 font-light text-base sm:text-lg">
            Essa é uma área de alta responsabilidade ética e técnica. Por isso,
            não basta conhecer os instrumentos: é preciso compreender o processo
            avaliativo, integrar dados e tomar decisões com segurança.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {pains.map((pain) => (
            <motion.div
              key={pain.title}
              variants={cardVariants}
              className="glass-dark hover:bg-slate-900/50 p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 group flex flex-col justify-between h-full hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)]"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-neuro-orange/10 group-hover:border-neuro-orange/20 transition-all duration-300">
                  {pain.icon}
                </div>

                <h3 className="font-display font-bold text-lg text-white group-hover:text-neuro-orange transition-colors">
                  {pain.title}
                </h3>

                <p className="text-slate-400 text-sm leading-relaxed font-light">
                  {pain.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
