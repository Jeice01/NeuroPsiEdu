"use client";

import { motion } from "framer-motion";
import {
  Award,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useManuseioArmaLead } from "./ManuseioArmaLeadContext";

export function ManuseioArmaAbout() {
  const { openModal } = useManuseioArmaLead();

  const points = [
    "Atuação em avaliação psicológica e neuropsicológica.",
    "Experiência na condução e supervisão de processos avaliativos.",
    "Didática voltada à prática, integração de dados e raciocínio clínico.",
    "Autoridade institucional NeuroPsiEdu na formação de psicólogos.",
  ];

  return (
    <section
      id="quem-conduz"
      className="relative py-24 bg-slate-950 text-white overflow-hidden border-t border-white/5"
    >
      <div className="absolute top-1/4 right-1/4 w-[520px] h-[520px] bg-neuro-blue/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[420px] h-[420px] bg-orange-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative mx-auto w-full max-w-[500px]"
          >
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-neuro-orange/20 via-neuro-blue/20 to-transparent blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-orange-500/20 bg-slate-900 shadow-2xl ring-1 ring-orange-400/10">
              <img
                src="/images/foto-marilia-jaleco.jpeg"
                alt="Marília Karine dos Santos, neuropsicóloga"
                className="h-[560px] w-full object-cover object-center"
              />

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent p-6">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-orange-300">
                  <ShieldCheck className="h-4 w-4" />
                  NeuroPsiEdu
                </p>

                <h3 className="mt-2 text-2xl font-bold text-white">
                  Marília Karine dos Santos
                </h3>

                <p className="mt-1 text-sm text-slate-300">
                  Neuropsicóloga · Responsável pela formação
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-7"
          >
            <span className="inline-flex items-center gap-2 glass-dark px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-orange-300 border border-orange-500/20">
              <Sparkles className="w-4 h-4" />
              Quem conduz
            </span>

            <div className="space-y-4">
              <h2 className="font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-tight">
                Orientação técnica com quem vive a prática da avaliação.
              </h2>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light">
                A formação é conduzida por Marília Karine dos Santos, profissional
                ligada à NeuroPsiEdu, com experiência em avaliação psicológica,
                neuropsicológica e supervisão de processos avaliativos.
              </p>

              <p className="text-slate-400 text-base leading-relaxed font-light">
                O objetivo é oferecer uma experiência formativa com clareza,
                método e acompanhamento, conectando teoria, instrumentos,
                responsabilidade ética e análise prática dos resultados.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-dark rounded-2xl border border-white/10 p-5">
                <GraduationCap className="w-6 h-6 text-cyan-400" />
                <p className="mt-3 text-2xl font-black text-white">18h</p>
                <p className="mt-1 text-sm text-slate-400">
                  Curso presencial - 1ª etapa da formação
                </p>
              </div>

              <div className="glass-dark rounded-2xl border border-white/10 p-5">
                <CheckCircle2 className="w-6 h-6 text-neuro-orange" />
                <p className="mt-3 text-2xl font-black text-white">120h</p>
                <p className="mt-1 text-sm text-slate-400">
                  Supervisão presencial e individualizada
                </p>
              </div>

              <div className="glass-dark rounded-2xl border border-white/10 p-5">
                <Award className="w-6 h-6 text-violet-400" />
                <p className="mt-3 text-2xl font-black text-white">138h</p>
                <p className="mt-1 text-sm text-slate-400">
                  Aulas teóricas + supervisão
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {points.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-neuro-orange mt-0.5 shrink-0" />
                  <p className="text-sm leading-relaxed text-slate-300">
                    {point}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => openModal("about-cta")}
              className="rounded-xl bg-gradient-to-r from-neuro-orange to-orange-600 px-8 py-4 text-base font-bold text-white shadow-[0_0_30px_rgba(242,140,40,0.25)] transition-all duration-300 hover:from-orange-500 hover:to-orange-700"
            >
              Quero falar com a equipe
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
