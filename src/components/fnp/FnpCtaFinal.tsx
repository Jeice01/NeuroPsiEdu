"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { useLeadModal } from "./FnpLeadContext";

export function FnpCtaFinal() {
  const { openModal } = useLeadModal();
  return (
    <section className="relative py-28 bg-gradient-to-b from-slate-950 via-[#0b1d31] to-slate-950 text-white overflow-hidden border-t border-white/5">
      
      {/* High-intensity cognitive glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-neuro-blue/25 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute -bottom-10 left-1/4 w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Floating particles background decoration (simple CSS orbits/dots) */}
      <div className="absolute top-1/4 left-10 w-2 h-2 rounded-full bg-neuro-orange blur-[1px] animate-bounce" />
      <div className="absolute bottom-1/4 right-10 w-1.5 h-1.5 rounded-full bg-cyan-400 blur-[1px] animate-pulse" />
      <div className="absolute top-[80%] left-[30%] w-2 h-2 rounded-full bg-violet-400 blur-[2px] animate-ping" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10 text-center space-y-10">
        
        {/* Decorative Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 glass-dark px-4 py-2 rounded-full border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider mx-auto"
        >
          <Sparkles className="w-4 h-4 text-neuro-orange animate-spin" style={{ animationDuration: '4s' }} />
          Oportunidade Única de Transição de Carreira
        </motion.div>

        {/* Emotional Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-display font-black text-3xl sm:text-5xl xl:text-6xl tracking-tight text-white leading-tight max-w-4xl mx-auto"
        >
          Eleve sua prática em Avaliação Neuropsicológica com segurança técnica, análise clínica e{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-neuro-orange via-orange-400 to-amber-300">
            raciocínio diferencial
          </span>
        </motion.h2>

        {/* Descriptive Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-slate-300 text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-3xl mx-auto"
        >
          Vá além da aplicação mecânica de instrumentos e desenvolva uma atuação mais criteriosa, fundamentada e conectada às demandas reais da clínica — da análise do caso à construção de laudos neuropsicológicos bem fundamentados.
        </motion.p>

        {/* CTA Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center gap-4 pt-4"
        >
          <button
            onClick={() => openModal("cta-final")}
            className="group relative px-10 py-5 rounded-2xl text-base sm:text-lg font-bold text-white bg-gradient-to-r from-neuro-orange to-orange-600 hover:from-orange-500 hover:to-orange-700 transition-all duration-300 shadow-[0_0_40px_rgba(242,140,40,0.35)] hover:shadow-[0_0_50px_rgba(242,140,40,0.5)] flex items-center justify-center gap-3 w-full max-w-md mx-auto active:scale-[0.98]"
          >
            <span>Garantir Vaga na 8ª Turma FANP</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <div className="flex items-center gap-2 text-slate-400 text-xs justify-center pt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Matrícula segura · Início das aulas presenciais em 27 de Junho</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
