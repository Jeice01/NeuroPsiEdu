"use client";

import { motion, Variants } from "framer-motion";
import {
  ArrowRightLeft,
  Award,
  BadgeCheck,
  ClipboardList,
  FileText,
  Gavel,
  Layers,
  ShieldCheck,
  Target,
} from "lucide-react";

export function ManuseioArmaSolution() {
  const transformations = [
    {
      icon: <Gavel className="w-5 h-5 text-neuro-orange" />,
      title: "Legislação e Normativas",
      before: "Dúvida sobre quais critérios, responsabilidades e normas orientam essa atuação.",
      after: "Compreensão do contexto ético, técnico e normativo que sustenta a avaliação.",
    },
    {
      icon: <ClipboardList className="w-5 h-5 text-cyan-400" />,
      title: "Fluxo Avaliativo",
      before: "Incerteza sobre como organizar o processo do início ao fechamento.",
      after: "Método estruturado para conduzir entrevista, aplicação, análise e conclusão.",
    },
    {
      icon: <Layers className="w-5 h-5 text-violet-400" />,
      title: "Integração de Instrumentos",
      before: "Aplicar testes de forma isolada, sem clareza sobre como integrar os achados.",
      after: "Leitura integrada entre Palográfico, Pfister, IFP, BPA, BETA III, TEPIC-M-2, FDT e BDEFS.",
    },
    {
      icon: <Target className="w-5 h-5 text-emerald-400" />,
      title: "Análise dos Resultados",
      before: "Ficar preso a escores sem saber sustentar tecnicamente a interpretação.",
      after: "Análise qualitativa e quantitativa para tomada de decisão mais segura.",
    },
    {
      icon: <FileText className="w-5 h-5 text-amber-400" />,
      title: "Registro Técnico",
      before: "Receio de organizar informações de forma frágil ou incompleta.",
      after: "Mais clareza para registrar dados, hipóteses e conclusões com consistência.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-pink-400" />,
      title: "Segurança Profissional",
      before: "Medo de errar em uma avaliação de alta responsabilidade.",
      after: "Postura mais segura, criteriosa e alinhada à responsabilidade da prática.",
    },
    {
      icon: <Award className="w-5 h-5 text-rose-400" />,
      title: "Supervisão Individual",
      before: "Estudar sozinho, sem correção prática e sem análise dos próprios protocolos.",
      after: "120 horas de supervisão individualizada com 12 protocolos acompanhados.",
    },
    {
      icon: <BadgeCheck className="w-5 h-5 text-teal-400" />,
      title: "Atuação com Método",
      before: "Ter interesse na área, mas sem um caminho claro para desenvolver competência.",
      after: "Formação prática, presencial e orientada para ampliar a atuação com responsabilidade.",
    },
  ];

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 90, damping: 14 },
    },
  };

  return (
    <section
      id="solucao"
      className="relative py-24 bg-slate-950 text-white overflow-hidden border-t border-white/5"
    >
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-neuro-blue/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            A Solução NeuroPsiEdu
          </span>

          <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-white leading-tight">
            Uma formação prática para transformar insegurança em método técnico
          </h2>

          <p className="text-slate-400 font-light text-base sm:text-lg">
            A proposta é conduzir você por uma jornada estruturada, combinando
            fundamentos, instrumentos, legislação e supervisão individual para
            desenvolver segurança na avaliação psicológica para manuseio de arma
            de fogo.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {transformations.map((item) => (
            <motion.div
              key={item.title}
              variants={cardVariants}
              className="glass-dark hover:bg-slate-900/50 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>

                  <h3 className="font-display font-bold text-sm text-slate-200 group-hover:text-white transition-colors">
                    {item.title}
                  </h3>
                </div>

                <div className="space-y-3 pt-2 text-xs">
                  <div className="bg-red-500/5 border border-red-500/10 p-3 rounded-lg">
                    <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider mb-1">
                      Antes da formação
                    </p>
                    <p className="text-slate-400 leading-relaxed font-light">
                      {item.before}
                    </p>
                  </div>

                  <div className="flex justify-center my-1 text-slate-600">
                    <ArrowRightLeft className="w-3.5 h-3.5 rotate-90 md:rotate-0" />
                  </div>

                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-lg">
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-1">
                      Depois da formação
                    </p>
                    <p className="text-slate-300 leading-relaxed font-medium">
                      {item.after}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
