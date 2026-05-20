"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Activity, Sparkles, Network, TrendingUp, Brain, Award, Star, BookOpen, TrendingDown } from "lucide-react";

export function CinematicVisual() {
  const brainControls = useAnimation();

  useEffect(() => {
    brainControls.set({ opacity: 0, scale: 0.9 });
    brainControls.start({ opacity: 1, scale: 1, transition: { duration: 1.5, ease: "easeOut" } });
  }, [brainControls]);

  return (
    <div className="relative w-full z-0 mt-8 lg:mt-0 lg:ml-0 xl:ml-10 2xl:ml-20">

      {/* ── MOBILE LAYOUT (< sm) ─────────────────────────────── */}
      <div className="sm:hidden flex flex-col items-center gap-5 py-6">
        {/* Brain */}
        <motion.div animate={brainControls}>
          <div
            className="relative w-[160px] h-[160px] xs:w-[200px] xs:h-[200px]"
            style={{
              WebkitMaskImage: "radial-gradient(circle, black 70%, transparent 100%)",
              maskImage: "radial-gradient(circle, black 70%, transparent 100%)",
            }}
          >
            <img
              src="/images/brain-3d.png"
              alt="Neuropsicologia 3D"
              className="absolute inset-0 w-full h-full object-contain animate-float mix-blend-multiply"
            />
          </div>
        </motion.div>

        {/* Cards grid — 2 columns */}
        <div className="grid grid-cols-2 gap-2.5 w-full max-w-xs xs:max-w-sm mx-auto px-2">
          {/* TDAH */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            className="bg-white/95 backdrop-blur-xl rounded-2xl p-2.5 flex items-center gap-2 shadow-[0_0_20px_rgba(28,69,104,0.25)] border-[1.5px] border-neuro-blue"
          >
            <div className="w-8 h-8 rounded-lg bg-neuro-blue/10 flex-shrink-0 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-neuro-blue" />
            </div>
            <p className="text-[9px] font-black text-neuro-blue uppercase tracking-wider">TDAH</p>
          </motion.div>

          {/* TEA */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
            className="bg-white/95 backdrop-blur-xl rounded-2xl p-2.5 flex items-center gap-2 shadow-[0_0_20px_rgba(66,182,165,0.35)] border-[1.5px] border-neuro-cyan"
          >
            <div className="w-8 h-8 rounded-lg bg-neuro-cyan/10 flex-shrink-0 flex items-center justify-center">
              <Star className="w-4 h-4 text-neuro-cyan fill-neuro-cyan" />
            </div>
            <p className="text-[9px] font-black text-neuro-cyan uppercase tracking-wider">TEA</p>
          </motion.div>

          {/* Deficiência Intelectual */}
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="bg-white/95 backdrop-blur-xl rounded-2xl p-2.5 flex items-center gap-2 shadow-sm border border-slate-100"
          >
            <div className="w-7 h-7 rounded-lg bg-neuro-cyan/5 flex-shrink-0 flex items-center justify-center border border-neuro-cyan/10">
              <Brain className="w-3.5 h-3.5 text-neuro-cyan" />
            </div>
            <p className="text-[7px] font-bold text-slate-400 uppercase tracking-wider leading-tight">Def. Intelectual</p>
          </motion.div>

          {/* Altas Habilidades */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            className="bg-white/95 backdrop-blur-xl rounded-2xl p-2.5 flex items-center gap-2 shadow-sm border border-slate-100"
          >
            <div className="w-7 h-7 rounded-lg bg-neuro-orange/5 flex-shrink-0 flex items-center justify-center border border-neuro-orange/10">
              <Award className="w-3.5 h-3.5 text-neuro-orange" />
            </div>
            <p className="text-[7px] font-bold text-slate-400 uppercase tracking-wider leading-tight">Altas Habilidades</p>
          </motion.div>

          {/* Dificuldade de Aprendizagem */}
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2.0 }}
            className="bg-white/95 backdrop-blur-xl rounded-2xl p-2.5 flex items-center gap-2 shadow-sm border border-slate-100"
          >
            <div className="w-7 h-7 rounded-lg bg-neuro-orange/5 flex-shrink-0 flex items-center justify-center border border-neuro-orange/10">
              <Sparkles className="w-3.5 h-3.5 text-neuro-orange" />
            </div>
            <p className="text-[7px] font-bold text-slate-400 uppercase tracking-wider leading-tight">Dif. Aprendizagem</p>
          </motion.div>

          {/* Dislexia */}
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2.6 }}
            className="bg-white/95 backdrop-blur-xl rounded-2xl p-2.5 flex items-center gap-2 shadow-sm border border-slate-100"
          >
            <div className="w-7 h-7 rounded-lg bg-neuro-cyan/5 flex-shrink-0 flex items-center justify-center border border-neuro-cyan/10">
              <BookOpen className="w-3.5 h-3.5 text-neuro-cyan" />
            </div>
            <p className="text-[7px] font-bold text-slate-400 uppercase tracking-wider">Dislexia</p>
          </motion.div>
        </div>
      </div>

      {/* ── DESKTOP LAYOUT (>= sm) ───────────────────────────── */}
      <div className="hidden sm:flex relative h-[450px] md:h-[550px] lg:h-[650px] xl:h-[750px] items-center justify-center lg:justify-center xl:justify-end perspective-[2000px]">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-neuro-blue/5 glow-effect blur-[120px] rounded-full mix-blend-multiply opacity-30" />

        {/* Main Container */}
        <motion.div
          animate={brainControls}
          className="relative w-[350px] h-[350px] md:w-[500px] md:h-[500px] lg:w-[460px] lg:h-[460px] xl:w-[550px] xl:h-[550px] flex items-center justify-center"
        >
          {/* Central Brain Visual */}
          <div
            className="relative z-10 w-[220px] h-[220px] md:w-[340px] md:h-[340px] lg:w-[280px] lg:h-[280px] xl:w-[380px] xl:h-[380px]"
            style={{
              WebkitMaskImage: "radial-gradient(circle, black 70%, transparent 100%)",
              maskImage: "radial-gradient(circle, black 70%, transparent 100%)",
            }}
          >
            <img
              src="/images/brain-3d.png"
              alt="Neuropsicologia 3D"
              className="absolute inset-0 w-full h-full object-contain animate-float mix-blend-multiply"
            />
          </div>

          {/* Floating Card 1: TDAH (Top Left) */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            className="absolute -left-10 md:-left-20 lg:-left-10 xl:-left-20 top-4 md:top-12 z-30 scale-105 md:scale-110 lg:scale-95 xl:scale-110"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-3 md:p-4 flex items-center gap-3 w-32 md:w-40 shadow-[0_0_25px_rgba(28,69,104,0.3)] border-[1.5px] border-neuro-blue">
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg bg-neuro-blue/10 flex-shrink-0 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-neuro-blue" />
              </div>
              <p className="text-[9px] md:text-[11px] font-black text-neuro-blue uppercase tracking-wider">TDAH</p>
            </div>
          </motion.div>

          {/* Floating Card 2: Deficiência Intelectual (Top Center-Left) */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute left-8 md:left-12 -top-8 md:-top-12 z-20"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-2.5 md:p-3 flex items-center gap-3 w-40 md:w-48 shadow-[0_15px_35px_rgba(0,0,0,0.05)] border border-slate-100">
              <div className="w-7 h-7 md:w-10 md:h-10 rounded-lg bg-neuro-cyan/5 flex-shrink-0 flex items-center justify-center border border-neuro-cyan/10">
                <Brain className="w-3.5 h-3.5 md:w-5 md:h-5 text-neuro-cyan" />
              </div>
              <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-tight">Deficiência Intelectual</p>
            </div>
          </motion.div>

          {/* Floating Card 3: Altas Habilidades (Top Center-Right) */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            className="absolute right-16 md:right-16 lg:right-8 xl:right-16 -top-4 md:-top-8 z-20 lg:scale-95 xl:scale-100"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-2.5 md:p-3 flex items-center gap-3 w-36 md:w-44 shadow-[0_15px_35px_rgba(0,0,0,0.05)] border border-slate-100">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-neuro-orange/5 flex-shrink-0 flex items-center justify-center border border-neuro-orange/10">
                <Award className="w-4 h-4 md:w-5 md:h-5 text-neuro-orange" />
              </div>
              <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-tight">Altas Habilidades</p>
            </div>
          </motion.div>

          {/* Floating Card 4: TEA (Top Right) */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
            className="absolute -right-10 md:-right-20 lg:-right-10 xl:-right-20 top-4 md:top-12 z-30 scale-105 md:scale-110 lg:scale-95 xl:scale-110"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-3 md:p-4 flex items-center gap-3 w-32 md:w-40 shadow-[0_0_25px_rgba(66,182,165,0.4)] border-[1.5px] border-neuro-cyan">
              <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg bg-neuro-cyan/10 flex-shrink-0 flex items-center justify-center">
                <Star className="w-4 h-4 md:w-6 md:h-6 text-neuro-cyan fill-neuro-cyan" />
              </div>
              <p className="text-[9px] md:text-[11px] font-black text-neuro-cyan uppercase tracking-wider">TEA</p>
            </div>
          </motion.div>

          {/* Floating Card 5: Funções Executivas (Middle Left) */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
            className="absolute -left-8 md:-left-20 lg:-left-12 xl:-left-20 top-36 md:top-48 z-20 lg:scale-95 xl:scale-100"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-2.5 md:p-3 flex items-center gap-3 w-36 md:w-44 shadow-[0_15px_35px_rgba(0,0,0,0.05)] border border-slate-100">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-neuro-blue/5 flex-shrink-0 flex items-center justify-center border border-neuro-blue/10">
                <Network className="w-4 h-4 md:w-5 md:h-5 text-neuro-blue" />
              </div>
              <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-tight">Funções Executivas</p>
            </div>
          </motion.div>

          {/* Floating Card 6: Atenção (Middle Right) */}
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut", delay: 1.7 }}
            className="absolute -right-6 md:-right-16 lg:-right-8 xl:-right-16 top-36 md:top-48 z-20 lg:scale-95 xl:scale-100"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-2.5 md:p-3 flex items-center gap-3 w-32 md:w-36 shadow-[0_15px_35px_rgba(0,0,0,0.05)] border border-slate-100">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-neuro-blue/5 flex-shrink-0 flex items-center justify-center border border-neuro-blue/10">
                <Activity className="w-4 h-4 md:w-5 md:h-5 text-neuro-blue" />
              </div>
              <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-wider">Atenção</p>
            </div>
          </motion.div>

          {/* Floating Card 7: Dificuldade de Aprendizagem (Bottom Left) */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 2.0 }}
            className="absolute left-0 md:-left-8 lg:left-0 xl:-left-8 bottom-12 md:bottom-20 z-20 lg:scale-90 xl:scale-100"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-2.5 md:p-3 flex items-center gap-3 w-40 md:w-48 shadow-[0_15px_35px_rgba(0,0,0,0.05)] border border-slate-100">
              <div className="w-7 h-7 md:w-10 md:h-10 rounded-lg bg-neuro-orange/5 flex-shrink-0 flex items-center justify-center border border-neuro-orange/10">
                <Sparkles className="w-3.5 h-3.5 md:w-5 md:h-5 text-neuro-orange" />
              </div>
              <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-tight">Dificuldade de Aprendizagem</p>
            </div>
          </motion.div>

          {/* Floating Card 8: Rebaixamento Cognitivo (Bottom Center) */}
          <motion.div
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 2.3 }}
            className="absolute left-1/2 -translate-x-1/2 -bottom-4 md:-bottom-8 z-20"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-2.5 md:p-3 flex items-center gap-3 w-40 md:w-48 shadow-[0_15px_35px_rgba(0,0,0,0.05)] border border-slate-100">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-slate-100 flex-shrink-0 flex items-center justify-center border border-slate-200">
                <TrendingDown className="w-4 h-4 md:w-5 md:h-5 text-slate-500" />
              </div>
              <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-tight">Rebaixamento Cognitivo</p>
            </div>
          </motion.div>

          {/* Floating Card 9: Dislexia (Bottom Right) */}
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2.6 }}
            className="absolute right-0 md:-right-12 lg:right-0 xl:-right-12 bottom-8 md:bottom-16 z-20 lg:scale-90 xl:scale-100"
          >
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-2.5 md:p-3 flex items-center gap-3 w-32 md:w-36 shadow-[0_15px_35px_rgba(0,0,0,0.05)] border border-slate-100">
              <div className="w-7 h-7 md:w-10 md:h-10 rounded-lg bg-neuro-cyan/5 flex-shrink-0 flex items-center justify-center border border-neuro-cyan/10">
                <BookOpen className="w-3.5 h-3.5 md:w-5 md:h-5 text-neuro-cyan" />
              </div>
              <p className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-wider">Dislexia</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

    </div>
  );
}
