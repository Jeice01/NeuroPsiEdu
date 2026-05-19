"use client";

import { motion } from "framer-motion";
import { Stethoscope, GraduationCap, ArrowRight, BrainCircuit, HeartPulse } from "lucide-react";

export function DualEntryCards() {
  return (
    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 relative z-20">
      {/* Patient Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white/80 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgba(28,69,104,0.12)] rounded-[2rem] p-8 md:p-10 relative overflow-hidden group transition-all duration-500 hover:-translate-y-2"
      >
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <HeartPulse size={120} className="text-neuro-cyan" />
        </div>
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neuro-cyan/20 to-neuro-blue/20 flex items-center justify-center mb-6">
            <Stethoscope className="w-7 h-7 text-neuro-cyan" />
          </div>
          
          <h3 className="text-2xl font-display font-bold text-slate-900 mb-3">
            Quero Agendar Minha Avaliação
          </h3>
          
          <p className="text-slate-600 mb-8 flex-grow">
            Acolhimento humano e excelência científica para diagnósticos precisos. Avaliações completas para suporte emocional, cognitivo e clínico.
          </p>
          
          <div className="flex flex-wrap gap-2 mb-10">
            {["Acolhimento", "Diagnósticos", "Exames", "Confiança"].map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-slate-100/80 text-slate-500 group-hover:bg-neuro-cyan/10 group-hover:text-neuro-cyan-600 transition-colors">
                {tag}
              </span>
            ))}
          </div>
          
          <a
            href="#avaliacoes"
            className="flex items-center justify-between w-full p-4 rounded-2xl bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-neuro-cyan/30 hover:shadow-lg hover:shadow-neuro-cyan/5 transition-all duration-300 group/btn"
          >
            <span className="font-semibold text-slate-900 group-hover/btn:text-neuro-cyan transition-colors">Agendar Consulta</span>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 group-hover/btn:bg-neuro-cyan group-hover/btn:border-neuro-cyan group-hover/btn:text-white transition-all duration-300 group-hover/btn:scale-110">
              <ArrowRight className="w-5 h-5" />
            </div>
          </a>
        </div>
      </motion.div>

      {/* Professional Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-white/80 backdrop-blur-2xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_30px_60px_rgba(28,69,104,0.12)] rounded-[2rem] p-8 md:p-10 relative overflow-hidden group transition-all duration-500 hover:-translate-y-2"
      >
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <BrainCircuit size={120} className="text-neuro-lilac" />
        </div>
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neuro-lilac/20 to-neuro-blue/20 flex items-center justify-center mb-6">
            <GraduationCap className="w-7 h-7 text-neuro-lilac" />
          </div>
          
          <h3 className="text-2xl font-display font-bold text-slate-900 mb-3">
            Quero Me Capacitar
          </h3>
          
          <p className="text-slate-600 mb-8 flex-grow">
            Cursos, especializações e mentorias em neuropsicologia. Formação premium focada na prática clínica baseada em evidências.
          </p>
          
          <div className="flex flex-wrap gap-2 mb-10">
            {["Cursos", "Prática Clínica", "Mentoria", "Premium"].map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-slate-100/80 text-slate-500 group-hover:bg-neuro-blue/10 group-hover:text-neuro-blue transition-colors">
                {tag}
              </span>
            ))}
          </div>
          
          <a
            href="#cursos"
            className="flex items-center justify-between w-full p-4 rounded-2xl bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-neuro-blue/30 hover:shadow-lg hover:shadow-neuro-blue/5 transition-all duration-300 group/btn"
          >
            <span className="font-semibold text-slate-900 group-hover/btn:text-neuro-blue transition-colors">Conhecer Formação</span>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100 group-hover/btn:bg-neuro-blue group-hover/btn:border-neuro-blue group-hover/btn:text-white transition-all duration-300 group-hover/btn:scale-110">
              <ArrowRight className="w-5 h-5" />
            </div>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
