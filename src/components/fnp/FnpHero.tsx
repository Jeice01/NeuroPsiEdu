"use client";

import { motion, Variants } from "framer-motion";
import { ArrowRight, Calendar, MapPin, Users, Award } from "lucide-react";
import { useLeadModal } from "./FnpLeadContext";

export function FnpHero() {
  const { openModal } = useLeadModal();
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column - Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-left space-y-8 flex flex-col justify-center"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-flex self-start">
              <span className="relative flex h-3 w-3 mr-3 mt-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neuro-orange opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-neuro-orange"></span>
              </span>
              <span className="glass-dark px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-orange-400 border border-orange-500/20 uppercase">
                Inscrições Abertas · 8ª Turma FANP
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
              <button
                onClick={() => openModal("hero-cta")}
                className="group relative px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-neuro-orange to-orange-600 hover:from-orange-500 hover:to-orange-700 transition-all duration-300 shadow-[0_0_30px_rgba(242,140,40,0.3)] hover:shadow-[0_0_40px_rgba(242,140,40,0.5)] text-center flex items-center justify-center gap-3"
              >
                <span>Quero garantir minha vaga</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
              <a
                href="#modulos"
                className="px-8 py-4 rounded-xl text-base font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 text-center"
              >
                Ver cronograma
              </a>
            </motion.div>
          </motion.div>

          {/* Right Column - Video embed */}
          <div className="flex items-center justify-center min-h-[400px] lg:min-h-[500px] px-4 lg:px-0">
            <div className="w-full max-w-[720px]">
              <div className="relative w-full aspect-video rounded-2xl shadow-2xl border border-orange-500/20 ring-1 ring-orange-400/10 overflow-hidden bg-slate-950">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/ApwOzxMUqvE"
                  title="Vídeo explicativo NeuroPsiEdu FNP"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
