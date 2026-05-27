"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function FnpDifferential() {
  const roadmapStages = [
    {
      step: "01",
      title: "Fundamentação Sólida",
      desc: "Alinhamento das bases neuropsicológicas e psicopatológicas fundamentais para a clínica.",
    },
    {
      step: "02",
      title: "Entrevista & Raciocínio",
      desc: "Primeiro contato, anamnese dirigida e construção de hipóteses diagnósticas iniciais.",
    },
    {
      step: "03",
      title: "Seleção da Bateria",
      desc: "Planejamento da bateria de testes, baseada nas hipóteses levantadas.",
    },
    {
      step: "04",
      title: "Aplicação & Prática",
      desc: "Entendimento prático dos testes (cognitivos, inteligência, personalidade e outros) de forma segura.",
    },
    {
      step: "05",
      title: "Análise Qualitativa x Quantitativa",
      desc: "Integração das pontuações quantitativas com o comportamento e contexto ecológico do paciente.",
    },
    {
      step: "06",
      title: "Elaboração do Laudo",
      desc: "Redação clara, estruturada de forma lógica e que ofereça resposta assertiva ao paciente.",
    },
    {
      step: "07",
      title: "Devolutiva",
      desc: "Comunicação assertiva dos achados diagnósticos e estruturação do plano de intervenção e encaminhamentos.",
    },
  ];

  return (
    <section id="diferencial" className="relative py-24 bg-slate-950 text-white overflow-hidden border-t border-white/5">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neuro-blue/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Timeline Title */}
        <div className="text-center mb-16 space-y-2">
          <Sparkles className="w-6 h-6 text-neuro-orange mx-auto animate-pulse" />
          <h3 className="font-display font-bold text-2xl text-white">A Trilha do Desenvolvimento Clínico</h3>
          <p className="text-slate-400 text-sm font-light">As 7 fases integradas do método que transformam sua atuação</p>
        </div>

        {/* Timeline Roadmap */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical central line (Desktop) */}
          <div className="absolute left-[39px] sm:left-1/2 sm:-translate-x-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-neuro-orange via-neuro-blue to-slate-800 pointer-events-none" />

          <div className="space-y-12">
            {roadmapStages.map((stage, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className={`relative flex flex-col sm:flex-row items-start ${
                  idx % 2 === 0 ? "sm:flex-row-reverse" : ""
                }`}
              >
                {/* Connector Node */}
                <div className="absolute left-[24px] sm:left-1/2 sm:-translate-x-1/2 top-1.5 w-8 h-8 rounded-full bg-slate-950 border-2 border-neuro-orange flex items-center justify-center z-20 shadow-[0_0_10px_rgba(242,140,40,0.5)]">
                  <span className="text-[10px] font-bold text-neuro-orange">{stage.step}</span>
                </div>

                {/* Content Card */}
                <div className={`w-full sm:w-[45%] pl-16 sm:pl-0 ${
                  idx % 2 === 0 ? "sm:pr-12 text-left sm:text-right" : "sm:pl-12 text-left"
                }`}>
                  <div className="glass-dark p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-xl">
                    <h4 className="font-display font-bold text-base text-white mb-2">{stage.title}</h4>
                    <p className="text-slate-400 text-xs leading-relaxed font-light">{stage.desc}</p>
                  </div>
                </div>

                {/* Empty Spacer Column for Desktop alignment */}
                <div className="hidden sm:block w-[45%]" />
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
