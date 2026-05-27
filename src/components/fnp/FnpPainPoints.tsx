"use client";

import { motion, Variants } from "framer-motion";
import { AlertCircle, HelpCircle, FileText, Compass, BookOpen, UserCheck } from "lucide-react";

export function FnpPainPoints() {
  const pains = [
    {
      icon: <AlertCircle className="w-6 h-6 text-neuro-orange" />,
      title: "Insegurança Clínica",
      description: "Sensação de estar 'pisando em ovos' no início da prática, com receio de cometer erros na condução da avaliação e na devolutiva ao paciente.",
    },
    {
      icon: <FileText className="w-6 h-6 text-neuro-orange" />,
      title: "Escrita de Laudos e Relatórios",
      description: "Dificuldade para estruturar o laudo, integrar os achados e traduzir dados técnicos em uma redação compreensível e clinicamente útil.",
    },
    {
      icon: <Compass className="w-6 h-6 text-neuro-orange" />,
      title: "Diagnósticos Diferenciais",
      description: "Na prática clínica, os casos não chegam prontos. É preciso desenvolver raciocínio diferencial para compreender sinais, levantar hipóteses e diferenciar transtornos com segurança técnica.",
    },
    {
      icon: <HelpCircle className="w-6 h-6 text-neuro-orange" />,
      title: "Transição Teoria para Prática",
      description: "Dominar os conceitos teóricos de neuropsicologia, mas hesitar na hora de selecionar a bateria de testes adequada para cada demanda.",
    },
    {
      icon: <BookOpen className="w-6 h-6 text-neuro-orange" />,
      title: "Estudo Solitário e Sem Direção",
      description: "Consumir cursos e formações, mas sentir falta de um método prático passo a passo e de discussão conjunta de casos clínicos reais.",
    },
    {
      icon: <UserCheck className="w-6 h-6 text-neuro-orange" />,
      title: "Ir Além do Escore Quantitativo",
      description: "Ficar preso apenas aos números da tabela de testes, sem conseguir interpretar o funcionamento cognitivo e qualitativo real do paciente.",
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
    <section className="relative py-24 bg-gradient-to-b from-slate-950 via-[#0a1e30] to-slate-950 text-white overflow-hidden">
      
      {/* Background glow overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-neuro-blue/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">O Desafio Clínico</span>
          <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-white leading-tight">
            Você se identifica com algum destes cenários no seu dia a dia profissional?
          </h2>
          <p className="text-slate-400 font-light text-base sm:text-lg">
            Muitos psicólogos concluem pós-graduações inteiras sabendo a teoria, mas sentem insegurança ao ficarem frente a frente com o paciente.
          </p>
        </div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {pains.map((pain, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="glass-dark hover:bg-slate-900/50 p-8 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 group flex flex-col justify-between h-full hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)]"
            >
              <div className="space-y-4">
                {/* Icon wrapper */}
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-neuro-orange/10 group-hover:border-neuro-orange/20 transition-all duration-300">
                  {pain.icon}
                </div>
                
                {/* Title */}
                <h3 className="font-display font-bold text-lg text-white group-hover:text-neuro-orange transition-colors">
                  {pain.title}
                </h3>
                
                {/* Description */}
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
