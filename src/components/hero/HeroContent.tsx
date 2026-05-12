"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CalendarHeart } from "lucide-react";

export function HeroContent() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl pt-12 md:pt-20 pb-4 md:pb-6 z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative group w-max mb-3"
      >
        {/* Subtle breathing glow */}
        <motion.div 
          className="absolute -inset-1 rounded-full blur-[12px] opacity-[0.12] group-hover:opacity-[0.2] transition-opacity duration-1000 pointer-events-none"
          animate={{ 
            background: [
              "radial-gradient(circle, #1c4568 0%, transparent 70%)", 
              "radial-gradient(circle, #F28C28 0%, transparent 70%)", 
              "radial-gradient(circle, #1c4568 0%, transparent 70%)"
            ] 
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Crystalline Badge Surface */}
        <div className="relative inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/30 backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_rgba(28,69,104,0.04)] group-hover:shadow-[0_12px_48px_rgba(28,69,104,0.08)] group-hover:-translate-y-[1.5px] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
          <motion.span 
            animate={{ 
              backgroundColor: ["#1c4568", "#F28C28", "#1c4568"],
              boxShadow: [
                "0 0 8px rgba(28,69,104,0.4)",
                "0 0 12px rgba(242,140,40,0.4)",
                "0 0 8px rgba(28,69,104,0.4)"
              ]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-1.5 w-1.5 rounded-full" 
          />
          <span className="text-[13px] font-black tracking-[0.25em] uppercase bg-gradient-to-r from-neuro-blue via-neuro-cyan to-neuro-orange bg-clip-text text-transparent animate-gradient leading-none">
            PADRÃO OURO EM NEUROPSICOLOGIA
          </span>
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-col font-display tracking-tight max-w-[90%] md:max-w-2xl"
      >
        <span className="text-[2.5rem] sm:text-6xl lg:text-[4.5rem] font-bold leading-[1.05] text-neuro-blue block">
          Excelência em
        </span>
        <span className="text-[2.5rem] sm:text-6xl lg:text-[4.5rem] font-bold leading-[1.05] text-[#42b6a5] block">
          Avaliação
        </span>
        <span className="text-[2.5rem] sm:text-6xl lg:text-[4.5rem] font-bold leading-[1.05] text-[#42b6a5] block">
          Neuropsicológica
        </span>
        <span className="text-[2.5rem] sm:text-6xl lg:text-[4.5rem] font-bold leading-[1.05] text-neuro-blue block">
          e Ensino
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-lg md:text-xl text-slate-500 leading-relaxed max-w-xl font-medium"
      >
        Avaliação neuropsicológica completa e formação profissional com abordagem científica, humana e moderna.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center gap-5 mt-10"
      >
        <a
          href="https://wa.me/5561982088284?text=Quero%20uma%20avalia%C3%A7%C3%A3o%2C%20pode%20me%20ajudar%3F"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex w-full sm:w-auto items-center justify-center gap-3 rounded-xl bg-neuro-blue px-10 py-4.5 text-[15px] font-bold text-white transition-all hover:bg-neuro-blue-dark shadow-[0_15px_30px_-5px_rgba(28,69,104,0.3)]"
        >
          <CalendarHeart className="w-5 h-5" />
          Agendar Avaliação
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </a>
        <a
          href="https://wa.me/5561982088284?text=Quero%20saber%20mais%20sobre%20os%20cursos%2C%20pode%20me%20ajudar%3F"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex w-full sm:w-auto items-center justify-center gap-3 rounded-xl bg-white px-10 py-4.5 text-[15px] font-bold text-neuro-blue border-2 border-slate-100 transition-all hover:border-neuro-blue/30 hover:bg-slate-50 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.02)]"
        >
          <BookOpen className="w-5 h-5" />
          Conhecer Cursos
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 opacity-40 group-hover:opacity-100" />
        </a>
      </motion.div>

    </div>
  );
}
