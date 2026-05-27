"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, Calendar, MapPin, Users, Award } from "lucide-react";

export function FnpHero() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  const orbitVariants: Variants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 35,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  const reverseOrbitVariants: Variants = {
    animate: {
      rotate: -360,
      transition: {
        duration: 45,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  return (
    <section className="relative min-h-[92vh] flex items-center pt-32 pb-20 bg-slate-950 text-white overflow-hidden">
      
      {/* Cinematic Ambient Lighting (Radial Glows) */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-neuro-blue/30 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Tech Grid Mask */}
      <div className="absolute inset-0 hero-grid-bg opacity-[0.05] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column - Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 text-left space-y-8 flex flex-col justify-center"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-flex self-start">
              <span className="relative flex h-3 w-3 mr-3 mt-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neuro-orange opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-neuro-orange"></span>
              </span>
              <span className="glass-dark px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-orange-400 border border-orange-500/20 uppercase">
                Inscrições Abertas · 8ª Turma ANP
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="font-display font-black text-4xl sm:text-5xl xl:text-6xl tracking-tight text-white leading-[1.1]"
            >
              Eleve sua prática em{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-neuro-orange via-orange-400 to-amber-300">
                Avaliação Clínica e Neuropsicológica.
              </span>
            </motion.h1>

            {/* Support Text */}
            <motion.p
              variants={itemVariants}
              className="text-slate-300 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl font-light"
            >
              A NeuroPsiEdu não nasce de uma proposta apenas teórica. A formação é construída a partir da realidade da clínica, das dúvidas que aparecem no processo avaliativo e das dificuldades que psicólogos enfrentam ao conduzir avaliações neuropsicológicas.
            </motion.p>

            {/* Info Pills Grid */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-2 sm:flex sm:flex-wrap gap-4 text-sm"
            >
              <div className="flex items-center gap-2.5 glass-dark px-4 py-3 rounded-xl border border-white/5">
                <MapPin className="w-4 h-4 text-neuro-orange" />
                <span className="text-slate-200">Presencial / BSB</span>
              </div>
              <div className="flex items-center gap-2.5 glass-dark px-4 py-3 rounded-xl border border-white/5">
                <Calendar className="w-4 h-4 text-neuro-orange" />
                <span className="text-slate-200">7 Módulos</span>
              </div>
              <div className="flex items-center gap-2.5 glass-dark px-4 py-3 rounded-xl border border-white/5">
                <Users className="w-4 h-4 text-neuro-orange" />
                <span className="text-slate-200">Vagas Limitadas</span>
              </div>
              <div className="flex items-center gap-2.5 glass-dark px-4 py-3 rounded-xl border border-white/5">
                <Award className="w-4 h-4 text-neuro-orange" />
                <span className="text-slate-200">Certificado Premium</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4"
            >
              <a
                href="#investimento"
                className="group relative px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-neuro-orange to-orange-600 hover:from-orange-500 hover:to-orange-700 transition-all duration-300 shadow-[0_0_30px_rgba(242,140,40,0.3)] hover:shadow-[0_0_40px_rgba(242,140,40,0.5)] text-center flex items-center justify-center gap-3"
              >
                <span>Quero garantir minha vaga</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="#modulos"
                className="px-8 py-4 rounded-xl text-base font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 text-center"
              >
                Ver cronograma
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column - Visual representation */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[400px] lg:min-h-[500px]">
            <div className="relative w-full max-w-[420px] aspect-square flex items-center justify-center">
              
              {/* Outer Orbit Ring */}
              <motion.div
                variants={orbitVariants}
                animate="animate"
                className="absolute inset-0 rounded-full border border-dashed border-slate-700/40 pointer-events-none"
              />

              {/* Inner Orbit Ring */}
              <motion.div
                variants={reverseOrbitVariants}
                animate="animate"
                className="absolute inset-8 rounded-full border border-slate-800/60 pointer-events-none"
              />

              {/* Cognitive node points on orbits */}
              <div className="absolute top-[10%] left-[20%] w-3 h-3 rounded-full bg-neuro-orange blur-[2px] animate-pulse" />
              <div className="absolute bottom-[15%] right-[25%] w-2 h-2 rounded-full bg-cyan-400 blur-[1px] animate-pulse" />
              <div className="absolute top-[60%] right-[5%] w-2 h-2 rounded-full bg-violet-400 blur-[1px] animate-pulse" />

              {/* Main Brain Image Container */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 1.5 }}
                className="relative z-10 w-[80%] aspect-square flex items-center justify-center animate-float-slow"
              >
                {/* Glow behind the brain */}
                <div className="absolute w-[60%] h-[60%] bg-neuro-blue/40 rounded-full blur-[70px] -z-10 pointer-events-none animate-pulse-glow" />
                <img
                  src="/images/brain-3d.png"
                  alt="Modelo Cognitivo 3D"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(28,69,104,0.3)] select-none pointer-events-none"
                />
              </motion.div>

              {/* Interactive Floating Micro-Card 1 */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="absolute bottom-8 -left-6 z-20 glass-dark p-3 rounded-xl border border-white/10 shadow-2xl flex items-center gap-3 animate-float-slow"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <span className="text-orange-400 text-xs font-bold">QA</span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Análise de Casos</p>
                  <p className="text-xs text-white font-bold">Discussões Clínicas</p>
                </div>
              </motion.div>

              {/* Interactive Floating Micro-Card 2 */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="absolute top-12 -right-4 z-20 glass-dark p-3 rounded-xl border border-white/10 shadow-2xl flex items-center gap-3 animate-float-slower"
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <span className="text-cyan-400 text-xs font-bold">100%</span>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Abordagem Prática</p>
                  <p className="text-xs text-white font-bold">Supervisão de Testes</p>
                </div>
              </motion.div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
