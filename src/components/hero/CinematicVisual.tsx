"use client";

import { motion } from "framer-motion";
import { Activity, LineChart, Sparkles, Network, TrendingUp } from "lucide-react";

export function CinematicVisual() {
  return (
    <div className="relative w-full h-[450px] md:h-[550px] lg:h-[750px] flex items-center justify-center lg:justify-end z-0 mt-8 lg:mt-0 lg:ml-20 perspective-[2000px]">
      {/* Background Glow Effects - Pure and Clean */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-neuro-blue/5 glow-effect blur-[120px] rounded-full mix-blend-multiply opacity-30" />
      
      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] md:w-[550px] md:h-[550px] flex items-center justify-center"
      >
        {/* Central Brain Visual - Optimized Size to avoid cutting */}
        <div 
          className="relative z-10 w-[160px] h-[160px] sm:w-[220px] sm:h-[220px] md:w-[380px] md:h-[380px]"
          style={{ 
            WebkitMaskImage: 'radial-gradient(circle, black 70%, transparent 100%)',
            maskImage: 'radial-gradient(circle, black 70%, transparent 100%)'
          }}
        >
          <img
            src="/images/brain-3d.png"
            alt="Neuropsicologia 3D"
            className="absolute inset-0 w-full h-full object-contain animate-float mix-blend-multiply"
          />
        </div>

        {/* Floating Card 1: Funções Executivas (Top Left) */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-6 md:-left-16 top-0 md:top-4 z-20"
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-2.5 md:p-4 flex items-center gap-3 md:gap-4 w-36 md:w-48 shadow-[0_15px_35px_rgba(0,0,0,0.05)] border border-slate-100">
            <div className="w-8 h-8 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-neuro-blue/5 flex items-center justify-center border border-neuro-blue/10">
              <Network className="w-4 h-4 md:w-6 md:h-6 text-neuro-blue" />
            </div>
            <div>
              <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-tight">Funções Executivas</p>
            </div>
          </div>
        </motion.div>

        {/* Floating Card 2: Atenção (Top Right) */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute -right-6 md:-right-12 top-4 md:top-12 z-20"
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-2.5 md:p-4 flex items-center gap-3 md:gap-4 w-32 md:w-44 shadow-[0_15px_35px_rgba(0,0,0,0.05)] border border-slate-100">
            <div className="w-8 h-8 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-neuro-cyan/5 flex items-center justify-center border border-neuro-cyan/10">
              <Activity className="w-4 h-4 md:w-6 md:h-6 text-neuro-cyan" />
            </div>
            <div>
              <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Atenção</p>
            </div>
          </div>
        </motion.div>

        {/* Floating Card 3: Memória (Middle Left) */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -left-8 md:-left-20 top-36 md:top-56 z-20"
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-2.5 md:p-4 flex items-center gap-3 md:gap-4 w-32 md:w-44 shadow-[0_15px_35px_rgba(0,0,0,0.05)] border border-slate-100">
            <div className="w-8 h-8 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-neuro-orange/5 flex items-center justify-center border border-neuro-orange/10">
              <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-neuro-orange" />
            </div>
            <div>
              <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider">Memória</p>
            </div>
          </div>
        </motion.div>

        {/* Floating Card 4: TEA (Middle Right) */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute -right-8 md:-right-24 top-40 md:top-64 z-20"
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-2.5 md:p-4 flex items-center gap-3 md:gap-4 w-28 md:w-36 shadow-[0_15px_35px_rgba(0,0,0,0.05)] border border-slate-100">
            <div className="w-8 h-8 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-neuro-cyan/5 flex items-center justify-center border border-neuro-cyan/10">
              <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-neuro-cyan" />
            </div>
            <div>
              <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider">TEA</p>
            </div>
          </div>
        </motion.div>

        {/* Floating Card 5: TDAH (Bottom Right) */}
        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute right-0 md:-right-4 bottom-0 md:bottom-12 z-20"
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-2.5 md:p-4 flex items-center gap-3 md:gap-4 w-28 md:w-36 shadow-[0_15px_35px_rgba(0,0,0,0.05)] border border-slate-100">
            <div className="w-8 h-8 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-neuro-blue/5 flex items-center justify-center border border-neuro-blue/10">
              <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-neuro-blue" />
            </div>
            <div>
              <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider">TDAH</p>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
