"use client";

import { motion } from "framer-motion";
import {
  Scale,
  BadgeCheck,
  ClipboardList,
  Brain,
  FileText,
  Target,
} from "lucide-react";

export function ManuseioArmaLearn() {
  const contents = [
    {
      title: "Legislação e Normativas",
      description:
        "Compreensão dos critérios técnicos, responsabilidades éticas e normativas que orientam a atuação profissional.",
      icon: <Scale className="w-6 h-6 text-neuro-orange" />,
    },
    {
      title: "Credenciamento",
      description:
        "Orientações sobre requisitos, processos e aspectos relacionados ao exercício profissional na área.",
      icon: <BadgeCheck className="w-6 h-6 text-cyan-400" />,
    },
    {
      title: "Teste Palográfico",
      description:
        "Aplicação, análise e interpretação de 10 protocolos do Teste Palográfico na avaliação da personalidade.",
      icon: <ClipboardList className="w-6 h-6 text-violet-400" />,
    },
    {
      title: "Pfister",
      description:
        "Análise e leitura de indicadores de forças e fraquezas na regulação das emoções com a entrega de 10 protocolos do Teste Pirâmides Coloridas de Pfister.",
      icon: <Brain className="w-6 h-6 text-pink-400" />,
    },
    {
      title: "IFP",
      description:
        "Utilização de instrumento complementar da avaliação de traços de personalidade por meio de autorrelato.",
      icon: <FileText className="w-6 h-6 text-emerald-400" />,
    },
    {
      title: "BPA",
      description:
        "Avaliação do desempenho atencional dos candidatos ao Manuseio de Arma de Fogo.",
      icon: <Target className="w-6 h-6 text-amber-400" />,
    },
    {
      title: "BETA III",
      description:
        "Avaliação da eficiência da inteligência não verbal e velocidade de processamento mental.",
      icon: <Brain className="w-6 h-6 text-rose-400" />,
    },
    {
      title: "TEPIC-M-2",
      description:
        "Avaliação das habilidades de memória visual dos candidatos.",
      icon: <ClipboardList className="w-6 h-6 text-sky-400" />,
    },
    {
      title: "FDT",
      description:
        "Avaliação das funções executivas de regulação do controle cognitivo dos candidatos.",
      icon: <Target className="w-6 h-6 text-teal-400" />,
    },
    {
      title: "BDEFS",
      description:
        "Avaliação da capacidade de gerenciamento executivo e regulação do comportamento e emoções.",
      icon: <FileText className="w-6 h-6 text-orange-400" />,
    },
    {
      title: "Integração dos Resultados",
      description:
        "Como reunir os dados dos instrumentos e sustentar tecnicamente a conclusão avaliativa.",
      icon: <BadgeCheck className="w-6 h-6 text-neuro-orange" />,
    },
  ];

  return (
    <section
      id="conteudo"
      className="relative py-24 bg-[#fdfdfd] text-[#1c4568] overflow-hidden"
    >
      <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-slate-100 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Conteúdo da Formação
          </span>

          <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight text-neuro-blue leading-tight">
            O que você vai aprender
          </h2>

          <p className="text-slate-600 font-light text-base sm:text-lg">
            Um percurso estruturado para compreender os instrumentos, os
            critérios técnicos e o raciocínio necessário para atuar com mais
            segurança na avaliação psicológica para manuseio de arma de fogo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contents.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              viewport={{ once: true }}
              className="bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-5">
                {item.icon}
              </div>

              <h3 className="font-bold text-lg text-neuro-blue mb-3">
                {item.title}
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
