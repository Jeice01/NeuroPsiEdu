"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRightLeft, ShieldCheck, Cpu, GitBranch, PenTool, Layout, Award, Eye, Scale } from "lucide-react";

export function FnpTransformation() {
  const transformations = [
    {
      icon: <Cpu className="w-5 h-5 text-neuro-orange" />,
      title: "Análise Clínica Integral",
      before: "Aplicar testes isolados sem enxergar a dinâmica global do sujeito.",
      after: "Mapeamento sistemático de forças e fraquezas cognitivo-comportamentais.",
    },
    {
      icon: <GitBranch className="w-5 h-5 text-cyan-400" />,
      title: "Raciocínio Diferencial",
      before: "Incerteza para discriminar comorbidades ou sintomas comuns às diversas condições.",
      after: "Habilidade de traçar hipóteses diagnósticas claras e refutáveis.",
    },
    {
      icon: <Scale className="w-5 h-5 text-violet-400" />,
      title: "Interpretação Avançada",
      before: "Depender cegamente de pontuações de tabelas dos manuais.",
      after: "Leitura qualitativa apurada integrando história de vida e comportamento.",
    },
    {
      icon: <Eye className="w-5 h-5 text-emerald-400" />,
      title: "Clareza Diagnóstica",
      before: "Conclusões vagas que não ajudam no tratamento prático.",
      after: "Direcionamento terapêutico preciso e intervenções assertivas.",
    },
    {
      icon: <Layout className="w-5 h-5 text-amber-400" />,
      title: "Organização Lógica",
      before: "Ficar perdido em pilhas de anotações, sem saber por onde começar.",
      after: "Protocolo estruturado desde a primeira entrevista até a devolutiva.",
    },
    {
      icon: <PenTool className="w-5 h-5 text-pink-400" />,
      title: "Segurança em Laudos",
      before: "Medo crônico de errar na redação ou sofrer contestações técnicas.",
      after: "Laudos técnicos estruturados, fluidos e redigidos com confiança.",
    },
    {
      icon: <Award className="w-5 h-5 text-rose-400" />,
      title: "Autoridade Profissional",
      before: "Hesitar ao dialogar com médicos, psiquiatras e escolas.",
      after: "Posicionamento seguro baseado em evidências clínicas.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-teal-400" />,
      title: "Visão Ecológica",
      before: "Reduzir o paciente a números e gráficos descontextualizados.",
      after: "Compreensão funcional do paciente em seu ambiente real.",
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
    <section className="relative py-24 bg-slate-950 text-white overflow-hidden border-t border-white/5">
      {/* Background Lights */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-neuro-blue/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Transforme o seu conhecimento</span>
          <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-white leading-tight">
            A Evolução da sua Atuação Profissional
          </h2>
          <p className="text-slate-400 font-light text-base sm:text-lg">
            Muito mais do que teoria: nosso método consolida um novo patamar de excelência para a sua prática diária.
          </p>
        </div>

        {/* 8 Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {transformations.map((trans, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="glass-dark hover:bg-slate-900/50 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header card: Icon + Title */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {trans.icon}
                  </div>
                  <h3 className="font-display font-bold text-sm text-slate-200 group-hover:text-white transition-colors">
                    {trans.title}
                  </h3>
                </div>

                {/* Before / After Layout */}
                <div className="space-y-3 pt-2 text-xs">
                  <div className="bg-red-500/5 border border-red-500/10 p-3 rounded-lg">
                    <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider mb-1">Como costuma ser</p>
                    <p className="text-slate-400 leading-relaxed font-light">{trans.before}</p>
                  </div>
                  
                  <div className="flex justify-center my-1 text-slate-600">
                    <ArrowRightLeft className="w-3.5 h-3.5 rotate-90 md:rotate-0" />
                  </div>

                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-lg">
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-1">Com o Método FANP</p>
                    <p className="text-slate-300 leading-relaxed font-medium">{trans.after}</p>
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
