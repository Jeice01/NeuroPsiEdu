"use client";

import { motion, Variants } from "framer-motion";
import {
  ArrowRight,
  Award,
  Clock,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useManuseioArmaLead } from "./ManuseioArmaLeadContext";

export function ManuseioArmaHero() {
  const { openModal } = useManuseioArmaLead();

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

  return (
    <section className="relative min-h-[92vh] flex items-center pt-32 pb-20 bg-slate-950 text-white overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-neuro-blue/30 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 hero-grid-bg opacity-[0.05] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-left space-y-8 flex flex-col justify-center"
          >
            <motion.div variants={itemVariants} className="inline-flex self-start">
              <span className="relative flex h-3 w-3 mr-3 mt-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neuro-orange opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-neuro-orange" />
              </span>
              <span className="glass-dark px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-orange-400 border border-orange-500/20 uppercase">
                📍 Formação 100% Presencial em Brasília/DF
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-display font-black text-4xl sm:text-5xl xl:text-6xl tracking-tight text-white leading-[1.1]"
            >
              Desenvolva a Segurança Técnica Necessária para Atuar em{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-neuro-orange via-orange-400 to-amber-300">
                Avaliação Psicológica para Manuseio de Arma de Fogo
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-slate-300 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl font-light"
            >
              Aprenda com segurança técnica e domine a aplicação, correção,
              interpretação e escrita de resultados de instrumentos exigidos para o
              avaliação psicológica para Manuseio de Arma de Fogo.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm"
            >
              <div className="flex items-center gap-2.5 glass-dark px-4 py-3 rounded-xl border border-white/5">
                <Award className="w-4 h-4 text-neuro-orange" />
                <span className="text-slate-200">138 horas de formação</span>
              </div>

              <div className="flex items-center gap-2.5 glass-dark px-4 py-3 rounded-xl border border-white/5">
                <Users className="w-4 h-4 text-neuro-orange" />
                <span className="text-slate-200">Supervisão presencial individualizada</span>
              </div>

              <div className="flex items-center gap-2.5 glass-dark px-4 py-3 rounded-xl border border-white/5">
                <ShieldCheck className="w-4 h-4 text-neuro-orange" />
                <span className="text-slate-200">Polícia Federal e CFP</span>
              </div>

              <div className="flex items-center gap-2.5 glass-dark px-4 py-3 rounded-xl border border-white/5">
                <Clock className="w-4 h-4 text-neuro-orange" />
                <span className="text-slate-200">Casos reais e aplicação prática</span>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4"
            >
              <button
                onClick={() => openModal("hero-cta")}
                className="group relative px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-neuro-orange to-orange-600 hover:from-orange-500 hover:to-orange-700 transition-all duration-300 shadow-[0_0_30px_rgba(242,140,40,0.3)] hover:shadow-[0_0_40px_rgba(242,140,40,0.5)] text-center flex items-center justify-center gap-3"
              >
                <span>Quero garantir minha pré-inscrição</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <a
                href="#informacoes"
                className="px-8 py-4 rounded-xl text-base font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 text-center"
              >
                Ver informações práticas
              </a>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-sm text-orange-300 font-medium"
            >
              ⚠️ Turma limitada a 10 alunos para garantir a qualidade do conteúdo
              e das supervisões presenciais e individualizadas.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center justify-center min-h-[460px] lg:min-h-[560px] px-4 lg:px-0"
          >
            <div className="relative w-full max-w-[520px]">
              <div className="absolute -inset-4 bg-gradient-to-br from-neuro-orange/20 via-neuro-blue/20 to-transparent rounded-[2rem] blur-2xl" />

              <div className="relative rounded-[2rem] overflow-hidden border border-orange-500/20 ring-1 ring-orange-400/10 bg-slate-900 shadow-2xl">
                <img
                  src="/images/marilia-800.webp"
                  srcSet="/images/marilia-480.webp 480w, /images/marilia-800.webp 800w, /images/marilia-1120.webp 1120w"
                  sizes="(max-width: 1023px) 520px, 42vw"
                  width={1120}
                  height={1402}
                  loading="eager"
                  fetchPriority="high"
                  alt="Marília Karine dos Santos, neuropsicóloga e responsável pela formação"
                  className="w-full h-[560px] object-cover object-center"
                />

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent p-6">
                  <div className="flex items-center gap-2 text-orange-300 text-sm font-semibold mb-2">
                    <ShieldCheck className="w-4 h-4" />
                    Formação NeuroPsiEdu
                  </div>

                  <h2 className="text-2xl font-bold text-white">
                    Marília Karine dos Santos
                  </h2>

                  <p className="text-slate-300 text-sm mt-1">
                    Neuropsicóloga · Supervisão prática individualizada
                  </p>
                </div>
              </div>

              <div className="absolute -top-5 -left-4 glass-dark border border-white/10 rounded-2xl px-4 py-3 shadow-xl">
                <p className="text-xs text-slate-400">Certificação</p>
                <p className="text-white font-bold">138 horas</p>
              </div>

              <div className="absolute top-24 -right-4 glass-dark border border-white/10 rounded-2xl px-4 py-3 shadow-xl">
                <p className="text-xs text-slate-400">Supervisão</p>
                <p className="text-white font-bold">120 horas</p>
              </div>

              <div className="absolute -bottom-5 left-8 glass-dark border border-orange-500/20 rounded-2xl px-4 py-3 shadow-xl">
                <p className="text-xs text-slate-400">Vagas</p>
                <p className="text-orange-300 font-bold">Apenas 10</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
